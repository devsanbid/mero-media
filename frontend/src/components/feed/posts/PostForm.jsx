import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../../redux/posts/postsSlice';
import { motion } from 'framer-motion';
import {
  FiImage,
  FiSmile,
  FiSend,
  FiX,
  FiSave,
  FiTrash2
} from 'react-icons/fi';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { RiDraftLine } from 'react-icons/ri';

const PostForm = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user: userDetails } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState(0);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load draft from local storage
    const savedDraft = localStorage.getItem('postDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setContent(draft.content || '');
        setIsDraftSaved(true);
      } catch (e) {
        console.error('Failed to load draft', e);
      }
    }

    // Auto save draft every 30 seconds
    const intervalId = setInterval(() => {
      if (content.trim()) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Update character count when content changes
  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  const validate = () => {
    const errors = {};
    if (!content.trim() && !selectedFile) {
      errors.content = 'Post content or image is required.';
    }
    if (content.length > 2000) {
      errors.content = 'Post content cannot exceed 2000 characters.';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveDraft = () => {
    if (content.trim()) {
      localStorage.setItem('postDraft', JSON.stringify({ content }));
      setIsDraftSaved(true);
      setTimeout(() => {
        setIsDraftSaved(false);
      }, 2000);
    }
  };

  const discardDraft = () => {
    localStorage.removeItem('postDraft');
    setContent('');
    setSelectedFile(null);
    setPreviewImage(null);
    setIsDraftSaved(false);
    setIsExpanded(false);
    setShowImageInput(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      await dispatch(createPost(formData)).unwrap();
      
      // Reset form
      setContent('');
      setSelectedFile(null);
      setPreviewImage(null);
      setIsExpanded(false);
      setShowImageInput(false);
      localStorage.removeItem('postDraft');
      
    } catch (error) {
      setErrors({ api: error.message || 'Failed to create post. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ image: 'Image size must be less than 5MB' });
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTextareaFocus = () => {
    setIsExpanded(true);
  };

  if (!isLoggedIn) return null;

  return (
    <div className={`w-full transition-all duration-300 ${isExpanded ? 'mb-10' : 'mb-4'}`}>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 w-full mx-auto transition-all duration-300"
      >
        {/* Header with user info */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                className="w-12 h-12 object-cover rounded-full shadow-md ring-2 ring-indigo-100 border border-white"
                src={userDetails?.profilePicture || '/default-avatar.png'}
                alt={userDetails?.fullName}
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-base sm:text-lg">What's on your mind?</h4>
            </div>
          </div>

          {/* Draft indicator */}
          {isDraftSaved && (
            <div className="flex items-center text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-md">
              <RiDraftLine className="w-3 h-3 mr-1" />
              Draft saved
            </div>
          )}
        </div>

        {/* Main textarea */}
        <div className="mb-4">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={handleTextareaFocus}
            placeholder={`What's happening, ${userDetails?.firstName || 'there'}?`}
            className={`w-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
              isExpanded ? 'min-h-[120px]' : 'min-h-[80px]'
            }`}
            rows={isExpanded ? 6 : 3}
          />
          
          {/* Character count */}
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">
              {charCount}/2000 characters
            </div>
            {charCount > 1800 && (
              <div className="text-xs text-orange-500">
                {2000 - charCount} characters remaining
              </div>
            )}
          </div>
        </div>

        {errors.content && (
          <p className="text-red-500 text-sm mt-1 flex items-center mb-4">
            <AiOutlineInfoCircle className="mr-1" /> {errors.content}
          </p>
        )}

        {/* Image preview */}
        {previewImage && (
          <div className="mb-4 relative">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image input */}
        {showImageInput && (
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>
        )}

        {/* Toolbar */}
        {isExpanded && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowImageInput(!showImageInput)}
                className={`p-2 rounded-lg transition-colors ${
                  showImageInput ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
                title="Add image"
              >
                <FiImage className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveDraft}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Save draft"
              >
                <FiSave className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={discardDraft}
                className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                title="Discard draft"
              >
                <FiTrash2 className="w-5 h-5" />
              </motion.button>
            </div>

            <motion.button
              type="submit"
              disabled={loading || (!content.trim() && !selectedFile)}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                loading || (!content.trim() && !selectedFile)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  <span>Post</span>
                </>
              )}
            </motion.button>
          </div>
        )}

        {errors.api && (
          <div className="mt-4 p-3 bg-red-50 text-red-500 text-sm rounded-md border border-red-100">
            {errors.api}
          </div>
        )}
      </form>
    </div>
  );
};

export default PostForm;