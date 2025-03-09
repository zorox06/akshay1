
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
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-tax-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-tax-blue">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-foreground">Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          We couldn't find the page you're looking for. Let's get you back on track.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-tax-blue text-tax-gray-dark font-medium hover:bg-tax-blue-light transition-all duration-300"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
