import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PushPinIcon from "@mui/icons-material/PushPin";
import ReplyIcon from "@mui/icons-material/Reply";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";

const Forum = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", count: 156 },
    { id: "general", name: "General Discussion", count: 45 },
    { id: "rides", name: "Ride Planning", count: 32 },
    { id: "maintenance", name: "Bike Maintenance", count: 28 },
    { id: "gear", name: "Gear Reviews", count: 21 },
    { id: "events", name: "Events", count: 18 },
    { id: "newbie", name: "New Rider Help", count: 12 },
  ];

  const forumPosts = [
    {
      id: 1,
      title: "Planning a Cross-Country Adventure - Route Suggestions?",
      author: "Rajesh Kumar",
      category: "rides",
      replies: 23,
      likes: 15,
      lastActivity: "2 hours ago",
      isPinned: true,
      preview:
        "Hey everyone! Planning a 3-week cross-country ride from Delhi to Mumbai. Looking for must-see stops and rider-friendly routes...",
    },
    {
      id: 2,
      title: "Best Winter Riding Gear - What Do You Recommend?",
      author: "Pradeep",
      category: "gear",
      replies: 18,
      likes: 12,
      lastActivity: "4 hours ago",
      preview:
        "Winter is coming and I need to upgrade my cold weather gear. What are your go-to brands for heated gloves and jackets?",
    },
  ];

  const filteredPosts =
    activeCategory === "all"
      ? forumPosts
      : forumPosts.filter((post) => post.category === activeCategory);

  const stats = [
    { label: "Total Topics", value: "247" },
    { label: "Total Posts", value: "280" },
    { label: "Active Members", value: "10" },
    { label: "Community Support", value: "24/7" },
  ];

  return (
    <Box
      component="section"
      id="forum"
      sx={{ position: "relative", pt: { xs: 8, md: 10 }, pb: 10, overflow: "hidden" }}
    >
      {/* Background Image */}
      <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Box
          component="img"
          src="https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt=""
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(15,18,20,0.7), rgba(15,18,20,0.92), rgba(15,18,20,0.98))",
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h2" sx={{
            fontWeight: 900,
            color: "text.primary",
            mb: 2,
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            fontFamily: "'Audiowide', sans-serif",
          }}>
            Community{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              Forum
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 700, mx: "auto" }}>
            Connect with fellow riders, share experiences, ask questions, and be part of our vibrant community discussions.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Card sx={{ position: "sticky", top: 80 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Categories
                </Typography>
                <List disablePadding>
                  {categories.map((category) => (
                    <ListItemButton
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      selected={activeCategory === category.id}
                      sx={{ borderRadius: 2, mb: 0.5, py: 1 }}
                    >
                      <ListItemText
                        primary={category.name}
                        primaryTypographyProps={{
                          fontSize: "0.8125rem",
                          fontWeight: activeCategory === category.id ? 700 : 400,
                        }}
                      />
                      <Chip
                        label={category.count}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: "0.7rem",
                          bgcolor: activeCategory === category.id ? "primary.main" : "action.hover",
                          color: activeCategory === category.id ? "white" : "text.secondary",
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                  sx={{ mt: 2 }}
                >
                  New Topic
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Posts */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { borderColor: "primary.main", transform: "translateY(-1px)" },
                  }}
                >
                  <CardContent sx={{ display: "flex", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "surface.containerHigh", width: 44, height: 44 }}>
                      <PersonIcon sx={{ color: "text.secondary" }} />
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        {post.isPinned && <PushPinIcon sx={{ fontSize: 16, color: "primary.main" }} />}
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.primary", lineHeight: 1.3 }}>
                          {post.title}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5, flexWrap: "wrap" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <PersonIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {post.author}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {post.lastActivity}
                          </Typography>
                        </Box>
                        <Chip
                          label={categories.find((c) => c.id === post.category)?.name}
                          size="small"
                          sx={{ height: 22, fontSize: "0.7rem" }}
                        />
                      </Box>

                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {post.preview}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", cursor: "pointer", "&:hover": { color: "primary.main" } }}>
                          <ReplyIcon sx={{ fontSize: 16 }} />
                          <Typography variant="caption">{post.replies} replies</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", cursor: "pointer", "&:hover": { color: "primary.main" } }}>
                          <ThumbUpIcon sx={{ fontSize: 16 }} />
                          <Typography variant="caption">{post.likes} likes</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Stats Bar */}
        <Card sx={{ mt: 8, bgcolor: "rgba(59, 130, 246, 0.06)", border: "1px solid rgba(59, 130, 246, 0.15)" }}>
          <CardContent>
            <Grid container spacing={3}>
              {stats.map((stat, i) => (
                <Grid size={{ xs: 6, md: 3 }} key={i} sx={{ textAlign: "center" }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {stat.label}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Forum;
