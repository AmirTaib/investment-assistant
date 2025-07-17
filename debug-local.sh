#!/bin/bash

# Debug script for Investment Assistant Bot local development
# This script helps diagnose common issues

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

echo "=== Investment Assistant Bot - Debug Script ==="
echo ""

# Check system information
print_status "System Information:"
echo "  OS: $(uname -s)"
echo "  Architecture: $(uname -m)"
echo "  Shell: $SHELL"
echo ""

# Check directory structure
print_status "Checking directory structure..."
if [ -d "app" ]; then
    print_success "✓ app directory exists"
    if [ -f "app/package.json" ]; then
        print_success "✓ app/package.json exists"
    else
        print_error "✗ app/package.json missing"
    fi
else
    print_error "✗ app directory missing"
fi

if [ -d "backend" ]; then
    print_success "✓ backend directory exists"
    if [ -f "backend/main.py" ]; then
        print_success "✓ backend/main.py exists"
    else
        print_error "✗ backend/main.py missing"
    fi
    if [ -f "backend/requirements.txt" ]; then
        print_success "✓ backend/requirements.txt exists"
    else
        print_error "✗ backend/requirements.txt missing"
    fi
else
    print_error "✗ backend directory missing"
fi
echo ""

# Check prerequisites
print_status "Checking prerequisites..."

# Python
if command -v python3 >/dev/null 2>&1; then
    PYTHON_VERSION=$(python3 --version 2>&1)
    print_success "✓ Python: $PYTHON_VERSION"
else
    print_error "✗ Python 3 not found"
fi

# pip
if command -v pip3 >/dev/null 2>&1; then
    PIP_VERSION=$(pip3 --version 2>&1)
    print_success "✓ pip: $PIP_VERSION"
else
    print_error "✗ pip3 not found"
fi

# Node.js
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version 2>&1)
    print_success "✓ Node.js: $NODE_VERSION"
else
    print_error "✗ Node.js not found"
fi

# npm
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version 2>&1)
    print_success "✓ npm: $NPM_VERSION"
else
    print_error "✗ npm not found"
fi

# gcloud
if command -v gcloud >/dev/null 2>&1; then
    GCLOUD_VERSION=$(gcloud --version | head -1)
    print_success "✓ gcloud: $GCLOUD_VERSION"
else
    print_error "✗ gcloud not found"
fi
echo ""

# Check ports
print_status "Checking port availability..."
if lsof -i :8080 >/dev/null 2>&1; then
    print_warning "⚠ Port 8080 is in use"
    lsof -i :8080
else
    print_success "✓ Port 8080 is available"
fi

if lsof -i :3000 >/dev/null 2>&1; then
    print_warning "⚠ Port 3000 is in use"
    lsof -i :3000
else
    print_success "✓ Port 3000 is available"
fi
echo ""

# Check virtual environment
print_status "Checking Python virtual environment..."
if [ -d "backend/venv" ]; then
    print_success "✓ Virtual environment exists"
    if [ -f "backend/venv/bin/activate" ]; then
        print_success "✓ Virtual environment is properly configured"
    else
        print_error "✗ Virtual environment activation script missing"
    fi
else
    print_warning "⚠ Virtual environment not found (will be created)"
fi
echo ""

# Check node_modules
print_status "Checking frontend dependencies..."
if [ -d "app/node_modules" ]; then
    print_success "✓ Frontend dependencies installed"
else
    print_warning "⚠ Frontend dependencies not installed (will be installed)"
fi
echo ""

# Check GCP authentication
print_status "Checking GCP authentication..."
if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_success "✓ GCP authenticated"
    gcloud auth list --filter=status:ACTIVE --format="table(account,status)"
else
    print_warning "⚠ GCP not authenticated"
fi
echo ""

# Check application default credentials
print_status "Checking application default credentials..."
if gcloud auth application-default print-access-token >/dev/null 2>&1; then
    print_success "✓ Application default credentials configured"
else
    print_warning "⚠ Application default credentials not configured"
fi
echo ""

# Check project configuration
print_status "Checking GCP project configuration..."
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || echo "Not set")
if [ "$CURRENT_PROJECT" != "Not set" ]; then
    print_success "✓ Current project: $CURRENT_PROJECT"
else
    print_warning "⚠ No project configured"
fi
echo ""

# Check for log files
print_status "Checking for log files..."
if [ -f "backend.log" ]; then
    print_warning "⚠ Backend log file exists (may indicate previous run)"
    echo "  Last 10 lines of backend.log:"
    tail -10 backend.log 2>/dev/null || echo "  (empty or unreadable)"
else
    print_success "✓ No backend log file found"
fi

if [ -f "frontend.log" ]; then
    print_warning "⚠ Frontend log file exists (may indicate previous run)"
    echo "  Last 10 lines of frontend.log:"
    tail -10 frontend.log 2>/dev/null || echo "  (empty or unreadable)"
else
    print_success "✓ No frontend log file found"
fi
echo ""

# Check for PID file
print_status "Checking for running processes..."
if [ -f "/tmp/investment-assistant-pids.txt" ]; then
    print_warning "⚠ PID file exists (may indicate running processes)"
    echo "  PIDs in file:"
    cat /tmp/investment-assistant-pids.txt 2>/dev/null || echo "  (empty or unreadable)"
else
    print_success "✓ No PID file found"
fi
echo ""

# Check environment variables
print_status "Checking environment variables..."
if [ -n "$PROJECT_ID" ]; then
    print_success "✓ PROJECT_ID: $PROJECT_ID"
else
    print_warning "⚠ PROJECT_ID not set (will use default)"
fi

if [ -n "$SECRET_NAME" ]; then
    print_success "✓ SECRET_NAME: $SECRET_NAME"
else
    print_warning "⚠ SECRET_NAME not set (will use default)"
fi
echo ""

# Recommendations
print_status "Recommendations:"
echo "1. If any prerequisites are missing, install them first"
echo "2. If ports are in use, either stop the processes or use different ports"
echo "3. If GCP is not authenticated, run: gcloud auth login"
echo "4. If application default credentials are missing, run: gcloud auth application-default login"
echo "5. If you see log files, they may contain error information from previous runs"
echo "6. If PID file exists, there may be orphaned processes - check and kill if needed"
echo ""

print_success "Debug check completed!" 