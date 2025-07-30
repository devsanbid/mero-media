import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiEdit, FiBookmark, FiSettings, FiHelpCircle, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { DEFAULT_IMAGES } from '../constants';

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: <FiUser className="w-4 h-4" />,
      label: 'My Profile',
      href: user?.id ? `/user/profile/${user.id}` : '/user/me',
      description: 'View and edit your profile'
    },
    {
      icon: <FiEdit3 className="w-4 h-4" />,
      label: 'Edit Profile',
      href: '/user/settings',
      description: 'Update your information'
    },
    {
      icon: <FiBookmark className="w-4 h-4" />,
      label: 'Saved Posts',
      href: '/user/bookmarks',
      description: 'Your bookmarked content'
    },
    {
      icon: <FiSettings className="w-4 h-4" />,
      label: 'Settings',
      href: '/user/settings',
      description: 'Account preferences'
    },
    {
      icon: <FiHelpCircle className="w-4 h-4" />,
      label: 'Help & Support',
      href: '/user/contact',
      description: 'Get help and support'
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
          <img
            src={user?.profilePicture || DEFAULT_IMAGES.PROFILE_SMALL}
            alt={user?.fullName || 'User'}
            className="w-full h-full object-cover"
          />
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img
                    src={user?.profilePicture || DEFAULT_IMAGES.PROFILE_SMALL}
                    alt={user?.fullName || 'User'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {user?.fullName || 'User Name'}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    @{user?.username || 'username'}
                  </p>
                  {user?.role === 'admin' && (
                    <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full mt-1">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                  >
                    <div className="text-gray-500">{item.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-200 p-2">
              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiLogOut className="w-4 h-4" />
                <div className="flex-1 text-left">
                  <p className="font-medium">Sign Out</p>
                  <p className="text-xs text-red-500">Log out of your account</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;