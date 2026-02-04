import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, UserPlus } from "lucide-react";
import { profileService } from "../services/api";
import Header from "./Header";
import Footer from "./Footer";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
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
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userPhone", formData.phone);
      localStorage.setItem("userLoggedIn", "true");

      // Dispatch event to notify other components
      window.dispatchEvent(new Event("user-login-change"));

      toast.success("Account created successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-12">
        <div className="max-w-md w-full bg-gray-900 rounded-2xl border border-gray-800 p-8 shadow-2xl">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>

          <h2 className="text-3xl font-bold text-white mb-2">Sign Up</h2>
          <p className="text-gray-400 mb-8">Create an account to join India's largest riding community</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-12 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-12 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-12 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-12 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                "Creating account..."
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Sign Up
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-orange-500 hover:text-orange-400 font-semibold"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpForm;
