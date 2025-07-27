import { useState, useEffect } from "react";
import { AiOutlineNumber } from "react-icons/ai";
import { BsGear, BsHash, BsBookmark } from "react-icons/bs";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../redux/users/usersSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiTrendingUp, FiActivity, FiCompass } from "react-icons/fi";
import { RiHomeLine, RiCompassDiscoverLine, RiFireLine, RiBookmarkLine, RiSettings4Line } from "react-icons/ri";
import { DEFAULT_IMAGES } from '../constants';

const Rightbar = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);
  const [showMoreUsers, setShowMoreUsers] = useState(false);
  const [showMoreTags, setShowMoreTags] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users.users);
  const reversedUsers = users.slice().reverse();

  const trendingHashtags = [
    { tag: "photography", count: "24.5K", color: "#FF5757" },
    { tag: "travel", count: "18.3K", color: "#3498db" },
    { tag: "fitness", count: "15.7K", color: "#2ecc71" },
    { tag: "cooking", count: "12.9K", color: "#f39c12" },
    { tag: "technology", count: "11.2K", color: "#9b59b6" },
    { tag: "music", count: "10.8K", color: "#1abc9c" },
    { tag: "art", count: "9.7K", color: "#e74c3c" },
    { tag: "books", count: "8.5K", color: "#34495e" },
  ];

  const upcomingEvents = [
    { name: "Community Meetup", date: "Mar 15", attendees: 45 },
    { name: "Photography Workshop", date: "Mar 20", attendees: 32 },
  ];

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchUsers());
  }, [isLoggedIn, dispatch]);

  const hideOnPaths = ["/user/settings", "/user/contact", "/user/profile"];
  const shouldHideRightbar = hideOnPaths.some((path) => location.pathname.startsWith(path));

  if (!isClient || shouldHideRightbar) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      {isLoggedIn && (
        <div className="flex">
          <div className="w-64 md:block z-20 mr-1 ml-auto">
            <div
              className="rightBar w-64 p-4 bg-white shadow-md flex flex-col gap-4 fixed overflow-y-auto rounded-xl border border-gray-100"
              style={{ height: "calc(100vh - 4rem)"}}
            >
              <motion.div
                className="bg-gray-50/90 rounded-xl p-3"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <h4 className="text-md font-semibold text-gray-800 mb-3 px-2">Menu</h4>
                <motion.div className="flex flex-col gap-1" variants={containerVariants}>
                  <motion.div variants={itemVariants}>
                    <Link to="/user/my-posts" className="flex items-center gap-3 hover:bg-teal-200/70 p-2 rounded-lg cursor-pointer transition-all duration-300 group">
                      <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <FiHome />
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">My Posts</span>
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link to="/user/explore" className="flex items-center gap-3 hover:bg-teal-200/70 p-2 rounded-lg cursor-pointer transition-all duration-300 group">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <FiCompass />
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">Explore</span>
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link to="/user/hashtags" className="flex items-center gap-3 hover:bg-teal-200/70 p-2 rounded-lg cursor-pointer transition-all duration-300 group">
                      <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                        <FiTrendingUp />
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">Trending</span>
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link to="/user/bookmarks" className="flex items-center gap-3 hover:bg-teal-200/70 p-2 rounded-lg cursor-pointer transition-all duration-300 group">
                      <div className="bg-amber-100 p-2 rounded-lg text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                        <BsBookmark />
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">Saved</span>
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link to="/user/settings" className="flex items-center gap-3 hover:bg-teal-200/70 p-2 rounded-lg cursor-pointer transition-all duration-300 group">
                      <div className="bg-gray-100 p-2 rounded-lg text-gray-600 group-hover:bg-gray-600 group-hover:text-white transition-all duration-300">
                        <BsGear />
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">Settings</span>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>

              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-gray-800 px-2">Suggested Users</h4>
                  <AiOutlineNumber className="text-blue-500" />
                </div>
                <AnimatePresence>
                  <motion.div
                    className="flex flex-col gap-2"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                  >
                    {(showMoreUsers ? reversedUsers : reversedUsers.slice(0, 3)).map((user, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ x: 3 }}
                        className="bg-white rounded-lg overflow-hidden w-full"
                      >
                        <Link
                          to={user?._id ? `/user/profile/${user._id}` : '/user/me'}
                          className="flex items-center p-2 transition cursor-pointer group"
                        >
                          <div className="relative">
                            <img
                              src={user?.profilePicture || DEFAULT_IMAGES.PROFILE_SMALL}
                              alt={user?.fullName}
                              className="rounded-full h-10 w-10 mr-2 object-cover border-2 border-white group-hover:border-indigo-200 transition-all"
                              style={{ minWidth: '40px', minHeight: '40px' }}
                            />
                            <div className="absolute bottom-0 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex flex-col flex-1">
                            <p className="text-gray-800 text-sm font-medium pr-1 truncate">{user?.fullName}</p>
                            <span className="text-xs text-gray-500 truncate">@{user?.username}</span>
                          </div>
                          <motion.button
                            className="text-xs bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 text-gray-600 px-2 py-1 rounded-md font-medium transition-colors"
                            whileHover={{ scale: 1.05 }}
                          >
                            Follow
                          </motion.button>
                        </Link>
                      </motion.div>
                    ))}
                    <button
                      onClick={() => setShowMoreUsers(!showMoreUsers)}
                      className="text-indigo-600 text-xs font-medium mt-1 hover:underline self-end"
                    >
                      {showMoreUsers ? "Show Less" : "Show More"}
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Rightbar;