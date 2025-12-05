#!/bin/bash

echo "🚀 Multi-Service Transcription App - Quick Setup"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file and add your credentials:"
    echo "   - ELEVENLABS_API_KEY (required)"
    echo "   - GOOGLE_EMAIL (optional, for ivrit.ai)"
    echo "   - GOOGLE_PASSWORD (optional, for ivrit.ai)"
    echo ""
    read -p "Press Enter after you've updated the .env file..."
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create uploads directory
mkdir -p uploads
echo "✅ Created uploads directory"

echo ""
echo "================================================"
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "   npm start"
echo ""
echo "Then open in browser:"
echo "   http://localhost:3000"
echo ""
echo "To deploy to Render.com (free):"
echo "   1. Push code to GitHub"
echo "   2. Connect GitHub repo to Render"
echo "   3. Set environment variables in Render dashboard"
echo "   4. Deploy!"
echo ""
