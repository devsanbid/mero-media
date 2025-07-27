import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../../components/feed/posts/PostCard';
import { motion } from 'framer-motion';
import AuthRedirect from '../../components/AuthRedirect';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/posts/${postId}`);
        setPost(response.data);
      } catch (err) {
        setError('Failed to fetch post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) {
    return (
      <AuthRedirect>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AuthRedirect>
    );
  }

  if (error) {
    return (
      <AuthRedirect>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error</h3>
            <p className="text-gray-600">{error}</p>
          </motion.div>
        </div>
      </AuthRedirect>
    );
  }

  if (!post) {
    return (
      <AuthRedirect>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-500 text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Post Not Found</h3>
            <p className="text-gray-600">The post you're looking for doesn't exist.</p>
          </motion.div>
        </div>
      </AuthRedirect>
    );
  }

  return (
    <AuthRedirect>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PostCard post={post} />
          </motion.div>
        </div>
      </div>
    </AuthRedirect>
  );
};

export default PostDetail;