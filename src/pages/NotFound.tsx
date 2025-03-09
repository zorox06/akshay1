
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-tax-blue rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-tax-blue-dark">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          We couldn't find the page you're looking for. Let's get you back on track.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-tax-blue-dark text-white font-medium hover:bg-blue-600 transition-all duration-300"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
