# 🔐 GCP Secret Manager - Complete Management Guide

## 📋 Overview

Your Investment Assistant project uses **GCP Secret Manager** to securely store configuration and credentials. This guide shows you how to find, view, and manage all your secrets.

## 🎯 Your Current Secrets

| Secret Name | Purpose | Status |
|-------------|---------|--------|
| `investment-assistant-config` | Main application configuration | ✅ Active |
| `investment-bot-service-secret-key` | Gmail API service account | ✅ Active |

---

## 🛠️ Quick Management Script

I've created a management script for you: `./manage-secrets.sh`

### **Basic Commands:**

```bash
# List all secrets
./manage-secrets.sh list

# View a specific secret
./manage-secrets.sh view investment-assistant-config

# Update a secret from a JSON file
./manage-secrets.sh update investment-assistant-config new-config.json

# Show secret versions
./manage-secrets.sh versions investment-assistant-config

# Get help
./manage-secrets.sh help
```

---

## 🔍 Manual Commands (Alternative)

### **1. List All Secrets**
```bash
gcloud secrets list --project=investment-advisor-bot-2025
```

### **2. View Secret Content**
```bash
# View main configuration
gcloud secrets versions access latest --secret="investment-assistant-config" --project=investment-advisor-bot-2025

# View Gmail credentials
gcloud secrets versions access latest --secret="investment-bot-service-secret-key" --project=investment-advisor-bot-2025
```

### **3. Update a Secret**
```bash
# Create a JSON file with your new configuration
cat > new-config.json << EOF
{
    "PROJECT_ID": "investment-advisor-bot-2025",
    "RECIPIENT_EMAIL": "amirtaib@gmail.com",
    "OPENAI_API_KEY": "your-new-api-key",
    "AFTERNOON_UPDATE_1PM": "true",
    "AFTERNOON_UPDATE_5PM": "true"
}
EOF

# Update the secret
gcloud secrets versions add investment-assistant-config --data-file="new-config.json" --project=investment-advisor-bot-2025
```

### **4. View Secret Versions**
```bash
gcloud secrets versions list investment-assistant-config --project=investment-advisor-bot-2025
```

---

## 📊 Current Configuration

### **Main Configuration (`investment-assistant-config`)**
```json
{
    "PROJECT_ID": "investment-advisor-bot-2025",
    "RECIPIENT_EMAIL": "amirtaib@gmail.com",
    "EMAIL_PROVIDER": "gmail",
    "AFTERNOON_UPDATE_1PM": "true",
    "AFTERNOON_UPDATE_5PM": "true",
    "EMAIL_SIGNIFICANT_CHANGES_ONLY": "true",
    "TIMEZONE": "Asia/Jerusalem",
    "OPENAI_API_KEY": "sk-proj-...",
    "FLASK_ENV": "production",
    "DEBUG": "false"
}
```

### **Gmail Credentials (`investment-bot-service-secret-key`)**
Contains the service account JSON for Gmail API access.

---

## 🔧 Common Operations

### **Update OpenAI API Key**
```bash
# Method 1: Using the management script
./manage-secrets.sh view investment-assistant-config > current-config.json
# Edit current-config.json to update the API key
./manage-secrets.sh update investment-assistant-config current-config.json

# Method 2: Direct command
gcloud secrets versions access latest --secret="investment-assistant-config" | \
jq --arg key "your-new-api-key" '.OPENAI_API_KEY = $key' > new-config.json
gcloud secrets versions add investment-assistant-config --data-file="new-config.json"
```

### **Add New Configuration Field**
```bash
# Get current config
gcloud secrets versions access latest --secret="investment-assistant-config" > config.json

# Add new field (example: adding a new email setting)
jq '.NEW_EMAIL_SETTING = "value"' config.json > updated-config.json

# Update the secret
gcloud secrets versions add investment-assistant-config --data-file="updated-config.json"
```

### **Create New Secret**
```bash
# Create a new secret for additional credentials
echo '{"api_key": "your-api-key"}' > new-secret.json
gcloud secrets create my-new-secret --data-file="new-secret.json" --project=investment-advisor-bot-2025
```

---

## 🚨 Security Best Practices

### **✅ Do's:**
- ✅ Use the management script for consistency
- ✅ Always verify secret content before updating
- ✅ Keep backup of important configurations
- ✅ Use descriptive secret names
- ✅ Rotate credentials regularly

### **❌ Don'ts:**
- ❌ Never commit secrets to git
- ❌ Don't share secret content in logs
- ❌ Avoid storing secrets in local files
- ❌ Don't use weak or default passwords

---

## 🔄 Configuration Priority

Your application uses this priority order:

1. **🥇 GCP Secret Manager** (Primary - Production)
2. **🥈 Environment Variables** (Fallback)
3. **🥉 Default Values** (Last resort)

This means:
- ✅ **Production**: Uses GCP Secret Manager
- ✅ **Local Development**: Can use `.env` file (if needed)
- ✅ **Security**: Secrets are encrypted and managed by GCP

---

## 🧪 Testing Configuration

### **Test Current Configuration**
```bash
curl -s "https://investment-assistant-backend-1084406986293.us-central1.run.app/api/config/status" | jq .
```

### **Test Afternoon Endpoints**
```bash
# Test 1 PM endpoint
curl -s "https://investment-assistant-backend-1084406986293.us-central1.run.app/api/insights/afternoon/midday" | jq .

# Test 5 PM endpoint
curl -s "https://investment-assistant-backend-1084406986293.us-central1.run.app/api/insights/afternoon/end-of-day" | jq .
```

---

## 📞 Troubleshooting

### **Common Issues:**

1. **Permission Denied**
   ```bash
   # Grant Secret Manager access to your account
   gcloud projects add-iam-policy-binding investment-advisor-bot-2025 \
       --member="user:your-email@gmail.com" \
       --role="roles/secretmanager.secretAccessor"
   ```

2. **Secret Not Found**
   ```bash
   # List all secrets to verify name
   gcloud secrets list --project=investment-advisor-bot-2025
   ```

3. **Invalid JSON**
   ```bash
   # Validate JSON before updating
   jq . your-config.json
   ```

---

## 📚 Additional Resources

- [GCP Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [gcloud secrets Commands](https://cloud.google.com/sdk/gcloud/reference/secrets)
- [IAM Permissions for Secret Manager](https://cloud.google.com/secret-manager/docs/access-control)

---

## 🎯 Summary

Your GCP Secret Manager is properly configured and secure. Use the `./manage-secrets.sh` script for easy management, or use the manual commands for more control. All your production secrets are safely stored and encrypted in GCP! 🚀 