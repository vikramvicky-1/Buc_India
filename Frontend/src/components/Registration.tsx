import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Bike, Check, UserPlus } from 'lucide-react';

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bikeModel: '',
    bikeYear: '',
    ridingExperience: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const freeFeatures = [
    'Access to all group rides across India',
    'Monthly newsletter with riding tips',
    'Full forum access and community support',
    'Event notifications and priority registration',
    'Safety workshops and training sessions',
    'Roadside assistance network',
    'Free community patches and stickers',
    'Connect with riders in your city',
    'Participate in charity rides',
    'Access to riding routes and maps'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Registration successful! Welcome to Bikers Unity Calls community!');
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Community</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Become part of India's largest motorcycle community. Connect with riders across the country - completely free!
          </p>
        </div>

        {/* Free Registration Benefits */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-600/10 rounded-2xl p-8 border border-green-500/20 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              🎉 Completely <span className="text-green-400">FREE</span> Registration!
            </h3>
            <p className="text-xl text-gray-300">
              Join thousands of riders across India at no cost. Here's what you get:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freeFeatures.map((feature, index) => (
              <div key={index} className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-orange-500 mr-2" />
            Complete Your Free Registration
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="h-5 w-5 text-orange-500 mr-2" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MapPin className="h-5 w-5 text-orange-500 mr-2" />
                Address Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="md:col-span-2 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Motorcycle Information */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Bike className="h-5 w-5 text-orange-500 mr-2" />
                Motorcycle Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="bikeModel"
                  placeholder="Bike Make & Model"
                  value={formData.bikeModel}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  required
                />
                <input
                  type="number"
                  name="bikeYear"
                  placeholder="Year"
                  value={formData.bikeYear}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  required
                />
                <select
                  name="ridingExperience"
                  value={formData.ridingExperience}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  required
                >
                  <option value="">Riding Experience</option>
                  <option value="beginner">Beginner (0-2 years)</option>
                  <option value="intermediate">Intermediate (3-5 years)</option>
                  <option value="experienced">Experienced (6-10 years)</option>
                  <option value="expert">Expert (10+ years)</option>
                </select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Phone className="h-5 w-5 text-orange-500 mr-2" />
                Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="emergencyContact"
                  placeholder="Emergency Contact Name"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  required
                />
                <input
                  type="tel"
                  name="emergencyPhone"
                  placeholder="Emergency Contact Phone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <UserPlus className="h-5 w-5" />
                <span>Join Community - FREE!</span>
              </button>
              <p className="text-gray-400 mt-4 text-sm">
                🔒 Your information is secure and will never be shared. Join thousands of riders across India!
              </p>
            </div>
          </form>
        </div>

        {/* Community Stats */}
        <div className="mt-16 bg-gradient-to-r from-orange-500/10 to-red-600/10 rounded-2xl p-8 border border-orange-500/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-300">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">28</div>
              <div className="text-gray-300">States Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-300">Cities Connected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">FREE</div>
              <div className="text-gray-300">Always & Forever</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;