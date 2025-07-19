import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { scanApi, linksApi } from '../api';

export default function LinkForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(slug);
  
  const [formData, setFormData] = useState({
    artist: '',
    title: '',
    slug: '',
    coverUrl: '',
    streamingLinks: {},
    analytics: {
      gtmId: '',
      ga4Id: '',
      googleAdsId: ''
    }
  });
  
  const [scanUrl, setScanUrl] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load existing link for edit
  useEffect(() => {
    if (isEdit) {
      loadExistingLink();
    }
  }, [slug, isEdit]);

  const loadExistingLink = async () => {
    try {
      const response = await linksApi.getBySlug(slug);
      const link = response.data;
      setFormData({
        artist: link.artist,
        title: link.title,
        slug: link.slug,
        coverUrl: link.coverUrl,
        streamingLinks: Object.fromEntries(link.streamingLinks || []),
        analytics: link.analytics || { gtmId: '', ga4Id: '', googleAdsId: '' }
      });
    } catch (error) {
      setError('Erreur lors du chargement du lien');
      console.error(error);
    }
  };

  const handleScan = async () => {
    if (!scanUrl.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await scanApi.scanUrl(scanUrl);
      const data = response.data;
      
      setScanResult(data);
      setFormData(prev => ({
        ...prev,
        artist: data.artist,
        title: data.title,
        coverUrl: data.thumbnailUrl,
        streamingLinks: data.links,
        slug: data.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim()
      }));
      
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors du scan');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isEdit) {
        await linksApi.update(slug, formData);
      } else {
        await linksApi.create(formData);
      }
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith('analytics.')) {
      const analyticsField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        analytics: {
          ...prev.analytics,
          [analyticsField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const togglePlatform = (platform, url) => {
    setFormData(prev => {
      const newStreamingLinks = { ...prev.streamingLinks };
      if (newStreamingLinks[platform]) {
        delete newStreamingLinks[platform];
      } else {
        newStreamingLinks[platform] = url;
      }
      return { ...prev, streamingLinks: newStreamingLinks };
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Éditer' : 'Créer'} un SmartLink
      </h1>

      {/* Scan section */}
      {!isEdit && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">1. Scanner une URL musicale</h2>
          <div className="flex gap-3">
            <input
              type="url"
              value={scanUrl}
              onChange={(e) => setScanUrl(e.target.value)}
              placeholder="https://open.spotify.com/track/..."
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <button
              onClick={handleScan}
              disabled={loading || !scanUrl.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Scan...' : 'Scanner'}
            </button>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">2. Informations de base</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Artiste
              </label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) => handleInputChange('artist', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Votre lien sera: {window.location.origin}/{formData.slug}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de couverture
              </label>
              <input
                type="url"
                value={formData.coverUrl}
                onChange={(e) => handleInputChange('coverUrl', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Platform Selection */}
        {scanResult && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">3. Sélectionner les plateformes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(scanResult.links).map(([platform, url]) => {
                const isSelected = Boolean(formData.streamingLinks[platform]);
                const platformNames = {
                  spotify: 'Spotify',
                  appleMusic: 'Apple Music',
                  youtube: 'YouTube',
                  deezer: 'Deezer',
                  amazonMusic: 'Amazon Music',
                  tidal: 'Tidal'
                };

                return (
                  <label key={platform} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => togglePlatform(platform, url)}
                      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm">
                      {platformNames[platform] || platform}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Analytics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">4. Analytics (optionnel)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GTM ID
              </label>
              <input
                type="text"
                value={formData.analytics.gtmId}
                onChange={(e) => handleInputChange('analytics.gtmId', e.target.value)}
                placeholder="GTM-XXXXXXX"
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GA4 ID
              </label>
              <input
                type="text"
                value={formData.analytics.ga4Id}
                onChange={(e) => handleInputChange('analytics.ga4Id', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Ads ID
              </label>
              <input
                type="text"
                value={formData.analytics.googleAdsId}
                onChange={(e) => handleInputChange('analytics.googleAdsId', e.target.value)}
                placeholder="AW-XXXXXXXXX"
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        {formData.coverUrl && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">5. Aperçu</h2>
            <div className="max-w-sm mx-auto border border-gray-200 rounded-lg p-4">
              <img
                src={formData.coverUrl}
                alt="Cover"
                className="w-full rounded mb-3"
              />
              <h3 className="font-bold text-lg">{formData.title}</h3>
              <p className="text-gray-600 mb-4">{formData.artist}</p>
              <div className="space-y-2">
                {Object.entries(formData.streamingLinks).map(([platform, url]) => (
                  <div
                    key={platform}
                    className="bg-black text-white text-center py-2 rounded"
                  >
                    Écouter sur {platform}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer le SmartLink')}
          </button>
        </div>
      </form>
    </div>
  );
}