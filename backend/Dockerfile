# 保持 Python 3.13
FROM python:3.13-slim

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

# 工作目录 = /app/backend
WORKDIR /app/backend

# 只拷贝依赖清单并安装（利用缓存）
COPY requirements.txt /app/backend/requirements.txt
RUN python -m pip install --upgrade pip \
 && pip install -r /app/backend/requirements.txt

# 再把仓库根全部拷进来（backend/ 之外的文件也会被带上）
# 这样 app.py 能 import 到 backend 模块，权重也能被包含进镜像
COPY .. /app

EXPOSE 8000

CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
