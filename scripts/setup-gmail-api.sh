#!/bin/bash

# Gmail API Setup Script for Investment Assistant
# This script helps set up Gmail API credentials for email notifications

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
SECRET_NAME=${SECRET_NAME:-"investment-bot-service-secret-key"}

echo -e "${GREEN}🔧 Gmail API Setup for Investment Assistant${NC}"
echo ""

print_status "This script will help you set up Gmail API credentials for email notifications."
print_status "Project ID: $PROJECT_ID"
print_status "Secret Name: $SECRET_NAME"
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

print_status "Setting up Gmail API credentials..."

# Step 1: Enable Gmail API
print_status "Step 1: Enabling Gmail API..."
gcloud services enable gmail.googleapis.com --project=$PROJECT_ID

# Step 2: Create service account for Gmail
print_status "Step 2: Creating service account for Gmail API..."
gcloud iam service-accounts create gmail-api-service \
    --display-name="Gmail API Service Account" \
    --description="Service account for Gmail API access" \
    --project=$PROJECT_ID \
    || print_warning "Service account might already exist"

# Step 3: Create and download service account key
print_status "Step 3: Creating service account key..."
gcloud iam service-accounts keys create gmail-service-key.json \
    --iam-account=gmail-api-service@$PROJECT_ID.iam.gserviceaccount.com \
    --project=$PROJECT_ID

# Step 4: Store credentials in Secret Manager
print_status "Step 4: Storing credentials in Secret Manager..."
gcloud secrets create $SECRET_NAME --replication-policy="automatic" --project=$PROJECT_ID \
    || print_warning "Secret might already exist"

gcloud secrets versions add $SECRET_NAME --data-file="gmail-service-key.json" --project=$PROJECT_ID

# Step 5: Grant necessary permissions
print_status "Step 5: Granting necessary permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:gmail-api-service@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# Step 6: Instructions for Gmail API setup
print_success "Gmail API setup completed!"
echo ""
print_status "Next steps to complete Gmail API setup:"
echo ""
echo "1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials"
echo "2. Create OAuth 2.0 credentials for Gmail API:"
echo "   - Application type: Web application"
echo "   - Authorized redirect URIs: https://your-domain.com/oauth2callback"
echo ""
echo "3. Download the OAuth 2.0 credentials JSON file"
echo ""
echo "4. Update the gmail-service-key.json file with your OAuth 2.0 credentials:"
echo "   - Replace the content with your OAuth 2.0 credentials"
echo "   - Include 'access_token' and 'refresh_token' fields"
echo ""
echo "5. Update the secret in Secret Manager:"
echo "   gcloud secrets versions add $SECRET_NAME --data-file=\"gmail-service-key.json\" --project=$PROJECT_ID"
echo ""
echo "6. Test the email functionality:"
echo "   curl -X POST https://your-service-url/api/email/test \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"subject\": \"Test Email\", \"body\": \"This is a test email\"}'"
echo ""

# Clean up temporary files
rm -f gmail-service-key.json

print_success "Setup script completed! Follow the instructions above to complete Gmail API configuration." 