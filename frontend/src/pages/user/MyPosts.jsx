import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../../redux/posts/postsSlice';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '../../components/feed/posts/PostCard';
import PostForm from '../../components/feed/posts/PostForm';
import AuthRedirect from '../../components/AuthRedirect';
import { AiOutlinePlus } from 'react-icons/ai';

const MyPosts = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Filter posts by current user
  const userPosts = posts.filter(post => post.user.id === user?.id);

  return (
    <AuthRedirect>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Posts
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openModal}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <AiOutlinePlus className="w-5 h-5" />
              <span>Create Post</span>
            </motion.button>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : userPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AiOutlinePlus className="w-12 h-12 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">No posts yet</h3>
                <p className="text-gray-600 mb-6">Share your first post with the community!</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openModal}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Create Your First Post
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6"
            >
              <AnimatePresence>
                {userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        <PostForm isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </AuthRedirect>
  );
};

export default MyPosts;