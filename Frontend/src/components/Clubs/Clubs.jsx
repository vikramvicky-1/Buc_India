import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Users, Shield, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import { clubService, clubMembershipService } from "../../services/api";
import "./Clubs.css";

const initialRequestState = {
  name: "",
  startedOn: "",
  moto: "",
  showcaseText: "",
  governmentIdNumber: "",
  founderName: "",
  founderRole: "founder",
  founderEmail: "",
  founderPhone: "",
  admins: [{ name: "", role: "admin", email: "", phone: "" }],
  logo: null,
  firstRideImage: null,
  governmentIdImage: null,
  founderPassport: null,
};

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState(null);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [leaveReason, setLeaveReason] = useState("");
  const [requestForm, setRequestForm] = useState(initialRequestState);
  const [submittingRequest, setSubmittingRequest] = useState(false);

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

  const handleJoin = async (clubId) => {
    if (!isLoggedIn) {
      toast.info("Please login / sign up before joining a club.");
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

  const updateField = (field, value) => {
    setRequestForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateAdminField = (index, field, value) => {
    setRequestForm((prev) => {
      const admins = [...prev.admins];
      admins[index] = { ...admins[index], [field]: value };
      return { ...prev, admins };
    });
  };

  const addAdminRow = () => {
    setRequestForm((prev) => ({
      ...prev,
      admins: [
        ...prev.admins,
        { name: "", role: "admin", email: "", phone: "" },
      ],
    }));
  };

  const removeAdminRow = (index) => {
    setRequestForm((prev) => ({
      ...prev,
      admins: prev.admins.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (field, file) => {
    setRequestForm((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmittingRequest(true);
    try {
      const data = new FormData();
      data.append("name", requestForm.name);
      data.append("startedOn", requestForm.startedOn);
      data.append("moto", requestForm.moto);
      data.append("showcaseText", requestForm.showcaseText);
      data.append("governmentIdNumber", requestForm.governmentIdNumber);
      data.append("founderName", requestForm.founderName);
      data.append("founderRole", requestForm.founderRole);
      data.append("founderEmail", requestForm.founderEmail);
      data.append("founderPhone", requestForm.founderPhone);
      data.append("creatorEmail", userEmail || requestForm.founderEmail);
      data.append("creatorPhone", userPhone || requestForm.founderPhone);
      data.append("admins", JSON.stringify(requestForm.admins || []));

      if (requestForm.logo) data.append("logo", requestForm.logo);
      if (requestForm.firstRideImage)
        data.append("firstRideImage", requestForm.firstRideImage);
      if (requestForm.governmentIdImage)
        data.append("governmentIdImage", requestForm.governmentIdImage);
      if (requestForm.founderPassport)
        data.append("founderPassport", requestForm.founderPassport);

      await clubService.createRequest(data);
      toast.success(
        "Club collaboration request submitted! Our admin will review and approve."
      );
      setRequestForm(initialRequestState);
    } catch (error) {
      console.error("Create club request error:", error);
      toast.error(
        error.response?.data?.message ||
          "Unable to submit collaboration request. Please try again."
      );
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <section id="clubs" className="clubs-section">
      <div className="clubs-hero">
        <div className="clubs-hero-inner">
          <h1>Partner Riding Clubs</h1>
          <p>
            BUC collaborates with passionate motorcycle communities across India.
            Discover partner clubs, join your tribe, or bring your own club to
            the BUC family.
          </p>
          <div className="clubs-hero-badges">
            <div className="clubs-hero-badge">
              <Users size={20} />
              <span>One club per rider, many rides together.</span>
            </div>
            <div className="clubs-hero-badge">
              <Shield size={20} />
              <span>BUC-approved, safety-first communities.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="clubs-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="clubs-grid">
          <div className="clubs-column">
            <h2>Active Partner Clubs</h2>
            <p className="clubs-column-subtitle">
              Browse BUC-approved clubs. You can only be an active member of
              one club at a time, but you are always welcome to register for all
              BUC rides and events.
            </p>

            {loading ? (
              <div className="clubs-card text-center">Loading clubs…</div>
            ) : clubs.length === 0 ? (
              <div className="clubs-card text-center">
                No partner clubs are live yet. Be the first to collaborate with
                BUC!
              </div>
            ) : (
              <div className="clubs-list">
                {clubs.map((club) => {
                  const isMyClub =
                    membership &&
                    membership.clubId &&
                    (membership.clubId._id || membership.clubId) === club.id;
                  return (
                    <div key={club.id} className="clubs-card">
                      <div className="clubs-card-header">
                        <div className="clubs-logo-wrapper">
                          {club.logoUrl ? (
                            <img
                              src={club.logoUrl}
                              alt={club.name}
                              className="clubs-logo"
                            />
                          ) : (
                            <div className="clubs-logo-placeholder">
                              {club.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="clubs-card-title">
                          <h3>{club.name}</h3>
                          {club.moto && (
                            <p className="clubs-card-moto">{club.moto}</p>
                          )}
                        </div>
                      </div>
                      <div className="clubs-card-body">
                        <div className="clubs-stats">
                          <div className="clubs-stat">
                            <Users size={18} />
                            <span>
                              {club.participantCount || 0} active participants
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="clubs-card-footer">
                        {isMyClub ? (
                          <button
                            type="button"
                            className="clubs-button-secondary clubs-button-pill"
                            disabled
                          >
                            <CheckCircle size={16} />
                            <span>Your current club</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="clubs-button-primary clubs-button-pill"
                            onClick={() => handleJoin(club.id)}
                            disabled={joining || !!membership}
                          >
                            <PlusCircle size={16} />
                            <span>
                              {membership
                                ? "Club locked (one club per rider)"
                                : "Join this club"}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="clubs-column">
            <h2>Your Club & Collaboration</h2>

            {isLoggedIn ? (
              <>
                <div className="clubs-card clubs-myclub-card">
                  <h3>Your membership</h3>
                  {membership && membership.clubId ? (
                    <>
                      <p className="clubs-myclub-name">
                        {membership.clubId.name || "Partner club"}
                      </p>
                      <p className="clubs-myclub-note">
                        You’re an active member of this club. You can still
                        register for any BUC ride or event.
                      </p>

                      {["founder", "co-founder", "admin", "co-admin"].includes(
                        membership.role,
                      ) && (
                        <div className="clubs-admin-highlight">
                          <p className="clubs-admin-title">
                            Club {membership.role?.replace("-", " ") || "admin"}{" "}
                            access
                          </p>
                          <p className="clubs-admin-text">
                            As a club leader, your collaboration with BUC is
                            already active. Use your club channels to invite
                            riders to BUC events, and coordinate with the BUC
                            core admin team for advanced dashboards and reports.
                          </p>
                        </div>
                      )}

                      <label className="clubs-field-label mt-4">
                        Reason for leaving this club
                      </label>
                      <textarea
                        rows={3}
                        className="clubs-textarea"
                        placeholder="Tell BUC and the club admins why you’re leaving…"
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                      />
                      <button
                        type="button"
                        className="clubs-button-danger"
                        onClick={handleLeave}
                        disabled={leaving}
                      >
                        <XCircle size={16} />
                        <span>
                          {leaving ? "Processing…" : "Leave this club"}
                        </span>
                      </button>
                    </>
                  ) : (
                    <p className="clubs-empty-note">
                      You’re currently not a member of any partner club. Join a
                      club from the list, or submit your own club below to
                      collaborate with BUC.
                    </p>
                  )}
                </div>

                <div className="clubs-card clubs-request-card">
                  <h3>Apply as a Partner Club</h3>
                  <p className="clubs-column-subtitle">
                    Club founders can submit their details here. BUC will review
                    your request and, once approved, you’ll get a dedicated
                    collaborative view and member dashboard.
                  </p>

                  <form onSubmit={handleSubmitRequest} className="clubs-form">
                    <div className="clubs-field-group">
                      <label className="clubs-field-label">
                        Club Name <span className="clubs-required">*</span>
                      </label>
                      <input
                        type="text"
                        className="clubs-input"
                        value={requestForm.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="clubs-field-row">
                      <div className="clubs-field-group">
                        <label className="clubs-field-label">
                          When did the club start?
                        </label>
                        <input
                          type="date"
                          className="clubs-input"
                          value={requestForm.startedOn}
                          onChange={(e) =>
                            updateField("startedOn", e.target.value)
                          }
                        />
                      </div>
                      <div className="clubs-field-group">
                        <label className="clubs-field-label">
                          Club Moto / Tagline
                        </label>
                        <input
                          type="text"
                          className="clubs-input"
                          value={requestForm.moto}
                          onChange={(e) =>
                            updateField("moto", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="clubs-field-group">
                      <label className="clubs-field-label">
                        What do you want to showcase through BUC?
                      </label>
                      <textarea
                        rows={3}
                        className="clubs-textarea"
                        value={requestForm.showcaseText}
                        onChange={(e) =>
                          updateField("showcaseText", e.target.value)
                        }
                      />
                    </div>

                    <div className="clubs-field-group">
                      <label className="clubs-field-label">
                        Government ID / Registration Number
                      </label>
                      <input
                        type="text"
                        className="clubs-input"
                        value={requestForm.governmentIdNumber}
                        onChange={(e) =>
                          updateField("governmentIdNumber", e.target.value)
                        }
                      />
                    </div>

                    <div className="clubs-field-row">
                      <div className="clubs-field-group">
                        <label className="clubs-field-label">
                          Founder Name
                        </label>
                        <input
                          type="text"
                          className="clubs-input"
                          value={requestForm.founderName}
                          onChange={(e) =>
                            updateField("founderName", e.target.value)
                          }
                        />
                      </div>
                      <div className="clubs-field-group">
                        <label className="clubs-field-label">
                          Founder Role
                        </label>
                        <select
                          className="clubs-input"
                          value={requestForm.founderRole}
                          onChange={(e) =>
                            updateField("founderRole", e.target.value)
                          }
                        >
                          <option value="founder">Founder</option>
                          <option value="co-founder">Co-Founder</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>

                    <div className="clubs-field-row">
                      <div className="clubs-field-group">
                        <label className="clubs-field-label">
                          Founder Email
                        </label>
                        <input
                          type="email"
                          className="clubs-input"
                          value={requestForm.founderEmail}
                          onChange={(e) =>
                            updateField("founderEmail", e.target.value)
                          }
                        />
                      </div>
                      <div className="clubs-field-group">
                        <label className="clubs-field-label">
                          Founder Phone
                        </label>
                        <input
                          type="tel"
                          className="clubs-input"
                          value={requestForm.founderPhone}
                          onChange={(e) =>
                            updateField("founderPhone", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="clubs-field-group">
                      <label className="clubs-field-label">
                        Club Admins (name & role)
                      </label>
                      <div className="clubs-admin-list">
                        {requestForm.admins.map((admin, index) => (
                          <div key={index} className="clubs-admin-row">
                            <input
                              type="text"
                              className="clubs-input"
                              placeholder="Admin name"
                              value={admin.name}
                              onChange={(e) =>
                                updateAdminField(index, "name", e.target.value)
                              }
                            />
                            <select
                              className="clubs-input"
                              value={admin.role}
                              onChange={(e) =>
                                updateAdminField(index, "role", e.target.value)
                              }
                            >
                              <option value="admin">Admin</option>
                              <option value="co-admin">Co-Admin</option>
                            </select>
                            <input
                              type="email"
                              className="clubs-input"
                              placeholder="Email"
                              value={admin.email}
                              onChange={(e) =>
                                updateAdminField(
                                  index,
                                  "email",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="tel"
                              className="clubs-input"
                              placeholder="Phone"
                              value={admin.phone}
                              onChange={(e) =>
                                updateAdminField(
                                  index,
                                  "phone",
                                  e.target.value
                                )
                              }
                            />
                            {requestForm.admins.length > 1 && (
                              <button
                                type="button"
                                className="clubs-admin-remove"
                                onClick={() => removeAdminRow(index)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="clubs-button-secondary clubs-button-sm"
                          onClick={addAdminRow}
                        >
                          <PlusCircle size={16} />
                          <span>Add another admin</span>
                        </button>
                      </div>
                    </div>

                    <div className="clubs-field-group">
                      <label className="clubs-field-label">
                        Uploads (logo, first ride, ID & photo)
                      </label>
                      <div className="clubs-upload-grid">
                        <label className="clubs-upload-tile">
                          <span>Club Logo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange("logo", e.target.files?.[0])
                            }
                          />
                        </label>
                        <label className="clubs-upload-tile">
                          <span>First Ride Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(
                                "firstRideImage",
                                e.target.files?.[0]
                              )
                            }
                          />
                        </label>
                        <label className="clubs-upload-tile">
                          <span>Government ID / Registration</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) =>
                              handleFileChange(
                                "governmentIdImage",
                                e.target.files?.[0]
                              )
                            }
                          />
                        </label>
                        <label className="clubs-upload-tile">
                          <span>Founder Passport Size Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(
                                "founderPassport",
                                e.target.files?.[0]
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="clubs-button-primary clubs-button-full"
                      disabled={submittingRequest}
                    >
                      <Shield size={18} />
                      <span>
                        {submittingRequest
                          ? "Submitting request…"
                          : "Submit collaboration request"}
                      </span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="clubs-card">
                <h3>Login to manage clubs</h3>
                <p className="clubs-empty-note">
                  Sign in to join a partner club or submit your own club for
                  collaboration with BUC.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="clubs-note">
          <p>
            Note: Club collaboration does not affect event registrations. Riders
            can participate in any BUC ride while being an active member of only
            one partner club at a time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Clubs;

