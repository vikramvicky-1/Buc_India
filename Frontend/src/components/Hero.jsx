import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import ShieldIcon from "@mui/icons-material/Shield";
import { useNavigate } from "react-router-dom";
import SplitText from "./animations/SplitText";
import heroVideo from "../assets/gallery/WhatsApp Video 2025-08-09 at 21.21.40_0c2cbf8a.mp4";

const AnimatedNumber = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();
          const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            if (ref.current) {
              ref.current.textContent = Math.floor(eased * value) + suffix;
            }
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, suffix, hasAnimated]);

  return <span ref={ref}>0{suffix}</span>;
};

const Hero = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("userLoggedIn") === "true",
  );

  useEffect(() => {
    const loginHandler = () =>
      setIsLoggedIn(sessionStorage.getItem("userLoggedIn") === "true");
    window.addEventListener("user-login-change", loginHandler);
    return () => window.removeEventListener("user-login-change", loginHandler);
  }, []);

  const scrollToEvents = () => navigate("/events");
  const handleJoinClick = () => {
    if (!isLoggedIn) navigate("/signup");
  };

  const stats = [
    {
      icon: <PeopleIcon sx={{ fontSize: 32, color: "#3B82F6" }} />,
      value: 500,
      suffix: "+",
      label: "Members",
    },
    {
      icon: <EventIcon sx={{ fontSize: 32, color: "#8B5CF6" }} />,
      value: 10,
      suffix: "+",
      label: "Yearly Events",
    },
    {
      icon: <ShieldIcon sx={{ fontSize: 32, color: "#3B82F6" }} />,
      value: 4,
      suffix: "+",
      label: "Years Strong",
    },
  ];

  return (
    <Box
      component="section"
      id="home"
      sx={{
        position: "relative",
        minHeight: { xs: "auto", md: "100vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        bgcolor: "#020617", // Modern deep slate
        mt: -10, // Pull up to meet header if needed
        pt: { xs: 12, md: 0 },
      }}
    >
      {/* Video Background */}
      <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <video
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Sleek Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(2, 6, 23, 0.4) 0%, rgba(2, 6, 23, 0.8) 100%)",
            zIndex: 1,
          }}
        />
      </Box>

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          py: { xs: 8, md: 10 },
        }}
      >
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 3,
              py: 0.8,
              mb: 4,
              borderRadius: "999px",
              border: "1px solid",
              borderColor: "#d1d5db",
              bgcolor: "rgba(156, 163, 175, 0.1)",
              backdropFilter: "blur(5px)",
              boxShadow:
                "0 0 12px rgba(209, 213, 219, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#d1d5db",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 3,
                textShadow: "0px 1px 3px rgba(0,0,0,0.8)",
              }}
            >
              India's Premier Riding Community
            </Typography>
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: {
                xs: "2.5rem",
                sm: "3.5rem",
                md: "4.5rem",
                lg: "5.5rem",
              },
              fontWeight: 900,
              color: "text.primary",
              mb: 3,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              fontFamily: '\"Audiowide\", sans-serif',
              textShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
            }}
          >
            <SplitText
              text="Bikers Unity Calls"
              delay={40}
              duration={1}
              ease="power4.out"
              splitType="chars"
              from={{ opacity: 0, scale: 0.8, y: 50 }}
              to={{ opacity: 1, scale: 1, y: 0 }}
              textAlign="center"
              tag="span"
            />
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
              color: "text.secondary",
              mb: 5,
              maxWidth: 800,
              mx: "auto",
              lineHeight: 1.8,
              fontWeight: 400,
              opacity: 0.9,
            }}
          >
            Where passion meets the pavement. Join a community of riders across
            India who share the love for the open road, adventure, and the
            unbreakable bonds forged on two wheels.
          </Typography>

          {/* CTAs */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2.5,
              justifyContent: "center",
              alignItems: "center",
              mb: 8,
            }}
          >
            {!isLoggedIn && (
              <Button
                variant="contained"
                size="large"
                onClick={handleJoinClick}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 5,
                  py: 1.8,
                  fontSize: "1.05rem",
                  width: { xs: "100%", sm: "auto" },
                  borderRadius: 1.25,
                  fontWeight: 900,
                  boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)",
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                Join the Brotherhood
              </Button>
            )}
            <Button
              variant="outlined"
              size="large"
              onClick={scrollToEvents}
              sx={{
                px: 5,
                py: 1.8,
                fontSize: "1.05rem",
                width: { xs: "100%", sm: "auto" },
                borderRadius: 2.5,
                fontWeight: 900,
                border: "2px solid rgba(255,255,255,0.1)",
                color: "text.primary",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  border: "2px solid #3B82F6",
                  bgcolor: "rgba(59, 130, 246, 0.05)",
                },
              }}
            >
              Upcoming Rides
            </Button>
          </Box>
        </Box>

        {/* Stats Cards - New Layout */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-12">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-12 text-center lg:grid-cols-3">
            {[
              { label: "Members", value: "500", suffix: "+" },
              { label: "Events This Year", value: "10", suffix: "+" },
              { label: "Years Strong", value: "4", suffix: "+" },
            ].map((stat, index) => (
              <div
                key={index}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-base/7 text-gray-400 font-medium tracking-wide uppercase">
                  {stat.label}
                </dt>
                <dd className="order-first text-4xl font-semibold tracking-tight text-white sm:text-6xl font-['Audiowide']">
                  <AnimatedNumber
                    value={parseInt(stat.value)}
                    suffix={stat.suffix}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Box>
  );
};

export default Hero;
