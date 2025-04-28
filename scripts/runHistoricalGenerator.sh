#!/bin/bash

# Script to run the historical message generator
# This will generate messages from March 14, 2023 to present

# Check if OPENAI_API_KEY is set
if [ -z "$OPENAI_API_KEY" ]; then
  echo "Error: OPENAI_API_KEY environment variable is not set."
  echo "Please set your OpenAI API key with:"
  echo "export OPENAI_API_KEY=your_api_key_here"
  exit 1
fi

# Navigate to the project directory
cd "$(dirname "$0")/.."

# Install required dependencies if not already installed
if ! npm list openai > /dev/null 2>&1; then
  echo "Installing OpenAI dependency..."
  npm install openai
fi

# Run the historical message generator script
echo "Starting historical message generation..."
node scripts/generateHistoricalMessages.js

# Check if the script executed successfully
if [ $? -eq 0 ]; then
  echo "Historical message generation completed successfully!"
  echo "Messages have been generated from March 14, 2023 to present."
  echo "The data files have been saved to the public/data directory."
else
  echo "Error: Historical message generation failed."
  exit 1
fi
