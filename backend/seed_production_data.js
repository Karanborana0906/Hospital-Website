import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Doctor from './models/doctorModel.js';
import Hospital from './models/hospitalModel.js';

dotenv.config({ path: './backend/.env' });

const seedProductionData = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error('MONGO_URI is missing');
        
        await mongoose.connect(uri);
        console.log('Connected to MongoDB...');

        // Clear existing doctors to match photo exactly
        const doctorUsers = await User.find({ role: 'doctor' });
        const doctorUserIds = doctorUsers.map(u => u._id);
        await Doctor.deleteMany({ userId: { $in: doctorUserIds } });
        await User.deleteMany({ role: 'doctor' });
        await Hospital.deleteMany({});
        console.log('🧹 Cleared existing doctors and hospitals.');

        const password = 'password123';

        // 1. Clear existing data (OPTIONAL - but helpful for "exactly as photo")
        // await Doctor.deleteMany({});
        // await Hospital.deleteMany({});

        // 2. Doctors Data (Matching Photo)
        const doctors = [
            {
                name: 'manish',
                email: 'manish@curesync.com',
                specialization: 'General Physician',
                experience: 5,
                fees: 500,
                city: 'Mumbai',
                location: { lat: 19.0760, lng: 72.8777 },
                about: 'Experienced general physician providing comprehensive care.'
            },
            {
                name: 'Dr. Sarah Jenkins',
                email: 'sarah.j@curesync.com',
                specialization: 'Cardiology',
                experience: 15,
                fees: 150,
                city: 'Mumbai',
                location: { lat: 19.1200, lng: 72.8500 },
                about: 'Specialist in complex heart surgeries and preventive cardiology.'
            },
            {
                name: 'Dr. Michael Chen',
                email: 'm.chen@curesync.com',
                specialization: 'Neurology',
                experience: 12,
                fees: 200,
                city: 'Delhi',
                location: { lat: 28.6139, lng: 77.2090 },
                about: 'Expert in treating migraine, epilepsy and sleep disorders.'
            },
            {
                name: 'Dr. Emily Parker',
                email: 'emily.p@curesync.com',
                specialization: 'Pediatrics',
                experience: 8,
                fees: 120,
                city: 'Mumbai',
                location: { lat: 19.1000, lng: 72.9000 },
                about: 'Child healthcare specialist with a focus on nutritional wellness.'
            },
            {
                name: 'Dr. Rajesh Kumar',
                email: 'rajesh.k@curesync.com',
                specialization: 'Orthopedics',
                experience: 10,
                fees: 180,
                city: 'Bangalore',
                location: { lat: 12.9716, lng: 77.5946 },
                about: 'Specialist in joint replacements and sports medicine.'
            },
            {
                name: 'Dr. Sofia Rodriguez',
                email: 'sofia.r@curesync.com',
                specialization: 'Dermatology',
                experience: 7,
                fees: 160,
                city: 'Mumbai',
                location: { lat: 19.0500, lng: 72.8800 },
                about: 'Expert in clinical and aesthetic dermatology.'
            },
            // Adding more to reach 12
            { name: 'Dr. James Wilson', email: 'james.w@curesync.com', specialization: 'Oncology', experience: 20, fees: 300, city: 'Delhi', location: { lat: 28.6500, lng: 77.1500 } },
            { name: 'Dr. Anna Muller', email: 'anna.m@curesync.com', specialization: 'Gynecology', experience: 14, fees: 140, city: 'Mumbai', location: { lat: 19.1500, lng: 72.8200 } },
            { name: 'Dr. Kenji Sato', email: 'kenji.s@curesync.com', specialization: 'Orthopedics', experience: 11, fees: 190, city: 'Delhi', location: { lat: 28.6000, lng: 77.2500 } },
            { name: 'Dr. Lisa Wong', email: 'lisa.w@curesync.com', specialization: 'Pediatrics', experience: 9, fees: 110, city: 'Bangalore', location: { lat: 13.0000, lng: 77.6500 } },
            { name: 'Dr. Arjun Gupta', email: 'arjun.g@curesync.com', specialization: 'Cardiology', experience: 16, fees: 220, city: 'Mumbai', location: { lat: 19.0800, lng: 72.9500 } },
            { name: 'Dr. Elena Rossi', email: 'elena.r@curesync.com', specialization: 'Dermatology', experience: 6, fees: 150, city: 'Delhi', location: { lat: 28.5500, lng: 77.2000 } }
        ];

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

            let doctor = await Doctor.findOne({ userId: user._id });
            if (!doctor) {
                await Doctor.create({
                    userId: user._id,
                    specialization: d.specialization,
                    experience: d.experience,
                    fees: d.fees,
                    city: d.city,
                    location: d.location,
                    about: d.about,
                    availableDays: ['Monday', 'Wednesday', 'Friday'],
                    availableTime: { start: '09:00', end: '17:00' }
                });
                console.log(`✅ Added Doctor: ${d.name}`);
            }
        }

        // 3. Hospitals Data (To populate the map)
        const hospitals = [
            { name: 'City Heart Center', city: 'Mumbai', location: { lat: 19.0760, lng: 72.8777 }, type: 'Specialized' },
            { name: 'Metro Health Delhi', city: 'Delhi', location: { lat: 28.6139, lng: 77.2090 }, type: 'General' },
            { name: 'Bangalore Care', city: 'Bangalore', location: { lat: 12.9716, lng: 77.5946 }, type: 'Emergency Center' },
            { name: 'Mumbai North Hospital', city: 'Mumbai', location: { lat: 19.1500, lng: 72.8500 }, type: 'General' },
            { name: 'East Delhi Clinic', city: 'Delhi', location: { lat: 28.6500, lng: 77.3000 }, type: 'Emergency Center' },
            { name: 'Juhu Medical Center', city: 'Mumbai', location: { lat: 19.1000, lng: 72.8300 }, type: 'Specialized' },
            { name: 'South Mumbai ER', city: 'Mumbai', location: { lat: 18.9500, lng: 72.8200 }, type: 'Emergency Center' }
        ];

        for (const h of hospitals) {
            let hospital = await Hospital.findOne({ name: h.name });
            if (!hospital) {
                await Hospital.create({
                    ...h,
                    address: 'Test Address',
                    contact: '+91 000 000 0000',
                    availableServices: ['Ambulance', 'ER']
                });
                console.log(`✅ Added Hospital: ${h.name}`);
            }
        }

        console.log('🚀 Production data seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedProductionData();
