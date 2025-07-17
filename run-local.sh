#!/bin/bash
export PATH="$PATH:/opt/homebrew/bin"

# Investment Assistant Bot - Local Development Script
# This script runs both the React frontend and Python backend locally

set -e  # Exit on any error

# Configuration
PROJECT_ID=${PROJECT_ID:-"investment-advisor-bot-2025"}
SECRET_NAME=${SECRET_NAME:-"investment-bot-service-secret-key"}
BACKEND_PORT=${BACKEND_PORT:-8080}
FRONTEND_PORT=${FRONTEND_PORT:-3000}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Global variables for process management
BACKEND_PID=""
FRONTEND_PID=""
PIDS_FILE="/tmp/investment-assistant-pids.txt"

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

# Function to check if port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to kill process on port
kill_port() {
    local port=$1
    if port_in_use $port; then
        print_warning "Port $port is in use. Attempting to kill existing process..."
        lsof -ti :$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists python3; then
        missing_deps+=("python3")
    fi
    
    if ! command_exists pip3; then
        missing_deps+=("pip3")
    fi
    
    if ! command_exists node; then
        missing_deps+=("node")
    fi
    
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    if ! command_exists gcloud; then
        missing_deps+=("gcloud")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_status "Please install the missing dependencies and try again."
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
        gcloud auth login --no-launch-browser
    fi
    
    # Set the project
    gcloud config set project $PROJECT_ID
    
    # Set up application default credentials with longer expiration
    print_status "Setting up application default credentials..."
    gcloud auth application-default login --no-launch-browser --quiet
    
    print_success "GCP authentication completed"
}

# Function to setup frontend
setup_frontend() {
    print_status "Setting up React frontend..."
    
    if [ ! -d "app" ]; then
        print_error "app directory not found"
        exit 1
    fi
    
    cd app
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in app directory"
        exit 1
    fi
    
    # Install dependencies if node_modules doesn't exist or package.json is newer
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    cd ..
    print_success "Frontend setup completed"
}

# Function to create virtual environment
setup_virtual_environment() {
    print_status "Setting up Python virtual environment..."
    
    if [ ! -d "backend" ]; then
        print_error "backend directory not found"
        exit 1
    fi
    
    cd backend
    
    if [ ! -d "venv" ]; then
        print_status "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Upgrade pip
    pip install --upgrade pip
    
    cd ..
    print_success "Virtual environment setup completed"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing Python dependencies..."
    
    if [ ! -f "backend/requirements.txt" ]; then
        print_error "backend/requirements.txt not found"
        exit 1
    fi
    
    cd backend
    source venv/bin/activate
    
    # Check if requirements.txt is newer than installed packages
    if [ "requirements.txt" -nt "venv/lib/python*/site-packages" ] 2>/dev/null || [ ! -d "venv/lib/python*/site-packages" ]; then
        print_status "Installing/updating dependencies..."
        pip install -r requirements.txt
    else
        print_status "Dependencies already up to date"
    fi
    
    cd ..
    print_success "Dependencies installed successfully"
}

# Function to create .env file
create_env_file() {
    print_status "Creating .env file..."
    
    cd backend
    
    if [ ! -f ".env" ] || [ "env.example" -nt ".env" ]; then
        cat > .env << EOF
# GCP Configuration
PROJECT_ID=$PROJECT_ID
SECRET_NAME=$SECRET_NAME

# Application Configuration
FLASK_ENV=development
DEBUG=true
PORT=$BACKEND_PORT

# Logging
LOG_LEVEL=INFO
EOF
        print_success ".env file created/updated"
    else
        print_warning ".env file already exists and is up to date"
    fi
    
    cd ..
}

# Function to test GCP connectivity
test_gcp_connectivity() {
    print_status "Testing GCP connectivity..."
    
    # Test Secret Manager access
    if gcloud secrets describe $SECRET_NAME --project=$PROJECT_ID >/dev/null 2>&1; then
        print_success "Secret Manager access confirmed"
    else
        print_error "Cannot access secret '$SECRET_NAME'. Please check your permissions."
        exit 1
    fi
    
    # Test Firestore access
    if gcloud firestore databases list --project=$PROJECT_ID >/dev/null 2>&1; then
        print_success "Firestore access confirmed"
    else
        print_warning "Cannot access Firestore. Some features may not work."
    fi
}

# Function to start backend
start_backend() {
    print_status "Starting Python backend..."
    
    # Kill any existing process on the port
    kill_port $BACKEND_PORT
    
    cd backend
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Set environment variables
    export PROJECT_ID=$PROJECT_ID
    export SECRET_NAME=$SECRET_NAME
    export FLASK_ENV=development
    export DEBUG=true
    export PORT=$BACKEND_PORT
    
    print_status "Backend will be available at: http://localhost:$BACKEND_PORT"
    
    # Run the Flask application in background
    python main.py > ../backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Save PID to file for cleanup
    echo $BACKEND_PID > $PIDS_FILE
    
    cd ..
    
    # Wait a moment for the server to start
    sleep 3
    
    # Check if backend started successfully
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_success "Backend started with PID: $BACKEND_PID"
    else
        print_error "Backend failed to start. Check backend.log for details."
        exit 1
    fi
}

