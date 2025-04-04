// import { NextResponse } from "next/server"
// import { z } from "zod"
// import {db} from "@/lib/prisma"

// // Define the base schema for validation
// const baseSchema = z.object({
//   serviceType: z.enum(["cnc-machining", "laser-cutting", "designing"]),
//   material: z.string().min(1, "Material is required"),
//   surfaceFinish: z.boolean(),
//   quantity: z.number().min(1, "Quantity must be at least 1"),
//   remarks: z.string().optional(),
//   file: z
//     .object({
//       url: z.string().optional(),
//       public_id: z.string().optional(),
//       name: z.string().optional(),
//       type: z.string().optional(),
//       size: z.number().optional(),
//     })
//     .optional(),
// })

// // Service-specific schema extensions
// const cncMachiningSchema = baseSchema.extend({
//   tolerance: z.string().min(1, "Tolerance is required"),
//   threadingRequired: z.boolean(),
// })

// const laserCuttingSchema = baseSchema.extend({
//   thickness: z.string().min(1, "Thickness is required"),
//   cutType: z.enum(["standard", "engraving", "marking"]),
// })

// const designingSchema = baseSchema.extend({
//   designType: z.enum(["2d", "3d"]),
//   revisions: z.number().min(1, "Revisions must be at least 1"),
// })

// export async function POST(request: Request) {
//   try {
//     const body = await request.json()

//     // Determine which schema to use based on service type
//     let validatedData: z.infer<typeof cncMachiningSchema | typeof laserCuttingSchema | typeof designingSchema>
//     switch (body.serviceType) {
//       case "cnc-machining":
//         validatedData = cncMachiningSchema.parse(body)
//         break
//       case "laser-cutting":
//         validatedData = laserCuttingSchema.parse(body)
//         break
//       case "designing":
//         validatedData = designingSchema.parse(body)
//         break
//       default:
//         validatedData = baseSchema.parse(body)
//     }

//     // Extract file data
//     const fileData = validatedData.file || {}

//     // Create a new record in the database using the Service model
//     const service = await db.service.create({
//       data: {
//         // For demo purposes, using a fixed userId. In a real app, this would come from authentication
//         userId: "user123",
//         fileName: fileData.name,
//         fileUrl: fileData.url,
//         fileType: fileData.type,
//         filePublicId: fileData.public_id,
//         // Store all manufacturing form details in the formDetails JSON field
//         formDetails: {
//           type: validatedData.serviceType,
//           material: validatedData.material,
//           surfaceFinish: validatedData.surfaceFinish,
//           quantity: validatedData.quantity,
//           remarks: validatedData.remarks || "",

//           // Service-specific fields
//           ...(validatedData.serviceType === "cnc-machining" && {
//             tolerance: (validatedData as z.infer<typeof cncMachiningSchema>).tolerance,
//             threadingRequired: (validatedData as z.infer<typeof cncMachiningSchema>).threadingRequired,
//           }),

//           ...(validatedData.serviceType === "laser-cutting" && {
//             thickness: (validatedData as z.infer<typeof laserCuttingSchema>).thickness,
//             cutType: (validatedData as z.infer<typeof laserCuttingSchema>).cutType,
//           }),

//           ...(validatedData.serviceType === "designing" && {
//             designType: (validatedData as z.infer<typeof designingSchema>).designType,
//             revisions: (validatedData as z.infer<typeof designingSchema>).revisions,
//           }),
//         },
//       },
//     })

//     return NextResponse.json({ success: true, data: service })
//   } catch (error) {
//     console.error("Error submitting form:", error)

//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ success: false, error: error.errors }, { status: 400 })
//     }

//     return NextResponse.json({ success: false, error: "Error submitting form" }, { status: 500 })
//   }
// }

