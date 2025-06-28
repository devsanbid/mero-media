import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiSettings, 
  FiLogOut, 
  FiHome, 
  FiBarChart, 
  FiUsers, 
  FiMail, 
  FiBell,
  FiSearch,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiEye
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const userData = authService.getUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'messages', label: 'Messages', icon: FiMail },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  const stats = [
    { label: 'Total Users', value: '2,543', change: '+12%', color: 'bg-blue-500' },
    { label: 'Revenue', value: '$45,210', change: '+8%', color: 'bg-green-500' },
    { label: 'Orders', value: '1,234', change: '+23%', color: 'bg-purple-500' },
    { label: 'Growth', value: '89%', change: '+5%', color: 'bg-orange-500' },
  ];

  const recentActivities = [
    { id: 1, action: 'New user registered', user: 'John Doe', time: '2 minutes ago' },
    { id: 2, action: 'Order completed', user: 'Jane Smith', time: '5 minutes ago' },
    { id: 3, action: 'Payment received', user: 'Mike Johnson', time: '10 minutes ago' },
    { id: 4, action: 'Profile updated', user: 'Sarah Wilson', time: '15 minutes ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-lg w-64 fixed h-full z-30"
      >
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-14'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiHome className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-800 capitalize">
                {activeTab}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <FiBell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{user?.fullName || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  title="Logout"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Welcome Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome back, {user?.fullName?.split(' ')[0] || 'User'}! 👋
                </h2>
                <p className="text-gray-600">Here's what's happening with your business today.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <FiBarChart className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-gray-100">
                          <FiEye className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Analytics Dashboard</h3>
              <p className="text-gray-600">Analytics features coming soon...</p>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">User Management</h3>
              <p className="text-gray-600">User management features coming soon...</p>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Messages</h3>
              <p className="text-gray-600">Messaging features coming soon...</p>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Settings</h3>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}