import React from 'react';
import { FiUsers, FiFileText, FiHeart, FiMessageCircle, FiTrendingUp, FiUserCheck } from 'react-icons/fi';

const DashboardOverview = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: 'blue',
      description: 'Registered users',
      trend: '+12%'
    },
    {
      title: 'Admin Users',
      value: stats?.adminUsers || 0,
      icon: FiUserCheck,
      color: 'green',
      description: 'Admin accounts',
      trend: '+2%'
    },
    {
      title: 'Total Posts',
      value: stats?.totalPosts || 0,
      icon: FiFileText,
      color: 'purple',
      description: 'Published posts',
      trend: '+8%'
    },
    {
      title: 'Total Likes',
      value: stats?.totalLikes || 0,
      icon: FiHeart,
      color: 'red',
      description: 'Post likes',
      trend: '+15%'
    },
    {
      title: 'Total Comments',
      value: stats?.totalComments || 0,
      icon: FiMessageCircle,
      color: 'yellow',
      description: 'User comments',
      trend: '+10%'
    },
    {
      title: 'Active Today',
      value: stats?.activeToday || 0,
      icon: FiTrendingUp,
      color: 'indigo',
      description: 'Active users today',
      trend: '+5%'
    },
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {formatNumber(stat.value)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm font-medium text-green-600">{stat.trend}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h3>
          <div className="space-y-3">
            {stats?.recentUsers?.slice(0, 5).map((user, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role}
                </span>
              </div>
            )) || (
              <p className="text-gray-500 text-sm">No recent users</p>
            )}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Posts</h3>
          <div className="space-y-3">
            {stats?.recentPosts?.slice(0, 5).map((post, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-3">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {post.content?.substring(0, 60)}...
                </p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500">
                    by {post.user?.firstName} {post.user?.lastName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-sm">No recent posts</p>
            )}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900">Server Status</p>
            <p className="text-xs text-green-600">Online</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900">Database</p>
            <p className="text-xs text-blue-600">Connected</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-gray-900">Storage</p>
            <p className="text-xs text-yellow-600">75% Used</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;