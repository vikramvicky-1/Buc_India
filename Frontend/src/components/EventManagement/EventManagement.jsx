import React, { useState, useEffect } from "react";
import { eventService, registrationService } from "../../services/api";
import TimePicker from "../EventPicker/TimePicker";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import Collapse from "@mui/material/Collapse";
import AddIcon from "@mui/icons-material/Add";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedIcon from "@mui/icons-material/Verified";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [filteredEvents, setFilteindigoEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [formData, setFormData] = useState({
    title: "", description: "", eventDate: "", eventTime: "",
    location: "", meetingPoint: "", isActive: true, certificateEnabled: false,
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { loadEvents(); }, []);
  useEffect(() => { filterEventsFn(); }, [events, filterName, filterDate, activeTab]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const [eventsData, registrationsData] = await Promise.all([
        eventService.getAll(), registrationService.getAll()
      ]);
      setEvents(eventsData);
      setRegistrations(registrationsData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const getRegistrationCount = (eventId) => {
    return registrations.filter(reg =>
      (typeof reg.eventId === 'object' ? reg.eventId?._id : reg.eventId) === eventId
    ).length;
  };

  const handleShare = (eventId) => {
    const registrationLink = `${window.location.origin}/event-register/${eventId}`;
    navigator.clipboard.writeText(registrationLink).then(() => {
      toast.success("Registration link copied to clipboard!");
    }).catch(() => { toast.error("Failed to copy link"); });
  };

  const filterEventsFn = () => {
    let filtered = [...events];
    const now = new Date(); now.setHours(0, 0, 0, 0);
    filtered = filtered.filter((event) => {
      const eventDate = new Date(event.eventDate); eventDate.setHours(0, 0, 0, 0);
      return activeTab === "upcoming" ? eventDate >= now : eventDate < now;
    });
    if (filterName.trim()) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(filterName.toLowerCase()),
      );
    }
    if (filterDate) {
      filtered = filtered.filter((event) => {
        const d = new Date(event.eventDate).toISOString().split('T')[0];
        return d === filterDate;
      });
    }
    setFilteindigoEvents(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setBannerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setBannerPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingEvent && !bannerFile) { toast.error("Event banner is mandatory"); return; }
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (bannerFile) data.append('banner', bannerFile);
    setSubmitLoading(true);
    try {
      if (editingEvent) {
        await eventService.update(editingEvent._id, data);
        toast.success("Event updated successfully");
      } else {
        await eventService.create(data);
        toast.success("Event created successfully");
      }
      resetForm(); loadEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally { setSubmitLoading(false); }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", eventDate: "", eventTime: "", location: "", meetingPoint: "", isActive: true, certificateEnabled: false });
    setBannerFile(null); setBannerPreview(null); setEditingEvent(null); setShowForm(false);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || "", description: event.description || "",
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : "",
      eventTime: event.eventTime || "", location: event.location || "",
      meetingPoint: event.meetingPoint || "",
      isActive: event.isActive !== undefined ? event.isActive : true,
      certificateEnabled: event.certificateEnabled !== undefined ? event.certificateEnabled : false,
    });
    setBannerPreview(event.banner);
    setShowForm(true);
  };

  const handleDelete = (eventId) => { setEventToDelete(eventId); setShowDeleteConfirm(true); };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    setDeleting(true);
    try {
      await eventService.delete(eventToDelete);
      toast.success("Event deleted successfully");
      loadEvents(); setShowDeleteConfirm(false); setEventToDelete(null);
    } catch (error) { toast.error("Failed to delete event"); }
    finally { setDeleting(false); }
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>Event Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { resetForm(); setShowForm(true); }} disabled={loading || submitLoading}>
          Post New Event
        </Button>
      </Box>

      {/* Event Form */}
      <Collapse in={showForm}>
        <Paper sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            {editingEvent ? "Edit Event" : "Create New Event"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Event Title" name="title" value={formData.title} onChange={handleInputChange} required />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Event Date" name="eventDate" type="date" value={formData.eventDate} onChange={handleInputChange} required InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ "& input": { width: "100%", p: "16.5px 14px", borderRadius: 3, border: "1px solid rgba(255,255,255,0.23)", bgcolor: "transparent", color: "text.primary", fontSize: "1rem", "&:focus": { outline: "none", borderColor: "primary.main" } } }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", mb: 0.5, display: "block" }}>Event Time *</Typography>
                  <TimePicker name="eventTime" value={formData.eventTime} onChange={handleInputChange} />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Location" name="location" value={formData.location} onChange={handleInputChange} required />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Meeting Point" name="meetingPoint" value={formData.meetingPoint} onChange={handleInputChange} required />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button variant="outlined" component="label" sx={{ borderStyle: "dashed", py: 2 }}>
                  {editingEvent ? "Change Event Banner" : "Upload Event Banner *"}
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </Button>
                {bannerPreview && (
                  <Box component="img" src={bannerPreview} alt="Preview" sx={{ width: "100%", height: 128, objectFit: "cover", borderRadius: 3, mt: 2, border: "1px solid", borderColor: "divider" }} />
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Event Description" name="description" value={formData.description} onChange={handleInputChange} required multiline rows={4} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel control={<Switch checked={formData.isActive} onChange={handleInputChange} name="isActive" color="primary" />} label={formData.isActive ? "Visible (Public)" : "Hidden (Draft)"} />
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", ml: 5 }}>
                  {formData.isActive ? "This event is currently live and visible on the public website." : "This event is hidden from the public."}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel control={<Switch checked={formData.certificateEnabled} onChange={handleInputChange} name="certificateEnabled" color="primary" />} label={formData.certificateEnabled ? "E‑Certificate Enabled" : "E‑Certificate Disabled"} />
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", ml: 5 }}>
                  When enabled, riders can download a participation certificate.
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Button type="submit" variant="contained" disabled={submitLoading}>
                {submitLoading ? <CircularProgress size={20} color="inherit" /> : (editingEvent ? "Update Event" : "Create Event")}
              </Button>
              <Button variant="outlined" onClick={resetForm} disabled={submitLoading}>Cancel</Button>
            </Box>
          </Box>
        </Paper>
      </Collapse>

      {/* Tabs */}
      <ToggleButtonGroup
        value={activeTab}
        exclusive
        onChange={(_, val) => val && setActiveTab(val)}
        sx={{ mb: 3, "& .MuiToggleButton-root": { border: "1px solid", borderColor: "divider", borderRadius: "100px !important", px: 3, py: 1, textTransform: "none", fontWeight: 600, color: "text.secondary", "&.Mui-selected": { bgcolor: "primary.main", color: "primary.contrastText", borderColor: "primary.main" } } }}
      >
        <ToggleButton value="upcoming">Upcoming Events</ToggleButton>
        <ToggleButton value="past">Past Events</ToggleButton>
      </ToggleButtonGroup>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Events ({filteredEvents.length})
        </Typography>
        <Box sx={{ flex: 1 }} />
        <TextField placeholder="Search by event name..." value={filterName} onChange={(e) => setFilterName(e.target.value)} size="small" sx={{ width: { xs: "100%", sm: 260 } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
        <TextField type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} size="small" sx={{ width: 180 }} InputLabelProps={{ shrink: true }}
          InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonthIcon /></InputAdornment> }}
        />
        {(filterName || filterDate) && (
          <Button variant="text" onClick={() => { setFilterName(""); setFilterDate(""); }}>Clear</Button>
        )}
      </Box>

      {/* Events Grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress size={48} /></Box>
      ) : filteredEvents.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Typography sx={{ color: "text.secondary" }}>
            {events.length === 0 ? "No events yet. Create your first event!" : "No events match your filters."}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredEvents.map((event) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={event._id}>
              <Card sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
                <CardMedia component="img" height="160" image={event.banner} alt={event.title} sx={{ objectFit: "cover" }} />
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", flex: 1 }} noWrap>{event.title}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {activeTab === 'upcoming' && (<IconButton size="small" onClick={() => handleShare(event._id)} title="Share"><ShareIcon fontSize="small" /></IconButton>)}
                      <Chip label={event.isActive ? "Active" : "Inactive"} size="small" color={event.isActive ? "success" : "default"} />
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {event.description}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                    <Chip icon={<PeopleIcon />} label={`${getRegistrationCount(event._id)} Registeindigo`} size="small" variant="outlined" />
                    {event.certificateEnabled && <Chip icon={<VerifiedIcon />} label="E‑Certificate On" size="small" color="success" variant="outlined" />}
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>📅 {new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}</Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>📍 {event.location}</Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>🏁 {event.meetingPoint}</Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                  <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(event)}>Edit</Button>
                  <Button size="small" startIcon={<DeleteIcon />} color="error" onClick={() => handleDelete(event._id)}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setEventToDelete(null); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
          <WarningAmberIcon color="warning" /> Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "text.secondary" }}>Are you sure you want to delete this event? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button variant="outlined" onClick={() => { setShowDeleteConfirm(false); setEventToDelete(null); }} disabled={deleting}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} disabled={deleting}>
            {deleting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventManagement;
