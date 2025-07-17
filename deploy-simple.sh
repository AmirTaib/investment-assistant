#!/bin/bash

# Simplified Backend Deployment Script
# Deploys the cleaned-up backend to Google Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="investment-advisor-bot-2025"
REGION="us-central1"
SERVICE_NAME="investment-assistant"
SERVICE_URL="https://investment-assistant-cp6yzmvf2q-uc.a.run.app"

echo -e "${GREEN}[INFO] Starting simplified backend deployment...${NC}"
echo -e "${GREEN}[INFO] Project ID: ${PROJECT_ID}${NC}"
echo -e "${GREEN}[INFO] Region: ${REGION}${NC}"
echo -e "${GREEN}[INFO] Service Name: ${SERVICE_NAME}${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}[ERROR] gcloud CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}[WARNING] Not authenticated with gcloud. Please run: gcloud auth login${NC}"
    exit 1
fi

# Set project
echo -e "${GREEN}[INFO] Setting project...${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${GREEN}[INFO] Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable firestore.googleapis.com

# Build and deploy
echo -e "${GREEN}[INFO] Building and deploying to Cloud Run...${NC}"
cd backend

# Build and push the container
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10 \
    --timeout 300

echo -e "${GREEN}[SUCCESS] Deployment completed!${NC}"
echo -e "${GREEN}[INFO] Service URL: ${SERVICE_URL}${NC}"
echo -e "${GREEN}[INFO] Test endpoints:${NC}"
echo -e "${GREEN}  - Health: ${SERVICE_URL}/health${NC}"
echo -e "${GREEN}  - Daily Insight: ${SERVICE_URL}/api/insights/daily${NC}"
echo -e "${GREEN}  - Recent Insights: ${SERVICE_URL}/api/insights/recent${NC}"

# Set up Cloud Scheduler for daily insights (8:00 AM Israel time = 6:00 AM UTC)
echo -e "${GREEN}[INFO] Setting up Cloud Scheduler for daily insights...${NC}"
gcloud services enable cloudscheduler.googleapis.com

# Create the scheduler job
gcloud scheduler jobs create http daily-insight-job \
    --schedule="0 6 * * *" \
    --uri="${SERVICE_URL}/api/insights/daily" \
    --http-method=GET \
    --time-zone="Asia/Jerusalem" \
    --description="Generate daily investment insights at 8:00 AM Israel time" \
    --location=$REGION \
    --attempt-deadline=300s \
    || echo -e "${YELLOW}[WARNING] Scheduler job might already exist${NC}"

echo -e "${GREEN}[SUCCESS] Setup completed!${NC}"
echo -e "${GREEN}[INFO] Daily insights will be generated at 8:00 AM Israel time${NC}" 