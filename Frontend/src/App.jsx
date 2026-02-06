import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Registration from "./components/Registration.jsx";
import Gallery from "./components/Gallery.jsx";
import Members from "./components/Members.jsx";
import Safety from "./components/Safety.jsx";
import Forum from "./components/Forum.jsx";
import Footer from "./components/Footer.jsx";
import AdminLogin from "./components/AdminLogin/AdminLogin.jsx";
import AdminDashboard from "./components/AdminDashboardNav/AdminDashboardNav.jsx";
import Events from "./components/PublicHome/PublicHome.jsx";
import PublicRegister from "./components/PublicRegister/PublicRegister.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import UserProtectedRoute from "./components/UserProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import Profile from "./components/Profile/Profile.jsx";
import LoginForm from "./components/LoginForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";
import YourEvents from "./components/YourEvents.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow pt-20">
      <Outlet />
    </main>
    <Footer />
  </div>
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
      <div className="min-h-screen bg-black">
        <ToastContainer position="top-center" autoClose={3000} theme="dark" />
        <Routes>
          {/* Public Routes with Header and Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/members" element={<Members />} />
            <Route path="/forum" element={<Forum />} />
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
      </div>
    </Router>
  );
}

export default App;
