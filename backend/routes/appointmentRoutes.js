import express from 'express';
import { getMyAppointments, bookAppointment, getAllAppointments, getDoctorAppointments, updateAppointmentStatus, getRepeatPatients } from '../controllers/appointmentController.js';
import { protect, admin, doctor } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMyAppointments)
  .post(protect, bookAppointment);

router.route('/admin')
  .get(protect, admin, getAllAppointments);

router.route('/doctor')
  .get(protect, doctor, getDoctorAppointments);

router.route('/repeat-patients')
  .get(protect, getRepeatPatients);

router.route('/:id/status')
  .put(protect, doctor, updateAppointmentStatus);

export default router;
