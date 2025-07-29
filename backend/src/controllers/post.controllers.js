// post.controller.js
import { Post } from '../models/post.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Comment } from '../models/comment.model.js';
import { Notification } from '../models/notification.model.js';
import { User } from '../models/user.model.js';
import { PostLike } from '../models/postLikes.model.js';

// Create a new post
export const createPost = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { content, backgroundColor, pollData, feeling } = req.body;

    // Handle image upload
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    // Create post object with basic fields
    const postData = { 
      content, 
      image: imagePath,
      feeling,
      backgroundColor: backgroundColor || 'bg-white',
      userId: userId, 
    };

    // Add poll data if provided
    if (pollData && pollData.options && pollData.options.length >= 2) {
      const pollOptions = pollData.options.map(option => ({
        text: option,
        votes: []
      }));

      // Calculate poll end date based on duration in hours
      const endDate = new Date();
      endDate.setHours(endDate.getHours() + (pollData.duration || 24));

      postData.pollOptions = pollOptions;
      postData.pollEndDate = endDate;
      postData.pollActive = true;
    }

    // Create the new post
    const post = await Post.create(postData);

    // Fetch the new post with associated user details
    const populatedPost = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'profilePicture', 'username']
        }
      ]
    });

    res.status(201).json(new ApiResponse(201, 'Post created successfully', populatedPost));
  } catch (error) {
    next(new ApiError(500, 'Failed to create post'));
  }
});

// Get all posts of all users along with comments and user details
export const getAllPosts = asyncHandler(async (req, res, next) => {
  try {
    // Fetch all posts with associated user data
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'profilePicture', 'username']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Check if any polls have expired and update their active status
    const now = new Date();
    const updatedPosts = posts.map(post => {
      const postData = post.toJSON();
      if (postData.pollEndDate && postData.pollActive) {
        if (new Date(postData.pollEndDate) < now) {
          postData.pollActive = false;
          // Update the database record
          post.update({ pollActive: false });
        }
      }
      return postData;
    });

    res.status(200).json(new ApiResponse(200, 'All posts fetched successfully', updatedPosts));
  } catch (error) {
    next(new ApiError(500, 'Failed to fetch posts'));
  }
});

// get specific post by id
export const getPostById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the post by ID with associated user data
    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'profilePicture', 'username']
        }
      ]
    });

    if (!post) {
      return next(new ApiError(404, 'Post not found'));
    }

    // Check if the poll has expired and update its active status
    const now = new Date();
    if (post.pollEndDate && post.pollActive) {
      if (new Date(post.pollEndDate) < now) {
        await post.update({ pollActive: false });
      }
    }

    res.status(200).json(new ApiResponse(200, 'Post fetched successfully', post));
  } catch (error) {
    next(new ApiError(500, 'Failed to fetch post'));
  }
});


// Edit own post
export const editPost = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;
  const { content, backgroundColor } = req.body;

  // Find the post and ensure it belongs to the logged-in user
  const post = await Post.findOne({ 
    where: { 
      id: postId, 
      userId: userId 
    }
  });
  if (!post) {
    return next(new ApiError(404, 'Post not found or you are not authorized to edit this post'));
  }

  // Handle image upload
  let imagePath = post.image;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  // Update the post
  await post.update({
    content: content || post.content,
    image: imagePath,
    backgroundColor: backgroundColor || post.backgroundColor
  });

  const populatedPost = await Post.findByPk(post.id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'profilePicture', 'username']
      }
    ]
  });

  res.status(200).json(new ApiResponse(200, 'Post updated successfully', populatedPost));
});

// Delete own post
export const deletePost = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;

  // Find the post and ensure it belongs to the logged-in user
  const post = await Post.findOne({ 
    where: { 
      id: postId, 
      userId: userId 
    }
  });
  if (!post) {
    return next(new ApiError(404, 'Post not found or you are not authorized to delete this post'));
  }

  // Delete all comments associated with the deleted post
  await Comment.destroy({ 
    where: { 
      postId: postId 
    }
  });

  // Delete the post
  await post.destroy();

  res.status(200).json(new ApiResponse(200, 'Post and its comments deleted successfully'));
});

