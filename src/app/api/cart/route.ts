import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  createCart,
  createCartItem,
  createGuestUser,
  findCart,
  findGuestUser,
  findCartItem,
  increaseQuantity,
  updateQuantity,
  deleteCartItem,
  createCartWithCartItems,
  deleteCart,
  findCartWithProduct,
  findGuestUserWithProduct,
  updateCartWithCartItem,
} from "./helper"
import { error400, error500, getExpireDate, success200 } from "@/lib/utils"
import { z } from "zod"
import { getImageThumbnail, makeUrl } from "@/lib/cart-utils"


// Define validation schemas
const postCartItemSchema = z.object({
  productId: z.string().optional(), // Make productId optional
  quantity: z.number().min(1).max(100),
  color: z.string().nullable(),
  customProduct: z.record(z.any()).optional(),
})

const patchCartItemSchema = z.object({
  itemId: z.string(),
  quantity: z.number().min(1).max(100),
})

type PostBody = z.infer<typeof postCartItemSchema>
type PatchBody = z.infer<typeof patchCartItemSchema>

// Modify the POST function to better handle custom products
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()

    // Validate the request body
    try {
      postCartItemSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return error400("Invalid data format: " + validationError.errors.map((e) => e.message).join(", "), {
          item: null,
        })
      }
      return error400("Invalid data format.", { item: null })
    }

    // Ensure customProduct has all required fields for fasteners
    if (body.customProduct) {
      // Make sure customProduct has all required fields
      if (!body.customProduct.title) {
        body.customProduct.title = `Custom ${body.customProduct.options?.fastenerType || "Fastener"}`
      }

      if (!body.customProduct.basePrice && body.customProduct.options?.totalPrice) {
        body.customProduct.basePrice = body.customProduct.options.totalPrice
      }

      if (!body.customProduct.offerPrice && body.customProduct.options?.totalPrice) {
        body.customProduct.offerPrice = body.customProduct.options.totalPrice
      }

      if (!body.customProduct.image && body.customProduct.options?.image) {
        body.customProduct.image = body.customProduct.options.image
      }
    }

    // Handle guest user case
    if (!session || !session.user || !session.user.id) {
      const guestId = req.cookies.get("guest-id")?.value
      if (!guestId) {
        const newGuestUser = await createGuestUser(getExpireDate())
        const newGuestCart = await createCart({ guestUserId: newGuestUser.id })

        // Create cart item with custom product if provided
        await createCartItem({
          quantity: body.quantity,
          color: body.color,
          productId: body.customProduct ? undefined : body.productId, // Don't use productId for custom products
          cartId: newGuestCart.id,
          customProduct: body.customProduct,
        })

        const res = success200({ item: {} })
        res.cookies.set("guest-id", newGuestUser.id)
        return res
      } else {
        const guestUser = await findGuestUser(guestId)
        if (!guestUser) {
          const res = error400("Invalid guest user ID in the cookie.", {
            item: null,
          })
          res.cookies.delete("guest-id")
          return res
        }

        if (!guestUser.cart) {
          const newGuestCart = await createCart({ guestUserId: guestUser.id })
          await createCartItem({
            quantity: body.quantity,
            color: body.color,
            productId: body.customProduct ? undefined : body.productId, // Don't use productId for custom products
            cartId: newGuestCart.id,
            customProduct: body.customProduct,
          })
          return success200({ item: {} })
        }

        // For fasteners (custom products), always create a new item
        if (body.customProduct) {
          await createCartItem({
            quantity: body.quantity,
            color: body.color,
            productId: undefined, // Don't use productId for custom products
            cartId: guestUser.cart.id,
            customProduct: body.customProduct,
          })
          return success200({ item: {} })
        }

        // For regular products, check if it already exists
        const existingItem = guestUser.cart.cartItems.find(
          (item) => item.productId === body.productId && item.color === body.color,
        )

        if (existingItem) {
          // If the same product exists, increase the quantity
          if (existingItem.quantity >= 10) {
            return error400("Maximum quantity of 10 reached for this item!", {
              item: null,
            })
          }
          await increaseQuantity(existingItem.id)
        } else {
          // Otherwise, create a new cart item
          await createCartItem({
            quantity: body.quantity,
            color: body.color,
            productId: body.productId,
            cartId: guestUser.cart.id,
          })
        }
      }
      return success200({ item: {} })
    }

    // Handle logged-in user case
    const existingCart = await findCart(session.user.id)

    if (!existingCart) {
      const cart = await createCart({ userId: session.user.id })
      await createCartItem({
        quantity: body.quantity,
        color: body.color,
        productId: body.customProduct ? undefined : body.productId, // Don't use productId for custom products
        cartId: cart.id,
        customProduct: body.customProduct,
      })
      return success200({ item: {} })
    }

    // For fasteners (custom products), always create a new item
    if (body.customProduct) {
      await createCartItem({
        quantity: body.quantity,
        color: body.color,
        productId: undefined, // Don't use productId for custom products
        cartId: existingCart.id,
        customProduct: body.customProduct,
      })
      return success200({ item: {} })
    }

    // For regular products, check if it already exists
    const existingItem = existingCart.cartItems.find(
      (item) => item.productId === body.productId && item.color === body.color,
    )

    if (existingItem) {
      // If the same product exists, increase the quantity
      if (existingItem.quantity >= 10) {
        return error400("Maximum quantity of 10 reached for this item!", {
          item: null,
        })
      }
      await increaseQuantity(existingItem.id)
    } else {
      // Otherwise, create a new cart item
      await createCartItem({
        quantity: body.quantity,
        color: body.color,
        productId: body.productId,
        cartId: existingCart.id,
      })
    }

    return success200({ item: {} })
  } catch (error) {
    console.log(error)
    return error500({ item: null })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate the request body
    try {
      patchCartItemSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return error400("Invalid data format: " + validationError.errors.map((e) => e.message).join(", "), {
          item: null,
        })
      }
      return error400("Invalid data format.", { item: null })
    }

    const cartItem = await findCartItem(body.itemId)

    if (!cartItem) {
      return error400("No matching product found in your cart.", {
        item: null,
      })
    }

    if (body.quantity > 10) {
      return error400("Maximum quantity of 10 reached for this item!", {
        item: null,
      })
    }

    if (body.quantity < 1) {
      return error400("Minimum quantity is 1!", { item: null })
    }

    await updateQuantity(body.itemId, body.quantity)
    return success200({ item: {} })
  } catch (error) {
    console.log(error)
    return error500({ item: null })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const itemId = req.nextUrl.searchParams.get("itemId")

    if (!itemId) {
      return error400("Item ID missing from URL parameters.", {
        item: null,
      })
    }

    // Delete the cart item (works for both regular and custom products)
    const deletedItem = await deleteCartItem(itemId)

    if (!deletedItem) {
      return error400("No such item exists in your cart.", { item: null })
    }

    return success200({ item: {} })
  } catch (error) {
    console.log(error)
    return error500({ item: null })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const guestId = req.cookies.get("guest-id")?.value

    if (!session || !session.user || !session.user.id) {
      if (!guestId) {
        return success200({ item: [] })
      }

      const guestUser = await findGuestUserWithProduct(guestId)

      if (!guestUser || !guestUser.cart) {
        const res = error400("Invalid Guest ID.", { item: null })
        res.cookies.delete("guest-id")
        return res
      }

      const cartItemsArray = guestUser.cart.cartItems.map((cartItem) => {
        // Handle custom products (fasteners)
        if (cartItem.customProduct) {
          return {
            itemId: cartItem.id,
            pid: `custom-${cartItem.id}`, // Use the cartItem.id as a unique identifier
            title: cartItem.customProduct.title || `Custom Fastener`,
            image: cartItem.customProduct.image || "/placeholder.svg",
            basePrice: cartItem.customProduct.basePrice || 0,
            offerPrice: cartItem.customProduct.offerPrice || 0,
            color: null,
            quantity: cartItem.quantity,
            url: "/fasteners",
            customProduct: cartItem.customProduct,
          }
        }

        // Handle regular products
        return {
          itemId: cartItem.id,
          pid: cartItem.productId,
          slug: cartItem.product?.slug,
          title: cartItem.product?.title,
          image: getImageThumbnail({ images: cartItem.product?.images || [] }, cartItem.color),
          basePrice: cartItem.product?.basePrice,
          offerPrice: cartItem.product?.offerPrice,
          color: cartItem.color,
          quantity: cartItem.quantity,
          url: cartItem.product ? makeUrl(cartItem.product.slug, cartItem.productId, cartItem.color) : "",
        }
      })

      return success200({ item: cartItemsArray.reverse() })
    }

    const userId = session.user.id

    if (guestId) {
      // Retrieve the guest user and their cart
      const guestUser = await findGuestUser(guestId)

      if (guestUser && guestUser.cart) {
        // Retrieve the user's cart
        const userCart = await findCart(userId)

        if (userCart) {
          // Iterate over guest user's cart items and merge into the user's cart
          guestUser.cart.cartItems.forEach((guestCartItem) => {
            // For custom products, always add as new item
            if (guestCartItem.customProduct) {
              userCart.cartItems.push(guestCartItem)
              return
            }

            // For regular products, check if it exists
            const existingUserCartItem = userCart.cartItems.find(
              (userCartItem) =>
                userCartItem.productId === guestCartItem.productId && userCartItem.color === guestCartItem.color,
            )

            if (!existingUserCartItem) {
              // If the same product doesn't exist, add the guest cart item to the user's cart
              userCart.cartItems.push(guestCartItem)
            }
          })

          // Save the updated user's cart
          await updateCartWithCartItem({
            cartId: userCart.id,
            cartItems: userCart.cartItems,
          })
        } else {
          // If the user doesn't have a cart, create a new cart for them
          await createCartWithCartItems({
            userId,
            cartItems: guestUser.cart.cartItems,
          })
        }
        // Delete the guest user's cart
        await deleteCart(guestUser.cart.id)
      }
    }

    const cart = await findCartWithProduct(userId)

    if (!cart || cart.cartItems.length === 0) {
      const res = success200({ item: [] })
      res.cookies.delete("guest-id")
      return res
    }

    const cartItemsArray = cart.cartItems.map((cartItem) => {
      // Handle custom products (fasteners)
      if (cartItem.customProduct) {
        return {
          itemId: cartItem.id,
          pid: `custom-${cartItem.id}`, // Use the cartItem.id as a unique identifier
          title: cartItem.customProduct.title || `Custom Fastener`,
          image: cartItem.customProduct.image || "/placeholder.svg",
          basePrice: cartItem.customProduct.basePrice || 0,
          offerPrice: cartItem.customProduct.offerPrice || 0,
          color: null,
          quantity: cartItem.quantity,
          url: "/fasteners",
          customProduct: cartItem.customProduct,
        }
      }

      // Handle regular products
      return {
        itemId: cartItem.id,
        pid: cartItem.productId,
        slug: cartItem.product?.slug,
        title: cartItem.product?.title,
        image: getImageThumbnail({ images: cartItem.product?.images || [] }, cartItem.color),
        basePrice: cartItem.product?.basePrice,
        offerPrice: cartItem.product?.offerPrice,
        color: cartItem.color,
        quantity: cartItem.quantity,
        url: cartItem.product ? makeUrl(cartItem.product.slug, cartItem.productId, cartItem.color) : "",
      }
    })

    const res = success200({ item: cartItemsArray.reverse() })
    res.cookies.delete("guest-id")
    return res
  } catch (error) {
    console.log(error)
    return error500({ item: null })
  }
}


