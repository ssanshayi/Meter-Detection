from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io, os

app = FastAPI(title="Meter Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 按顺序找权重：backend/weights/best.pt → backend/best.pt → 仓库根 best.pt
BACKEND_DIR = os.path.dirname(__file__)
CANDIDATES = [
    os.path.join(BACKEND_DIR, "weights", "best.pt"),
    os.path.join(BACKEND_DIR, "best.pt"),
    os.path.join(os.path.dirname(BACKEND_DIR), "best.pt"),
]
MODEL_PATH = os.getenv("MODEL_PATH") or next((p for p in CANDIDATES if os.path.exists(p)), None)
MODEL_URL = os.getenv("MODEL_URL")

if not MODEL_PATH and MODEL_URL:
    import urllib.request
    MODEL_PATH = os.path.join(BACKEND_DIR, "weights", "best.pt")
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    print(f"[Init] Downloading weights: {MODEL_URL} -> {MODEL_PATH}")
    urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)

print(f"[Init] Loading YOLO model from: {MODEL_PATH}")
if not MODEL_PATH or not os.path.exists(MODEL_PATH):
    raise FileNotFoundError("best.pt not found. Put it under backend/ or backend/weights/, or set MODEL_URL/MODEL_PATH.")

model = YOLO(MODEL_PATH)

@app.get("/")
def root():
    return {"message": "YOLOv8 Meter Detection API running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        img = Image.open(io.BytesIO(await file.read())).convert("RGB")
        res = model.predict(img, conf=0.25, verbose=False)[0]
        dets = []
        if res.boxes is not None:
            for box in res.boxes:
                cls_id = int(box.cls[0])
                dets.append({
                    "class_id": cls_id,
                    "class_name": res.names[cls_id],
                    "confidence": float(box.conf[0]),
                    "xyxy": [float(x) for x in box.xyxy[0].tolist()]
                })
        return JSONResponse({"detections": dets})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    # 因为容器工作目录就是 /app/backend，所以用 app:app
    uvicorn.run("app:app", host="0.0.0.0", port=port)
