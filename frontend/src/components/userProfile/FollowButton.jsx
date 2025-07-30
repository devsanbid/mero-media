import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser, getFollowStatus } from '../../redux/follow/followSlice';

const FollowButton = ({ userId, className = '' }) => {
  const dispatch = useDispatch();
  const { followStatus, status } = useSelector((state) => state.follow);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const userFollowStatus = followStatus[userId] || { isFollowing: false, isFollowedBy: false };
  const isFollowing = userFollowStatus.isFollowing;

  useEffect(() => {
    if (userId && user && userId !== user.id) {
      dispatch(getFollowStatus(userId));
    }
  }, [dispatch, userId, user]);

  const handleFollowToggle = async () => {
    if (!user || userId === user.id) return;
    
    setIsLoading(true);
    try {
      if (isFollowing) {
        await dispatch(unfollowUser(userId)).unwrap();
      } else {
        await dispatch(followUser(userId)).unwrap();
      }
    } catch (error) {
      console.error('Follow/unfollow error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button for own profile
  if (!user || userId === user.id) {
    return null;
  }

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading || status === 'loading'}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        isFollowing
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span>{isFollowing ? 'Unfollowing...' : 'Following...'}</span>
        </div>
      ) : (
        <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
      )}
    </button>
  );
};

export default FollowButton;