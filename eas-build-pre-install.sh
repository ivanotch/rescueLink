#!/bin/bash
set -e

echo "Decoding google-services.json from EAS secret..."

# Ensure the env variable exists
if [ -z "$GOOGLE_SERVICES_JSON" ]; then
  echo "❌ GOOGLE_SERVICES_JSON is not set"
  exit 1
fi

# Decode the base64 string into the actual file
echo "$GOOGLE_SERVICES_JSON" | base64 --decode > android/app/google-services.json

echo "✅ google-services.json created successfully!"
ls android/app | grep google-services.json || echo "⚠️ google-services.json not found!"
