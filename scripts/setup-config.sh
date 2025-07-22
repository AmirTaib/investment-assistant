#!/bin/bash

# Configuration Setup Script for Investment Assistant
# This script helps set up configuration in GCP Secret Manager

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
PROJECT_ID=${PROJECT_ID:-"investment-advisor-bot-2025"}

echo -e "${GREEN}⚙️ Configuration Setup for Investment Assistant${NC}"
echo ""

print_status "This script will help you set up configuration in GCP Secret Manager."
print_status "Project ID: $PROJECT_ID"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_warning "Not authenticated with gcloud. Please authenticate first:"
    echo "gcloud auth login"
    exit 1
fi

print_status "Setting up configuration in Secret Manager..."

# Step 1: Enable Secret Manager API
print_status "Step 1: Enabling Secret Manager API..."
gcloud services enable secretmanager.googleapis.com --project=$PROJECT_ID

# Step 2: Create configuration secret
print_status "Step 2: Creating configuration secret..."
gcloud secrets create investment-assistant-config --replication-policy="automatic" --project=$PROJECT_ID \
    || print_warning "Configuration secret might already exist"

# Step 3: Create configuration file
print_status "Step 3: Creating configuration file..."
cat > config.json << EOF
{
    "PROJECT_ID": "$PROJECT_ID",
    "SECRET_NAME": "investment-bot-service-secret-key",
    "RECIPIENT_EMAIL": "amirtaib@gmail.com",
    "EMAIL_PROVIDER": "gmail",
    "SHEET_ID": "your-google-sheet-id",
    "SHEET_NAME": "Investment Dashboard",
    "FIRESTORE_COLLECTION": "investment_data",
    "FIRESTORE_DOCUMENT": "portfolio",
    "FLASK_ENV": "production",
    "LOG_LEVEL": "INFO",
    "TIMEZONE": "Asia/Jerusalem",
    "INITIAL_INVESTMENT": "30000",
    "MONTHLY_INVESTMENT": "2000",
    "CURRENCY": "ILS",
    "RISK_LEVEL": "HIGH",
    "MARKET_DATA_PROVIDER": "yfinance",
    "UPDATE_FREQUENCY": "daily",
    "SCHEDULE_TIME": "08:30",
    "AFTERNOON_UPDATE_1PM": "true",
    "AFTERNOON_UPDATE_5PM": "true",
    "EMAIL_SIGNIFICANT_CHANGES_ONLY": "true",
    "OPENAI_API_KEY": "your-openai-api-key",
    "DEBUG": "false",
    "LOCAL_TESTING": "false"
}
EOF

# Step 4: Add configuration to Secret Manager
print_status "Step 4: Adding configuration to Secret Manager..."
gcloud secrets versions add investment-assistant-config --data-file="config.json" --project=$PROJECT_ID

# Step 5: Grant necessary permissions
print_status "Step 5: Granting necessary permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:investment-assistant@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" \
    || print_warning "Service account might not exist yet"

print_success "Configuration setup completed!"
echo ""
print_status "Configuration has been stored in Secret Manager."
print_status "You can now update the configuration by editing config.json and running:"
echo "gcloud secrets versions add investment-assistant-config --data-file=\"config.json\" --project=$PROJECT_ID"
echo ""
print_status "Important: Make sure to update the following values in config.json:"
echo "  • OPENAI_API_KEY: Your OpenAI API key"
echo "  • SHEET_ID: Your Google Sheet ID (if using)"
echo "  • Any other specific values for your setup"
echo ""

# Clean up
rm -f config.json

print_success "Setup script completed! Your configuration is now stored in GCP Secret Manager." 