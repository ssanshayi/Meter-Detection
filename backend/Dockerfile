# backend/Dockerfile
FROM python:3.13-slim

# 基础依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
 && rm -rf /var/lib/apt/lists/*

ENV MPLBACKEND=Agg \
    MPLCONFIGDIR=/tmp \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app/backend

# 先升级 pip
RUN python -m pip install --upgrade pip

# ✅ 先单独安装「CPU 版」PyTorch（与 torchvision 的正确配对）
#   0.23.0 的 torchvision 需要 torch==2.8.0
RUN pip install --index-url https://download.pytorch.org/whl/cpu \
    torch==2.8.0 \
    torchvision==0.23.0

# 再装项目依赖（不包含 torch/torchvision）
COPY requirements.txt /app/backend/requirements.txt
RUN pip install -r /app/backend/requirements.txt

# 复制整个仓库（包含 app.py 与可能的 best.pt）
COPY .. /app

EXPOSE 8000
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
