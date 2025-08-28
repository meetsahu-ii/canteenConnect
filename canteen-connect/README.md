# Canteen Connect - AI-Powered Canteen Management System

A modern web application that displays a digital canteen menu, allows user ratings, and features a real-time crowd status monitor powered by computer vision.

## 🚀 Features

- **Digital Menu Display**: Beautiful, responsive menu interface with categories and search
- **User Authentication**: Secure login/registration system with role-based access
- **Rating System**: Users can rate and review menu items
- **Real-time Crowd Monitoring**: AI-powered crowd detection using computer vision
- **Admin Panel**: Complete menu management system for administrators
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Real-time Updates**: Live crowd status updates every 15 seconds

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for beautiful icons

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

### AI Module
- **Python** with OpenCV for computer vision
- **YOLO (You Only Look Once)** for real-time object detection
- **Ultralytics** for modern YOLO implementation
- **Real-time webcam processing**

## 📁 Project Structure

```
canteen-connect/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context for auth
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Node.js Backend
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth middleware
│   ├── models/          # Database models
│   ├── routes/          # API endpoints
│   ├── server.js        # Main server file
│   └── package.json
└── ai_module/            # Python AI Script
    ├── crowd_detector.py # Main detection script
    └── requirements.txt  # Python dependencies
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or cloud instance)
- **Webcam** (for crowd detection)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd canteen-connect
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file (copy from env.example)
cp env.example .env

# Update .env with your configuration
MONGO_URI=mongodb://localhost:27017/canteen-connect
PORT=5000
JWT_SECRET=your-super-secret-jwt-key

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. AI Module Setup

```bash
cd ai_module

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run crowd detection
python crowd_detector.py
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Menu Management
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Add menu item (admin only)
- `PUT /api/menu/:id` - Update menu item (admin only)
- `DELETE /api/menu/:id` - Delete menu item (admin only)
- `POST /api/menu/:id/rate` - Rate menu item

### Crowd Monitoring
- `POST /api/crowd/report` - Report crowd data (AI script)
- `GET /api/crowd/latest` - Get latest crowd status
- `GET /api/crowd/history` - Get crowd history

## 🔐 Authentication & Authorization

The system uses JWT tokens for authentication with two user roles:

- **Student**: Can view menu, rate items, and see crowd status
- **Admin**: Full access including menu management

## 🤖 AI Crowd Detection

The Python script continuously:
1. Captures frames from webcam
2. Processes frames through YOLO model
3. Counts detected people
4. Sends data to backend API
5. Updates every 15 seconds

### Configuration Options

- **Detection Interval**: Adjust `DETECTION_INTERVAL` in the script
- **API Endpoint**: Update `API_ENDPOINT` if backend runs elsewhere
- **Webcam Index**: Change `WEBCAM_INDEX` for different cameras
- **Max Capacity**: Modify `MAX_CAPACITY` for your canteen

## 🎨 Customization

### Styling
- Modify `client/src/index.css` for global styles
- Update `client/tailwind.config.js` for theme customization
- Component-specific styles in individual component files

### Database Models
- Extend models in `server/models/` for additional fields
- Add new controllers and routes as needed

### AI Detection
- Modify confidence thresholds in `crowd_detector.py`
- Add additional object detection classes if needed

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Set up reverse proxy (Nginx/Apache)
4. Configure SSL certificates

### Frontend Deployment
1. Build production version: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Update API endpoints for production

### AI Module Deployment
1. Install dependencies on target machine
2. Ensure webcam access
3. Run as system service or background process
4. Monitor logs for errors

## 📝 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/canteen-connect
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
```

### Frontend (Vite config)
- API proxy configured for development
- Update for production deployment

## 🔧 Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style
- ESLint configured for React
- Prettier for code formatting
- Consistent component structure
- Proper error handling

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env

2. **Webcam Access Issues**
   - Verify webcam permissions
   - Check webcam index in script

3. **YOLO Model Download Issues**
   - Check internet connection
   - Verify Python dependencies

4. **CORS Errors**
   - Ensure backend CORS is configured
   - Check frontend proxy settings

### Logs
- Backend logs in console
- AI module logs in `crowd_detector.log`
- Check browser console for frontend errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- YOLO community for object detection models
- React and Node.js communities
- Tailwind CSS for beautiful styling
- OpenCV for computer vision capabilities

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Happy coding! 🎉**

