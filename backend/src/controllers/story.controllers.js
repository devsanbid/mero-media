// story.controllers.js
import { Story } from '../models/story.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Op } from 'sequelize';

// Create a story
export const createStory = asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  const userId = req.user.id;

  // Validate the content length
  if (content && content.length > 100) {
    return next(new ApiError(400, 'Content exceeds 100 characters limit'));
  }

  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  // Create the story
  const story = await Story.create({
    userId: userId,
    content,
    image: imagePath,
  });

  res.status(201).json(new ApiResponse(201, 'Story created successfully', story));
});

// Delete a story by ID
export const deleteStory = asyncHandler(async (req, res, next) => {
  const { storyId } = req.params;
  const userId = req.user.id;

  const story = await Story.findByPk(storyId);

  if (!story) {
    return next(new ApiError(404, 'Story not found'));
  }

  // Check if the story belongs to the logged-in user
  if (story.userId !== userId) {
    return next(new ApiError(403, 'You are not authorized to delete this story'));
  }

  await story.destroy();

  res.status(200).json(new ApiResponse(200, 'Story deleted successfully'));
});

// Automatically delete stories older than 24 hours
export const autoDeleteStories = asyncHandler(async (req, res, next) => {
  const now = new Date();
  // Find and delete all stories that have expired
  const deletedCount = await Story.destroy({
    where: {
      expiresAt: {
        [Op.lte]: now
      }
    }
  });

  res.status(200).json(new ApiResponse(200, 'Expired stories deleted', { count: deletedCount }));
});

// Get all stories of all users
export const getAllStories = asyncHandler(async (req, res, next) => {
  const stories = await Story.findAll({
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json(new ApiResponse(200, 'Stories fetched successfully', stories));
});
