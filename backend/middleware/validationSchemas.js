import { body } from 'express-validator';

// User registration validation schema
export const registerSchema = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .optional()
    .isIn(['patient', 'doctor', 'admin', 'superadmin'])
    .withMessage('Invalid role specified'),
  
  body('city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('location')
    .optional()
    .isObject()
    .withMessage('Location must be an object')
];

// User login validation schema
export const loginSchema = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Appointment booking validation schema
export const appointmentSchema = [
  body('doctorId')
    .notEmpty()
    .withMessage('Doctor ID is required')
    .isMongoId()
    .withMessage('Invalid doctor ID'),
  
  body('appointmentDate')
    .notEmpty()
    .withMessage('Appointment date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      if (date < now) {
        throw new Error('Appointment date cannot be in the past');
      }
      return true;
    }),
  
  body('timeSlot')
    .notEmpty()
    .withMessage('Time slot is required')
    .isLength({ min: 1 })
    .withMessage('Time slot cannot be empty'),
  
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason must not exceed 500 characters')
];

// Doctor profile update validation schema
export const doctorProfileSchema = [
  body('specialization')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Specialization is required'),
  
  body('experience')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Experience must be between 0 and 100 years'),
  
  body('fees')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fees must be a positive number'),
  
  body('city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('about')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('About section must not exceed 1000 characters'),
  
  body('availableDays')
    .optional()
    .isArray()
    .withMessage('Available days must be an array'),
  
  body('availableTime')
    .optional()
    .isObject()
    .withMessage('Available time must be an object')
];
