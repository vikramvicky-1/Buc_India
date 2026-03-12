import React, { useState, useEffect, useRef } from "react";
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
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import ShieldIcon from "@mui/icons-material/Shield";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CircleIcon from "@mui/icons-material/Circle";
import groupRidingImg from "../assets/gallery/WhatsApp Image 2025-08-09 at 21.22.15_0472380c.jpg";

const Safety = () => {
  const [pledgeText, setPledgeText] = useState("");
  const pledgeRef = useRef(null);
  const [pledgeStarted, setPledgeStarted] = useState(false);
  const fullPledge =
    "As members of All Bikers Unity Community, we pledge to prioritize safety in all our riding activities. We commit to wearing proper protective gear, following traffic laws, riding within our abilities, and looking out for our fellow riders. Together, we ensure that every ride ends with everyone returning home safely.";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pledgeStarted) {
          setPledgeStarted(true);
        }
      },
      { threshold: 0.3 },
    );
    if (pledgeRef.current) observer.observe(pledgeRef.current);
    return () => observer.disconnect();
  }, [pledgeStarted]);

  useEffect(() => {
    if (pledgeStarted) {
      let index = 0;
      const speed = 15;
      const animate = () => {
        if (index <= fullPledge.length) {
          setPledgeText(fullPledge.substring(0, index));
          index++;
          setTimeout(animate, speed);
        }
      };
      animate();
    }
  }, [pledgeStarted]);

  const safetyTips = [
    {
      icon: <ShieldIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Protective Gear",
      description:
        "Always wear DOT-approved helmet, protective jacket, gloves, and boots.",
      tips: [
        "Helmet should fit snugly without pressure points",
        "Wear bright colors for better visibility",
        "Replace gear after any accident",
        "Check gear condition regularly",
      ],
    },
    {
      icon: <WarningAmberIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Road Awareness",
      description: "Stay alert and anticipate potential hazards on the road.",
      tips: [
        "Maintain safe following distance",
        "Check blind spots frequently",
        "Use turn signals early and clearly",
        "Avoid riding in bad weather when possible",
      ],
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Pre-Ride Inspection",
      description: "Perform thorough bike inspection before every ride.",
      tips: [
        "Check tire pressure and tread",
        "Test brakes and lights",
        "Verify fluid levels",
        "Inspect chain and sprockets",
      ],
    },
  ];

  const emergencyContacts = [
    {
      service: "Child Abuse & Safety",
      number: "1098",
      description: "Dedicated helpline for children in distress",
    },
    {
      service: "Emergency Services",
      number: "112",
      description: "For immediate life-threatening emergencies",
    },
    {
      service: "Community Emergency Line",
      number: "88677 18080",
      description: "Community member assistance and roadside help",
    },
    {
      service: "Roadside Assistance",
      number: "1033-HELP",
      description: "Motorcycle towing and breakdown assistance",
    },
  ];

  const safetyResources = [
    {
      title: "Motorcycle Safety Foundation (MSF)",
      description: "Comprehensive riding courses and safety resources",
      link: "#",
    },
    {
      title: "Advanced Rider Training",
      description: "Improve your skills with professional instruction",
      link: "#",
    },
    {
      title: "Weather Riding Guide",
      description: "Tips for riding safely in various weather conditions",
      link: "#",
    },
    {
      title: "Group Riding Etiquette",
      description: "Best practices for safe group riding",
      link: "#",
    },
  ];

  const groupSafetyTips = [
    "Attend pre-ride briefings and follow designated routes",
    "Maintain proper formation and spacing",
    "Use hand signals and communicate with other riders",
    "Never ride beyond your skill level or comfort zone",
  ];

  return (
    <Box
      component="section"
      id="safety"
      sx={{ position: "relative", py: { xs: 8, md: 12 }, overflow: "hidden" }}
    >
      {/* Background Decor */}
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          right: "-10%",
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
                color: "#3B82F6",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              Safety First
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              color: "text.primary",
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 900,
              fontFamily: "'Audiowide', sans-serif",
            }}
          >
            Ride{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              Safe
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
            }}
          >
            Learn essential riding tips, emergency procedures, and best
            practices to ensure every ride is a safe one.
          </Typography>
        </Box>

        {/* Safety Tips Cards */}
        <Grid container spacing={3} sx={{ mb: 12 }}>
          {safetyTips.map((tip, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  p: 1,
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: 1.25,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    bgcolor: "rgba(255, 255, 255, 0.04)",
                    borderColor:
                      index === 0
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
                        index === 0
                          ? "rgba(59, 130, 246, 0.1)"
                          : "rgba(59, 130, 246, 0.1)",
                      border: "1px solid",
                      borderColor:
                        index === 0
                          ? "rgba(59, 130, 246, 0.2)"
                          : "rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    {tip.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: "text.primary", mb: 2, fontWeight: 800 }}
                  >
                    {tip.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 3, lineHeight: 1.8 }}
                  >
                    {tip.description}
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {tip.tips.map((item, tipIndex) => (
                      <Box
                        key={tipIndex}
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Box
                          sx={{
                            width: 4,
                            height: 4,
                            borderRadius: "full",
                            bgcolor: index === 0 ? "#3B82F6" : "#8B5CF6",
                          }}
                        />
                        <Typography
                          sx={{
                            color: "text.secondary",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                          }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Emergency Contacts */}
        <Box
          sx={{
            p: { xs: 4, md: 8 },
            mb: 12,
            borderRadius: 2.5,
            bgcolor: "rgba(239, 68, 68, 0.02)",
            border: "1px solid rgba(239, 68, 68, 0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 6,
              justifyContent: "center",
            }}
          >
            <PhoneIcon sx={{ fontSize: 32, color: "#EF4444" }} />
            <Typography
              variant="h4"
              sx={{
                color: "text.primary",
                fontWeight: 900,
                fontFamily: "'Audiowide', sans-serif",
              }}
            >
              Emergency Contacts
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {emergencyContacts.map((contact, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Box
                  sx={{
                    p: 3,
                    textAlign: "center",
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    borderRadius: 1.25,
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      letterSpacing: 1,
                    }}
                  >
                    {contact.service}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#EF4444",
                      fontWeight: 900,
                      fontSize: "1.4rem",
                      my: 1.5,
                      letterSpacing: -0.5,
                    }}
                  >
                    {contact.number}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    {contact.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Safety Resources */}
        <Box sx={{ mb: 12 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
            <MenuBookIcon sx={{ fontSize: 28, color: "#8B5CF6" }} />
            <Typography
              variant="h4"
              sx={{
                color: "text.primary",
                fontWeight: 800,
                fontFamily: "'Audiowide', sans-serif",
              }}
            >
              Safety Resources
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {safetyResources.map((resource, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Card
                  sx={{
                    p: 3,
                    cursor: "pointer",
                    bgcolor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: 1.25,
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "rgba(255, 255, 255, 0.04)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "text.primary", mb: 1.5, fontWeight: 700 }}
                  >
                    {resource.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 3, lineHeight: 1.7 }}
                  >
                    {resource.description}
                  </Typography>
                  <Link
                    href={resource.link}
                    underline="none"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      color: "primary.main",
                      fontWeight: 800,
                      fontSize: "0.875rem",
                    }}
                  >
                    EXPLORE RESOURCE <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </Link>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Group Riding Safety */}
        <Box
          sx={{
            p: { xs: 4, md: 8 },
            mb: 12,
            borderRadius: 2.5,
            bgcolor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Grid container spacing={5} alignItems="center">
            <Grid size={{ xs: 12, lg: 7 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <PeopleIcon sx={{ fontSize: 28, color: "primary.main" }} />
                <Typography
                  variant="h4"
                  sx={{
                    color: "text.primary",
                    fontWeight: 900,
                    fontFamily: "'Audiowide', sans-serif",
                  }}
                >
                  Group Riding
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 4, lineHeight: 1.8 }}
              >
                Riding in a group requires additional safety considerations.
                Follow these guidelines to ensure everyone's safety during club
                rides.
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {groupSafetyTips.map((item, i) => (
                  <Box
                    key={i}
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Box
                      sx={{
                        minWidth: 24,
                        height: 24,
                        borderRadius: "full",
                        bgcolor: "rgba(16, 185, 129, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircleIcon
                        sx={{ color: "#10B981", fontSize: 16 }}
                      />
                    </Box>
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
                ))}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Box
                component="img"
                src={groupRidingImg}
                alt="Group of motorcycles riding safely"
                sx={{
                  width: "100%",
                  borderRadius: 1.25,
                  border: "1px solid rgba(255,255,255,0.1)",
                  filter: "grayscale(0.5) contrast(1.2)",
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Safety Pledge */}
        <Paper
          ref={pledgeRef}
          sx={{
            p: { xs: 6, md: 10 },
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            borderRadius: 2.5,
            bgcolor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
          }}
        >
          <AssignmentTurnedInIcon
            sx={{
              position: "absolute",
              top: -20,
              right: -20,
              fontSize: 180,
              color: "primary.main",
              opacity: 0.03,
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 6,
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              <AssignmentTurnedInIcon
                sx={{ fontSize: 24, color: "primary.main" }}
              />
            </Box>
            <Typography
              variant="h4"
              sx={{
                color: "text.primary",
                fontWeight: 900,
                fontFamily: "'Audiowide', sans-serif",
              }}
            >
              Our Safety Pledge
            </Typography>
          </Box>
          <Box sx={{ maxWidth: 850, mx: "auto" }}>
            <Typography
              variant="h5"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: { xs: "1.2rem", md: "1.35rem" },
                minHeight: { xs: 200, md: 120 },
              }}
            >
              "{pledgeText}"
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: 3,
                  height: 28,
                  bgcolor: "primary.main",
                  ml: 1,
                  verticalAlign: "middle",
                  animation: "pulse 1s infinite",
                }}
              />
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Safety;
