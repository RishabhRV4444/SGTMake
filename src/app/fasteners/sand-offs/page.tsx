"use client"

import { usePathname } from "next/navigation"
import FastenerSelector from "@/components/fasteners/fastener-selector"
import { sandOffsConfig } from "@/lib/fastener-configs"
import { addFastenerToCart } from "@/lib/fastener-service"

export default function SandOffsPage() {
  const pathname = usePathname()
  const activeCategory = pathname.split("/").pop() || ""

  const handleAddToCart = async (formData: any) => {
    await addFastenerToCart(formData)
  }

  return <FastenerSelector config={sandOffsConfig} activeCategory={activeCategory} onAddToCart={handleAddToCart} />
}
