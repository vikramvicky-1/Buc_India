import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import DashboardHome from "../DashboardHome/DashboardHome";
import EventManagement from "../EventManagement/EventManagement";
import ViewRegistrations from "../ViewRegistrations/ViewRegistrations";
import GalleryManagement from "../GalleryManagement.jsx";
import ClubManagement from "../ClubManagement/ClubManagement.jsx";
import { authService, profileService } from "../../services/api";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ImageIcon from "@mui/icons-material/Image";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import LogoutIcon from "@mui/icons-material/Logout";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
const logo = "/logo copy copy.jpg";

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 72;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const email = sessionStorage.getItem("adminEmail") || "admin@bucindia.com";
      const profile = await profileService.get(email);
      setAdminProfile(profile);
    } catch (error) {
      console.error("Failed to fetch admin profile", error);
    }
  };

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      sessionStorage.removeItem("buc_admin_authenticated");
      sessionStorage.removeItem("adminEmail");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      sessionStorage.removeItem("buc_admin_authenticated");
      navigate("/admin/login");
    }
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name.charAt(0).toUpperCase();
  };

  const navItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: <DashboardIcon />, end: true },
    { path: "/admin/events", name: "Events", icon: <EventIcon /> },
    { path: "/admin/registrations", name: "Registrations", icon: <AssignmentIcon /> },
    { path: "/admin/gallery", name: "Gallery", icon: <ImageIcon /> },
    { path: "/admin/clubs", name: "Clubs", icon: <TwoWheelerIcon /> },
  ];

  const drawerWidth = isMobile ? DRAWER_WIDTH : (isCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH);

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", py: 1 }}>
      {/* Logo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 2, mb: 1 }}>
        <Avatar src={logo} alt="BUC India Logo" sx={{ width: 40, height: 40 }} />
        {!isCollapsed && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>BUC_India</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.65rem" }}>Admin Panel</Typography>
          </Box>
        )}
        {!isMobile && (
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)} size="small" sx={{ ml: "auto" }}>
            <ChevronLeftIcon sx={{ transform: isCollapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mx: 1 }} />

      {/* Nav Items */}
      <List sx={{ flex: 1, py: 2 }}>
        {navItems.map((item) => {
          const isActive = item.end
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              end={item.end}
              selected={isActive}
              sx={{ justifyContent: isCollapsed ? "center" : "flex-start" }}
              title={isCollapsed ? item.name : ""}
            >
              <ListItemIcon sx={{
                minWidth: isCollapsed ? 0 : 40,
                color: isActive ? "primary.main" : "text.secondary",
                justifyContent: "center",
              }}>
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.name} primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: isActive ? 700 : 500 }} />}
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ mx: 1 }} />

      {/* Footer Links */}
      <Box sx={{ py: 1 }}>
        <ListItemButton
          component="a"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ justifyContent: isCollapsed ? "center" : "flex-start" }}
          title={isCollapsed ? "View Public Site" : ""}
        >
          <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 40, justifyContent: "center" }}>
            <OpenInNewIcon />
          </ListItemIcon>
          {!isCollapsed && <ListItemText primary="Public Site" primaryTypographyProps={{ fontSize: "0.875rem" }} />}
        </ListItemButton>
        <ListItemButton
          onClick={handleLogout}
          sx={{ justifyContent: isCollapsed ? "center" : "flex-start", color: "error.main" }}
          title={isCollapsed ? "Logout" : ""}
        >
          <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 40, color: "error.main", justifyContent: "center" }}>
            <LogoutIcon />
          </ListItemIcon>
          {!isCollapsed && <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 600 }} />}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
          PaperProps={{ sx: { width: DRAWER_WIDTH } }}
          ModalProps={{ keepMounted: true }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          PaperProps={{ sx: { width: drawerWidth, transition: "width 0.2s", overflow: "hidden" } }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", ml: { md: `${drawerWidth}px` }, transition: "margin-left 0.2s" }}>
        <AppBar position="sticky" sx={{ bgcolor: "background.paper" }}>
          <Toolbar>
            {isMobile && (
              <IconButton onClick={() => setIsMobileOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", flex: 1 }}>
              {navItems.find((item) =>
                item.end
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path),
              )?.name || "Admin"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", lineHeight: 1.2 }}>
                  {adminProfile?.fullName || "Admin"}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Administrator
                </Typography>
              </Box>
              <Avatar sx={{ width: 36, height: 36 }}>
                {adminProfile?.profileImage ? (
                  <Box component="img" src={adminProfile.profileImage} alt="Admin" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  getInitials(adminProfile?.fullName)
                )}
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
          <Routes>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="registrations" element={<ViewRegistrations />} />
            <Route path="gallery" element={<GalleryManagement />} />
            <Route path="clubs" element={<ClubManagement />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
