# 🚀 Complete Setup Guide - Final Steps

## ⚠️ Current Status
Your AI-Powered Canteen Management System is **95% complete**! Here are the final steps to get it running:

## 🔧 Step 1: MongoDB Setup (Required)

### Option A: Install MongoDB Locally (Recommended for Development)
1. **Download MongoDB Community Server**:
   - Go to: https://www.mongodb.com/try/download/community
   - Download the Windows MSI installer
   - Run the installer and follow the setup wizard

2. **Start MongoDB Service**:
   ```powershell
   # Open PowerShell as Administrator
   net start MongoDB
   ```

### Option B: Use MongoDB Atlas (Cloud - Free)
1. **Create MongoDB Atlas Account**:
   - Go to: https://www.mongodb.com/atlas
   - Sign up for free account
   - Create a new cluster (free tier)

2. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update .env File**:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/canteen-connect
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

## 🚀 Step 2: Start All Services

### Method 1: Use the Startup Scripts (Easiest)
```powershell
# Navigate to project root
cd "canteen-connect"

# Run the startup script
.\start_services.ps1
```

### Method 2: Manual Startup (3 Terminal Windows)

**Terminal 1 - Backend Server:**
```powershell
cd "canteen-connect/server"
npm run dev
```

**Terminal 2 - Frontend Client:**
```powershell
cd "canteen-connect/client"
npm run dev
```

**Terminal 3 - AI Module (Optional):**
```powershell
cd "canteen-connect/ai_module"
python crowd_detector.py
```

## 🌐 Step 3: Access Your Application

1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:5000
3. **API Test**: http://localhost:5000/ (should show "Canteen Connect API is running!")

## 🔐 Step 4: First Time Setup

1. **Open Browser**: Go to http://localhost:3000
2. **Register Account**: Create a new account with role "admin"
3. **Login**: Use your credentials
4. **Add Menu Items**: Use the admin panel to add some menu items
5. **Test System**: Rate items and check crowd monitoring

## 🤖 Step 5: AI Module Setup

### Prerequisites:
- Webcam access
- Python 3.8+ installed
- Backend server running on port 5000

### Run AI Module:
```powershell
cd "canteen-connect/ai_module"
python crowd_detector.py
```

**Note**: The AI module will automatically download the YOLO model on first run.

## 🐛 Troubleshooting Common Issues

### 1. MongoDB Connection Error
```
MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Install MongoDB or use MongoDB Atlas

### 2. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill the process using the port
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### 3. Frontend Build Errors
```
Module not found: Can't resolve 'react'
```
**Solution**: Reinstall dependencies
```powershell
cd client
rm -rf node_modules package-lock.json
npm install
```

### 4. AI Module Errors
```
No module named 'ultralytics'
```
**Solution**: Install Python dependencies
```powershell
cd ai_module
pip install -r requirements.txt
```

## 📱 Testing Your System

### Test Checklist:
- [ ] Backend server starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] User registration works
- [ ] User login works
- [ ] Menu items can be added (admin)
- [ ] Menu items display correctly
- [ ] Rating system works
- [ ] Crowd monitoring shows data
- [ ] AI module detects people (if webcam available)

## 🎯 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Module     │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Python)      │
│   Port: 3000    │    │   Port: 5000    │    │   (Webcam)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   MongoDB       │
                       │   Database      │
                       └─────────────────┘
```

## 🚀 Next Steps After Setup

1. **Customize the System**:
   - Modify colors in `client/tailwind.config.js`
   - Add new menu categories
   - Customize crowd detection thresholds

2. **Add Features**:
   - Image upload for menu items
   - Payment integration
   - Analytics dashboard
   - Mobile app

3. **Deploy to Production**:
   - Set up MongoDB Atlas
   - Deploy backend to Heroku/Railway
   - Deploy frontend to Vercel/Netlify

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Frontend loads without errors
- ✅ Backend shows "Connected to MongoDB"
- ✅ You can register and login
- ✅ Menu items display correctly
- ✅ Crowd monitoring shows real-time data
- ✅ AI module processes webcam feed

## 📞 Need Help?

If you encounter issues:
1. Check the console output for error messages
2. Verify all services are running on correct ports
3. Ensure MongoDB is accessible
4. Check that all dependencies are installed

**Happy coding! 🚀**
