#!/bin/bash

# GCP Secret Manager Management Script
# For Investment Assistant Project

PROJECT_ID="investment-advisor-bot-2025"

echo "🔐 GCP Secret Manager Management"
echo "================================"
echo "Project: $PROJECT_ID"
echo ""

# Function to list all secrets
list_secrets() {
    echo "📋 Available Secrets:"
    echo "===================="
    gcloud secrets list --project=$PROJECT_ID --format="table(NAME,CREATED)"
    echo ""
}

# Function to view a secret
view_secret() {
    local secret_name=$1
    echo "🔍 Viewing Secret: $secret_name"
    echo "================================"
    gcloud secrets versions access latest --secret="$secret_name" --project=$PROJECT_ID | jq .
    echo ""
}

# Function to update a secret
update_secret() {
    local secret_name=$1
    local file_path=$2
    
    if [ -z "$file_path" ]; then
        echo "❌ Error: Please provide a file path for the secret data"
        echo "Usage: $0 update <secret_name> <file_path>"
        exit 1
    fi
    
    if [ ! -f "$file_path" ]; then
        echo "❌ Error: File $file_path does not exist"
        exit 1
    fi
    
    echo "🔄 Updating Secret: $secret_name"
    echo "================================"
    gcloud secrets versions add "$secret_name" --data-file="$file_path" --project=$PROJECT_ID
    
    if [ $? -eq 0 ]; then
        echo "✅ Secret updated successfully!"
    else
        echo "❌ Failed to update secret"
        exit 1
    fi
    echo ""
}

# Function to create a new secret
create_secret() {
    local secret_name=$1
    local file_path=$2
    
    if [ -z "$file_path" ]; then
        echo "❌ Error: Please provide a file path for the secret data"
        echo "Usage: $0 create <secret_name> <file_path>"
        exit 1
    fi
    
    if [ ! -f "$file_path" ]; then
        echo "❌ Error: File $file_path does not exist"
        exit 1
    fi
    
    echo "🆕 Creating Secret: $secret_name"
    echo "================================"
    gcloud secrets create "$secret_name" --data-file="$file_path" --project=$PROJECT_ID
    
    if [ $? -eq 0 ]; then
        echo "✅ Secret created successfully!"
    else
        echo "❌ Failed to create secret"
        exit 1
    fi
    echo ""
}

# Function to delete a secret
delete_secret() {
    local secret_name=$1
    
    echo "🗑️  Deleting Secret: $secret_name"
    echo "================================"
    echo "⚠️  WARNING: This action cannot be undone!"
    read -p "Are you sure you want to delete '$secret_name'? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gcloud secrets delete "$secret_name" --project=$PROJECT_ID
        
        if [ $? -eq 0 ]; then
            echo "✅ Secret deleted successfully!"
        else
            echo "❌ Failed to delete secret"
            exit 1
        fi
    else
        echo "❌ Deletion cancelled"
    fi
    echo ""
}

# Function to show secret versions
show_versions() {
    local secret_name=$1
    
    echo "📅 Versions for Secret: $secret_name"
    echo "================================"
    gcloud secrets versions list "$secret_name" --project=$PROJECT_ID --format="table(NAME,STATE,CREATED)"
    echo ""
}

# Function to show help
show_help() {
    echo "🔐 GCP Secret Manager Management Script"
    echo "======================================="
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  list                    - List all secrets"
    echo "  view <secret_name>      - View a specific secret"
    echo "  update <secret_name> <file> - Update a secret from file"
    echo "  create <secret_name> <file> - Create a new secret from file"
    echo "  delete <secret_name>    - Delete a secret"
    echo "  versions <secret_name>  - Show versions of a secret"
    echo "  help                    - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 list"
    echo "  $0 view investment-assistant-config"
    echo "  $0 update investment-assistant-config config.json"
    echo "  $0 create new-secret secret-data.json"
    echo "  $0 versions investment-assistant-config"
    echo ""
    echo "Current Project: $PROJECT_ID"
    echo ""
}

# Main script logic
case "$1" in
    "list")
        list_secrets
        ;;
    "view")
        if [ -z "$2" ]; then
            echo "❌ Error: Please provide a secret name"
            echo "Usage: $0 view <secret_name>"
            exit 1
        fi
        view_secret "$2"
        ;;
    "update")
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "❌ Error: Please provide secret name and file path"
            echo "Usage: $0 update <secret_name> <file_path>"
            exit 1
        fi
        update_secret "$2" "$3"
        ;;
    "create")
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "❌ Error: Please provide secret name and file path"
            echo "Usage: $0 create <secret_name> <file_path>"
            exit 1
        fi
        create_secret "$2" "$3"
        ;;
    "delete")
        if [ -z "$2" ]; then
            echo "❌ Error: Please provide a secret name"
            echo "Usage: $0 delete <secret_name>"
            exit 1
        fi
        delete_secret "$2"
        ;;
    "versions")
        if [ -z "$2" ]; then
            echo "❌ Error: Please provide a secret name"
            echo "Usage: $0 versions <secret_name>"
            exit 1
        fi
        show_versions "$2"
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac 