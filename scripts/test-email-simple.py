#!/usr/bin/env python3
"""
Simple Email Test Script
Tests the email service locally without running the full Flask app
"""

import sys
import os
import json
from datetime import datetime

# Add backend to path
sys.path.append('backend')

def test_configuration():
    """Test configuration service"""
    print("🔧 Testing Configuration Service...")
    try:
        from config_service import config_service
        config = config_service.get_config()
        print("✅ Configuration loaded successfully")
        print(f"📧 Recipient Email: {config.get('RECIPIENT_EMAIL', 'Not set')}")
        print(f"🔑 Secret Name: {config.get('SECRET_NAME', 'Not set')}")
        print(f"🌍 Project ID: {config.get('PROJECT_ID', 'Not set')}")
        return True
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        return False

def test_email_service():
    """Test email service"""
    print("\n📧 Testing Email Service...")
    try:
        from email_service import EmailService
        email_service = EmailService()
        print("✅ Email service initialized successfully")
        
        # Test Gmail credentials
        try:
            credentials = email_service.get_gmail_credentials()
            print("✅ Gmail credentials retrieved successfully")
            return True
        except Exception as e:
            print(f"❌ Gmail credentials error: {e}")
            print("💡 Make sure you have set up Gmail API and stored credentials in Secret Manager")
            return False
            
    except Exception as e:
        print(f"❌ Email service error: {e}")
        return False

def test_send_email():
    """Test sending a real email"""
    print("\n📤 Testing Email Sending...")
    try:
        from email_service import EmailService
        email_service = EmailService()
        
        # Test email data
        subject = f"🧪 Test Email - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        body = f"""
        This is a test email from the Investment Assistant system.
        
        Test Details:
        - Time: {datetime.now().isoformat()}
        - Purpose: Local testing
        - Status: Automated test
        
        If you receive this email, the email service is working correctly!
        """
        
        print(f"📧 Sending test email...")
        print(f"   Subject: {subject}")
        print(f"   To: {email_service.recipient_email}")
        
        success = email_service.send_gmail(subject, body)
        
        if success:
            print("✅ Test email sent successfully!")
            return True
        else:
            print("❌ Failed to send test email")
            return False
            
    except Exception as e:
        print(f"❌ Email sending error: {e}")
        return False

def test_afternoon_update():
    """Test afternoon update functionality"""
    print("\n🕐 Testing Afternoon Update...")
    try:
        from context_afternoon import get_afternoon_prompt
        
        # Test midday prompt
        prompt = get_afternoon_prompt("1:00 PM")
        print("✅ Afternoon prompt generated successfully")
        print(f"📝 Prompt length: {len(prompt)} characters")
        
        # Check if prompt contains English instructions
        if "INTELLIGENT UPDATE REQUIREMENTS" in prompt:
            print("✅ Prompt contains English instructions")
        else:
            print("⚠️  Prompt may not contain English instructions")
            
        # Check if prompt requires Hebrew response
        if "MUST BE IN HEBREW" in prompt:
            print("✅ Prompt requires Hebrew response")
        else:
            print("⚠️  Prompt may not require Hebrew response")
            
        return True
        
    except Exception as e:
        print(f"❌ Afternoon update test error: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 Investment Assistant - Local Email Testing")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('backend/main.py'):
        print("❌ Error: Please run this script from the project root directory")
        sys.exit(1)
    
    # Run tests
    tests = [
        ("Configuration", test_configuration),
        ("Email Service", test_email_service),
        ("Afternoon Update", test_afternoon_update),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print(f"\n{'='*50}")
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nResults: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("\n🎉 All tests passed! Your email setup is ready.")
        print("\n💡 To test sending a real email, run:")
        print("   python3 test-email-simple.py --send-email")
    else:
        print("\n⚠️  Some tests failed. Please check the setup:")
        print("1. Run: ./setup-config.sh")
        print("2. Run: ./setup-gmail-api.sh")
        print("3. Check your backend/.env file")
    
    # Check if user wants to send a test email
    if len(sys.argv) > 1 and sys.argv[1] == "--send-email":
        print("\n" + "="*50)
        print("📤 SENDING TEST EMAIL")
        print("=" * 50)
        test_send_email()

if __name__ == "__main__":
    main() 