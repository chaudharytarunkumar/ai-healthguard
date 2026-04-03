# Stage 1: Build the React frontend
FROM node:20 AS frontend-builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build the Python backend and final image
FROM python:3.12-slim
WORKDIR /app

# Install essential system dependencies (libgomp1 is required by XGBoost)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code and trained ML models
COPY backend/ ./backend/

# Copy the built React assets from Stage 1 into the 'dist' folder
COPY --from=frontend-builder /app/dist ./dist

# Run the unified Uvicorn server, binding to Railway's $PORT
CMD uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}
