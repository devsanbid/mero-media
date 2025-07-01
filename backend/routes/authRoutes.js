import express from 'express';
import { register, login, getProfile, getAllUsers } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticateToken, getProfile);
router.get('/users', getAllUsers);

export default router;
