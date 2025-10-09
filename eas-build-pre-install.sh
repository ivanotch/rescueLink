#!/bin/bash
set -e

echo "🔧 Running pre-install script to decode google-services.json ..."

# Check if the env variable is set
if [ -z "$GOOGLE_SERVICES_JSON" ]; then
  echo "❌ GOOGLE_SERVICES_JSON environment variable is missing!"
  exit 1
fi

# Ensure output directory exists
mkdir -p android/app

# Decode the base64 string into the JSON file
echo "$GOOGLE_SERVICES_JSON" | base64 --decode > android/app/google-services.json

# Confirm the file exists
if [ -f "android/app/google-services.json" ]; then
  echo "✅ google-services.json created successfully!"
  ls -l android/app/google-services.json
else
  echo "❌ Failed to create google-services.json!"
  exit 1
fi
