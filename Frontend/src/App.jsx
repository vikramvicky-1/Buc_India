import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Safety from "./components/Safety.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy load non-critical routes
import { lazy, Suspense } from "react";
const Gallery = lazy(() => import("./components/Gallery.jsx"));
const Members = lazy(() => import("./components/Members.jsx"));
const Forum = lazy(() => import("./components/Forum.jsx"));
const Events = lazy(() => import("./components/PublicHome/PublicHome.jsx"));
const AdminLogin = lazy(() => import("./components/AdminLogin/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./components/AdminDashboardNav/AdminDashboardNav.jsx"));
const PublicRegister = lazy(() => import("./components/PublicRegister/PublicRegister.jsx"));
const AdminProtectedRoute = lazy(() => import("./components/AdminProtectedRoute.jsx"));
const UserProtectedRoute = lazy(() => import("./components/UserProtectedRoute.jsx"));
const PublicRoute = lazy(() => import("./components/PublicRoute.jsx"));
const Profile = lazy(() => import("./components/Profile/Profile.jsx"));
const LoginForm = lazy(() => import("./components/LoginForm.jsx"));
const SignUpForm = lazy(() => import("./components/SignUpForm.jsx"));
const YourEvents = lazy(() => import("./components/YourEvents.jsx"));
const Clubs = lazy(() => import("./components/Clubs/Clubs.jsx"));
const ClubDetail = lazy(() => import("./components/Clubs/ClubDetail.jsx"));
const ClubCollaborate = lazy(() => import("./components/Clubs/ClubCollaborate.jsx"));
const CertificatePage = lazy(() => import("./components/CertificatePage.jsx"));
const Registration = lazy(() => import("./components/Registration.jsx"));

const Loading = () => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
    <CircularProgress />
  </Box>
);

const PublicLayout = () => (
  <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
    <Header />
    <Box component="main" sx={{ flexGrow: 1, pt: { xs: 7, sm: 8 } }}>
      <Outlet />
    </Box>
    <Footer />
  </Box>
);

const HomePage = () => (
  <div>
    <Hero />
    <Safety />
    <About />
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <ToastContainer position="top-center" autoClose={3000} theme="dark" />
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes with Header and Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<Events />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/members" element={<Members />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/clubs/collaborate" element={<ClubCollaborate />} />
              <Route path="/clubs/:slug" element={<ClubDetail />} />
              <Route path="/certificate" element={<CertificatePage />} />
              <Route
                path="/profile"
                element={
                  <UserProtectedRoute>
                    <Profile />
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/your-events"
                element={
                  <UserProtectedRoute>
                    <YourEvents />
                  </UserProtectedRoute>
                }
              />
            </Route>

            {/* Routes without Public Header/Footer */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUpForm />
                </PublicRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Box>
    </Router>
  );
}

export default App;
