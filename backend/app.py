from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io

app = FastAPI(title="Meter Detection API")

# CORS（允许你的前端访问）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 部署后可改为前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化 YOLO 模型
model = YOLO("best two.pt")

@app.get("/")
def read_root():
    return {"message": "YOLOv8 Meter Detection API running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    results = model.predict(image, conf=0.25, verbose=False)
    res = results[0]

    detections = []
    for box in res.boxes:
        cls_id = int(box.cls[0])
        detections.append({
            "class_id": cls_id,
            "class_name": res.names[cls_id],
            "confidence": float(box.conf[0]),
            "xyxy": [float(x) for x in box.xyxy[0].tolist()]
        })
    return JSONResponse(content={"detections": detections})
