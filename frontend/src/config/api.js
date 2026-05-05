// Centralized API Configuration
export const API_BASE_URL = 'https://hospital-website-w3vl.onrender.com';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  PROFILE: '/api/auth/profile',
  
  // Doctors
  DOCTORS: '/api/doctors',
  DOCTOR_PROFILE: '/api/doctors/:id',
  
  // Appointments
  APPOINTMENTS: '/api/appointments',
  APPOINTMENT_STATUS: '/api/appointments/:id/status',
  REPEAT_PATIENTS: '/api/appointments/repeat-patients',
  
  // Chat
  CHAT: '/api/chat',
  
  // Reports
  REPORTS: '/api/reports',
  
  // Medicines
  MEDICINES: '/api/medicines',
  
  // Hospitals
  HOSPITALS: '/api/hospitals',
  
  // Admin
  ADMIN_USERS: '/api/admin/users',
  ADMIN_DOCTORS: '/api/admin/doctors',
  ADMIN_APPOINTMENTS: '/api/admin/appointments',
  ADMIN_REPORTS: '/api/admin/reports',
  ADMIN_MEDICINES: '/api/admin/medicines',
};

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Helper function to get auth token
export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

// Helper function for authenticated requests
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token 
    ? { ...DEFAULT_HEADERS, 'Authorization': token }
    : DEFAULT_HEADERS;
};
