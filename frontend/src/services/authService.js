import { apiService } from './apiService.js';

/**
 * Service to handle authentication API calls
 */
const register = async (userData) => {
  // Validate input
  if (!userData || !userData.email || !userData.password) {
    throw new Error('Email and password are required');
  }
  
  const data = await apiService.register(userData);
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

const login = async (credentials) => {
  // Validate input
  if (!credentials || !credentials.email || !credentials.password) {
    throw new Error('Email and password are required');
  }
  
  const data = await apiService.login(credentials);
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userInfo'); // Remove old key
};

const getProfile = async () => {
  const data = await apiService.getProfile();
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

const updateProfile = async (userData) => {
  // Validate input
  if (!userData) {
    throw new Error('User data is required');
  }
  
  const data = await apiService.updateProfile(userData);
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

const getUsers = async () => {
  const data = await apiService.adminGetUsers();
  return data;
};

const getUserById = async (id) => {
  if (!id) {
    throw new Error('User ID is required');
  }
  
  const data = await apiService.adminGetUsers();
  const user = data.find(u => u._id === id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  getUsers,
  getUserById,
};

export default authService;
