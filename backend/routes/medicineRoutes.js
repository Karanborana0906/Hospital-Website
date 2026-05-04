import express from 'express';
import { getMedicines, addMedicine } from '../controllers/medicineController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getMedicines)
  .post(protect, admin, addMedicine);

export default router;
