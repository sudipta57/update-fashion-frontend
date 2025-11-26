import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
    // Reload page to allow cookies to work
    window.location.reload();
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay backdrop - optional, makes the banner more prominent */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[99998]" />
      
      {/* Cookie consent banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl z-[99999] border-t-4 border-orange-600 animate-slide-up">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Icon and Content */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <span className="text-5xl flex-shrink-0">🍪</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    We Value Your Privacy
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    We use essential cookies to provide you with the best
                    experience on our website. These cookies are necessary for
                    authentication, remembering your shopping cart, and ensuring
                    site security. By clicking "Accept", you agree to our use of
                    cookies.{" "}
                    <Link
                      to="/privacy-policy"
                      className="text-orange-600 hover:text-orange-700 dark:text-orange-500 underline font-medium"
                    >
                      Learn more about our privacy practices
                    </Link>
                  </p>
                  
                  {/* Important Notice */}
                  <div className="mt-3 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-3 rounded">
                    <p className="text-sm text-orange-900 dark:text-orange-300 font-medium">
                      ⚠️ Cookies are required to sign in and use protected features.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:flex-shrink-0">
              <button
                onClick={handleDecline}
                className="px-8 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-all duration-200 font-medium border-2 border-transparent hover:border-gray-400 dark:hover:border-gray-500"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Accept Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;