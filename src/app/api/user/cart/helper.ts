import { db } from "@/lib/prisma";

type CreateCartProps = {
  userId?: string;
  guestUserId?: string;
};

type CreateCartItemProps = {
  quantity: number;
  color: string | null;
  productId: string;
  cartId: string;
};

type UpdateCartWithCartItemProps = {
  cartId: string;
  cartItems: {
    id: string;
    productId: string;
    quantity: number;
    color: string | null;
    cartId: string;
  }[];
};

type CreateCartWithCartItemsProps = {
  userId: string;
  cartItems: UpdateCartWithCartItemProps["cartItems"];
};

async function createGuestUser(expirationDate: Date) {
  return await db.guestUser.create({
    data: {
      expirationDate,
    },
  });
}

async function createCart({ userId, guestUserId }: CreateCartProps) {
  return await db.cart.create({
    data: {
      guestUserId,
      userId,
    },
  });
}

async function createCartWithCartItems({
  userId,
  cartItems,
}: CreateCartWithCartItemsProps) {
  return await db.cart.create({
    data: {
      userId,
      cartItems: {
        createMany: {
          data: cartItems.map((cartItem) => ({
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            color: cartItem.color,
          })),
        },
      },
    },
  });
}

async function createCartItem({
  quantity,
  color,
  productId,
  cartId,
}: CreateCartItemProps) {
  return await db.cartItem.create({
    data: {
      quantity,
      color,
      productId,
      cartId,
    },
  });
}

async function findGuestUser(guestId: string) {
  return await db.guestUser.findUnique({
    where: {
      id: guestId,
    },
    include: {
      cart: {
        include: {
          cartItems: true,
        },
      },
    },
  });
}

async function findGuestUserWithProduct(guestId: string) {
  return await db.guestUser.findUnique({
    where: {
      id: guestId,
    },
    include: {
      cart: {
        include: {
          cartItems: {
            include: {
              Product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

async function findCart(userId: string) {
  return await db.cart.findUnique({
    where: {
      userId,
    },
    include: {
      cartItems: true, // Use the correct field name from the schema
    },
  });
}

async function findCartWithProduct(userId: string) {
  return await db.cart.findUnique({
    where: {
      userId,
    },
    include: {
      cartItems: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });
}
async function updateCartWithCartItem({
  cartId,
  cartItems,
}: UpdateCartWithCartItemProps) {
  return await db.cart.update({
    where: { id: cartId },
    data: { cartItems: { set: cartItems } },
  });
}

async function findCartItem(itemId: string) {
  return await db.cartItem.findUnique({
    where: {
      id: itemId,
    },
  });
}

async function increaseQuantity(id: string) {
  return await db.cartItem.update({
    where: {
      id,
    },
    data: {
      quantity: {
        increment: 1,
      },
    },
  });
}

async function updateQuantity(itemId: string, quantity: number) {
  return await db.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity,
    },
  });
}

async function deleteCart(cartId: string) {
  return await db.cart.delete({ where: { id: cartId } });
}

async function deleteCartItem(itemId: string) {
  return await db.cartItem.delete({
    where: {
      id: itemId,
    },
  });
}

export {
  createGuestUser,
  createCart,
  createCartWithCartItems,
  createCartItem,
  findGuestUser,
  findGuestUserWithProduct,
  findCart,
  findCartWithProduct,
  updateCartWithCartItem,
  findCartItem,
  increaseQuantity,
  updateQuantity,
  deleteCart,
  deleteCartItem,
};
