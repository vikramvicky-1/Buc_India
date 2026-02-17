import React from 'react';
import { Heart, Loader as Road, Users, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Brotherhood',
      description: 'We believe in the unbreakable bonds formed between riders across India who share the same passion.'
    },
    {
      icon: Road,
      title: 'Adventure',
      description: 'Every ride is an opportunity to explore new horizons and create unforgettable memories.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Supporting each other on and off the road, building lasting friendships and connections across India.'
    },
    {
      icon: Trophy,
      title: 'Excellence',
      description: 'Promoting safe riding practices and maintaining the highest standards in everything we do.'
    }
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
    <section id="about" className="relative py-20 overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Group of motorcycle riders"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-950/75 to-black/80"></div>
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
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Mission</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Founded in 2025, Bikers Unity Calls has grown from a small group of motorcycle enthusiasts 
            to a thriving all-India community of riders who share a common love for the open road and the freedom it represents.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {values.map((value, index) => (
            <motion.div 
              key={index} 
              variants={fadeIn}
              whileHover={{ y: -10, borderColor: "rgba(249, 115, 22, 0.4)" }}
              className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-orange-500/20 transition-all duration-300 group"
            >
              <value.icon className="h-12 w-12 text-orange-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
              <p className="text-gray-300 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-orange-500/10 to-red-600/10 rounded-3xl p-8 md:p-12 border border-orange-500/20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Join Our Family</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Whether you're a seasoned rider with decades of experience or just starting your journey on two wheels, 
                you'll find a welcoming community here. We organize regular rides across India, safety workshops, charity events, 
                and social gatherings that bring our members together from all corners of the country.
              </p>
              <ul className="space-y-4 text-gray-300">
                {[
                  'Weekly group rides and touring adventures',
                  'Safety training and motorcycle maintenance workshops',
                  'Charity rides and community service projects',
                  'Annual rallies and motorcycle shows'
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                    <span className="font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-orange-500/10 rounded-3xl blur-2xl"></div>
              <img
                src="https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Group of bikers"
                className="relative rounded-2xl shadow-2xl border border-white/10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
