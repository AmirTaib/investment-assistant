# Investment Assistant 🚀

This project is the foundation of your GCP-based investment automation system.

## 🔧 Stack
- Python 3.10
- Flask
- Cloud Run
- Firebase Admin SDK
- Google Sheets API

## 📁 Structure

- `app.py` – Entry point Flask app
- `Dockerfile` – Container setup for GCP Cloud Run
- `requirements.txt` – Python dependencies
- `.env.example` – Example environment configuration

## 🚀 Deploy to Cloud Run
1. Enable Cloud Run, Secret Manager, IAM, Sheets API, and Firebase in GCP
2. Build & deploy:
    ```bash
    gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/investment-assistant
    gcloud run deploy investment-assistant --image gcr.io/YOUR_PROJECT_ID/investment-assistant --platform managed --region us-central1 --allow-unauthenticated
    ```

## 🔐 Environment
Make sure to create a `.env` file (or use Secret Manager) with:
- Firebase credentials
- Google Sheets credentials

## 📌 Repo
GitHub: https://github.com/AmirTaib/investment-assistant