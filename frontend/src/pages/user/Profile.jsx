import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiHome, FiUser, FiList, FiAlertCircle, FiUserPlus } from 'react-icons/fi';
import { AiOutlineFileText } from 'react-icons/ai';
import AuthRedirect from '../../components/AuthRedirect';
import Loading from '../../components/Loading';
import { getAllPosts } from '../../redux/posts/postsSlice';
import PostList from '../../components/feed/posts/PostList';
import PostForm from '../../components/feed/posts/PostForm';
import RunningServer from '../../components/RunningServer';

// Import placeholder components (these would need to be created)
// import ProfileInfo from '../components/userProfile/ProfileInfo';
// import FriendList from '../components/userProfile/FriendList';
// import Followers from '../components/userProfile/Followers';
// import Following from '../components/userProfile/Following';
// import Posts from '../components/userProfile/Posts';

// Placeholder components
const ProfileInfo = ({ user }) => (
  <div className="p-6">
    <h3 className="text-xl font-bold mb-4">Profile Information</h3>
    <div className="space-y-2">
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Bio:</strong> {user.bio || 'No bio available'}</p>
      <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  </div>
);

const FriendList = ({ users, user }) => (
  <div className="p-6">
    <h3 className="text-xl font-bold mb-4">Friends</h3>
    <p className="text-gray-600">Friends list coming soon...</p>
  </div>
);

const Followers = ({ users, user }) => (
  <div className="p-6">
    <h3 className="text-xl font-bold mb-4">Followers</h3>
    <p className="text-gray-600">Followers list coming soon...</p>
  </div>
);

