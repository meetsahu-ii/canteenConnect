@echo off
echo 🚀 Canteen Connect - MongoDB Setup
echo =====================================
echo.

echo 🔍 Checking MongoDB installation...
mongod --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB is already installed!
    mongod --version
) else (
    echo ❌ MongoDB is not installed
    echo.
    echo 📥 Please install MongoDB manually:
    echo 1. Go to: https://www.mongodb.com/try/download/community
    echo 2. Download Windows MSI installer
    echo 3. Run the installer
    echo.
    pause
    exit /b 1
)

echo.
echo 🔍 Checking MongoDB service status...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    sc query MongoDB | find "RUNNING" >nul
    if %errorlevel% equ 0 (
        echo ✅ MongoDB service is running!
    ) else (
        echo ⚠️ MongoDB service is not running. Starting...
        net start MongoDB
        if %errorlevel% equ 0 (
            echo ✅ MongoDB service started!
        ) else (
            echo ❌ Failed to start MongoDB service
            echo Please run as Administrator
        )
    )
) else (
    echo ⚠️ MongoDB service not found
    echo You may need to restart your computer after installation
)

echo.
echo 🔍 Checking environment configuration...
if exist "server\.env" (
    echo ✅ Environment file exists!
) else (
    echo ⚠️ Environment file not found. Creating from template...
    copy "server\env.example" "server\.env" >nul
    if %errorlevel% equ 0 (
        echo ✅ Environment file created!
    ) else (
        echo ❌ Failed to create environment file
    )
)

echo.
echo 🔍 Checking Node.js dependencies...
if exist "server\node_modules" (
    echo ✅ Backend dependencies installed!
) else (
    echo ⚠️ Installing backend dependencies...
    cd server
    call npm install
    cd ..
    if %errorlevel% equ 0 (
        echo ✅ Backend dependencies installed!
    ) else (
        echo ❌ Failed to install backend dependencies
    )
)

if exist "client\node_modules" (
    echo ✅ Frontend dependencies installed!
) else (
    echo ⚠️ Installing frontend dependencies...
    cd client
    call npm install
    cd ..
    if %errorlevel% equ 0 (
        echo ✅ Frontend dependencies installed!
    ) else (
        echo ❌ Failed to install frontend dependencies
    )
)

echo.
echo 🔍 Checking Python dependencies...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python is installed!
    python --version
    
    cd ai_module
    python -c "import ultralytics" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ AI module dependencies installed!
    ) else (
        echo ⚠️ Installing AI module dependencies...
        pip install -r requirements.txt
        if %errorlevel% equ 0 (
            echo ✅ AI module dependencies installed!
        ) else (
            echo ❌ Failed to install AI module dependencies
        )
    )
    cd ..
) else (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
)

echo.
echo 🎉 Setup Complete!
echo =================
echo.
echo 🚀 To start the system:
echo 1. Backend: cd server ^&^& npm run dev
echo 2. Frontend: cd client ^&^& npm run dev
echo 3. AI Module: cd ai_module ^&^& python crowd_detector.py
echo.
echo 🌐 Access your application:
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:5000
echo.
echo 📚 For detailed setup instructions, see: COMPLETE_SETUP_GUIDE.md
echo.
echo ✨ Happy coding!
pause


