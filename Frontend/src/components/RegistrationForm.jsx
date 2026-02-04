import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { registrationService, profileService } from "../services/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bike,
  Check,
  UserPlus,
  X,
  CreditCard,
  Image as ImageIcon,
  ShieldCheck,
  Stethoscope,
  Eye,
  EyeOff,
} from "lucide-react";

const RegistrationForm = ({ isOpen, onClose, type, eventTitle, eventId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const maxDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split("T")[0];
  }, []);

  const exportToExcel = () => {
    if (type !== "community") return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `community-registration-${timestamp}.xlsx`;

    const row = {
      Name: formData.fullName,
      Email: formData.email,
      Phone: formData.phone,
      SubmittedAt: new Date().toLocaleString(),
    };

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([row]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, fileName);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "licenseProof") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const formatWhatsAppMessage = () => {
    if (type !== "community") return "";
    return `*New Community Registration*

*Personal Information:*
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}

Registration completed successfully!`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("eventId", "community");
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);

      await profileService.createOrUpdate(data);

      // Store user email and phone for profile access
      if (formData.email) localStorage.setItem("userEmail", formData.email);
      if (formData.phone) localStorage.setItem("userPhone", formData.phone);
      localStorage.setItem("userLoggedIn", "true");

      // Dispatch event to notify other components (like Header)
      window.dispatchEvent(new Event("user-login-change"));

      setShowSuccess(true);
      toast.success("Login successful!");

      setTimeout(() => {
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          password: "",
        });
        setShowSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
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
            {type === "community"
              ? "Login Successful!"
              : "Event Registration Complete!"}
          </h3>
          <p className="text-gray-300">
            Welcome to the community! You can now access your profile and register for events.
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
            {type === "community"
              ? "Sign Up"
              : `Register for ${eventTitle}`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <User className="h-5 w-5 text-orange-500 mr-2" />
                  Sign Up
                </h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Mobile Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                    required
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center text-gray-400 text-sm">
                Already a member?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate("/login");
                  }}
                  className="text-orange-500 hover:text-orange-400 font-semibold"
                >
                  Login
                </button>
              </div>

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
                      <span>Sign Up</span>
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
