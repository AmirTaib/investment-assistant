#!/bin/bash

# 🚀 Investment Assistant - Complete Deployment Script
# Deploys backend, Firebase Functions, Firebase Hosting, email services, configuration, and cron jobs

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="investment-advisor-bot-2025"
REGION="us-central1"
SERVICE_NAME="investment-assistant-backend"

echo -e "${BLUE}🚀 Investment Assistant - Complete Deployment${NC}"
echo -e "${CYAN}==============================================${NC}"
echo ""

# Function to print section headers
print_section() {
    echo -e "${PURPLE}📋 $1${NC}"
    echo -e "${CYAN}$(printf '=%.0s' {1..50})${NC}"
}

# Function to print step
print_step() {
    echo -e "${YELLOW}➡️  $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to print info
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
print_section "Checking Prerequisites"

print_step "Checking if we're in the right directory"
if [ ! -f "backend/main.py" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi
print_success "Directory check passed"

print_step "Checking gcloud authentication"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_error "Not authenticated with gcloud"
    print_info "Please run: gcloud auth login"
    exit 1
fi
print_success "gcloud authentication verified"

print_step "Setting project"
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ "$CURRENT_PROJECT" != "$PROJECT_ID" ]; then
    print_info "Setting project to $PROJECT_ID"
    gcloud config set project $PROJECT_ID
fi
print_success "Project: $PROJECT_ID"

# Enable required APIs
print_section "Enabling Required APIs"

APIS=(
    "cloudbuild.googleapis.com"
    "run.googleapis.com"
    "cloudscheduler.googleapis.com"
    "secretmanager.googleapis.com"
    "gmail.googleapis.com"
    "firestore.googleapis.com"
    "firebase.googleapis.com"
)

for api in "${APIS[@]}"; do
    print_step "Enabling $api"
    gcloud services enable $api --quiet
    print_success "$api enabled"
done

# Setup configuration in Secret Manager
print_section "Setting Up Configuration"

if [ -f "setup-config.sh" ]; then
    print_step "Running configuration setup"
    ./setup-config.sh
    print_success "Configuration setup completed"
else
    print_info "setup-config.sh not found, creating basic configuration"
    
    # Create basic configuration secret
    print_step "Creating configuration secret"
    cat > config.json << EOF
{
    "PROJECT_ID": "$PROJECT_ID",
    "RECIPIENT_EMAIL": "amirtaib@gmail.com",
    "SECRET_NAME": "investment-bot-service-secret-key",
    "AFTERNOON_UPDATE_1PM": "true",
    "AFTERNOON_UPDATE_5PM": "true",
    "EMAIL_SIGNIFICANT_CHANGES_ONLY": "true",
    "TIMEZONE": "Asia/Jerusalem"
}
EOF

    # Create secret if it doesn't exist
    if ! gcloud secrets describe investment-assistant-config >/dev/null 2>&1; then
        gcloud secrets create investment-assistant-config --replication-policy="automatic"
    fi
    
    # Add version
    gcloud secrets versions add investment-assistant-config --data-file="config.json"
    rm config.json
    print_success "Basic configuration created"
fi

# Setup Gmail API
print_section "Setting Up Gmail API"

if [ -f "setup-gmail-api.sh" ]; then
    print_step "Running Gmail API setup"
    ./setup-gmail-api.sh
    print_success "Gmail API setup completed"
else
    print_info "setup-gmail-api.sh not found, skipping Gmail setup"
    print_info "You may need to set up Gmail API manually later"
fi

# Deploy Firebase Functions and Hosting
print_section "Deploying Firebase Services"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI is not installed"
    print_info "Please install it with: npm install -g firebase-tools"
    print_info "Then run: firebase login"
    exit 1
fi

# Check if Firebase is initialized
if [ ! -f ".firebaserc" ]; then
    print_error "Firebase is not initialized"
    print_info "Please run: firebase init"
    exit 1
fi

# Build and deploy Firebase Functions
print_step "Building and deploying Firebase Functions"
cd functions

# Install dependencies
print_step "Installing Firebase Functions dependencies"
npm install

# Build functions
print_step "Building Firebase Functions"
npm run build

cd ..

# Build React app for hosting
print_step "Building React app for hosting"
cd app

# Install dependencies
print_step "Installing React app dependencies"
npm install

# Build the app
print_step "Building React app"
npm run build

cd ..

# Deploy Firebase services
print_step "Deploying Firebase Functions and Hosting"
firebase deploy --only functions,hosting --non-interactive

print_success "Firebase services deployed successfully"

# Create Dockerfile if it doesn't exist
print_section "Preparing Backend"

if [ ! -f "backend/Dockerfile" ]; then
    print_step "Creating Dockerfile"
    cat > backend/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Set environment variables
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "1", "--timeout", "300", "main:app"]
EOF
    print_success "Dockerfile created"
else
    print_success "Dockerfile already exists"
fi

# Deploy to Cloud Run
print_section "Deploying Backend"

print_step "Building and deploying to Cloud Run"
cd backend

gcloud run deploy $SERVICE_NAME \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 1Gi \
    --cpu 1 \
    --timeout 300 \
    --max-instances 10 \
    --set-env-vars "FLASK_ENV=production" \
    --quiet

