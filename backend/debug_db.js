import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Doctor from './models/doctorModel.js';

dotenv.config({ path: './backend/.env' });

const debugDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const doctors = await Doctor.find({}).populate('userId');
        console.log(`Total Doctors in DB: ${doctors.length}`);
        doctors.forEach(d => {
            console.log(`- Doctor: ${d.userId ? d.userId.name : 'NULL USER'} (${d.specialization})`);
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugDB();
