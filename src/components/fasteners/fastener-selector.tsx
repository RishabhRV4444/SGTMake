"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Loader2, Minus, Plus } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// Define the base fastener type
export interface FastenerOption {
  id: string
  name: string
  price?: number
}

// Define the configuration for different fastener types
export interface FastenerConfig {
  type: string
  image: string
  basePrice: number
  options: {
    [key: string]: {
      label: string
      options: FastenerOption[]
      required?: boolean
      multiSelect?: boolean
      helpText?: string
    }
  }
}

// Define the selected options type
export interface SelectedFastenerOptions {
  [key: string]: string | string[] | number
}

interface FastenerSelectorProps {
  config: FastenerConfig
  activeCategory: string
  onAddToCart: (formData: any) => Promise<void>
}

export default function FastenerSelector({ config, activeCategory, onAddToCart }: FastenerSelectorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // Dynamically build the Zod schema based on the config
  const buildValidationSchema = () => {
    const schemaFields: Record<string, any> = {
      quantity: z.number().min(1, "Quantity must be at least 1").max(100, "Maximum quantity is 100"),
      remarks: z.string().optional(),
    }

    // Add validation for each required option
    Object.entries(config.options).forEach(([key, option]) => {
      if (option.required) {
        schemaFields[key] = z.string().min(1, `${option.label} is required`)
      } else {
        schemaFields[key] = z.string().optional()
      }
    })

    return z.object(schemaFields)
  }

  const validationSchema = buildValidationSchema()

  // Set up react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      quantity: 1,
      remarks: "",
    },
  })

  // Reset form when category changes
  useEffect(() => {
    reset({
      quantity: 1,
      remarks: "",
    })
  }, [activeCategory, reset])

  // Calculate the total price based on selections
  const calculateTotalPrice = (formData: any): number => {
    let total = config.basePrice

    // Add price modifiers from selected options
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "quantity") {
        total *= Number(value)
        return
      }

      if (key === "remarks") return

      const optionConfig = config.options[key]
      if (!optionConfig) return

      const option = optionConfig.options.find((o) => o.id === value)
      if (option && option.price) total += option.price
    })

    return total
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(100, quantity + change))
    setQuantity(newQuantity)
    setValue("quantity", newQuantity)
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const totalPrice = calculateTotalPrice(data)

      // Add total price to the form data
      const formData = {
        ...data,
        totalPrice,
        fastenerType: config.type,
        image: config.image,
      }

      await onAddToCart(formData)
      toast.success(`${config.type} added to cart`)

      // Reset form after successful submission
      reset({
        quantity: 1,
        remarks: "",
      })
      setQuantity(1)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add item to cart")
    } finally {
      setIsLoading(false)
    }
  }

  const formValues: Record<string, any> = watch()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Render each option category */}
      <AnimatePresence mode="wait">
        {Object.entries(config.options).map(([key, optionConfig]) => {
          if (key === "remarks") return null // Handle remarks separately

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">
                  {optionConfig.label}
                  {optionConfig.required && <span className="text-red-500 ml-1">*</span>}
                </h2>
                {optionConfig.helpText && <span className="text-xs text-gray-500">{optionConfig.helpText}</span>}
              </div>

              <div className="flex flex-wrap gap-2">
                {optionConfig.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`px-3 py-2 border rounded-md transition text-sm ${
                      formValues[key] === option.id
                        ? "bg-orange-500 text-white border-orange-500"
                        : "hover:bg-gray-100 border-gray-300"
                    }`}
                    onClick={() => setValue(key, option.id, { shouldValidate: true })}
                  >
                    {option.name}
                  </button>
                ))}
              </div>

              {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]?.message as string}</p>}
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Quantity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        className="space-y-2"
      >
        <h2 className="text-lg font-medium">Quantity (pcs)</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 border rounded-md hover:bg-gray-100"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            className="px-4 py-2 border rounded w-16 text-center"
            value={quantity}
            {...register("quantity", { valueAsNumber: true })}
            onChange={(e) => {
              const value = Number.parseInt(e.target.value)
              if (!isNaN(value) && value >= 1 && value <= 100) {
                setQuantity(value)
                setValue("quantity", value)
              }
            }}
            min="1"
            max="100"
          />
          <button
            type="button"
            className="p-2 border rounded-md hover:bg-gray-100"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= 100}
          >
            <Plus size={16} />
          </button>
        </div>
        {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message as string}</p>}
      </motion.div>

      {/* Remarks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.3 }}
        className="space-y-2"
      >
        <h2 className="text-lg font-medium">Remarks</h2>
        <textarea className="w-full p-3 border rounded-md" placeholder="Write here" rows={4} {...register("remarks")} />
      </motion.div>

      {/* Add to Cart Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.4 }}
      >
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-4 py-2 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Adding...
            </span>
          ) : (
            "Add to Cart"
          )}
        </button>
      </motion.div>
    </form>
  )
}
