import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { createSmartLink, checkSlugAvailability } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateLinkPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scanResult, originalUrl } = location.state || {};

  const [formData, setFormData] = useState({
    artist: '',
    title: '',
    slug: '',
    coverUrl: '',
    streamingLinks: {},
    gtmId: '',
    ga4Id: '',
    googleAdsId: ''
  });

  const [slugStatus, setSlugStatus] = useState({ checking: false, available: true, message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Pré-remplir le formulaire avec les données scannées
  useEffect(() => {
    if (scanResult) {
      const slug = generateSlug(scanResult.artist, scanResult.title);
      setFormData({
        artist: scanResult.artist,
        title: scanResult.title,
        slug: slug,
        coverUrl: scanResult.thumbnail,
        streamingLinks: scanResult.links,
        gtmId: '',
        ga4Id: '',
        googleAdsId: ''
      });
    }
  }, [scanResult]);

  // Générer un slug à partir de l'artiste et du titre
  const generateSlug = (artist, title) => {
    const combined = `${artist}-${title}`;
    return combined
      .toLowerCase()
      .normalize("NFD").replace(/\p{Diacritic}/gu, "") // Supprime les accents
      .replace(/[^a-z0-9\s-]/g, "") // Supprime les caractères non alphanumériques (sauf espaces et tirets)
      .replace(/\s+/g, "-") // Remplace les espaces par des tirets
      .replace(/-+/g, "-") // Remplace les tirets multiples par un seul
      .trim("-"); // Supprime les tirets en début et fin de chaîne
  };

  // Vérifier la disponibilité du slug
  const checkSlug = async (slug) => {
    if (!slug || slug.length < 3) {
      setSlugStatus({ checking: false, available: false, message: 'Le slug doit contenir au moins 3 caractères' });
      return;
    }

    setSlugStatus({ checking: true, available: true, message: '' });

    try {
      const result = await checkSlugAvailability(slug);
      if (result.available) {
        setSlugStatus({ checking: false, available: true, message: 'Slug disponible ✓' });
      } else {
        setSlugStatus({ checking: false, available: false, message: 'Ce slug est déjà utilisé. Essayez une variante.' });
      }
    } catch (err) {
      setSlugStatus({ checking: false, available: false, message: 'Erreur lors de la vérification' });
    }
  };

  // Gérer les changements de slug
  const handleSlugChange = (e) => {
    const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, slug: newSlug });
    
    // Débounce la vérification
    clearTimeout(window.slugTimeout);
    window.slugTimeout = setTimeout(() => checkSlug(newSlug), 500);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!slugStatus.available) {
      setError('Veuillez choisir un slug disponible');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Nettoyer les données avant l'envoi
      const cleanedFormData = {
        ...formData,
        gtmId: formData.gtmId.trim(),
        ga4Id: formData.ga4Id.trim(),
        googleAdsId: formData.googleAdsId.trim()
      };
      
      const newLink = await createSmartLink(cleanedFormData);
      navigate('/dashboard', { state: { newLink } });
    } catch (err) {
      setError(err.error || 'Erreur lors de la création du lien');
    } finally {
      setIsLoading(false);
    }
  };

  if (!scanResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Aucune donnée de scan trouvée
          </h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <img src="/mdmc_logo.png" alt="MDMC Logo" className="h-8" />
            <button
              onClick={() => navigate("/")}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Retour
            </button>
          </div>

          <div className="card">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Créer votre SmartLink
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Aperçu */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Aperçu</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={formData.coverUrl}
                    alt="Couverture"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{formData.title}</p>
                    <p className="text-gray-600">{formData.artist}</p>
                  </div>
                </div>
              </div>

              {/* Informations de base */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artiste
                  </label>
                  <input
                    type="text"
                    value={formData.artist}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Slug personnalisé */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL personnalisée
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 bg-gray-100 px-3 py-2 rounded-l-lg border border-r-0 border-gray-300">
                    smartlinks.app/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    className="input-field rounded-l-none"
                    required
                  />
                </div>
                {slugStatus.checking && (
                  <p className="text-sm text-gray-500 mt-1">Vérification...</p>
                )}
                {!slugStatus.checking && slugStatus.message && (
                  <p className={`text-sm mt-1 ${slugStatus.available ? 'text-green-600' : 'text-red-600'}`}>
                    {slugStatus.message}
                  </p>
                )}
              </div>

              {/* Analytics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Identifiants de suivi (optionnel)
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GTM ID
                    </label>
                    <input
                      type="text"
                      value={formData.gtmId}
                      onChange={(e) => setFormData({
                        ...formData,
                        gtmId: e.target.value.trim()
                      })}
                      placeholder="GTM-XXXXXXX"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GA4 ID
                    </label>
                    <input
                      type="text"
                      value={formData.ga4Id}
                      onChange={(e) => setFormData({
                        ...formData,
                        ga4Id: e.target.value
                      })}
                      placeholder="G-XXXXXXXXXX"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Ads ID
                    </label>
                    <input
                      type="text"
                      value={formData.googleAdsId}
                      onChange={(e) => setFormData({
                        ...formData,
                        googleAdsId: e.target.value
                      })}
                      placeholder="AW-XXXXXXXXX"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading || !slugStatus.available}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  'Créer le SmartLink'
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateLinkPage;

