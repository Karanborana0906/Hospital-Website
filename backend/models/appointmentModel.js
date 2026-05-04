import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Please add an appointment date'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Please add a time slot'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'cancelled'],
    default: 'pending',
  },
  reason: {
    type: String,
  }
}, {
  timestamps: true,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
