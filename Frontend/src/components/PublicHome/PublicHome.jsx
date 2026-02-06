import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Flag,
  Share2,
  Users,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  eventService,
  registrationService,
  profileService,
} from "../../services/api";
import { toast } from "react-toastify";
import "./PublicHome.css";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  loading,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-orange-500/30 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-300 mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-colors border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

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
    const interval = setInterval(() => {
      loadEvents();
    }, 10000); // Refresh every 10 seconds
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
          key !== "_id" &&
          key !== "__v" &&
          key !== "createdAt" &&
          key !== "updatedAt" &&
          key !== "profileImage" &&
          key !== "profileImagePublicId"
        ) {
          data.append(key, profile[key]);
        }
      });
      data.append("eventId", selectedEvent._id);

      await registrationService.create(data);
      toast.success(`Successfully registered for ${selectedEvent.title}!`);
      setShowConfirmModal(false);
      loadEvents(); // Refresh counts
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
      .then(() => {
        toast.success("Registration link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
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
    <section
      id="events"
      className="relative pt-20 py-20 bg-black overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600 rounded-full filter blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full filter blur-[100px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {activeTab === "upcoming" ? "Upcoming" : "Past"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              Events
            </span>
          </h2>

          <div className="flex justify-center mt-8">
            <div className="inline-flex p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "upcoming"
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "past"
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Past Events
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          </div>
        ) : displayedEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedEvents.map((event) => (
                <div
                  key={event._id}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-orange-500/50 transition-all duration-500 overflow-hidden flex flex-col"
                >
                  <div className="h-48 w-full relative overflow-hidden">
                    <img
                      src={event.banner}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>

                    {/* Date Badge */}
                    <div className="absolute bottom-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20">
                      {new Date(event.eventDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors duration-300">
                        {event.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                        <Users className="w-3 h-3 text-orange-500 mr-1.5" />
                        {event.registrationCount || 0} Registered
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleShare(e, event._id)}
                      className="absolute top-25 right-4 p-2 bg-white backdrop-blur-md hover:bg-orange-500 hover:text-white text-orange-500 rounded-full transition-all duration-300 z-30 border border-white/10 flex items-center justify-center"
                      title="Share Registration Link"
                    >
                      <Share2 size={16} />
                    </button>

                    <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-3 mb-6 mt-auto">
                      <div className="flex items-center text-gray-300 text-sm">
                        <MapPin className="w-4 h-4 text-orange-500 mr-2 shrink-0" />
                        <span className="truncate">
                          Location: {event.location}
                        </span>
                        {/* Share Button */}
                      </div>

                      <div className="flex items-center text-gray-300 text-sm">
                        <Flag className="w-4 h-4 text-orange-500 mr-2 shrink-0" />
                        <span className="truncate">
                          Meeting: {event.meetingPoint}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <Clock className="w-4 h-4 text-orange-500 mr-2 shrink-0" />
                        <span>{formatTime(event.eventTime)}</span>
                      </div>
                    </div>

                    {activeTab === "upcoming" ? (
                      <button
                        onClick={() => handleRegisterClick(event)}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center group/btn"
                      >
                        Register Now
                        <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <div className="w-full py-3 bg-white/5 text-gray-500 rounded-xl font-semibold border border-white/5 text-center cursor-not-allowed">
                        Registration Closed
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {activeTab === "past" && pastEvents.length > pastLimit && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setPastLimit((prev) => prev + 6)}
                  className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium border border-white/10 transition-all duration-300"
                >
                  Load More Events
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              No {activeTab} events found.
            </p>
          </div>
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
      </div>
    </section>
  );
};

export default PublicHome;
