// user.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { FriendRequest } from '../models/friendRequests.model.js';
import { ValidationError } from 'sequelize';

const profilePictures = [
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/1_ijpza2.png",
  "https://img.freepik.com/premium-photo/3d-avatar-boy-character_914455-603.jpg",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/8_ff3tta.png",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/3_bmxh2t.png",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/9_s4mvtd.png",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/7_uimci3.png",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/4_d2vuip.png",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/5_xhf1vy.png",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651746/3d%20avatar/6_pksp2n.png",
  "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/3_bmxh2t.png",
];

const coverImages = [
  "https://t3.ftcdn.net/jpg/05/38/74/02/360_F_538740200_HNOc2ABQarAJshNsLB4c3DXAuiCLl2QI.jpg",
  "https://t4.ftcdn.net/jpg/05/34/78/37/360_F_534783787_w337He2LnkNIgJ0J26y6CYZpmios8aUk.jpg",
  "https://img.freepik.com/free-photo/light-background-with-sunset-projector-lamp_53876-128374.jpg",
  "https://t4.ftcdn.net/jpg/08/26/27/49/360_F_826274943_kQB6Hqf5oQ4lveeRAHuqaQxHQKMYH6h0.jpg",
  "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsb2ZmaWNlMjBfM2RfbW9kZXJuX3dhdmVfY3VydmVfYWJzdHJhY3RfaGFsZnRvbmVfZ3JhZGllbl8xZTJhY2M3Mi1jZTU3LTQ0NjItOGQzNS1lOTI4YzI5NzcxMTdfMS5qcGc.jpg",
  "https://t3.ftcdn.net/jpg/05/38/74/02/360_F_538740200_HNOc2ABQarAJshNsLB4c3DXAuiCLl2QI.jpg",
  "https://t4.ftcdn.net/jpg/05/34/78/37/360_F_534783787_w337He2LnkNIgJ0J26y6CYZpmios8aUk.jpg",
  "https://img.freepik.com/free-photo/light-background-with-sunset-projector-lamp_53876-128374.jpg",
  "https://t4.ftcdn.net/jpg/08/26/27/49/360_F_826274943_kQB6Hqf5oQ4lveeRAHuqaQxHQKMYH6h0.jpg",
  "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsb2ZmaWNlMjBfM2RfbW9kZXJuX3dhdmVfY3VydmVfYWJzdHJhY3RfaGFsZnRvbmVfZ3JhZGllbl8xZTJhY2M3Mi1jZTU3LTQ0NjItOGQzNS1lOTI4YzI5NzcxMTdfMS5qcGc.jpg"
];

// Register a new user
export const registerUser = asyncHandler(async (req, res, next) => {
  const { username, fullName, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new ApiError(400, 'User with this email already exists'));
  }

  // Get the current count of users to determine profile picture assignment
  const userCount = await User.count();

  // Calculate the profile picture and cover index
  const profilePictureIndex = userCount % profilePictures.length;
  const assignedProfilePicture = profilePictures[profilePictureIndex];

  const assignedCoverPicture = coverImages[profilePictureIndex];

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with an assigned profile picture
  const user = await User.create({
    username,
    fullName,
    email,
    password: hashedPassword,
    profilePicture: assignedProfilePicture || "https://res.cloudinary.com/datvbo0ey/image/upload/v1726651745/3d%20avatar/1_ijpza2.png",
    coverImage: assignedCoverPicture || "https://t3.ftcdn.net/jpg/05/38/74/02/360_F_538740200_HNOc2ABQarAJshNsLB4c3DXAuiCLl2QI.jpg",
  });

  if (!user) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  return res.status(201).json(new ApiResponse(201, 'User registered successfully', { id: user.id }));
});

// Login a user
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new ApiError(400, 'Invalid credentials'));
  }

  // Check the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ApiError(400, 'Invalid credentials'));
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(200).json(new ApiResponse(200, 'User logged in successfully', { token, role: user.role }));
});

// Get details of the logged-in user
export const getUserDetails = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  res.status(200).json(new ApiResponse(200, 'User details fetched successfully', user));
});

// Get details of the user using id
export const userDetails = asyncHandler(async (req, res, next) => {
  // Access userId from the URL parameters
  const { userId } = req.params;

  // Fetch the user from the database
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  // Check if user exists
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  // Get the list of users who have sent friend requests to this user (followers)
  const followers = await FriendRequest.findAll({ 
    where: { receiverId: userId },
    attributes: ['senderId']
  });
  const followersList = followers.map((request) => request.senderId);

  // Get the list of users to whom this user has sent friend requests (following)
  const following = await FriendRequest.findAll({ 
    where: { senderId: userId },
    attributes: ['receiverId']
  });
  const followingList = following.map((request) => request.receiverId);

  // Send the user details along with followers and following lists in the response
  res.status(200).json(
    new ApiResponse(200, 'User details fetched successfully', {
      ...user.toJSON(),
      followers: followersList,
      following: followingList,
    })
  );
});

// Get all users
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password', 'email'] }
  });

  res.status(200).json(new ApiResponse(200, 'All users fetched successfully', users));
});

// Update user profile
export const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const {
    username,
    fullName,
    email,
    password,
    profilePicture,
    coverImage,
    location,
    bio,
    dob,
    isDpVerify,
    website,
  } = req.body;

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  try {
    const updateData = {};
    if (username) updateData.username = username;
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (location) updateData.location = location;
    if (bio) updateData.bio = bio;
    if (dob) updateData.dob = dob;
    if (website) updateData.website = website;
    if (isDpVerify !== undefined) updateData.isDpVerify = isDpVerify;

    // Handle file uploads
    if (req.files) {
      if (req.files.profilePicture && req.files.profilePicture[0]) {
        updateData.profilePicture = `/uploads/${req.files.profilePicture[0].filename}`;
      }
      if (req.files.coverImage && req.files.coverImage[0]) {
        updateData.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
      }
    }

    // Handle URL updates (when no file is uploaded)
    if (!req.files || !req.files.profilePicture) {
      if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    }
    if (!req.files || !req.files.coverImage) {
      if (coverImage !== undefined) updateData.coverImage = coverImage;
    }

    const updatedUser = await user.update(updateData);
    
    // Return updated user data without password
    const { password: _, ...userWithoutPassword } = updatedUser.toJSON();
    
    res.json({ 
      success: true, 
      message: 'User updated successfully',
      user: userWithoutPassword 
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      // Format errors for the frontend
      const errors = {};
      for (let error of err.errors) {
        errors[error.path] = {
          message: error.message
        };
      }
      return res.status(400).json({ success: false, errors });
    }
    next(err);
  }
});
