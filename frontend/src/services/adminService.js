import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

const API_URL = '/api/admin';

const getStats = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(`${API_BASE_URL}${API_URL}/stats`, config);
  return data;
};

const getLoginLogs = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(`${API_BASE_URL}${API_URL}/login-logs`, config);
  return data;
};

const getAllAppointments = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(`${API_BASE_URL}/api/appointments/admin`, config);
  return data;
};

const getAllReports = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(`${API_BASE_URL}/api/reports/admin`, config);
  return data;
};

const adminService = {
  getStats,
  getLoginLogs,
  getAllAppointments,
  getAllReports,
};

export default adminService;
