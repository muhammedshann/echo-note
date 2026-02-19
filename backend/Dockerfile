FROM python:3.11

# Prevent Python from writing pyc files
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Disable pip build isolation (fix whisper build issue)
ENV PIP_NO_BUILD_ISOLATION=1

WORKDIR /app

# Install system dependencies required for whisper + audio
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Upgrade build tools first
RUN pip install --upgrade pip setuptools wheel

# Copy requirements first for caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

apt-get install -y git

# Copy project
COPY . .

EXPOSE 10000

CMD ["daphne", "-b", "0.0.0.0", "-p", "10000", "backend.asgi:application"]
