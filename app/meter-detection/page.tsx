"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Camera,
  ClipboardCopy,
  Gauge,
  Loader2,
  RefreshCcw,
  Upload,
  X,
} from "lucide-react"

type PredictResponse = {
  detected_image_url?: string
  detected_image_base64?: string
  meter_reading?: string
  error?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL // e.g. https://your-model.up.railway.app

export default function MeterDetectionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [meterReading, setMeterReading] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      resetResult()
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  const resetAll = () => {
    setFile(null)
    setPreview(null)
    resetResult()
    setError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const resetResult = () => {
    setResultImage(null)
    setMeterReading(null)
  }

  const handleDetect = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    resetResult()

    try {
      if (!API_URL) throw new Error("Missing API URL. Please configure NEXT_PUBLIC_API_URL.")

      const form = new FormData()
      form.append("file", file)

      const res = await fetch(`${API_URL}/predict`, { method: "POST", body: form })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)

      const data: PredictResponse = await res.json()
      if (data.error) throw new Error(data.error)

      const image =
        data.detected_image_url ??
        (data.detected_image_base64
          ? `data:image/jpeg;base64,${data.detected_image_base64}`
          : null)

      setResultImage(image)
      setMeterReading(data.meter_reading ?? null)
    } catch (err: any) {
      setError(err.message || "Detection failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const copyReading = async () => {
    if (meterReading) await navigator.clipboard.writeText(meterReading)
  }

  const dropCls = useMemo(
    () =>
      `border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-colors ${
        dragOver ? "border-cyan-500 bg-cyan-50" : "border-cyan-200"
      }`,
    [dragOver]
  )

  // Drag handlers
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) {
      resetResult()
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-800 mb-3">
            <Gauge className="inline-block mr-2 h-9 w-9" />
            Smart Meter Detection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a photo of your electric meter. Our YOLOv8 AI model will
            automatically detect the digits and return both the <strong>annotated image</strong> and the <strong>recognized reading</strong>.
          </p>
        </div>

        {/* Upload Section */}
        <div
          className={`bg-white rounded-2xl shadow-sm mb-8 ${dropCls}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setDragOver(false)
          }}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          {!preview ? (
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-cyan-600 mb-3" />
              <p className="text-gray-800 font-medium">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Supported formats: JPG, PNG · Ensure digits are clear and well-lit
              </p>
              <Input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full max-w-xl aspect-[4/3]">
                <Image
                  src={preview}
                  alt="Uploaded Preview"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={resetAll}>
                  <X className="mr-2 h-4 w-4" /> Remove
                </Button>
                <Button
                  onClick={handleDetect}
                  disabled={loading}
                  className="bg-cyan-700 hover:bg-cyan-800 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Detecting...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" /> Start Detection
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-center font-medium">
              {error}
            </div>
          </div>
        )}

        {/* Results */}
        {(resultImage || meterReading) && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-cyan-800 mb-6 text-center">
              Detection Results
            </h2>

            <div className="grid md:grid-cols-5 gap-6 items-start">
              {/* Annotated Image */}
              <div className="md:col-span-3">
                <div className="relative w-full aspect-[4/3] border rounded-lg overflow-hidden bg-gray-50">
                  {resultImage ? (
                    <Image
                      src={resultImage}
                      alt="Detection Result"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      No annotated image available
                    </div>
                  )}
                </div>
              </div>

              {/* Meter Reading */}
              <div className="md:col-span-2 flex flex-col justify-center">
                <div className="rounded-xl bg-gray-50 border p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Detected Meter Reading</p>
                  <p className="text-5xl font-extrabold tracking-widest text-cyan-700 mb-4">
                    {meterReading ?? "—"}
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      disabled={!meterReading}
                      onClick={copyReading}
                    >
                      <ClipboardCopy className="mr-2 h-4 w-4" /> Copy Reading
                    </Button>
                    <Button variant="outline" onClick={resetAll}>
                      <RefreshCcw className="mr-2 h-4 w-4" /> New Upload
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty Hint */}
        {!preview && !resultImage && !error && (
          <div className="text-center text-gray-500">
            Upload a clear meter image to begin detection.
          </div>
        )}
      </div>
    </div>
  )
}
