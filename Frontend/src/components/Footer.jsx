import React from "react";
import {
  Bike,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Globe,
  ArrowRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { motion } from "framer-motion";
import cortexLogo from "../assets/gallery/cortexlogo.png";

gsap.registerPlugin(ScrollToPlugin);

const Footer = () => {
  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Events", href: "/events" },
    { name: "Membership", href: "#membership" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "#contact" },
  ];

  const emergencyContacts = [
    { name: "Child Abuse & Safety", number: "1098" },
    { name: "Emergency Response", number: "112" },
    { name: "Ambulance", number: "102" },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    if (href === "#contact") {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: "max" },
        ease: "power3.inOut",
      });
      return;
    }
    const target = href.startsWith("#") ? href : `#${href}`;
    const element = document.querySelector(target);
    if (element) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: target, offsetY: 80 },
        ease: "power3.inOut",
      });
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          <motion.div variants={fadeIn} className="lg:col-span-2">
            <div className="mb-10">
              <div className="flex items-center space-x-4 mb-8">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className="relative w-14 h-14"
                >
                  <img
                    src="/logo copy copy.jpg"
                    alt="Bikers Unity Calls Logo"
                    className="w-14 h-14 rounded-full object-cover border-2 border-orange-500/50 shadow-lg shadow-orange-500/10"
                  />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Bikers Unity Calls
                  </h3>
                  <p className="text-sm text-orange-500 font-medium tracking-wide">
                    Ride Together, Stand Together
                  </p>
                </div>
              </div>
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed text-lg">
                Founded in 2025, we're India's largest group of motorcycle
                community dedicated to safe riding, brotherhood, and Inspiring
                change for a better tomorrow.
              </p>
              <div className="flex space-x-4 mb-10">
                {[
                  { icon: Facebook, href: "#", name: "Facebook" },
                  {
                    icon: Instagram,
                    href: "https://www.instagram.com/buc_india",
                    name: "Instagram",
                  },
                  {
                    icon: Twitter,
                    href: "https://x.com/Buc_India",
                    name: "Twitter",
                  },
                  {
                    icon: Youtube,
                    href: "https://www.youtube.com/@BucIndia",
                    name: "YouTube",
                  },
                ].map((social) => (
                  <motion.a
                    key={`buc-${social.name}`}
                    href={social.href}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(249, 115, 22, 1)",
                      color: "white",
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-gray-900 p-3.5 rounded-xl text-gray-400 transition-all duration-300 border border-gray-800"
                    aria-label={`BUC ${social.name}`}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            <motion.div variants={fadeIn}>
              <div className="flex items-center space-x-4 mb-8">
                <div className="relative w-14 h-14">
                  <div className="w-14 h-14 rounded-full bg-white p-2.5 flex items-center justify-center shadow-lg border border-white/10">
                    <img
                      src="https://static.wixstatic.com/media/2d0007_ccad2163f88540659e8212ff5138666c~mv2.png/v1/fit/w_2500,h_1330,al_c/2d0007_ccad2163f88540659e8212ff5138666c~mv2.png"
                      alt="Humanity Calls Logo"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Humanity Calls
                  </h3>
                  <p className="text-sm text-blue-500 font-medium tracking-wide">
                    Compassion & Action
                  </p>
                </div>
              </div>
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                Founded in 2020, Humanity Calls is a non-profit initiative built
                on the belief that service to humanity is the highest form of
                responsibility.
              </p>
              <div className="flex space-x-4">
                {[
                  {
                    icon: Facebook,
                    href: "https://www.facebook.com/HumanityGcalls/",
                    name: "Facebook",
                  },
                  {
                    icon: Instagram,
                    href: "https://www.instagram.com/humanitycalls_?igshid=MXBmb2d5MDFudm9waw%3D%3D",
                    name: "Instagram",
                  },
                  {
                    icon: Twitter,
                    href: "https://x.com/Humanitycalls1",
                    name: "Twitter",
                  },
                  {
                    icon: Youtube,
                    href: "https://www.youtube.com/@humanitycalls",
                    name: "YouTube",
                  },
                  {
                    icon: Globe,
                    href: "https://www.humanitycalls.org",
                    name: "Website",
                  },
                ].map((social) => (
                  <motion.a
                    key={`hc-${social.name}`}
                    href={social.href}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(59, 130, 246, 1)",
                      color: "white",
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-gray-900 p-3.5 rounded-xl text-gray-400 transition-all duration-300 border border-gray-800"
                    aria-label={`Humanity Calls ${social.name}`}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeIn}>
            <h4 className="text-xl font-bold text-white mb-8 pb-3 border-b-2 border-orange-500 w-fit">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 10 }}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="group flex items-center text-gray-400 hover:text-orange-500 transition-all duration-300 font-medium"
                  >
                    <ArrowRight className="h-4 w-4 mr-0 group-hover:mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeIn}>
            <h4 className="text-xl font-bold text-white mb-8 pb-3 border-b-2 border-orange-500 w-fit">
              Contact Us
            </h4>
            <div className="space-y-6">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start space-x-4 text-gray-400 group"
              >
                <MapPin className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed group-hover:text-white transition-colors">
                  Bengaluru, Karnataka
                  <br />
                  India 560001
                </span>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-4 text-gray-400 group"
              >
                <Phone className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="text-sm group-hover:text-white transition-colors">
                  +91 88677 18080
                </span>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-4 text-gray-400 group"
              >
                <Mail className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="text-sm truncate group-hover:text-white transition-colors">
                  bikersunitycallsindia@gmail.com
                </span>
              </motion.div>
            </div>

            <h4 className="text-xl font-bold text-white mt-12 mb-6 pb-3 border-b-2 border-red-500 w-fit">
              Emergency
            </h4>
            <div className="space-y-5">
              {emergencyContacts.map((contact) => (
                <div key={contact.name} className="flex flex-col space-y-1.5">
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                    {contact.name}
                  </span>
                  <motion.a
                    href={`tel:${contact.number}`}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="text-orange-500 font-black text-2xl hover:text-red-500 transition-colors flex items-center gap-3 tracking-tighter"
                  >
                    <Phone className="h-5 w-5" />
                    {contact.number}
                  </motion.a>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-900 mt-20 pt-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            <div className="flex flex-col items-center md:items-start space-y-4">
              <p className="text-gray-500 text-sm font-medium">
                © 2026 Bikers Unity Calls. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {["Privacy Policy", "Terms of Service", "Code of Conduct"].map(
                (item) => (
                  <motion.a
                    key={item}
                    href="#"
                    whileHover={{ y: -2, color: "rgba(249, 115, 22, 1)" }}
                    className="text-gray-500 hover:text-orange-500 text-sm font-bold transition-all duration-200"
                  >
                    {item}
                  </motion.a>
                ),
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
