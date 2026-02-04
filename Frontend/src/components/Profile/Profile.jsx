import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Bike,
  Edit2,
  Save,
  X,
  Shield,
  FileText,
  Loader2,
  Camera,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { profileService } from "../../services/api";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    dateOfBirth: "",
    bloodGroup: "",
    bikeModel: "",
    bikeRegistrationNumber: "",
    licenseNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    profileImage: "",
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Try to get email/phone from localStorage (set during registration)
      const userEmail = localStorage.getItem("userEmail");
      const userPhone = localStorage.getItem("userPhone");
      
      if (userEmail || userPhone) {
        const profile = await profileService.get(userEmail, userPhone);
        setProfileData(profile);
        setOriginalData(profile);
        if (profile.profileImage) {
          setProfileImagePreview(profile.profileImage);
        }
      } else {
        // If no user data, show empty form
        toast.info("Please complete your profile information");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // If profile doesn't exist, that's okay - user can create one
      if (error.response?.status !== 404) {
        toast.error("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      
      // Get email/phone from localStorage or form
      const userEmail = localStorage.getItem("userEmail") || profileData.email;
      const userPhone = localStorage.getItem("userPhone") || profileData.phone;

      if (!userEmail || !userPhone) {
        toast.error("Email and phone are required");
        setSaving(false);
        return;
      }

      formData.append("email", userEmail);
      formData.append("phone", userPhone);
      formData.append("fullName", profileData.fullName || "");
      formData.append("dateOfBirth", profileData.dateOfBirth || "");
      formData.append("bloodGroup", profileData.bloodGroup || "");
      formData.append("address", profileData.address || "");
      formData.append("city", profileData.city || "");
      formData.append("state", profileData.state || "");
      formData.append("pincode", profileData.pincode || "");
      formData.append("bikeModel", profileData.bikeModel || "");
      formData.append("bikeRegistrationNumber", profileData.bikeRegistrationNumber || "");
      formData.append("licenseNumber", profileData.licenseNumber || "");
      formData.append("emergencyContactName", profileData.emergencyContactName || "");
      formData.append("emergencyContactPhone", profileData.emergencyContactPhone || "");

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const updatedProfile = await profileService.createOrUpdate(formData);
      setProfileData(updatedProfile);
      setOriginalData(updatedProfile);
      setIsEditing(false);
      setProfileImage(null);
      
      // Update localStorage
      if (updatedProfile.email) localStorage.setItem("userEmail", updatedProfile.email);
      if (updatedProfile.phone) localStorage.setItem("userPhone", updatedProfile.phone);
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      const errorMessage = error.response?.data?.message || "Failed to save profile";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
    setProfileImage(null);
    setProfileImagePreview(originalData.profileImage || null);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl mb-6">
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-orange-500 to-red-600 p-1 shadow-lg">
                    {profileImagePreview ? (
                      <img
                        src={profileImagePreview}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                        <span className="text-3xl md:text-4xl font-bold text-white">
                          {getInitials(profileData.fullName)}
                        </span>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full cursor-pointer shadow-lg transition-all duration-200 transform hover:scale-110">
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl md:text-3xl font-semibold text-white mb-1">
                    {profileData.fullName || "Complete Your Profile"}
                  </h1>
                  <p className="text-gray-300 text-sm mb-3">
                    {profileData.email || "Add your information to get started"}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start text-xs">
                    {profileData.phone && (
                      <div className="flex items-center space-x-2 text-gray-300 bg-white/5 px-3 py-1.5 rounded-md">
                        <Phone className="w-3 h-3 text-orange-500" />
                        <span>{profileData.phone}</span>
                      </div>
                    )}
                    {profileData.city && (
                      <div className="flex items-center space-x-2 text-gray-300 bg-white/5 px-3 py-1.5 rounded-md">
                        <MapPin className="w-3 h-3 text-orange-500" />
                        <span>{profileData.city}, {profileData.state}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row sm:flex-col gap-2 sm:ml-4">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="space-y-6">
              {/* Personal Information Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="Full Name"
                    icon={User}
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    placeholder="Enter your full name"
                  />
                  <ProfileField
                    label="Email Address"
                    icon={Mail}
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    type="email"
                    placeholder="Enter your email"
                  />
                  <ProfileField
                    label="Mobile Number"
                    icon={Phone}
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    type="tel"
                    placeholder="Enter your mobile number"
                  />
                  <ProfileField
                    label="Date of Birth"
                    icon={Calendar}
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    type="date"
                  />
                  <ProfileField
                    label="Blood Group"
                    icon={Shield}
                    name="bloodGroup"
                    value={profileData.bloodGroup}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    type="select"
                    options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                  />
                </div>
              </div>

              {/* Address Information Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Address Information</h2>
                </div>
                <div className="space-y-6">
                  <ProfileField
                    label="Address"
                    icon={MapPin}
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    type="textarea"
                    placeholder="Enter your address"
                    fullWidth
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProfileField
                      label="City"
                      name="city"
                      value={profileData.city}
                      onChange={handleInputChange}
                      isEditing={isEditing}
                      placeholder="Enter your city"
                    />
                    <ProfileField
                      label="State"
                      name="state"
                      value={profileData.state}
                      onChange={handleInputChange}
                      isEditing={isEditing}
                      placeholder="Enter your state"
                    />
                    <ProfileField
                      label="Pincode"
                      name="pincode"
                      value={profileData.pincode}
                      onChange={handleInputChange}
                      isEditing={isEditing}
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
              </div>

              {/* Bike Information Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                    <Bike className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Bike Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="Bike Model"
                    icon={Bike}
                    name="bikeModel"
                    value={profileData.bikeModel}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    placeholder="Enter your bike model"
                  />
                  <ProfileField
                    label="Registration Number"
                    icon={FileText}
                    name="bikeRegistrationNumber"
                    value={profileData.bikeRegistrationNumber}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    placeholder="Enter bike registration number"
                  />
                  <ProfileField
                    label="License Number"
                    icon={FileText}
                    name="licenseNumber"
                    value={profileData.licenseNumber}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    placeholder="Enter license number"
                    fullWidth
                  />
                </div>
              </div>

              {/* Emergency Contact Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Emergency Contact</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="Contact Name"
                    icon={User}
                    name="emergencyContactName"
                    value={profileData.emergencyContactName}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    placeholder="Enter emergency contact name"
                  />
                  <ProfileField
                    label="Contact Phone"
                    icon={Phone}
                    name="emergencyContactPhone"
                    value={profileData.emergencyContactPhone}
                    onChange={handleInputChange}
                    isEditing={isEditing}
                    type="tel"
                    placeholder="Enter emergency contact phone"
                  />
                </div>
              </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Reusable Profile Field Component
const ProfileField = ({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  isEditing,
  type = "text",
  placeholder,
  options,
  fullWidth = false,
}) => {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className="flex items-center text-gray-300 mb-2 text-sm font-medium">
        {Icon && <Icon className="w-4 h-4 mr-2 text-orange-500" />}
        {label}
      </label>
      {isEditing ? (
        type === "textarea" ? (
          <textarea
            name={name}
            value={value || ""}
            onChange={onChange}
            rows="3"
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
            placeholder={placeholder}
          />
        ) : type === "select" ? (
          <select
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
          >
            <option value="">Select {label}</option>
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
            placeholder={placeholder}
          />
        )
      ) : (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white min-h-[44px] flex items-center">
          {value || <span className="text-gray-500">Not provided</span>}
        </div>
      )}
    </div>
  );
};

export default Profile;
