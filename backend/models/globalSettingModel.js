import mongoose from 'mongoose';

const globalSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const GlobalSetting = mongoose.model('GlobalSetting', globalSettingSchema);

export default GlobalSetting;
