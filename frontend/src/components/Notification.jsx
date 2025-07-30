import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiUser, FiHeart, FiMessageCircle, FiUserPlus } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReceivedRequests } from '../redux/friendRequests/friendRequestsSlice';
import { Link } from 'react-router-dom';

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);
  const dispatch = useDispatch();
  const { receivedRequests } = useSelector((state) => state.friendRequests);

  // Friend requests are now fetched centrally in Layout component

  useEffect(() => {
    // Convert friend requests to notifications
    const requestNotifications = receivedRequests.map(request => ({
      id: request.id,
      type: 'friend_request',
      message: `${request.sender?.fullName} sent you a friend request`,
      user: request.sender,
      timestamp: new Date(request.createdAt),
      read: false
    }));

    setNotifications(requestNotifications);
  }, [receivedRequests]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'friend_request':
        return <FiUserPlus className="w-4 h-4 text-blue-500" />;
      case 'like':
        return <FiHeart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <FiMessageCircle className="w-4 h-4 text-green-500" />;
      default:
        return <FiBell className="w-4 h-4 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={notificationRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500">{unreadCount} unread</p>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {notification.user?.profilePicture ? (
                          <img
                            src={notification.user.profilePicture}
                            alt={notification.user.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {getNotificationIcon(notification.type)}
                          <p className="text-sm text-gray-900 truncate">
                            {notification.message}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.timestamp.toLocaleDateString()}
                        </p>
                        {notification.type === 'friend_request' && (
                          <div className="mt-2">
                            <Link
                              to="/user/pending-requests"
                              onClick={() => setIsOpen(false)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View Request
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <FiBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;