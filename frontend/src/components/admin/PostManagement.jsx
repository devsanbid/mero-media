import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllPosts,
  deletePost,
  setPostsCurrentPage,
  clearError
} from '../../redux/admin/adminSlice';
import { FiSearch, FiTrash2, FiEye, FiHeart, FiMessageCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PostManagement = () => {
  const dispatch = useDispatch();
  const {
    posts,
    totalPosts,
    postsCurrentPage,
    postsTotalPages,
    postsLoading,
    postsError
  } = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllPosts({ page: postsCurrentPage, search: searchTerm }));
  }, [dispatch, postsCurrentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    dispatch(setPostsCurrentPage(1));
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await dispatch(deletePost(postId)).unwrap();
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handlePageChange = (page) => {
    dispatch(setPostsCurrentPage(page));
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Post Management</h2>
            <p className="text-gray-600 mt-1">Manage all posts in the system</p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {postsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{postsError}</p>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-800 hover:text-red-900 text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postsLoading ? (
          [...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-32 mt-1"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Post Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {post.user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {post.user?.firstName} {post.user?.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                <p className="text-gray-800 text-sm mb-3">
                  {truncateText(post.content || '', 100)}
                </p>

                {/* Post Image */}
                {post.image && (
                  <div className="mb-3">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-1">
                      <FiHeart className="w-4 h-4" />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiMessageCircle className="w-4 h-4" />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewPost(post)}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="View Post"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      title="Delete Post"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty State */}
      {!postsLoading && posts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'No posts have been created yet.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {postsTotalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(postsCurrentPage - 1)}
                disabled={postsCurrentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(postsCurrentPage + 1)}
                disabled={postsCurrentPage === postsTotalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(postsCurrentPage - 1) * 10 + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(postsCurrentPage * 10, totalPosts)}
                  </span>{' '}
                  of <span className="font-medium">{totalPosts}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(postsCurrentPage - 1)}
                    disabled={postsCurrentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  {[...Array(postsTotalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          postsCurrentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(postsCurrentPage + 1)}
                    disabled={postsCurrentPage === postsTotalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {showPostModal && selectedPost && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Post Details</h3>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Post Author */}
              <div className="flex items-center space-x-3 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">
                    {selectedPost.user?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {selectedPost.user?.firstName} {selectedPost.user?.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{selectedPost.user?.email}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(selectedPost.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Content:</h4>
                <p className="text-gray-800 whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              {/* Post Image */}
              {selectedPost.image && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Image:</h4>
                  <img
                    src={selectedPost.image}
                    alt="Post content"
                    className="w-full max-h-96 object-contain rounded-lg border"
                  />
                </div>
              )}

              {/* Post Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FiHeart className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Likes</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    {selectedPost.likes?.length || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FiMessageCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Comments</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {selectedPost.comments?.length || 0}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDeletePost(selectedPost.id);
                    setShowPostModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManagement;