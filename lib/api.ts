// lib/api.ts
export const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") ||
  "http://localhost:8000"; // 本地兜底

export const PREDICT_URL = `${API_BASE}/predict`;
