import React, { useEffect, useState } from 'react';
import { Menu, X, Bike, Calendar, Users, Camera, MessageSquare, Shield } from 'lucide-react';
import RegistrationForm from './RegistrationForm';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    const handler = () => setShowRegistrationForm(true);
    window.addEventListener('open-registration', handler);
    return () => window.removeEventListener('open-registration', handler);
  }, []);

  const navigation = [
    { name: 'Home', href: '#home', icon: Bike },
    { name: 'Events', href: '#events', icon: Calendar },
    { name: 'Members', href: '#members', icon: Users },
    { name: 'Gallery', href: '#gallery', icon: Camera },
    { name: 'Forum', href: '#forum', icon: MessageSquare },
    { name: 'Safety', href: '#safety', icon: Shield },
  ];

  return (
    <header className="bg-black/95 backdrop-blur-sm fixed w-full z-50 border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img 
              src="/logo copy copy.jpg" 
              alt="Bikers Unity Calls Logo" 
              className="h-16 w-16 object-cover rounded-full"
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold text-white">BUC_India</h1>
              <p className="text-xs text-gray-400 leading-tight mt-1">Ride Together, Stand Together</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-300 hover:text-orange-500 transition-colors duration-200"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              type="button"
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1.5 rounded-md font-semibold text-sm hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
              style={{ lineHeight: 1.2 }}
              onClick={() => setShowRegistrationForm(true)}
            >
              Join Community
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 text-gray-300 hover:text-orange-500 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              ))}
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