#!/bin/bash

# Install dependencies
npm install

# Build the project 
npm run build

# Create Netlify deployment directory if you want to deploy manually
# mkdir -p netlify_deploy
# cp -r dist/* netlify_deploy/

echo "Build completed! Your app is ready for Netlify deployment."
echo "You can deploy using:"
echo "1. Netlify CLI: netlify deploy"
echo "2. Netlify UI: Drag and drop the 'dist' folder"
echo "3. Connect your GitHub repository to Netlify for automatic deployments" 