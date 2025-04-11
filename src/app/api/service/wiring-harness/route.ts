import { NextResponse } from "next/server"
import { z } from "zod"
import {db} from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { error404 } from "@/lib/utils";
import { authOptions } from "@/lib/auth";
// Define the schema for validation
const formSchema = z.object({
  leftConnector: z.object({
    housingPart: z.string().min(1, "Housing part is required"),
    terminalPartNumber: z.string().min(1, "Terminal part number is required"),
    additionalConnectors: z
      .array(
        z.object({
          housingPart: z.string().optional(),
          terminalPartNumber: z.string().optional(),
        }),
      )
      .optional(),
  }),
  wire: z.object({
    awg: z.string().min(1, "AWG is required"),
    length: z.string().min(1, "Length is required"),
    color: z.string().min(1, "Color is required"),
    twisted: z.boolean().optional(),
    customLength: z.string().optional(),
    customLengthUnit: z.string().optional(),
    customColor: z.string().optional(),
  }),
  rightConnector: z.object({
    housingPart: z.string().min(1, "Housing part is required"),
    terminalPartNumber: z.string().min(1, "Terminal part number is required"),
    additionalConnectors: z
      .array(
        z.object({
          housingPart: z.string().optional(),
          terminalPartNumber: z.string().optional(),
        }),
      )
      .optional(),
  }),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  additionalNotes: z.string().optional(),
  file: z
    .object({
      url: z.string().optional(),
      public_id: z.string().optional(),
      name: z.string().optional(),
      type: z.string().optional(),
      size: z.number().optional(),
    })
    .optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return error404("Missing user ID in the session.", { user: null });
    }
    // Validate the request body
    const validatedData = formSchema.parse(body)

    // Extract file data
    const fileData = validatedData.file || {}

    // Create a new record in the database using the Service model
    const service = await db.service.create({
      data: {
        // For demo purposes, using a fixed userId. In a real app, this would come from authentication
        userId: session.user.id,
        fileUrl: fileData.url,
        filePublicId: fileData.public_id,
        // Store all wiring harness form details in the formDetails JSON field
        formDetails: {
          type: "wiringHarness", // Identify the form type
          leftConnector: validatedData.leftConnector,
          wire: validatedData.wire,
          rightConnector: validatedData.rightConnector,
          quantity: validatedData.quantity,
          additionalNotes: validatedData.additionalNotes || "",
        },
      },
    })

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error("Error submitting form:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Error submitting form" }, { status: 500 })
  }
}

