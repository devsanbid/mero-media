import React, { useEffect, useState } from 'react';
import { logout } from '../redux/auth/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '../redux/auth/authSlice';
import { FiMail } from 'react-icons/fi';
import { DEFAULT_IMAGES, getImageUrl } from '../constants';

const Sidebar = ({ isSidebar }) => {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const [minimize, setMinimize] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { isLoggedIn, user: userDetails, loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Remove duplicate fetchUserDetails call - handled by Layout component

  useEffect(() => {
    console.log('Sidebar - isLoggedIn:', isLoggedIn, 'userDetails:', userDetails, 'loading:', loading);
  }, [isLoggedIn, userDetails, loading]);

  if (!isClient) {
    return null;
  }

  const toggleSidebar = () => {
    setMinimize(!minimize);
  };

  const sidebarVariants = {
    expanded: {
      width: "16rem",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    collapsed: {
      width: "5.5rem",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const itemVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
    }
  };

  return (
    <>
      {isLoggedIn &&
        <motion.div
          className={`${isSidebar ? 'block' : 'hidden md:block md:relative fixed z-20'}`}
          initial={false}
          animate={minimize ? "collapsed" : "expanded"}
          variants={sidebarVariants}
        >
          <motion.div
            className={`sidebar fixed overflow-y-auto bg-white text-gray-900 flex flex-col border-r border-gray-200 shadow-lg`}
            style={{ height: "calc(100vh - 4rem)" }}
            animate={minimize ? "collapsed" : "expanded"}
            variants={sidebarVariants}
          >
            <motion.button
              className="absolute right-0 bottom-32 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-2.5 rounded-l-lg z-10 shadow-lg"
              onClick={toggleSidebar}
              whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              {minimize ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 17 18 12 13 7"></polyline>
                  <polyline points="6 17 11 12 6 7"></polyline>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="11 17 6 12 11 7"></polyline>
                  <polyline points="18 17 13 12 18 7"></polyline>
                </svg>
              )}
            </motion.button>

            <div>
              <Link to={userDetails?.id ? `/user/profile/${userDetails.id}` : '/user/me'} className="relative overflow-hidden">
                <motion.div
                  className={`flex items-center space-x-2.5 border-b border-gray-200 bg-white ${minimize ? 'justify-center py-6' : 'px-5 py-4'}`}
                >
                  <motion.div
                    className={`rounded-full overflow-hidden border-2 border-white shadow-md ${minimize ? 'w-10 h-10' : 'w-14 h-14'}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{ minWidth: minimize ? '40px' : '56px', minHeight: minimize ? '40px' : '56px' }}
                  >
                    <motion.img
                      src={getImageUrl(userDetails?.profilePicture) || DEFAULT_IMAGES.PROFILE_PICTURE}
                      alt="Profile"
                      className="object-cover w-full h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    />
                  </motion.div>

                  <AnimatePresence>
                    {!minimize && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col overflow-hidden"
                      >
                        {loading ? (
                          <>
                            <div className="h-5 bg-gray-200 rounded animate-pulse mb-1"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          </>
                        ) : (
                          <>
                            <h3 className="text-lg font-semibold text-gray-800 capitalize whitespace-nowrap overflow-hidden text-ellipsis">{userDetails?.fullName || "Loading..."}</h3>
                            <p className="text-sm text-indigo-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis">@{userDetails?.username || "loading"}</p>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            </div>

            <nav className="flex-1 py-4 px-3">
              <ul className="space-y-2 overflow-hidden">
                {menuItems.filter(item => !item.adminOnly || userDetails?.role === 'admin').map((item, index) => {
                  const isActive = location.pathname === item.href || (item.myProfile && location.pathname.includes('/profile'));
                  return (
                    <motion.li
                      key={item.label}
                      className="relative"
                      onHoverStart={() => setHoveredItem(item.label)}
                      onHoverEnd={() => setHoveredItem(null)}
                      whileHover="hover"
                      variants={itemVariants}
                    >
                      <Link
                        to={item.myProfile ? (userDetails?.id ? `/user/profile/${userDetails.id}` : '/user/me') : item.href}
                        className={`flex items-center rounded-xl transition-all duration-200 
                          ${isActive
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-gray-700 hover:text-indigo-700 hover:bg-[#EEF2FF]'} 
                          ${minimize ? 'justify-center p-3' : 'px-4 py-3'}`}
                      >
                        <div className={`relative ${isActive ? '' : 'group'}`}>
                          <motion.img
                            src={item.iconSrc}
                            className={`select-none ${minimize ? 'w-8 h-8' : 'w-7 h-7'}`}
                            alt={`${item.label}`}
                            whileHover={{
                              rotate: isActive ? 0 : 10,
                              scale: isActive ? 1 : 1.1
                            }}
                          />

                          {!isActive && hoveredItem === item.label && !minimize && (
                            <motion.div
                              className="absolute inset-0 bg-indigo-100 rounded-full opacity-30"
                              initial={{ scale: 0 }}
                              animate={{ scale: 2 }}
                              transition={{ duration: 0.5 }}
                            />
                          )}
                        </div>

                        <AnimatePresence>
                          {!minimize && (
                            <motion.span
                              className={`ml-4 font-medium text-sm ${isActive ? 'text-white' : ''}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {item.isNew && !minimize && (
                          <motion.span
                            className="ml-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              transition: {
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 1
                              }
                            }}
                          >
                            NEW
                          </motion.span>
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div className="py-3 border-t border-gray-200">
              <AnimatePresence>
                {!minimize && (
                  <motion.h3
                    className="text-xs uppercase text-gray-500 font-semibold ml-6 mb-2 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Support
                  </motion.h3>
                )}
              </AnimatePresence>

              <ul className="space-y-1 px-3">
                <motion.li
                  whileHover="hover"
                  variants={itemVariants}
                >
                  <Link
                    to="/user/settings"
                    className={`flex items-center text-sm font-medium rounded-xl transition-all duration-200 
                      ${location.pathname === '/user/settings' ? 'bg-blue-50 text-blue-700' : ''}  
                      ${minimize ? 'py-3 justify-center' : 'p-3 hover:bg-blue-50 hover:text-blue-700'}`}
                  >
                    <motion.img
                      src="https://cdn-icons-png.flaticon.com/512/2698/2698011.png"
                      className="w-7"
                      alt="settings"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    />

                    <AnimatePresence>
                      {!minimize && (
                        <motion.span
                          className="ml-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Settings
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.li>

                <motion.li
                  whileHover="hover"
                  variants={itemVariants}
                >
                  <motion.button
                    className={`flex items-center text-sm font-medium rounded-xl transition-all duration-200 w-full text-left 
                      ${minimize ? 'py-3 justify-center' : 'p-3 hover:bg-red-50 hover:text-red-600'}`}
                    onClick={handleLogout}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.img
                      src="https://cdn-icons-png.flaticon.com/512/1828/1828304.png"
                      className="w-7 h-7"
                      alt="logout"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    />

                    <AnimatePresence>
                      {!minimize && (
                        <motion.span
                          className="ml-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Logout
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.li>
              </ul>

              {!minimize && (
                <motion.div
                  className="mb-6 mx-3 mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-5 rounded-2xl shadow-sm border border-indigo-100">
                    <div className="absolute -right-6 -top-6 w-20 h-20 bg-indigo-100 rounded-full opacity-50"></div>
                    <div className="absolute right-8 top-4 w-6 h-6 bg-blue-100 rounded-full opacity-70"></div>

                    <h4 className="text-sm font-bold text-indigo-800">Need Help?</h4>
                    <p className="text-xs text-indigo-600 mt-1 mb-3">Our support team is ready to assist you</p>
                    <Link
                      className="w-full text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 px-3 py-2 rounded-lg shadow-sm flex items-center justify-center"
                      to="/user/settings"
                    >
                      <FiMail className="mr-1.5" />
                      Contact Support
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      }
    </>
  );
};

const menuItems = [
  {
    label: 'Home',
    href: '/user/home',
    iconSrc: 'https://res.cloudinary.com/datvbo0ey/image/upload/v1726327946/home-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--house-property-building-estate-architecture-user-interface-pack-illustrations-3307683_w702ca.png',
  },
  {
    label: 'User Profile',
    myProfile: true,
    iconSrc: 'https://cdn-icons-png.flaticon.com/512/15786/15786272.png',
  },
  {
    label: 'Friend List',
    href: '/user/friends',
    iconSrc: 'https://cdn-icons-png.flaticon.com/512/15430/15430330.png',
  },
  {
    label: 'Pending Requests',
    href: '/user/pending-requests',
    iconSrc: 'https://cdn-icons-png.flaticon.com/512/5509/5509916.png',
  },
  {
    label: 'Sent Requests',
    href: '/user/sent-requests',
    iconSrc: 'https://cdn-icons-png.flaticon.com/512/5509/5509730.png',
  },
  {
    label: 'Suggestions',
    href: '/user/people',
    iconSrc: 'https://cdn-icons-png.flaticon.com/256/5509/5509446.png',
  },
  {
    label: 'Explore',
    href: '/user/explore',
    iconSrc: 'https://cdn-icons-png.flaticon.com/512/2811/2811806.png',
  },
  {
    label: 'Admin Panel',
    href: '/admin',
    iconSrc: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    adminOnly: true,
  },
];

export default Sidebar;