const Following = ({ users, user }) => (
  <div className="p-6">
    <h3 className="text-xl font-bold mb-4">Following</h3>
    <p className="text-gray-600">Following list coming soon...</p>
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
  const [activeSection, setActiveSection] = useState('Profile');
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
  }, [profileId, currentUser]);



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
    return <p className="text-gray-500">User not found</p>;
  }

  // Check friendship status and requests
  const isFriend = friendsList.some((friend) => friend.id === user.id);
  const hasSentRequest = sentRequests.some((req) => req.receiver?.id === user.id);
  const sentRequestId = sentRequests.find((req) => req.receiver?.id === user.id)?.id;
  const hasReceivedRequest = receivedRequests.some((req) => req.sender?.id === user.id);
  const receivedRequestId = receivedRequests.find((req) => req.sender?.id === user.id)?.id;

  // Handle friend request actions
  const handleSendRequest = () => {
    // dispatch(sendFriendRequest(user._id));
    // dispatch(fetchSentRequests());
    console.log('Send friend request to:', user.id);
  };

  const handleCancelRequest = () => {
    // dispatch(cancelSentRequest(sentRequestId));
    console.log('Cancel friend request:', sentRequestId);
  };

  const handleAcceptRequest = () => {
    // dispatch(acceptFriendRequest(receivedRequestId));
    // dispatch(fetchFriendsList());
    console.log('Accept friend request:', receivedRequestId);
  };

  const handleRejectRequest = () => {
    // dispatch(rejectFriendRequest(receivedRequestId));
    console.log('Reject friend request:', receivedRequestId);
  };

  const handleUnfriend = () => {
    // dispatch(unfriend(user._id));
    // dispatch(fetchFriendsList());
    console.log('Unfriend user:', user.id);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Profile':
        return (
          <>
            <Posts userPosts={userPosts} loggedInUserId={loggedInUserId} user={user} usersList={users} />
          </>
        );
      case 'Profile Info':
        return <ProfileInfo user={user} />;
      case 'Friend List':
        return <FriendList users={users} user={user} />;
      case 'Followers':
        return <Followers users={users} user={user} />;
      case 'Following':
        return <Following users={users} user={user} />;
      case 'Posts':
        return <Posts userPosts={userPosts} loggedInUserId={loggedInUserId} user={user} usersList={false} />;
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
                <Link to="/user/settings" className="px-2 sm:px-4 py-1 sm:py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition duration-300">
                  Edit Cover Image
                </Link>
                <Link to="/user/settings" className="px-2 sm:px-4 py-1 sm:py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition duration-300">
                  Edit Profile Picture
                </Link>
              </div>
            )}
          </motion.div>

          <motion.div className="relative px-4 pt-12 pb-6 flex flex-col sm:flex-row items-center sm:items-start sm:pb-12">
            <div className="absolute -top-16 sm:-top-24 left-6">
              <img
                src={user.profilePicture || "https://via.placeholder.com/150"}
                alt={user.fullName || `${user.firstName} ${user.lastName}`}
                className="w-36 h-36 sm:w-52 sm:h-52 rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform object-cover"
              />
            </div>
            <div className="ml-0 sm:ml-56 mt-4 sm:mt-0 mr-4 sm:mr-7 flex-1">
              <div className="ml-2 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold capitalize">
                  {user.fullName || `${user.firstName} ${user.lastName}`}
                </h1>
                <h1 className="text-sm sm:text-lg text-gray-600">@{user.username}</h1>
                <p className="text-sm sm:text-base text-gray-800">{user.bio}</p>
                <p className="text-sm sm:text-base text-gray-700">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            {!profileId || loggedInUserId === user.id ? (
              <button className="mt-4 sm:mt-0 px-3 sm:px-4 py-1 sm:py-2 bg-indigo-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
                Your Profile
              </button>
            ) : (
              <div className="space-x-2 mt-4 sm:mt-0">
                {isFriend ? (
                  <button
                    className="px-3 sm:px-4 py-1 sm:py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                    onClick={handleUnfriend}
                  >
                    Unfriend
                  </button>
                ) : hasReceivedRequest ? (
                  <>
                    <button
                      className="px-3 sm:px-4 py-1 sm:py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                      onClick={handleAcceptRequest}
                    >
                      Accept
                    </button>
                    <button
                      className="px-3 sm:px-4 py-1 sm:py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                      onClick={handleRejectRequest}
                    >
                      Reject
                    </button>
                  </>
                ) : hasSentRequest ? (
                  <button
                    className="px-3 sm:px-4 py-1 sm:py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                    onClick={handleCancelRequest}
                  >
                    Cancel Request
                  </button>
                ) : (
                  <button
                    className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                    onClick={handleSendRequest}
                  >
                    Add Friend
                  </button>
                )}
              </div>
            )}
          </motion.div>

          <nav className="border-b border-gray-200 mt-2">
            <ul className="flex flex-wrap justify-center sm:justify-start space-x-0 sm:space-x-4">
              {menuItems.map((item) => (
                <li key={item.label} className="relative group">
                  <button
                    className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-t-lg transition duration-300 ${
                      activeSection === item.label
                        ? 'bg-[#F6F8FF] text-blue-700 border-b-2 border-blue-500'
                        : 'hover:bg-[#F6F8FF] hover:text-blue-700 hover:border-b-2 hover:border-blue-500'
                    }`}
                    onClick={() => handleMenuClick(item.label)}
                  >
                    {item.icon}
                    <span className="ml-2 sm:ml-4">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {/* Render the active section */}
          <div>{renderSection()}</div>
        </div>
      </div>
    </AuthRedirect>
  );
};

// Menu items data
const menuItems = [
  {
    label: 'Profile',
    icon: <FiHome className="w-6 h-6 text-blue-500" />,
  },
  {
    label: 'Profile Info',
    icon: <FiUser className="w-6 h-6 text-green-500" />,
  },
  {
    label: 'Friend List',
    icon: <FiList className="w-6 h-6 text-orange-500" />,
  },
  {
    label: 'Followers',
    icon: <FiAlertCircle className="w-6 h-6 text-yellow-500" />,
  },
  {
    label: 'Following',
    icon: <AiOutlineFileText className="w-6 h-6 text-teal-500" />,
  },
  {
    label: 'Posts',
    icon: <FiUserPlus className="w-6 h-6 text-pink-500" />,
  },
];

export default UserProfile;
