"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Menu, X, Home, User, Briefcase, LayoutGrid, GraduationCap, Send, Sun, Moon, Award, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "skills", label: "Skills", icon: LayoutGrid },
  { id: "contact", label: "Contact", icon: Send },
];

const socialLinks = [
  { src: "/linkedin.svg", label: "LinkedIn", href: "https://www.linkedin.com/in/minula-vihanga-9031b4293" },
  { src: "/github.svg", label: "GitHub", href: "https://github.com/minulavihanga2001" },
  { src: "/gmail.svg", label: "Email", href: "mailto:minulavihanga70@gmail.com" },
  { src: "/instagram.svg", label: "Instagram", href: "https://www.instagram.com/minula_v/" },
  { src: "/facebook.svg", label: "Facebook", href: "https://www.facebook.com/minula.vihanga.79" },
];

const phrases = ["Minula Vihanga", "a Web Developer", "an AI Enthusiast"];

export default function FixedSidebar() {
  const { isDark, toggleTheme, isVoiceEnabled, setIsVoiceEnabled } = useTheme();

  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [time, setTime] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Clock Logic for Mobile Header
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setDisplayText(
        isDeleting
          ? fullText.substring(0, displayText.length - 1)
          : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 35 : 70);

      if (!isDeleting && displayText === fullText) {
        setTypingSpeed(1000);
        setIsDeleting(true);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(200);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed]);

  return (
    <aside className="w-full lg:w-[350px] xl:w-[400px] 2xl:w-[450px] lg:fixed lg:left-6 xl:left-8 2xl:left-10 lg:top-8 lg:bottom-8 lg:h-[calc(100vh-4rem)] px-4 pt-6 pb-2 lg:p-0 z-50 flex flex-col">

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
            <span className="text-[var(--muted-foreground)] text-sm font-medium tracking-wide">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
            <span className="text-[var(--foreground)] opacity-80 font-mono text-base">{time}</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-12 h-12 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-lg flex items-center justify-center text-[var(--foreground)] opacity-70 hover:opacity-100 transition-all cursor-pointer relative z-[60]"
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
                    className="fixed inset-0 bg-white/20 backdrop-blur-md z-[45]"
                  />

                  <motion.div
                    key="mobile-nav-panel"
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className={`absolute top-14 right-0 w-56 backdrop-blur-2xl rounded-xl overflow-hidden py-3 z-50 border transition-all duration-300 ${
                      isDark 
                        ? "bg-gradient-to-br from-white/[0.08] via-white/[0.01] to-white/[0.06] border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.15),0_20px_40px_rgba(0,0,0,0.3)]" 
                        : "bg-gradient-to-b from-white/80 via-white/50 to-black/5 border-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_15px_30px_rgba(0,0,0,0.05)]"
                    }`}
                  >
                    <div className="flex flex-col">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="flex items-center gap-4 px-5 py-3 hover:bg-primary/10 hover:text-primary transition-all duration-200 text-left w-full group cursor-pointer"
                          >
                            <Icon size={18} className="text-[var(--foreground)] opacity-70 group-hover:text-primary group-hover:opacity-100 transition-all" />
                            <span className="text-[var(--foreground)] opacity-80 group-hover:text-primary group-hover:opacity-100 text-sm font-medium tracking-wide transition-all">{item.label}</span>
                          </button>
                        );
                      })}

                      {/* Theme & Sound Toggles in Menu */}
                      <div className="mt-2 pt-3 px-3 flex justify-between items-center gap-3">
                        {/* Theme Toggle Icon Button */}
                        <button
                          onClick={toggleTheme}
                          style={{ borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)' }}
                          className={`flex-1 flex items-center justify-center h-10 rounded-xl transition-all cursor-pointer border ${
                            isDark 
                              ? "bg-white/[0.04] hover:bg-white/[0.08] hover:border-primary/40 text-primary" 
                              : "bg-white/40 hover:bg-white/70 hover:border-[#006b2b]/30 text-[#006b2b]"
                          }`}
                          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                          {isDark ? <Sun size={16} className="text-primary" /> : <Moon size={16} className="text-[#006b2b]" />}
                        </button>

                        {/* Sound Toggle Icon Button */}
                        <button
                          onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                          style={{ borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)' }}
                          className={`flex-1 flex items-center justify-center h-10 rounded-xl transition-all cursor-pointer border ${
                            isDark 
                              ? "bg-white/[0.04] hover:bg-white/[0.08] hover:border-primary/40 text-primary" 
                              : "bg-white/40 hover:bg-white/70 hover:border-[#006b2b]/30 text-[#006b2b]"
                          }`}
                          title={isVoiceEnabled ? "Mute Bot Sounds" : "Enable Bot Sounds"}
                        >
                          {isVoiceEnabled ? (
                            <Volume2 size={16} className={isDark ? "text-primary" : "text-[#006b2b]"} />
                          ) : (
                            <VolumeX size={16} className="opacity-50" />
                          )}
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
        style={{ borderColor: isDark ? "black" : "var(--border)", borderWidth: "4px" }}
        className={`h-full min-h-[70vh] lg:min-h-0 w-full bg-card rounded-xl overflow-hidden relative flex flex-col transition-all border-solid lg:flex-1 ${isDark ? "shadow-2xl" : "shadow-md"}`}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Image.png"
            alt="Minula Vihanga"
            fill
            className={`object-cover object-top transition-all duration-300 ${isDark ? "brightness-[0.7] contrast-[1.1] bg-black" : "brightness-[0.9] bg-[var(--card)]"}`}
            priority
          />
          {/* Gradient Overlay (Vignette) */}
          <div className={`absolute inset-0 z-10 transition-all duration-300 ${isDark ? "bg-gradient-to-t from-black via-black/40 to-transparent" : "bg-gradient-to-t from-[var(--border)]/75 via-[var(--border)]/40 to-transparent from-0% via-18% to-38%"}`} />
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

            <div className="lg:hidden flex-1"></div>

            {/* Social Links Side Rail */}
            <div className="flex flex-col gap-4 lg:mr-[-16px] mr-[-8px]">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center p-2.5 backdrop-blur-xl transition-all cursor-pointer border ${isDark ? "bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.1] border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_1px_rgba(0,0,0,0.15),0_4px_10px_rgba(0,0,0,0.2)] hover:from-white/[0.15] hover:to-white/[0.05] hover:border-primary/40" : "bg-gradient-to-b from-white/50 via-white/20 to-black/5 border-black/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.03),0_4px_10px_rgba(0,0,0,0.04)] hover:from-white/75 hover:to-white/35 hover:border-black/25"}`}
                  title={social.label}
                >
                  <div className="relative w-full h-full animate-none">
                    <Image
                      src={social.src}
                      alt={social.label}
                      fill
                      className={`object-contain transition-all duration-300 ${isDark ? "brightness-200 invert" : "opacity-75 hover:opacity-100"}`}
                    />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-4 lg:space-y-6 pb-2 lg:pb-0">
            <div className="space-y-2 lg:space-y-3">
              <div className={`inline-flex items-center gap-2 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-full text-[10px] lg:text-xs font-medium w-fit border ${isDark ? "bg-black/75 border-white/10 text-white" : "bg-[var(--border)] border-[var(--border)] text-[var(--foreground)]"}`}>
                <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-primary animate-pulse" />
                Available for Work
              </div>
              <h2 className={`text-2xl lg:text-4xl font-bold leading-tight ${isDark ? "text-white" : "text-black"}`}>
                {"Hey, I'm"} <br />
                <span className={`block ${isDark ? "text-white/40" : "text-zinc-800"}`}>
                  {displayText}
                  <span className={`inline-block w-[2px] h-[0.8em] ml-1 animate-pulse align-middle ${isDark ? "bg-white" : "bg-zinc-800"}`} />
                </span>
              </h2>
              <p className={`text-[10px] lg:text-sm max-w-[350px] leading-relaxed ${isDark ? "text-white/60" : "text-zinc-800 font-medium"}`}>
                Full-Stack Developer focused on modern JavaScript frameworks and robust Java backends.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 lg:gap-3 items-center">
              <motion.button
                onClick={() => scrollToSection("contact")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={isDark ? "px-4 py-2 lg:px-5 lg:py-2.5 bg-primary/10 backdrop-blur-md border border-primary text-primary rounded-full text-xs lg:text-sm font-medium flex items-center gap-2 hover:bg-primary/20 transition-all cursor-pointer tracking-wide" : "px-4 py-2 lg:px-5 lg:py-2.5 border-[0.5px] rounded-full text-xs lg:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md bg-gradient-to-b from-white/65 via-white/35 to-white/15 border-white/30 text-[#00a83c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_12px_rgba(255,255,255,0.15)] hover:from-white/80 hover:to-white/40 hover:border-white/50 hover:shadow-[0_6px_16px_rgba(255,255,255,0.25)] tracking-wide"}
              >
                <Send size={14} className={isDark ? "lg:w-4 lg:h-4 text-primary" : "lg:w-4 lg:h-4 text-[#00a83c]"} />
                {"Contact Me"}
              </motion.button>

              <motion.a
                href="/Minula_CV.pdf"
                download="Minula_CV.pdf"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={isDark ? "px-4 py-2 lg:px-5 lg:py-2.5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full text-xs lg:text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer" : "px-4 py-2 lg:px-5 lg:py-2.5 border-[0.5px] border-white/20 rounded-full text-xs lg:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md bg-gradient-to-b from-white/60 via-white/30 to-white/10 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_10px_rgba(255,255,255,0.1)] hover:from-white/85 hover:to-white/45 hover:border-white/40"}
              >
                <Download size={14} className={isDark ? "lg:w-4 lg:h-4" : "lg:w-4 lg:h-4 text-black"} />
                Download CV
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
