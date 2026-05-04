import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hospital from './models/hospitalModel.js';
import User from './models/userModel.js';
import Doctor from './models/doctorModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedUjjain = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-hospital';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB...');

    // Hospitals in Ujjain
    const hospitals = [
      {
        name: 'CHL Medical Center Ujjain',
        address: 'Freeganj, Ujjain, Madhya Pradesh 456010',
        contact: '0734-2513333',
        city: 'Ujjain',
        location: { lat: 23.1912, lng: 75.7923 },
        type: 'General',
        availableServices: ['Emergency', 'ICU', 'Neurology', 'Cardiology']
      },
      {
        name: 'RD Gardi Medical College',
        address: 'Agar Road, Ujjain, Madhya Pradesh 456006',
        contact: '0734-2521916',
        city: 'Ujjain',
        location: { lat: 23.2145, lng: 75.8123 },
        type: 'General',
        availableServices: ['Medical Education', 'Surgical', 'Pediatrics', 'Obstetrics']
      },
      {
        name: 'Patidar Hospital & Research Centre',
        address: '10, Sanwer Road, Ujjain, Madhya Pradesh 456010',
        contact: '0734-2531001',
        city: 'Ujjain',
        location: { lat: 23.1712, lng: 75.7754 },
        type: 'General',
        availableServices: ['General Medicine', 'Trauma Care', 'Diagnostic']
      },
      {
          name: 'Tejbankar Hospital',
          address: 'Gada Puliya, Ujjain, MP 456001',
          contact: '0734-2555555',
          city: 'Ujjain',
          location: { lat: 23.1793, lng: 75.7841 },
          type: 'General',
          availableServices: ['Orthopedics', 'Surgical']
      }
    ];

    for (const h of hospitals) {
      await Hospital.findOneAndUpdate({ name: h.name }, h, { upsert: true, new: true });
    }
    console.log('Ujjain Hospitals Seeded.');

    // Seed Doctors for Ujjain
    const doctors = [
        {
            name: 'Dr. Vivek Jain',
            email: 'vivek.jain@ujjainhospitals.com',
            specialization: 'Cardiology',
            city: 'Ujjain',
            experience: 18,
            fees: 500,
            location: { lat: 23.1912, lng: 75.7923 },
            about: 'Senior cardiologist in Ujjain with extensive experience in heart care.'
        },
        {
            name: 'Dr. Anjali Verma',
            email: 'anjali.v@ujjainhospitals.com',
            specialization: 'Pediatrics',
            city: 'Ujjain',
            experience: 12,
            fees: 300,
            location: { lat: 23.1712, lng: 75.7754 },
            about: 'Specialist in child health and nutritional wellness in Ujjain.'
        }
    ];

    const password = 'password123';
    for (const d of doctors) {
        let user = await User.findOne({ email: d.email });
        if (!user) {
            user = await User.create({
                name: d.name,
                email: d.email,
                password: password,
                role: 'doctor',
                city: d.city
            });
        }
        
        const doctorData = {
            userId: user._id,
            specialization: d.specialization,
            experience: d.experience,
            fees: d.fees,
            city: d.city,
            location: d.location,
            about: d.about
        };

        await Doctor.findOneAndUpdate({ userId: user._id }, doctorData, { upsert: true, new: true });
    }
    console.log('Ujjain Doctors Seeded.');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUjjain();
