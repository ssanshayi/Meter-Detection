"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Camera,
  ClipboardCopy,
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

const API_URL = process.env.NEXT_PUBLIC_API_URL // 你的 Railway API 地址

export default function MeterDetectionInline() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [meterReading, setMeterReading] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 上传文件
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    resetResult()
    setFile(f)
    setPreview(URL.createObjectURL(f))
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

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (!f) return
    resetResult()
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  // 检测逻辑
  const detect = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    resetResult()

    try {
      if (!API_URL) throw new Error("缺少 API 地址，请配置 NEXT_PUBLIC_API_URL。")
      const form = new FormData()
      form.append("file", file)

      const res = await fetch(`${API_URL}/predict`, { method: "POST", body: form })
      if (!res.ok) throw new Error(`请求失败：${res.status}`)

      const data: PredictResponse = await res.json()
      if (data.error) throw new Error(data.error)

      const img =
        data.detected_image_url ??
        (data.detected_image_base64 ? `data:image/jpeg;base64,${data.detected_image_base64}` : null)

      setResultImage(img)
      setMeterReading(data.meter_reading ?? null)
    } catch (err: any) {
      setError(err.message || "检测失败，请稍后重试。")
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

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-cyan-800">AI Meter Detection</h3>
        <p className="text-gray-600 mt-2">
          Upload a photo of the electric meter, and the YOLOv8 model will automatically recognize the meter number and return the recognized image and recognition result.
        </p>
      </div>

      {/* 上传区域 */}
      <div
        className={dropCls}
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
            <p className="text-gray-800 font-medium">Drag and drop the image here, or click to select a file</p>
            <p className="text-gray-500 text-sm mt-1">Support JPG/PNG to ensure clear digital areas</p>
            <Input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-xl aspect-[4/3]">
              <Image src={preview} alt="Preview" fill className="object-contain rounded-lg" />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={resetAll}>
                <X className="mr-2 h-4 w-4" /> remove
              </Button>
              <Button
                onClick={detect}
                disabled={loading}
                className="bg-cyan-700 hover:bg-cyan-800 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Identifying...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" /> Upload and identify
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-center">
          {error}
        </div>
      )}

      {/* 结果展示 */}
      {(resultImage || meterReading) && (
        <div className="mt-8">
          <div className="grid md:grid-cols-5 gap-6 items-start">
            {/* 识别图像 */}
            <div className="md:col-span-3">
              <div className="relative w-full aspect-[4/3] border rounded-lg overflow-hidden bg-gray-50">
                {resultImage ? (
                  <Image src={resultImage} alt="Detection Result" fill className="object-contain" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Unrecognized image
                  </div>
                )}
              </div>
            </div>

            {/* 电表读数 */}
            <div className="md:col-span-2">
              <div className="rounded-xl bg-gray-50 border p-6 text-center h-full">
                <p className="text-sm text-gray-600 mb-2">Identified meter readings</p>
                <p className="text-5xl font-extrabold tracking-widest text-cyan-700 mb-4">
                  {meterReading ?? "—"}
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" disabled={!meterReading} onClick={copyReading}>
                    <ClipboardCopy className="mr-2 h-4 w-4" /> Copy Reading
                  </Button>
                  <Button variant="outline" onClick={resetAll}>
                    <RefreshCcw className="mr-2 h-4 w-4" /> reupload
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                Suggestion: Use good lighting, avoid reflection or blurring, and try to fill the digital area as much as possible in the picture.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
