import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  specialization: {
    type: String,
    required: [true, 'Please add specialization'],
  },
  experience: {
    type: Number,
    required: [true, 'Please add experience in years'],
  },
  fees: {
    type: Number,
    required: [true, 'Please add consultation fees'],
  },
  city: {
    type: String,
    required: [true, 'Please add a city'],
  },
  location: {
    lat: Number,
    lng: Number
  },
  availableDays: [{
    type: String, // e.g., 'Monday', 'Wednesday'
  }],
  availableTime: {
    start: String, // e.g., '09:00'
    end: String,   // e.g., '17:00'
  },
  about: {
    type: String,
  },
  bookedSlots: [{
    date: {
      type: Date,
    },
    timeSlot: {
      type: String,
    }
  }],
  dailyAppointmentLimit: {
    type: Number,
    default: 8
  }
}, {
  timestamps: true,
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
