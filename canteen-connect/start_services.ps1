Write-Host "=============================="
Write-Host " Starting Canteen System..."
Write-Host "=============================="

# Start Backend
Start-Process powershell -ArgumentList "cd 'canteen-connect/server'; npm run dev"

# Start Frontend
Start-Process powershell -ArgumentList "cd 'canteen-connect/client'; npm run dev"

# Start AI Module
Start-Process powershell -ArgumentList "cd 'canteen-connect/ai_module'; conda activate canteen; python crowd_detector.py"

Write-Host "Services started!"
Write-Host "Backend:  http://localhost:5000"
Write-Host "Frontend: http://localhost:3000"

