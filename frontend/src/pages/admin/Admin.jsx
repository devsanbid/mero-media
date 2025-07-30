import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../redux/admin/adminSlice';
import DashboardOverview from '../../components/admin/DashboardOverview';
import UserManagement from '../../components/admin/UserManagement';
import PostManagement from '../../components/admin/PostManagement';
import { FiUsers, FiFileText, FiBarChart3, FiSettings } from 'react-icons/fi';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const dispatch = useDispatch();
  const { dashboardStats, loading } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, user]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart3, color: 'blue' },
    { id: 'users', label: 'User Management', icon: FiUsers, color: 'green' },
    { id: 'posts', label: 'Post Management', icon: FiFileText, color: 'purple' },
    { id: 'settings', label: 'Settings', icon: FiSettings, color: 'gray' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview stats={dashboardStats} loading={loading} />;
      case 'users':
        return <UserManagement />;
      case 'posts':
        return <PostManagement />;
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>
            <p className="text-gray-600">Admin settings coming soon...</p>
          </div>
        );
      default:
        return <DashboardOverview stats={dashboardStats} loading={loading} />;
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto p-4 ml-64 mr-64">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h1>
          <p className="text-red-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 ml-64 mr-64">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, posts, and monitor system overview</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? `border-${tab.color}-500 text-${tab.color}-600`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Admin;