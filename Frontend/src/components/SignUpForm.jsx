import React, { useState, useEffect } from "react";
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
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PinIcon from "@mui/icons-material/Pin";
import { profileService, otpService } from "../services/api";
import Header from "./Header";
import Footer from "./Footer";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first");
      return;
    }
    setIsSendingOtp(true);
    try {
      await otpService.send(formData.email, "signup");
      setOtpSent(true);
      setCountdown(60);
      toast.success("OTP sent to your email!");
    } catch (error) {
      console.error("OTP send error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    if (!otpSent) {
      toast.error("Please request and enter the OTP sent to your email");
      return;
    }
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);
      data.append("otp", formData.otp);

      await profileService.signup(data);

      sessionStorage.setItem("userEmail", formData.email);
      sessionStorage.setItem("userPhone", formData.phone);
      sessionStorage.setItem("userLoggedIn", "true");
      window.dispatchEvent(new Event("user-login-change"));

      toast.success("Account created successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          pt: { xs: 10, sm: 12 },
          pb: 6,
        }}
      >
        <Paper
          sx={{
            maxWidth: 440,
            width: "100%",
            p: 4,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.25,
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              mb: 2,
              ml: -1,
            }}
          >
            Back to Home
          </Button>

          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
          >
            Create Account
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
            Join India's largest riding community
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
              <TextField
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
                disabled={otpSent && countdown > 0}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="outlined"
                onClick={handleSendOtp}
                disabled={isSendingOtp || countdown > 0}
                sx={{ height: 56, minWidth: 100, borderRadius: 1.25 }}
              >
                {isSendingOtp ? (
                  <CircularProgress size={20} />
                ) : countdown > 0 ? (
                  `${countdown}s`
                ) : otpSent ? (
                  "Resend"
                ) : (
                  "Send OTP"
                )}
              </Button>
            </Box>

            {otpSent && (
              <TextField
                label="Enter OTP"
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                required
                fullWidth
                helperText="Enter the 6-digit code sent to your email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PinIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <TextField
              label="Mobile Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              fullWidth
              helperText={
                formData.phone && formData.phone.length !== 10
                  ? "Must be 10 digits"
                  : ""
              }
              error={formData.phone.length > 0 && formData.phone.length !== 10}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: "text.secondary" }} />
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
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
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
              startIcon={isSubmitting ? null : <PersonAddIcon />}
              sx={{ py: 1.5, mt: 1, borderRadius: 1.25 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Already have an account?{" "}
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  textTransform: "none",
                  p: 0,
                  minWidth: "auto",
                }}
              >
                Login
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </Box>
  );
};

export default SignUpForm;
