#!/bin/bash

# Investment Assistant Bot - Deployment Script
# This script deploys the application to Google Cloud Run with Secret Manager integration

set -e  # Exit on any error

# Configuration
PROJECT_ID=${PROJECT_ID:-"investment-advisor-bot-2025"}
REGION=${REGION:-"us-central1"}
SERVICE_NAME=${SERVICE_NAME:-"investment-assistant"}
SECRET_NAME=${SECRET_NAME:-"investment-bot-service-secret-key"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists gcloud; then
        print_error "gcloud CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to authenticate with GCP
authenticate_gcp() {
    print_status "Authenticating with Google Cloud..."
    
    # Check if already authenticated
    if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        print_success "Already authenticated with GCP"
    else
        print_status "Please authenticate with Google Cloud..."
        gcloud auth login
    fi
    
    # Set the project
    gcloud config set project $PROJECT_ID
    
    print_success "GCP authentication completed"
}

# Function to enable required APIs
enable_apis() {
    print_status "Enabling required Google Cloud APIs..."
    
    apis=(
        "cloudbuild.googleapis.com"
        "run.googleapis.com"
        "secretmanager.googleapis.com"
        "firestore.googleapis.com"
        "cloudscheduler.googleapis.com"
    )
    
    for api in "${apis[@]}"; do
        print_status "Enabling $api..."
        gcloud services enable $api --quiet
    done
    
    print_success "All required APIs enabled"
}

# Function to check if secret exists
check_secret() {
    print_status "Checking if secret '$SECRET_NAME' exists..."
    
    if gcloud secrets describe $SECRET_NAME --project=$PROJECT_ID >/dev/null 2>&1; then
        print_success "Secret '$SECRET_NAME' exists"
        return 0
    else
        print_warning "Secret '$SECRET_NAME' does not exist"
        return 1
    fi
}

# Function to create secret from service account key
create_secret() {
    print_status "Creating secret '$SECRET_NAME'..."
    
    # Check if service account key file exists
    if [ ! -f "backend/service-account-key.json" ]; then
        print_error "backend/service-account-key.json not found. Please create a service account key first."
        print_status "You can create one at: https://console.cloud.google.com/iam-admin/serviceaccounts"
  exit 1
fi

    # Create the secret
    gcloud secrets create $SECRET_NAME --replication-policy="automatic" --project=$PROJECT_ID
    
    # Add the secret version
    gcloud secrets versions add $SECRET_NAME --data-file="backend/service-account-key.json" --project=$PROJECT_ID
    
    print_success "Secret '$SECRET_NAME' created successfully"
}

# Function to build and deploy to Cloud Run
deploy_to_cloud_run() {
    print_status "Building and deploying to Cloud Run..."
    
    # Build the container
    print_status "Building Docker container..."
    cd backend
    gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME .
    
    # Deploy to Cloud Run
    print_status "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
        --allow-unauthenticated \
        --set-env-vars "PROJECT_ID=$PROJECT_ID,SECRET_NAME=$SECRET_NAME" \
        --memory 1Gi \
        --cpu 1 \
        --timeout 300 \
        --concurrency 80 \
        --max-instances 10
    
    cd ..
    print_success "Deployment completed successfully"
}

# Function to get the service URL
get_service_url() {
    print_status "Getting service URL..."
    
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
    
    if [ -n "$SERVICE_URL" ]; then
        print_success "Service is available at: $SERVICE_URL"
        echo ""
        print_status "You can test the service with:"
        echo "curl $SERVICE_URL/health"
        echo "curl $SERVICE_URL/api/insights/daily"
    else
        print_error "Could not retrieve service URL"
    fi
}

# Function to set up Cloud Scheduler (optional)
setup_scheduler() {
    print_status "Setting up Cloud Scheduler for daily insights..."
    
    # Create a job to trigger daily insights
    gcloud scheduler jobs create http daily-insight-job \
        --schedule="0 8 * * *" \
        --uri="$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')/api/insights/daily" \
        --http-method=GET \
        --location=$REGION \
        --description="Daily investment insight generation" \
        --quiet
    
    print_success "Cloud Scheduler job created"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --project-id PROJECT_ID    GCP Project ID (default: investment-advisor-bot-2025)"
    echo "  --region REGION           GCP Region (default: us-central1)"
    echo "  --service-name NAME       Cloud Run service name (default: investment-assistant)"
    echo "  --secret-name NAME        Secret name in Secret Manager (default: investment-bot-service-secret-key)"
    echo "  --create-secret           Create secret from backend/service-account-key.json"
    echo "  --setup-scheduler         Set up Cloud Scheduler for daily insights"
    echo "  --help                    Show this help message"
    echo ""
    echo "Environment variables:"
    echo "  PROJECT_ID                GCP Project ID"
    echo "  REGION                    GCP Region"
    echo "  SERVICE_NAME              Cloud Run service name"
    echo "  SECRET_NAME               Secret name in Secret Manager"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Deploy with defaults"
    echo "  $0 --project-id my-project            # Deploy to specific project"
    echo "  $0 --create-secret                    # Create secret and deploy"
    echo "  $0 --setup-scheduler                  # Deploy with scheduler"
}

# Parse command line arguments
CREATE_SECRET=false
SETUP_SCHEDULER=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --project-id)
            PROJECT_ID="$2"
            shift 2
            ;;
        --region)
            REGION="$2"
            shift 2
            ;;
        --service-name)
            SERVICE_NAME="$2"
            shift 2
            ;;
        --secret-name)
            SECRET_NAME="$2"
            shift 2
            ;;
        --create-secret)
            CREATE_SECRET=true
            shift
            ;;
        --setup-scheduler)
            SETUP_SCHEDULER=true
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Main deployment process
main() {
    print_status "Starting deployment process..."
    print_status "Project ID: $PROJECT_ID"
    print_status "Region: $REGION"
    print_status "Service Name: $SERVICE_NAME"
    print_status "Secret Name: $SECRET_NAME"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Authenticate with GCP
    authenticate_gcp
    
    # Enable required APIs
    enable_apis
    
    # Handle secret creation if requested
    if [ "$CREATE_SECRET" = true ]; then
        create_secret
    else
        # Check if secret exists
        if ! check_secret; then
            print_error "Secret '$SECRET_NAME' does not exist. Use --create-secret to create it."
            exit 1
        fi
    fi
    
    # Deploy to Cloud Run
    deploy_to_cloud_run
    
    # Get service URL
    get_service_url
    
    # Set up scheduler if requested
    if [ "$SETUP_SCHEDULER" = true ]; then
        setup_scheduler
    fi
    
    print_success "Deployment completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "1. Test the service endpoints"
    echo "2. Monitor logs: gcloud logs tail --service=$SERVICE_NAME --region=$REGION"
    echo "3. Update service: gcloud run services update $SERVICE_NAME --region=$REGION"
}

# Run main function
main "$@"
