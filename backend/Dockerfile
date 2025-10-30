FROM python:3.13-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 libglib2.0-0 libsm6 libxext6 libxrender1 \
 && rm -rf /var/lib/apt/lists/*

ENV MPLBACKEND=Agg MPLCONFIGDIR=/tmp PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1

# 工作目录 = 后端目录
WORKDIR /app/backend

# 升级 pip
RUN python -m pip install --upgrade pip

# ✅ 先装“CPU 版”PyTorch（与 torchvision 的正确配对：2.8.0/0.23.0，Py3.13 可用）
RUN pip install --index-url https://download.pytorch.org/whl/cpu \
    torch==2.8.0 torchvision==0.23.0

# 安装其它依赖（requirements 里不包含 torch/vision）
COPY requirements.txt /app/backend/requirements.txt
RUN pip install -r /app/backend/requirements.txt

# 只拷贝 backend 目录（足够运行后端；前端不需要打进镜像）
COPY . /app/backend

EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
