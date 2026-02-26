import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Calendar,
  Crown,
  Star,
  Shield,
  Images,
  Loader2,
  MapPin,
} from "lucide-react";
import { clubService } from "../../services/api";
import "./ClubDetail.css";

const generateSlug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const roleIcon = (role = "") => {
  const r = role.toLowerCase();
  if (r.includes("founder")) return <Crown size={14} />;
  if (r.includes("admin")) return <Star size={14} />;
  return <Shield size={14} />;
};

const roleLabel = (role = "") =>
  role.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Member";

const ClubDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [club, setClub] = useState(location.state?.club || null);
  const [loading, setLoading] = useState(!location.state?.club);

  useEffect(() => {
    if (!club) fetchClub();
    // eslint-disable-next-line
  }, [slug]);

  const fetchClub = async () => {
    setLoading(true);
    try {
      const clubs = await clubService.getPublic();
      const found = clubs.find(
        (c) => (c.slug || generateSlug(c.name)) === slug
      );
      if (found) setClub(found);
      else navigate("/clubs", { replace: true });
    } catch (err) {
      console.error("Error fetching club:", err);
      navigate("/clubs", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cd-loading">
        <Loader2 size={36} className="cd-spin" />
        <p>Loading club details…</p>
      </div>
    );
  }

  if (!club) return null;

  const joinDate = club.startedOn
    ? new Date(club.startedOn).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const yearsActive = club.startedOn
    ? new Date().getFullYear() - new Date(club.startedOn).getFullYear()
    : null;

  /* Build leadership list from API fields */
  const leaders = [];
  // Primary founder
  if (club.founderName) {
    leaders.push({
      name: club.founderName,
      role: club.founderRole || "founder",
      email: club.founderEmail || "",
      phone: club.founderPhone || "",
    });
  }
  // admins array (includes co-founders, admins, etc.)
  if (Array.isArray(club.admins)) {
    club.admins.forEach((a) => {
      if (a.name) {
        leaders.push({
          name: a.name,
          role: a.role || "admin",
          email: a.email || "",
          phone: a.phone || "",
        });
      }
    });
  }

  // Separate founders from other admins
  const founders = leaders.filter((l) =>
    l.role?.toLowerCase().includes("founder")
  );
  const admins = leaders.filter(
    (l) => !l.role?.toLowerCase().includes("founder")
  );

  return (
    <div className="cd-page">
      {/* ── Banner ── */}
      <div className="cd-banner">
        {club.logoUrl ? (
          <img
            src={club.logoUrl}
            alt={club.name}
            className="cd-banner-bg"
          />
        ) : (
          <div className="cd-banner-gradient" />
        )}
        <div className="cd-banner-overlay" />

        <div className="cd-banner-content">
          <button className="cd-back-btn" onClick={() => navigate("/clubs")}>
            <ArrowLeft size={17} />
            Back to Clubs
          </button>

          {/* Logo */}
          <div className="cd-logo-wrap">
            {club.logoUrl ? (
              <img src={club.logoUrl} alt={club.name} className="cd-logo-img" />
            ) : (
              <div className="cd-logo-fallback">
                <span>{club.name.charAt(0)}</span>
              </div>
            )}
          </div>

          <h1 className="cd-club-name">{club.name}</h1>
          {club.moto && <p className="cd-club-moto">"{club.moto}"</p>}

          <div className="cd-meta-row">
            {joinDate && (
              <div className="cd-meta-pill">
                <Calendar size={13} />
                <span>Est. {joinDate}</span>
              </div>
            )}
            <div className="cd-meta-pill">
              <Users size={13} />
              <span>{club.participantCount || 0} Members</span>
            </div>
            {club.city && (
              <div className="cd-meta-pill">
                <MapPin size={13} />
                <span>{club.city}</span>
              </div>
            )}
            <div className="cd-meta-pill cd-meta-pill--approved">
              <Shield size={13} />
              <span>BUC Approved</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="cd-body">

        {/* Stats */}
        <div className="cd-stats-row">
          <div className="cd-stat-card">
            <Users size={22} />
            <span className="cd-stat-num">{club.participantCount || 0}</span>
            <span className="cd-stat-lbl">Active Members</span>
          </div>
          {yearsActive !== null && (
            <div className="cd-stat-card">
              <Calendar size={22} />
              <span className="cd-stat-num">{yearsActive > 0 ? `${yearsActive}+` : "<1"}</span>
              <span className="cd-stat-lbl">Years Active</span>
            </div>
          )}
          <div className="cd-stat-card">
            <Shield size={22} />
            <span className="cd-stat-num">BUC</span>
            <span className="cd-stat-lbl">Partner Club</span>
          </div>
        </div>

        {/* About */}
        {club.showcaseText && (
          <section className="cd-section">
            <h2 className="cd-section-title">About the Club</h2>
            <p className="cd-description">{club.showcaseText}</p>
          </section>
        )}

        {/* Founders & Co-founders */}
        {founders.length > 0 && (
          <section className="cd-section">
            <h2 className="cd-section-title">
              <Crown size={18} className="cd-section-icon" />
              Founders
            </h2>
            <div className="cd-leaders-grid">
              {founders.map((leader, i) => (
                <div key={i} className="cd-leader-card cd-leader-card--founder">
                  <div className="cd-leader-avatar cd-leader-avatar--founder">
                    <span>{leader.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="cd-leader-info">
                    <p className="cd-leader-name">{leader.name}</p>
                    <div className="cd-leader-role">
                      {roleIcon(leader.role)}
                      <span>{roleLabel(leader.role)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Admins / Leadership (non-founders) */}
        {admins.length > 0 && (
          <section className="cd-section">
            <h2 className="cd-section-title">
              <Star size={18} className="cd-section-icon" />
              Club Leadership
            </h2>
            <div className="cd-leaders-grid">
              {admins.map((leader, i) => (
                <div key={i} className="cd-leader-card">
                  <div className="cd-leader-avatar">
                    <span>{leader.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="cd-leader-info">
                    <p className="cd-leader-name">{leader.name}</p>
                    <div className="cd-leader-role">
                      {roleIcon(leader.role)}
                      <span>{roleLabel(leader.role)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery placeholder */}
        <section className="cd-section cd-gallery-section">
          <div className="cd-gallery-header">
            <Images size={20} />
            <h2 className="cd-section-title">Gallery</h2>
          </div>
          <div className="cd-gallery-placeholder">
            <Images size={48} />
            <p>Gallery coming soon</p>
            <span>Photos and memories from rides will appear here.</span>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ClubDetail;
