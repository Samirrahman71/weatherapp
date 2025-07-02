#!/bin/bash

# WeatherNow Deployment Preparation Script
echo "🌤️  Preparing WeatherNow for deployment..."

# Create a deployment directory
mkdir -p deploy

# Copy essential files for frontend deployment
echo "📁 Copying files..."
cp index.html deploy/
cp style.css deploy/
cp script.js deploy/
cp config.js deploy/
cp README.md deploy/
cp package.json deploy/

# Create a simple netlify.toml for better deployment
echo "⚙️  Creating deployment configuration..."
cat > deploy/netlify.toml << EOF
[build]
  publish = "."
  
[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

# Create deployment instructions
cat > deploy/DEPLOY_INSTRUCTIONS.txt << EOF
🚀 DEPLOYMENT INSTRUCTIONS

1. NETLIFY (Easiest):
   - Go to netlify.com
   - Drag the 'deploy' folder to Netlify
   - Your app will be live instantly!

2. VERCEL:
   - Go to vercel.com
   - Import your GitHub repository
   - Deploy automatically

3. GITHUB PAGES:
   - Push to GitHub
   - Enable Pages in repository settings

🔑 IMPORTANT: Get your OpenWeatherMap API key from:
   https://openweathermap.org/api

The app will prompt you for the API key on first use.

Your app is ready to deploy! 🎉
EOF

echo "✅ Deployment preparation complete!"
echo "📂 Files are ready in the 'deploy' folder"
echo "🌐 Follow the instructions in deploy/DEPLOY_INSTRUCTIONS.txt"
echo ""
echo "🚀 Quick deploy to Netlify:"
echo "   1. Go to netlify.com"
echo "   2. Drag the 'deploy' folder to Netlify"
echo "   3. Your app will be live!"
