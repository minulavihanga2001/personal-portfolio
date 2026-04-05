"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import { useState, useEffect } from "react";

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
    <aside className="w-full lg:w-[450px] xl:w-[480px] lg:fixed lg:left-8 lg:top-8 lg:bottom-8 lg:h-[calc(100vh-4rem)] p-4 ml-4 lg:p-0 z-50">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{ borderColor: "black", borderWidth: "4px" }}
        className="h-full w-full bg-card rounded-xl overflow-hidden relative flex flex-col shadow-2xl transition-all border-solid"
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
        <div className="relative z-10 flex flex-col h-full p-8 justify-between">
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <Image
              src="/sidebar-logo.gif"
              alt="Logo"
              width={80}
              height={80}
              className="object-contain mt-[-20px] ml-[-20px]"
            />

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

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/75 border border-white/10 text-white text-xs font-medium w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Available for Work
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                Hey, I'm <br />
                <span className="text-white/40 block">
                  {displayText}
                  <span className="inline-block w-[3px] h-[0.8em] bg-white ml-1 animate-pulse align-middle" />
                </span>
              </h2>              <p className="text-white/60 text-xs lg:text-sm max-w-[350px] leading-relaxed">
                Full-Stack Developer focused on modern JavaScript frameworks and robust Java backends.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold flex items-center gap-2 green-glow"
              >
                <ArrowUpRight size={16} />
                Let's talk
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors"
              >
                <Download size={16} />
                Download CV
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
