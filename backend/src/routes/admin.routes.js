import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import {
  getDashboardStats,
  getAllUsersAdmin,
  updateUserRole,
  deleteUser,
  toggleUserVerification,
  getAllPostsAdmin,
  deletePost,
  createAdminUser
} from '../controllers/admin.controllers.js';

const router = express.Router();

// All admin routes require admin authentication
router.use(adminAuth);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);

// User management routes
router.get('/users', getAllUsersAdmin);
router.put('/users/role', updateUserRole);
router.delete('/users/:userId', deleteUser);
router.put('/users/verify', toggleUserVerification);
router.post('/users/create-admin', createAdminUser);

// Post management routes
router.get('/posts', getAllPostsAdmin);
router.delete('/posts/:postId', deletePost);

export default router;