import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiSmile } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { postComment } from '../../../redux/comments/commentsSlice';
import { getImageUrl } from '../../../constants';
import EmojiPicker from 'emoji-picker-react';

const CommentForm = ({ postId, onCommentAdded }) => {
  const dispatch = useDispatch();
  const { user: userDetails } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.comments);

  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const maxCharacters = 500;
  const charactersLeft = maxCharacters - content.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    try {
      const result = await dispatch(postComment({ post: postId, content: content.trim() }));
      if (result.type === 'comments/postComment/fulfilled') {
        setContent('');
        if (onCommentAdded) {
          onCommentAdded();
        }
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + emoji + content.substring(end);
    
    if (newContent.length <= maxCharacters) {
      setContent(newContent);
      // Set cursor position after emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    if (newContent.length <= maxCharacters) {
      setContent(newContent);
      adjustTextareaHeight();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <img
            src={getImageUrl(userDetails?.profilePicture) || '/default-avatar.png'}
            alt={userDetails?.fullName}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 shadow-sm flex-shrink-0"
          />
          
          <div className="flex-1 space-y-2">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                placeholder="Write a comment..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              
              {showEmojiPicker && (
                <div 
                  ref={emojiPickerRef}
                  className="absolute top-full left-0 z-50 mt-2"
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={400}
                    searchDisabled
                    skinTonesDisabled
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiSmile className="w-4 h-4" />
                </button>
                
                <span className={`text-xs ${
                  charactersLeft < 50 ? 'text-red-500' : 'text-gray-400'
                }`}>
                  {charactersLeft} characters left
                </span>
              </div>
              
              <motion.button
                type="submit"
                disabled={!content.trim() || isLoading}
                whileHover={{ scale: content.trim() ? 1.05 : 1 }}
                whileTap={{ scale: content.trim() ? 0.95 : 1 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  content.trim() && !isLoading
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiSend className="w-4 h-4" />
                )}
                {isLoading ? 'Posting...' : 'Post'}
              </motion.button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CommentForm;