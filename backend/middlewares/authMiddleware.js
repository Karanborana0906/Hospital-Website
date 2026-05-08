import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

      if (!decoded.id) {
        console.error('JWT decoded but missing id:', decoded);
      }

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.error('User not found for ID from token:', decoded.id);
        return res.status(401).json({ message: 'User no longer exists' });
      }

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export const superAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a super admin' });
  }
};

export const doctor = (req, res, next) => {
  if (req.user && (req.user.role === 'doctor' || req.user.role === 'admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a doctor' });
  }
};

