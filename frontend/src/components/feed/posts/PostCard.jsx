import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiImage,
  FiChevronDown,
  FiChevronUp,
  FiMoreVertical,
  FiEdit,
  FiTrash2
} from "react-icons/fi";
import { formatText } from "../../../utility/textFormatter";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../../../redux/posts/postsSlice";
import { getCommentsByPost, postComment } from "../../../redux/comments/commentsSlice";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../../utility/timeAgo";
import { getImageUrl } from "../../../constants";
import EditPostModal from './EditPostModal';
import InteractionButtons from './InteractionButtons';
import CommentForm from '../comments/CommentForm';

const PostCard = ({ post }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, userDetails } = useSelector((state) => state.auth);
  const { commentsByPostId } = useSelector((state) => state.comments);
  
  // Get comments for this specific post
  const postComments = commentsByPostId[post._id] || [];

  // Animate card on mount and fetch comments
  useEffect(() => {
    setIsVisible(true);
    // Fetch comments for this post
    if (post._id) {
      dispatch(getCommentsByPost(post._id));
    }
  }, [post._id, dispatch]);

  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsVisible(false);
      setTimeout(() => {
        dispatch(deletePost(post.id));
      }, 300);
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleCommentAdded = () => {
    // Refresh comments when a new comment is added
    dispatch(getCommentsByPost(post._id));
  };

  const handleProfileClick = () => {
    if (post.user?._id) {
      navigate(`/user/profile/${post.user._id}`);
    }
  };

  const handlePostClick = () => {
    if (post._id) {
      navigate(`/user/posts/${post._id}`);
    }
  };

  // Format content with hashtags
  const formatContentWithHashtags = (content) => {
    if (!content) return '';
    return content.replace(/#(\w+)/g, '<span class="text-indigo-600 font-medium cursor-pointer hover:underline" data-hashtag="$1">#$1</span>');
  };

  // Handle hashtag click
  const handleHashtagClick = (e) => {
    if (e.target.hasAttribute('data-hashtag')) {
      const hashtag = e.target.getAttribute('data-hashtag');
      navigate(`/hashtags?hashtag=${hashtag}`);
    }
  };

  // Check if content has more than 10 lines
  const hasLongContent = () => {
    if (!post.content) return false;
    return post.content.split('\n').length > 10;
  };

  // Get truncated content (first 7 lines)
  const getTruncatedContent = () => {
    if (!post.content) return '';
    const lines = post.content.split('\n');
    return lines.slice(0, 7).join('\n');
  };

  // Card variants for animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  if (!post) return null;

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "exit"}
      exit="exit"
      variants={cardVariants}
      className={`${post.backgroundColor || 'bg-white'} rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md`}
    >
      <div className="p-5">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={handleProfileClick}>
            <img
              src={getImageUrl(post.user?.profilePicture) || '/default-avatar.png'}
              alt={post.user?.fullName || 'User'}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 hover:ring-2 hover:ring-blue-500 transition-all"
            />
            <div>
              <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {post.user?.fullName || 'Unknown User'}
              </h3>
              <p className="text-sm text-gray-500">
                @{post.user?.username || 'username'} • {timeAgo ? timeAgo(post.createdAt) : 'Just now'}
              </p>
            </div>
          </div>

          {/* Post Actions */}
          {userDetails?._id === post.user?._id && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiMoreVertical className="w-5 h-5" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowEditModal(true);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FiEdit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleDeletePost();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Post content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-gray-800 leading-relaxed cursor-pointer hover:text-gray-900 transition-colors"
          onClick={handlePostClick}
        >
          {hasLongContent() && !showFullContent ? (
            <>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleHashtagClick(e);
                }}
                className="prose prose-indigo max-w-none"
                dangerouslySetInnerHTML={{ __html: formatText(formatContentWithHashtags(getTruncatedContent())) }}
              ></div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullContent(true);
                }}
                className="mt-2 flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                <span>Show more</span>
                <FiChevronDown className="w-4 h-4" />
              </motion.button>
            </>
          ) : hasLongContent() && showFullContent ? (
            <>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleHashtagClick(e);
                }}
                className="prose prose-indigo max-w-none"
                dangerouslySetInnerHTML={{ __html: formatText(formatContentWithHashtags(post.content)) }}
              ></div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullContent(false);
                }}
                className="mt-2 flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                <span>Show less</span>
                <FiChevronUp className="w-4 h-4" />
              </motion.button>
            </>
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleHashtagClick(e);
              }}
              className="prose prose-indigo max-w-none"
              dangerouslySetInnerHTML={{ __html: formatText(formatContentWithHashtags(post.content)) }}
            ></div>
          )}
        </motion.div>

        {/* Post image with animation */}
        {post.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="relative rounded-lg overflow-hidden mb-4 group"
          >
            <img
              src={post.image.startsWith('http') ? post.image : getImageUrl(post.image)}
              alt="Post"
              className="w-full rounded-lg object-cover max-h-[24rem] transform transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-3 right-3 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FiImage className="w-4 h-4" />
            </div>
          </motion.div>
        )}

        {/* Enhanced Interaction buttons */}
        <InteractionButtons
          post={post}
          userDetails={userDetails}
          showComments={showComments}
          onToggleComments={handleToggleComments}
        />
      </div>

      {/* Comments section with animation */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 bg-gray-50 overflow-hidden"
          >
            <div className="p-5">
              {/* Enhanced Comment form */}
              {isLoggedIn && (
                <div className="mb-4">
                  <CommentForm
                    postId={post._id}
                    onCommentAdded={handleCommentAdded}
                  />
                </div>
              )}

              {/* Comments list */}
              <div className="space-y-3">
                {postComments.length > 0 ? (
                  postComments.map((comment) => (
                    <div key={comment._id} className="flex space-x-3">
                      <img
                        src={getImageUrl(comment.user?.profilePicture) || '/default-avatar.png'}
                        alt={comment.user?.fullName || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm text-gray-900">
                              {comment.user?.fullName || 'Unknown User'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {timeAgo ? timeAgo(comment.createdAt) : 'Just now'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 text-sm py-4">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={post}
      />
    </motion.div>
  );
};

export default PostCard;