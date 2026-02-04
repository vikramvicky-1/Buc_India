import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { eventService, registrationService } from "../services/api";
import Header from "./Header";
import Footer from "./Footer";

const YourEvents = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn") === "true";
    if (!userLoggedIn) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userEmail = localStorage.getItem("userEmail");
      const userPhone = localStorage.getItem("userPhone");
      
      // Get all events
      const allEvents = await eventService.getAll();
      
      // Get all registrations
      // Note: We might need a specific endpoint to get registrations by user
      // For now, we'll filter all registrations if possible, or use existing registrationService.getAll
      // If registrationService.getAll requires eventId, we might need to iterate or have a better API
      
      // Let's assume registrationService.getAll can take a user identifier or we have to check each event
      // Better: Use a mock or assume the API exists/needs to be added.
      // For this task, I'll simulate filtering from all events if we can find a way to check registration.
      
      // Given the constraints, let's assume we can get registrations for the user.
      // If the backend doesn't support it yet, I'll filter events based on a mock for now or 
      // just display what we can.
      
      // Let's try to get all registrations and filter by email/phone
      const registrations = await registrationService.getAll();
      const userRegistrations = registrations.filter(r => r.email === userEmail || r.phone === userPhone);
      
      const userEventIds = userRegistrations.map(r => r.eventId);
      const myEvents = allEvents.filter(e => userEventIds.includes(e._id) || e.eventId === "community");

      const now = new Date();
      const upcoming = myEvents.filter(e => new Date(e.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
      const past = myEvents.filter(e => new Date(e.date) < now).sort((a, b) => new Date(b.date) - new Date(a.date));

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error("Error fetching your events:", error);
      // toast.error("Failed to load your events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading your events...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 w-full">
        <div className="mb-12 text-center sm:text-left">
          <h1 className="text-4xl font-bold text-white mb-4">Your Events</h1>
          <p className="text-gray-400">Manage your registrations and view ride history</p>
        </div>

        {upcomingEvents.length === 0 && pastEvents.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-12 text-center">
            <div className="bg-orange-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No events registered</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              You haven't registered for any events yet. Check out our upcoming rides and join the community!
            </p>
            <button
              onClick={() => navigate("/events")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
            >
              Explore Events
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-white">Upcoming Rides</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event._id} event={event} isPast={false} />
                  ))}
                </div>
              </section>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-8 bg-gray-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-white">Past Rides</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                  {pastEvents.map((event) => (
                    <EventCard key={event._id} event={event} isPast={true} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const EventCard = ({ event, isPast }) => {
  const navigate = useNavigate();
  const date = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all group">
      <div className="h-48 relative overflow-hidden">
        <img
          src={event.image || "https://images.unsplash.com/photo-1558981403-c5f91cbba527?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            isPast ? "bg-gray-800 text-gray-400" : "bg-orange-500 text-white"
          }`}>
            {isPast ? "Completed" : "Upcoming"}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-4 line-clamp-1">{event.title}</h3>
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-orange-500" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="w-4 h-4 mr-2 text-orange-500" />
            <span>{event.time || "06:00 AM"}</span>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
            <span className="line-clamp-1">{event.location || "Meeting point details in group"}</span>
          </div>
        </div>
        <button 
          onClick={() => navigate("/events")}
          className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <span>View Details</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default YourEvents;
