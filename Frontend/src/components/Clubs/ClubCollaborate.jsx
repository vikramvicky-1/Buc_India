import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Shield,
  PlusCircle,
  ArrowLeft,
  Handshake,
  Upload,
} from "lucide-react";
import { clubService } from "../../services/api";
import "./ClubCollaborate.css";

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

const ClubCollaborate = () => {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem("userLoggedIn") === "true";
  const userEmail = sessionStorage.getItem("userEmail") || "";
  const userPhone = sessionStorage.getItem("userPhone") || "";

  const [requestForm, setRequestForm] = useState(initialRequestState);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) =>
    setRequestForm((prev) => ({ ...prev, [field]: value }));

  const updateAdminField = (index, field, value) =>
    setRequestForm((prev) => {
      const admins = [...prev.admins];
      admins[index] = { ...admins[index], [field]: value };
      return { ...prev, admins };
    });

  const addAdminRow = () =>
    setRequestForm((prev) => ({
      ...prev,
      admins: [
        ...prev.admins,
        { name: "", role: "admin", email: "", phone: "" },
      ],
    }));

  const removeAdminRow = (index) =>
    setRequestForm((prev) => ({
      ...prev,
      admins: prev.admins.filter((_, i) => i !== index),
    }));

  const handleFileChange = (field, file) =>
    setRequestForm((prev) => ({ ...prev, [field]: file }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.info("Please login before submitting a collaboration request.");
      navigate("/login");
      return;
    }

    setSubmitting(true);
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
        "Collaboration request submitted! BUC admin will review and respond shortly."
      );
      setRequestForm(initialRequestState);
      navigate("/clubs");
    } catch (error) {
      console.error("Collaboration request error:", error);
      toast.error(
        error.response?.data?.message ||
          "Unable to submit request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="collab-page">
      {/* ── Page Header ── */}
      <div className="collab-header">
        <div className="collab-header-inner">
          <button
            className="collab-back-btn"
            onClick={() => navigate("/clubs")}
          >
            <ArrowLeft size={17} />
            Back to Clubs
          </button>

          <div className="collab-header-icon">
            <Handshake size={32} />
          </div>
          <h1 className="collab-heading">
            Collaborate{" "}
            <span className="collab-heading-accent">with BUC</span>
          </h1>
          <p className="collab-subheading">
            Submit your club's details below. Once approved by BUC admins,
            you'll receive a dedicated partner dashboard and a public club page.
          </p>

          {!isLoggedIn && (
            <div className="collab-auth-warning">
              <Shield size={15} />
              <span>
                You need to{" "}
                <a href="/login" className="collab-login-link">
                  sign in
                </a>{" "}
                before submitting this form.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Form ── */}
      <div className="collab-body">
        <form className="collab-form" onSubmit={handleSubmit}>
          {/* Club Info */}
          <div className="collab-card">
            <h2 className="collab-card-title">Club Information</h2>

            <div className="collab-field-group">
              <label className="collab-label">
                Club Name <span className="collab-required">*</span>
              </label>
              <input
                type="text"
                className="collab-input"
                value={requestForm.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Royal Riders Pune"
                required
              />
            </div>

            <div className="collab-field-row">
              <div className="collab-field-group">
                <label className="collab-label">When did the club start?</label>
                <input
                  type="date"
                  className="collab-input"
                  value={requestForm.startedOn}
                  onChange={(e) => updateField("startedOn", e.target.value)}
                />
              </div>
              <div className="collab-field-group">
                <label className="collab-label">Club Moto / Tagline</label>
                <input
                  type="text"
                  className="collab-input"
                  value={requestForm.moto}
                  onChange={(e) => updateField("moto", e.target.value)}
                  placeholder="e.g. Ride free, ride safe"
                />
              </div>
            </div>

            <div className="collab-field-group">
              <label className="collab-label">
                What do you want to showcase through BUC?
              </label>
              <textarea
                rows={4}
                className="collab-textarea"
                value={requestForm.showcaseText}
                onChange={(e) => updateField("showcaseText", e.target.value)}
                placeholder="Tell BUC about your club's mission, values, and what you'd like to achieve together…"
              />
            </div>

            <div className="collab-field-group">
              <label className="collab-label">
                Government ID / Club Registration Number
              </label>
              <input
                type="text"
                className="collab-input"
                value={requestForm.governmentIdNumber}
                onChange={(e) =>
                  updateField("governmentIdNumber", e.target.value)
                }
                placeholder="Optional but recommended"
              />
            </div>
          </div>

          {/* Founder Details */}
          <div className="collab-card">
            <h2 className="collab-card-title">Founder Details</h2>

            <div className="collab-field-row">
              <div className="collab-field-group">
                <label className="collab-label">Founder Name</label>
                <input
                  type="text"
                  className="collab-input"
                  value={requestForm.founderName}
                  onChange={(e) => updateField("founderName", e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="collab-field-group">
                <label className="collab-label">Founder Role</label>
                <select
                  className="collab-input"
                  value={requestForm.founderRole}
                  onChange={(e) => updateField("founderRole", e.target.value)}
                >
                  <option value="founder">Founder</option>
                  <option value="co-founder">Co-Founder</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="collab-field-row">
              <div className="collab-field-group">
                <label className="collab-label">Founder Email</label>
                <input
                  type="email"
                  className="collab-input"
                  value={requestForm.founderEmail}
                  onChange={(e) => updateField("founderEmail", e.target.value)}
                />
              </div>
              <div className="collab-field-group">
                <label className="collab-label">Founder Phone</label>
                <input
                  type="tel"
                  className="collab-input"
                  value={requestForm.founderPhone}
                  onChange={(e) => updateField("founderPhone", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Admins */}
          <div className="collab-card">
            <h2 className="collab-card-title">Club Admins / Leadership</h2>
            <p className="collab-card-subtitle">
              Add co-founders, admins, or co-admins who will help manage the club.
            </p>

            <div className="collab-admin-list">
              {requestForm.admins.map((admin, index) => (
                <div key={index} className="collab-admin-row">
                  <input
                    type="text"
                    className="collab-input"
                    placeholder="Full name"
                    value={admin.name}
                    onChange={(e) =>
                      updateAdminField(index, "name", e.target.value)
                    }
                  />
                  <select
                    className="collab-input"
                    value={admin.role}
                    onChange={(e) =>
                      updateAdminField(index, "role", e.target.value)
                    }
                  >
                    <option value="admin">Admin</option>
                    <option value="co-admin">Co-Admin</option>
                    <option value="co-founder">Co-Founder</option>
                  </select>
                  <input
                    type="email"
                    className="collab-input"
                    placeholder="Email"
                    value={admin.email}
                    onChange={(e) =>
                      updateAdminField(index, "email", e.target.value)
                    }
                  />
                  <input
                    type="tel"
                    className="collab-input"
                    placeholder="Phone"
                    value={admin.phone}
                    onChange={(e) =>
                      updateAdminField(index, "phone", e.target.value)
                    }
                  />
                  {requestForm.admins.length > 1 && (
                    <button
                      type="button"
                      className="collab-admin-remove"
                      onClick={() => removeAdminRow(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="collab-add-admin-btn"
                onClick={addAdminRow}
              >
                <PlusCircle size={15} />
                Add another admin
              </button>
            </div>
          </div>

          {/* Uploads */}
          <div className="collab-card">
            <h2 className="collab-card-title">
              <Upload size={18} />
              Documents & Photos
            </h2>
            <p className="collab-card-subtitle">
              Upload your club's logo, first ride photo, government ID, and founder's passport photo.
            </p>

            <div className="collab-upload-grid">
              <label className="collab-upload-tile">
                <div className="collab-upload-icon">
                  <Upload size={18} />
                </div>
                <span className="collab-upload-label">Club Logo</span>
                <span className="collab-upload-filename">
                  {requestForm.logo ? requestForm.logo.name : "Choose file"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange("logo", e.target.files?.[0])
                  }
                />
              </label>
              <label className="collab-upload-tile">
                <div className="collab-upload-icon">
                  <Upload size={18} />
                </div>
                <span className="collab-upload-label">First Ride Photo</span>
                <span className="collab-upload-filename">
                  {requestForm.firstRideImage
                    ? requestForm.firstRideImage.name
                    : "Choose file"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange("firstRideImage", e.target.files?.[0])
                  }
                />
              </label>
              <label className="collab-upload-tile">
                <div className="collab-upload-icon">
                  <Upload size={18} />
                </div>
                <span className="collab-upload-label">
                  Government ID / Registration
                </span>
                <span className="collab-upload-filename">
                  {requestForm.governmentIdImage
                    ? requestForm.governmentIdImage.name
                    : "Choose file"}
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) =>
                    handleFileChange("governmentIdImage", e.target.files?.[0])
                  }
                />
              </label>
              <label className="collab-upload-tile">
                <div className="collab-upload-icon">
                  <Upload size={18} />
                </div>
                <span className="collab-upload-label">
                  Founder Passport Photo
                </span>
                <span className="collab-upload-filename">
                  {requestForm.founderPassport
                    ? requestForm.founderPassport.name
                    : "Choose file"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange("founderPassport", e.target.files?.[0])
                  }
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="collab-submit-btn"
            disabled={submitting || !isLoggedIn}
          >
            <Shield size={19} />
            {submitting ? "Submitting…" : "Submit Collaboration Request"}
          </button>

          {!isLoggedIn && (
            <p className="collab-submit-note">
              You must be{" "}
              <a href="/login" className="collab-login-link">
                signed in
              </a>{" "}
              to submit.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ClubCollaborate;
