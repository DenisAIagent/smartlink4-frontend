import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { linksApi } from '../api';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const response = await linksApi.getAll();
      setLinks(response.data);
    } catch (error) {
      console.error('Error loading links:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalClicks = (clickStats) => {
    if (!clickStats?.clicks) return 0;
    const clicksArray = Array.from(clickStats.clicks.values());
    return clicksArray.reduce((total, clicks) => total + clicks, 0);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header with logo */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <img src="/mdmc_logo.png" alt="MDMC" className="h-8" />
          <h1 className="text-2xl font-bold">Mes SmartLinks</h1>
        </div>
        <Link 
          to="/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Créer un nouveau lien
        </Link>
      </div>

      {/* Stats cards */}
      {links.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold text-blue-600">{links.length}</h3>
            <p className="text-gray-600">SmartLinks</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold text-blue-600">
              {links.reduce((total, link) => total + (link.clickStats?.totalViews || 0), 0)}
            </h3>
            <p className="text-gray-600">Vues totales</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-2xl font-bold text-blue-600">
              {links.reduce((total, link) => total + getTotalClicks(link.clickStats), 0)}
            </h3>
            <p className="text-gray-600">Clics totaux</p>
          </div>
        </div>
      )}

      {/* Links table */}
      {links.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🎵</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Aucun SmartLink créé</h3>
          <p className="text-gray-600 mb-6">Commencez par créer votre premier lien intelligent</p>
          <Link 
            to="/create"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors inline-block"
          >
            Créer mon premier lien
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artiste
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {links.map((link) => (
                <tr key={link._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={link.coverUrl}
                        alt={link.title}
                        className="w-10 h-10 rounded object-cover mr-3"
                      />
                      <div className="font-medium text-gray-900">{link.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {link.artist}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {link.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {link.clickStats?.totalViews || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {getTotalClicks(link.clickStats)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <Link
                        to={`/edit/${link.slug}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Éditer
                      </Link>
                      <a
                        href={`/${link.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800"
                      >
                        Voir
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer with small MDMC logo */}
      <div className="mt-12 text-center">
        <img src="/mdmc_logo.png" alt="MDMC Music Ads" className="h-4 mx-auto opacity-50" />
      </div>
    </div>
  );
}