import axios from 'axios';
import { API_BASE_URL, DEFAULT_HEADERS, getAuthHeaders } from '../config/api.js';

// Debug: Log the base URL
console.log('API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: DEFAULT_HEADERS,
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token and debug
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
      return Promise.reject(error);
    }
    
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Handle 403 forbidden
    if (error.response?.status === 403) {
      error.message = 'Access denied. You do not have permission to perform this action.';
      return Promise.reject(error);
    }
    
    // Handle 404 not found
    if (error.response?.status === 404) {
      error.message = 'Resource not found.';
      return Promise.reject(error);
    }
    
    // Handle 500 server error
    if (error.response?.status === 500) {
      error.message = 'Server error. Please try again later.';
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// API Service Methods
export const apiService = {
  // Auth APIs
  login: async (credentials) => {
    const { data } = await api.post('/api/auth/login', credentials);
    return data;
  },
  
  register: async (userData) => {
    const { data } = await api.post('/api/auth/register', userData);
    return data;
  },
  
  getProfile: async () => {
    const { data } = await api.get('/api/auth/profile');
    return data;
  },
  
  updateProfile: async (userData) => {
    const { data } = await api.put('/api/auth/profile', userData);
    return data;
  },
  
  // Doctors APIs
  getDoctors: async () => {
    const { data } = await api.get('/api/doctors');
    return data;
  },
  
  getDoctorById: async (id) => {
    const { data } = await api.get(`/api/doctors/${id}`);
    return data;
  },
  
  // Appointments APIs
  getAppointments: async () => {
    const { data } = await api.get('/api/appointments');
    return data;
  },
  
  bookAppointment: async (appointmentData) => {
    const { data } = await api.post('/api/appointments', appointmentData);
    return data;
  },
  
  updateAppointmentStatus: async (id, status) => {
    const { data } = await api.put(`/api/appointments/${id}/status`, { status });
    return data;
  },
  
  getRepeatPatients: async () => {
    const { data } = await api.get('/api/appointments/repeat-patients');
    return data;
  },
  
  // Chat API
  sendMessage: async (message) => {
    const { data } = await api.post('/api/chat', { message });
    return data;
  },
  
  // Reports APIs
  getReports: async () => {
    const { data } = await api.get('/api/reports');
    return data;
  },
  
  uploadReport: async (formData) => {
    const { data } = await api.post('/api/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  
  // Medicines APIs
  getMedicines: async (keyword = '') => {
    const { data } = await api.get('/api/medicines', {
      params: keyword ? { keyword } : {}
    });
    return data;
  },
  
  // Hospitals APIs
  getHospitals: async () => {
    const { data } = await api.get('/api/hospitals');
    return data;
  },
  
  // Admin APIs
  adminGetUsers: async () => {
    const { data } = await api.get('/api/auth/users');
    return data;
  },
  
  adminGetDoctors: async () => {
    const { data } = await api.get('/api/doctors');
    return data;
  },
  
  adminGetAppointments: async () => {
    const { data } = await api.get('/api/appointments/admin');
    return data;
  },
  
  adminGetReports: async () => {
    const { data } = await api.get('/api/reports/admin');
    return data;
  },
  
  adminGetMedicines: async () => {
    const { data } = await api.get('/api/medicines');
    return data;
  },
  
  // Health Check
  healthCheck: async () => {
    const { data } = await api.get('/api/health');
    return data;
  },
};

export default api;
