import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Doctor from './models/doctorModel.js';
import Hospital from './models/hospitalModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-hospital';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB for seeding...');

        const password = 'password123';

        // --- SEED DOCTORS ---
        const doctorsData = [
            {
                name: 'Dr. Sarah Jenkins',
                email: 'sarah.j@curesync.com',
                specialization: 'Cardiology',
                experience: 15,
                fees: 150,
                city: 'Mumbai',
                location: { lat: 19.0760, lng: 72.8777 },
                about: 'Specialist in complex heart surgeries and preventive cardiology.',
                availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                availableTime: { start: '09:00', end: '14:00' }
            },
            {
                name: 'Dr. Michael Chen',
                email: 'm.chen@curesync.com',
                specialization: 'Neurology',
                experience: 12,
                fees: 200,
                city: 'Delhi',
                location: { lat: 28.6139, lng: 77.2090 },
                about: 'Expert in treating migraine, epilepsy and sleep disorders.',
                availableDays: ['Monday', 'Wednesday', 'Friday'],
                availableTime: { start: '10:00', end: '16:00' }
            },
            {
                name: 'Dr. Emily Parker',
                email: 'emily.p@curesync.com',
                specialization: 'Pediatrics',
                experience: 8,
                fees: 100,
                city: 'Mumbai',
                location: { lat: 19.1070, lng: 72.8377 },
                about: 'Child healthcare specialist with a focus on nutritional wellness.',
                availableDays: ['Tuesday', 'Thursday', 'Saturday'],
                availableTime: { start: '11:00', end: '18:00' }
            }
        ];

        for (const data of doctorsData) {
            let user = await User.findOne({ email: data.email });
            if (!user) {
                user = await User.create({
                    name: data.name,
                    email: data.email,
                    password: password,
                    role: 'doctor',
                    city: data.city
                });
            }

            let doctor = await Doctor.findOne({ userId: user._id });
            if (!doctor) {
                await Doctor.create({
                    userId: user._id,
                    specialization: data.specialization,
                    experience: data.experience,
                    fees: data.fees,
                    city: data.city,
                    location: data.location,
                    about: data.about,
                    availableDays: data.availableDays,
                    availableTime: data.availableTime
                });
            }
        }

        // --- SEED HOSPITALS ---
        const hospitalsData = [
            {
                name: 'City Heart Center',
                address: '45 Marine Drive, Mumbai',
                contact: '+91 22 1234 5678',
                city: 'Mumbai',
                location: { lat: 18.9440, lng: 72.8237 },
                type: 'Specialized',
                availableServices: ['Ambulance', 'ER', 'ICU']
            },
            {
                name: 'Delhi Metro Hospital',
                address: '10 Rajpath, New Delhi',
                contact: '+91 11 9876 5432',
                city: 'Delhi',
                location: { lat: 28.6129, lng: 77.2295 },
                type: 'General',
                availableServices: ['General Medicine', 'Ambulance']
            },
            {
                name: 'Mumbai Emergency Clinic',
                address: '88 Juhu Tara Road, Mumbai',
                contact: '+91 22 9999 8888',
                city: 'Mumbai',
                location: { lat: 19.1014, lng: 72.8268 },
                type: 'Emergency Center',
                availableServices: ['24/7 ER', 'Trauma Care']
            }
        ];

        for (const h of hospitalsData) {
            let hospital = await Hospital.findOne({ name: h.name });
            if (!hospital) {
                await Hospital.create(h);
            }
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
