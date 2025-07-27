import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../redux/users/usersSlice';
import { Link } from 'react-router-dom';
import { DEFAULT_IMAGES } from '../constants';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);

  // Users are now fetched centrally in Layout component

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = users.filter(user => 
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setFilteredUsers(filtered);
      setIsOpen(true);
    } else {
      setFilteredUsers([]);
      setIsOpen(false);
    }
  }, [searchTerm, users]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && filteredUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto"
          >
            {filteredUsers.map((user) => (
              <Link
                key={user._id}
                to={`/user/profile/${user._id}`}
                onClick={() => {
                  setSearchTerm('');
                  setIsOpen(false);
                }}
                className="flex items-center p-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
              >
                <img
                  src={user.profilePicture || DEFAULT_IMAGES.PROFILE_SMALL}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{user.fullName}</h4>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;