import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Doctor from './models/doctorModel.js';
import Hospital from './models/hospitalModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const addTestData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is not defined in .env');
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB...');

    const doctorsData = [
      {
        name: 'Dr. Aryan Sharma',
        email: 'aryan.sharma@example.com',
        specialization: 'Neurology',
        city: 'Ujjain',
        experience: 15,
        fees: 600,
        location: { lat: 23.1912, lng: 75.7923 },
        about: 'Expert in neurological disorders with 15 years of experience.'
      },
      {
        name: 'Dr. Priya Gupta',
        email: 'priya.gupta@example.com',
        specialization: 'Pediatrics',
        city: 'Ujjain',
        experience: 10,
        fees: 400,
        location: { lat: 23.1789, lng: 75.7845 },
        about: 'Dedicated pediatrician caring for children with love and expertise.'
      },
      {
        name: 'Dr. Rajesh Khanna',
        email: 'rajesh.khanna@example.com',
        specialization: 'Orthopedics',
        city: 'Ujjain',
        experience: 20,
        fees: 800,
        location: { lat: 23.1601, lng: 75.7950 },
        about: 'Senior orthopedic surgeon specializing in joint replacements.'
      },
      {
        name: 'Dr. Sneha Patil',
        email: 'sneha.patil@example.com',
        specialization: 'Dermatology',
        city: 'Ujjain',
        experience: 8,
        fees: 500,
        location: { lat: 23.1550, lng: 75.7800 },
        about: 'Specialist in skin care and cosmetic dermatology.'
      }
    ];

    const password = 'password123';
    
    for (const d of doctorsData) {
      // 1. Create or Update User
      let user = await User.findOne({ email: d.email });
      if (!user) {
        user = await User.create({
          name: d.name,
          email: d.email,
          password: password,
          role: 'doctor',
          city: d.city
        });
        console.log(`User created for ${d.name}`);
      }

      // 2. Create or Update Doctor Profile
      const doctorProfile = {
        userId: user._id,
        specialization: d.specialization,
        experience: d.experience,
        fees: d.fees,
        city: d.city,
        location: d.location,
        about: d.about,
        dailyAppointmentLimit: 10
      };

      await Doctor.findOneAndUpdate(
        { userId: user._id },
        doctorProfile,
        { upsert: true, new: true }
      );
      console.log(`Doctor profile updated for ${d.name}`);
    }

    // Add a hospital for testing map
    const hospitalsData = [
      {
        name: 'Ujjain City Hospital',
        address: 'Tower Chowk, Ujjain',
        contact: '0734-1234567',
        city: 'Ujjain',
        location: { lat: 23.1765, lng: 75.7885 },
        type: 'Private',
        availableServices: ['Emergency', 'ICU', 'Pharmacy']
      }
    ];

    for (const h of hospitalsData) {
      await Hospital.findOneAndUpdate(
        { name: h.name },
        h,
        { upsert: true, new: true }
      );
      console.log(`Hospital updated: ${h.name}`);
    }

    console.log('Test data added successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

addTestData();
