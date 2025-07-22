# 🔔 Afternoon Updates - Investment Assistant

This document describes the new afternoon update functionality that provides intelligent, filtered email notifications at 1:00 PM and 5:00 PM Israel time.

## 📋 Overview

The afternoon update system is designed to:
- **Avoid spam**: Only send emails when there are significant changes
- **Provide value**: Focus on actionable insights and important developments
- **Be intelligent**: Compare current insights with previous ones to detect changes
- **Use GCP**: Leverage Google Cloud services for reliable email delivery

## ⏰ Schedule

| Time (Israel) | UTC Time | Purpose | Email Trigger |
|---------------|----------|---------|---------------|
| 8:00 AM | 6:00 AM | Morning Update | Always |
| 1:00 PM | 11:00 AM | Midday Update | Only if significant changes |
| 5:00 PM | 3:00 PM | End-of-Day Update | Only if significant changes |

## 🧠 Intelligent Filtering

### Change Detection Criteria

The system considers the following as "significant changes":

✅ **New Recommendations**
- New stock symbols not mentioned before
- New buy/sell recommendations

✅ **Updated Recommendations**
- Changes in action (buy→sell, hold→buy, etc.)
- Significant price target changes (>5%)
- Changes in confidence levels

✅ **Market Sentiment Shifts**
- Bullish to bearish transitions
- Bearish to bullish transitions
- Major sentiment changes

✅ **High-Priority Alerts**
- Critical market events
- Important news affecting portfolio
- Risk warnings requiring immediate attention

✅ **Sector Changes**
- New trending sectors
- Significant sector movements

### What's NOT Considered Significant

❌ **Minor Changes**
- Price fluctuations <2%
- Generic market commentary
- Information already well-known
- Minor sentiment adjustments

❌ **Static Information**
- Data that hasn't changed since last update
- Historical information without new context

## 📧 Email Features

### Email Content Structure

1. **Header Section**
   - Update time and type
   - Number of significant changes detected

2. **Changes Summary**
   - Bullet points of detected changes
   - Priority levels

3. **Market Overview**
   - Current sentiment vs. previous
   - Key events during the day
   - Significant market movements

4. **Recommendations** (if changed)
   - New or updated recommendations
   - Specific symbols and actions
   - Price targets and reasoning

5. **Alerts** (high priority only)
   - Critical events
   - Required actions

### Email Styling

- **RTL Support**: Hebrew text support
- **Professional Design**: Apple-like styling
- **Mobile Responsive**: Optimized for mobile devices
- **Clear Hierarchy**: Easy to scan and read

## 🔧 Technical Implementation

### New API Endpoints

```bash
# Generate afternoon insight for 1:00 PM (midday)
GET /api/insights/afternoon/midday

# Generate afternoon insight for 5:00 PM (end-of-day)
GET /api/insights/afternoon/end-of-day

# Test email functionality
POST /api/email/test

# Get configuration status
GET /api/config/status
```

### New Files Created

1. **`backend/email_service.py`**
   - Email service with Gmail API integration
   - Intelligent change detection
   - HTML and text email generation

2. **`backend/context_afternoon.py`**
   - English prompts with Hebrew response requirements
   - Time-specific market context in English
   - Change detection criteria in English
   - Clear instruction for Hebrew-only responses

3. **`backend/config_service.py`**
   - Configuration service using GCP Secret Manager
   - Environment variable fallbacks
   - Configuration validation

4. **`setup-gmail-api.sh`**
   - Gmail API setup automation
   - Service account creation
   - Secret Manager configuration

5. **`setup-config.sh`**
   - Configuration setup in GCP Secret Manager
   - Environment variable management
   - Configuration validation

### Updated Files

1. **`backend/main.py`**
   - New afternoon insight endpoints (`/midday` and `/end-of-day`)
   - Email integration with config service
   - Change detection logic
   - Configuration service integration

2. **`deploy-simple.sh`**
   - New cron job configurations
   - Updated endpoints for 1:00 PM and 5:00 PM schedulers

3. **`backend/requirements.txt`**
   - Added GCP dependencies (secretmanager, storage)
   - Email service requirements

4. **`backend/email_service.py`**
   - Updated to use config service
   - Hebrew language support
   - Improved error handling

## 🚀 Deployment

### 1. Deploy the Updated Backend

```bash
# Deploy with new cron jobs
./deploy-simple.sh
```

