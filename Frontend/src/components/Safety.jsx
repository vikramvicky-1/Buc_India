import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Book, Users, Phone } from 'lucide-react';

const Safety = () => {
  const safetyTips = [
    {
      icon: Shield,
      title: 'Protective Gear',
      description: 'Always wear DOT-approved helmet, protective jacket, gloves, and boots.',
      tips: [
        'Helmet should fit snugly without pressure points',
        'Wear bright colors for better visibility',
        'Replace gear after any accident',
        'Check gear condition regularly'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Road Awareness',
      description: 'Stay alert and anticipate potential hazards on the road.',
      tips: [
        'Maintain safe following distance',
        'Check blind spots frequently',
        'Use turn signals early and clearly',
        'Avoid riding in bad weather when possible'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Pre-Ride Inspection',
      description: 'Perform thorough bike inspection before every ride.',
      tips: [
        'Check tire pressure and tread',
        'Test brakes and lights',
        'Verify fluid levels',
        'Inspect chain and sprockets'
      ]
    }
  ];

  const emergencyContacts = [
    {
      service: 'Emergency Services',
      number: '112',
      description: 'For immediate life-threatening emergencies'
    },
    {
      service: 'Community Emergency Line',
      number: '88677 18080',
      description: 'community member assistance and roadside help'
    },
    {
      service: 'Roadside Assistance',
      number: '1033-HELP',
      description: 'Motorcycle towing and breakdown assistance'
    }
  ];

  const safetyResources = [
    {
      title: 'Motorcycle Safety Foundation (MSF)',
      description: 'Comprehensive riding courses and safety resources',
      link: '#'
    },
    {
      title: 'Advanced Rider Training',
      description: 'Improve your skills with professional instruction',
      link: '#'
    },
    {
      title: 'Weather Riding Guide',
      description: 'Tips for riding safely in various weather conditions',
      link: '#'
    },
    {
      title: 'Group Riding Etiquette',
      description: 'Best practices for safe group riding',
      link: '#'
    }
  ];

  return (
    <section id="safety" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Motorcycle safety background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/90"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ride <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Safe</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Safety is our top priority. Learn essential riding tips, emergency procedures, and best practices to ensure every ride is a safe one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {safetyTips.map((tip, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300">
              <tip.icon className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">{tip.title}</h3>
              <p className="text-gray-300 mb-4">{tip.description}</p>
              <ul className="space-y-2">
                {tip.tips.map((item, tipIndex) => (
                  <li key={tipIndex} className="flex items-start text-gray-300">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 mb-16">
          <div className="flex items-center mb-6">
            <Phone className="h-8 w-8 text-red-500 mr-3" />
            <h3 className="text-2xl font-bold text-white">Emergency Contacts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-black/40 rounded-lg p-4 border border-red-500/20">
                <h4 className="text-lg font-semibold text-white mb-2">{contact.service}</h4>
                <div className="text-2xl font-bold text-red-500 mb-2">{contact.number}</div>
                <p className="text-gray-300 text-sm">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center mb-8">
            <Book className="h-8 w-8 text-orange-500 mr-3" />
            <h3 className="text-2xl font-bold text-white">Safety Resources</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safetyResources.map((resource, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 group">
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-500 transition-colors duration-200">
                  {resource.title}
                </h4>
                <p className="text-gray-300 mb-4">{resource.description}</p>
                <a
                  href={resource.link}
                  className="text-orange-500 hover:text-orange-400 font-semibold transition-colors duration-200"
                >
                  Learn More →
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500/10 to-red-600/10 rounded-2xl p-8 border border-orange-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-orange-500 mr-3" />
                <h3 className="text-2xl font-bold text-white">Group Riding Safety</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Riding in a group requires additional safety considerations. Follow these guidelines to ensure everyone's safety during club rides.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Attend pre-ride briefings and follow designated routes</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Maintain proper formation and spacing</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Use hand signals and communicate with other riders</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Never ride beyond your skill level or comfort zone</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Group of motorcycles riding safely"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-orange-500/20 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Our Safety Pledge</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              "As members of All Bikers Unity Community, we pledge to prioritize safety in all our riding activities. 
              We commit to wearing proper protective gear, following traffic laws, riding within our abilities, 
              and looking out for our fellow riders. Together, we ensure that every ride ends with everyone 
              returning home safely."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Safety;
