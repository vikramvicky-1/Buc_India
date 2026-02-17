import React, { useEffect, useState } from "react";
import { clubService, clubMembershipService } from "../../services/api";
import "./ClubManagement.css";

const ClubManagement = () => {
  const [clubs, setClubs] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [clubList, membershipList] = await Promise.all([
        clubService.getAllAdmin(),
        clubMembershipService.getAllAdmin(),
      ]);
      setClubs(clubList);
      setMemberships(membershipList);
    } catch (error) {
      console.error("Failed to load club management data:", error);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await clubService.updateStatus(id, status);
      await loadData();
    } catch (error) {
      console.error("Failed to update club status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusLabelClass = (status) => {
    if (status === "approved") return "club-status-approved";
    if (status === "rejected") return "club-status-rejected";
    return "club-status-pending";
  };

  const exitMemberships = memberships.filter(
    (m) => m.status === "exited" && m.exitReason
  );

  return (
    <div className="club-management">
      <h1 className="page-title">Partner Clubs</h1>
      <p className="page-subtitle">
        Review collaboration requests, approve clubs, and track member exit
        reasons.
      </p>

      {loading ? (
        <div className="no-active-event">Loading club data...</div>
      ) : (
        <>
          <section className="club-section">
            <h2 className="section-title">Club Collaboration Requests</h2>
            {clubs.length === 0 ? (
              <div className="no-active-event">No club requests yet.</div>
            ) : (
              <div className="club-table">
                <div className="club-table-header">
                  <span>Club</span>
                  <span>Started</span>
                  <span>Moto</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                {clubs.map((club) => (
                  <div key={club._id} className="club-row">
                    <div className="club-main">
                      <div className="club-logo-small">
                        {club.logoUrl ? (
                          <img src={club.logoUrl} alt={club.name} />
                        ) : (
                          <span>{club.name?.charAt(0) || "C"}</span>
                        )}
                      </div>
                      <div>
                        <div className="club-name">{club.name}</div>
                        {club.founder?.name && (
                          <div className="club-meta">
                            Founder: {club.founder.name} (
                            {club.founder.role || "founder"})
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="club-cell">
                      {club.startedOn
                        ? new Date(club.startedOn).toLocaleDateString()
                        : "-"}
                    </div>
                    <div className="club-cell club-moto">
                      {club.moto || club.showcaseText || "-"}
                    </div>
                    <div className="club-cell">
                      <span className={statusLabelClass(club.status)}>
                        {club.status}
                      </span>
                    </div>
                    <div className="club-cell club-actions">
                      <button
                        type="button"
                        className="status-btn approve"
                        disabled={updatingId === club._id}
                        onClick={() => changeStatus(club._id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="status-btn reject"
                        disabled={updatingId === club._id}
                        onClick={() => changeStatus(club._id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="club-section">
            <h2 className="section-title">Member Exit Reasons</h2>
            {exitMemberships.length === 0 ? (
              <div className="no-active-event">
                No members have exited partner clubs yet.
              </div>
            ) : (
              <div className="club-exits">
                {exitMemberships.map((m) => (
                  <div key={m._id} className="exit-row">
                    <div className="exit-main">
                      <div className="exit-title">
                        {m.userId?.fullName || "Member"} left{" "}
                        {m.clubId?.name || "Club"}
                      </div>
                      <div className="exit-meta">
                        {m.userId?.email && <span>{m.userId.email}</span>}
                        {m.userId?.phone && <span>{m.userId.phone}</span>}
                        {m.exitedAt && (
                          <span>
                            {new Date(m.exitedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="exit-reason">
                      <strong>Reason:</strong> {m.exitReason}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default ClubManagement;

