import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiUser, FiUsers, FiUserPlus, FiGrid, FiInfo, FiFileText, FiCalendar, FiMapPin, FiGlobe, FiEdit3, FiCamera, FiX, FiSave, FiUpload } from 'react-icons/fi';
import AuthRedirect from '../../components/AuthRedirect';
import Loading from '../../components/Loading';
import { getAllPosts } from '../../redux/posts/postsSlice';
import PostList from '../../components/feed/posts/PostList';
import PostForm from '../../components/feed/posts/PostForm';
import RunningServer from '../../components/RunningServer';
import { updateUserDetails, fetchUserDetails } from '../../redux/auth/authSlice';
import { sendFriendRequest, fetchSentRequests, fetchReceivedRequests, cancelSentRequest, acceptFriendRequest, rejectFriendRequest, unfriend, fetchFriendsList } from '../../redux/friendRequests/friendRequestsSlice';
import { getFollowers, getFollowing } from '../../redux/follow/followSlice';
import { toast } from 'react-toastify';

// Import follow components
import Followers from '../../components/userProfile/Followers';
import Following from '../../components/userProfile/Following';
import FollowButton from '../../components/userProfile/FollowButton';
import StatsSection from '../../components/userProfile/StatsSection';
import FriendListComponent from '../../components/userProfile/FriendList';

