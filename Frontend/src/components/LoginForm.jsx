import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LoginIcon from "@mui/icons-material/Login";
import { profileService } from "../services/api";
import Header from "./Header";
import Footer from "./Footer";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const profile = await profileService.get(formData.email);
      if (profile && profile.email === formData.email) {
        sessionStorage.setItem("userEmail", profile.email);
        sessionStorage.setItem("userPhone", profile.phone || "");
        sessionStorage.setItem("userLoggedIn", "true");
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
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 3, pt: { xs: 10, sm: 12 } }}>
        <Paper
          sx={{
            maxWidth: 440,
            width: "100%",
            p: 4,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{ color: "text.secondary", textTransform: "none", mb: 3, ml: -1 }}
          >
            Back to Home
          </Button>

          <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
            Login to access your profile and events
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              startIcon={isSubmitting ? null : <LoginIcon />}
              sx={{ py: 1.5, mt: 1 }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Don't have an account?{" "}
              <Button
                onClick={() => navigate("/signup")}
                sx={{ color: "primary.main", fontWeight: 600, textTransform: "none", p: 0, minWidth: "auto" }}
              >
                Sign Up
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </Box>
  );
};

export default LoginForm;
