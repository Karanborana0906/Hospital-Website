
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://karanborana0906:Karanborana0906@cluster0.o6z1h.mongodb.net/hospital?retryWrites=true&w=majority');
    
    const email = 'admin@hospital.com';
    const password = 'admin123';
    
    const existingAdmin = await User.findOne({ email });
    
    if (existingAdmin) {
      existingAdmin.role = 'superadmin';
      await existingAdmin.save();
      console.log('User promoted to SuperAdmin successfully');
    } else {
      const superAdmin = await User.create({
        name: 'Super Admin',
        email,
        password,
        role: 'superadmin'
      });
      console.log('SuperAdmin created successfully');
    }
    
    console.log('---------------------------');
    console.log('Email: ' + email);
    console.log('Password: ' + password);
    console.log('---------------------------');
    
    process.exit();
  } catch (error) {
    console.error('Error creating SuperAdmin:', error);
    process.exit(1);
  }
};

createSuperAdmin();
