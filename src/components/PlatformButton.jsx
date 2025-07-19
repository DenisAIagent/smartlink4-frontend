import { motion } from 'framer-motion';

const platformConfig = {
  spotify: {
    name: 'Spotify',
    color: 'bg-spotify hover:bg-green-600',
    icon: '🎵',
    textColor: 'text-white'
  },
  appleMusic: {
    name: 'Apple Music',
    color: 'bg-apple hover:bg-red-600',
    icon: '🍎',
    textColor: 'text-white'
  },
  youtube: {
    name: 'YouTube',
    color: 'bg-youtube hover:bg-red-600',
    icon: '📺',
    textColor: 'text-white'
  },
  deezer: {
    name: 'Deezer',
    color: 'bg-deezer hover:bg-yellow-500',
    icon: '🎶',
    textColor: 'text-black'
  },
  amazonMusic: {
    name: 'Amazon Music',
    color: 'bg-amazon hover:bg-orange-600',
    icon: '📦',
    textColor: 'text-white'
  },
  tidal: {
    name: 'Tidal',
    color: 'bg-tidal hover:bg-gray-800',
    icon: '🌊',
    textColor: 'text-white'
  }
};

const PlatformButton = ({ platform, url, onClick, linkData }) => {
  const config = platformConfig[platform];
  
  if (!config || !url) return null;

  const handleClick = () => {
    if (onClick) {
      onClick(platform, linkData);
    }
    // Redirection vers l'URL de tracking
    window.open(`/r/${linkData.slug}/${platform}`, '_blank');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`platform-button ${config.color} ${config.textColor}`}
    >
      <span className="text-xl">{config.icon}</span>
      <span className="font-medium">{config.name}</span>
      <svg 
        className="w-4 h-4 ml-auto" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
        />
      </svg>
    </motion.button>
  );
};

export default PlatformButton;

