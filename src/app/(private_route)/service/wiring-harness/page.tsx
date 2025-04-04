"use client"
import { useState } from "react"
import type React from "react"

import { Upload, CheckCircle, AlertCircle, Loader2, Plus, Minus } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"

// Define allowed file types and max size
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_FILE_TYPES = [ "image/"]

// Define the form schema
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
})

type FormData = z.infer<typeof formSchema>

// Housing part options
const housingPartOptions = [
  { value: "molex-mini-fit", label: "Molex Mini-Fit" },
  { value: "molex-micro-fit", label: "Molex Micro-Fit" },
  { value: "jst-xh", label: "JST XH" },
  { value: "jst-ph", label: "JST PH" },
  { value: "dupont", label: "Dupont" },
]

// Terminal part options
const terminalPartOptions = [
  { value: "crimp-female", label: "Crimp Female" },
  { value: "crimp-male", label: "Crimp Male" },
  { value: "solder-cup", label: "Solder Cup" },
  { value: "pcb-mount", label: "PCB Mount" },
]

// AWG options
const awgOptions = [
  { value: "10", label: "10 AWG" },
  { value: "12", label: "12 AWG" },
  { value: "14", label: "14 AWG" },
  { value: "16", label: "16 AWG" },
  { value: "18", label: "18 AWG" },
  { value: "20", label: "20 AWG" },
  { value: "22", label: "22 AWG" },
  { value: "24", label: "24 AWG" },
  { value: "26", label: "26 AWG" },
  { value: "28", label: "28 AWG" },
  { value: "30", label: "30 AWG" },
]

// Length options
const lengthOptions = [
  { value: "10cm", label: "10 cm" },
  { value: "20cm", label: "20 cm" },
  { value: "30cm", label: "30 cm" },
  { value: "50cm", label: "50 cm" },
  { value: "1m", label: "1 meter" },
  { value: "2m", label: "2 meters" },
  { value: "3m", label: "3 meters" },
  { value: "5m", label: "5 meters" },
  { value: "custom", label: "Custom Length" },
]

