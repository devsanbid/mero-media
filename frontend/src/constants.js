// Background pattern styles
export const patternStyles = {
  'pattern-dots': {
    backgroundImage: 'radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)',
    backgroundSize: '10px 10px'
  },
  'pattern-grid': {
    backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
    backgroundSize: '20px 20px'
  },
  'pattern-stars': {
    backgroundImage: 'radial-gradient(circle, rgba(130,170,255,0.2) 2px, transparent 2px)',
    backgroundSize: '30px 30px'
  },
  'pattern-waves': {
    backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,150,255,0.05), rgba(0,150,255,0.05) 10px, transparent 10px, transparent 20px)',
    backgroundSize: 'auto'
  },
  'pattern-snowflakes': {
    backgroundImage: 'radial-gradient(rgba(150,120,250,0.2) 2px, transparent 2px)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 10px 10px'
  },
  'pattern-hearts': {
    backgroundImage: 'radial-gradient(rgba(255,150,170,0.2) 2px, transparent 2px)',
    backgroundSize: '25px 25px'
  },
  'pattern-confetti': {
    backgroundImage: 'repeating-linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.1) 5px, transparent 5px, transparent 10px), repeating-linear-gradient(135deg, rgba(255, 105, 180, 0.1), rgba(255, 105, 180, 0.1) 5px, transparent 5px, transparent 10px)',
    backgroundSize: 'auto'
  },
  'pattern-lightning': {
    backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,200,0,0.1), rgba(255,200,0,0.1) 5px, transparent 5px, transparent 15px)',
    backgroundSize: 'auto'
  }
};

// Helper function to get image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend URL
  const baseUrl = import.meta.env.VITE_BACKEND_API || 'http://localhost:5000/api';
  const backendUrl = baseUrl.replace('/api', ''); // Remove /api suffix for image URLs
  
  return `${backendUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

// Default avatar fallback
export const DEFAULT_AVATAR = '/default-avatar.png';

// Default cover image fallback
export const DEFAULT_COVER = '/default-cover.jpg';

// Backend URL
export const BACKEND_URL = import.meta.env.VITE_BACKEND_API?.replace('/api', '') || 'http://localhost:5000';



// Default image URLs
export const DEFAULT_IMAGES = {
  PROFILE_PICTURE: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg',
  COVER_IMAGE: 'https://ih1.redbubble.net/cover.4093136.2400x600.jpg',
  PROFILE_SMALL: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg',
  COVER_SMALL: 'https://ih1.redbubble.net/cover.4093136.2400x600.jpg'
};