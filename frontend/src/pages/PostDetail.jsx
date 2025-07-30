import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiMoreVertical,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';
import { getPostById, toggleLikePost, deletePost } from '../redux/posts/postsSlice';
import { getCommentsByPost, postComment } from '../redux/comments/commentsSlice';
import { timeAgo } from '../utility/timeAgo';
import { getImageUrl } from '../constants';
import { formatText } from '../utility/textFormatter';
import LoadingSpinner from '../components/LoadingSpinner';
import EditPostModal from '../components/feed/posts/EditPostModal';
import CommentItem from '../components/feed/comments/CommentItem';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [newComment, setNewComment] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const { posts, loading, error } = useSelector((state) => state.posts);
  const { commentsByPostId } = useSelector((state) => state.comments);
  const { isLoggedIn, user: userDetails } = useSelector((state) => state.auth);
  
  // Find the specific post
  const post = posts.find(p => p.id === postId);
  const postComments = commentsByPostId[postId] || [];
  
  // Check if current user has liked this post
  const isLiked = post?.likes?.some(like => like.user === userDetails?.id) || false;
  const likesCount = post?.likes?.length || 0;
  
  useEffect(() => {
    if (postId) {
      // Fetch post details if not already loaded
      if (!post) {
        dispatch(getPostById(postId));
      }
      // Fetch comments for this post
      dispatch(getCommentsByPost(postId));
    }
  }, [postId, dispatch, post]);
  
  const handleLike = () => {
    if (isLoggedIn && postId) {
      dispatch(toggleLikePost(postId));
    }
  };
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() && isLoggedIn && postId) {
      dispatch(postComment({ post: postId, content: newComment.trim() }));
      setNewComment('');
    }
  };
  
  const handleProfileClick = () => {
    if (post?.user?.id) {
      navigate(`/user/profile/${post.user.id}`);
    }
  };
  
  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(postId));
      navigate(-1); // Go back to previous page
    }
  };
  
  const handleHashtagClick = (e) => {
    if (e.target.classList.contains('hashtag')) {
      const hashtag = e.target.textContent.slice(1);
      navigate(`/hashtag/${hashtag}`);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Post</h1>
          </div>
        </div>
      </div>
      
      {/* Post Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Post Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={handleProfileClick}>
                <img
                  src={getImageUrl(post.user?.profilePicture) || '/default-avatar.png'}
                  alt={post.user?.fullName || 'User'}
                  className="w-12 h-12 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {post.user?.fullName || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    @{post.user?.username} • {timeAgo(post.createdAt)}
                  </p>
                </div>
              </div>
              
              {/* Dropdown menu for post owner */}
              {isLoggedIn && userDetails?.id === post.user?.id && (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiMoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <button
                        onClick={() => {
                          setShowEditModal(true);
                          setShowDropdown(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiEdit className="w-4 h-4" />
                        <span>Edit Post</span>
                      </button>
                      <button
                        onClick={() => {
                          handleDeletePost();
                          setShowDropdown(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span>Delete Post</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Post Content */}
          <div className="p-6">
            <div
              onClick={handleHashtagClick}
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatText(post.content) }}
            />
            
            {/* Post Image */}
            {post.image && (
              <div className="mt-4">
                <img
                  src={getImageUrl(post.image)}
                  alt="Post content"
                  className="w-full rounded-lg object-cover max-h-96"
                />
              </div>
            )}
          </div>
          
          {/* Interaction Stats */}
          <div className="px-6 py-3 border-t border-gray-100">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
              <span>{postComments.length} {postComments.length === 1 ? 'comment' : 'comments'}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="px-6 py-3 border-t border-gray-100">
            <div className="flex items-center justify-around">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>Like</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                <FiMessageCircle className="w-5 h-5" />
                <span>Comment</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:text-green-500 hover:bg-green-50 transition-colors">
                <FiShare2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Comments Section */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
            
            {/* Comment Form */}
            {isLoggedIn && (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex space-x-3">
                  <img
                    src={getImageUrl(userDetails?.profilePicture) || '/default-avatar.png'}
                    alt={userDetails?.fullName || 'You'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
            
            {/* Comments List */}
            <div className="space-y-4">
              {postComments.length > 0 ? (
                postComments.map((comment) => (
                  <CommentItem 
                    key={comment.id} 
                    comment={comment} 
                    postId={postId}
                  />
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FiMessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No comments yet.</p>
                  <p className="text-sm">Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Post Modal */}
      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
        />
      )}
      
      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default PostDetail;