import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bike,
  Calendar,
  Users,
  Camera,
  MessageSquare,
  Shield,
  User,
} from "lucide-react";
import RegistrationForm from "./RegistrationForm.jsx";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    const handler = () => setShowRegistrationForm(true);
    window.addEventListener("open-registration", handler);
    return () => window.removeEventListener("open-registration", handler);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: "Home", path: "/", icon: Bike },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Gallery", path: "/gallery", icon: Camera },
    { name: "Members", path: "/members", icon: Users },
    { name: "Safety", path: "/safety", icon: Shield },
    { name: "Forum", path: "/forum", icon: MessageSquare },
  ];

  return (
    <header className="bg-black/95 backdrop-blur-sm fixed w-full z-50 border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col justify-center">
              <h1
                className="text-xl font-bold text-white cursor-pointer"
                onClick={() => handleNavigation("/")}
              >
                BUC_India
              </h1>
              <p className="text-xs text-gray-400 leading-tight mt-1">
                Ride Together, Stand Together
              </p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center space-x-2 transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "text-orange-500"
                    : "text-gray-300 hover:text-orange-500"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button
              type="button"
              onClick={() => handleNavigation("/profile")}
              className="flex items-center space-x-2 text-gray-300 hover:text-orange-500 transition-colors duration-200"
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </button>
            <button
              type="button"
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1.5 rounded-md font-semibold text-sm hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
              style={{ lineHeight: 1.2 }}
              onClick={() => setShowRegistrationForm(true)}
            >
              Join Community
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-3 transition-colors duration-200 text-left ${
                    location.pathname === item.path
                      ? "text-orange-500"
                      : "text-gray-300 hover:text-orange-500"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleNavigation("/profile")}
                className="flex items-center space-x-3 text-gray-300 hover:text-orange-500 transition-colors duration-200 text-left"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowRegistrationForm(true);
                }}
                className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-md font-semibold text-sm mt-4 w-full flex items-center justify-center"
                style={{ lineHeight: 1.2 }}
              >
                Join Community
              </button>
            </nav>
          </div>
        )}
      </div>

      <RegistrationForm
        isOpen={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
        type="community"
      />
    </header>
  );
};

export default Header;
