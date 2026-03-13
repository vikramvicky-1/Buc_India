import React from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const buclogo = "/logo.jpg";

const Footer = () => {
  const quickLinks = [
    { name: "About", href: "#about" },
    { name: "Events", href: "/events" },
    { name: "Membership", href: "#membership" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "#contact" },
  ];

  const socialLinks = [
     { name: "Instagram", href: "https://www.instagram.com/buc_india" },
     { name: "Twitter", href: "https://x.com/Buc_India" },
     { name: "YouTube", href: "https://www.youtube.com/@BucIndia" },
     { name: "Facebook", href: "https://www.facebook.com/HumanityGcalls/" }
  ];

  const scrollToTop = () => {
    gsap.to(window, { duration: 1, scrollTo: 0, ease: "power4.inOut" });
  };

  return (
    <footer className="bg-carbon py-20 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-4 mb-8">
            <img src={buclogo} alt="Logo" className="w-16 h-16 rounded-full border border-copper/30" />
            <span className="font-heading text-4xl text-white uppercase tracking-tighter">BUC INDIA</span>
          </div>
          <p className="font-text text-steel-dim text-lg leading-relaxed max-w-md mb-8">
            India's premier riding community. Born from passion, driven by brotherhood, and committed to safety.
          </p>
          <div className="flex gap-6 mb-10">
            {socialLinks.map((social) => (
              <a 
                key={social.name} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-body text-xs uppercase tracking-widest text-steel-dim hover:text-white transition-colors"
              >
                {social.name}
              </a>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5">
             <span className="font-body text-[10px] tracking-[0.4em] text-copper uppercase mb-4 block font-bold">Humanity Calls</span>
             <div className="flex flex-col gap-3">
                <a 
                  href="https://www.facebook.com/HumanityGcalls/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-heading text-lg text-white/40 hover:text-white transition-all hover:tracking-widest flex items-center gap-3 group"
                >
                  <span className="w-1.5 h-1.5 bg-copper rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  FACEBOOK
                </a>
                <a 
                  href="https://www.instagram.com/humanitycalls_/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-heading text-lg text-white/40 hover:text-white transition-all hover:tracking-widest flex items-center gap-3 group"
                >
                  <span className="w-1.5 h-1.5 bg-copper rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  INSTAGRAM
                </a>
             </div>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-xl text-white uppercase mb-8 tracking-widest">Navigation</h4>
          <ul className="space-y-4">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="font-body text-sm uppercase tracking-widest text-steel-dim hover:text-white transition-colors">{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-xl text-white uppercase mb-8 tracking-widest">Contact</h4>
          <div className="space-y-4 font-body text-sm text-steel-dim tracking-widest">
            <p>Bengaluru, Karnataka</p>
            <p>+91 88677 18080</p>
            <a href="mailto:bikersunitycallsindia@gmail.com" className="hover:text-copper transition-colors">bikersunitycallsindia@gmail.com</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-body text-xs text-steel-dim uppercase tracking-widest">
          © {new Date().getFullYear()} Bikers Unity Calls. All rights reserved.
        </p>
        <button 
          onClick={scrollToTop}
          className="group flex items-center gap-4 font-body text-xs text-white uppercase tracking-[0.3em]"
        >
          Back To Top 
          <span className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-copper group-hover:border-copper transition-all duration-500">
            ↑
          </span>
        </button>
      </div>

      {/* Decorative Text */}
      <div className="absolute -bottom-20 -right-20 pointer-events-none opacity-5">
         <h2 className="font-heading text-[20vw] text-white leading-none">BUC</h2>
      </div>
    </footer>
  );
};

export default Footer;
