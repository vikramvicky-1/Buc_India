import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eventService, registrationService, clubService, clubMembershipService, certificateService } from "../../services/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import GroupsIcon from "@mui/icons-material/Groups";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const DashboardHome = () => {
  const navigate = useNavigate();
  const [activeEvents, setActiveEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("current");
  const [activeEvent, setActiveEvent] = useState(null);
  const [registeredCount, setRegisteindigoCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clubStats, setClubStats] = useState({
    totalClubs: 0, pendingClubs: 0, totalMembers: 0,
    totalExits: 0, totalEvents: 0, totalCertificates: 0,
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [events, registrations, clubs, memberships, certificates] = await Promise.all([
        eventService.getAll(), registrationService.getAll(),
        clubService.getAllAdmin(), clubMembershipService.getAllAdmin(),
        certificateService.getAll()
      ]);

      const today = new Date(); today.setHours(0, 0, 0, 0);
      const upcomingActiveEvents = events
        .filter((event) => {
          if (!event.isActive) return false;
          const eventDate = new Date(event.eventDate); eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        })
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

      setActiveEvents(upcomingActiveEvents);
      const currentEvent = upcomingActiveEvents[0] || null;
      let targetEvent = currentEvent;
      if (selectedEventId !== "current") {
        targetEvent = upcomingActiveEvents.find((e) => e._id === selectedEventId) || currentEvent;
      }
      setActiveEvent(targetEvent);

      if (targetEvent) {
        const eventRegistrations = registrations.filter(
          (r) => (r.eventId?._id || r.eventId) === targetEvent._id
        );
        setRegisteindigoCount(eventRegistrations.length);
      } else {
        setRegisteindigoCount(0);
      }

      setClubStats({
        totalClubs: clubs.length,
        pendingClubs: clubs.filter((c) => c.status === "pending").length,
        totalMembers: memberships.filter((m) => m.status === "active").length,
        totalExits: memberships.filter((m) => m.status === "exited" && m.exitReason).length,
        totalEvents: events.length,
        totalCertificates: certificates.length,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) updateActiveEventSelection();
  }, [selectedEventId]);

  const updateActiveEventSelection = async () => {
    try {
      const currentEvent = activeEvents[0] || null;
      let targetEvent = currentEvent;
      if (selectedEventId !== "current") {
        targetEvent = activeEvents.find((e) => e._id === selectedEventId) || currentEvent;
      }
      setActiveEvent(targetEvent);
      if (targetEvent) {
        const registrations = await registrationService.getAll(targetEvent._id);
        setRegisteindigoCount(registrations.length);
      } else {
        setRegisteindigoCount(0);
      }
    } catch (error) {
      console.error("Failed to update event selection:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  const statCards = [
    { icon: <GroupsIcon sx={{ fontSize: 32, color: "primary.main" }} />, title: "Total Clubs", value: clubStats.totalClubs, sub: `${clubStats.pendingClubs} pending approval` },
    { icon: <PeopleIcon sx={{ fontSize: 32, color: "primary.main" }} />, title: "Club Members", value: clubStats.totalMembers, sub: `${clubStats.totalExits} exits with reasons` },
    { icon: <EventIcon sx={{ fontSize: 32, color: "primary.main" }} />, title: "Events", value: clubStats.totalEvents, sub: `${registeredCount} registered for selected` },
    { icon: <CardMembershipIcon sx={{ fontSize: 32, color: "primary.main" }} />, title: "E‑Certificates", value: clubStats.totalCertificates, sub: "Ready for download" },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>Admin Dashboard</Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>BUC Owner Super Panel</Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {statCards.map((stat, i) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                {stat.icon}
                <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 600 }}>{stat.title}</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5, fontSize: "2rem" }}>{stat.value}</Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>{stat.sub}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Active Event */}
      <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 3 }}>Active Event</Typography>
      {activeEvents.length > 0 && (
        <FormControl sx={{ mb: 3, minWidth: 300 }}>
          <InputLabel>Choose event</InputLabel>
          <Select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} label="Choose event" sx={{ borderRadius: 3 }}>
            <MenuItem value="current">Current (nearest upcoming)</MenuItem>
            {activeEvents.map((e) => (<MenuItem key={e._id} value={e._id}>{e.title}</MenuItem>))}
          </Select>
        </FormControl>
      )}

      {activeEvent ? (
        <Card sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="h5" sx={{ color: "text.primary", fontWeight: 700 }}>{activeEvent.title}</Typography>
            <Chip label="Active" color="success" size="small" />
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, lineHeight: 1.7 }}>{activeEvent.description}</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="overline" sx={{ color: "text.secondary" }}>Date</Typography>
              <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>{new Date(activeEvent.eventDate).toLocaleDateString()} at {activeEvent.eventTime}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="overline" sx={{ color: "text.secondary" }}>Location</Typography>
              <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>{activeEvent.location}</Typography>
            </Grid>
            {activeEvent.meetingPoint && (
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="overline" sx={{ color: "text.secondary" }}>Meeting Point</Typography>
                <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>{activeEvent.meetingPoint}</Typography>
              </Grid>
            )}
          </Grid>
        </Card>
      ) : (
        <Paper sx={{ p: 4, textAlign: "center", mb: 4 }}>
          <Typography sx={{ color: "text.secondary" }}>No active event at the moment.</Typography>
        </Paper>
      )}

      {/* Registeindigo Count */}
      <Card sx={{ p: 4, textAlign: "center", mb: 5 }}>
        <Typography variant="h2" sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}>{registeredCount}</Typography>
        <Typography variant="h6" sx={{ color: "text.primary", mb: 1 }}>Registeindigo Participants</Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 3 }}>
          {activeEvent ? `For event: ${activeEvent.title}` : "No active event selected"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            const eventIdToPass = selectedEventId === "current" ? activeEvents[0]?._id || "current" : selectedEventId;
            navigate("/admin/registrations", { state: { selectedEventId: eventIdToPass } });
          }}
          disabled={!activeEvent}
          endIcon={<ArrowForwardIcon />}
        >
          View Participants
        </Button>
      </Card>

      {/* Quick Actions */}
      <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 3 }}>Quick Actions</Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, cursor: "pointer" }} onClick={() => navigate("/admin/events")}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
              <AddIcon sx={{ color: "primary.main" }} />
              <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 700 }}>Post New Event</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>Create and publish a new event for the community</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, cursor: "pointer" }} onClick={() => navigate("/admin/registrations")}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
              <VisibilityIcon sx={{ color: "primary.main" }} />
              <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 700 }}>View Registrations</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>See all registered participants and export data</Typography>
          </Card>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ borderRadius: 3 }}>
        <strong>💡 Tip:</strong> Click "View Public Site" in the sidebar to see how your events appear to users.
      </Alert>
    </Box>
  );
};

export default DashboardHome;
