import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../constants';

const Search = ({ isMobile = false, onClose }) => {
  const navigate = useNavigate();
  const { allUsers } = useSelector((state) => state.users);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = allUsers?.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];
      setFilteredUsers(filtered.slice(0, 8)); // Limit to 8 results
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setFilteredUsers([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [searchTerm, allUsers]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/user/profile/${userId}`);
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onClose) onClose();
  };

  const handleKeyDown = (e) => {
    if (!isOpen || filteredUsers.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredUsers.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredUsers.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredUsers.length) {
          handleUserClick(filteredUsers[selectedIndex].id);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-medium">
          {part}
        </span>
      ) : part
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white z-50 flex flex-col"
      >
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="flex-1 relative" ref={searchRef}>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search people..."
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 text-gray-600 hover:text-gray-800"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {isOpen && filteredUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-2"
              >
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleUserClick(user.id)}
                  >
                    <img
                      src={getImageUrl(user.profilePicture) || '/default-avatar.png'}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-gray-900">
                        {highlightMatch(user.fullName, searchTerm)}
                      </h4>
                      <p className="text-sm text-gray-500">
                        @{highlightMatch(user.username, searchTerm)}
                      </p>
                    </div>
                    <FiUser className="w-4 h-4 text-gray-400" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {searchTerm && filteredUsers.length === 0 && (
            <div className="p-8 text-center">
              <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No users found for "{searchTerm}"</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm && setIsOpen(true)}
          placeholder="Search people..."
          className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {isOpen && filteredUsers.length > 0 && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            <div className="p-2">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    index === selectedIndex ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleUserClick(user.id)}
                >
                  <img
                    src={getImageUrl(user.profilePicture) || '/default-avatar.png'}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="ml-3 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {highlightMatch(user.fullName, searchTerm)}
                    </h4>
                    <p className="text-xs text-gray-500">
                      @{highlightMatch(user.username, searchTerm)}
                    </p>
                  </div>
                  <FiUser className="w-4 h-4 text-gray-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;