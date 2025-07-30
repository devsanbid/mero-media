import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiUserPlus, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StatsSection = ({ user }) => {
  const friendsList = useSelector((state) => state.friendRequests?.friendsList || []);
  const sentRequests = useSelector((state) => state.friendRequests?.sentRequests || []);
  const receivedRequests = useSelector((state) => state.friendRequests?.receivedRequests || []);
  
  const friendsCount = friendsList.length;
  const followersCount = receivedRequests.length;
  const followingCount = sentRequests.length;

  const stats = [
    {
      label: 'Friends',
      count: friendsCount,
      icon: <FiHeart className="w-5 h-5" />,
      color: 'text-rose-600',
      bgColor: 'hover:bg-rose-50',
      link: '/user/friends'
    },
    {
      label: 'Followers',
      count: followersCount,
      icon: <FiUsers className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50',
      link: '#followers'
    },
    {
      label: 'Following',
      count: followingCount,
      icon: <FiUserPlus className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'hover:bg-green-50',
      link: '#following'
    }
  ];

  return (
    <div className="flex items-center gap-6 mt-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="group cursor-pointer"
        >
          <Link
            to={stat.link}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${stat.bgColor} border border-gray-200 hover:border-gray-300 hover:shadow-sm`}
          >
            <span className={`${stat.color} group-hover:scale-110 transition-transform duration-200`}>
              {stat.icon}
            </span>
            <div className="flex flex-col items-center">
              <span className="font-bold text-gray-900 text-lg leading-none">
                {stat.count > 999 ? `${(stat.count / 1000).toFixed(1)}k` : stat.count}
              </span>
              <span className="text-xs text-gray-600 font-medium">
                {stat.label}
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsSection;