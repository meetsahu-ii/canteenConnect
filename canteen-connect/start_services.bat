@echo off
echo ==============================
echo Starting Canteen System...
echo ==============================

REM Start Backend
start cmd /k "cd /d canteen-connect\server && npm run dev"

REM Start Frontend
start cmd /k "cd /d canteen-connect\client && npm run dev"

REM Start AI Module
start cmd /k "cd /d canteen-connect\ai_module && conda activate canteen && python crowd_detector.py"

echo Services started!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
pause

