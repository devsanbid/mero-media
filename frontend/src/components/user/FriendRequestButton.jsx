import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUserPlus, FiUserCheck, FiUserX, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelSentRequest,
  unfriend
} from '../../redux/friendRequests/friendRequestsSlice';

const FriendRequestButton = ({ targetUserId, targetUser }) => {
  const dispatch = useDispatch();
  const { user: userDetails } = useSelector((state) => state.auth);
  const { sentRequests, receivedRequests, friends, isLoading } = useSelector(
    (state) => state.friendRequests
  );

  const [relationshipStatus, setRelationshipStatus] = useState('none');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!targetUserId || targetUserId === userDetails?.id) {
      setRelationshipStatus('self');
      return;
    }

    // Check if already friends
    const isFriend = friends.some(friend => friend.id === targetUserId);
    if (isFriend) {
      setRelationshipStatus('friends');
      return;
    }

    // Check if request was sent
    const sentRequest = sentRequests.find(req => req.to.id === targetUserId);
    if (sentRequest) {
      setRelationshipStatus('sent');
      return;
    }

    // Check if request was received
    const receivedRequest = receivedRequests.find(req => req.from.id === targetUserId);
    if (receivedRequest) {
      setRelationshipStatus('received');
      return;
    }

    setRelationshipStatus('none');
  }, [targetUserId, userDetails, sentRequests, receivedRequests, friends]);

  const handleSendRequest = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await dispatch(sendFriendRequest(targetUserId));
    } catch (error) {
      console.error('Error sending friend request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const receivedRequest = receivedRequests.find(req => req.from.id === targetUserId);
      if (receivedRequest) {
        await dispatch(acceptFriendRequest(receivedRequest.id));
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRequest = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const receivedRequest = receivedRequests.find(req => req.from.id === targetUserId);
      if (receivedRequest) {
        await dispatch(rejectFriendRequest(receivedRequest.id));
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelRequest = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const sentRequest = sentRequests.find(req => req.to.id === targetUserId);
      if (sentRequest) {
        await dispatch(cancelSentRequest(sentRequest.id));
      }
    } catch (error) {
      console.error('Error canceling friend request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnfriend = async () => {
    if (isProcessing) return;
    const confirmed = window.confirm(`Are you sure you want to unfriend ${targetUser?.fullName}?`);
    if (!confirmed) return;
    
    setIsProcessing(true);
    try {
      await dispatch(unfriend(targetUserId));
    } catch (error) {
      console.error('Error unfriending user:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (relationshipStatus === 'self') {
    return null;
  }

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );

  switch (relationshipStatus) {
    case 'none':
      return (
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleSendRequest}
          disabled={isProcessing || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? <LoadingSpinner /> : <FiUserPlus className="w-4 h-4" />}
          {isProcessing ? 'Sending...' : 'Add Friend'}
        </motion.button>
      );

    case 'sent':
      return (
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleCancelRequest}
          disabled={isProcessing || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? <LoadingSpinner /> : <FiClock className="w-4 h-4" />}
          {isProcessing ? 'Canceling...' : 'Request Sent'}
        </motion.button>
      );

    case 'received':
      return (
        <div className="flex gap-2">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleAcceptRequest}
            disabled={isProcessing || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? <LoadingSpinner /> : <FiCheck className="w-4 h-4" />}
            Accept
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleRejectRequest}
            disabled={isProcessing || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? <LoadingSpinner /> : <FiX className="w-4 h-4" />}
            Reject
          </motion.button>
        </div>
      );

    case 'friends':
      return (
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleUnfriend}
          disabled={isProcessing || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-red-100 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors group"
        >
          {isProcessing ? (
            <LoadingSpinner />
          ) : (
            <>
              <FiUserCheck className="w-4 h-4 group-hover:hidden" />
              <FiUserX className="w-4 h-4 hidden group-hover:block" />
            </>
          )}
          <span className="group-hover:hidden">
            {isProcessing ? 'Processing...' : 'Friends'}
          </span>
          <span className="hidden group-hover:block">
            {isProcessing ? 'Processing...' : 'Unfriend'}
          </span>
        </motion.button>
      );

    default:
      return null;
  }
};

export default FriendRequestButton;