// Color options
const colorOptions = [
  { value: "black", label: "Black" },
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "white", label: "White" },
  { value: "custom", label: "Custom Color" },
]

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
  const [leftAdditionalConnectors, setLeftAdditionalConnectors] = useState<{ id: string }[]>([])
  const [rightAdditionalConnectors, setRightAdditionalConnectors] = useState<{ id: string }[]>([])

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leftConnector: {
        housingPart: "",
        terminalPartNumber: "",
        additionalConnectors: [],
      },
      wire: {
        awg: "",
        length: "",
        color: "",
        twisted: false,
        customColor: "",
      },
      rightConnector: {
        housingPart: "",
        terminalPartNumber: "",
        additionalConnectors: [],
      },
      quantity: 1,
      additionalNotes: "",
    },
  })

  const wireColor = watch("wire.color")
  const wireCustomColor = watch("wire.customColor")
  const wireTwisted = watch("wire.twisted")

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

  const addLeftConnector = () => {
    const newId = `left-${Date.now()}`
    setLeftAdditionalConnectors([...leftAdditionalConnectors, { id: newId }])
  }

  const addRightConnector = () => {
    const newId = `right-${Date.now()}`
    setRightAdditionalConnectors([...rightAdditionalConnectors, { id: newId }])
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
      <h1 className="text-3xl font-semibold mb-6">Wiring Harness</h1>

      {formStatus === "success" ? (
        <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-green-800 mb-2">Order Submitted Successfully</h2>
          <p className="text-green-700 mb-2">Thank you for your order. We will get back to you soon with a quote.</p>
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
              accept="image/*"
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
              <p className="mt-2 text-sm text-gray-500">
                Upload your reference design or specification (PDF, Excel, Word, Images, STP)
              </p>
            )}
          </div>

          <div className="mb-8">
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600" onClick={() => {}}>
              Get a Quote
            </button>
          </div>

          {/* Our Process */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 ">Our Process</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-semibold">
              <div className="bg-[#FAFAFA] py-10 rounded-lg border text-center ">
                <div className="flex justify-center mb-2">
                  <Image src="/customcable.png" alt="Custom Cables" width={60} height={60} />
                </div>
                <p className="text-sm">Custom Cables</p>
              </div>
              <div className=" py-10 bg-[#FAFAFA] rounded-lg border text-center">
                <div className="flex justify-center mb-2">
                  <Image src="/confirmplan.png" alt="Confirm Plan" width={60} height={60} />
                </div>
                <p className="text-sm">Confirm Plan</p>
              </div>
              <div className=" py-10 bg-[#FAFAFA] rounded-lg border text-center">
                <div className="flex justify-center mb-2">
                  <Image src="/production.png" alt="In Production" width={60} height={60} />
                </div>
                <p className="text-sm">In Production</p>
              </div>
              <div className=" py-10 bg-[#FAFAFA] rounded-lg border text-center">
                <div className="flex justify-center mb-2">
                  <Image src="/transpot.png" alt="Transportation" width={60} height={60} />
                </div>
                <p className="text-sm">Transportation</p>
              </div>
              <div className=" py-10 bg-[#FAFAFA] rounded-lg border text-center">
                <div className="flex justify-center mb-2">
                  <Image src="/delivered.png" alt="Delivered" width={60} height={60} />
                </div>
                <p className="text-sm">Delivered</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white  rounded-lg  mb-6">
              <h2 className="text-2xl font-semibold mb-4">Cable Selection</h2>
              <p className="text-sm text-gray-600 mb-4">
                Please fill the part number according to your cable requirements. If you are not sure about the specific
                part number of the housing,
                <span className="text-orange-500 cursor-pointer"> Click here.</span>
              </p>

              {/* Left Connector */}
              <div className="mb-6 p-6 bg-[#FAFAFA] border">
                <h3 className="font-semibold text-xl mb-2  ">Left connector</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Housing Part</label>
                    <select
                      {...register("leftConnector.housingPart")}
                      className="w-full border p-2 rounded-md bg-[#FAFAFA]"
                    >
                      <option value="">Select</option>
                      {housingPartOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.leftConnector?.housingPart && (
                      <p className="text-red-500 text-xs mt-1">{errors.leftConnector.housingPart.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Terminal Part Number</label>
                    <select
                      {...register("leftConnector.terminalPartNumber")}
                      className="w-full border p-2 rounded-md bg-[#FAFAFA]"
                    >
                      <option value="">Select</option>
                      {terminalPartOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.leftConnector?.terminalPartNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.leftConnector.terminalPartNumber.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Add New Connector</label>
                    <button
                      type="button"
                      onClick={addLeftConnector}
                      className="flex items-center text-orange-500 border border-orange-500 rounded-md px-2 py-1"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </button>
                  </div>
                </div>

                {leftAdditionalConnectors.map((connector, index) => (
                  <div key={connector.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm mb-1">Housing Part</label>
                      <select
                        {...register(`leftConnector.additionalConnectors.${index}.housingPart` as const)}
                        className="w-full border p-2 rounded-md bg-[#FAFAFA]"
                      >
                        <option value="">Select</option>
                        {housingPartOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Terminal Part Number</label>
                      <select
                        {...register(`leftConnector.additionalConnectors.${index}.terminalPartNumber` as const)}
                        className="w-full border p-2 rounded-md bg-[#FAFAFA]"
                      >
                        <option value="">Select</option>
                        {terminalPartOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Wire */}
              <div className="mb-6 p-6 bg-[#FAFAFA] border">
                <h3 className="font-medium mb-2">Wire</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm mb-1">AWG</label>
                    <select {...register("wire.awg")} className="w-full border p-2 rounded-md bg-[#FAFAFA]">
                      <option value="">Select</option>
                      {awgOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.wire?.awg && <p className="text-red-500 text-xs mt-1">{errors.wire.awg.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Length</label>
                    <select {...register("wire.length")} className="w-full border p-2 rounded-md bg-[#FAFAFA]">
                      <option value="">Select</option>
                      {lengthOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.wire?.length && <p className="text-red-500 text-xs mt-1">{errors.wire.length.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Color</label>
                    <select {...register("wire.color")} className="w-full border p-2 rounded-md bg-[#FAFAFA]">
                      <option value="">Select</option>
                      {colorOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.wire?.color && <p className="text-red-500 text-xs mt-1">{errors.wire.color.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Twisted</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="yes"
                          checked={wireTwisted === true}
                          onChange={() => setValue("wire.twisted", true)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="no"
                          checked={wireTwisted === false}
                          onChange={() => setValue("wire.twisted", false)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  {wireColor === "custom" && (
                    <div>
                      <label className="block text-sm mb-1">Customize Color</label>
                      <input
                        type="text"
                        {...register("wire.customColor")}
                        placeholder="Enter Color"
                        className="w-full border p-2 rounded-md bg-[#FAFAFA]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Connector */}
              <div className="mb-6 p-6 bg-[#FAFAFA] border">
                <h3 className="font-medium mb-2">Right connector</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Housing Part</label>
                    <select
                      {...register("rightConnector.housingPart")}
                      className="w-full border p-2 rounded-md bg-[#FAFAFA]"
                    >
                      <option value="">Select</option>
                      {housingPartOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.rightConnector?.housingPart && (
                      <p className="text-red-500 text-xs mt-1">{errors.rightConnector.housingPart.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Terminal Part Number</label>
                    <select
                      {...register("rightConnector.terminalPartNumber")}
                      className="w-full border p-2 rounded-md bg-[#FAFAFA]"
                    >
                      <option value="">Select</option>
                      {terminalPartOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.rightConnector?.terminalPartNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.rightConnector.terminalPartNumber.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Add New Connector</label>
                    <button
                      type="button"
                      onClick={addRightConnector}
                      className="flex items-center text-orange-500 border border-orange-500 rounded-md px-2 py-1"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </button>
                  </div>
                </div>

                {rightAdditionalConnectors.map((connector, index) => (
                  <div key={connector.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm mb-1">Housing Part</label>
                      <select
                        {...register(`rightConnector.additionalConnectors.${index}.housingPart` as const)}
                        className="w-full border p-2 rounded-md bg-[#FAFAFA]"
                      >
                        <option value="">Select</option>
                        {housingPartOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Terminal Part Number</label>
                      <select
                        {...register(`rightConnector.additionalConnectors.${index}.terminalPartNumber` as const)}
                        className="w-full border p-2 rounded-md bg-[#FAFAFA]"
                      >
                        <option value="">Select</option>
                        {terminalPartOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg border mb-6">
              <h2 className="text-xl font-semibold mb-4">Quantity (pcs)</h2>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    const currentQuantity = watch("quantity")
                    if (currentQuantity > 1) {
                      setValue("quantity", currentQuantity - 1)
                    }
                  }}
                  className="border rounded-md p-2"
                  disabled={watch("quantity") <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-16 text-center mx-2 border rounded-md p-2"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => {
                    const currentQuantity = watch("quantity")
                    setValue("quantity", currentQuantity + 1)
                  }}
                  className="border rounded-md p-2"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
            </div>
            <div className="flex justify-end items-center">
            <button
              type="submit"
              className="mt-6 bg-orange-500 text-white px-6 py-2  hover:bg-orange-600 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed w-max rounded-full h-min  "
              disabled={formStatus === "submitting" || fileUploadStatus === "uploading"}
            >
              {formStatus === "submitting" ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Confirm Cable Plan"
              )}
            </button>
            </div>
            </div>
            {/* Additional Notes */}
            {/* <div className="bg-white p-6 rounded-lg border mb-6">
              <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
              <textarea
                {...register("additionalNotes")}
                className="w-full border p-3 rounded-md bg-[#FAFAFA]"
                rows={4}
                placeholder="Any special requirements or instructions"
              ></textarea>
            </div>

            {errorMessage && formStatus === "error" && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                <p className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {errorMessage}
                </p>
              </div>
            )} */}

          
          </form>
        </>
      )}
    </div>
  )
}

