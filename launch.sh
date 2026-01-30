#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "🚀 Starting System Check & Launch Process..."

# 1. Check for Node.js
if command_exists node; then
    echo "✅ Node.js is installed: $(node -v)"
else
    echo "❌ Node.js is NOT installed."
    echo "🔍 Attempting to install Node.js..."
    
    # Check OS type for installation
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # MacOS - Try Homebrew
        if command_exists brew; then
            echo "🍺 Homebrew found. Installing Node.js..."
            brew install node
        else
            echo "❌ Homebrew not found. Cannot auto-install Node.js."
            echo "👉 Please install Node.js manually from https://nodejs.org/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux - Try apt (Debian/Ubuntu)
        if command_exists apt-get; then
             echo "🐧 Apt found. Installing Node.js..."
             sudo apt-get update && sudo apt-get install -y nodejs npm
        else 
             echo "❌ Apt not found. Cannot auto-install Node.js."
             echo "👉 Please install Node.js manually from https://nodejs.org/"
             exit 1
        fi
    else
        echo "❌ Unknown OS or not supported for auto-install."
        echo "👉 Please install Node.js manually from https://nodejs.org/"
        exit 1
    fi
    
    # Verify installation
    if command_exists node; then
        echo "✅ Node.js successfully installed: $(node -v)"
    else
        echo "❌ Failed to install Node.js."
        exit 1
    fi
fi

# 2. Check/Install Project Dependencies
echo "📦 Checking project dependencies..."
if [ ! -d "node_modules" ]; then
    echo "🔍 node_modules not found. Installing dependencies..."
    npm install || npm install --legacy-peer-deps
else
    echo "✅ node_modules found. Updating dependencies..."
    npm install || npm install --legacy-peer-deps
fi

# 3. Launch Application
echo "🚀 Launching Application..."
echo "👉 Press Ctrl+C to stop the application."

# Force kill port 3000
echo "🧹 Cleaning up port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

npm run dev
