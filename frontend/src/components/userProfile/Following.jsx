import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUserPlus, FiUserCheck, FiMessageCircle } from 'react-icons/fi';
import { getFollowing } from '../../redux/follow/followSlice';

const Following = ({ userId }) => {
  const dispatch = useDispatch();
  const { following, status } = useSelector((state) => state.follow);
  const userFollowing = following[userId] || [];

  useEffect(() => {
    if (userId) {
      dispatch(getFollowing(userId));
    }
  }, [dispatch, userId]);

  if (status === 'loading') {
    return (
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiUserPlus className="text-green-500" />
          Following
        </h3>
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FiUserPlus className="text-green-500" />
        Following ({userFollowing.length})
      </h3>
      {userFollowing.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-2xl"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FiUserPlus className="text-green-500 text-3xl" />
          </div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">Not following anyone yet</h4>
          <p className="text-gray-500 max-w-sm">Discover and follow interesting people to see their updates.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {userFollowing.map((following, index) => (
              <motion.div
                key={following.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <Link
                  to={`/user/profile/${following.id}`}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative mb-3">
                    <img
                      src={following.profilePicture || "https://via.placeholder.com/80"}
                      alt={following.fullName}
                      className="w-16 h-16 rounded-full border-3 border-white shadow-md object-cover group-hover:border-green-200 transition-all duration-300"
                    />
                    {following.isDpVerify && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <FiUserCheck className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm group-hover:text-green-600 transition-colors truncate w-full">
                    {following.fullName}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 truncate w-full">
                    @{following.username || 'username'}
                  </p>
                </Link>
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/user/profile/${following.id}`}
                    className="flex-1 py-1.5 px-3 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors text-center"
                  >
                    View
                  </Link>
                  <button className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                    <FiMessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Following;