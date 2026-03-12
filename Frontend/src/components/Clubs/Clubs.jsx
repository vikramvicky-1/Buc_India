import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AlertCircle,
  Handshake,
  Shield,
  CheckCircle,
  Users,
  Calendar,
  ArrowRight,
  XCircle,
} from "lucide-react";
import { clubMembershipService, clubService } from "../../services/api";
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
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

/* ── Single-Club Popup ── */
const SingleClubPopup = ({ onClose }) => (
  <div className="clubs-popup-overlay" onClick={onClose}>
    <div className="clubs-popup" onClick={(e) => e.stopPropagation()}>
      <div className="clubs-popup-icon">
        <AlertCircle size={32} />
      </div>
      <h3>One Club Per Rider</h3>
      <p>
        You're already a member of a club. BUC allows only one active club
        membership per rider to keep the community focused and fair.
      </p>
      <p className="clubs-popup-sub">
        Leave your current club first if you'd like to join a different one.
      </p>
      <button className="clubs-popup-close" onClick={onClose}>
        Got it
      </button>
    </div>
  </div>
);

const generateSlug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const Clubs = () => {
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const [leaveReason, setLeaveReason] = useState("");
  const [joining, setJoining] = useState(false);
  const [showSingleClubPopup, setShowSingleClubPopup] = useState(false);

  const isLoggedIn = sessionStorage.getItem("userLoggedIn") === "true";
  const userEmail = sessionStorage.getItem("userEmail") || "";
  const userPhone = sessionStorage.getItem("userPhone") || "";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [clubList, myClub] = await Promise.all([
        clubService.getPublic(),
        isLoggedIn
          ? clubMembershipService.getMyClub(userEmail, userPhone)
          : Promise.resolve({ membership: null }),
      ]);
      setClubs(clubList);
      setMembership(myClub.membership || null);
    } catch (error) {
      console.error("Failed to load clubs:", error);
      toast.error("Failed to load clubs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e, clubId) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.info("Please login / sign up before joining a club.");
      return;
    }
    if (membership) {
      setShowSingleClubPopup(true);
      return;
    }
    setJoining(true);
    try {
      await clubMembershipService.join(clubId, userEmail, userPhone);
      toast.success("You have joined the club!");
      await loadData();
    } catch (error) {
      console.error("Join club error:", error);
      toast.error(error.response?.data?.message || "Unable to join club");
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!membership || !membership.clubId) return;
    if (!leaveReason.trim()) {
      toast.error("Please share a short reason before leaving the club.");
      return;
    }
    setLeaving(true);
    try {
      await clubMembershipService.leave(
        membership.clubId._id || membership.clubId,
        userEmail,
        userPhone,
        leaveReason.trim(),
      );
      toast.success("You have left the club.");
      setLeaveReason("");
      await loadData();
    } catch (error) {
      console.error("Leave club error:", error);
      toast.error(error.response?.data?.message || "Unable to leave club");
    } finally {
      setLeaving(false);
    }
  };

  const goToClub = (club) => {
    const slug = club.slug || generateSlug(club.name);
    navigate(`/clubs/${slug}`, { state: { club } });
  };

  const handleCollaborate = () => {
    if (!isLoggedIn) {
      toast.info("Please login / sign up to collaborate with BUC.");
      navigate("/login");
      return;
    }
    navigate("/clubs/collaborate");
  };

  return (
    <Box
      component="section"
      id="clubs"
      sx={{
        position: "relative",
        pt: { xs: 8, md: 12 },
        pb: 12,
        bgcolor: "#020617",
        overflow: "hidden",
      }}
    >
      {/* Background Decor */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: "40%",
          height: "40%",
          bgcolor:
            "radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Confirm Member Exclusion Dialog */}
      <Dialog
        open={showSingleClubPopup}
        onClose={() => setShowSingleClubPopup(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontWeight: 800,
          }}
        >
          <AlertCircle color="#3B82F6" /> One Club Per Rider
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
            You're already a member of a club. BUC allows only one active club
            membership per rider to keep the community focused and fair.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button
            variant="contained"
            onClick={() => setShowSingleClubPopup(false)}
            sx={{ borderRadius: 2, fontWeight: 800 }}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", md: "flex-end" },
            mb: 8,
            gap: 4,
          }}
        >
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
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
                Stronger Together
              </Typography>
            </Box>
            <Typography
              variant="h2"
              sx={{
                color: "text.primary",
                fontWeight: 900,
                fontFamily: "'Audiowide', sans-serif",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                mb: 2,
              }}
            >
              Partner{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                Clubs
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 500,
                lineHeight: 1.8,
                fontWeight: 500,
              }}
            >
              Join BUC-approved riding communities across India. One club per
              rider, many adventures together.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handleCollaborate}
            startIcon={<Handshake />}
            sx={{
              py: 2,
              px: 4,
              borderRadius: 1.25,
              fontWeight: 900,
              boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Collaborate with BUC
          </Button>
        </Box>

        {/* Clubs Grid */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
            <CircularProgress size={56} sx={{ color: "primary.main" }} />
          </Box>
        ) : clubs.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              bgcolor: "rgba(255,255,255,0.02)",
              borderRadius: 1.25,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Shield size={64} style={{ opacity: 0.1, marginBottom: 16 }} />
            <Typography
              variant="h6"
              sx={{ color: "text.secondary", fontWeight: 600 }}
            >
              No partner clubs identified yet.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {clubs.map((club) => {
              const isMyClub =
                membership &&
                membership.clubId &&
                (membership.clubId._id || membership.clubId) === club.id;

              return (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={club.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: "rgba(255, 255, 255, 0.02)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: 1.25,
                      transition: "all 0.4s ease",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        borderColor: "rgba(59, 130, 246, 0.3)",
                        bgcolor: "rgba(255, 255, 255, 0.04)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        pt: "56.25%",
                        bgcolor: "rgba(255,255,255,0.03)",
                      }}
                    >
                      {club.logoUrl ? (
                        <CardMedia
                          component="img"
                          image={club.logoUrl}
                          alt={club.name}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "3rem",
                            fontWeight: 900,
                            color: "rgba(255,255,255,0.1)",
                          }}
                        >
                          {club.name.charAt(0)}
                        </Box>
                      )}
                      {isMyClub && (
                        <Chip
                          icon={<CheckCircle size={14} />}
                          label="Your Club"
                          sx={{
                            position: "absolute",
                            top: 15,
                            right: 15,
                            bgcolor: "primary.main",
                            color: "white",
                            fontWeight: 800,
                            fontSize: "0.65rem",
                          }}
                        />
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3.5 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "text.primary",
                          fontWeight: 900,
                          mb: 1,
                          lineHeight: 1.2,
                        }}
                      >
                        {club.name}
                      </Typography>
                      {club.moto && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            fontStyle: "italic",
                            mb: 3,
                          }}
                        >
                          "{club.moto}"
                        </Typography>
                      )}
                      <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Users size={16} color="#3B82F6" />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, color: "text.secondary" }}
                          >
                            {club.participantCount || 0} RIDERS
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Calendar size={16} color="#8B5CF6" />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, color: "text.secondary" }}
                          >
                            SINCE{" "}
                            {club.startedOn
                              ? new Date(club.startedOn).getFullYear()
                              : "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0, gap: 1.5 }}>
                      {isMyClub ? (
                        <Button
                          variant="outlined"
                          fullWidth
                          disabled
                          sx={{
                            borderRadius: 2,
                            borderColor: "rgba(16, 185, 129, 0.4)",
                            color: "#10B981",
                            fontWeight: 800,
                          }}
                        >
                          JOINED
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={(e) => handleJoin(e, club.id)}
                          disabled={joining}
                          sx={{ borderRadius: 2, fontWeight: 900 }}
                        >
                          Join Club
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => goToClub(club)}
                        endIcon={<ArrowRight size={16} />}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 800,
                          borderColor: "rgba(255,255,255,0.1)",
                          color: "text.secondary",
                        }}
                      >
                        Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Active Membership Footer Bar */}
        {isLoggedIn && membership && membership.clubId && (
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              p: 2,
              background:
                "linear-gradient(to top, rgba(2, 6, 23, 0.98), rgba(2, 6, 23, 0.8))",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Container maxWidth="lg">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                    }}
                  >
                    <CheckCircle color="#10B981" size={20} />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 800,
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Current Active Membership
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "text.primary",
                        fontWeight: 900,
                        lineHeight: 1,
                      }}
                    >
                      {membership.clubId.name}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    w: { xs: "100%", sm: "auto" },
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    placeholder="Leave reason..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    sx={{
                      flexGrow: 1,
                      minWidth: { sm: 250 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "rgba(255,255,255,0.03)",
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                  <Button
                    variant="text"
                    color="error"
                    onClick={handleLeave}
                    disabled={leaving}
                    startIcon={<XCircle size={14} />}
                    sx={{ fontWeight: 800, textTransform: "none" }}
                  >
                    Leave Club
                  </Button>
                </Box>
              </Box>
            </Container>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Clubs;
