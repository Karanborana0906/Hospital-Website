import express from 'express';
import { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, getUserById } from '../controllers/authController.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/users')
    .get(protect, getUsers);

router.route('/users/:id')
    .get(protect, getUserById);

export default router;