// Profile Info component
const ProfileInfo = ({ user }) => (
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <FiUser className="text-indigo-500" />
      About
    </h3>
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FiFileText className="text-indigo-500" />
          Bio
        </h4>
        <p className="text-gray-600 leading-relaxed">
          {user?.bio || 'No bio available yet.'}
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FiInfo className="text-indigo-500" />
          Information
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FiCalendar className="text-gray-400" />
            <span className="text-gray-600">
              Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              }) : 'Unknown'}
            </span>
          </div>
          {user?.location && (
            <div className="flex items-center gap-3">
              <FiMapPin className="text-gray-400" />
              <span className="text-gray-600">{user.location}</span>
            </div>
          )}
          {user?.website && (
            <div className="flex items-center gap-3">
              <FiGlobe className="text-gray-400" />
              <a 
                href={user.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {user.website}
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  </div>
);



const Posts = ({ userPosts, loggedInUserId, user, usersList }) => (
  <div className="p-6">
    <h3 className="text-xl font-bold mb-4">Posts</h3>
    {loggedInUserId === user.id && (
      <div className="mb-6">
        <PostForm />
      </div>
    )}
    {userPosts && userPosts.length > 0 ? (
      <PostList posts={userPosts} />
    ) : (
      <p className="text-gray-600">No posts yet.</p>
    )}
  </div>
);

const UserProfile = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [activeSection, setActiveSection] = useState('Posts');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditCover, setShowEditCover] = useState(false);
  const [showEditProfilePic, setShowEditProfilePic] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useDispatch();
  
  // Redux selectors
  const users = useSelector((state) => state.users?.users || []);
  const posts = useSelector((state) => state.posts?.posts || []);
  const sentRequests = useSelector((state) => state.friendRequests?.sentRequests || []);
  const receivedRequests = useSelector((state) => state.friendRequests?.receivedRequests || []);
  const friendsList = useSelector((state) => state.friendRequests?.friendsList || []);
  const loggedInUserId = useSelector((state) => state.auth.user?.id);
  
  // Filter posts based on whether viewing own profile or another user's profile
  const userPosts = posts.filter((post) => {
    // If no profileId (viewing /user/me), only show logged-in user's posts
    if (!profileId) {
      return post.user?.id === loggedInUserId;
    }
    // If viewing another user's profile, show that user's posts
    return post.user?.id === user?.id;
  });

  // Get current user from Redux
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API.replace('/api', '')}/`);
        if (response.data === "Server is running!") {
          setIsServerRunning(true);
        }
      } catch (error) {
        setIsServerRunning(false);
      }
    };
    checkServer();
  }, []);

  useEffect(() => {
    if (!currentUser && !profileId) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, currentUser, profileId]);

  useEffect(() => {
    if(isServerRunning){
      dispatch(getAllPosts());
    }
  }, [dispatch, isServerRunning]);

  useEffect(() => {
    // If no profileId, show current user's profile
    if (!profileId) {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      }
      return;
    }
    
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/user/userDetails/${profileId}`);
        setUser(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user details');
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [profileId]);

  // Separate useEffect to handle currentUser changes for own profile
  useEffect(() => {
    if (!profileId && currentUser && !user) {
      setUser(currentUser);
      setLoading(false);
    }
  }, [currentUser, profileId, user]);

  // Additional check to prevent infinite loading
  useEffect(() => {
    if (!profileId && currentUser && loading) {
      setLoading(false);
    }
  }, [currentUser, profileId, loading]);

  // Fetch friend request data when component mounts
  useEffect(() => {
    dispatch(fetchSentRequests());
    dispatch(fetchReceivedRequests());
    dispatch(fetchFriendsList());
    if (user?.id) {
      dispatch(getFollowers(user.id));
      dispatch(getFollowing(user.id));
    }
  }, [dispatch, user?.id]);



  if (!isServerRunning) {
    return <RunningServer />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-xl">User not found</div>
      </div>
    );
  }

  // Check friendship status and requests
  const isFriend = friendsList.some((friend) => friend.id === user.id);
  const hasSentRequest = sentRequests.some((req) => req.receiver?.id === user.id);
  const sentRequestId = sentRequests.find((req) => req.receiver?.id === user.id)?.id;
  const hasReceivedRequest = receivedRequests.some((req) => req.sender?.id === user.id);
  const receivedRequestId = receivedRequests.find((req) => req.sender?.id === user.id)?.id;

  // Handle profile update
  const handleUpdateProfile = async (formData) => {
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/user/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Update Redux state
        dispatch(updateUserDetails(formData));
        toast.success('Profile updated successfully!');
        setShowEditProfile(false);
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle cover image update
  const handleUpdateCoverImage = async (data, type) => {
    setIsUpdating(true);
    try {
      let updateData;
      
      if (type === 'file') {
        // For file uploads, we'll use FormData
        const formData = new FormData();
        formData.append('coverImage', data);
        
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/update`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        if (response.data.success) {
          updateData = { coverImage: response.data.user.coverImage };
        }
      } else {
        // For URL updates
        updateData = { coverImage: data };
        
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/update`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to update cover image');
        }
      }
      
      // Update Redux state
      dispatch(updateUserDetails(updateData));
      toast.success('Cover image updated successfully!');
      setShowEditCover(false);
    } catch (error) {
      console.error('Error updating cover image:', error);
      toast.error('Failed to update cover image. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle profile picture update
  const handleUpdateProfilePicture = async (data, type) => {
    setIsUpdating(true);
    try {
      let updateData;
      
      if (type === 'file') {
        // For file uploads, we'll use FormData
        const formData = new FormData();
        formData.append('profilePicture', data);
        
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/update`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        if (response.data.success) {
          updateData = { profilePicture: response.data.user.profilePicture };
        }
      } else {
        // For URL updates
        updateData = { profilePicture: data };
        
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_API}/user/update`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to update profile picture');
        }
      }
      
      // Update Redux state
      dispatch(updateUserDetails(updateData));
      toast.success('Profile picture updated successfully!');
      setShowEditProfilePic(false);
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle friend request actions
  const handleSendRequest = () => {
    dispatch(sendFriendRequest(user.id));
    dispatch(fetchSentRequests());
    console.log('Send friend request to:', user.id);
  };

  const handleCancelRequest = () => {
    dispatch(cancelSentRequest(sentRequestId));
    console.log('Cancel friend request:', sentRequestId);
  };

  const handleAcceptRequest = () => {
    dispatch(acceptFriendRequest(receivedRequestId));
    dispatch(fetchFriendsList());
    console.log('Accept friend request:', receivedRequestId);
  };

  const handleRejectRequest = () => {
    dispatch(rejectFriendRequest(receivedRequestId));
    console.log('Reject friend request:', receivedRequestId);
  };

  const handleUnfriend = () => {
    dispatch(unfriend(user.id));
    dispatch(fetchFriendsList());
    console.log('Unfriend user:', user.id);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Posts':
        return <Posts userPosts={userPosts} loggedInUserId={loggedInUserId} user={user} usersList={users} />;
      case 'About':
        return <ProfileInfo user={user} />;
      case 'Friends':
        return <FriendListComponent userId={user.id} />;
      case 'Followers':
        return <Followers userId={user.id} />;
      case 'Following':
        return <Following userId={user.id} />;
      default:
        return null;
    }
  };

  const handleMenuClick = (section) => {
    setActiveSection(section);
  };

  return (
    <AuthRedirect>
      <div className="min-h-screen bg-[#F5F6FA] flex justify-center p-3">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header section */}
          <motion.div
            className="relative h-60 sm:h-80 bg-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={user.coverImage || "https://via.placeholder.com/800x300"}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            {loggedInUserId === user.id && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <motion.button
                  onClick={() => setShowEditCover(true)}
                  className="px-2 sm:px-4 py-1 sm:py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiCamera size={16} />
                  Edit Cover
                </motion.button>
                <motion.button
                  onClick={() => setShowEditProfilePic(true)}
                  className="px-2 sm:px-4 py-1 sm:py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiEdit3 size={16} />
                  Edit Profile
                </motion.button>
              </div>
            )}
          </motion.div>

          <motion.div className="relative px-6 pt-16 pb-8">
            {/* Profile Picture */}
            <div className="absolute -top-20 left-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img
                  src={user.profilePicture || "https://via.placeholder.com/150"}
                  alt={user.fullName || `${user.firstName} ${user.lastName}`}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl object-cover"
                />
                {user.isDpVerify && (
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Profile Info */}
            <div className="ml-0 sm:ml-48 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize"
                  >
                    {user.fullName || `${user.firstName} ${user.lastName}`}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 text-lg mb-3"
                  >
                    @{user.username}
                  </motion.p>
                  
                  {user.bio && (
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-700 text-base mb-3 max-w-md"
                    >
                      {user.bio}
                    </motion.p>
                  )}
                  
                  {loggedInUserId === user.id && (
                    <motion.button
                      onClick={() => {
                        setEditFormData({
                          fullName: user.fullName || '',
                          bio: user.bio || '',
                          location: user.location || '',
                          website: user.website || ''
                        });
                        setShowEditProfile(true);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiEdit3 size={14} />
                      Edit Info
                    </motion.button>
                  )}
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center text-gray-500 text-sm mb-4"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <StatsSection user={user} />
                  </motion.div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-6 sm:mt-0">
                  {!profileId || loggedInUserId === user.id ? (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Edit Profile
                    </motion.button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <FollowButton userId={user.id} />
                      {isFriend ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                          onClick={handleUnfriend}
                        >
                          Unfriend
                        </motion.button>
                      ) : hasReceivedRequest ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            onClick={handleAcceptRequest}
                          >
                            Accept
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            onClick={handleRejectRequest}
                          >
                            Decline
                          </motion.button>
                        </>
                      ) : hasSentRequest ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                          onClick={handleCancelRequest}
                        >
                          Pending
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                          onClick={handleSendRequest}
                        >
                          Add Friend
                        </motion.button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <nav className="border-b border-gray-100 bg-white sticky top-0 z-10">
            <div className="flex justify-center sm:justify-start overflow-x-auto scrollbar-hide">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 relative whitespace-nowrap ${
                    activeSection === item.label
                      ? `${item.color} border-b-2 border-current bg-gray-50`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => handleMenuClick(item.label)}
                >
                  <span className={activeSection === item.label ? item.color : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  <span className="font-semibold">{item.label}</span>
                  {activeSection === item.label && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-current"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </nav>
          {/* Render the active section */}
          <div>{renderSection()}</div>
        </div>
        
        {/* Edit Profile Modal */}
        <AnimatePresence>
          {showEditProfile && (
            <EditProfileModal
              user={user}
              formData={editFormData}
              setFormData={setEditFormData}
              onClose={() => setShowEditProfile(false)}
              onSave={handleUpdateProfile}
              isUpdating={isUpdating}
            />
          )}
        </AnimatePresence>
        
        {/* Edit Cover Image Modal */}
        <AnimatePresence>
          {showEditCover && (
            <EditCoverModal
              user={user}
              onClose={() => setShowEditCover(false)}
              onSave={handleUpdateCoverImage}
              isUpdating={isUpdating}
            />
          )}
        </AnimatePresence>
        
        {/* Edit Profile Picture Modal */}
        <AnimatePresence>
          {showEditProfilePic && (
            <EditProfilePicModal
              user={user}
              onClose={() => setShowEditProfilePic(false)}
              onSave={handleUpdateProfilePicture}
              isUpdating={isUpdating}
            />
          )}
        </AnimatePresence>
      </div>
    </AuthRedirect>
  );
};

// Edit Profile Modal Component
const EditProfileModal = ({ user, formData, setFormData, onClose, onSave, isUpdating }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName || ''}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about yourself"
              rows={3}
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {(formData.bio || '').length}/100 characters
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Where are you located?"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              value={formData.website || ''}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://yourwebsite.com"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Edit Cover Image Modal Component
const EditCoverModal = ({ user, onClose, onSave, isUpdating }) => {
  const [coverUrl, setCoverUrl] = useState(user.coverImage || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onSave(selectedFile, 'file');
    } else if (coverUrl !== user.coverImage) {
      onSave(coverUrl, 'url');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Cover Image</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preview */}
          <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={previewUrl || coverUrl || 'https://via.placeholder.com/800x300'}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Enter Image URL
            </label>
            <input
              type="url"
              value={coverUrl}
              onChange={(e) => {
                setCoverUrl(e.target.value);
                setPreviewUrl('');
                setSelectedFile(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating || (!selectedFile && coverUrl === user.coverImage)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <FiUpload size={16} />
                  Update Cover
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Edit Profile Picture Modal Component
const EditProfilePicModal = ({ user, onClose, onSave, isUpdating }) => {
  const [profileUrl, setProfileUrl] = useState(user.profilePicture || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onSave(selectedFile, 'file');
    } else if (profileUrl !== user.profilePicture) {
      onSave(profileUrl, 'url');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Profile Picture</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preview */}
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
              <img
                src={previewUrl || profileUrl || 'https://via.placeholder.com/150'}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Enter Image URL
            </label>
            <input
              type="url"
              value={profileUrl}
              onChange={(e) => {
                setProfileUrl(e.target.value);
                setPreviewUrl('');
                setSelectedFile(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating || (!selectedFile && profileUrl === user.profilePicture)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <FiUpload size={16} />
                  Update Picture
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Menu items data
const menuItems = [
  {
    label: 'Posts',
    icon: <FiGrid className="w-5 h-5" />,
    color: 'text-blue-600'
  },
  {
    label: 'About',
    icon: <FiInfo className="w-5 h-5" />,
    color: 'text-green-600'
  },
  {
    label: 'Friends',
    icon: <FiUsers className="w-5 h-5" />,
    color: 'text-purple-600'
  },
  {
    label: 'Followers',
    icon: <FiUser className="w-5 h-5" />,
    color: 'text-rose-600'
  },
  {
    label: 'Following',
    icon: <FiUserPlus className="w-5 h-5" />,
    color: 'text-orange-600'
  }
];

export default UserProfile;