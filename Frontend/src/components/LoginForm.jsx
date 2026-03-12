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
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LoginIcon from "@mui/icons-material/Login";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PinIcon from "@mui/icons-material/Pin";
import { profileService, otpService, userAuthService } from "../services/api";
import Header from "./Header";
import Footer from "./Footer";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password State
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await profileService.login(
        formData.email,
        formData.password,
      );

      sessionStorage.setItem("userEmail", user.email);
      sessionStorage.setItem("userPhone", user.phone || "");
      sessionStorage.setItem("userLoggedIn", "true");
      window.dispatchEvent(new Event("user-login-change"));

      toast.success("Logged in successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendResetOtp = async () => {
    if (!forgotPasswordEmail) {
      toast.error("Please enter your email");
      return;
    }
    setIsSendingOtp(true);
    try {
      await otpService.send(forgotPasswordEmail, "forgot_password");
      setForgotPasswordStep(2);
      setCountdown(60);
      toast.success("Reset OTP sent to your email!");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Failed to send reset OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (!forgotPasswordOtp || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }
    setIsResetting(true);
    try {
      await userAuthService.resetPassword(
        forgotPasswordEmail,
        forgotPasswordOtp,
        newPassword,
      );
      toast.success(
        "Password reset successfully! Please login with your new password.",
      );
      setForgotPasswordOpen(false);
      setForgotPasswordStep(1);
      setForgotPasswordEmail("");
      setForgotPasswordOtp("");
      setNewPassword("");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsResetting(false);
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
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
            Login to access your profile and events
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box>
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
              <Box sx={{ textAlign: "right", mt: 1 }}>
                <Button
                  onClick={() => setForgotPasswordOpen(true)}
                  sx={{
                    color: "primary.main",
                    textTransform: "none",
                    p: 0,
                    minWidth: "auto",
                    fontSize: "0.8125rem",
                  }}
                >
                  Forgot Password?
                </Button>
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              startIcon={isSubmitting ? null : <LoginIcon />}
              sx={{ py: 1.5, mt: 1, borderRadius: 1.25 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Don't have an account?{" "}
              <Button
                onClick={() => navigate("/signup")}
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  textTransform: "none",
                  p: 0,
                  minWidth: "auto",
                }}
              >
                Sign Up
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
      <Footer />

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={() =>
          !isResetting && !isSendingOtp && setForgotPasswordOpen(false)
        }
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 1.25 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Reset Password</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            {forgotPasswordStep === 1
              ? "Enter your registered email address and we'll send you an OTP to reset your password."
              : `Enter the OTP sent to ${forgotPasswordEmail} and your new password.`}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {forgotPasswordStep === 1 ? (
              <>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSendResetOtp}
                  disabled={isSendingOtp}
                  sx={{ py: 1.25, borderRadius: 1.25 }}
                >
                  {isSendingOtp ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </>
            ) : (
              <>
                <TextField
                  label="Enter OTP"
                  type="text"
                  fullWidth
                  value={forgotPasswordOtp}
                  onChange={(e) => setForgotPasswordOtp(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PinIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setForgotPasswordStep(1)}
                    disabled={isResetting}
                    sx={{ py: 1.25, borderRadius: 1.25 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleResetPassword}
                    disabled={isResetting}
                    sx={{ py: 1.25, borderRadius: 1.25 }}
                  >
                    {isResetting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Reset"
                    )}
                  </Button>
                </Box>
                {countdown > 0 && (
                  <Typography
                    variant="caption"
                    sx={{ textAlign: "center", color: "text.secondary" }}
                  >
                    Resend OTP in {countdown}s
                  </Typography>
                )}
                {countdown === 0 && (
                  <Button
                    onClick={handleSendResetOtp}
                    sx={{ textTransform: "none", fontSize: "0.75rem" }}
                  >
                    Resend OTP
                  </Button>
                )}
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LoginForm;
