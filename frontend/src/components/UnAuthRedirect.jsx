import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

const UnAuthRedirect = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (isLoggedIn) {
      navigate('/user/home');
    }
  }, [isLoggedIn, navigate]);

  if (!isClient) {
    return <Loading />;
  }

  return <>{!isLoggedIn ? children : <Loading />}</>;
};

export default UnAuthRedirect;