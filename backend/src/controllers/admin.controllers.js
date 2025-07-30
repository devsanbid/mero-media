import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';
import { Comment } from '../models/comment.model.js';
import { Story } from '../models/story.model.js';
import { FriendRequest } from '../models/friendRequests.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';

// Dashboard Overview
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.count();
  const totalPosts = await Post.count();
  const totalComments = await Comment.count();
  const totalStories = await Story.count();
  const totalFriendRequests = await FriendRequest.count();

  // Get users registered in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newUsers = await User.count({
    where: {
      createdAt: {
        [Op.gte]: thirtyDaysAgo
      }
    }
  });

  // Get posts created in the last 30 days
  const newPosts = await Post.count({
    where: {
      createdAt: {
        [Op.gte]: thirtyDaysAgo
      }
    }
  });

  // Get recent activity (last 10 users and posts)
  const recentUsers = await User.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'fullName', 'username', 'email', 'createdAt', 'role']
  });

  const recentPosts = await Post.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']],
    include: [{
      model: User,
      as: 'user',
      attributes: ['fullName', 'username']
    }]
  });

  const stats = {
    totalUsers,
    totalPosts,
    totalComments,
    totalStories,
    totalFriendRequests,
    newUsers,
    newPosts,
    recentUsers,
    recentPosts
  };

  res.status(200).json(new ApiResponse(200, 'Dashboard stats fetched successfully', stats));
});

// User Management
export const getAllUsersAdmin = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, search = '', role = '' } = req.query;
  const offset = (page - 1) * limit;

  const whereClause = {};
  
  if (search) {
    whereClause[Op.or] = [
      { fullName: { [Op.iLike]: `%${search}%` } },
      { username: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } }
    ];
  }

  if (role) {
    whereClause.role = role;
  }

  const { count, rows: users } = await User.findAndCountAll({
    where: whereClause,
    attributes: { exclude: ['password'] },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json(new ApiResponse(200, 'Users fetched successfully', {
    users,
    totalUsers: count,
    currentPage: parseInt(page),
    totalPages: Math.ceil(count / limit)
  }));
});

export const updateUserRole = asyncHandler(async (req, res, next) => {
  const { userId, role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return next(new ApiError(400, 'Invalid role specified'));
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  user.role = role;
  await user.save();

  res.status(200).json(new ApiResponse(200, 'User role updated successfully', {
    userId: user.id,
    role: user.role
  }));
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findByPk(userId);
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  // Don't allow deleting other admins
  if (user.role === 'admin' && user.id !== req.user.id) {
    return next(new ApiError(403, 'Cannot delete other admin users'));
  }

  await user.destroy();

  res.status(200).json(new ApiResponse(200, 'User deleted successfully'));
});

export const toggleUserVerification = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const user = await User.findByPk(userId);
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  user.isDpVerify = !user.isDpVerify;
  await user.save();

  res.status(200).json(new ApiResponse(200, 'User verification status updated', {
    userId: user.id,
    isDpVerify: user.isDpVerify
  }));
});

// Post Management
export const getAllPostsAdmin = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;

  const whereClause = {};
  
  if (search) {
    whereClause.content = { [Op.iLike]: `%${search}%` };
  }

  const { count, rows: posts } = await Post.findAndCountAll({
    where: whereClause,
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'fullName', 'username', 'profilePicture']
    }, {
      model: Comment,
      as: 'comments',
      attributes: ['id']
    }],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json(new ApiResponse(200, 'Posts fetched successfully', {
    posts,
    totalPosts: count,
    currentPage: parseInt(page),
    totalPages: Math.ceil(count / limit)
  }));
});

export const deletePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findByPk(postId);
  if (!post) {
    return next(new ApiError(404, 'Post not found'));
  }

  await post.destroy();

  res.status(200).json(new ApiResponse(200, 'Post deleted successfully'));
});

// Create Admin User
export const createAdminUser = asyncHandler(async (req, res, next) => {
  const { username, fullName, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new ApiError(400, 'User with this email already exists'));
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin user
  const adminUser = await User.create({
    username,
    fullName,
    email,
    password: hashedPassword,
    role: 'admin'
  });

  const { password: _, ...adminUserWithoutPassword } = adminUser.toJSON();

  res.status(201).json(new ApiResponse(201, 'Admin user created successfully', adminUserWithoutPassword));
});