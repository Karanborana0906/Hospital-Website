import { findUserByEmail, createUser, findUserById } from '../services/userService.js';
import { createDoctor } from '../services/doctorService.js';
import LoginLog from '../models/loginLogModel.js';
import GlobalSetting from '../models/globalSettingModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  const email = req.body.email?.trim();
  const password = req.body.password; // Trimming password is generally not advised as spaces can be part of password

  try {
    const user = await findUserByEmail(email);

    if (user && (await user.matchPassword(password))) {
      // Super Admin "Master Email" Logic
      if (user.role === 'superadmin') {
        let masterEmailSetting = await GlobalSetting.findOne({ key: 'masterSuperAdminEmail' });
        
        if (!masterEmailSetting) {
          masterEmailSetting = await GlobalSetting.create({
            key: 'masterSuperAdminEmail',
            value: user.email
          });
        } else if (masterEmailSetting.value !== user.email) {
          return res.status(403).json({ message: 'Only the authorized Master Super Admin can access this panel.' });
        }
      }

      // Save Login Log
      try {
        await LoginLog.create({
          userId: user._id,
          role: user.role,
          ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
        });
      } catch (logError) {
        console.error('Non-critical: Failed to save login log:', logError.message);
        // We continue even if log fails to prevent login blockage
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { 
    name, email, password, role, city, location,
    specialization, experience, fees, about 
  } = req.body;

  try {
    const userExists = await findUserByEmail(email);

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await createUser({
      name,
      email,
      password,
      role: role || 'patient',
      city,
      location
    });

    // If doctor or admin, create doctor profile (since they use the same clinical panel)
    if (user && (user.role === 'doctor' || user.role === 'admin')) {

      await createDoctor({
        userId: user._id,
        specialization: specialization || 'General Medicine',
        experience: experience || 0,
        fees: fees || 0,
        city: city || 'Unknown',
        location: location || null,
        about: about || `Dr. ${name} is a dedicated healthcare professional.`
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.city = req.body.city || user.city;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        city: updatedUser.city,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin (SuperAdmin)
export const getUsers = async (req, res) => {
  try {
    const User = (await import('../models/userModel.js')).default;
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/auth/users/:id
// @access  Private/Admin (SuperAdmin)
export const getUserById = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

