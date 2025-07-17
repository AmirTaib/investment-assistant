#!/bin/bash

# Step 0: Set config variables
PROJECT_ID=$(gcloud config get-value project)
SERVICE_NAME="investment-assistant"
REGION="us-central1"

echo "📌 Deploying service: $SERVICE_NAME to project: $PROJECT_ID in region: $REGION"

# Step 1: Build Docker image from ./backend folder
echo "🚧 Building Docker image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME ./backend

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Aborting deployment."
  exit 1
fi

# Step 2: Deploy to Cloud Run
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated

if [ $? -eq 0 ]; then
  echo "✅ Deployment successful."
else
  echo "❌ Deployment failed."
fi
