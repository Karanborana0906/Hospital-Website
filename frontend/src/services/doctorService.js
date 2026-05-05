import { apiService } from './apiService.js';

const getStats = async () => {
  const data = await apiService.getDoctors(); // Using getDoctors as fallback
  return { stats: { totalDoctors: data.length, availableDoctors: data.filter(d => d.available).length } };
};

const getAppointments = async () => {
  const data = await apiService.getAppointments();
  return data;
};

const getReports = async () => {
  const data = await apiService.getReports();
  return data;
};

const updateProfile = async (doctorData) => {
  const data = await apiService.updateProfile(doctorData);
  return data;
};

const getDoctorByUserId = async (userId) => {
  const doctors = await apiService.getDoctors();
  const doctor = doctors.find(d => d.userId === userId || d.userId?._id === userId);
  return doctor;
};

const doctorService = {
  getStats,
  getAppointments,
  getReports,
  updateProfile,
  getDoctorByUserId,
};

export default doctorService;
