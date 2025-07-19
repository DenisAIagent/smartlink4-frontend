import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hasAnalyticsConsent, setAnalyticsConsent } from '../utils/analytics';

const ConsentBanner = ({ onConsentChange }) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier si le consentement a déjà été donné
    const consent = localStorage.getItem('analytics_consent');
    if (consent === null) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    setAnalyticsConsent(true);
    setShowBanner(false);
    if (onConsentChange) {
      onConsentChange(true);
    }
  };

  const handleDecline = () => {
    setAnalyticsConsent(false);
    setShowBanner(false);
    if (onConsentChange) {
      onConsentChange(false);
    }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gestion des cookies
                </h3>
                <p className="text-sm text-gray-600">
                  Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, 
                  analyser le trafic et personnaliser le contenu. En cliquant sur "Accepter", 
                  vous consentez à l'utilisation de ces technologies conformément à notre politique de confidentialité.
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={handleDecline}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Refuser
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
                >
                  Accepter
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsentBanner;

