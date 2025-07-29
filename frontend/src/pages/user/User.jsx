const User = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 ml-64 mr-64">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">User Dashboard</h1>
        <p className="text-gray-600">Welcome to the user dashboard. This page is accessible to all authenticated users.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Profile</h3>
            <p className="text-blue-600 text-sm">Manage your profile information</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Posts</h3>
            <p className="text-green-600 text-sm">View and manage your posts</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Friends</h3>
            <p className="text-purple-600 text-sm">Connect with friends</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;