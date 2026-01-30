@echo off
setlocal
title Launching Blockchain Applications

echo 🚀 Starting System Check & Launch Process...

:: 1. Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is NOT installed.
    echo 🔍 Attempting to run installer...
    
    :: Try to use Winget to install Node.js
    where winget >nul 2>&1
    if %errorlevel% equ 0 (
        echo 📦 Winget found. Installing Node.js...
        winget install -e --id OpenJS.NodeJS
        
        :: Refresh env vars might be tricky in same session, usually requires restart of terminal.
        :: We will try to rely on the installer updating path or ask user to restart.
        echo ⚠️  Node.js installed. You may need to restart this script or your computer if it fails to find 'node' below.
        pause
    ) else (
        echo ❌ Winget not found. Cannot auto-install Node.js.
        echo 👉 Please install Node.js manually from https://nodejs.org/
        pause
        exit /b 1
    )
) else (
    echo ✅ Node.js is installed.
)

:: Verify Node again in case we just installed it (simple check might fail if path not refreshed, but we try)
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❗ Node.js command not found yet. Please restart this script.
    pause
    exit /b 1
)

:: 2. Check/Install dependencies
echo 📦 Checking project dependencies...
if not exist "node_modules" (
    echo 🔍 node_modules not found. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ⚠️ Standard install failed. Retrying with --legacy-peer-deps...
        call npm install --legacy-peer-deps
    )
) else (
    echo ✅ node_modules found. Updating dependencies to ensure sync...
    call npm install
    if %errorlevel% neq 0 (
        echo ⚠️ Standard install failed. Retrying with --legacy-peer-deps...
        call npm install --legacy-peer-deps
    )
)

:: 3. Launch Application
echo 🚀 Launching Application...
echo 👉 Press Ctrl+C to stop.
npm run dev

pause
