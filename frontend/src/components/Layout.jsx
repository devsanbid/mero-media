import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '../redux/auth/authSlice';
import Header from './Header';
import Sidebar from './Sidebar';
import Rightbar from './Rightbar';
import LoadingSpinner from './LoadingSpinner';

const Layout = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token && !isLoggedIn) {
      dispatch(fetchUserDetails());
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
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen pt-16">
          <Outlet />
        </main>
        <Rightbar />
      </div>
    </div>
  );
};

export default Layout;