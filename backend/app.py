from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import os

# 初始化 FastAPI 应用
app = FastAPI(title="Meter Detection API")

# CORS 设置（允许前端访问）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 上线后可改为具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 读取模型路径（默认 /weights/best.pt 或当前目录下 best.pt）
MODEL_PATH = os.getenv("MODEL_PATH", "best.pt")
MODEL_URL = os.getenv("MODEL_URL")

# 如果需要，可以在这里添加自动下载逻辑
if not os.path.exists(MODEL_PATH) and MODEL_URL:
    import urllib.request
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    print(f"[Init] Downloading weights from {MODEL_URL} -> {MODEL_PATH}")
    urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)

# 加载 YOLO 模型
print(f"[Init] Loading YOLO model from {MODEL_PATH}")
model = YOLO(MODEL_PATH)

@app.get("/")
def read_root():
    return {"message": "YOLOv8 Meter Detection API running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """上传图片并进行检测"""
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


# 🚀 关键部分：当你运行 python app.py 时，自动启动服务器
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))  # Railway 自动注入 PORT
    print(f"[Server] Starting on port {port} ...")
    uvicorn.run("app:app", host="0.0.0.0", port=port)
