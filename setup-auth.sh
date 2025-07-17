#!/bin/bash
export PATH="$PATH:/opt/homebrew/bin"

# GCP Authentication Setup Script
# This script helps set up persistent authentication with Google Cloud

set -e

# Configuration
PROJECT_ID=${PROJECT_ID:-"investment-advisor-bot-2025"}

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

# Check if gcloud is installed
if ! command -v gcloud >/dev/null 2>&1; then
    print_error "gcloud CLI is not installed. Please install it first."
    exit 1
fi

print_status "Setting up persistent GCP authentication..."

# Check current authentication status
print_status "Checking current authentication status..."
if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_success "Already authenticated with account: $(gcloud auth list --filter=status:ACTIVE --format="value(account)")"
else
    print_status "No active authentication found. Please authenticate..."
    gcloud auth login --no-launch-browser
fi

# Set the project
print_status "Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Set up application default credentials with longer expiration
print_status "Setting up application default credentials..."
gcloud auth application-default login --no-launch-browser --quiet

# Configure credential helper for longer persistence
print_status "Configuring credential helper for longer persistence..."
gcloud config set auth/credential_helper gcloud.sh

# Set longer token expiration (if supported)
print_status "Setting longer token expiration..."
gcloud config set auth/access_token_expiry 3600

print_success "Authentication setup completed!"
echo ""
print_status "Your credentials are now configured for:"
echo "  Project: $PROJECT_ID"
echo "  Account: $(gcloud auth list --filter=status:ACTIVE --format="value(account)")"
echo ""
print_warning "Note: Credentials may still expire after some time. If you encounter authentication issues, run this script again." 