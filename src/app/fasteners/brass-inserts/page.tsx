"use client"

import { usePathname } from "next/navigation"
import FastenerSelector from "@/components/fasteners/fastener-selector"
import { brassInsertConfig } from "@/lib/fastener-configs"
import { addFastenerToCart } from "@/lib/fastener-service"

export default function BrassInsertsPage() {
  const pathname = usePathname()
  const activeCategory = pathname.split("/").pop() || ""

  const handleAddToCart = async (formData: any) => {
    await addFastenerToCart(formData)
  }

  return <FastenerSelector config={brassInsertConfig} activeCategory={activeCategory} onAddToCart={handleAddToCart} />
}
