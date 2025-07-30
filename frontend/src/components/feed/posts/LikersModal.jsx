import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../../constants';

const LikersModal = ({ likers, closeModal }) => {
  const navigate = useNavigate();

  const handleProfileClick = (userId) => {
    navigate(`/user/profile/${userId}`);
    closeModal();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-96 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FiHeart className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Liked by {likers.length} {likers.length === 1 ? 'person' : 'people'}
              </h3>
            </div>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-80">
            {likers.length > 0 ? (
              <div className="p-2">
                {likers.map((liker) => (
                  <motion.div
                    key={liker.id}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="flex items-center p-3 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleProfileClick(liker.id)}
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(liker.profilePicture) || '/default-avatar.png'}
                        alt={liker.fullName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center">
                        <FiHeart className="w-2 h-2 text-white fill-current" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                        {liker.fullName}
                      </h4>
                      <p className="text-sm text-gray-500">@{liker.username}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FiHeart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No likes yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LikersModal;