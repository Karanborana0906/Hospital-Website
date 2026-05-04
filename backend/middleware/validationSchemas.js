import Joi from 'joi';

// User Registration Validation
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters'
  }),
  role: Joi.string().valid('patient', 'doctor', 'admin', 'superadmin').default('patient'),
  city: Joi.string().optional(),
  location: Joi.object().optional()
});

// User Login Validation
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
});

// Appointment Booking Validation
export const appointmentSchema = Joi.object({
  doctorId: Joi.string().required().messages({
    'string.empty': 'Doctor ID is required'
  }),
  appointmentDate: Joi.date().required().messages({
    'date.base': 'Please provide a valid date',
    'any.required': 'Appointment date is required'
  }),
  timeSlot: Joi.string().required().messages({
    'string.empty': 'Time slot is required'
  }),
  reason: Joi.string().optional()
});

// Doctor Profile Validation
export const doctorSchema = Joi.object({
  specialization: Joi.string().required().messages({
    'string.empty': 'Specialization is required'
  }),
  experience: Joi.number().min(0).required().messages({
    'number.base': 'Experience must be a number',
    'number.min': 'Experience cannot be negative'
  }),
  fees: Joi.number().min(0).required().messages({
    'number.base': 'Fees must be a number',
    'number.min': 'Fees cannot be negative'
  }),
  city: Joi.string().required().messages({
    'string.empty': 'City is required'
  }),
  about: Joi.string().optional()
});
