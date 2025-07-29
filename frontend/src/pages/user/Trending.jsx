import React from 'react';
import { motion } from 'framer-motion';
import AuthRedirect from '../../components/AuthRedirect';

const Trending = () => {
  return (
    <AuthRedirect>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Trending
            </h1>
            <p className="text-gray-600 text-lg">Discover what's popular right now</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📈</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                We're working on bringing you the latest trending content. Stay tuned!
              </p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AuthRedirect>
  );
};

export default Trending;