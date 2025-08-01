import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllUsers,
  updateUserRole,
  deleteUser,
  toggleUserVerification,
  createAdminUser,
  setCurrentPage,
  clearError
} from '../../redux/admin/adminSlice';
import { FiSearch, FiEdit, FiTrash2, FiUserPlus, FiCheck, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const UserManagement = () => {
  const dispatch = useDispatch();
  const {
    users,
    totalUsers,
    currentPage,
    totalPages,
    usersLoading,
    usersError
  } = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    dispatch(fetchAllUsers({ page: currentPage, search: searchTerm, role: roleFilter }));
  }, [dispatch, currentPage, searchTerm, roleFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleToggleVerification = async (userId) => {
    try {
      await dispatch(toggleUserVerification(userId)).unwrap();
    } catch (error) {
      console.error('Failed to toggle verification:', error);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createAdminUser(newAdmin)).unwrap();
      setShowCreateModal(false);
      setNewAdmin({ firstName: '', lastName: '', email: '', password: '' });
    } catch (error) {
      console.error('Failed to create admin:', error);
    }
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">User Management</h2>
            <p className="text-gray-600 mt-1">Manage all users in the system</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <FiUserPlus className="w-4 h-4" />
            <span>Create Admin</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 lg:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-3 py-2 lg:pr-4 lg:py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={handleRoleFilter}
            className="px-3 py-2 lg:px-4 lg:py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {usersError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{usersError}</p>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-800 hover:text-red-900 text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Users Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersLoading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="ml-3 lg:ml-4">
                          <div className="h-3 lg:h-4 bg-gray-200 rounded w-20 lg:w-24 animate-pulse"></div>
                          <div className="h-2 lg:h-3 bg-gray-200 rounded w-24 lg:w-32 mt-1 animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="h-3 lg:h-4 bg-gray-200 rounded w-12 lg:w-16 animate-pulse"></div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="h-3 lg:h-4 bg-gray-200 rounded w-8 lg:w-12 animate-pulse"></div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="h-3 lg:h-4 bg-gray-200 rounded w-16 lg:w-20 animate-pulse"></div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-1 lg:space-x-2">
                        <div className="h-6 w-6 lg:h-8 lg:w-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-6 lg:h-8 lg:w-8 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs lg:text-sm font-medium text-gray-600">
                            {user.firstName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                          <div className="text-xs lg:text-sm font-medium text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs lg:text-sm text-gray-500 truncate">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      {editingUser === user.id ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          className="text-xs lg:text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleVerification(user.id)}
                        className={`p-1 rounded-full ${
                          user.isDpVerify
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {user.isDpVerify ? <FiCheck className="w-3 h-3 lg:w-4 lg:h-4" /> : <FiX className="w-3 h-3 lg:w-4 lg:h-4" />}
                      </button>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-1 lg:space-x-2">
                        <button
                          onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <FiEdit className="w-3 h-3 lg:w-4 lg:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <FiTrash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
  </div>
      </div>

      {/* Users Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {usersLoading ? (
          [...Array(5)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="h-3 bg-gray-200 rounded w-12 animate-pulse mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div>
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-500 truncate">{user.email}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <span className="text-gray-500 block mb-1">Role</span>
                  {editingUser === user.id ? (
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Joined</span>
                  <span className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-sm">Verified:</span>
                  <button
                    onClick={() => handleToggleVerification(user.id)}
                    className={`p-1 rounded-full ${
                      user.isDpVerify
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {user.isDpVerify ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 rounded-lg shadow-sm mt-4">
          {/* Mobile Pagination */}
          <div className="flex items-center justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          {/* Desktop Pagination */}
          <div className="hidden sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * 10, totalUsers)}
                </span>{' '}
                of <span className="font-medium">{totalUsers}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Admin User</h3>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    required
                    value={newAdmin.firstName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newAdmin.lastName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    required
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;