cd ..

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
print_success "Backend deployed successfully"
print_info "Service URL: $SERVICE_URL"

# Create Cloud Scheduler jobs
print_section "Setting Up Cron Jobs"

print_step "Creating morning scheduler job (8:00 AM Israel time)"
gcloud scheduler jobs create http daily-insight-job \
    --schedule="0 6 * * *" \
    --uri="${SERVICE_URL}/api/insights/daily" \
    --http-method=GET \
    --time-zone="Asia/Jerusalem" \
    --description="Generate daily investment insights at 8:00 AM Israel time" \
    --location=$REGION \
    --attempt-deadline=300s \
    || print_info "Morning scheduler job might already exist"

print_step "Creating 1:00 PM scheduler job"
gcloud scheduler jobs create http afternoon-insight-1pm-job \
    --schedule="0 11 * * *" \
    --uri="${SERVICE_URL}/api/insights/afternoon/midday" \
    --http-method=GET \
    --time-zone="Asia/Jerusalem" \
    --description="Generate afternoon investment insights at 1:00 PM Israel time" \
    --location=$REGION \
    --attempt-deadline=300s \
    || print_info "1:00 PM scheduler job might already exist"

print_step "Creating 5:00 PM scheduler job"
gcloud scheduler jobs create http afternoon-insight-5pm-job \
    --schedule="0 15 * * *" \
    --uri="${SERVICE_URL}/api/insights/afternoon/end-of-day" \
    --http-method=GET \
    --time-zone="Asia/Jerusalem" \
    --description="Generate afternoon investment insights at 5:00 PM Israel time" \
    --location=$REGION \
    --attempt-deadline=300s \
    || print_info "5:00 PM scheduler job might already exist"

print_success "All cron jobs created"

# Test the deployment
print_section "Testing Deployment"

print_step "Testing health endpoint"
if curl -s "${SERVICE_URL}/health" | grep -q "healthy"; then
    print_success "Health check passed"
else
    print_error "Health check failed"
fi

print_step "Testing configuration endpoint"
if curl -s "${SERVICE_URL}/api/config/status" | grep -q "status"; then
    print_success "Configuration endpoint working"
else
    print_error "Configuration endpoint failed"
fi

print_step "Testing email endpoint"
if curl -s -X POST "${SERVICE_URL}/api/email/test" \
    -H "Content-Type: application/json" \
    -d '{"subject":"Test","body":"Test"}' | grep -q "status"; then
    print_success "Email endpoint working"
else
    print_error "Email endpoint failed"
fi

print_step "Testing afternoon update endpoints"
if curl -s "${SERVICE_URL}/api/insights/afternoon/midday" | grep -q "market_overview\|error"; then
    print_success "Midday endpoint working"
else
    print_error "Midday endpoint failed"
fi

if curl -s "${SERVICE_URL}/api/insights/afternoon/end-of-day" | grep -q "market_overview\|error"; then
    print_success "End-of-day endpoint working"
else
    print_error "End-of-day endpoint failed"
fi

# Final summary
print_section "Deployment Summary"

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Service Information:${NC}"
echo "• Backend URL: $SERVICE_URL"
echo "• Firebase Hosting: https://$PROJECT_ID.web.app"
echo "• Firebase Functions: https://$REGION-$PROJECT_ID.cloudfunctions.net"
echo "• Project ID: $PROJECT_ID"
echo "• Region: $REGION"
echo "• Service Name: $SERVICE_NAME"
echo ""
echo -e "${BLUE}⏰ Cron Job Schedule:${NC}"
echo "• Morning Update: 8:00 AM Israel time (6:00 AM UTC)"
echo "• Midday Update: 1:00 PM Israel time (11:00 AM UTC)"
echo "• End-of-Day Update: 5:00 PM Israel time (3:00 PM UTC)"
echo ""
echo -e "${BLUE}🧪 Testing Commands:${NC}"
echo "• Health check: curl $SERVICE_URL/health"
echo "• Config status: curl $SERVICE_URL/api/config/status"
echo "• Test email: curl -X POST $SERVICE_URL/api/email/test -H 'Content-Type: application/json' -d '{\"subject\":\"Test\",\"body\":\"Test\"}'"
echo "• Test midday: curl $SERVICE_URL/api/insights/afternoon/midday"
echo "• Test end-of-day: curl $SERVICE_URL/api/insights/afternoon/end-of-day"
echo ""
echo -e "${BLUE}📊 Monitoring Commands:${NC}"
echo "• View Cloud Run logs: gcloud logs tail --service=$SERVICE_NAME --region=$REGION"
echo "• View Firebase logs: firebase functions:log"
echo "• List jobs: gcloud scheduler jobs list --location=$REGION"
echo "• Check secrets: gcloud secrets list"
echo "• Firebase status: firebase projects:list"
echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo "1. Monitor the system for a few days"
echo "2. Check email delivery at scheduled times"
echo "3. Verify change detection is working correctly"
echo "4. Adjust configuration if needed via Secret Manager"
echo ""
echo -e "${GREEN}✅ Your Investment Assistant is now live and ready!${NC}"
