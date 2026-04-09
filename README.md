# Nexa AI - Full Stack Application

A modern AI-powered chat application with React frontend and Node.js backend, optimized for production deployment on Render.

## 🏗️ Project Structure

```
Nexa_AI/
├── Backend/          # Node.js + Express API server
│   ├── models/       # MongoDB data models
│   ├── routes/       # API endpoints
│   ├── middleware/   # Authentication middleware
│   ├── utils/        # Utility functions
│   └── server.js     # Main server file
├── Frontend/         # React + Vite frontend
│   ├── src/          # React components and pages
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
└── README.md         # This file
```

## 🚀 Deployment Instructions

### Backend Deployment (Render)
1. Connect this repository to Render
2. Create a **Web Service** with:
   - **Root Directory**: `Backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `18.x` or higher

### Frontend Deployment (Render)
1. Create a **Static Site** with:
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: `18.x` or higher

## 🔧 Environment Variables

### Backend Environment Variables
Set these in your Render dashboard for the backend service:

```bash
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb+srv://your-connection-string
GEMINI_API_KEY=your-gemini-api-key
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables
Create a `.env` file in the `Frontend` directory:

```bash
VITE_API_URL=https://your-backend-domain.com
```

## 📋 Features

- **Authentication**: User signup/login with JWT tokens
- **AI Chat**: Integration with Google Gemini AI
- **Real-time Messaging**: Thread-based conversations
- **Production Ready**: Optimized for Render deployment
- **Security**: CORS configuration, environment variable handling
- **Monitoring**: Health check endpoints and logging

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **Google Gemini AI** API
- **bcrypt** for password hashing

### Frontend
- **React 19** with **Vite**
- **React Router** for navigation
- **Axios** for API calls
- **React Markdown** for message rendering
- **Tailwind CSS** for styling

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Chat
- `GET /api/thread` - Get all threads
- `GET /api/thread/:threadId` - Get thread messages
- `POST /api/chat` - Send message to AI
- `DELETE /api/thread/:threadId` - Delete thread

### Health
- `GET /health` - Health check endpoint
- `GET /` - API documentation

## 📝 Development

### Backend Development
```bash
cd Backend
npm install
npm run dev
```

### Frontend Development
```bash
cd Frontend
npm install
npm run dev
```

## 🚨 Important Notes

- Backend connects to MongoDB before starting the server
- All secrets are stored in environment variables
- CORS is configured for production deployment
- Health check endpoint for monitoring
- Proper error handling and logging throughout

## 📞 Support

This project is production-ready and configured for seamless deployment on Render platform.
