import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Book,
  Users,
  Phone,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const Safety = () => {
  const [pledgeText, setPledgeText] = useState("");
  const pledgeRef = useRef(null);
  const isPledgeInView = useInView(pledgeRef, { once: true, margin: "-100px" });
  const fullPledge = "As members of All Bikers Unity Community, we pledge to prioritize safety in all our riding activities. We commit to wearing proper protective gear, following traffic laws, riding within our abilities, and looking out for our fellow riders. Together, we ensure that every ride ends with everyone returning home safely.";

  useEffect(() => {
    if (isPledgeInView) {
      let index = 0;
      const speed = 15;

      const animate = () => {
        if (index <= fullPledge.length) {
          setPledgeText(fullPledge.substring(0, index));
          index++;
          setTimeout(animate, speed);
        }
      };

      animate();
    }
  }, [isPledgeInView]);
  const safetyTips = [
    {
      icon: Shield,
      title: "Protective Gear",
      description:
        "Always wear DOT-approved helmet, protective jacket, gloves, and boots.",
      tips: [
        "Helmet should fit snugly without pressure points",
        "Wear bright colors for better visibility",
        "Replace gear after any accident",
        "Check gear condition regularly",
      ],
    },
    {
      icon: AlertTriangle,
      title: "Road Awareness",
      description: "Stay alert and anticipate potential hazards on the road.",
      tips: [
        "Maintain safe following distance",
        "Check blind spots frequently",
        "Use turn signals early and clearly",
        "Avoid riding in bad weather when possible",
      ],
    },
    {
      icon: CheckCircle,
      title: "Pre-Ride Inspection",
      description: "Perform thorough bike inspection before every ride.",
      tips: [
        "Check tire pressure and tread",
        "Test brakes and lights",
        "Verify fluid levels",
        "Inspect chain and sprockets",
      ],
    },
  ];

  const emergencyContacts = [
    {
      service: "Child Abuse & Safety",
      number: "1098",
      description: "Dedicated helpline for children in distress",
    },
    {
      service: "Emergency Services",
      number: "112",
      description: "For immediate life-threatening emergencies",
    },
    {
      service: "Community Emergency Line",
      number: "88677 18080",
      description: "community member assistance and roadside help",
    },
    {
      service: "Roadside Assistance",
      number: "1033-HELP",
      description: "Motorcycle towing and breakdown assistance",
    },
  ];

  const safetyResources = [
    {
      title: "Motorcycle Safety Foundation (MSF)",
      description: "Comprehensive riding courses and safety resources",
      link: "#",
    },
    {
      title: "Advanced Rider Training",
      description: "Improve your skills with professional instruction",
      link: "#",
    },
    {
      title: "Weather Riding Guide",
      description: "Tips for riding safely in various weather conditions",
      link: "#",
    },
    {
      title: "Group Riding Etiquette",
      description: "Best practices for safe group riding",
      link: "#",
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section id="safety" className="relative py-20 overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Motorcycle safety background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-950/85 to-black/90"></div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ride{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              Safe
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Safety is our top priority. Learn essential riding tips, emergency
            procedures, and best practices to ensure every ride is a safe one.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {safetyTips.map((tip, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ y: -10, borderColor: "rgba(249, 115, 22, 0.4)" }}
              className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 border border-gray-800 transition-all duration-300"
            >
              <tip.icon className="h-12 w-12 text-orange-500 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">{tip.title}</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">{tip.description}</p>
              <ul className="space-y-3">
                {tip.tips.map((item, tipIndex) => (
                  <motion.li 
                    key={tipIndex} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (tipIndex * 0.1) }}
                    className="flex items-start text-gray-400"
                  >
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                    <span className="text-sm font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-red-900/10 border border-red-500/20 rounded-3xl p-8 md:p-12 mb-16 backdrop-blur-sm"
        >
          <div className="flex items-center mb-8">
            <Phone className="h-8 w-8 text-red-500 mr-4" />
            <h3 className="text-3xl font-bold text-white tracking-tight">
              Emergency Contacts
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-black/60 rounded-2xl p-6 border border-red-500/10"
              >
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {contact.service}
                </h4>
                <div className="text-2xl font-black text-red-500 mb-3 tracking-tighter">
                  {contact.number}
                </div>
                <p className="text-gray-400 text-xs font-medium leading-relaxed">{contact.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center mb-10"
          >
            <Book className="h-8 w-8 text-orange-500 mr-4" />
            <h3 className="text-3xl font-bold text-white tracking-tight">Safety Resources</h3>
          </motion.div>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {safetyResources.map((resource, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ x: 10, borderColor: "rgba(249, 115, 22, 0.4)" }}
                className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 transition-all duration-300 group"
              >
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors duration-200">
                  {resource.title}
                </h4>
                <p className="text-gray-400 mb-6 leading-relaxed">{resource.description}</p>
                <a
                  href={resource.link}
                  className="inline-flex items-center text-orange-500 hover:text-orange-400 font-bold transition-colors duration-200"
                >
                  Learn More 
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-orange-500/10 to-red-600/10 rounded-3xl p-8 md:p-12 border border-orange-500/20 backdrop-blur-md"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-orange-500 mr-4" />
                <h3 className="text-3xl font-bold text-white tracking-tight">
                  Group Riding Safety
                </h3>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed text-lg font-light">
                Riding in a group requires additional safety considerations.
                Follow these guidelines to ensure everyone's safety during club
                rides.
              </p>
              <ul className="space-y-4">
                {[
                  "Attend pre-ride briefings and follow designated routes",
                  "Maintain proper formation and spacing",
                  "Use hand signals and communicate with other riders",
                  "Never ride beyond your skill level or comfort zone"
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start text-gray-400"
                  >
                    <CheckCircle className="h-6 w-6 text-green-500/80 mr-4 mt-0.5 flex-shrink-0" />
                    <span className="text-lg font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-orange-500/5 rounded-3xl blur-3xl"></div>
              <img
                src="https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Group of motorcycles riding safely"
                className="relative rounded-2xl shadow-2xl border border-white/5"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          ref={pledgeRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 md:p-12 border border-orange-500/30 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ClipboardCheck size={120} className="text-orange-500" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-8 flex items-center justify-center">
            <ClipboardCheck className="h-8 w-8 text-orange-500 mr-4" />
            Our Safety Pledge
          </h3>
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl md:text-3xl font-medium text-gray-200 leading-relaxed italic min-h-[150px]">
              "{pledgeText}"
              <span className="inline-block w-1 h-8 bg-orange-500 ml-1 animate-pulse"></span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Safety;
