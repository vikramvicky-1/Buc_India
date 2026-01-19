import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import RegistrationForm from './RegistrationForm.jsx';
import ProposeEventForm from './ProposeEventForm.jsx';

const PULSE_POLIO_FORM_URL = 'https://forms.gle/RFSFUUE87Pjbz63u6';

const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showProposeEventForm, setShowProposeEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');

  const formatDate = (dateStr) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const [year, month, day] = dateStr.split('-').map(Number);
    return `${day} ${months[month - 1]} ${year}`;
  };

  const isRegistrationClosed = (eventDate) => {
    const [year, month, day] = eventDate.split('-').map(Number);
    const event = new Date(year, month - 1, day);
    const closeDate = new Date(event);
    closeDate.setDate(event.getDate() - 1);
    closeDate.setHours(0, 0, 0, 0);
    const now = new Date();
    return now >= closeDate;
  };

  const handleRegisterClick = (eventTitle) => {
    setSelectedEvent(eventTitle);
    setShowRegistrationForm(true);
  };

  const upcomingEvents = [
    {
      id: 1,
      title: 'Pulse Polio Awareness Ride 2025',
      date: '2025-12-20',
      time: '9:00 AM',
      location: 'K R Puram Govt Hospital, Bangalore',
      attendees: 200,
      maxAttendees: 200,
      description:
        'A united ride to support Pulse Polio, spreading awareness that every child deserves a healthy, polio-free future.',
      image: '../assets/crime.png'
    },
    {
      id: 2,
      title: 'World Humanitarian Day Ride',
      date: '2025-12-27',
      time: 'Coming Soon',
      location: 'Bangalore',
      attendees: 0,
      maxAttendees: 1000,
      description:
        'Humanity First – Always be kinder to the world.',
      image: '/logo copy copy.jpg'
    }
  ];

  const pastEvents = [
    {
      id: 3,
      title: 'Crime Free KR Puram 2025 Marathon',
      date: '2025-08-15',
      time: '6:00 AM',
      location: 'Cambridge Institute of Technology, KR Puram',
      attendees: 105,
      maxAttendees: 200,
      description:
        'Run for a safer and crime-free tomorrow.',
      image: '../assets/crime.jpg'
    },
    {
      id: 4,
      title: 'Pre BUC_India Ride and No Tobacco Day 2025',
      date: '2025-06-01',
      time: '6:00 AM',
      location: 'Cambridge Institute of Technology, KR Puram',
      attendees: 1000,
      maxAttendees: 1000,
      description:
        'A ride to support No Tobacco Day and promote a healthy lifestyle.',
      image: '../assets/crime.jpg'
    }
  ];

  return (
    <section id="events" className="relative py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-white">
            Events
          </h2>
          <p className="text-gray-400 mt-3">
            Ride with purpose. Ride for change.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-gray-800 p-1 rounded-lg">
            {['upcoming', 'past'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md font-semibold ${
                  activeTab === tab
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab === 'upcoming' ? 'Upcoming' : 'Past'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).map(event => {
            const isPulsePolio =
              event.title === 'Pulse Polio Awareness Ride 2025';

            const registrationClosed = isRegistrationClosed(event.date);

            return (
              <div
                key={event.id}
                className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {event.title}
                  </h3>

                  <div className="space-y-2 text-gray-300 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                      {formatDate(event.date)}
                      <Clock className="h-4 w-4 ml-4 mr-2 text-orange-500" />
                      {event.time}
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                      {event.location}
                    </div>

                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-orange-500" />
                      {event.attendees}/{event.maxAttendees}
                    </div>
                  </div>

                  <p className="text-gray-400 mb-5">
                    {event.description}
                  </p>

                  {activeTab === 'upcoming' && (
                    <button
                      disabled={registrationClosed}
                      onClick={() => {
                        if (registrationClosed) return;

                        if (isPulsePolio) {
                          window.open(PULSE_POLIO_FORM_URL, '_blank');
                        } else {
                          handleRegisterClick(event.title);
                        }
                      }}
                      className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                        registrationClosed
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}
                    >
                      {registrationClosed
                        ? 'Registrations Closed'
                        : isPulsePolio
                        ? 'Register via Google Form'
                        : 'Register Now'}

                      {!registrationClosed &&
                        (isPulsePolio ? (
                          <ExternalLink size={16} />
                        ) : (
                          <ArrowRight size={16} />
                        ))}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={() => setShowProposeEventForm(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Propose an Event
          </button>
        </div>

        <RegistrationForm
          isOpen={showRegistrationForm}
          onClose={() => setShowRegistrationForm(false)}
          type="event"
          eventTitle={selectedEvent}
        />

        <ProposeEventForm
          isOpen={showProposeEventForm}
          onClose={() => setShowProposeEventForm(false)}
        />
      </div>
    </section>
  );
};

export default Events;
