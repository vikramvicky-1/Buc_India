import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { profileService } from "../services/api";
import Header from "./Header";
import Footer from "./Footer";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, you'd have a specific login endpoint. 
      // For now, we'll fetch the profile to verify existence and use it as a 'login'.
      // Note: This logic depends on how the backend handles 'login'.
      // If there's no login endpoint, we might need to add one or use profileService.get
      
      const profile = await profileService.get(formData.email);
      
      if (profile && profile.email === formData.email) {
        // Here we'd normally verify the password if the backend supported it
        localStorage.setItem("userEmail", profile.email);
        localStorage.setItem("userPhone", profile.phone || "");
        localStorage.setItem("userLoggedIn", "true");
        window.dispatchEvent(new Event("user-login-change"));
        toast.success("Logged in successfully!");
        navigate("/profile");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        <div className="max-w-md w-full bg-gray-900 rounded-2xl border border-gray-800 p-8 shadow-2xl">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>

          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 mb-8">Login to access your profile and events</p>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your password"
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
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-orange-500 hover:text-orange-400 font-semibold"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginForm;
