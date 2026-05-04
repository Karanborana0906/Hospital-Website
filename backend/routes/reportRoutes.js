import express from 'express';
import { uploadReport, getMyReports, getAllReports, getDoctorReports } from '../controllers/reportController.js';
import { protect, admin, doctor } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, upload.single('reportFile'), uploadReport)
  .get(protect, getMyReports);

router.get('/admin', protect, admin, getAllReports);
router.get('/doctor', protect, doctor, getDoctorReports);

export default router;

