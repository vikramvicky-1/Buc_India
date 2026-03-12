import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlagIcon from "@mui/icons-material/Flag";
import ShareIcon from "@mui/icons-material/Share";
import GroupsIcon from "@mui/icons-material/Groups";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import {
  eventService,
  registrationService,
  profileService,
} from "../../services/api";
import { toast } from "react-toastify";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  loading,
}) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
    PaperProps={{
      sx: { borderRadius: 1.25 },
    }}
  >
    <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
    <DialogContent>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {message}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
      <Button variant="outlined" onClick={onClose} sx={{ flex: 1 }}>
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={onConfirm}
        disabled={loading}
        sx={{ flex: 1 }}
      >
        {loading ? <CircularProgress size={22} color="inherit" /> : confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

const PublicHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [pastLimit, setPastLimit] = useState(6);
  const [loading, setLoading] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadEvents();
    const interval = setInterval(() => loadEvents(), 10000);
    return () => clearInterval(interval);
  }, []);

  const isProfileComplete = (profile) => {
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
      "dateOfBirth",
      "bloodGroup",
      "bikeModel",
      "bikeRegistrationNumber",
      "licenseNumber",
      "emergencyContactName",
      "emergencyContactPhone",
      "profileImage",
      "licenseImage",
    ];
    return requiredFields.every(
      (field) => profile[field] && profile[field].toString().trim() !== "",
    );
  };

  const handleRegisterClick = async (event) => {
    const isLoggedIn = sessionStorage.getItem("userLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.info("Please Sign Up / Login first to register for events");
      navigate("/signup");
      return;
    }
    setLoading(true);
    try {
      const userEmail = sessionStorage.getItem("userEmail");
      const userPhone = sessionStorage.getItem("userPhone");
      const profile = await profileService.get(userEmail, userPhone);
      if (isProfileComplete(profile)) {
        setSelectedEvent(event);
        setShowConfirmModal(true);
      } else {
        setShowCompleteProfileModal(true);
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      setShowCompleteProfileModal(true);
    } finally {
      setLoading(false);
    }
  };

  const confirmRegistration = async () => {
    if (!selectedEvent) return;
    setRegistrationLoading(true);
    try {
      const userEmail = sessionStorage.getItem("userEmail");
      const userPhone = sessionStorage.getItem("userPhone");
      const profile = await profileService.get(userEmail, userPhone);

      const data = new FormData();
      Object.keys(profile).forEach((key) => {
        if (
          ![
            "_id",
            "__v",
            "createdAt",
            "updatedAt",
            "profileImage",
            "profileImagePublicId",
          ].includes(key)
        ) {
          data.append(key, profile[key]);
        }
      });
      data.append("eventId", selectedEvent._id);

      await registrationService.create(data);
      toast.success(`Successfully registered for ${selectedEvent.title}!`);
      setShowConfirmModal(false);
      loadEvents();
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setRegistrationLoading(false);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const allEvents = await eventService.getAll();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = allEvents
        .filter((event) => {
          if (!event.isActive) return false;
          const eventDate = new Date(event.eventDate);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        })
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

      const past = allEvents
        .filter((event) => {
          if (!event.isActive) return false;
          const eventDate = new Date(event.eventDate);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate < today;
        })
        .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error("Failed to load events", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (e, eventId) => {
    e.stopPropagation();
    const registrationLink = `${window.location.origin}/event-register/${eventId}`;
    navigator.clipboard
      .writeText(registrationLink)
      .then(() => toast.success("Registration link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      return `${h12}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  const displayedEvents =
    activeTab === "upcoming" ? upcomingEvents : pastEvents.slice(0, pastLimit);

  return (
    <Box
      component="section"
      id="events"
      sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.default" }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: "text.primary",
              mb: 1,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontFamily: "'Audiowide', sans-serif",
            }}
          >
            {activeTab === "upcoming" ? "Upcoming" : "Past"}{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              Events
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", maxWidth: 600, mx: "auto", mb: 4 }}
          >
            Festival-style rides, breakfast meets and long hauls curated by BUC
            and partner clubs across India.
          </Typography>

          <ToggleButtonGroup
            value={activeTab}
            exclusive
            onChange={(e, val) => val && setActiveTab(val)}
            sx={{
              bgcolor: "surface.container",
              borderRadius: "999px",
              border: "1px solid",
              borderColor: "divider",
              "& .MuiToggleButton-root": {
                border: "none",
                borderRadius: "999px !important",
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "text.secondary",
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                },
              },
            }}
          >
            <ToggleButton value="upcoming">Upcoming</ToggleButton>
            <ToggleButton value="past">Past Events</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        ) : displayedEvents.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {displayedEvents.map((event) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={event._id}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 1.25,
                    }}
                  >
                    {/* Image */}
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={event.banner}
                        alt={event.title}
                        sx={{
                          objectFit: "cover",
                          transition: "transform 0.5s",
                          "&:hover": { transform: "scale(1.05)" },
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                        }}
                      />
                      <Chip
                        label={new Date(event.eventDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                        size="small"
                        color="primary"
                        sx={{
                          position: "absolute",
                          bottom: 12,
                          left: 12,
                          fontWeight: 700,
                          fontSize: "0.7rem",
                        }}
                      />
                      <Button
                        onClick={(e) => handleShare(e, event._id)}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          minWidth: 36,
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          bgcolor: "rgba(255,255,255,0.9)",
                          color: "primary.main",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "white",
                          },
                        }}
                      >
                        <ShareIcon fontSize="small" />
                      </Button>
                    </Box>

                    {/* Content */}
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 1, fontSize: "1.05rem" }}
                      >
                        {event.title}
                      </Typography>

                      <Chip
                        icon={
                          <GroupsIcon sx={{ fontSize: "14px !important" }} />
                        }
                        label={`${event.registrationCount || 0} riders in`}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{
                          alignSelf: "flex-start",
                          mb: 2,
                          fontSize: "0.7rem",
                        }}
                      />

                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {event.description}
                      </Typography>

                      <Box
                        sx={{
                          mt: "auto",
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LocationOnIcon
                            sx={{ fontSize: 16, color: "primary.main" }}
                          />
                          <Typography variant="caption" noWrap>
                            {event.location}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <FlagIcon
                            sx={{ fontSize: 16, color: "primary.main" }}
                          />
                          <Typography variant="caption" noWrap>
                            {event.meetingPoint}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <AccessTimeIcon
                            sx={{ fontSize: 16, color: "primary.main" }}
                          />
                          <Typography variant="caption">
                            {formatTime(event.eventTime)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    {/* Action */}
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      {activeTab === "upcoming" ? (
                        <Button
                          variant="contained"
                          fullWidth
                          endIcon={<ChevronRightIcon />}
                          onClick={() => handleRegisterClick(event)}
                        >
                          Register Now
                        </Button>
                      ) : (
                        <Button variant="outlined" fullWidth disabled>
                          Registration Closed
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {activeTab === "past" && pastEvents.length > pastLimit && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <Button
                  variant="outlined"
                  onClick={() => setPastLimit((prev) => prev + 6)}
                >
                  Load More Events
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Card sx={{ textAlign: "center", py: 10, borderRadius: 1.25 }}>
            <EventBusyIcon
              sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h6" sx={{ color: "text.secondary" }}>
              No {activeTab} events found.
            </Typography>
          </Card>
        )}

        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmRegistration}
          title="Confirm Registration"
          message={`Are you sure you want to register for ${selectedEvent?.title}? Your profile details will be used for registration.`}
          confirmText="Confirm"
          loading={registrationLoading}
        />

        <ConfirmationModal
          isOpen={showCompleteProfileModal}
          onClose={() => setShowCompleteProfileModal(false)}
          onConfirm={() => navigate("/profile")}
          title="Complete Your Profile"
          message="To register for events, you must fully update your profile including personal information, bike details, and emergency contacts."
          confirmText="Update Profile"
        />
      </Container>
    </Box>
  );
};

export default PublicHome;
