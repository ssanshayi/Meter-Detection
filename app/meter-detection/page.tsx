"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, ClipboardCopy, Gauge, Loader2, RefreshCcw, Upload, X } from "lucide-react";

type Detection = {
  class_id: number;
  class_name: string;
  confidence: number;
  xyxy: [number, number, number, number];
};

type PredictResponse =
  | {
      // Schema A (detections-first)
      detections?: Detection[];
      image_base64?: string;
      ok?: boolean;
      error?: string;
    }
  | {
      // Schema B (annotated image + meter reading)
      detected_image_url?: string;
      detected_image_base64?: string;
      meter_reading?: string;
      error?: string;
    };

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function MeterDetectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // unified results
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [meterReading, setMeterReading] = useState<string | null>(null);

  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // revoke preview URL on unmount/change
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const resetDisplayedResult = () => {
    setResultImage(null);
    setDetections([]);
    setMeterReading(null);
  };

  const resetAll = () => {
    setFile(null);
    setPreview(null);
    resetDisplayedResult();
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      resetDisplayedResult();
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  // draw boxes whenever detections + image are ready
  useEffect(() => {
    if (!resultImage && !preview) return;
    if (!detections.length) return;

    const imgEl = imgRef.current;
    const canvas = canvasRef.current;
    if (!imgEl || !canvas) return;

    const draw = () => {
      const w = imgEl.naturalWidth;
      const h = imgEl.naturalHeight;
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#22c55e";
      ctx.fillStyle = "rgba(34,197,94,0.35)";
      ctx.font = "24px ui-sans-serif, system-ui, -apple-system";

      for (const det of detections) {
        const [x1, y1, x2, y2] = det.xyxy;
        const bw = x2 - x1;
        const bh = y2 - y1;
        ctx.strokeRect(x1, y1, bw, bh);

        const label = `${det.class_name} ${(det.confidence * 100).toFixed(1)}%`;
        const labelW = ctx.measureText(label).width + 12;
        const labelH = 26;

        ctx.fillRect(x1, Math.max(0, y1 - labelH), labelW, labelH);
        ctx.fillStyle = "#0a0a0a";
        ctx.fillText(label, x1 + 6, Math.max(18, y1 - 6));
        ctx.fillStyle = "rgba(34,197,94,0.35)";
      }
    };

    if (imgEl.complete) draw();
    else imgEl.onload = draw;
  }, [detections, resultImage, preview]);

  const handleDetect = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    resetDisplayedResult();

    try {
      if (!API_URL) throw new Error("Missing API URL. Set NEXT_PUBLIC_API_URL in .env.local.");

      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${API_URL}/predict`, { method: "POST", body: form, cache: "no-store" });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`Request failed (${res.status}) ${t}`);
      }

      const data: PredictResponse = await res.json();
      // If server signaled an error
      if ((data as any)?.error) throw new Error((data as any).error);

      // Branch 1: detections present
      if ("detections" in data && Array.isArray(data.detections)) {
        // sort left -> right
        const sorted = [...data.detections].sort((a, b) => a.xyxy[0] - b.xyxy[0]);
        setDetections(sorted);

        // prefer server image if provided; else fallback to preview and overlay locally
        const imgUrl = data.image_base64
          ? `data:image/jpeg;base64,${data.image_base64}`
          : (preview as string);
        setResultImage(imgUrl);

        // if server didn't provide reading, build from class_name
        setMeterReading((data as any).meter_reading ?? sorted.map(d => d.class_name).join(""));
        return;
      }

      // Branch 2: annotated image + optional reading
      if ("detected_image_url" in data || "detected_image_base64" in data) {
        const img =
          data.detected_image_url ??
          (data.detected_image_base64 ? `data:image/jpeg;base64,${data.detected_image_base64}` : null);
        setResultImage(img || null);
        setMeterReading(data.meter_reading ?? null);
        // no boxes to draw in this branch unless you also return detections
        setDetections([]);
        return;
      }

      // Fallback if schema unexpected
      throw new Error("Unexpected API response format.");
    } catch (err: any) {
      setError(err?.message || "Detection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyReading = async () => {
    if (meterReading) await navigator.clipboard.writeText(meterReading);
  };

  const dropCls = useMemo(
    () =>
      `border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-colors ${
        dragOver ? "border-cyan-500 bg-cyan-50" : "border-cyan-200"
      }`,
    [dragOver]
  );

  // drag & drop
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) {
      resetDisplayedResult();
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const imageToShow = resultImage || preview || null;

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
            Upload a photo of your electric meter. Our YOLOv8 model will detect the digits, return an
            <strong> annotated image</strong>, and display the <strong>recognized reading</strong>.
          </p>
        </div>

        {/* Upload Section */}
        <div
          className={`bg-white rounded-2xl shadow-sm mb-8 ${dropCls}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          {!preview ? (
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-cyan-600 mb-3" />
              <p className="text-gray-800 font-medium">Drag and drop an image here, or click to select</p>
              <p className="text-gray-500 text-sm mt-1">
                Supported formats: JPG, PNG · Ensure digits are clear and well-lit
              </p>
              <Input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full max-w-xl aspect-[4/3]">
                <Image src={preview} alt="Uploaded Preview" fill className="object-contain rounded-lg" />
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={resetAll}>
                  <X className="mr-2 h-4 w-4" /> Remove
                </Button>
                <Button onClick={handleDetect} disabled={loading} className="bg-cyan-700 hover:bg-cyan-800 text-white">
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

        {/* Error */}
        {error && (
          <div className="mb-6">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-center font-medium">
              {error}
            </div>
          </div>
        )}

        {/* Results */}
        {(imageToShow || meterReading || detections.length > 0) && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-cyan-800 mb-6 text-center">Detection Results</h2>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              {/* Image + (optional) overlay */}
              <div className="relative w-full">
                <div className="relative w-full aspect-[4/3] border rounded-lg overflow-hidden bg-gray-50">
                  {imageToShow ? (
                    <>
                      <Image
                        ref={imgRef as any}
                        src={imageToShow}
                        alt="Detection Result"
                        fill
                        className="object-contain"
                      />
                      {/* Only show canvas overlay when we have local detections */}
                      {detections.length > 0 && (
                        <canvas ref={canvasRef} className="absolute left-0 top-0 w-full h-full pointer-events-none" />
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      No image available
                    </div>
                  )}
                </div>

                {/* Detected string (from API or built from detections) */}
                {(meterReading || detections.length > 0) && (
                  <p className="mt-3 text-base font-mono text-blue-600">
                    Detected Result: {meterReading ?? detections.map((d) => d.class_name).join("")}
                  </p>
                )}
              </div>

              {/* Right column: Detections table (if any) */}
              <div className="rounded-xl border border-neutral-200 p-3 overflow-auto">
                <h3 className="text-sm font-medium mb-2">Detections</h3>
                {detections.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-neutral-500">
                        <th className="py-1 pr-2">#</th>
                        <th className="py-1 pr-2">Class</th>
                        <th className="py-1 pr-2">Confidence</th>
                        <th className="py-1">[x1, y1, x2, y2]</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detections.map((d, i) => (
                        <tr key={i} className="border-t border-neutral-100">
                          <td className="py-1 pr-2">{i + 1}</td>
                          <td className="py-1 pr-2">{d.class_name}</td>
                          <td className="py-1 pr-2">{(d.confidence * 100).toFixed(1)}%</td>
                          <td className="py-1">[{d.xyxy.map((v) => v.toFixed(1)).join(", ")}]</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-sm text-neutral-500">No bounding boxes available.</div>
                )}

                {/* Actions for reading */}
                <div className="mt-4 flex justify-center gap-3">
                  <Button variant="outline" disabled={!meterReading && detections.length === 0} onClick={copyReading}>
                    <ClipboardCopy className="mr-2 h-4 w-4" /> Copy Reading
                  </Button>
                  <Button variant="outline" onClick={resetAll}>
                    <RefreshCcw className="mr-2 h-4 w-4" /> New Upload
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty hint */}
        {!preview && !imageToShow && !error && (
          <div className="text-center text-gray-500">Upload a clear meter image to begin detection.</div>
        )}
      </div>
    </div>
  );
}
