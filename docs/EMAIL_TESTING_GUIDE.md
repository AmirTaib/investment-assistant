# 🧪 Email Testing Guide

This guide covers how to test the email functionality both locally and after deployment.

## 📋 **Prerequisites**

Before testing, ensure you have:

1. ✅ **GCP Project Setup**
   - Authenticated with `gcloud auth login`
   - Project set to `investment-advisor-bot-2025`
   - Required APIs enabled

2. ✅ **Configuration Setup**
   - Run `./setup-config.sh` to set up Secret Manager
   - Configuration stored in GCP Secret Manager

3. ✅ **Gmail API Setup**
   - Run `./setup-gmail-api.sh` to set up Gmail API
   - Credentials stored in Secret Manager

## 🏠 **Local Testing**

### Option 1: Quick Setup Script

```bash
# Run the automated setup script
./test-email-local.sh
```

This script will:
- Check prerequisites
- Install dependencies
- Test configuration
- Test email service
- Provide next steps

### Option 2: Manual Testing

#### Step 1: Install Dependencies
```bash
cd backend
pip3 install -r requirements.txt
cd ..
```

#### Step 2: Test Configuration
```bash
cd backend
python3 -c "
import sys
sys.path.append('.')
from config_service import config_service

config = config_service.get_config()
print('✅ Configuration loaded')
print(f'📧 Email: {config.get(\"RECIPIENT_EMAIL\")}')
print(f'🔑 Secret: {config.get(\"SECRET_NAME\")}')
"
cd ..
```

#### Step 3: Test Email Service
```bash
cd backend
python3 -c "
import sys
sys.path.append('.')
from email_service import EmailService

email_service = EmailService()
credentials = email_service.get_gmail_credentials()
print('✅ Gmail credentials retrieved')
"
cd ..
```

#### Step 4: Run Backend Locally
```bash
cd backend
python3 main.py
```

#### Step 5: Test Endpoints
```bash
# Test health
curl http://localhost:5000/health

# Test configuration
curl http://localhost:5000/api/config/status

# Test email (without sending)
curl -X POST http://localhost:5000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","body":"Test email"}'

# Test afternoon updates
curl http://localhost:5000/api/insights/afternoon/midday
curl http://localhost:5000/api/insights/afternoon/end-of-day
```

## 🚀 **Deployed Testing**

### Option 1: Full Deployment Script

```bash
# Deploy everything with email features
./deploy-with-email.sh
```

This script will:
- Enable all required APIs
- Set up configuration and Gmail API
- Deploy the backend
- Create cron jobs
- Test all endpoints

### Option 2: Manual Deployment

#### Step 1: Deploy Backend
```bash
./deploy-simple.sh
```

#### Step 2: Setup Configuration
```bash
./setup-config.sh
```

#### Step 3: Setup Gmail API
```bash
./setup-gmail-api.sh
```

#### Step 4: Get Service URL
```bash
SERVICE_URL=$(gcloud run services describe investment-assistant-backend --region=us-central1 --format="value(status.url)")
echo "Service URL: $SERVICE_URL"
```

### Testing Deployed Endpoints

```bash
# Test health
curl $SERVICE_URL/health

# Test configuration
curl $SERVICE_URL/api/config/status

# Test email (without sending)
curl -X POST $SERVICE_URL/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","body":"Test email"}'

# Test afternoon updates
curl $SERVICE_URL/api/insights/afternoon/midday
curl $SERVICE_URL/api/insights/afternoon/end-of-day
```

## 📧 **Email Testing Scenarios**

### 1. **Basic Email Test**
```bash
curl -X POST $SERVICE_URL/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "🧪 Test Email",
    "body": "This is a test email from the Investment Assistant system."
  }'
```

### 2. **Afternoon Update Test**
```bash
# Test midday update (1:00 PM)
curl $SERVICE_URL/api/insights/afternoon/midday

# Test end-of-day update (5:00 PM)
curl $SERVICE_URL/api/insights/afternoon/end-of-day
```

