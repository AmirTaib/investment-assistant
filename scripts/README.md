# 🔧 Investment Assistant - Scripts

This folder contains all the shell scripts for managing, deploying, and testing the Investment Assistant project.

## 📋 Scripts Index

### 🚀 **Deployment & Setup**
- **[deploy.sh](./deploy.sh)** - Complete deployment script for all services
- **[setup-config.sh](./setup-config.sh)** - Initial GCP Secret Manager configuration
- **[setup-gmail-api.sh](./setup-gmail-api.sh)** - Gmail API setup and credentials
- **[setup-auth.sh](./setup-auth.sh)** - Authentication setup

### 🔐 **Configuration Management**
- **[manage-secrets.sh](./manage-secrets.sh)** - GCP Secret Manager operations
- **[debug-local.sh](./debug-local.sh)** - Local debugging and troubleshooting

### 🏠 **Local Development**
- **[run-local.sh](./run-local.sh)** - Complete local development environment
- **[test-email-local.sh](./test-email-local.sh)** - Local email testing
- **[test-email-simple.py](./test-email-simple.py)** - Python email testing utility

---

## 🎯 **Quick Reference**

### **🚀 Production Deployment:**
```bash
# Deploy everything
./scripts/deploy.sh

# Setup initial configuration
./scripts/setup-config.sh

# Setup Gmail API
./scripts/setup-gmail-api.sh
```

### **🔐 Secret Management:**
```bash
# List all secrets
./scripts/manage-secrets.sh list

# View a secret
./scripts/manage-secrets.sh view investment-assistant-config

# Update a secret
./scripts/manage-secrets.sh update investment-assistant-config config.json
```

### **🏠 Local Development:**
```bash
# Run complete local environment
./scripts/run-local.sh

# Test email functionality locally
./scripts/test-email-local.sh

# Debug issues
./scripts/debug-local.sh
```

---

## 📁 **Script Categories**

### **🔧 Setup Scripts**
| Script | Purpose | When to Use |
|--------|---------|-------------|
| `setup-config.sh` | Initial GCP Secret Manager setup | First time setup |
| `setup-gmail-api.sh` | Gmail API credentials setup | Email functionality setup |
| `setup-auth.sh` | Authentication configuration | Security setup |

### **🚀 Deployment Scripts**
| Script | Purpose | When to Use |
|--------|---------|-------------|
| `deploy.sh` | Complete deployment | Production deployment |
| `manage-secrets.sh` | Secret management | Configuration updates |

### **🏠 Development Scripts**
| Script | Purpose | When to Use |
|--------|---------|-------------|
| `run-local.sh` | Local development environment | Development and testing |
| `test-email-local.sh` | Email testing | Email feature testing |
| `test-email-simple.py` | Python email testing | Detailed email debugging |
| `debug-local.sh` | Troubleshooting | Issue debugging |

---

## 🔗 **Related Files**

### **Documentation:**
- **[../docs/README.md](../docs/README.md)** - All documentation
- **[../docs/DEPLOYMENT_GUIDE.md](../docs/DEPLOYMENT_GUIDE.md)** - Deployment guide
- **[../docs/GCP_SECRET_MANAGER_GUIDE.md](../docs/GCP_SECRET_MANAGER_GUIDE.md)** - Secret management

### **Configuration:**
- **[../backend/](../backend/)** - Backend application
- **[../app/](../app/)** - Frontend application
- **[../firebase.json](../firebase.json)** - Firebase configuration

---

## 🚨 **Important Notes**

### **✅ Before Running Scripts:**
1. **Ensure you're in the project root** (`/investment-assistant`)
2. **Check prerequisites** - gcloud CLI, Firebase CLI, etc.
3. **Verify permissions** - GCP project access, IAM roles
4. **Read documentation** - Check the docs folder for detailed guides

### **🔐 Security:**
- **Never commit secrets** to version control
- **Use GCP Secret Manager** for all sensitive data
- **Rotate credentials** regularly
- **Check permissions** before running scripts

### **🐛 Troubleshooting:**
- **Check logs** in Cloud Run and Firebase
- **Verify configuration** with `./scripts/manage-secrets.sh list`
- **Test endpoints** after deployment
- **Use debug script** for local issues

---

## 📞 **Need Help?**

1. **📚 Check [Documentation](../docs/README.md)** for detailed guides
2. **🔍 Read script comments** for usage instructions
3. **🐛 Use debug script** for troubleshooting
4. **📧 Test email functionality** with test script

---

## 🎉 **Script Status**

- ✅ **Tested**: All scripts tested and verified
- ✅ **Documented**: Clear usage instructions
- ✅ **Secure**: Follow security best practices
- ✅ **Maintained**: Regular updates with project changes

Happy scripting! 🚀 