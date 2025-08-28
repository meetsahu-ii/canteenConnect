# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

**AI Module:**
```bash
cd ai_module
pip install -r requirements.txt
```

### 2. Configure Environment

**Backend (.env file):**
```bash
cd server
cp env.example .env
# Edit .env with your MongoDB connection and JWT secret
```

### 3. Start Services

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:3000
```

**Terminal 3 - AI Module (optional):**
```bash
cd ai_module
python crowd_detector.py
# Requires webcam access
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Default Admin**: Register with role "admin"

### 5. Test the System

1. Register a new user account
2. Add some menu items (as admin)
3. View the dashboard with crowd status
4. Rate menu items
5. Monitor real-time updates

## 🔧 Common Issues & Solutions

- **Port conflicts**: Change ports in package.json and .env
- **MongoDB**: Ensure MongoDB is running locally
- **Webcam**: Grant camera permissions to Python script
- **CORS**: Backend CORS is configured for localhost:3000

## 📱 Features to Try

- ✅ User authentication
- ✅ Menu management
- ✅ Rating system
- ✅ Real-time crowd monitoring
- ✅ Responsive design
- ✅ Admin panel

---

**Need help? Check the main README.md for detailed documentation!**

