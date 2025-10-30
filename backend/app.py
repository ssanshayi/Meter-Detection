from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import os

app = FastAPI(title="Meter Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 生产建议改成你的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------- 权重路径策略（按顺序找）---------
BACKEND_DIR = os.path.dirname(__file__)
CANDIDATES = [
    os.path.join(BACKEND_DIR, "weights", "best.pt"),
    os.path.join(BACKEND_DIR, "best.pt"),
    os.path.join(os.path.dirname(BACKEND_DIR), "best.pt"),  # 仓库根目录
]

MODEL_PATH = os.getenv("MODEL_PATH")  # 优先环境变量
MODEL_URL = os.getenv("MODEL_URL")    # 可选：提供直链时可自动下载

if not MODEL_PATH:
    for p in CANDIDATES:
        if os.path.exists(p):
            MODEL_PATH = p
            break

# 如果还没找到且给了 URL，就下载到 backend/weights/best.pt
if not MODEL_PATH and MODEL_URL:
    import urllib.request
    MODEL_PATH = os.path.join(BACKEND_DIR, "weights", "best.pt")
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    print(f"[Init] Downloading weights: {MODEL_URL} -> {MODEL_PATH}")
    urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)

print(f"[Init] Loading YOLO model from: {MODEL_PATH}")
if not MODEL_PATH or not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        "Model file not found.\n"
        "Tried: \n  - backend/weights/best.pt\n  - backend/best.pt\n  - ./best.pt (repo root)\n"
        "Or set MODEL_PATH / MODEL_URL."
    )

model = YOLO(MODEL_PATH)

@app.get("/")
def root():
    return {"message": "YOLOv8 Meter Detection API running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        results = model.predict(image, conf=0.25, verbose=False)
        res = results[0]

        detections = []
        if res.boxes is not None:
            for box in res.boxes:
                cls_id = int(box.cls[0])
                detections.append({
                    "class_id": cls_id,
                    "class_name": res.names[cls_id],
                    "confidence": float(box.conf[0]),
                    "xyxy": [float(x) for x in box.xyxy[0].tolist()]
                })

        return JSONResponse(content={"detections": detections})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.app:app", host="0.0.0.0", port=port)
