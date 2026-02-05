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
import buclogo from "../../public/logo.jpg";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("userLoggedIn") === "true",
  );

  useEffect(() => {
    const handler = () => setShowRegistrationForm(true);
    const loginHandler = () =>
      setIsLoggedIn(localStorage.getItem("userLoggedIn") === "true");

    window.addEventListener("open-registration", handler);
    window.addEventListener("user-login-change", loginHandler);

    return () => {
      window.removeEventListener("open-registration", handler);
      window.removeEventListener("user-login-change", loginHandler);
    };
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
            <div>
              <img className="rounded-full h-14" src={buclogo} alt="buclogo" />
            </div>
            <div className="flex flex-col  items-center justify-center">
              <div className="flex">
                <h1
                  className="text-xl font-bold text-white cursor-pointer"
                  onClick={() => handleNavigation("/")}
                >
                  BUC_India
                </h1>
              </div>

              <p className="text-xs text-gray-400 leading-tight mt-1">
                Ride Together, Stand Together
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavigation("/profile")}
                  className="flex items-center space-x-2 text-gray-300 hover:text-orange-500 transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1.5 rounded-md font-semibold text-sm hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                style={{ lineHeight: 1.2 }}
                onClick={() => handleNavigation("/signup")}
              >
                Sign Up
              </button>
            )}
          </div>

          <button
            className="text-white border border-white/20 rounded-md px-3 py-1 flex items-center gap-2 hover:bg-white/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="text-sm">Menu</span>
          </button>
        </div>

        {/* Sidebar */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/70 z-[60]"
              onClick={() => setIsMenuOpen(false)}
            />
            <aside className="fixed top-0 left-0 h-full w-72 bg-gray-950 border-r border-orange-500/20 z-[70] flex flex-col">
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img className="rounded-full h-10 w-10 object-cover" src={buclogo} alt="buclogo" />
                  <div className="flex flex-col">
                    <span className="text-white font-bold leading-tight">BUC_India</span>
                    <span className="text-xs text-gray-400 leading-tight">Ride Together, Stand Together</span>
                  </div>
                </div>
                <button
                  className="text-white hover:bg-white/10 rounded-md p-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      location.pathname === item.path
                        ? "bg-white/10 text-orange-400"
                        : "text-gray-200 hover:text-orange-300 hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </nav>

              <div className="p-3 border-t border-white/10">
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => handleNavigation("/profile")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-200 hover:text-orange-300 hover:bg-white/5 transition-colors text-left"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNavigation("/signup")}
                    className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center"
                    style={{ lineHeight: 1.2 }}
                  >
                    Sign Up
                  </button>
                )}
              </div>
            </aside>
          </>
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
