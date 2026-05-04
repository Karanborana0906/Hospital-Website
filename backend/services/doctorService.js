import Doctor from '../models/doctorModel.js';

/**
 * Service to handle Doctor database operations
 */
export const fetchAllDoctors = async () => {
  return await Doctor.find({}).populate('userId', 'name email profileImage');
};

export const fetchDoctorById = async (id) => {
  return await Doctor.findById(id).populate('userId', 'name email profileImage');
};

export const createDoctor = async (doctorData) => {
  const doctor = new Doctor(doctorData);
  return await doctor.save();
};

export const updateDoctorDetails = async (id, updateData) => {
  return await Doctor.findByIdAndUpdate(id, updateData, { new: true });
};
