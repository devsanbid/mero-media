import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navigation = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/explore', label: 'Explore', icon: '🔍' },
    { path: '/friends', label: 'Friends', icon: '👥' },
    { path: '/posts', label: 'Posts', icon: '📝' },
    { path: '/user', label: 'User Dashboard', icon: '👤' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Admin Panel', icon: '⚙️' });
  }

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;