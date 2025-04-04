import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import { Readable } from "stream"

// Define allowed file types and max size
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "model/step",
  "application/step",
]

// Helper function to convert File to buffer
async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, Excel, Word, images, and STEP files are allowed." },
        { status: 400 },
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 100MB limit" }, { status: 400 })
    }

    const buffer = await fileToBuffer(file)

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder:  "services",
          resource_type: "auto", // Automatically detect the resource type
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error)
            resolve(NextResponse.json({ error: "Error uploading file to Cloudinary" }, { status: 500 }))
          } else {
            resolve(
              NextResponse.json({
                url: result?.secure_url,
                public_id: result?.public_id,
                name: file.name,
                type: file.type,
                size: file.size,
              }),
            )
          }
        },
      )

      // Create a readable stream from the buffer and pipe it to the upload stream
      const readableStream = new Readable()
      readableStream.push(buffer)
      readableStream.push(null)
      readableStream.pipe(uploadStream)
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 })
  }
}

