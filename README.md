# Investment Assistant

This project runs a scheduled AI-based investment insights generator using Python (Flask) for the backend and React for the frontend.

## 🚀 Quick Start

### **For New Users:**
1. **📚 Read the [Documentation](./docs/README.md)** - Complete guides and tutorials
2. **🚀 Deploy the project** - Follow the [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
3. **🔧 Configure secrets** - Use the [GCP Secret Manager Guide](./docs/GCP_SECRET_MANAGER_GUIDE.md)

### **For Developers:**
1. **🏠 Local Development** - See [Local Development Guide](./docs/LOCAL_DEVELOPMENT.md)
2. **📧 Email Testing** - Follow [Email Testing Guide](./docs/EMAIL_TESTING_GUIDE.md)
3. **🔐 Secret Management** - Use `./manage-secrets.sh` script

## 📋 Components

- **Backend (Flask)**: GCP Cloud Run service that writes daily insights to Firestore
- **Frontend (React)**: Firebase-hosted UI to view insights from Firestore
- **Email System**: Automated afternoon updates with intelligent filtering
- **Cron Jobs**: Scheduled insights at 8 AM, 1 PM, and 5 PM Israel time

## 🔗 Quick Links

### **Documentation:**
- 📚 **[Documentation Index](./docs/README.md)** - All guides and tutorials
- 🚀 **[Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- 🔐 **[Secret Management](./docs/GCP_SECRET_MANAGER_GUIDE.md)** - GCP Secret Manager guide
- 📧 **[Email System](./docs/AFTERNOON_UPDATES_README.md)** - Afternoon updates feature

### **Scripts:**
- 🔧 **`./scripts/deploy.sh`** - Deploy all services
- 🔐 **`./scripts/manage-secrets.sh`** - Manage GCP secrets
- 🏠 **`./scripts/run-local.sh`** - Run locally for development
- 📧 **`./scripts/test-email-local.sh`** - Test email functionality

## 🎯 Key Features

- ✅ **AI-Powered Insights** - Daily investment recommendations
- ✅ **Smart Email Updates** - Afternoon updates only when significant changes
- ✅ **Secure Configuration** - GCP Secret Manager integration
- ✅ **Real-time Updates** - Firestore real-time data
- ✅ **Responsive UI** - Modern React frontend
- ✅ **Automated Scheduling** - Cloud Scheduler integration

## 📞 Need Help?

- **📚 Check the [Documentation](./docs/README.md)** for comprehensive guides
- **🔍 Search the docs folder** for specific topics
- **🚀 Start with deployment** if you're new to the project

---

**Happy investing! 🚀**
