import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

const getStats = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(`${API_BASE_URL}/api/doctors/stats`, config);
  return data?.data || data;
};

const getAppointments = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(`${API_BASE_URL}/api/appointments/doctor`, config);
  return data?.data || data;
};

const getReports = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(`${API_BASE_URL}/api/reports/doctor`, config);
  return data?.data || data;
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
