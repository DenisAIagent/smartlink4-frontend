import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { scanUrl } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await scanUrl(url);
      // Naviguer vers la page de création avec les données scannées
      navigate('/create', { state: { scanResult: result, originalUrl: url } });
    } catch (err) {
      setError(err.error || 'Erreur lors du scan de l\'URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen mdmc-gradient">
      {/* Header avec logo MDMC */}
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <img src="/mdmc_logo.png" alt="MDMC Logo" className="h-8" />
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary text-sm"
          >
            Dashboard
          </button>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Header principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-mdmc-white mb-4"
          >
            Smart<span className="mdmc-text-gradient">Links</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <p className="text-2xl md:text-3xl font-bold text-primary mb-2">
              PUSH. PLAY. BLOW UP.
            </p>
            <p className="text-lg text-mdmc-gray-300 max-w-2xl mx-auto">
              Créez des liens intelligents pour vos sorties musicales. 
              Une seule URL pour toutes les plateformes de streaming.
            </p>
          </motion.div>

          {/* Formulaire de scan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-2xl font-semibold text-mdmc-white mb-6">
              Commencer avec une URL
            </h2>
            
            <form onSubmit={handleScan} className="space-y-4">
              <div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Collez votre lien Spotify, Apple Music, YouTube..."
                  className="input-field text-lg"
                  disabled={isLoading}
                />
              </div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-900/50 border border-red-700 rounded-lg"
                >
                  <p className="text-red-300 text-sm">{error}</p>
                </motion.div>
              )}
              
              <motion.button
                type="submit"
                disabled={isLoading || !url.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed glow-red"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  'Scanner et créer le lien'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-mdmc-gray-400 text-sm">SmartLinks créés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-mdmc-gray-400 text-sm">Artistes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1M+</div>
              <div className="text-mdmc-gray-400 text-sm">Clics générés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-mdmc-gray-400 text-sm">Plateformes</div>
            </div>
          </motion.div>

          {/* Fonctionnalités */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid md:grid-cols-3 gap-8"
          >
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="text-lg font-semibold text-mdmc-white mb-2">
                Multi-plateformes
              </h3>
              <p className="text-mdmc-gray-400">
                Spotify, Apple Music, YouTube, Deezer et plus encore
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-mdmc-white mb-2">
                Analytics intégrés
              </h3>
              <p className="text-mdmc-gray-400">
                Suivez les clics et optimisez vos campagnes
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-mdmc-white mb-2">
                Rapide et simple
              </h3>
              <p className="text-mdmc-gray-400">
                Créez votre SmartLink en quelques secondes
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;

