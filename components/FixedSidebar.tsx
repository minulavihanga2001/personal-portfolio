"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Download, Menu, X, Home, User, Briefcase, LayoutGrid, GraduationCap, Send, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "skills", label: "Skills", icon: LayoutGrid },
  { id: "contact", label: "Contact", icon: Send },
];

const socialLinks = [
  { src: "/facebook.svg", label: "Facebook", href: "directapp" },
  { src: "/instagram.svg", label: "Instagram", href: "directapp" },
  { src: "/linkedin.svg", label: "LinkedIn", href: "directapp" },
  { src: "/github.svg", label: "GitHub", href: "directapp" },
  { src: "/gmail.svg", label: "Email", href: "directapp" },
];

const phrases = ["Minula Vihanga", "a Web Developer", "an AI Enthusiast"];

export default function FixedSidebar() {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [time, setTime] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Clock Logic for Mobile Header
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setDisplayText(isDeleting
        ? fullText.substring(0, displayText.length - 1)
        : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 35 : 70);

      if (!isDeleting && displayText === fullText) {
        setTypingSpeed(1000); // Wait at the end of the phrase
        setIsDeleting(true);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(200); // Delay before typing next phrase
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed]);

  return (
    <aside className="w-full lg:w-[450px] xl:w-[480px] lg:fixed lg:left-8 lg:top-8 lg:bottom-8 lg:h-[calc(100vh-4rem)] px-4 pt-6 pb-2 lg:p-0 z-50 flex flex-col">
      
      {/* Mobile Header (Hidden on Desktop) */}
      <div className="flex lg:hidden justify-between items-center w-full mb-6 relative z-50">
        <Image
          src="/sidebar-logo.gif"
          alt="Logo"
          width={60}
          height={60}
          className="object-contain"
        />
        <div className="flex items-center gap-4">
          <div className="text-right flex flex-col justify-center">
            <span className="text-[#abb2bf] text-sm font-medium tracking-wide">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <span className="text-white/80 font-mono text-base">{time}</span>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-12 h-12 rounded-full bg-[#1c1d24] border border-[#2b2c30] shadow-lg flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer relative z-[60]"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Menu Overlay */}
            <AnimatePresence mode="wait">
              {isMenuOpen && (
                <>
                  {/* Global Backdrop Blur */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[45]"
                  />
                  
                  <motion.div
                    key="mobile-nav-panel"
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="absolute top-14 right-0 w-56 bg-[#1c1d24]/95 backdrop-blur-xl border border-[#2b2c30] rounded-xl shadow-2xl overflow-hidden py-3 z-50"
                  >
                    <div className="flex flex-col">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/5 transition-colors text-left"
                          >
                            <Icon size={18} className="text-primary/70" />
                            <span className="text-white/80 text-sm font-medium tracking-wide">{item.label}</span>
                          </button>
                        );
                      })}
                      
                      {/* Theme Toggle in Menu */}
                      <div className="border-t border-[#2b2c30] mt-2 pt-2 px-2">
                         <button 
                           onClick={() => setIsDarkMode(!isDarkMode)}
                           className="w-full flex items-center justify-between px-3 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all"
                         >
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-primary/70">
                                {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                              </div>
                              <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                           </div>
                           <div className={`w-8 h-4 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-primary/20' : 'bg-white/10'}`}>
                              <div className={`w-2 h-2 rounded-full transition-transform ${isDarkMode ? 'bg-primary translate-x-4' : 'bg-white translate-x-0'}`}></div>
                           </div>
                         </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{ borderColor: "black", borderWidth: "4px" }}
        className="h-full min-h-[70vh] lg:min-h-0 w-full bg-card rounded-xl overflow-hidden relative flex flex-col shadow-2xl transition-all border-solid lg:flex-1"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Image.png"
            alt="Minula Vihanga"
            fill
            className="object-cover object-top brightness-[0.7] contrast-[1.1] bg-black"
            priority
          />
          {/* Gradient Overlay (Vignette) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col flex-1 px-5 pt-8 pb-8 lg:p-8">
          {/* Top Section */}
          <div className="flex justify-between items-start w-full mb-8">
            <div className="hidden lg:block">
              <Image
                src="/sidebar-logo.gif"
                alt="Logo"
                width={80}
                height={80}
                className="object-contain mt-[-20px] ml-[-20px]"
              />
            </div>
            
            <div className="lg:hidden flex-1"></div> {/* Spacer for mobile to push socials right */}

            {/* Social Links Side Rail */}
            <div className="flex flex-col gap-4">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                  className="w-10 h-10 rounded-full bg-[#1c1d24] border border-[#2b2c30] flex items-center justify-center p-2.5 hover:border-primary/50 transition-all"
                  title={social.label}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={social.src}
                      alt={social.label}
                      fill
                      className="object-contain brightness-200 invert"
                    />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-4 lg:space-y-6 pb-2 lg:pb-0">
            <div className="space-y-2 lg:space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-full bg-black/75 border border-white/10 text-white text-[10px] lg:text-xs font-medium w-fit">
                <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-primary animate-pulse" />
                Available for Work
              </div>
              <h2 className="text-2xl lg:text-4xl font-bold text-white leading-tight">
                Hey, I'm <br />
                <span className="text-white/40 block">
                  {displayText}
                  <span className="inline-block w-[2px] h-[0.8em] bg-white ml-1 animate-pulse align-middle" />
                </span>
              </h2>
              <p className="text-white/60 text-[10px] lg:text-sm max-w-[350px] leading-relaxed">
                Full-Stack Developer focused on modern JavaScript frameworks and robust Java backends.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 lg:gap-3 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 lg:px-5 lg:py-2.5 bg-primary text-primary-foreground rounded-full text-xs lg:text-sm font-semibold flex items-center gap-2 green-glow"
              >
                <ArrowUpRight size={14} className="lg:w-4 lg:h-4" />
                Let's talk
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 lg:px-5 lg:py-2.5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full text-xs lg:text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors"
              >
                <Download size={14} className="lg:w-4 lg:h-4" />
                Download CV
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
