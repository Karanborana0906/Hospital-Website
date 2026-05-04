import express from 'express';
import { getHospitals, createHospital } from '../controllers/hospitalController.js';

const router = express.Router();

router.route('/')
  .get(getHospitals)
  .post(createHospital); // In real app, add admin middleware

export default router;
