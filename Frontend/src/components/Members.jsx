import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ChatIcon from "@mui/icons-material/Chat";

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [isLoggedIn] = useState(
    sessionStorage.getItem("userLoggedIn") === "true",
  );

  const members = []; // Assuming members are fetched or defined elsewhere

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.bike.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterBy === "all") return matchesSearch;
    if (filterBy === "officers")
      return (
        matchesSearch &&
        ["President", "Treasurer", "Secretary", "Road Captain"].includes(member.role)
      );
    if (filterBy === "new")
      return matchesSearch && parseInt(member.joinDate) >= 2022;
    if (filterBy === "veterans")
      return matchesSearch && parseInt(member.joinDate) <= 2019;
    return matchesSearch;
  });

  const getBadgeColor = (badge) => {
    const colors = {
      Founder: "#3B82F6", Leadership: "#8B5CF6", "Safety Expert": "#10B981",
      "Long Distance": "#3B82F6", "Event Organizer": "#EC4899", "Adventure Rider": "#F59E0B",
      Photographer: "#D946EF", Mentor: "#6366F1", "New Rider": "#94A3B8",
      Enthusiast: "#14B8A6", "Charity Rider": "#F43F5E", "Classic Enthusiast": "#FB923C",
    };
    return colors[badge] || "#94A3B8";
  };

  return (
    <Box component="section" id="members" sx={{ position: "relative", pt: { xs: 8, md: 12 }, pb: 10, overflow: "hidden" }}>
      {/* Background Decor */}
      <Box sx={{ position: "absolute", bottom: '10%', right: '-5%', width: '30%', height: '30%', bgcolor: "radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)", zIndex: 0 }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2, py: 0.5, mb: 3, borderRadius: 'full', border: '1px solid', borderColor: 'rgba(59, 130, 246, 0.2)', bgcolor: 'rgba(59, 130, 246, 0.05)' }}>
            <Typography variant="caption" sx={{ color: "#8B5CF6", fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>
              The Pack
            </Typography>
          </Box>
          <Typography variant="h2" sx={{
            color: "text.primary",
            mb: 3,
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            fontWeight: 900,
            fontFamily: "'Audiowide', sans-serif"
          }}>
            Our <Box component="span" sx={{ color: "primary.main" }}>Brotherhood</Box>
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 720, mx: "auto", fontSize: { xs: "1rem", md: "1.15rem" }, lineHeight: 1.8 }}>
            Meet the riders who make our community strong. Connect, share experiences, and build lasting friendships.
          </Typography>
        </Box>

        {/* Search & Filter */}
        <Box sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 8,
          p: 1.5,
          borderRadius: 4,
          bgcolor: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(5px)'
        }}>
          <TextField
            placeholder="Search members by name, location, or bike..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: 'rgba(0,0,0,0.2)' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#3B82F6" }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 220 }}>
            <Select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              sx={{ borderRadius: 3, bgcolor: 'rgba(0,0,0,0.2)', fontWeight: 600 }}
            >
              <MenuItem value="all">All Members</MenuItem>
              <MenuItem value="officers">Club Officers</MenuItem>
              <MenuItem value="new">New Members</MenuItem>
              <MenuItem value="veterans">Veteran Members</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Member Cards */}
        <Grid container spacing={3}>
          {filteredMembers.map((member) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={member.id}>
              <Card sx={{
                p: 3,
                height: "100%",
                bgcolor: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: 4,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  bgcolor: "rgba(255, 255, 255, 0.04)",
                  borderColor: "rgba(59, 130, 246, 0.2)"
                }
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 3 }}>
                  <Avatar src={member.avatar} alt={member.name} sx={{
                    width: 64,
                    height: 64,
                    border: "2px solid",
                    borderColor: "primary.main",
                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)'
                  }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 800, letterSpacing: -0.5 }}>{member.name}</Typography>
                    <Typography variant="caption" sx={{ color: "#8B5CF6", fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{member.role}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8, mb: 3.5, px: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "text.secondary" }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: "#3B82F6" }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{member.location}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "text.secondary" }}>
                    <TwoWheelerIcon sx={{ fontSize: 18, color: "#8B5CF6" }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{member.bike}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "text.secondary" }}>
                    <EmojiEventsIcon sx={{ fontSize: 18, color: "#3B82F6" }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{member.ridesCompleted} Journeys</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 3.5 }}>
                  {member.badges.map((badge, index) => (
                    <Chip
                      key={index}
                      label={badge}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.05)',
                        border: `1px solid ${getBadgeColor(badge)}40`,
                        color: getBadgeColor(badge),
                        fontWeight: 800,
                        fontSize: "0.65rem",
                        textTransform: 'uppercase',
                        borderRadius: 1.5
                      }}
                    />
                  ))}
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ChatIcon />}
                  sx={{
                    borderRadius: 3,
                    py: 1.2,
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: 'text.primary',
                    fontWeight: 700,
                    "&:hover": { borderColor: 'primary.main', bgcolor: 'rgba(59, 130, 246, 0.05)' }
                  }}
                >
                  Connect
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Stats */}
        <Box sx={{
          mt: 10,
          p: { xs: 4, md: 6 },
          borderRadius: 8,
          bgcolor: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ position: "absolute", inset: 0, bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%)', zIndex: 0 }} />
          <Grid container spacing={4} sx={{ textAlign: "center", position: 'relative', zIndex: 1 }}>
            {[
              { value: "500+", label: "Riders", color: '#3B82F6' },
              { value: "1", label: "Nation", color: '#8B5CF6' },
              { value: "2.5k", label: "Rides", color: '#3B82F6' },
              { value: "20k", label: "Kilometers", color: '#8B5CF6' },
            ].map((stat, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i}>
                <Typography variant="h2" sx={{ color: stat.color, fontWeight: 900, mb: 1, letterSpacing: -2 }}>{stat.value}</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>{stat.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA */}
        {!isLoggedIn && (
          <Box sx={{ textAlign: "center", mt: 12 }}>
            <Typography variant="h4" sx={{ color: "text.primary", mb: 3, fontWeight: 900, fontFamily: "'Audiowide', sans-serif" }}>
              Ready to Join the Brotherhood?
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 5, maxWidth: 600, mx: 'auto' }}>
              Become part of a community that shares your passion for riding and adventure. Completely free, always and forever.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => window.dispatchEvent(new Event("open-registration"))}
              sx={{
                px: 6,
                py: 2,
                borderRadius: 4,
                fontSize: '1.1rem',
                fontWeight: 900,
                boxShadow: '0 4px 25px rgba(59, 130, 246, 0.3)',
                bgcolor: 'primary.main',
                "&:hover": { bgcolor: 'primary.dark' }
              }}
            >
              Start Your Membership
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Members;
