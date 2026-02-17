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
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bike,
} from "lucide-react";
const logo = "/logo copy copy.jpg";
import "./AdminDashboardNav.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      // For admin, we might use a specific email or just fetch the profile of the logged in user
      // Assuming admin also has a profile in the same system
      const email =
        sessionStorage.getItem("adminEmail") || "admin@bucindia.com";
      const profile = await profileService.get(email);
      setAdminProfile(profile);
    } catch (error) {
      console.error("Failed to fetch admin profile", error);
    }
  };

  // Close mobile sidebar on route change
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
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    { path: "/admin/events", name: "Events", icon: Calendar },
    {
      path: "/admin/registrations",
      name: "Registrations",
      icon: ClipboardList,
    },
    { path: "/admin/gallery", name: "Gallery", icon: ImageIcon },
    { path: "/admin/clubs", name: "Clubs", icon: Bike },
  ];

  return (
    <div
      className={`admin-layout ${isCollapsed ? "sidebar-collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}
    >
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={logo} alt="BUC India Logo" className="buc-logo" />
            {!isCollapsed && (
              <div className="brand-text">
                <h2>BUC_India</h2>
                <p>Admin Panel</p>
              </div>
            )}
          </div>
          <button
            className="collapse-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
          <button
            className="mobile-close sm-only"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              title={isCollapsed ? item.name : ""}
            >
              <item.icon size={22} className="nav-icon" />
              {!isCollapsed && <span className="nav-text">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            title={isCollapsed ? "View Public Site" : ""}
          >
            <ExternalLink size={22} className="nav-icon" />
            {!isCollapsed && <span className="nav-text">Public Site</span>}
          </a>
          <button
            onClick={handleLogout}
            className="footer-link logout-btn"
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut size={22} className="nav-icon" />
            {!isCollapsed && <span className="nav-text">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-top-bar">
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="top-bar-title">
            {navItems.find((item) =>
              item.end
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path),
            )?.name || "Admin"}
          </div>
          <div className="top-bar-user">
            <div className="admin-profile-info md-only">
              <span className="admin-name">{adminProfile?.fullName || "Admin"}</span>
              <span className="admin-role">Administrator</span>
            </div>
            <div className="admin-avatar">
              {adminProfile?.profileImage ? (
                <img src={adminProfile.profileImage} alt="Admin" />
              ) : (
                <span>{getInitials(adminProfile?.fullName)}</span>
              )}
            </div>
          </div>
        </header>

        <main className="admin-content-view">
          <Routes>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="registrations" element={<ViewRegistrations />} />
            <Route path="gallery" element={<GalleryManagement />} />
            <Route path="clubs" element={<ClubManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
