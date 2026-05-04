import User from '../models/userModel.js';

/**
 * Service to handle User database operations
 */
export const findUserByEmail = async (email) => {
  return await User.findOne({ email }).select('+password');
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findUserById = async (id) => {
  return await User.findById(id);
};

export const findUsers = async (query = {}) => {
  return await User.find(query);
};
