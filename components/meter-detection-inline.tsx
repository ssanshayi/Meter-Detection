"use client";

import React, { useEffect, useRef, useState } from "react";
import { PREDICT_URL } from "@/lib/api";
import type { Detection, PredictResponse } from "@/lib/types";

type ResultState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "success";
      detections: Detection[];
      imageUrl: string;
      fromServerImage: boolean;
    };

export default function MeterDetectionInline() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState>({ status: "idle" });

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // File preview
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Draw bounding boxes
  useEffect(() => {
    if (result.status !== "success") return;

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

      for (const det of result.detections) {
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
  }, [result]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResult({ status: "idle" });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] || null;
    setFile(f);
    setResult({ status: "idle" });
  };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const handlePredict = async () => {
    if (!file) {
      setResult({ status: "error", message: "Please select an image first." });
      return;
    }
    setResult({ status: "loading" });

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(PREDICT_URL, {
        method: "POST",
        body: fd,
        cache: "no-store",
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${msg || res.statusText}`);
      }

      const data = (await res.json()) as PredictResponse;

      // ✅ Sort detections from left to right based on x coordinate
      let detections = Array.isArray(data?.detections) ? data.detections : [];
      detections = detections.sort((a, b) => a.xyxy[0] - b.xyxy[0]);

      const imgUrl = data.image_base64
        ? `data:image/jpeg;base64,${data.image_base64}`
        : (previewUrl as string);

      setResult({
        status: "success",
        detections,
        imageUrl: imgUrl,
        fromServerImage: Boolean(data.image_base64),
      });
    } catch (err: any) {
      console.error(err);
      setResult({
        status: "error",
        message: err?.message || "Prediction failed. Please try again later.",
      });
    }
  };

  const canPredict = !!file && result.status !== "loading";

  // Join detected class names into a string (e.g. “09337”)
  const detectedString =
    result.status === "success"
      ? result.detections.map((d) => d.class_name).join("")
      : "";

  return (
    <div className="w-full space-y-4">
      {/* Upload area */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center cursor-pointer"
      >
        <input
          id="meter-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
        <label htmlFor="meter-file" className="block text-sm text-neutral-600">
          Drag and drop an image here or{" "}
          <span className="text-blue-600 underline">click to upload</span>
        </label>
        {file && (
          <p className="mt-2 text-xs text-neutral-500">
            Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
          </p>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePredict}
          disabled={!canPredict}
          className={`px-4 py-2 rounded-xl text-white ${
            canPredict ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300"
          }`}
        >
          {result.status === "loading" ? "Detecting..." : "Start Detection"}
        </button>

        {result.status === "error" && (
          <span className="text-sm text-red-600">{result.message}</span>
        )}
        {result.status === "success" && result.detections.length === 0 && (
          <span className="text-sm text-neutral-600">
            No detections found.
          </span>
        )}
      </div>

      {/* Preview image before detection */}
      {previewUrl && result.status !== "success" && (
        <img
          src={previewUrl}
          alt="preview"
          className="max-w-full h-auto rounded-xl border border-neutral-200"
        />
      )}

      {/* Detection results */}
      {result.status === "success" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image + boxes */}
          <div className="relative w-full">
            <div className="relative w-full">
              <img
                ref={imgRef}
                src={result.imageUrl}
                alt="result"
                className="w-full h-auto rounded-xl border border-neutral-200"
              />
              <canvas
                ref={canvasRef}
                className="absolute left-0 top-0 w-full h-full pointer-events-none"
              />
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              {result.fromServerImage
                ? "Displaying image returned by server"
                : "Overlay generated locally"}
            </p>

            {/* ✅ Display detected string */}
            {detectedString && (
              <p className="mt-3 text-base font-mono text-blue-600">
                Detected Result: {detectedString}
              </p>
            )}
          </div>

          {/* Detection table */}
          <div className="rounded-xl border border-neutral-200 p-3 overflow-auto">
            <h2 className="text-sm font-medium mb-2">Detections</h2>
            {result.detections.length > 0 ? (
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
                  {result.detections.map((d, i) => (
                    <tr key={i} className="border-t border-neutral-100">
                      <td className="py-1 pr-2">{i + 1}</td>
                      <td className="py-1 pr-2">{d.class_name}</td>
                      <td className="py-1 pr-2">
                        {(d.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="py-1">
                        [{d.xyxy.map((v) => v.toFixed(1)).join(", ")}]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-sm text-neutral-500">No detections found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
