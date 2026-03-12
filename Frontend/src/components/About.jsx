import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RouteIcon from "@mui/icons-material/Route";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CircleIcon from "@mui/icons-material/Circle";
import joinFamilyImg from "../assets/gallery/WhatsApp Image 2025-08-11 at 20.21.15_0db94979.jpg";

const About = () => {
  const values = [
    {
      icon: <FavoriteIcon sx={{ fontSize: 32, color: "#3B82F6" }} />,
      title: "Brotherhood",
      description:
        "We believe in the unbreakable bonds formed between riders across India who share the same passion.",
    },
    {
      icon: <RouteIcon sx={{ fontSize: 32, color: "#8B5CF6" }} />,
      title: "Adventure",
      description:
        "Every ride is an opportunity to explore new horizons and create unforgettable memories.",
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 32, color: "#3B82F6" }} />,
      title: "Community",
      description:
        "Supporting each other on and off the road, building lasting friendships and connections across India.",
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 32, color: "#8B5CF6" }} />,
      title: "Excellence",
      description:
        "Promoting safe riding practices and maintaining the highest standards in everything we do.",
    },
  ];

  const highlights = [
    "Weekly group rides and touring adventures",
    "Safety training and motorcycle maintenance workshops",
    "Charity rides and community service projects",
    "Annual rallies and motorcycle shows",
  ];

  return (
    <Box
      component="section"
      id="about"
      sx={{
        position: "relative",
        py: { xs: 8, md: 16 },
        overflow: "hidden",
        backgroundColor: "#020617",
      }}
    >
      {/* Background Decor */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "40%",
          height: "40%",
          bgcolor:
            "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "40%",
          height: "40%",
          bgcolor:
            "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 2,
              py: 0.5,
              mb: 3,
              borderRadius: "full",
              border: "1px solid",
              borderColor: "rgba(59, 130, 246, 0.2)",
              bgcolor: "rgba(59, 130, 246, 0.05)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#8B5CF6",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              Our Ride
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              color: "text.primary",
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 900,
              letterSpacing: -1,
              fontFamily: "'Audiowide', sans-serif",
            }}
          >
            Our{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              Mission
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 720,
              mx: "auto",
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              lineHeight: 1.8,
              fontWeight: 500,
            }}
          >
            Founded in 2025, Bikers Unity Calls has grown from a small group of
            motorcycle enthusiasts to a thriving all-India community of riders.
          </Typography>
        </Box>

        {/* Values Grid */}
        <Grid container spacing={3} sx={{ mb: 12 }}>
          {values.map((value, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  p: 1,
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    bgcolor: "rgba(255, 255, 255, 0.04)",
                    borderColor:
                      index % 2 === 0
                        ? "rgba(59, 130, 246, 0.3)"
                        : "rgba(59, 130, 246, 0.3)",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      mb: 3,
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        index % 2 === 0
                          ? "rgba(59, 130, 246, 0.1)"
                          : "rgba(59, 130, 246, 0.1)",
                      border: "1px solid",
                      borderColor:
                        index % 2 === 0
                          ? "rgba(59, 130, 246, 0.2)"
                          : "rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    {value.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "text.primary", mb: 2, fontWeight: 800 }}
                  >
                    {value.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.8,
                      fontSize: "0.9rem",
                    }}
                  >
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Join Our Family */}
        <Box
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: 1.25,
            bgcolor: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              bgcolor: "rgba(59, 130, 246, 0.03)",
              borderRadius: "full",
              filter: "blur(50px)",
            }}
          />

          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, lg: 7 }}>
              <Typography
                variant="h3"
                sx={{
                  color: "text.primary",
                  mb: 3,
                  fontWeight: 900,
                  fontFamily: "'Audiowide', sans-serif",
                }}
              >
                Join Our Family
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  mb: 5,
                  lineHeight: 1.8,
                  fontSize: "1.1rem",
                }}
              >
                Whether you're a seasoned rider or just starting, you'll find a
                welcoming community here. We bring together riders from all
                corners of India to share the freedom of the road.
              </Typography>
              <Grid container spacing={2}>
                {highlights.map((item, i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "full",
                          bgcolor: "primary.main",
                          boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                        }}
                      />
                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: -1,
                    bg: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                    borderRadius: 6,
                    opacity: 0.2,
                    filter: "blur(20px)",
                  }}
                />
                <Box
                  component="img"
                  src={joinFamilyImg}
                  alt="Group of bikers"
                  sx={{
                    width: "100%",
                    borderRadius: 5,
                    position: "relative",
                    zIndex: 1,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
