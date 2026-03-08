import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
const logo = "/logo copy copy.jpg";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        await authService.checkAuth();
        navigate("/admin/dashboard");
      } catch (err) {
        // Not authenticated, stay on login page
      }
    };
    checkExistingAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login(username, password);
      sessionStorage.setItem("buc_admin_authenticated", "true");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: { xs: 3, sm: 5 }, textAlign: "center" }}>
          <Avatar src={logo} alt="BUC India Logo" sx={{ width: 72, height: 72, mx: "auto", mb: 2, border: "2px solid", borderColor: "primary.main" }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
            Admin Login
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
            Administrative Dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" tabIndex={-1}>
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.5 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </Box>

          <Typography variant="caption" sx={{ color: "text.disabled", mt: 4, display: "block" }}>
            Access restricted to authorized personnel only.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