# Function to start frontend
start_frontend() {
    print_status "Starting React frontend..."
    
    # Kill any existing process on the port
    kill_port $FRONTEND_PORT
    
    cd app
    
    # Set environment variables for React
    export REACT_APP_API_URL=http://localhost:$BACKEND_PORT
    export REACT_APP_PROJECT_ID=$PROJECT_ID
    export PORT=$FRONTEND_PORT
    
    print_status "Frontend will be available at: http://localhost:$FRONTEND_PORT"
    
    # Run the React application in background
    npm start > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Save PID to file for cleanup
    echo $FRONTEND_PID >> $PIDS_FILE
    
    cd ..
    
    # Wait a moment for the server to start
    sleep 5
    
    # Check if frontend started successfully
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        print_success "Frontend started with PID: $FRONTEND_PID"
    else
        print_error "Frontend failed to start. Check frontend.log for details."
        exit 1
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --project-id PROJECT_ID    GCP Project ID (default: investment-advisor-bot-2025)"
    echo "  --secret-name NAME         Secret name in Secret Manager (default: investment-bot-service-secret-key)"
    echo "  --backend-port PORT        Backend port (default: 8080)"
    echo "  --frontend-port PORT       Frontend port (default: 3000)"
    echo "  --skip-auth                Skip GCP authentication (if already authenticated)"
    echo "  --skip-deps                Skip dependency installation"
    echo "  --backend-only             Start only the backend"
    echo "  --frontend-only            Start only the frontend"
    echo "  --help                     Show this help message"
    echo ""
    echo "Environment variables:"
    echo "  PROJECT_ID                 GCP Project ID"
    echo "  SECRET_NAME                Secret name in Secret Manager"
    echo "  BACKEND_PORT               Backend port"
    echo "  FRONTEND_PORT              Frontend port"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Run both frontend and backend"
    echo "  $0 --project-id my-project            # Run with specific project"
    echo "  $0 --backend-port 9000                # Run backend on port 9000"
    echo "  $0 --skip-auth                        # Skip authentication"
    echo "  $0 --backend-only                     # Start only backend"
}

# Function to cleanup on exit
cleanup() {
    print_status "Cleaning up..."
    
    # Kill processes from PID file
    if [ -f "$PIDS_FILE" ]; then
        while read -r pid; do
            if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
                print_status "Stopping process (PID: $pid)..."
                kill "$pid" 2>/dev/null || true
            fi
        done < "$PIDS_FILE"
        rm -f "$PIDS_FILE"
    fi
    
    # Kill processes by port
    kill_port $BACKEND_PORT
    kill_port $FRONTEND_PORT
    
    # Deactivate virtual environment if active
    if [ -n "$VIRTUAL_ENV" ]; then
        deactivate
    fi
    
    print_success "Cleanup completed"
}

# Parse command line arguments
SKIP_AUTH=false
SKIP_DEPS=false
BACKEND_ONLY=false
FRONTEND_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --project-id)
            PROJECT_ID="$2"
            shift 2
            ;;
        --secret-name)
            SECRET_NAME="$2"
            shift 2
            ;;
        --backend-port)
            BACKEND_PORT="$2"
            shift 2
            ;;
        --frontend-port)
            FRONTEND_PORT="$2"
            shift 2
            ;;
        --skip-auth)
            SKIP_AUTH=true
            shift
            ;;
        --skip-deps)
            SKIP_DEPS=true
            shift
            ;;
        --backend-only)
            BACKEND_ONLY=true
            shift
            ;;
        --frontend-only)
            FRONTEND_ONLY=true
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

# Set up trap to cleanup on exit
trap cleanup EXIT INT TERM

# Main function
main() {
    print_status "Starting local development setup..."
    print_status "Project ID: $PROJECT_ID"
    print_status "Secret Name: $SECRET_NAME"
    print_status "Backend Port: $BACKEND_PORT"
    print_status "Frontend Port: $FRONTEND_PORT"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Authenticate with GCP (unless skipped)
    if [ "$SKIP_AUTH" = false ]; then
        authenticate_gcp
    else
        print_warning "Skipping GCP authentication"
    fi
    
    # Setup frontend (unless backend-only)
    if [ "$FRONTEND_ONLY" = false ]; then
        setup_frontend
    fi
    
    # Set up virtual environment (unless frontend-only)
    if [ "$BACKEND_ONLY" = false ]; then
        setup_virtual_environment
        
        # Install dependencies (unless skipped)
        if [ "$SKIP_DEPS" = false ]; then
            install_dependencies
        else
            print_warning "Skipping dependency installation"
        fi
        
        # Create .env file
        create_env_file
        
        # Test GCP connectivity
        test_gcp_connectivity
    fi
    
    # Start services
    if [ "$FRONTEND_ONLY" = true ]; then
        start_frontend
    elif [ "$BACKEND_ONLY" = true ]; then
        start_backend
    else
        # Start both services
        start_backend
        sleep 3  # Give backend time to start
        start_frontend
    fi
    
    print_success "Services started successfully!"
    echo ""
    print_status "Access your application:"
    if [ "$BACKEND_ONLY" = false ]; then
        echo "  Frontend: http://localhost:$FRONTEND_PORT"
    fi
    if [ "$FRONTEND_ONLY" = false ]; then
        echo "  Backend API: http://localhost:$BACKEND_PORT"
        echo "  Health Check: http://localhost:$BACKEND_PORT/health"
    fi
    echo ""
    print_status "Logs:"
    echo "  Backend: backend.log"
    echo "  Frontend: frontend.log"
    echo ""
    print_status "Press Ctrl+C to stop all services"
    
    # Wait for user to stop
    wait
}

# Run main function
main "$@" 