# MongoDB Setup Script for Canteen Connect
# This script helps you set up MongoDB and start the system

Write-Host "🚀 Canteen Connect - MongoDB Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if MongoDB is installed
Write-Host "`n🔍 Checking MongoDB installation..." -ForegroundColor Yellow
try {
    $mongodVersion = mongod --version 2>$null
    if ($mongodVersion) {
        Write-Host "✅ MongoDB is already installed!" -ForegroundColor Green
        Write-Host "Version: $mongodVersion" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ MongoDB is not installed" -ForegroundColor Red
    Write-Host "`n📥 Installing MongoDB..." -ForegroundColor Yellow
    
    # Download MongoDB installer
    $mongodbUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.14-signed.msi"
    $installerPath = "$env:TEMP\mongodb-installer.msi"
    
    Write-Host "Downloading MongoDB installer..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $mongodbUrl -OutFile $installerPath
    
    Write-Host "Installing MongoDB..." -ForegroundColor Cyan
    Start-Process msiexec.exe -Wait -ArgumentList "/i $installerPath /quiet"
    
    # Clean up
    Remove-Item $installerPath
    
    Write-Host "✅ MongoDB installation completed!" -ForegroundColor Green
}

# Check if MongoDB service is running
Write-Host "`n🔍 Checking MongoDB service status..." -ForegroundColor Yellow
$service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue

if ($service) {
    if ($service.Status -eq "Running") {
        Write-Host "✅ MongoDB service is running!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ MongoDB service is not running. Starting..." -ForegroundColor Yellow
        Start-Service -Name "MongoDB"
        Write-Host "✅ MongoDB service started!" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️ MongoDB service not found. You may need to restart your computer." -ForegroundColor Yellow
}

# Check if .env file exists
Write-Host "`n🔍 Checking environment configuration..." -ForegroundColor Yellow
$envPath = "server\.env"
if (Test-Path $envPath) {
    Write-Host "✅ Environment file exists!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Environment file not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item "server\env.example" "server\.env"
    Write-Host "✅ Environment file created!" -ForegroundColor Green
}

# Check if dependencies are installed
Write-Host "`n🔍 Checking Node.js dependencies..." -ForegroundColor Yellow
if (Test-Path "server\node_modules") {
    Write-Host "✅ Backend dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location "server"
    npm install
    Set-Location ".."
    Write-Host "✅ Backend dependencies installed!" -ForegroundColor Green
}

if (Test-Path "client\node_modules") {
    Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location "client"
    npm install
    Set-Location ".."
    Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green
}

# Check Python dependencies
Write-Host "`n🔍 Checking Python dependencies..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>$null
    if ($pythonVersion) {
        Write-Host "✅ Python is installed: $pythonVersion" -ForegroundColor Green
        
        # Check if requirements are installed
        Set-Location "ai_module"
        python -c "import ultralytics" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ AI module dependencies installed!" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Installing AI module dependencies..." -ForegroundColor Yellow
            pip install -r requirements.txt
            Write-Host "✅ AI module dependencies installed!" -ForegroundColor Green
        }
        Set-Location ".."
    }
} catch {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://python.org" -ForegroundColor Yellow
}

# Final status
Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Green

Write-Host "`n🚀 To start the system:" -ForegroundColor Cyan
Write-Host "1. Backend: cd server && npm run dev" -ForegroundColor White
Write-Host "2. Frontend: cd client && npm run dev" -ForegroundColor White
Write-Host "3. AI Module: cd ai_module && python crowd_detector.py" -ForegroundColor White

Write-Host "`n🌐 Access your application:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "- Backend: http://localhost:5000" -ForegroundColor White

Write-Host "`n📚 For detailed setup instructions, see: COMPLETE_SETUP_GUIDE.md" -ForegroundColor Yellow

Write-Host "`n✨ Happy coding!" -ForegroundColor Green
