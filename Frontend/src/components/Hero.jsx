import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Users, Calendar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useInView,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";

const AnimatedNumber = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (ref.current) {
            ref.current.textContent = Math.floor(latest) + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [value, inView, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

const Hero = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("userLoggedIn") === "true",
  );

  useEffect(() => {
    const loginHandler = () =>
      setIsLoggedIn(sessionStorage.getItem("userLoggedIn") === "true");
    window.addEventListener("user-login-change", loginHandler);
    return () => window.removeEventListener("user-login-change", loginHandler);
  }, []);

  const scrollToEvents = () => {
    navigate("/events");
  };

  const handleJoinClick = () => {
    if (isLoggedIn) {
      return;
    } else {
      navigate("/signup");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950"
    >
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
        >
          <source src="https://videos.pexels.com/video-files/856190/856190-hd_1280_720_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/55 via-slate-950/70 to-orange-900/55 backdrop-blur-[3px]"></div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="mb-6 sm:mb-8 pt-16 sm:pt-20 lg:pt-24">
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight"
          >
            <span className="block text-white bg-clip-text bg-gradient-to-r from-white via-orange-100 to-white px-2">
              Bikers Unity Calls
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-2xl sm:max-w-3xl mx-auto px-2 leading-relaxed font-light"
          >
            Where passion meets the pavement. Join a community of riders across
            India who share the love for the open road, adventure, and the
            unbreakable bonds forged on two wheels.
          </motion.p>
        </div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 px-2"
        >
          <motion.div
            variants={statsVariants}
            whileHover={{ y: -5, borderColor: "rgba(249, 115, 22, 0.4)" }}
            className="bg-black/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-orange-500/20 transition-colors duration-300"
          >
            <Users className="h-8 w-8 sm:h-12 sm:w-12 text-orange-500 mx-auto mb-3 sm:mb-4" />
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
              <AnimatedNumber value={500} suffix="+" />
            </div>
            <div className="text-sm sm:text-base text-gray-400 font-medium uppercase tracking-wider">
              Members
            </div>
          </motion.div>
          <motion.div
            variants={statsVariants}
            whileHover={{ y: -5, borderColor: "rgba(249, 115, 22, 0.4)" }}
            className="bg-black/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-orange-500/20 transition-colors duration-300"
          >
            <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-orange-500 mx-auto mb-3 sm:mb-4" />
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
              <AnimatedNumber value={10} suffix="+" />
            </div>
            <div className="text-sm sm:text-base text-gray-400 font-medium uppercase tracking-wider">
              Events This Year
            </div>
          </motion.div>
          <motion.div
            variants={statsVariants}
            whileHover={{ y: -5, borderColor: "rgba(249, 115, 22, 0.4)" }}
            className="bg-black/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-orange-500/20 sm:col-span-2 lg:col-span-1 transition-colors duration-300"
          >
            <Shield className="h-8 w-8 sm:h-12 sm:w-12 text-orange-500 mx-auto mb-3 sm:mb-4" />
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
              <AnimatedNumber value={4} suffix="+" />
            </div>
            <div className="text-sm sm:text-base text-gray-400 font-medium uppercase tracking-wider">
              Years Strong
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-2"
        >
          {!isLoggedIn && (
            <motion.button
              whileHover={{
                scale: 1.05,
                shadow: "0 10px 25px -5px rgba(249, 115, 22, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleJoinClick}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Join Our Community</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
          )}
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 1)",
              color: "rgba(0, 0, 0, 1)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToEvents}
            className={`w-full sm:w-auto border-2 border-white text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 ${isLoggedIn ? "bg-white/10" : ""}`}
          >
            View Upcoming Rides
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 2,
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 sm:h-3 bg-orange-500 rounded-full mt-1.5 sm:mt-2"
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
