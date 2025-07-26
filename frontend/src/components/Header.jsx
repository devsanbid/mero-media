import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-indigo-600">SocialApp</h1>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {user.firstName} {user.lastName}
                </span>
                {user.role === 'admin' && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;