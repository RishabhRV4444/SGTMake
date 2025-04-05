import { NextResponse } from "next/server";
import { z } from "zod";
import {db} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { error404 } from "@/lib/utils";
import { authOptions } from "@/lib/auth";
// ----------------------
// Zod Schemas
// ----------------------
const fileSchema = z.object({
  url: z.string().optional(),
  public_id: z.string().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
  size: z.number().optional(),
});

const baseSchema = z.object({
  serviceType: z.enum(["cnc-machining", "laser-cutting", "designing"]),
  material: z.string().min(1, "Material is required"),
  surfaceFinish: z.boolean(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  remarks: z.string().optional(),
  file: fileSchema.optional(),
});

const cncMachiningSchema = baseSchema.extend({
  tolerance: z.string(),
  threadingRequired: z.boolean(),
});

const laserCuttingSchema = baseSchema.extend({
  thickness: z.string(),
  cutType: z.enum(["standard", "engraving", "marking"]),
});

const designingSchema = baseSchema.extend({
  designType: z.enum(["2d", "3d"]),
  revisions: z.number(),
});

// ----------------------
// Type Inference from Schemas
// ----------------------
type BaseFormData = z.infer<typeof baseSchema>;
type CNCFormData = z.infer<typeof cncMachiningSchema>;
type LaserFormData = z.infer<typeof laserCuttingSchema>;
type DesignFormData = z.infer<typeof designingSchema>;

// Union type for all supported forms
type ServiceFormData = CNCFormData | LaserFormData | DesignFormData;

// ----------------------
// API Route Handler
// ----------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();
     const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
          return error404("Missing user ID in the session.", { user: null });
        }
    let validatedData: ServiceFormData;

    // Dynamically validate based on serviceType
    switch (body.serviceType) {
      case "cnc-machining":
        validatedData = cncMachiningSchema.parse(body);
        break;
      case "laser-cutting":
        validatedData = laserCuttingSchema.parse(body);
        break;
      case "designing":
        validatedData = designingSchema.parse(body);
        break;
      default:
        throw new Error(`Unsupported serviceType: ${body.serviceType}`);
    }

    const fileData = validatedData.file || {};

    const service = await db.service.create({
      data: {
        userId: session.user.id, // Replace with real user id from session/auth
        fileUrl: fileData.url,
        filePublicId: fileData.public_id,
        formDetails: {
          type: validatedData.serviceType,
          material: validatedData.material,
          surfaceFinish: validatedData.surfaceFinish,
          quantity: validatedData.quantity,
          remarks: validatedData.remarks || "",

        },
      },
    });

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error("Error submitting form:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: "Error submitting form" }, { status: 500 });
  }
}
