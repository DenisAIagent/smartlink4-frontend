// Utilitaires pour la gestion des analytics (GTM, GA4)

// Initialiser GTM
export const initializeGTM = (gtmId) => {
  if (!gtmId || typeof window === 'undefined') return;
  
  // Créer le script GTM
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  
  // Initialiser dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });
  
  document.head.appendChild(script);
};

// Initialiser GA4
export const initializeGA4 = (ga4Id) => {
  if (!ga4Id || typeof window === 'undefined') return;
  
  // Créer le script GA4
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
  
  document.head.appendChild(script);
  
  // Initialiser gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ga4Id);
};

// Envoyer un événement page_view
export const trackPageView = (linkData) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_title: `${linkData.artist} - ${linkData.title}`,
    page_location: window.location.href,
    artist: linkData.artist,
    title: linkData.title,
    link_slug: linkData.slug
  });
};

// Envoyer un événement select_platform
export const trackPlatformClick = (platform, linkData) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'select_platform', {
    platform: platform,
    artist: linkData.artist,
    title: linkData.title,
    link_slug: linkData.slug
  });
  
  // Aussi envoyer via dataLayer pour GTM
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'select_platform',
      platform: platform,
      artist: linkData.artist,
      title: linkData.title,
      link_slug: linkData.slug
    });
  }
};

// Vérifier si le consentement a été donné
export const hasAnalyticsConsent = () => {
  return localStorage.getItem('analytics_consent') === 'true';
};

// Définir le consentement
export const setAnalyticsConsent = (consent) => {
  localStorage.setItem('analytics_consent', consent.toString());
};

// Initialiser les analytics si le consentement est donné
export const initializeAnalytics = (analytics) => {
  if (!hasAnalyticsConsent() || !analytics) return;
  
  if (analytics.gtmId) {
    initializeGTM(analytics.gtmId);
  }
  
  if (analytics.ga4Id) {
    initializeGA4(analytics.ga4Id);
  }
};

