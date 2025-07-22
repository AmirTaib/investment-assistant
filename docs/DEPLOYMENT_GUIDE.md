# 🚀 Deployment Guide - Investment Assistant

This guide covers the complete deployment process using the unified `deploy.sh` script.

## 📋 **What the Script Does**

The `deploy.sh` script is a comprehensive deployment solution that handles:

### ✅ **Complete Setup**
- ✅ GCP authentication and project setup
- ✅ All required API enabling
- ✅ Configuration management in Secret Manager
- ✅ Gmail API setup
- ✅ Backend deployment to Cloud Run
- ✅ Firebase Functions deployment
- ✅ Firebase Hosting deployment (React app)
- ✅ Cron job creation (3 scheduled jobs)
- ✅ End-to-end testing

### 🕐 **Cron Job Schedule**
- **8:00 AM Israel time** - Morning update
- **1:00 PM Israel time** - Midday update (intelligent filtering)
- **5:00 PM Israel time** - End-of-day update (intelligent filtering)

## 🚀 **Quick Deployment**

### **One Command Deployment**
```bash
./deploy.sh
```

That's it! The script will handle everything automatically.

## 📋 **Prerequisites**

Before running the deployment, ensure you have:

1. **gcloud CLI installed and authenticated**
   ```bash
   gcloud auth login
   ```

2. **Project access**
   - Access to `investment-advisor-bot-2025` project
   - Billing enabled

3. **Required files**
   - `backend/main.py` (Flask application)
   - `backend/requirements.txt` (Python dependencies)
   - `functions/` (Firebase Functions)
   - `app/` (React frontend)
   - `firebase.json` (Firebase configuration)
   - `setup-config.sh` (optional, for advanced configuration)
   - `setup-gmail-api.sh` (optional, for Gmail setup)

4. **Firebase CLI setup**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init  # If not already initialized
   ```

## 🔧 **What Gets Deployed**

### **GCP Services**
- **Cloud Run**: Backend application
- **Cloud Scheduler**: 3 cron jobs
- **Secret Manager**: Configuration and credentials
- **Gmail API**: Email functionality
- **Firestore**: Data storage
- **Firebase Functions**: Serverless functions
- **Firebase Hosting**: React frontend

### **Application Features**
- **Morning insights**: Daily at 8:00 AM
- **Afternoon updates**: 1:00 PM and 5:00 PM (intelligent filtering)
- **Email notifications**: Only when significant changes detected
- **Hebrew responses**: All insights in Hebrew
- **Configuration management**: Centralized via Secret Manager

## 🧪 **Testing After Deployment**

The script automatically tests all endpoints:

```bash
# Health check
curl $SERVICE_URL/health

# Configuration status
curl $SERVICE_URL/api/config/status

# Email test
curl -X POST $SERVICE_URL/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","body":"Test"}'

# Afternoon updates
curl $SERVICE_URL/api/insights/afternoon/midday
curl $SERVICE_URL/api/insights/afternoon/end-of-day
```

## 📊 **Monitoring**

### **View Logs**
```bash
# Cloud Run logs
gcloud logs tail --service=investment-assistant-backend --region=us-central1

# Firebase Functions logs
firebase functions:log

# Firebase Hosting status
firebase hosting:channel:list
```

### **Check Cron Jobs**
```bash
gcloud scheduler jobs list --location=us-central1
```

### **Check Secrets**
```bash
gcloud secrets list
```

## 🔄 **Updating the Deployment**

### **Redeploy Backend Only**
```bash
cd backend
gcloud run deploy investment-assistant-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
cd ..
```

### **Redeploy Firebase Services Only**
```bash
# Build and deploy functions
cd functions && npm install && npm run build && cd ..
cd app && npm install && npm run build && cd ..
firebase deploy --only functions,hosting
```

### **Redeploy Frontend Only**
```bash
cd app && npm install && npm run build && cd ..
firebase deploy --only hosting
```

### **Redeploy Firebase Services Only**
```bash
# Build and deploy functions
cd functions && npm install && npm run build && cd ..
cd app && npm install && npm run build && cd ..
firebase deploy --only functions,hosting
```

### **Redeploy Frontend Only**
```bash
cd app && npm install && npm run build && cd ..
firebase deploy --only hosting
```

### **Update Configuration**
```bash
# Edit configuration in Secret Manager
gcloud secrets versions add investment-assistant-config \
  --data-file="config.json"
```

### **Update Cron Jobs**
```bash
# Update specific job
gcloud scheduler jobs update http afternoon-insight-1pm-job \
  --location=us-central1 \
  --uri="NEW_SERVICE_URL/api/insights/afternoon/midday"
```

## 🎯 **Success Indicators**

Your deployment is successful when:

1. ✅ **All tests pass** during deployment
2. ✅ **Service URL is provided** at the end
3. ✅ **3 cron jobs are created** and listed
4. ✅ **Configuration is accessible** via API
5. ✅ **Email endpoints respond** correctly

## 💰 **Cost Information**

- **Expected cost**: $0/month (within free tier)
- **Gmail API**: Free for your usage
- **Cloud Run**: Free tier covers your usage
- **Cloud Scheduler**: Free tier covers your usage
- **Secret Manager**: Free tier covers your usage

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Authentication Error**
   ```bash
   gcloud auth login
   gcloud config set project investment-advisor-bot-2025
   ```

2. **API Not Enabled**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   # ... (script handles this automatically)
   ```

3. **Permission Denied**
   - Ensure you have Owner or Editor role on the project
   - Check billing is enabled

4. **Service Deployment Fails**
   - Check `backend/requirements.txt` is valid
   - Ensure `backend/main.py` exists and is valid Python

### **Debug Commands**

```bash
# Check service status
gcloud run services describe investment-assistant-backend --region=us-central1

# View build logs
gcloud builds list --limit=5

# Check scheduler jobs
gcloud scheduler jobs describe daily-insight-job --location=us-central1

# Test endpoints manually
curl $SERVICE_URL/health
```

## 📝 **Next Steps After Deployment**

1. **Monitor the system** for a few days
2. **Check email delivery** at scheduled times
3. **Verify change detection** is working correctly
4. **Adjust configuration** if needed via Secret Manager
5. **Set up monitoring alerts** if desired

## 🎉 **You're All Set!**

Once deployment completes successfully, your Investment Assistant will:

- ✅ Generate daily insights at 8:00 AM
- ✅ Send intelligent afternoon updates at 1:00 PM and 5:00 PM
- ✅ Only email when significant changes are detected
- ✅ Provide all insights in Hebrew
- ✅ Run completely within GCP free tier

**Your investment assistant is now live and ready to help!** 🚀 