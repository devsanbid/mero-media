import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { setLoggedIn } from "../../redux/auth/authSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle, FaApple } from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io5";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      // Redirect based on user role
      if (user?.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/user/home");
      }
    }
    
    const interval = setInterval(() => {
      const shapes = document.querySelectorAll('.floating-shape');
      shapes.forEach(shape => {
        const newX = Math.random() * 10 - 5;
        const newY = Math.random() * 10 - 5;
        shape.style.transform = `translate(${newX}px, ${newY}px)`;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isLoggedIn, user, navigate]);

  const validate = () => {
    let errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(
        '/user/login',
        {
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem("auth-token", response.data.data.token);

      // Create a user object with the role information
      const user = {
        role: response.data.data.role
      };

      // Pass both token and user object to setLoggedIn
      dispatch(setLoggedIn({ token: response.data.data.token, user }));

      // Redirect based on user role
      if (response.data.data.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/user/home");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
      setErrors({ general: error.response?.data?.message || "Invalid credentials" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 transition-all duration-300 bg-gray-50">
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="floating-shape absolute rounded-full transition-transform duration-3000 ease-in-out bg-indigo-600/5"
            style={{
              width: `${Math.random() * 400 + 100}px`,
              height: `${Math.random() * 400 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${Math.random() * 20 + 10}s`
            }}
          ></div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="w-full lg:w-5/12 p-8 lg:p-12 bg-white flex flex-col justify-center relative">
          <div className="mb-8 flex justify-start">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
            Welcome back
          </h1>
          
          <p className="mb-8 text-base text-gray-600">
            Log in to your account to connect with friends and explore content tailored just for you.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-red-50 text-red-600 text-sm"
              >
                {errors.general}
              </motion.div>
            )}
            
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FiMail />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 rounded-lg text-sm focus:ring-2 focus:ring-offset-1 bg-gray-100 border-gray-200 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FiLock />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 rounded-lg text-sm focus:ring-2 focus:ring-offset-1 bg-gray-100 border-gray-200 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded focus:ring-indigo-500 bg-gray-100 border-gray-300 text-indigo-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
              >
                {isSubmitting ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Sign in"}
              </motion.button>
            </div>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-3 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 rounded-lg shadow-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <FaGoogle className="h-5 w-5 text-red-500" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 rounded-lg shadow-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <FaApple className="h-5 w-5 text-black" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 rounded-lg shadow-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <IoLogoGithub className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="w-full lg:w-7/12 relative overflow-hidden bg-indigo-600">
          <div className="absolute inset-0 z-0">
            <svg className="absolute" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#smallGrid)"/>
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="w-full max-w-md px-8 py-12 text-white">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-extrabold mb-4">Connect with the world</h2>
                <p className="text-lg opacity-80">Share your moments, discover trending content, engage with your community.</p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {[
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    ),
                    title: "Messaging",
                    description: "Real-time chats with friends and groups"
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    ),
                    title: "Live Video",
                    description: "Stream your life moments to friends"
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    ),
                    title: "Collections",
                    description: "Organize and share your favorite content"
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    ),
                    title: "Global Reach",
                    description: "Connect with people from around the world"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index + 0.3 }}
                    className="p-5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="mb-3">{feature.icon}</div>
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm opacity-80">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-center"
              >
                <div className="flex justify-center space-x-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm opacity-80">Trusted by 5M+ users worldwide</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-8 text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} SocialApp. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <Link to="/terms" className="hover:underline">Terms</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/cookies" className="hover:underline">Cookies</Link>
          <Link to="/help" className="hover:underline">Help Center</Link>
        </div>
      </div>
    </div>
  );
}