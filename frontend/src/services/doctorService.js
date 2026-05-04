import axios from 'axios';

const API_URL = '/api/doctors';

const getStats = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(`${API_URL}/stats`, config);
  return data;
};

const getAppointments = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get('/api/appointments/doctor', config);
  return data;
};

const getReports = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get('/api/reports/doctor', config);
  return data;
};

const updateProfile = async (doctorData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.put(`${API_URL}/profile`, doctorData, config);
  return data;
};

const getDoctorByUserId = async (userId) => {
    const { data } = await axios.get(`${API_URL}/user/${userId}`);
    return data;
};

const doctorService = {
  getStats,
  getAppointments,
  getReports,
  updateProfile,
  getDoctorByUserId,
};

export default doctorService;
