import axios from 'axios';

const API_BASE_URL = 'https://extraordinary-embrace-staring.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Service pour scanner une URL
export const scanUrl = async (url) => {
  try {
    const response = await api.post('/api/scan', { url });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erreur de connexion' };
  }
};

// Service pour créer un SmartLink
export const createSmartLink = async (linkData) => {
  try {
    const response = await api.post('/api/links', linkData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erreur de connexion' };
  }
};

// Service pour récupérer tous les liens
export const getAllLinks = async () => {
  try {
    const response = await api.get('/api/links');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erreur de connexion' };
  }
};

// Service pour récupérer un lien par slug
export const getLinkBySlug = async (slug) => {
  try {
    const response = await api.get(`/api/links/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erreur de connexion' };
  }
};

// Service pour vérifier la disponibilité d'un slug
export const checkSlugAvailability = async (slug) => {
  try {
    const response = await api.get(`/api/links/${slug}/availability`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erreur de connexion' };
  }
};

export default api;

