import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PinIcon from "@mui/icons-material/Pin";
import { profileService, otpService } from "../services/api";

const RegistrationForm = ({
  isOpen,
  onClose,
  type = "community",
  eventTitle,
  eventId,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
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
      setError("Please enter your email first");
      return;
    }
    setError("");
    setIsSendingOtp(true);
    try {
      await otpService.send(formData.email, "signup");
      setOtpSent(true);
      setCountdown(60);
      toast.success("OTP sent to your email!");
    } catch (err) {
      console.error("OTP send error:", err);
      const errorMessage = err.response?.data?.message || "Failed to send OTP.";
      setError(errorMessage);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.otp
    ) {
      setError("Please fill all fields and enter OTP.");
      return;
    }

    if (formData.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    if (!otpSent) {
      setError("Please verify your email with OTP first");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("eventId", type === "community" ? "community" : eventId);
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);
      data.append("otp", formData.otp);

      await profileService.signup(data);

      if (formData.email) sessionStorage.setItem("userEmail", formData.email);
      if (formData.phone) sessionStorage.setItem("userPhone", formData.phone);
      sessionStorage.setItem("userLoggedIn", "true");

      window.dispatchEvent(new Event("user-login-change"));

      setShowSuccess(true);
      toast.success(
        type === "community"
          ? "Registration successful!"
          : "Event Registration Complete!",
      );

      setTimeout(() => {
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          otp: "",
        });
        setShowSuccess(false);
        setIsSubmitting(false);
        onClose();
        if (type === "community") {
          navigate("/profile");
        }
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={isSubmitting || showSuccess ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1.25,
          border: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {showSuccess ? (
        <Box sx={{ p: 5, textAlign: "center" }}>
          <CheckCircleOutlineIcon
            sx={{ fontSize: 80, color: "success.main", mb: 2 }}
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
          >
            {type === "community"
              ? "Registration Successful!"
              : "Event Registration Complete!"}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
            Welcome to the community! You can now access your profile and
            register for events.
          </Typography>
          <CircularProgress size={32} color="success" />
        </Box>
      ) : (
        <>
          <DialogTitle
            sx={{
              m: 0,
              p: 3,
              pb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PersonAddIcon sx={{ color: "primary.main", fontSize: 28 }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {type === "community"
                  ? "Join Community"
                  : `Register for ${eventTitle}`}
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={onClose}
              disabled={isSubmitting}
              sx={{ color: "text.secondary" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
              {type === "community"
                ? "Create an account to join India's largest riding community and get access to exclusive events."
                : "Enter your details to register for this event. You will also be joined to the community."}
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
            >
              {error && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "error.main",
                    textAlign: "center",
                    p: 1,
                    borderRadius: 1.25,
                    bgcolor: "rgba(244, 67, 54, 0.1)",
                  }}
                >
                  {error}
                </Typography>
              )}

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

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Already a member?{" "}
                <Button
                  onClick={() => {
                    onClose();
                    navigate("/login");
                  }}
                  disabled={isSubmitting}
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
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default RegistrationForm;
