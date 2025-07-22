# Local Development Guide

This guide explains how to run the Investment Assistant application locally.

## Quick Start

### 1. Set up Authentication (One-time setup)

First, set up persistent authentication with Google Cloud:

```bash
./setup-auth.sh
```

This will:
- Authenticate you with Google Cloud
- Set up application default credentials
- Configure longer token expiration
- Set the correct project

### 2. Run the Application

Start both the React frontend and Python backend:

```bash
./run-local.sh
```

This will:
- Start the React frontend on http://localhost:3000
- Start the Python backend on http://localhost:8080
- Install dependencies if needed
- Set up the virtual environment
- Handle port conflicts automatically
- Provide detailed logging

## Debugging

### Run Debug Script

If you encounter issues, run the debug script to diagnose problems:

```bash
./debug-local.sh
```

This will check:
- System prerequisites (Python, Node.js, gcloud, etc.)
- Directory structure
- Port availability
- GCP authentication status
- Virtual environment setup
- Dependencies installation
- Running processes
- Log files

### Common Issues and Solutions

#### Port Already in Use
The improved script automatically handles port conflicts by killing existing processes. If you still have issues:

```bash
# Check what's using the ports
lsof -i :8080
lsof -i :3000

# Kill processes manually if needed
kill -9 <PID>
```

#### Authentication Issues

If you're asked to login to Google every time:

1. Run the authentication setup script:
   ```bash
   ./setup-auth.sh
   ```

2. If that doesn't work, try running with skip auth:
   ```bash
   ./run-local.sh --skip-auth
   ```

#### Client Not Loading

If the React app doesn't load:

1. Check if Node.js and npm are installed:
   ```bash
   node --version
   npm --version
   ```

2. Try starting only the frontend first:
   ```bash
   ./run-local.sh --frontend-only
   ```

3. Check the browser console for errors

4. Check the frontend log file:
   ```bash
   tail -f frontend.log
   ```

#### Backend Issues

If the backend doesn't start:

1. Check if Python 3 is installed:
   ```bash
   python3 --version
   ```

2. Try starting only the backend:
   ```bash
   ./run-local.sh --backend-only
   ```

3. Check the backend log file:
   ```bash
   tail -f backend.log
   ```

4. Check if the virtual environment is properly set up:
   ```bash
   ls -la backend/venv/
   ```

## Script Options

### run-local.sh Options

- `--project-id PROJECT_ID` - Set GCP Project ID
- `--secret-name NAME` - Set Secret Manager secret name
- `--backend-port PORT` - Set backend port (default: 8080)
- `--frontend-port PORT` - Set frontend port (default: 3000)
- `--skip-auth` - Skip GCP authentication
- `--skip-deps` - Skip dependency installation
- `--backend-only` - Start only the backend
- `--frontend-only` - Start only the frontend
- `--help` - Show help message

### Examples

```bash
# Run with custom ports
./run-local.sh --backend-port 9000 --frontend-port 3001

# Run with custom project
./run-local.sh --project-id my-custom-project

# Start only backend (for API testing)
./run-local.sh --backend-only

# Start only frontend (if backend is already running)
./run-local.sh --frontend-only

# Skip dependency installation (faster startup)
./run-local.sh --skip-deps
```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health
- **Backend API Endpoints**:
  - `GET /` - Health check
  - `GET /health` - Detailed health check
  - `GET /api/insights/daily` - Get daily investment insight
  - `GET /api/insights/recent` - Get recent insights
  - `GET /api/portfolio/summary` - Get portfolio summary
  - `GET /api/portfolio/risk` - Get risk assessment
  - `GET /api/reports/weekly` - Get weekly report
  - `GET /api/stocks/<symbol>` - Get stock information
  - `GET /api/stocks/<symbol>/history` - Get stock history
  - `GET /api/stocks/<symbol>/sentiment` - Get stock sentiment

## Logging

The improved script provides detailed logging:

- **Backend logs**: `backend.log`
- **Frontend logs**: `frontend.log`
- **Process management**: `/tmp/investment-assistant-pids.txt`

To monitor logs in real-time:
```bash
# Monitor backend logs
tail -f backend.log

# Monitor frontend logs
tail -f frontend.log
```

## Stopping the Application

Press `Ctrl+C` in the terminal where you ran `./run-local.sh` to stop both services. The script will automatically clean up processes and remove temporary files.

## Environment Variables

The following environment variables can be set:

- `PROJECT_ID` - GCP Project ID (default: investment-advisor-bot-2025)
- `SECRET_NAME` - Secret Manager secret name (default: investment-bot-service-secret-key)
- `BACKEND_PORT` - Backend port (default: 8080)
- `FRONTEND_PORT` - Frontend port (default: 3000)

Example:
```bash
export PROJECT_ID=my-project
export BACKEND_PORT=9000
./run-local.sh
```

## Improvements in the Latest Version

The `run-local.sh` script has been significantly improved with:

1. **Better error handling** - More descriptive error messages and graceful failure handling
2. **Automatic port management** - Automatically kills processes using required ports
3. **Process tracking** - Better process management with PID files
4. **Dependency checking** - Smarter dependency installation (only when needed)
5. **Logging** - Separate log files for frontend and backend
6. **Health checks** - Verifies services start successfully
7. **Cleanup** - Proper cleanup of processes and temporary files
8. **Debug support** - New `debug-local.sh` script for troubleshooting 