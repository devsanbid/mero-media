// notification.controller.js
import { Notification } from '../models/notification.model.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Get all notifications for a user
export const getUserNotifications = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: { receiverUserId: userId },
      include: [{
        model: User,
        as: 'senderUser',
        attributes: ['id', 'fullName', 'profilePicture']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(new ApiResponse(200, 'Notifications fetched successfully', notifications));
  } catch (error) {
    next(new ApiError(500, 'Failed to fetch notifications'));
  }
});

// Mark all notifications as read
export const markAllNotificationsAsRead = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Notification.update(
      { isRead: true },
      { where: { receiverUserId: userId, isRead: false } }
    );

    res.status(200).json(new ApiResponse(200, 'All notifications marked as read'));
  } catch (error) {
    next(new ApiError(500, 'Failed to mark notifications as read'));
  }
});

// Mark a specific notification as read
export const markNotificationAsRead = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      where: { id: notificationId, receiverUserId: userId }
    });
    
    if (notification) {
      await notification.update({ isRead: true });
    }

    if (!notification) {
      return next(new ApiError(404, 'Notification not found or you are not authorized'));
    }

    res.status(200).json(new ApiResponse(200, 'Notification marked as read', notification));
  } catch (error) {
    next(new ApiError(500, 'Failed to mark notification as read'));
  }
});

// Delete a specific notification
export const deleteNotification = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      where: { id: notificationId, receiverUserId: userId }
    });
    
    if (notification) {
      await notification.destroy();
    }

    if (!notification) {
      return next(new ApiError(404, 'Notification not found or you are not authorized'));
    }

    res.status(200).json(new ApiResponse(200, 'Notification deleted successfully'));
  } catch (error) {
    next(new ApiError(500, 'Failed to delete notification'));
  }
});