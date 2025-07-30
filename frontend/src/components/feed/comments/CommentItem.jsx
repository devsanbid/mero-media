import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { editComment, deleteComment } from '../../../redux/comments/commentsSlice';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../../utility/timeAgo';
import { getImageUrl } from '../../../constants';

const CommentItem = ({ comment, postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: userDetails } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(comment.content);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newContent.length, newContent.length);
    }
  }, [isEditing]);

  const isOwnComment = userDetails?.id === comment.user?.id;

  const handleEdit = () => {
    if (isEditing) {
      if (newContent.trim() && newContent !== comment.content) {
        dispatch(editComment({ 
          commentId: comment.id, 
          postId: postId, 
          content: newContent.trim() 
        }));
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
    setShowActions(false);
  };

  const handleDelete = () => {
    if (showConfirmDelete) {
      dispatch(deleteComment({ 
        commentId: comment.id, 
        postId: postId 
      }));
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
    }
    setShowActions(false);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };



  const handleCancel = () => {
    setNewContent(comment.content);
    setIsEditing(false);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight();
    }
  }, [newContent, isEditing]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex space-x-3">
        <img
          src={getImageUrl(comment.user?.profilePicture) || '/default-avatar.png'}
          alt={comment.user?.fullName || 'User'}
          className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-gray-100 shadow-sm flex-shrink-0"
          onClick={() => navigate(`/user/profile/${comment.user?.id}`)}
        />
        
        <div className="flex-1 relative">
          <motion.div 
            className="bg-white rounded-lg border border-gray-200 overflow-visible"
            animate={{
              boxShadow: isHovered ? "0 4px 12px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.05)"
            }}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span
                    className="font-medium text-sm text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
                    onClick={() => navigate(`/user/profile/${comment.user?.id}`)}
                  >
                    {comment.user?.fullName || 'Unknown User'}
                  </span>
                  <span className="text-xs text-gray-500">
                    @{comment.user?.username}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">
                    {timeAgo ? timeAgo(comment.createdAt) : 'Just now'}
                  </span>
                </div>
                
                {isOwnComment && (
                  <div className="flex items-center space-x-1">
                    <motion.button
                      onClick={handleEdit}
                      className="p-1 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={isEditing ? 'Save' : 'Edit'}
                    >
                      <FiEdit className="w-3 h-3" />
                    </motion.button>
                    <motion.button
                      onClick={handleDelete}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title="Delete"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </motion.button>
                  </div>
                )}
              </div>
              
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <textarea
                      ref={textareaRef}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      rows={2}
                      maxLength={500}
                      style={{ minHeight: '60px' }}
                    />
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${
                        newContent.length > 450 ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {500 - newContent.length} characters left
                      </span>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={handleEdit}
                          disabled={!newContent.trim()}
                          className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          whileHover={{ scale: newContent.trim() ? 1.05 : 1 }}
                          whileTap={{ scale: newContent.trim() ? 0.95 : 1 }}
                        >
                          <FiSave className="w-3 h-3" />
                          Save
                        </motion.button>
                        <motion.button
                          onClick={handleCancel}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiX className="w-3 h-3" />
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      {comment.content}
                    </p>
                    
                    <AnimatePresence>
                      {showConfirmDelete && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                        >
                          <p className="text-sm text-red-800 mb-2">
                            Are you sure you want to delete this comment?
                          </p>
                          <div className="flex gap-2">
                            <motion.button
                              onClick={handleDelete}
                              className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full flex items-center gap-1"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FiTrash2 className="w-3 h-3" />
                              Delete
                            </motion.button>
                            <motion.button
                              onClick={cancelDelete}
                              className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentItem;