import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a report title'],
  },
  description: {
    type: String,
  },
  filePath: {
    type: String,
    required: [true, 'File path is required'],
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
