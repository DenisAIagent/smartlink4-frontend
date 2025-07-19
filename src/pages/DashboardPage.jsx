import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllLinks } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadLinks();
  }, []);

  // Ajouter le nouveau lien s'il vient de la page de création
  useEffect(() => {
    if (location.state?.newLink) {
      setLinks(prevLinks => [location.state.newLink, ...prevLinks]);
      // Nettoyer l'état pour éviter la duplication
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadLinks = async () => {
    try {
      const data = await getAllLinks();
      setLinks(data);
    } catch (err) {
      setError(err.error || 'Erreur lors du chargement des liens');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTotalClicks = (clickStats) => {
    if (!clickStats?.clicks) return 0;
    return Object.values(clickStats.clicks).reduce((total, clicks) => total + clicks, 0);
  };

  const copyToClipboard = (slug) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    // Vous pourriez ajouter une notification toast ici
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement de vos liens..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <img src="/mdmc_logo.png" alt="MDMC Logo" className="h-8" />
              <h1 className="text-3xl font-bold text-mdmc-white">
                Mes SmartLinks
              </h1>
            </div>
            <button
              onClick={() => navigate("/")}
              className="btn-primary"
            >
              Créer un nouveau lien
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6"
            >
              <p className="text-red-600">{error}</p>
            </motion.div>
          )}

          {/* Statistiques globales */}
          {links.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-primary-600">
                  {links.length}
                </h3>
                <p className="text-gray-600">SmartLinks créés</p>
              </div>
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-primary-600">
                  {links.reduce((total, link) => total + (link.clickStats?.totalViews || 0), 0)}
                </h3>
                <p className="text-gray-600">Vues totales</p>
              </div>
              <div className="card text-center">
                <h3 className="text-2xl font-bold text-primary-600">
                  {links.reduce((total, link) => total + getTotalClicks(link.clickStats), 0)}
                </h3>
                <p className="text-gray-600">Clics totaux</p>
              </div>
            </motion.div>
          )}

          {/* Liste des liens */}
          {links.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card text-center py-12"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎵</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun SmartLink créé
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez par créer votre premier lien intelligent
              </p>
              <button
                onClick={() => navigate('/')}
                className="btn-primary"
              >
                Créer mon premier lien
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {links.map((link, index) => (
                <motion.div
                  key={link._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Informations du lien */}
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={link.coverUrl}
                        alt={`${link.artist} - ${link.title}`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {link.title}
                        </h3>
                        <p className="text-gray-600">{link.artist}</p>
                        <p className="text-sm text-gray-500">
                          Créé le {formatDate(link.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Statistiques */}
                    <div className="flex gap-6 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary-600">
                          {link.clickStats?.totalViews || 0}
                        </p>
                        <p className="text-sm text-gray-600">Vues</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary-600">
                          {getTotalClicks(link.clickStats)}
                        </p>
                        <p className="text-sm text-gray-600">Clics</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(link.slug)}
                        className="btn-secondary text-sm"
                        title="Copier le lien"
                      >
                        📋 Copier
                      </button>
                      <button
                        onClick={() => window.open(`/${link.slug}`, '_blank')}
                        className="btn-primary text-sm"
                        title="Voir le lien"
                      >
                        👁️ Voir
                      </button>
                    </div>
                  </div>

                  {/* Détail des clics par plateforme */}
                  {link.clickStats?.clicks && Object.keys(link.clickStats.clicks).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Clics par plateforme
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(link.clickStats.clicks).map(([platform, clicks]) => (
                          <span
                            key={platform}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {platform}: {clicks}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;

