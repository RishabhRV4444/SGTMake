"use client"
import { useState } from "react"
import type React from "react"

import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_FILE_TYPES = ["application/pdf", "application/vnd.ms-excel", "application/msword", "image/", "model/step"]

const formSchema = z.object({
  chemistry: z.enum(["NCM", "NCA", "LifePO4", "LIPO"]),
  cellBrand: z.string().min(1, "Cell Brand is required"),
  seriesConfig: z.string().min(1, "Series Config is required"),
  parallelConfig: z.string().min(1, "Parallel Config is required"),
  normalDischarge: z.string().min(1, "Normal Discharge is required"),
  peakDischarge: z.string().min(1, "Peak Discharge is required"),
  charging: z.string().min(1, "Charging is required"),
  lifeCycle: z.string().min(1, "Life Cycle is required"),
  packVoltage: z.string().min(1, "Pack Voltage is required"),
  bmsChoice: z.string().min(1, "BMS Choice is required"),
  modulusCount: z.string().min(1, "Modulus Count is required"),
  dimensions: z.object({
    H: z.string().min(1, "Height is required"),
    W: z.string().min(1, "Width is required"),
    L: z.string().min(1, "Length is required"),
  }),
  additionalInfo: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function BatteryPackForm() {
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })
  const session = useSession();

  const FormFields = [
    { name: "cellBrand", label: "Cell Brand" },
    { name: "seriesConfig", label: "Series Config" }, 
    { name: "parallelConfig", label: "Parallel Config" },
    { name: "normalDischarge", label: "Normal Discharge" },
    { name: "peakDischarge", label: "Peak Discharge" },
    { name: "charging", label: "Charging" },
    { name: "lifeCycle", label: "Life Cycle" },
    { name: "packVoltage", label: "Pack Voltage" },
    { name: "bmsChoice", label: "BMS Choice" },
    { name: "modulusCount", label: "No. of Modules" },
  ]
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0]

      // Check file type
      const isAllowedType = ALLOWED_FILE_TYPES.some(
        (type) => uploadedFile.type.includes(type) || (type.endsWith("/") && uploadedFile.type.startsWith(type)),
      )

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
      const response = await fetch("/api/service/battery-inquiry", {
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

      setFormStatus("success")
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Error submitting form")
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Battery Packs Inquiry</h1>

      {formStatus === "success" ? (
        <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-green-800 mb-2">Inquiry Submitted Successfully</h2>
          <p className="text-green-700 mb-4">Thanks {session.data?.user?.name } for your inquiry. We will get back to you soon.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Submit Another Inquiry
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
              accept=".pdf,.xls,.xlsx,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.stp"
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
                <p className="text-gray-600">Uploading file to Cloudinary...</p>
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
              <p className="mt-2 text-sm text-gray-500">Supported formats: PDF, Excel, Word, Images, STP (Max 100MB)</p>
            )}
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <label className="block font-medium">Chemistry</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {["NCM", "NCA", "LifePO4", "LIPO"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`px-6 py-3 border rounded-md text-sm bg-[#FAFAFA] ${watch("chemistry") === type ? "bg-orange-500 text-white" : ""}`}
                      onClick={() => {
                        setValue("chemistry", type as FormData["chemistry"])
                        trigger("chemistry")
                      }}
                      disabled={formStatus === "submitting"}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errors.chemistry && <p className="text-red-500 text-sm">{errors.chemistry.message}</p>}
              </div>

              {FormFields.map((field) => (
                <div key={field.name}>
                  <label className="block font-medium">{field.label}</label>
                  <input
                    {...register(field.name as keyof FormData)}
                    className="w-full border p-3 rounded-md mt-1 bg-[#FAFAFA]"
                    placeholder="Write here"
                    disabled={formStatus === "submitting"}
                  />
                  {errors[field.name as keyof FormData] && (
                    <p className="text-red-500 text-sm">{errors[field.name as keyof FormData]?.message}</p>
                  )}
                </div>
              ))}

              {/* Dimensions */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <label className="block font-medium mt-3">Dimensions (mm)</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {["H", "W", "L"].map((dim) => (
                    <div key={dim} className="flex flex-col">
                      <input
                        {...register(`dimensions.${dim}` as `dimensions.${keyof FormData["dimensions"]}`)}
                        className="border p-2 rounded-md max-w-[7rem] w-full bg-[#FAFAFA]"
                        placeholder={dim}
                        disabled={formStatus === "submitting"}
                      />
                      {errors.dimensions?.[dim as keyof FormData["dimensions"]] && (
                        <p className="text-red-500 text-sm">
                          {errors.dimensions[dim as keyof FormData["dimensions"]]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4">
              <label className="block font-medium">Additional Information</label>
              <textarea
                {...register("additionalInfo")}
                className="w-full border p-2 rounded-md mt-1 bg-[#FAFAFA]"
                placeholder="Write here"
                rows={3}
                disabled={formStatus === "submitting"}
              ></textarea>
            </div>

            {errorMessage && formStatus === "error" && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                <p className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {errorMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={formStatus === "submitting" || fileUploadStatus === "uploading" || !uploadedFileData}
            >
              {formStatus === "submitting" ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

