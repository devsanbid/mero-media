import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '../redux/auth/authSlice';
import { fetchUsers } from '../redux/users/usersSlice';
import { fetchReceivedRequests } from '../redux/friendRequests/friendRequestsSlice';
import Header from './Header';
import Sidebar from './Sidebar';
import Rightbar from './Rightbar';
import LoadingSpinner from './LoadingSpinner';

const Layout = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, loading, user } = useSelector((state) => state.auth);
  const [isSidebar, setIsSidebar] = useState(false);

  const toggleSidebar = () => {
    setIsSidebar(!isSidebar);
  };

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    console.log('Layout - token:', !!token, 'isLoggedIn:', isLoggedIn, 'user:', !!user);
    if (token && (!isLoggedIn || !user) && !loading) {
      console.log('Fetching user details from Layout');
      dispatch(fetchUserDetails());
    }
  }, [dispatch, isLoggedIn, user, loading]);

  useEffect(() => {
    console.log('Layout - Auth state changed:', { isLoggedIn, loading });
  }, [isLoggedIn, loading]);

  // Fetch initial data when user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUsers());
      dispatch(fetchReceivedRequests());
    }
  }, [dispatch, isLoggedIn]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isSidebar={isSidebar} />
        <main className="flex-1 min-h-screen m-12  max-w-full overflow-hidden">
          <div className="">
            <Outlet />
          </div>
        </main>
        <Rightbar />
      </div>
    </div>
  );
};

export default Layout;