# Investment Assistant

This project runs a scheduled AI-based investment insights generator using Python (Flask) for the backend and React for the frontend.

## Components
- **Backend (Flask)**: GCP Cloud Run service that writes daily insights to Firestore.
- **Frontend (React)**: Firebase-hosted UI to view the insights from Firestore.

## Getting Started

### Backend (Python/Flask)
1. Deploy with Cloud Run using:
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/investment-assistant
gcloud run deploy investment-assistant --image gcr.io/YOUR_PROJECT_ID/investment-assistant --platform managed --region us-central1 --allow-unauthenticated
```

2. Use `/run` endpoint to trigger insight generation.

### Frontend (React)
```bash
cd app
npm install
npm start
```

Deploy to Firebase Hosting.

### Firestore
- Collection: `daily_insights`
