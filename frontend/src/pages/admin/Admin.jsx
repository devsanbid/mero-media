const Admin = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 ml-64 mr-64">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome to the admin dashboard. This page is only accessible to administrators.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800">User Management</h3>
            <p className="text-red-600 text-sm">Manage user accounts and permissions</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Content Moderation</h3>
            <p className="text-blue-600 text-sm">Review and moderate posts</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Analytics</h3>
            <p className="text-green-600 text-sm">View platform statistics</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800">Settings</h3>
            <p className="text-yellow-600 text-sm">Configure system settings</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Recent Activity</h3>
          <p className="text-gray-600 text-sm">Monitor recent platform activity and user actions</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;