// Like or unlike a post
export const toggleLikePost = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { postId } = req.params;
  const user = await User.findByPk(userId);
  const { fullName } = user;

  const post = await Post.findByPk(postId);
  if (!post) {
    return next(new ApiError(404, 'Post not found'));
  }

  // Check if the user already liked the post
  const existingLike = await PostLike.findOne({
    where: {
      userId: userId,
      postId: postId
    }
  });

  if (existingLike) {
    // Unlike the post
    await existingLike.destroy();
  } else {
    // Like the post
    await PostLike.create({
      userId: userId,
      postId: postId
    });
    
    // Create notification for post owner if the liker is not the post owner
    if (post.userId !== userId) {
      await Notification.create({
        senderUserId: userId,
        receiverUserId: post.userId,
        message: `${fullName} liked your post`,
        navigateLink: `/posts/${postId}`,
      });
    }
  }

  const populatedPost = await Post.findByPk(post.id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'profilePicture', 'username']
      }
    ]
  });

  res.status(200).json(new ApiResponse(200, existingLike ? 'Post unliked' : 'Post liked', populatedPost));
});

// List of all users who liked a post
export const getPostLikers = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findByPk(postId);
  if (!post) {
    return next(new ApiError(404, 'Post not found'));
  }

  const postLikes = await PostLike.findAll({
    where: { postId: postId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'profilePicture', 'username']
      }
    ]
  });

  const likers = postLikes.map(like => like.user);

  res.status(200).json(new ApiResponse(200, 'List of likers fetched successfully', likers));
});

// Vote on a poll option
export const votePollOption = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findByPk(userId);
  const { fullName } = user;
  const { postId, optionId } = req.params;

  const post = await Post.findByPk(postId);
  if (!post) {
    return next(new ApiError(404, 'Post not found'));
  }

  // Check if poll exists and is active
  if (!post.pollOptions || !post.pollActive) {
    return next(new ApiError(400, 'Poll is not active or does not exist'));
  }

  // Check if poll has expired
  if (post.pollEndDate && new Date(post.pollEndDate) < new Date()) {
    await post.update({ pollActive: false });
    return next(new ApiError(400, 'Poll has expired'));
  }

  // Find the option by index (optionId should be the index)
  const optionIndex = parseInt(optionId);
  if (optionIndex < 0 || optionIndex >= post.pollOptions.length) {
    return next(new ApiError(404, 'Poll option not found'));
  }

  // Get current poll options
  let pollOptions = [...post.pollOptions];

  // Check if user has already voted on any option
  let userHasVoted = false;
  let previousVoteOptionIndex = null;

  for (let i = 0; i < pollOptions.length; i++) {
    if (pollOptions[i].votes && pollOptions[i].votes.includes(userId)) {
      userHasVoted = true;
      previousVoteOptionIndex = i;
      break;
    }
  }

  // If user has already voted, remove their vote from the previous option
  if (userHasVoted) {
    pollOptions[previousVoteOptionIndex].votes = pollOptions[previousVoteOptionIndex].votes.filter(id => id !== userId);
  }

  // Add user's vote to the selected option
  if (!pollOptions[optionIndex].votes) {
    pollOptions[optionIndex].votes = [];
  }
  pollOptions[optionIndex].votes.push(userId);

  // Update the post with new poll options
  await post.update({ pollOptions: pollOptions });
  
  // Create notification for post owner if the voter is not the post owner
  if (!userHasVoted && post.userId !== userId) {
    await Notification.create({
      senderUserId: userId,
      receiverUserId: post.userId,
      message: `${fullName} voted on your poll`,
      navigateLink: `/posts/${postId}`,
    });
  }

  // Return the updated post with populated fields
  const populatedPost = await Post.findByPk(post.id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'profilePicture', 'username']
      }
    ]
  });

  res.status(200).json(new ApiResponse(200, 'Vote recorded successfully', populatedPost));
});

// Get poll results
export const getPollResults = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findByPk(postId);
  
  if (!post || !post.pollOptions) {
    return next(new ApiError(404, 'Post or poll not found'));
  }

  // Calculate total votes
  let totalVotes = 0;
  post.pollOptions.forEach(option => {
    totalVotes += option.votes ? option.votes.length : 0;
  });

  // Calculate percentages and prepare results
  const results = post.pollOptions.map((option, index) => ({
    id: index,
    text: option.text,
    votes: option.votes || [],
    voteCount: option.votes ? option.votes.length : 0,
    percentage: totalVotes > 0 ? Math.round(((option.votes ? option.votes.length : 0) / totalVotes) * 100) : 0
  }));

  res.status(200).json(new ApiResponse(200, 'Poll results fetched successfully', {
    results,
    totalVotes,
    active: post.pollActive,
    endDate: post.pollEndDate
  }));
});
