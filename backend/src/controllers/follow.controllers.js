// follow.controllers.js
import { User } from '../models/user.model.js';
import { UserFollow } from '../models/userFollow.model.js';
import { Notification } from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Op } from 'sequelize';

// Follow a user
export const followUser = asyncHandler(async (req, res, next) => {
  const followerId = req.user.id;
  const { userId } = req.body;

  if (followerId === userId) {
    return next(new ApiError(400, 'You cannot follow yourself'));
  }

  // Check if already following
  const existingFollow = await UserFollow.findOne({
    where: { followerId: followerId, followingId: userId }
  });

  if (existingFollow) {
    return next(new ApiError(400, 'You are already following this user'));
  }

  // Create follow relationship
  await UserFollow.create({ followerId: followerId, followingId: userId });

  // Update followers and following arrays in User model
  const follower = await User.findByPk(followerId);
  const followedUser = await User.findByPk(userId);

  if (!followedUser) {
    return next(new ApiError(404, 'User not found'));
  }

  // Update following array for follower
  const updatedFollowing = [...(follower.following || []), userId];
  await follower.update({ following: updatedFollowing });

  // Update followers array for followed user
  const updatedFollowers = [...(followedUser.followers || []), followerId];
  await followedUser.update({ followers: updatedFollowers });

  // Create notification
  await Notification.create({
    senderUserId: followerId,
    receiverUserId: userId,
    message: `${follower.fullName} started following you`,
    navigateLink: `/profile/${followerId}`,
  });

  res.status(201).json(new ApiResponse(201, 'User followed successfully'));
});

// Unfollow a user
export const unfollowUser = asyncHandler(async (req, res, next) => {
  const followerId = req.user.id;
  const { userId } = req.body;

  // Find and delete the follow relationship
  const followRelation = await UserFollow.findOne({
    where: { followerId: followerId, followingId: userId }
  });

  if (!followRelation) {
    return next(new ApiError(404, 'You are not following this user'));
  }

  await followRelation.destroy();

  // Update followers and following arrays in User model
  const follower = await User.findByPk(followerId);
  const followedUser = await User.findByPk(userId);

  // Update following array for follower
  const updatedFollowing = (follower.following || []).filter(id => id !== userId);
  await follower.update({ following: updatedFollowing });

  // Update followers array for followed user
  const updatedFollowers = (followedUser.followers || []).filter(id => id !== followerId);
  await followedUser.update({ followers: updatedFollowers });

  res.status(200).json(new ApiResponse(200, 'User unfollowed successfully'));
});

// Get followers list
export const getFollowers = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findByPk(userId);
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  const followerIds = user.followers || [];
  const followers = await User.findAll({
    where: {
      id: {
        [Op.in]: followerIds
      }
    },
    attributes: ['id', 'fullName', 'username', 'bio', 'profilePicture']
  });

  res.status(200).json(new ApiResponse(200, 'Followers fetched successfully', followers));
});

// Get following list
export const getFollowing = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findByPk(userId);
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  const followingIds = user.following || [];
  const following = await User.findAll({
    where: {
      id: {
        [Op.in]: followingIds
      }
    },
    attributes: ['id', 'fullName', 'username', 'bio', 'profilePicture']
  });

  res.status(200).json(new ApiResponse(200, 'Following list fetched successfully', following));
});

// Get follow status between two users
export const getFollowStatus = asyncHandler(async (req, res, next) => {
  const currentUserId = req.user.id;
  const { userId } = req.params;

  const isFollowing = await UserFollow.findOne({
    where: { followerId: currentUserId, followingId: userId }
  });

  const isFollowedBy = await UserFollow.findOne({
    where: { followerId: userId, followingId: currentUserId }
  });

  res.status(200).json(new ApiResponse(200, 'Follow status fetched successfully', {
    isFollowing: !!isFollowing,
    isFollowedBy: !!isFollowedBy
  }));
});