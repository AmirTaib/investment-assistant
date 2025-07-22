#!/bin/bash

# Test Email Functionality Locally
# This script helps you test the email service without deploying

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Local Email Testing Setup${NC}"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "backend/main.py" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Error: Python 3 is not installed${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Prerequisites Check:${NC}"

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating one...${NC}"
    cp backend/env.example backend/.env
    echo -e "${GREEN}✅ Created backend/.env from template${NC}"
    echo -e "${YELLOW}📝 Please edit backend/.env with your configuration${NC}"
fi

# Check if gcloud is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ Error: Not authenticated with gcloud${NC}"
    echo -e "${YELLOW}🔐 Please run: gcloud auth login${NC}"
    exit 1
fi

# Check if project is set
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Error: No gcloud project set${NC}"
    echo -e "${YELLOW}🔧 Please run: gcloud config set project YOUR_PROJECT_ID${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project: $PROJECT_ID${NC}"

# Install Python dependencies
echo -e "${YELLOW}📦 Installing Python dependencies...${NC}"
cd backend
pip3 install -r requirements.txt
cd ..

# Test configuration
echo -e "${YELLOW}🔧 Testing configuration...${NC}"
python3 -c "
import sys
sys.path.append('backend')
from config_service import config_service

try:
    config = config_service.get_config()
    print('✅ Configuration loaded successfully')
    print(f'📧 Recipient Email: {config.get(\"RECIPIENT_EMAIL\", \"Not set\")}')
    print(f'🔑 Secret Name: {config.get(\"SECRET_NAME\", \"Not set\")}')
    print(f'🌍 Project ID: {config.get(\"PROJECT_ID\", \"Not set\")}')
except Exception as e:
    print(f'❌ Configuration error: {e}')
    sys.exit(1)
"

# Test email service
echo -e "${YELLOW}📧 Testing email service...${NC}"
python3 -c "
import sys
sys.path.append('backend')
from email_service import EmailService

try:
    email_service = EmailService()
    print('✅ Email service initialized successfully')
    
    # Test Gmail credentials
    try:
        credentials = email_service.get_gmail_credentials()
        print('✅ Gmail credentials retrieved successfully')
    except Exception as e:
        print(f'❌ Gmail credentials error: {e}')
        print('💡 Make sure you have set up Gmail API and stored credentials in Secret Manager')
        
except Exception as e:
    print(f'❌ Email service error: {e}')
    sys.exit(1)
"

echo -e "${GREEN}✅ Local setup complete!${NC}"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. Edit backend/.env with your configuration"
echo "2. Run: ./setup-config.sh (if not done already)"
echo "3. Run: ./setup-gmail-api.sh (if not done already)"
echo "4. Test with: curl -X POST http://localhost:5000/api/email/test"
echo ""
echo -e "${YELLOW}💡 To run the backend locally:${NC}"
echo "cd backend && python3 main.py" 