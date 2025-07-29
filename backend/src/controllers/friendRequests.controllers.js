// friendRequest.controller.js
import { FriendRequest } from '../models/friendRequests.model.js';
import { User } from '../models/user.model.js';
import { Notification } from '../models/notification.model.js';
import { UserFriend } from '../models/userFriends.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Send a friend request to another user
export const sendFriendRequest = asyncHandler(async (req, res, next) => {
  const senderId = req.user.id;
  const { receiverId } = req.body;

  if (senderId === receiverId) {
    return next(new ApiError(400, 'You cannot send a friend request to yourself'));
  }

  // Check if a request already exists
  const existingRequest = await FriendRequest.findOne({ where: { senderId: senderId, receiverId: receiverId } });
  if (existingRequest) {
    return next(new ApiError(400, 'Friend request already sent'));
  }

  // Create the friend request
  const friendRequest = await FriendRequest.create({ senderId: senderId, receiverId: receiverId });

  // Get sender name for notification
  const sender = await User.findByPk(senderId);
  
  // Create notification for receiver
  await Notification.create({
    senderUserId: senderId,
    receiverUserId: receiverId,
    message: `${sender.fullName} sent you a friend request`,
    navigateLink: `/profile/${senderId}`,
  });

  res.status(201).json(new ApiResponse(201, 'Friend request sent successfully', friendRequest));
});

// Accept a friend request
export const acceptFriendRequest = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { requestId } = req.body;

  // Find the request
  const friendRequest = await FriendRequest.findOne({ where: { id: requestId, receiverId: userId } });
  if (!friendRequest) {
    return next(new ApiError(404, 'Friend request not found'));
  }

  // Add each other as friends
  await UserFriend.create({ userId: userId, friendId: friendRequest.senderId });
  await UserFriend.create({ userId: friendRequest.senderId, friendId: userId });

  // Get recipient name for notification
  const recipient = await User.findByPk(userId);
  
  // Create notification for sender of original request
  await Notification.create({
    senderUserId: userId,
    receiverUserId: friendRequest.senderId,
    message: `${recipient.fullName} accepted your friend request`,
    navigateLink: `/profile/${userId}`,
  });

  // Remove the friend request
  await friendRequest.destroy();

  res.status(200).json(new ApiResponse(200, 'Friend request accepted successfully'));
});

// Reject or delete a friend request
export const rejectFriendRequest = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { requestId } = req.body;

  // Find and delete the request
  const friendRequest = await FriendRequest.findOne({ where: { id: requestId, receiverId: userId } });
  if (friendRequest) {
    await friendRequest.destroy();
  }
  if (!friendRequest) {
    return next(new ApiError(404, 'Friend request not found'));
  }

  res.status(200).json(new ApiResponse(200, 'Friend request rejected successfully'));
});

// Get list of all requests sent by the user
export const getSentRequests = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const sentRequests = await FriendRequest.findAll({ 
    where: { senderId: userId },
    include: [{
      model: User,
      as: 'receiver',
      attributes: ['id', 'fullName', 'username', 'bio', 'profilePicture', 'coverImage']
    }]
  });

  res.status(200).json(new ApiResponse(200, 'Sent friend requests fetched successfully', sentRequests));
});

// Get list of all requests received by the user
export const getReceivedRequests = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const receivedRequests = await FriendRequest.findAll({ 
    where: { receiverId: userId },
    include: [{
      model: User,
      as: 'sender',
      attributes: ['id', 'fullName', 'username', 'bio', 'profilePicture', 'coverImage']
    }]
  });
  res.status(200).json(new ApiResponse(200, 'Received friend requests fetched successfully', receivedRequests));
});

// Get the list of all friends of the logged-in user
export const getFriendsList = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const userFriends = await UserFriend.findAll({
    where: { userId: userId },
    include: [{
      model: User,
      as: 'friend',
      attributes: ['id', 'fullName', 'username', 'bio', 'profilePicture', 'coverImage']
    }]
  });
  
  const friends = userFriends.map(uf => uf.friend);

  res.status(200).json(new ApiResponse(200, 'Friends list fetched successfully', friends));
});


// Cancel a sent friend request
export const cancelSentRequest = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { requestId } = req.body;

  // Find and delete the sent friend request
  const friendRequest = await FriendRequest.findOne({
    where: {
      id: requestId,
      senderId: userId,
    }
  });

  if (friendRequest) {
    await friendRequest.destroy();
  }

  if (!friendRequest) {
    return next(new ApiError(404, 'Friend request not found or already cancelled'));
  }

  res.status(200).json(new ApiResponse(200, 'Friend request cancelled successfully'));
});


// Unfriend a friend
export const unfriend = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { friendId } = req.body;

  // Check if the friend exists in the user's friends list
  const user = await User.findByPk(userId);
  const friend = await User.findByPk(friendId);

  if (!user || !friend) {
    return next(new ApiError(404, 'User or friend not found'));
  }

  // Remove each other from friends list
  if (user && friend) {
    await UserFriend.destroy({ where: { userId: userId, friendId: friendId } });
    await UserFriend.destroy({ where: { userId: friendId, friendId: userId } });
  }

  res.status(200).json(new ApiResponse(200, 'Friend removed successfully'));
});
