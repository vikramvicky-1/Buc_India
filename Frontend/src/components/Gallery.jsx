import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { galleryService } from "../services/api";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [playingVideos, setPlayingVideos] = useState(new Set());
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "all", name: "All Media" },
    { id: "rides", name: "Group Rides" },
    { id: "events", name: "Events" },
    { id: "bikes", name: "Member Bikes" },
    { id: "rallies", name: "Rallies" },
  ];

  const autoGalleryItems = useMemo(() => {
    const modules = import.meta.glob(
      "../assets/gallery/**/*.{png,jpg,jpeg,webp,mp4,webm,mov}",
      { eager: true },
    );
    const items = Object.entries(modules).map(([path, mod], index) => {
      const parts = path.split("/");
      const filename = parts[parts.length - 1];
      const title = filename.replace(/[-_]/g, " ").replace(/\.[^.]+$/, "");
      const isVideo = /\.(mp4|webm|mov)$/i.test(filename);
      const normalizedPath = path.toLowerCase();
      const lowerFile = filename.toLowerCase();
      let category = "rides";
      if (normalizedPath.includes("/rallies/")) category = "rallies";
      else if (normalizedPath.includes("/rides/") || normalizedPath.includes("/group-rides/")) category = "rides";
      else if (lowerFile.includes("rally")) category = "rallies";
      else if (lowerFile.includes("ride")) category = "rides";
      return {
        id: 1000 + index,
        type: isVideo ? "video" : "image",
        src: mod.default,
        title,
        category,
        likes: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 30),
        author: "BUC Team",
      };
    });
    return items;
  }, []);

  const baseMediaItems = useMemo(
    () =>
      galleryItems.map((item) => ({
        id: item._id,
        type: "image",
        src: item.imageUrl,
        title: item.eventName,
        category: item.category || "all",
        author: "BUC Admin",
        eventDate: item.eventDate,
        likes: 0,
        comments: 0,
        fromBackend: true,
      })),
    [galleryItems],
  );

  const mediaItems = useMemo(() => {
    const combined = [...baseMediaItems, ...autoGalleryItems];
    return combined.sort((a, b) => {
      const dateA = a.eventDate ? new Date(a.eventDate) : new Date(0);
      const dateB = b.eventDate ? new Date(b.eventDate) : new Date(0);
      return dateB - dateA;
    });
  }, [baseMediaItems, autoGalleryItems]);

  const filteredMedia =
    activeCategory === "all"
      ? mediaItems
      : mediaItems.filter((item) => item.category === activeCategory);

  const INITIAL_COUNT = 6;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const displayedMedia = filteredMedia.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [activeCategory]);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      setLoading(true);
      try {
        const data = await galleryService.getAll();
        setGalleryItems(data);
      } catch (err) {
        console.warn("Gallery server unavailable; showing local gallery assets only.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryItems();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    try { return new Date(date).toLocaleDateString(); } catch { return date; }
  };

  const getCategoryLabel = (cat) => {
    const found = categories.find(c => c.id === cat);
    return found ? found.name : cat;
  };

  return (
    <Box component="section" id="gallery" sx={{ position: "relative", pt: { xs: 8, md: 12 }, pb: 12, bgcolor: "#020617", overflow: "hidden" }}>
      {/* Background Decor */}
      <Box sx={{ position: "absolute", bottom: '0%', right: '0%', width: '50%', height: '50%', bgcolor: "radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)", zIndex: 0 }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2, py: 0.5, mb: 3, borderRadius: 'full', border: '1px solid', borderColor: 'rgba(59, 130, 246, 0.2)', bgcolor: 'rgba(59, 130, 246, 0.05)' }}>
            <Typography variant="caption" sx={{ color: "#8B5CF6", fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>
              Moments on the Road
            </Typography>
          </Box>
          <Typography variant="h2" sx={{
            color: "text.primary",
            mb: 2,
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            fontWeight: 900,
            fontFamily: "'Audiowide', sans-serif"
          }}>
            Our <Box component="span" sx={{ color: "primary.main" }}>Gallery</Box>
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 700, mx: "auto", mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}>
            Relive the memories and share your adventures with the community.
            From epic rides to unforgettable events.
          </Typography>

          {/* Category Filter */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
            <ToggleButtonGroup
              value={activeCategory}
              exclusive
              onChange={(_, val) => val && setActiveCategory(val)}
              sx={{
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 1.5,
                "& .MuiToggleButton-root": {
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  bgcolor: 'rgba(255,255,255,0.02)',
                  borderRadius: "12px !important",
                  px: 3,
                  py: 1,
                  textTransform: "uppercase",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  letterSpacing: 1,
                  color: "text.secondary",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                    "&:hover": { bgcolor: "primary.dark" },
                  },
                },
              }}
            >
              {categories.map((category) => (
                <ToggleButton key={category.id} value={category.id}>
                  {category.name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Media Grid */}
        <Grid container spacing={3}>
          {displayedMedia.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  overflow: "hidden",
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: 3, /* M3 soft rounded corners */
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "scale(1.02)",
                    borderColor: "rgba(0, 0, 0, 0.3)",
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                  }
                }}
                onClick={() => setSelectedMedia(item)}
              >
                <Box sx={{ position: "relative" }}>
                  {item.type === "video" ? (
                    <CardMedia
                      component="video"
                      src={item.src}
                      sx={{ aspectRatio: "1 / 1", width: "100%", height: "auto", objectFit: "cover" }}
                      preload="metadata"
                      muted
                      onClick={(e) => {
                        e.stopPropagation();
                        const video = e.currentTarget;
                        if (video.paused) {
                          video.play().then(() => setPlayingVideos((prev) => new Set(prev).add(item.id)));
                        } else {
                          video.pause();
                          setPlayingVideos((prev) => { const s = new Set(prev); s.delete(item.id); return s; });
                        }
                      }}
                      onEnded={() => setPlayingVideos((prev) => { const s = new Set(prev); s.delete(item.id); return s; })}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      src={item.src}
                      alt={item.title}
                      sx={{ aspectRatio: "1 / 1", width: "100%", height: "auto", objectFit: "cover", filter: 'brightness(0.9)', transition: "all 0.5s", "&:hover": { filter: 'brightness(1.1)' } }}
                    />
                  )}
                  {/* Overlay on Hover UI Elements */}
                  <Box className="media-overlay" sx={{
                    position: 'absolute',
                    inset: 0,
                    bg: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 3,
                    opacity: 0.8,
                    transition: 'opacity 0.3s'
                  }}>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 800, mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: "rgba(255,255,255,0.7)" }}>
                        <FavoriteBorderIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{item.likes}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: "rgba(255,255,255,0.7)" }}>
                        <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{item.comments}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {item.type === "video" && (
                    <Box sx={{ position: "absolute", top: 15, right: 15, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(0,0,0,0.5)", backdropFilter: 'blur(5px)', borderRadius: 'full', width: 40, height: 40 }}>
                      {playingVideos.has(item.id) ? <PauseIcon sx={{ fontSize: 20, color: 'white' }} /> : <PlayArrowIcon sx={{ fontSize: 20, color: 'white' }} />}
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Load More */}
        {visibleCount < filteredMedia.length && (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button variant="outlined" onClick={() => setVisibleCount(filteredMedia.length)} sx={{ px: 4 }}>
              Load More Media
            </Button>
          </Box>
        )}

        {/* Lightbox Dialog */}
        <Dialog
          open={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          maxWidth="md"
          fullWidth
        >
          {selectedMedia && (
            <>
              <Box sx={{ position: "relative" }}>
                {selectedMedia.type === "video" ? (
                  <video src={selectedMedia.src} style={{ width: "100%", maxHeight: 400, objectFit: "cover" }} controls autoPlay muted />
                ) : (
                  <Box component="img" src={selectedMedia.src} alt={selectedMedia.title} sx={{ width: "100%", maxHeight: 400, objectFit: "cover" }} />
                )}
                <IconButton onClick={() => setSelectedMedia(null)} sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(0,0,0,0.5)", color: "white" }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <DialogContent>
                <Typography variant="h5" sx={{ color: "text.primary", mb: 1, fontWeight: 700 }}>
                  {selectedMedia.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                  by {selectedMedia.author}
                </Typography>
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Button startIcon={<FavoriteBorderIcon />} size="small" sx={{ color: "text.secondary" }}>
                    {selectedMedia.likes} likes
                  </Button>
                  <Button startIcon={<ChatBubbleOutlineIcon />} size="small" sx={{ color: "text.secondary" }}>
                    {selectedMedia.comments} comments
                  </Button>
                  <Button startIcon={<ShareIcon />} size="small" sx={{ color: "text.secondary" }}>
                    Share
                  </Button>
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default Gallery;
