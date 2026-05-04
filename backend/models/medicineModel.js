import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a medicine name'],
    unique: true,
  },
  description: {
    type: String,
  },
  usage: {
    type: String,
    required: [true, 'Please add medicine usage'],
  },
  dosage: {
    type: String,
    required: [true, 'Please add dosage information'],
  },
  sideEffects: {
    type: String,
  },
  category: {
    type: String,
  }
}, {
  timestamps: true,
});

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;
