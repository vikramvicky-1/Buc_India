import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Bike,
  Calendar,
  Users,
  Camera,
  MessageSquare,
  User,
  LogOut,
} from "lucide-react";
import RegistrationForm from "./RegistrationForm.jsx";
import buclogo from "../../public/logo.jpg";
import { profileService } from "../services/api";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("userLoggedIn") === "true",
  );
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const handler = () => setShowRegistrationForm(true);
    const loginHandler = () => {
      const loggedIn = sessionStorage.getItem("userLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        fetchProfile();
      } else {
        setUserProfile(null);
      }
    };

    window.addEventListener("open-registration", handler);
    window.addEventListener("user-login-change", loginHandler);

    if (isLoggedIn) {
      fetchProfile();
    }

    return () => {
      window.removeEventListener("open-registration", handler);
      window.removeEventListener("user-login-change", loginHandler);
    };
  }, [isLoggedIn]);

  const fetchProfile = async () => {
    try {
      const email = sessionStorage.getItem("userEmail");
      const phone = sessionStorage.getItem("userPhone");
      if (email || phone) {
        const profile = await profileService.get(email, phone);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userLoggedIn");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userPhone");
    window.dispatchEvent(new Event("user-login-change"));
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: "Home", path: "/", icon: Bike },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Gallery", path: "/gallery", icon: Camera },
    { name: "Members", path: "/members", icon: Users },
    { name: "Forum", path: "/forum", icon: MessageSquare },
    ...(isLoggedIn ? [{ name: "Your Events", path: "/your-events", icon: Calendar }] : []),
  ];

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-black/90 backdrop-blur-md fixed w-full z-[100] border-b border-orange-500/30 shadow-lg shadow-orange-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo and Name Redesign */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavigation("/")}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500 group-hover:duration-200"></div>
              <motion.img
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative rounded-full h-12 w-12 sm:h-14 sm:w-14 border-2 border-orange-500/50 object-cover"
                src={buclogo}
                alt="BUC India"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tighter text-white leading-none">
                Buc_India
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-400"
              >
                Ride Together, Stand Together
              </motion.p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navigation.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(item.path)}
                className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  location.pathname === item.path
                    ? "text-orange-500"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {location.pathname === item.path && (
                  <>
                    <motion.div
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-orange-500/10 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 mx-4 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  </>
                )}
              </motion.button>
            ))}

            <div className="h-6 w-[1px] bg-gray-800 mx-2"></div>

            {isLoggedIn ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                type="button"
                onClick={() => handleNavigation("/profile")}
                className="flex items-center space-x-3 pl-2 group"
              >
                <div className="flex flex-col items-end mr-1">
                  <span className="text-xs font-bold text-white group-hover:text-orange-500 transition-colors">
                    {userProfile?.fullName || "Member"}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    View Profile
                  </span>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold border-2 border-white/10 overflow-hidden group-hover:border-orange-500 transition-all duration-300 shadow-inner">
                  {userProfile?.profileImage ? (
                    <img
                      src={userProfile.profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(userProfile?.fullName)}</span>
                  )}
                </div>
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05, shadow: "0px 0px 20px rgba(249, 115, 22, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-full font-bold text-sm transition-all duration-300"
                onClick={() => handleNavigation("/signup")}
              >
                JOIN NOW
              </motion.button>
            )}
          </nav>

          <button
            className="md:hidden text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-orange-500" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="md:hidden bg-black/95 border-b border-orange-500/30 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 ${
                    location.pathname === item.path
                      ? "text-orange-500 bg-orange-500/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </motion.button>
              ))}

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navigation.length * 0.1 }}
                className="h-[1px] bg-gray-800 my-4"
              ></motion.div>

              {isLoggedIn ? (
                <div className="space-y-3">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (navigation.length + 1) * 0.1 }}
                    onClick={() => handleNavigation("/profile")}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold border-2 border-white/10 overflow-hidden">
                      {userProfile?.profileImage ? (
                        <img
                          src={userProfile.profileImage}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{getInitials(userProfile?.fullName)}</span>
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-bold text-white">
                        {userProfile?.fullName || "Member"}
                      </span>
                      <span className="text-xs text-gray-500">View Profile</span>
                    </div>
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (navigation.length + 2) * 0.1 }}
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (navigation.length + 1) * 0.1 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="px-4 py-3 rounded-xl text-center text-gray-300 font-bold border border-gray-800 hover:bg-white/5"
                  >
                    LOGIN
                  </button>
                  <button
                    onClick={() => handleNavigation("/signup")}
                    className="px-4 py-3 rounded-xl text-center bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold"
                  >
                    SIGN UP
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RegistrationForm
        isOpen={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
        type="community"
      />
    </header>

  );
};

export default Header;