This will create three Cloud Scheduler jobs:
- `daily-insight-job` (8:00 AM)
- `afternoon-insight-1pm-job` (1:00 PM)
- `afternoon-insight-5pm-job` (5:00 PM)

### 2. Set Up Configuration in GCP Secret Manager

```bash
# Run the configuration setup script
./setup-config.sh
```

This will:
1. Enable Secret Manager API
2. Create configuration secret
3. Store default configuration
4. Grant necessary permissions

### 3. Set Up Gmail API

```bash
# Run the Gmail API setup script
./setup-gmail-api.sh
```

Follow the instructions to:
1. Enable Gmail API
2. Create OAuth 2.0 credentials
3. Store credentials in Secret Manager
4. Test email functionality

### 4. Update Configuration (Optional)

Edit the configuration in GCP Secret Manager:

```bash
# Create a local config file
cat > config.json << EOF
{
    "PROJECT_ID": "investment-advisor-bot-2025",
    "RECIPIENT_EMAIL": "amirtaib@gmail.com",
    "OPENAI_API_KEY": "your-openai-api-key",
    "AFTERNOON_UPDATE_1PM": "true",
    "AFTERNOON_UPDATE_5PM": "true",
    "EMAIL_SIGNIFICANT_CHANGES_ONLY": "true"
}
EOF

# Update the secret
gcloud secrets versions add investment-assistant-config --data-file="config.json" --project=investment-advisor-bot-2025
```

## 🧪 Testing

### Test Email Functionality

```bash
# Test email sending
curl -X POST https://your-service-url/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test Email",
    "body": "This is a test email from Investment Assistant"
  }'
```

### Test Afternoon Updates

```bash
# Test midday update (1:00 PM)
curl https://your-service-url/api/insights/afternoon/midday

# Test end-of-day update (5:00 PM)
curl https://your-service-url/api/insights/afternoon/end-of-day

# Check configuration status
curl https://your-service-url/api/config/status
```

### Monitor Logs

```bash
# Monitor Cloud Run logs
gcloud logs tail --service=investment-assistant --region=us-central1

# Monitor scheduler logs
gcloud scheduler jobs list
gcloud scheduler jobs describe afternoon-insight-1pm-job --location=us-central1
```

## 📊 Monitoring and Analytics

### Log Analysis

The system logs:
- When updates are generated
- Whether significant changes were detected
- Email sending success/failure
- Change detection details

### Key Metrics

- **Update Frequency**: How often updates are generated
- **Change Detection Rate**: Percentage of updates with significant changes
- **Email Delivery Rate**: Success rate of email sending
- **User Engagement**: Email open rates (if tracked)

## 🔒 Security Considerations

### Gmail API Security

- OAuth 2.0 authentication
- Credentials stored in Secret Manager
- Service account with minimal permissions
- Secure token refresh mechanism

### Data Privacy

- No sensitive data in emails
- Encrypted communication
- Secure credential storage
- Audit logging

## 🛠️ Troubleshooting

### Common Issues

1. **Emails Not Sending**
   - Check Gmail API credentials
   - Verify Secret Manager access
   - Check service account permissions

2. **No Significant Changes Detected**
   - Review change detection criteria
   - Check Firestore data
   - Verify insight generation

3. **Cron Jobs Not Running**
   - Check Cloud Scheduler status
   - Verify timezone settings
   - Check service URL accessibility

### Debug Commands

```bash
# Check scheduler jobs
gcloud scheduler jobs list --location=us-central1

# Check service account permissions
gcloud projects get-iam-policy investment-advisor-bot-2025

# Test secret access
gcloud secrets versions access latest --secret=investment-bot-service-secret-key

# Check service logs
gcloud logs read "resource.type=cloud_run_revision" --limit=50
```

## 📈 Future Enhancements

### Planned Features

1. **Email Templates**
   - Customizable email templates
   - Branded styling options
   - Multiple recipient support

2. **Advanced Filtering**
   - User-defined change criteria
   - Portfolio-specific alerts
   - Risk level customization

3. **Analytics Dashboard**
   - Update performance metrics
   - Change detection analytics
   - User engagement tracking

4. **Mobile Notifications**
   - Push notifications
   - SMS alerts for critical changes
   - Mobile app integration

## 📞 Support

For issues or questions:
1. Check the logs first
2. Review this documentation
3. Test individual components
4. Contact the development team

---

**Last Updated**: January 2025
**Version**: 1.0.0 