import express from 'express';
import { getDoctors, getDoctorById, getDoctorStats, updateDoctorProfile, getDoctorByUserId } from '../controllers/doctorController.js';

import { protect, doctor } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getDoctors);
router.get('/stats', protect, doctor, getDoctorStats);
router.put('/profile', protect, doctor, updateDoctorProfile);
router.get('/user/:userId', getDoctorByUserId);
router.route('/:id').get(getDoctorById);

export default router;
