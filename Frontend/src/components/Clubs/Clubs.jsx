import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Users,
  Shield,
  PlusCircle,
  CheckCircle,
  XCircle,
  Calendar,
  ArrowRight,
  Handshake,
  AlertCircle,
} from "lucide-react";
import { clubMembershipService, clubService } from "../../services/api";
import "./Clubs.css";

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
        leaveReason.trim()
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
    <section id="clubs" className="clubs-section">
      {showSingleClubPopup && (
        <SingleClubPopup onClose={() => setShowSingleClubPopup(false)} />
      )}

      {/* ─── Hero ─── */}
      <div className="clubs-page-header">
        <div className="clubs-page-header-inner">
          <div className="clubs-page-heading-wrap">
            <h2 className="clubs-page-heading">
              Partner{" "}
              <span className="clubs-page-heading-accent">Riding Clubs</span>
            </h2>
            <div className="clubs-hero-badges">
              <div className="clubs-hero-badge">
                <Users size={15} />
                <span>One club per rider, many rides together.</span>
              </div>
              <div className="clubs-hero-badge">
                <Shield size={15} />
                <span>BUC-approved, safety-first communities.</span>
              </div>
            </div>
          </div>

          {/* Collaborate CTA */}
          <button className="clubs-collab-btn" onClick={handleCollaborate}>
            <Handshake size={20} />
            <span className="clubs-collab-btn-main">Collaborate with BUC</span>
            <span className="clubs-collab-btn-sub">Join as a Partner Club</span>
          </button>
        </div>
      </div>

      {/* ─── Club Cards Grid ─── */}
      <div className="clubs-content">
        {loading ? (
          <div className="clubs-loading-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="clubs-card-skeleton" />
            ))}
          </div>
        ) : clubs.length === 0 ? (
          <div className="clubs-empty-state">
            <Shield size={48} />
            <h3>No partner clubs yet</h3>
            <p>Be the first to collaborate with BUC!</p>
          </div>
        ) : (
          <div className="clubs-product-grid">
            {clubs.map((club) => {
              const isMyClub =
                membership &&
                membership.clubId &&
                (membership.clubId._id || membership.clubId) === club.id;

              const joinDate = club.startedOn
                ? new Date(club.startedOn).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                  })
                : "N/A";

              return (
                <div
                  key={club.id}
                  className="club-product-card"
                  onClick={() => goToClub(club)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && goToClub(club)}
                >
                  {/* Logo / Image */}
                  <div className="club-card-image-wrap">
                    {club.logoUrl ? (
                      <img
                        src={club.logoUrl}
                        alt={club.name}
                        className="club-card-logo-img"
                      />
                    ) : (
                      <div className="club-card-logo-fallback">
                        <span>{club.name.charAt(0)}</span>
                      </div>
                    )}
                    {isMyClub && (
                      <div className="club-card-my-badge">
                        <CheckCircle size={12} /> Your Club
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="club-card-body">
                    <h3 className="club-card-name">{club.name}</h3>
                    {club.moto && (
                      <p className="club-card-moto">"{club.moto}"</p>
                    )}
                    <div className="club-card-stats">
                      <div className="club-card-stat">
                        <Users size={13} />
                        <span>{club.participantCount || 0} Members</span>
                      </div>
                      <div className="club-card-stat">
                        <Calendar size={13} />
                        <span>Since {joinDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className="club-card-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isMyClub ? (
                      <button className="club-btn club-btn-joined" disabled>
                        <CheckCircle size={13} />
                        Joined
                      </button>
                    ) : (
                      <button
                        className="club-btn club-btn-join"
                        onClick={(e) => handleJoin(e, club.id)}
                        disabled={joining}
                      >
                        <PlusCircle size={13} />
                        Join Club
                      </button>
                    )}
                    <button
                      className="club-btn club-btn-view"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToClub(club);
                      }}
                    >
                      View More
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Your active membership (leave option) */}
        {isLoggedIn && membership && membership.clubId && (
          <div className="clubs-membership-bar">
            <div className="clubs-membership-bar-inner">
              <div className="clubs-membership-info">
                <CheckCircle size={16} className="clubs-membership-check" />
                <div>
                  <span className="clubs-membership-label">Your Club</span>
                  <span className="clubs-membership-name">
                    {membership.clubId.name || "Partner Club"}
                  </span>
                </div>
              </div>
              <div className="clubs-membership-leave">
                <textarea
                  rows={1}
                  className="clubs-leave-input"
                  placeholder="Reason for leaving…"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                />
                <button
                  type="button"
                  className="clubs-leave-btn"
                  onClick={handleLeave}
                  disabled={leaving}
                >
                  <XCircle size={14} />
                  {leaving ? "Leaving…" : "Leave Club"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Clubs;
