// follow.routes.js
import { Router } from 'express';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowStatus
} from '../controllers/follow.controllers.js';
import { fetchUser } from '../middleware/fetchUser.js';

const router = Router();

// All routes require authentication
router.use(fetchUser);

// Follow/unfollow routes
router.post('/follow', followUser);
router.post('/unfollow', unfollowUser);

// Get followers and following
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);

// Get follow status
router.get('/status/:userId', getFollowStatus);

export default router;