# Smart Hospital Backend API

## Production Deployment Guide

### Environment Variables
Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGO_URI` - MongoDB Atlas connection string
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Set to 'production' for production
- `FRONTEND_URL` - Your frontend domain for CORS
- `EMAIL_ENABLED` - Set to true/false for email notifications
- `JWT_SECRET` - Your JWT secret key

### MongoDB Atlas Setup
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string from Atlas
5. Add the connection string to `MONGO_URI`

### Render Deployment
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Add build command: `npm install`
4. Add start command: `npm start`
5. Deploy!

### API Endpoints
- `/api/auth` - Authentication routes
- `/api/appointments` - Appointment management
- `/api/doctors` - Doctor management
- `/api/chat` - Chatbot functionality
- `/api/reports` - Medical reports
- `/api/medicines` - Medicine management
- `/api/hospitals` - Hospital data
- `/api/admin` - Admin functions

### Health Check
- `GET /api/health` - API health status

## Changes Made for Production

1. **MongoDB Connection**: Removed localhost fallback, added proper error handling
2. **Environment Variables**: Comprehensive .env.example with all required variables
3. **CORS Configuration**: Production-ready CORS with domain restrictions
4. **Error Handling**: Production-safe error responses
5. **Security**: Removed sensitive data exposure in production
6. **Performance**: Added request size limits and proper middleware
