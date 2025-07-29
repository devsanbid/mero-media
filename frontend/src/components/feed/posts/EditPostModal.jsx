import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { editPost } from '../../../redux/posts/postsSlice';
import { FiX, FiSave, FiImage } from 'react-icons/fi';
import { AiOutlineLink } from 'react-icons/ai';

const EditPostModal = ({ isOpen, onClose, post }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('bg-white');
  const [loading, setLoading] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (post && isOpen) {
      setContent(post.content || '');
      setImage(post.image || '');
      setBackgroundColor(post.backgroundColor || 'bg-white');
      setShowImageInput(!!post.image);
    }
  }, [post, isOpen]);

  const handleSave = async () => {
    if (!content.trim() && !image) {
      return;
    }

    setLoading(true);
    try {
      await dispatch(editPost({
        postId: post.id,
        content,
        image,
        backgroundColor
      })).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to edit post:', error);
    } finally {
      setLoading(false);
    }
  };

  const backgroundOptions = [
    { name: 'White', class: 'bg-white', color: '#ffffff' },
    { name: 'Light Blue', class: 'bg-blue-50', color: '#eff6ff' },
    { name: 'Light Green', class: 'bg-green-50', color: '#f0fdf4' },
    { name: 'Light Yellow', class: 'bg-yellow-50', color: '#fefce8' },
    { name: 'Light Pink', class: 'bg-pink-50', color: '#fdf2f8' },
    { name: 'Light Purple', class: 'bg-purple-50', color: '#faf5ff' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Post</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Text Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={4}
            />
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex flex-wrap gap-2">
              {backgroundOptions.map((bg) => (
                <button
                  key={bg.class}
                  onClick={() => setBackgroundColor(bg.class)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    backgroundColor === bg.class
                      ? 'border-indigo-500 scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: bg.color }}
                  title={bg.name}
                />
              ))}
            </div>
          </div>

          {/* Image Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <button
                onClick={() => setShowImageInput(!showImageInput)}
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <FiImage className="w-4 h-4" />
                {showImageInput ? 'Hide' : 'Add'} Image
              </button>
            </div>

            {showImageInput && (
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AiOutlineLink className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Paste image URL here"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                {image && (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full max-h-60 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <button
                      onClick={() => setImage('')}
                      className="absolute top-2 right-2 bg-gray-800 bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80 transition duration-200"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || (!content.trim() && !image)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSave className="w-4 h-4" />
            )}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditPostModal;
