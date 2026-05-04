import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a hospital name'],
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  contact: {
    type: String,
    required: [true, 'Please add a contact number'],
  },
  city: {
    type: String,
    required: [true, 'Please add a city'],
  },
  location: {
    lat: Number,
    lng: Number
  },
  type: {
    type: String,
    enum: ['General', 'Specialized', 'Emergency Center'],
    default: 'General'
  },
  availableServices: [String]
}, {
  timestamps: true,
});

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;
