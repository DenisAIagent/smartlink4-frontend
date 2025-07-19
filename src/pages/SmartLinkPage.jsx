import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { linksApi } from '../api';
import { initializeAnalytics, trackPageView, trackPlatformClick } from '../utils/analytics';
import PlatformButton from '../components/PlatformButton';
import ConsentBanner from '../components/ConsentBanner';

const SmartLinkPage = () => {
  const { slug } = useParams();
  const [link, setLink] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsInitialized, setAnalyticsInitialized] = useState(false);

  useEffect(() => {
    if (slug) {
      loadLink();
    }
  }, [slug]);

  const loadLink = async () => {
    try {
      const response = await linksApi.getBySlug(slug);
      const data = response.data;
      setLink(data);
      
      // Initialiser les analytics si le consentement a déjà été donné
      if (data.analytics) {
        initializeAnalytics(data.analytics);
        setAnalyticsInitialized(true);
        trackPageView(data);
      }
    } catch (err) {
      setError(err.error || 'Lien non trouvé');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsentChange = (consent) => {
    if (consent && link?.analytics && !analyticsInitialized) {
      initializeAnalytics(link.analytics);
      setAnalyticsInitialized(true);
      trackPageView(link);
    }
  };

  const handlePlatformClick = (platform, linkData) => {
    if (analyticsInitialized) {
      trackPlatformClick(platform, linkData);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement..." />
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Lien non trouvé
          </h2>
          <p className="text-gray-600 mb-6">
            Ce SmartLink n'existe pas ou a été supprimé.
          </p>
          <a
            href="/"
            className="btn-primary"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  const platforms = Object.entries(link.streamingLinks || {}).filter(([_, url]) => url);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* Header avec logo/titre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <img src="/mdmc_logo.png" alt="MDMC Logo" className="h-12 mx-auto" />
          </motion.div>

          {/* Carte principale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card text-center"
          >
            {/* Image de couverture */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6"
            >
              <img
                src={link.coverUrl}
                alt={`${link.artist} - ${link.title}`}
                className="w-48 h-48 mx-auto rounded-2xl shadow-lg object-cover"
              />
            </motion.div>

            {/* Informations de la release */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {link.title}
              </h2>
              <p className="text-lg text-gray-600">
                {link.artist}
              </p>
            </motion.div>

            {/* Boutons des plateformes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-3"
            >
              {platforms.map(([platform, url], index) => (
                <motion.div
                  key={platform}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <PlatformButton
                    platform={platform}
                    url={url}
                    onClick={handlePlatformClick}
                    linkData={link}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500">
                Créé avec{' '}
                <a
                  href="/"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  SmartLinks
                </a>
              </p>
            </motion.div>
          </motion.div>

          {/* Lien vers le dashboard (optionnel) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-6"
          >
            <a
              href="/dashboard"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Créer votre propre SmartLink
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bannière de consentement RGPD */}
      <ConsentBanner onConsentChange={handleConsentChange} />
    </div>
  );
};

export default SmartLinkPage;