### 3. **Configuration Test**
```bash
curl $SERVICE_URL/api/config/status
```

Expected response:
```json
{
  "status": "success",
  "config_valid": true,
  "issues": [],
  "config_source": "GCP Secret Manager",
  "timestamp": "2025-01-19T21:30:00"
}
```

## 🔍 **Troubleshooting**

### Common Issues

#### 1. **Configuration Errors**
```bash
# Check if configuration is loaded
curl $SERVICE_URL/api/config/status

# If issues found, check Secret Manager
gcloud secrets versions access latest --secret="investment-assistant-config"
```

#### 2. **Gmail API Errors**
```bash
# Check if Gmail API is enabled
gcloud services list --enabled | grep gmail

# Check if credentials exist
gcloud secrets versions access latest --secret="investment-bot-service-secret-key"
```

#### 3. **Permission Errors**
```bash
# Check if service account has permissions
gcloud projects get-iam-policy investment-advisor-bot-2025 \
  --flatten="bindings[].members" \
  --format="table(bindings.role)" \
  --filter="bindings.members:serviceAccount"
```

#### 4. **Deployment Errors**
```bash
# Check Cloud Run logs
gcloud logs tail --service=investment-assistant-backend --region=us-central1

# Check scheduler logs
gcloud scheduler jobs list
gcloud scheduler jobs describe afternoon-insight-1pm-job --location=us-central1
```

### Debug Commands

#### Check Service Status
```bash
# List Cloud Run services
gcloud run services list --region=us-central1

# Get service details
gcloud run services describe investment-assistant-backend --region=us-central1
```

#### Check Scheduler Jobs
```bash
# List scheduler jobs
gcloud scheduler jobs list --location=us-central1

# Test a job manually
gcloud scheduler jobs run afternoon-insight-1pm-job --location=us-central1
```

#### Check Secrets
```bash
# List secrets
gcloud secrets list

# Check secret versions
gcloud secrets versions list investment-assistant-config
gcloud secrets versions list investment-bot-service-secret-key
```

## 📊 **Monitoring**

### Logs to Monitor
```bash
# Real-time logs
gcloud logs tail --service=investment-assistant-backend --region=us-central1

# Filter for email-related logs
gcloud logs tail --service=investment-assistant-backend --region=us-central1 --filter="textPayload:email"

# Filter for afternoon updates
gcloud logs tail --service=investment-assistant-backend --region=us-central1 --filter="textPayload:afternoon"
```

### Key Metrics to Watch
- Email delivery success rate
- Configuration validation status
- Afternoon update generation frequency
- Change detection accuracy

## ✅ **Success Criteria**

Your email system is working correctly when:

1. ✅ **Configuration Test Passes**
   - `curl $SERVICE_URL/api/config/status` returns valid config

2. ✅ **Email Test Passes**
   - `curl -X POST $SERVICE_URL/api/email/test` returns success
   - You receive the test email

3. ✅ **Afternoon Updates Work**
   - `curl $SERVICE_URL/api/insights/afternoon/midday` generates insights
   - `curl $SERVICE_URL/api/insights/afternoon/end-of-day` generates insights

4. ✅ **Cron Jobs Are Active**
   - `gcloud scheduler jobs list` shows all 3 jobs
   - Jobs run at scheduled times

5. ✅ **Emails Are Sent Intelligently**
   - Emails only sent when significant changes detected
   - Hebrew content in emails
   - Professional formatting

## 🎯 **Next Steps**

After successful testing:

1. **Monitor the system** for a few days
2. **Check email delivery** at scheduled times
3. **Verify change detection** is working correctly
4. **Adjust configuration** if needed via Secret Manager

---

**Need Help?** Check the logs and use the troubleshooting commands above. The system is designed to be robust and provide clear error messages. 