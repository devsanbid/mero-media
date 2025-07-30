import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiUserCheck, FiMessageCircle, FiEye, FiSearch } from 'react-icons/fi';
import { fetchFriendsList } from '../../redux/friendRequests/friendRequestsSlice';
import FriendRequestButton from '../user/FriendRequestButton';

const FriendList = ({ userId }) => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friendRequests?.friendsList || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFriends = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchFriendsList());
      } finally {
        setIsLoading(false);
      }
    };
    loadFriends();
  }, [dispatch, userId]);

  const handleFriendshipChange = () => {
    dispatch(fetchFriendsList());
  };

  // Filter friends by search term
  const filteredFriends = friends.filter(friend => {
    return friend.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.username?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiUsers className="text-purple-500" />
          Friends
        </h3>
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FiUsers className="text-purple-500" />
          Friends ({filteredFriends.length})
        </h3>
        
        {friends.length > 0 && (
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {friends.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-2xl"
        >
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <FiUsers className="text-purple-500 text-3xl" />
          </div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">No friends yet</h4>
          <p className="text-gray-500 max-w-sm">Start connecting with people to build your friend network.</p>
        </motion.div>
      ) : filteredFriends.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-2xl"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiSearch className="text-gray-400 text-2xl" />
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">No friends found</h4>
          <p className="text-gray-500">Try searching with a different term.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {filteredFriends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <Link
                  to={`/user/profile/${friend.id}`}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative mb-3">
                    <img
                      src={friend.profilePicture || "https://via.placeholder.com/80"}
                      alt={friend.fullName}
                      className="w-16 h-16 rounded-full border-3 border-white shadow-md object-cover group-hover:border-purple-200 transition-all duration-300"
                    />
                    {friend.isDpVerify && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                        <FiUserCheck className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm group-hover:text-purple-600 transition-colors truncate w-full">
                    {friend.fullName}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 truncate w-full">
                    @{friend.username || 'username'}
                  </p>
                </Link>
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/user/profile/${friend.id}`}
                    className="flex-1 py-1.5 px-3 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors text-center flex items-center justify-center gap-1"
                  >
                    <FiEye className="w-3 h-3" />
                    View
                  </Link>
                  <button className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors">
                    <FiMessageCircle className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2">
                  <FriendRequestButton 
                    userId={friend.id} 
                    onFriendshipChange={handleFriendshipChange}
                    className="w-full text-xs py-1.5"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FriendList;