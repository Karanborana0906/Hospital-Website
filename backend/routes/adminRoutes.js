import express from 'express';
import { getAdminStats, getLoginLogs } from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Currently using 'admin' as a placeholder for super admin check
// Ensure your authMiddleware has an admin check
router.get('/stats', protect, admin, getAdminStats);
router.get('/login-logs', protect, admin, getLoginLogs);

export default router;
