"use client"
import { useState } from "react"
import type React from "react"

import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useSession } from "next-auth/react"

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
  "image/jpg",
  "text/csv",
]

// Define the form schema
const formSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
})

type FormData = z.infer<typeof formSchema>

export default function WiringHarnessForm() {
  const [file, setFile] = useState<File | null>(null)
  const [fileUploadStatus, setFileUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [uploadedFileData, setUploadedFileData] = useState<{
    url: string
    public_id?: string
    name: string
    type: string
    size?: number
  } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submittedServiceId, setSubmittedServiceId] = useState<string | null>(null)

  const session = useSession()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      description: "",
    },
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0]

      // Check file type
      console.log(uploadedFile.type)
      const isAllowedType = ALLOWED_FILE_TYPES.includes(uploadedFile.type)

      if (!isAllowedType || uploadedFile.size > MAX_FILE_SIZE) {
        setErrorMessage("Invalid file type or size exceeds 100MB")
        return
      }

      setFile(uploadedFile)
      setFileUploadStatus("uploading")
      setErrorMessage(null)

      // Upload the file to Cloudinary
      try {
        const formData = new FormData()
        formData.append("file", uploadedFile)

        const response = await fetch("/api/service/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Error uploading file")
        }

        const data = await response.json()
        setUploadedFileData({
          url: data.url,
          public_id: data.public_id,
          name: data.name,
          type: data.type,
          size: data.size,
        })
        setFileUploadStatus("success")
      } catch (error) {
        console.error("Error uploading file:", error)
        setFileUploadStatus("error")
        setErrorMessage(error instanceof Error ? error.message : "Error uploading file")
      }
    }
  }

  const onSubmit = async (data: FormData) => {
    setFormStatus("submitting")

    try {
      const response = await fetch("/api/service/wiring-harness", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          file: uploadedFileData,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error submitting form")
      }

      const result = await response.json()
      setSubmittedServiceId(result.data.id)
      setFormStatus("success")
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Error submitting form")
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header Image */}
      <div className="w-full h-48 md:h-64 mb-6 relative rounded-xl overflow-hidden">
        <Image
          src="/wireHarnessBanner.jpg"
          alt="Wiring Harness Header"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Wiring Harness</h1>
        </div>
      </div>

      {formStatus === "success" ? (
        <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-green-800 mb-2">
            Thanks {session.data?.user?.name || "for your order"}
          </h2>
          <p className="text-green-700 mb-2">We will get back to you soon with a quote.</p>
          {submittedServiceId && <p className="text-green-700 mb-4">Service ID: {submittedServiceId}</p>}
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Submit Another Order
          </button>
        </div>
      ) : (
        <>
          {/* File Upload */}
          <div className="border border-gray-300 h-56 md:h-96 rounded-xl text-center bg-[#FAFAFA] mb-6 flex flex-col items-center justify-center">
            <input
              type="file"
              id="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".docx,.pdf,.jpg,.jpeg,.png,.xls,.xlsx,.csv"
              disabled={fileUploadStatus === "uploading" || formStatus === "submitting"}
            />

            {fileUploadStatus === "idle" && (
              <label
                htmlFor="file"
                className="cursor-pointer flex items-center justify-center bg-orange-100 px-4 py-2 rounded-full text-orange-600 text-sm w-max"
              >
                <Upload className="w-5 h-5 mr-2" /> Upload Your File
              </label>
            )}

            {fileUploadStatus === "uploading" && (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                <p className="text-gray-600">Uploading file...</p>
              </div>
            )}

            {fileUploadStatus === "success" && (
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-gray-600 mb-2">File uploaded successfully</p>
                <p className="text-sm text-gray-500">{file?.name}</p>
                <button
                  onClick={() => {
                    setFile(null)
                    setFileUploadStatus("idle")
                    setUploadedFileData(null)
                  }}
                  className="mt-4 text-orange-600 underline text-sm"
                >
                  Upload a different file
                </button>
              </div>
            )}

            {fileUploadStatus === "error" && (
              <div className="flex flex-col items-center">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-red-600 mb-2">Error uploading file</p>
                <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
                <label
                  htmlFor="file"
                  className="cursor-pointer flex items-center justify-center bg-orange-100 px-4 py-2 rounded-full text-orange-600 text-sm w-max"
                >
                  <Upload className="w-5 h-5 mr-2" /> Try Again
                </label>
              </div>
            )}

            {fileUploadStatus === "idle" && !file && (
              <div className="mt-2 text-sm text-gray-500 max-w-md px-4">
                <p className="mb-2">Support uploading cable pictures, cable drawings, and cable specifications</p>
                <p>Supports .docx, .pdf, .jpg, .jpeg, .png, .xls, .xlsx, and .csv</p>
              </div>
            )}
          </div>

          {/* Our Process */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 ">Our Process</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 font-semibold">
              <div className="bg-[#FAFAFA] py-5 sm:py-10 rounded-lg border text-center ">
                <div className="flex justify-center mb-2">
                  <Image src="/customcable.png" alt="Custom Cables" width={60} height={60} />
                </div>
                <p className="text-sm">Custom Cables</p>
              </div>
              <div className=" py-5 sm:py-10 bg-[#FAFAFA] rounded-lg border text-center">
                <div className="flex justify-center mb-2">
                  <Image src="/confirmplan.png" alt="Confirm Plan" width={60} height={60} />
                </div>
                <p className="text-sm">Confirm Plan</p>
              </div>
              <div className=" py-5 sm:py-10 bg-[#FAFAFA] rounded-lg border text-center">
                <div className="flex justify-center mb-2">
                  <Image src="/production.png" alt="In Production" width={60} height={60} />
                </div>
                <p className="text-sm">In Production</p>
              </div>
              <div className=" py-5 sm:py-10 bg-[#FAFAFA] rounded-lg border text-center">
                <div className="flex justify-center mb-2">
                  <Image src="/transpot.png" alt="Transportation" width={60} height={60} />
                </div>
                <p className="text-sm">Transportation</p>
              </div>
              <div className=" py-5 sm:py-10 bg-[#FAFAFA] rounded-lg border text-center">
                <div className="flex justify-center mb-2">
                  <Image src="/delivered.png" alt="Delivered" width={60} height={60} />
                </div>
                <p className="text-sm">Delivered</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white p-6 rounded-lg border mb-6">
              <h2 className="text-xl font-semibold mb-4">Notes:</h2>
              <div className="mb-6 text-gray-700">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Upload the file in above section</li>
                  <li>.xls or .xlsx file is most preferred with images for proper understanding</li>
                  <li>Mention Connector names for left and right side in the description box</li>
                  <li>For only connector on one side and wire end at other side mention clearly</li>
                  <li>Mention wire length and color coding in the file you upload</li>
                  <li>Mention Quantity of set of harness required in description box</li>
                  <li>Type of electrical tape required on harness mention in Description box or in file</li>
                  <li>Extra requirement you can mention in the description box below</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Description Box</h3>
                <textarea
                  {...register("description")}
                  className="w-full border p-3 rounded-md bg-[#FAFAFA]"
                  rows={6}
                  placeholder="Describe your harness specification and other requirements here."
                ></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium mb-2">Quantity</h3>
                  <input
                    type="number"
                    {...register("quantity", { valueAsNumber: true })}
                    min="1"
                    className="w-24 border p-2 rounded-md bg-[#FAFAFA]"
                  />
                  {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                </div>

                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={formStatus === "submitting" || fileUploadStatus === "uploading"}
                >
                  {formStatus === "submitting" ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </div>

            {errorMessage && formStatus === "error" && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                <p className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {errorMessage}
                </p>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  )
}
