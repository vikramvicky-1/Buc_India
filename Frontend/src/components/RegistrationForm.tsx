import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import * as XLSX from 'xlsx';
import { User, Mail, Phone, MapPin, Bike, Check, UserPlus, X } from 'lucide-react';

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'community' | 'event';
  eventTitle?: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ isOpen, onClose, type, eventTitle }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    bikeModel: '',
    bikeYear: '',
    ridingExperience: '',
    emergencyContact: '',
    emergencyPhone: '',
    gender: '',
    bloodGroup: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const exportToExcel = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${type === 'community' ? 'community' : 'event'}-registration-${timestamp}.xlsx`;

    const row = {
      Type: type,
      EventTitle: type === 'event' ? eventTitle ?? '' : '',
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Email: formData.email,
      Phone: formData.phone,
      Address: formData.address,
      City: formData.city,
      State: formData.state,
      BikeModel: formData.bikeModel,
      BikeYear: formData.bikeYear,
      RidingExperience: formData.ridingExperience,
      EmergencyContact: formData.emergencyContact,
      EmergencyPhone: formData.emergencyPhone,
      SubmittedAt: new Date().toLocaleString(),
    };

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([row]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    XLSX.writeFile(workbook, fileName);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatWhatsAppMessage = () => {
    const title = type === 'community' ? 'New Community Registration' : `Event Registration - ${eventTitle}`;
    return `*${title}*

*Personal Information:*
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}

*Address:*
${formData.address}
${formData.city}, ${formData.state}

*Motorcycle Information:*
Bike: ${formData.bikeModel} (${formData.bikeYear})
Riding Experience: ${formData.ridingExperience}

*Emergency Contact:*
Name: ${formData.emergencyContact}
Phone: ${formData.emergencyPhone}

Registration completed successfully!`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format message for WhatsApp
      const message = formatWhatsAppMessage();
      const whatsappUrl = `https://wa.me/918867718080?text=${encodeURIComponent(message)}`;
      
      // Simulate form processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Export details to Excel (downloads a file locally)
      exportToExcel();

      // Show success message
      setShowSuccess(true);
      
      // Open WhatsApp after a short delay
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          bikeModel: '',
          bikeYear: '',
          ridingExperience: '',
          emergencyContact: '',
          emergencyPhone: ''
        });
        setShowSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Registration error:', error);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = showSuccess ? (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full text-center border border-green-500">
        <div className="mb-6">
          <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            {type === 'community' ? 'Registration Successful!' : 'Event Registration Complete!'}
          </h3>
          <p className="text-gray-300">
            Your registration details have been saved to Excel and are being sent to WhatsApp.
            You will be redirected automatically.
          </p>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
      </div>
    </div>
  ) : (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center">
      <div className="bg-gray-900 w-full h-full max-w-none max-h-none rounded-none border-t border-gray-800 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/60 backdrop-blur">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <UserPlus className="h-6 w-6 text-orange-500 mr-2" />
            {type === 'community' ? 'Join Community' : `Register for ${eventTitle}`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-300 text-sm">
             {/* 📱 After completing registration, your details will be saved to an Excel sheet and sent to our WhatsApp for processing. */}
              </p>
            </div>

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
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                required
              >
                <option value="">Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                </select>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                required
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="nottosay">Prefer not to say</option>               
              </select>

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
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
              
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <MapPin className="h-5 w-5 text-orange-500 mr-2" />
              Address Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleInputChange}
                className="md:col-span-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
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
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>{type === 'community' ? 'Join Community' : 'Register for Event'}</span>
                </>
              )}
            </button>
          </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default RegistrationForm;