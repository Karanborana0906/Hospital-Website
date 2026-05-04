import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Route imports will go here
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || false
    : true, // Allow all origins in development
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Database Connection
if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/admin', adminRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Ok', message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (process.env.NODE_ENV === 'production') {
    // Don't expose stack trace in production
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
    });
  } else {
    // Show full error in development
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      stack: err.stack,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
