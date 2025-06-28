import React, { useState, useEffect } from 'react'; import {
  Heart,
  MessageCircle,
  Share2,
  Users,
  Camera,
  Video,
  Zap,
  Star,
  ArrowRight,
  Play,
  Globe,
  Shield,
  Smartphone,
  Menu,
  X
} from 'lucide-react';

import { useNavigate } from "react-router-dom"

const AnimatedBlob = ({ className, delay = 0 }) => (
  <div
    className={`absolute rounded-full opacity-20 animate-pulse ${className}`}
    style={{
      animationDelay: `${delay}s`,
      animationDuration: '4s'
    }}
  />
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/20 cursor-pointer group"
      style={{
        animation: `slideUp 0.8s ease-out ${delay}s both`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 transition-transform duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-blue-100 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const FloatingElement = ({ children, className, delay }) => (
  <div
    className={`absolute ${className}`}
    style={{
      animation: `float 6s ease-in-out infinite ${delay}s`
    }}
  >
    {children}
  </div>
);

const StatCard = ({ number, label, delay }) => (
  <div
    className="text-center"
    style={{ animation: `fadeIn 1s ease-out ${delay}s both` }}
  >
    <div className="text-4xl font-bold text-white mb-2">{number}</div>
    <div className="text-blue-200">{label}</div>
  </div>
);

export default function HamroMediaLanding() {

  const navigation = useNavigate()

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = () => {
    if (email) {
      alert('Thank you for joining our waitlist!');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <AnimatedBlob className="w-64 h-64 bg-blue-400 top-10 left-10" delay={0} />
      <AnimatedBlob className="w-96 h-96 bg-purple-500 top-1/3 right-20" delay={1} />
      <AnimatedBlob className="w-48 h-48 bg-indigo-400 bottom-20 left-1/4" delay={2} />

      <FloatingElement className="top-20 right-1/4" delay={0}>
        <Heart className="w-8 h-8 text-pink-300 opacity-60" />
      </FloatingElement>
      <FloatingElement className="top-1/2 left-20" delay={1}>
        <MessageCircle className="w-6 h-6 text-blue-300 opacity-60" />
      </FloatingElement>
      <FloatingElement className="bottom-1/3 right-1/3" delay={2}>
        <Share2 className="w-7 h-7 text-purple-300 opacity-60" />
      </FloatingElement>
      <FloatingElement className="top-1/4 left-1/3" delay={3}>
        <Camera className="w-6 h-6 text-green-300 opacity-60" />
      </FloatingElement>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/20 backdrop-blur-md' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Hamro Media</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-blue-100 hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-blue-100 hover:text-white transition-colors">About</a>
              <a href="#contact" className="text-blue-100 hover:text-white transition-colors">Contact</a>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                onClick={() => navigation("/register")}
              >
                Join Beta
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/20 backdrop-blur-md rounded-lg p-4 mb-4">
              <div className="flex flex-col space-y-3">
                <a href="#features" className="text-blue-100 hover:text-white transition-colors py-2">Features</a>
                <a href="#about" className="text-blue-100 hover:text-white transition-colors py-2">About</a>
                <a href="#contact" className="text-blue-100 hover:text-white transition-colors py-2">Contact</a>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-left">
                  Join Beta
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1
              className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-8"
              style={{ animation: 'slideUp 1s ease-out 0.2s both' }}
            >
              Connect with
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Hamro Media
              </span>
            </h1>
            <p
              className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-12"
              style={{ animation: 'slideUp 1s ease-out 0.4s both' }}
            >
              The social media platform that brings people together. Share moments, discover content, and build meaningful connections in your community.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              style={{ animation: 'slideUp 1s ease-out 0.6s both' }}
            >
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                onClick={() => navigation("/register")}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center group">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
              style={{ animation: 'fadeIn 1s ease-out 0.8s both' }}
            >
              <StatCard number="10K+" label="Active Users" delay={0.1} />
              <StatCard number="50K+" label="Posts Shared" delay={0.2} />
              <StatCard number="100+" label="Communities" delay={0.3} />
              <StatCard number="24/7" label="Support" delay={0.4} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Everything you need to
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> connect</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Powerful features designed to help you share, discover, and engage with your community.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <FeatureCard
              icon={Camera}
              title="Share Moments"
              description="Capture and share your favorite moments with beautiful photo and video tools"
              delay={0.1}
            />
            <FeatureCard
              icon={Users}
              title="Build Communities"
              description="Create and join communities around your interests and passions"
              delay={0.2}
            />
            <FeatureCard
              icon={MessageCircle}
              title="Real-time Chat"
              description="Stay connected with instant messaging and group conversations"
              delay={0.3}
            />
            <FeatureCard
              icon={Video}
              title="Live Streaming"
              description="Go live and connect with your audience in real-time"
              delay={0.4}
            />
            <FeatureCard
              icon={Shield}
              title="Privacy First"
              description="Your data is secure with our advanced privacy protection"
              delay={0.5}
            />
            <FeatureCard
              icon={Smartphone}
              title="Mobile Ready"
              description="Seamless experience across all your devices and platforms"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative z-10 py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center"
            style={{ animation: 'slideUp 1s ease-out 0.2s both' }}
          >
            <div className="mb-8">
              <Star className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Be the first to join Hamro Media
              </h3>
              <p className="text-xl text-blue-100">
                Get early access and be part of our growing community. Join our waitlist today!
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl py-4 px-6 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                >
                  Join Waitlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Hamro Media</span>
            </div>

            <div className="flex items-center space-x-6">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">Support</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-blue-200">
              © 2025 Hamro Media. Built to connect communities.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
