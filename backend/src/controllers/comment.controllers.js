import { Comment } from '../models/comment.model.js';
import { Post } from '../models/post.model.js';
import { Notification } from '../models/notification.model.js';
import { CommentLike } from '../models/commentLikes.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';

// Controller to post a comment
export const postComment = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findByPk(userId);
  const { post, content } = req.body;

  const comment = await Comment.create({
    postId: post,
    userId: userId,
    content,
  });

  const populatedComment = await Comment.findByPk(comment.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['fullName', 'profilePicture']
    }]
  });

  const postData = await Post.findByPk(post);
  
  if (postData && postData.userId !== userId) {
    await Notification.create({
      senderUserId: userId,
      receiverUserId: postData.userId,
      message: `${user.fullName} commented on your post: "${content.substring(0, 30)}${content.length > 25 ? '...' : ''}"`,
      navigateLink: `/posts/${post}`,
    });
  }

  res.status(201).json(new ApiResponse(201, 'Comment posted successfully', populatedComment));
});

// Controller to edit a comment
export const editComment = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { commentId, content } = req.body;

  const comment = await Comment.findOne({ 
    where: { id: commentId, userId: userId }
  });
  if (!comment) {
    return next(new ApiError(404, 'Comment not found or unauthorized'));
  }

  comment.content = content;
  await comment.save();

  const populatedComment = await Comment.findByPk(comment.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['fullName', 'profilePicture']
    }]
  });

  res.status(200).json(new ApiResponse(200, 'Comment updated successfully', populatedComment));
});

// Controller to delete a comment
export const deleteComment = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { commentId } = req.body;

  const comment = await Comment.findOne({ 
    where: { id: commentId, userId: userId }
  });
  if (!comment) {
    return next(new ApiError(404, 'Comment not found or unauthorized'));
  }

  await comment.destroy();

  res.status(200).json(new ApiResponse(200, 'Comment deleted successfully'));
});

// Controller to get all comments of a specific post
export const getCommentsByPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const comments = await Comment.findAll({ 
    where: { postId: postId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['fullName', 'profilePicture']
    }]
  });

  res.status(200).json(new ApiResponse(200, 'Comments fetched successfully', comments));
});

export const toggleLikeComment = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findByPk(userId);
  const { commentId } = req.body;

  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    return next(new ApiError(404, 'Comment not found'));
  }

  const existingLike = await CommentLike.findOne({
    where: { userId: userId, commentId: commentId }
  });

  let isLiked = false;
  if (existingLike) {
    await existingLike.destroy();
    isLiked = false;
  } else {
    await CommentLike.create({ userId: userId, commentId: commentId });
    isLiked = true;
    
    if (comment.userId !== userId) {
      await Notification.create({
        senderUserId: userId,
        receiverUserId: comment.userId,
        message: `${user.fullName} liked your comment`,
        navigateLink: `/posts/${comment.postId}`,
      });
    }
  }

  const populatedComment = await Comment.findByPk(comment.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['fullName', 'profilePicture']
    }, {
      model: CommentLike,
      as: 'likes',
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'profilePicture']
      }]
    }]
  });

  res.status(200).json(new ApiResponse(200, isLiked ? 'Comment liked' : 'Comment disliked', populatedComment));
});

export const getUsersWhoLikedComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    return next(new ApiError(404, 'Comment not found'));
  }

  const likes = await CommentLike.findAll({
    where: { commentId: commentId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'fullName', 'profilePicture']
    }]
  });

  const likers = likes.map(like => like.user);

  res.status(200).json(new ApiResponse(200, 'List of users who liked the comment', likers));
});
