"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Settings, Send, ArrowUp, Star, Home, User, Briefcase, Sun, GraduationCap, LayoutGrid, ExternalLink, Code2, Terminal, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function MainContent() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll Spy Logic
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Detect when section is roughly in the top part of the screen
      threshold: 0
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Watch all sections that have nav IDs
    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "skills", label: "Skills", icon: LayoutGrid },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "contact", label: "Contact", icon: Send },
  ];

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>("web-apps");
  const [hoveredAccordionId, setHoveredAccordionId] = useState<string | null>(null);
  const [activeProjectName, setActiveProjectName] = useState<string | null>(null);

  const projectsData = [
    {
      id: "web-apps",
      title: "Web Applications",
      description: "I design modern, responsive web applications that balance creativity with usability, making sure your digital presence feels seamless and memorable.",
      images: ["/project1-1.png", "/project1-2.png"],
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      projects: [
        {
          name: "ZenPath : Online Mental Health Support System",
          role: "Team Leader",
          thumbnail: "/zenpath/1.png",
          desc: "A full-stack platform designed to connect patients, therapists, and admins in a secure and seamless environment. Key features include role-based dashboards, therapist verification, patient onboarding, session scheduling, in-app chat, and real-time video consultations powered by Jitsi Meet API. The system also integrates a Zen Wallet with Stripe payments, enabling patients to purchase and redeem Zen Coins for therapy sessions.",
          tech: ["React", "Node.js", "Express.js", "TailwindCSS", "MongoDB", "Stripe API", "Jitsi API"],
          tools: ["VS Code", "Postman", "MongoDB Atlas", "Git", "GitHub"],
          github: "https://github.com/minula-vihanga/zenpath",
          displays: [
            { src: "/zenpath/2.png", label: "Feature Display 01" },
            { src: "/zenpath/3.png", label: "Feature Display 02" },
            { src: "/zenpath/4.png", label: "Feature Display 03" },
            { src: "/zenpath/5.png", label: "Feature Display 04" }
          ]
        }
      ]
    },
    {
      id: "ai-ml",
      title: "AI and ML Related Projects",
      description: "Leveraging cutting-edge machine learning models to solve complex predictive and generative challenges in real-world scenarios.",
      images: ["/project2-1.png", "/project2-2.png"],
      tags: ["Python", "TensorFlow", "OpenAI"],
      projects: [
        {
          name: "Sentiment Analyzer Pro",
          role: "Solo Developer",
          thumbnail: "/projects/sentiment/thumb.png",
          desc: "Extracting emotional context from social media feeds using NLP and deep learning.",
          tech: ["Python", "TensorFlow", "scikit-learn"],
          tools: ["Jupyter", "Git"],
          github: "#",
          displays: [
            { src: "/projects/sentiment/results.png", label: "Analysis Results" },
            { src: "/projects/sentiment/model.png", label: "Model Performance" }
          ]
        }
      ]
    },
    {
      id: "iot",
      title: "IoT Related Projects",
      description: "Building smart, connected systems that bridge the gap between hardware and software, specializing in real-time data monitoring and control.",
      images: ["/project3-1.png", "/project3-2.png"],
      tags: ["Arduino", "MQTT", "C++"],
      projects: [
        {
          name: "Smart Agriculture Monitor",
          role: "Developer",
          thumbnail: "/projects/iot/thumb.png",
          desc: "Remote soil and weather tracking for precision farming with real-time data visualization.",
          tech: ["Arduino", "C++", "MQTT", "ESP32"],
          tools: ["Thonny", "Git"],
          github: "#",
          displays: [
            { src: "/projects/iot/live.png", label: "Live Monitor" },
            { src: "/projects/iot/node.png", label: "Field Node" }
          ]
        }
      ]
    }
  ];

  return (
    <main className="flex-1 lg:ml-[500px] xl:ml-[550px] min-h-screen px-4 sm:px-8 py-8 lg:pt-10 lg:p-16 lg:pr-48 xl:pr-60 space-y-10 lg:space-y-16 relative transition-all w-full overflow-hidden lg:overflow-visible">
      {/* Fixed Top-Right Header (Date/Time) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-12 right-6 lg:right-16 xl:right-24 text-right z-50 pointer-events-none hidden lg:block"
      >
        <p className="text-muted-foreground text-sm font-medium">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
        <p className="text-white/80 font-mono text-xl">{time}</p>
      </motion.div>

      {/* Top Header (Identity) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-15 h-15 rounded-full bg-white/5 border border-[#2b2c30] flex items-center justify-center overflow-hidden">
            <Image
              src="/mini-image1.png"
              alt="Minula"
              width={70}
              height={70}
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg mb-1 mt-[-4px]">Minula Vihanga</h1>
            <p className="text-muted-foreground text-xs uppercase tracking-widest">Web Developer and AI Enthusiast</p>
          </div>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section id="home" className="relative flex flex-col justify-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative z-10"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-[1.2] tracking-tight">
            I build software solutions that <br />
            solve <span className="text-primary"> real-world </span>
            problems.
          </h2>

          {/* Animated Code Snippet Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-6 lg:mt-8 bg-[#1c1d24] border border-[#2b2c30] rounded-xl p-4 lg:p-5 w-full max-w-xl shadow-2xl overflow-hidden relative group"
          >
            {/* Mac-style window controls */}
            <div className="flex gap-2 mb-3 relative z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
            </div>

            <pre className="text-[10px] lg:text-[12px] font-[family-name:var(--font-jetbrains-mono)] whitespace-pre-wrap leading-relaxed text-[#abb2bf] relative z-10">
              <code>
                <span className="text-[#c678dd]">class</span> <span className="text-[#e5c07b]">Minula</span> <span className="text-[#c678dd]">extends</span> <span className="text-[#e5c07b]">Developer</span> {'{\n'}
                {'  '}<span className="text-[#61afef]">constructor</span>() {'{\n'}
                {'    '}<span className="text-[#c678dd]">super</span>();{'\n'}
                {'    '}<span className="text-[#c678dd]">this</span>.<span className="text-[#e06c75]">stack</span> <span className="text-[#56b6c2]">=</span> [<span className="text-[#98c379]">"Full Stack"</span>, <span className="text-[#98c379]">"Web"</span>, <span className="text-[#98c379]">"Mobile"</span>];{'\n'}
                {'    '}<span className="text-[#c678dd]">this</span>.<span className="text-[#e06c75]">interests</span> <span className="text-[#56b6c2]">=</span> [<span className="text-[#98c379]">"AI"</span>, <span className="text-[#98c379]">"Tech"</span>, <span className="text-[#98c379]">"Problem Solving"</span>];{'\n'}
                {'  }'}{'\n\n'}
                {'  '}<span className="text-[#61afef]">build</span>() {'{\n'}
                {'    '}<span className="text-[#c678dd]">return</span> <span className="text-[#98c379]">"Crafting ideas into reality..."</span>;{'\n'}
                {'  }'}{'\n'}
                {'}'}{'\n\n'}
                <span className="text-[#c678dd]">const</span> <span className="text-[#e06c75]">me</span> <span className="text-[#56b6c2]">=</span> <span className="text-[#c678dd]">new</span> <span className="text-[#e5c07b]">Minula</span>();{'\n'}
                <span className="text-[#e06c75]">me</span>.<span className="text-[#61afef]">build</span>();
              </code>
            </pre>

            {/* Subtle glow effect behind code block */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#00de51]/5 blur-[80px] rounded-full pointer-events-none transition-all group-hover:bg-[#00de51]/10"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="pt-24 pb-32 border-t border-[#2b2c30]/50 relative">
        {/* Glow effect behind the section */}
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1c1d24]/50 border border-[#2b2c30] backdrop-blur-xl shadow-xl w-fit mb-10 relative z-10"
        >
          <User size={16} className="text-primary" />
          <span className="text-white text-xs font-bold tracking-[0.3em] uppercase mt-[2px]">ABOUT</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl relative z-10"
        >
          <h3 className="text-3xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            Every great thing begins with<br />
            a better story
          </h3>
          <p className="text-[#abb2bf] text-lg leading-relaxed text-justify">
            Hi, I'm Minula Vihanga, a software developer and AI enthusiast with a passion for building clean,
            user-friendly applications. My background in the sciences gives me a unique and analytical approach to
            problem-solving, a skill I now apply to crafting digital experiences with React, Next.js, and React Native. As a
            student at Plymouth, I am constantly learning and am currently diving deeper into the world of AI. I'm actively seeking
            opportunities to contribute to impactful projects and continue to grow as a developer. I'd love to connect!
          </p>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="pt-24 pb-32 border-t border-[#2b2c30]/50 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1c1d24]/50 border border-[#2b2c30] backdrop-blur-xl shadow-xl w-fit mb-16 relative z-10"
        >
          <Briefcase size={16} className="text-primary" />
          <span className="text-white text-xs font-bold tracking-[0.3em] uppercase mt-[2px]">PROJECTS</span>
        </motion.div>
        
        <div className="space-y-0 relative z-10 max-w-4xl">
          {projectsData.map((project, idx) => {
            const isExpanded = expandedId === project.id;
            const isHovered = hoveredAccordionId === project.id;

            return (
              <div 
                key={project.id} 
                className={`border-t border-[#2b2c30]/50 group cursor-pointer ${idx === projectsData.length - 1 ? 'border-b' : ''}`}
                onMouseEnter={() => setHoveredAccordionId(project.id)}
                onMouseLeave={() => setHoveredAccordionId(null)}
                onClick={() => {
                  setExpandedId(isExpanded ? null : project.id);
                  setActiveProjectName(null);
                }}
              >
                {/* Accordion Header */}
                <div className="py-8 lg:py-12 flex items-center justify-between transition-colors">
                  <h3 className={`text-3xl lg:text-5xl font-bold transition-all duration-500 font-sans tracking-tight ${isExpanded || isHovered ? 'text-white translate-x-4' : 'text-white/40'}`}>
                    {project.title}
                  </h3>
                  
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-[#2b2c30] flex items-center justify-center transition-all duration-500 ${isExpanded ? 'scale-110 border-primary shadow-[0_0_15px_rgba(0,222,81,0.2)]' : 'bg-transparent'}`}>
                    {isExpanded ? (
                      <motion.div initial={{ rotate: 0 }} animate={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                        <div className="w-4 h-[2px] bg-primary"></div>
                      </motion.div>
                    ) : (
                      <div className="relative w-4 h-4 flex items-center justify-center">
                        <div className="w-4 h-[2px] bg-white group-hover:bg-primary transition-colors"></div>
                        <div className="absolute w-[2px] h-4 bg-white group-hover:bg-primary transition-colors"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Accordion Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-12 lg:pb-20 pt-4 cursor-default" onClick={(e) => e.stopPropagation()}>
                        <AnimatePresence mode="wait">
                          {!activeProjectName ? (
                            /* --- GRID VIEW (Small Cards) --- */
                            <motion.div
                              key="grid-view"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3 }}
                              className="w-full px-4"
                            >
                              <p className="text-[#abb2bf] text-lg lg:text-xl leading-relaxed mb-10 max-w-3xl">
                                {project.description}
                              </p>

                              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                                {project.projects?.map((p, pIdx) => (
                                  <motion.div
                                    key={pIdx}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    onClick={() => setActiveProjectName(p.name)}
                                    className="group/card bg-[#1c1d24]/50 border border-[#2b2c30]/50 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer hover:border-primary/50 shadow-lg hover:shadow-[0_0_30px_rgba(0,222,81,0.1)] flex flex-col"
                                  >
                                    {/* Thumbnail Image */}
                                    <div className="h-28 md:h-40 bg-[#2b2c30]/40 relative flex items-center justify-center border-b border-[#2b2c30]/50">
                                      <Image 
                                        src={p.thumbnail || "/project-placeholder.png"} 
                                        alt={p.name}
                                        fill
                                        unoptimized={true}
                                        className="object-cover opacity-60 group-hover/card:opacity-100 transition-all duration-700"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-[#1c1d24] to-transparent opacity-60"></div>
                                    </div>
                                    
                                    <div className="p-3 md:p-6 flex flex-col flex-1">
                                      <div className="flex items-center justify-between mb-2 md:mb-3">
                                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-1.5 md:px-2 py-0.5 md:py-1 rounded-sm md:rounded-md">{p.role === "Solo Developer" ? "Solo" : "Team"}</span>
                                      </div>
                                      <h4 className="text-white font-bold text-sm md:text-lg mb-1 md:mb-2 group-hover/card:text-primary transition-colors line-clamp-1 leading-tight md:leading-normal">{p.name}</h4>
                                      <p className="text-[#abb2bf] text-[10px] md:text-xs lg:text-sm leading-snug md:leading-relaxed line-clamp-2 h-auto mb-2 md:mb-4 flex-1 overflow-hidden">
                                        {p.desc}
                                      </p>
                                      
                                      <div className="flex flex-wrap gap-1 md:gap-2 mt-auto">
                                        {p.tech.slice(0, 2).map(t => (
                                          <span key={t} className="text-[8px] md:text-[9px] font-medium text-white/50 bg-white/5 border border-white/5 px-1 md:px-2 py-[1px] md:py-0.5 rounded-sm">{t}</span>
                                        ))}
                                        {p.tech.length > 2 && <span className="text-[8px] md:text-[9px] font-medium text-white/30 px-1">+{p.tech.length - 2}</span>}
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          ) : (
                            /* --- DETAILED VIEW --- */
                            <motion.div
                              key="detailed-view"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.4 }}
                              className="w-full px-4"
                            >
                              {/* Go Back Button */}
                              <button 
                                onClick={() => setActiveProjectName(null)}
                                className="flex items-center gap-2 text-[#abb2bf] hover:text-white transition-colors text-sm font-bold tracking-widest uppercase mb-10 group"
                              >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to {project.title}
                              </button>

                              {project.projects?.filter(p => p.name === activeProjectName).map((p, pIdx) => (
                                <div key={pIdx} className="space-y-10">
                                  {/* Project Header & Meta */}
                                  <div className="space-y-6">
                                    <div className="flex flex-wrap items-center gap-4">
                                      <h4 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{p.name}</h4>
                                      <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,222,81,0.1)] whitespace-nowrap mt-1 lg:mt-2">
                                        {p.role}
                                      </span>
                                    </div>
                                    
                                    <p className="text-[#abb2bf] text-lg leading-relaxed max-w-3xl">
                                      {p.desc}
                                    </p>

                                    {/* Tech & Tools Pills */}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                      {p.tech.map((t) => (
                                        <span key={t} className="px-3 py-1 rounded-md bg-[#1c1d24] border border-[#2b2c30] text-[#abb2bf] text-[10px] font-medium transition-colors hover:border-primary/30">{t}</span>
                                      ))}
                                      {p.tools.map((t) => (
                                        <span key={t} className="px-3 py-1 rounded-md bg-[#1c1d24]/30 border border-[#2b2c30]/50 text-[#abb2bf]/60 text-[10px] font-medium">{t}</span>
                                      ))}
                                    </div>
                                  </div>

                                  {/* GitHub Button (Relocated) */}
                                  <div className="flex justify-start">
                                    <a 
                                      href={p.github} 
                                      target="_blank" 
                                      className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition-all text-xs font-bold uppercase tracking-widest group whitespace-nowrap shadow-xl backdrop-blur-md"
                                    >
                                      <Image 
                                        src="/github.svg" 
                                        alt="GitHub" 
                                        width={20} 
                                        height={20} 
                                        className="brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity" 
                                      />
                                      <span className="mt-[2px]">GitHub Repository</span>
                                    </a>
                                  </div>

                                  {/* Large Display Cards for this specific project */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                    {p.displays?.map((display, dIdx) => (
                                      <motion.div
                                        key={dIdx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ scale: 1.10, zIndex: 50 }}
                                        transition={{ 
                                          type: "spring", 
                                          stiffness: 300, 
                                          damping: 20 
                                        }}
                                        className="relative aspect-[16/10] bg-[#1c1d24] rounded-[2.5rem] border border-[#2b2c30]/50 group/display shadow-2xl hover:border-primary/30 cursor-pointer"
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 z-10 pointer-events-none rounded-[2.5rem]"></div>
                                        <div className="w-full h-full relative flex items-center justify-center bg-[#2b2c30]/10 rounded-[2.5rem] overflow-hidden">
                                          <div className="absolute inset-0">
                                            <Image 
                                              src={display.src} 
                                              alt={display.label}
                                              fill
                                              unoptimized={true}
                                              className="object-cover opacity-60 group-hover/display:opacity-100 transition-opacity duration-1000 blur-[0.5px] group-hover/display:blur-none"
                                            />
                                          </div>
                                          <div className="absolute inset-0 flex items-center justify-center text-white/5 uppercase font-black text-3xl lg:text-5xl tracking-tighter mix-blend-overlay rotate-[-10deg] pointer-events-none">
                                            {display.label}
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="pt-24 pb-32 border-t border-[#2b2c30]/50 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1c1d24]/50 border border-[#2b2c30] backdrop-blur-xl shadow-xl w-fit mb-12 relative z-10"
        >
          <LayoutGrid size={16} className="text-primary" />
          <span className="text-white text-xs font-bold tracking-[0.3em] uppercase mt-[2px]">TECH STACK</span>
        </motion.div>

        <div className="max-w-4xl relative z-10 space-y-12">
          {[
            {
              name: "Frontend",
              skills: ['React', 'Next.js', 'React Native', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'HTML/CSS'],
              icons: ['/icons/front-1.svg', '/icons/front-2.svg', '/icons/front-3.svg', '/icons/front-4.svg', '/icons/front-5.svg']
            },
            {
              name: "Backend",
              skills: ['Node.js', 'Express.js', 'Python', 'REST APIs', 'Java', 'C++'],
              icons: ['/icons/back-1.svg', '/icons/back-2.svg', '/icons/back-3.svg', '/icons/back-4.svg']
            },
            {
              name: "Databases",
              skills: ['MongoDB', 'PostgreSQL', 'Firebase', 'Supabase'],
              icons: ['/icons/db-1.svg', '/icons/db-2.svg', '/icons/db-3.svg']
            },
            {
              name: "Development Tools",
              skills: ['Git', 'GitHub', 'VS Code', 'Postman', 'Vercel', 'Jupyter'],
              icons: ['/icons/tool-1.svg', '/icons/tool-2.svg', '/icons/tool-3.svg', '/icons/tool-4.svg']
            }
          ].map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col gap-6"
            >
              {/* Top Row: Title + Icon Marquee */}
              <div className="flex items-center gap-6 lg:gap-10">
                <div className="shrink-0 pl-2 border-l-2 border-primary min-w-[120px]">
                  <h4 className="text-white font-bold tracking-widest uppercase text-xs lg:text-sm">
                    {category.name}
                  </h4>
                </div>

                <div className="flex-1 overflow-hidden relative w-full [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                  <motion.div 
                    className="flex items-center gap-10 w-max py-2"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ 
                      duration: 25 + (index * 5), 
                      ease: "linear", 
                      repeat: Infinity 
                    }}
                  >
                    {[...category.icons, ...category.icons, ...category.icons, ...category.icons].map((iconPath, sIdx) => (
                      <div key={`${iconPath}-${sIdx}`} className="w-8 h-8 relative opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                        <Image 
                          src={iconPath} 
                          alt="tech-icon"
                          fill
                          unoptimized={true}
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Bottom Row: Fixed List of Technologies */}
              <div className="flex flex-wrap gap-3 pl-2 lg:pl-[140px]">
                {category.skills.map((skill) => (
                  <div 
                    key={skill} 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1c1d24]/30 border border-[#2b2c30] hover:border-primary/50 transition-colors cursor-default"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2b2c30] group-hover:bg-primary transition-colors"></div>
                    <span className="text-[#abb2bf] font-medium text-xs lg:text-sm transition-colors hover:text-white">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="pt-24 pb-32 border-t border-[#2b2c30]/50 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1c1d24]/50 border border-[#2b2c30] backdrop-blur-xl shadow-xl w-fit mb-16 relative z-10"
        >
          <GraduationCap size={16} className="text-primary" />
          <span className="text-white text-xs font-bold tracking-[0.3em] uppercase mt-[2px]">EDUCATION</span>
        </motion.div>

        <div className="max-w-4xl relative">
          {/* Vertical Line */}
          <div className="absolute left-[100px] lg:left-[140px] top-3 bottom-0 w-[1px] bg-[#2b2c30]"></div>

          {/* Timeline Item 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative flex items-start mb-16"
          >
            {/* Date */}
            <div className="w-[100px] lg:w-[140px] flex-shrink-0 pt-0.5 pr-6 text-right">
              <span className="text-[#abb2bf] font-medium text-sm lg:text-base">2023 - 2026</span>
            </div>

            {/* Node */}
            <div className="relative flex justify-center w-8 -ml-[16px] flex-shrink-0 z-10 mt-2.5 lg:mt-2">
              <div className="w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_12px_rgba(0,222,81,0.6)]"></div>
            </div>

            {/* Content */}
            <div className="flex-1 pl-6 lg:pl-10">
              <h4 className="text-xl lg:text-2xl font-bold text-white mb-2">BSc (Hons) in Software Engineering</h4>
              <p className="text-[#abb2bf] text-base leading-relaxed">Plymouth University, UK (via NSBM)</p>
            </div>
          </motion.div>

          {/* Timeline Item 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative flex items-start"
          >
            {/* Date */}
            <div className="w-[100px] lg:w-[140px] flex-shrink-0 pt-0.5 pr-6 text-right">
              <span className="text-[#abb2bf] font-medium text-sm lg:text-base">2012 - 2022</span>
            </div>

            {/* Node */}
            <div className="relative flex justify-center w-8 -ml-[16px] flex-shrink-0 z-10 mt-2.5 lg:mt-2">
              <div className="w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_12px_rgba(0,222,81,0.6)] border-2 border-primary"></div>
            </div>

            {/* Content */}
            <div className="flex-1 pl-6 lg:pl-10">
              <h4 className="text-xl lg:text-2xl font-bold text-white mb-2">Advanced Level - Biological Science Stream</h4>
              <p className="text-[#abb2bf] text-base mb-1">Sripalee College, Horana</p>
              <p className="text-white/40 text-sm">G.C.E. Advanced Level</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="pt-24 pb-32 border-t border-[#2b2c30]/50 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1c1d24]/50 border border-[#2b2c30] backdrop-blur-xl shadow-xl w-fit mb-12 relative z-10"
        >
          <Send size={16} className="text-primary" />
          <span className="text-white text-xs font-bold tracking-[0.3em] uppercase mt-[2px]">CONTACT</span>
        </motion.div>

        <div className="max-w-4xl relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">Let's work together!</h3>
              <p className="text-[#abb2bf] leading-relaxed mb-8">
                I'm currently available for freelance work and full-time opportunities. Have a project in mind? Reach out and let's make it a reality.
              </p>
              
              <div className="space-y-4">
                <a href="mailto:hello@minula.com" className="flex items-center gap-4 p-4 rounded-xl bg-[#1c1d24]/30 border border-[#2b2c30] hover:border-primary/30 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#1c1d24] flex items-center justify-center border border-[#2b2c30] group-hover:border-primary/50 transition-all text-[#abb2bf] group-hover:text-primary">
                    <Send size={18} />
                  </div>
                  <div>
                    <p className="text-white font-bold">Email</p>
                    <p className="text-[#abb2bf] text-sm">hello@minula.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1c1d24]/30 border border-[#2b2c30] cursor-default">
                  <div className="w-10 h-10 rounded-full bg-[#1c1d24] flex items-center justify-center border border-[#2b2c30] text-[#abb2bf]">
                    <Star size={18} />
                  </div>
                  <div>
                    <p className="text-white font-bold">Location</p>
                    <p className="text-[#abb2bf] text-sm">Horana, Sri Lanka</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-[#1c1d24]/50 border border-[#2b2c30] rounded-xl px-5 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-[#1c1d24]/50 border border-[#2b2c30] rounded-xl px-5 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-widest ml-1">Subject</label>
                <input 
                  type="text" 
                  placeholder="Project Inquiry"
                  className="w-full bg-[#1c1d24]/50 border border-[#2b2c30] rounded-xl px-5 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  placeholder="Tell me about your project..."
                  rows={4}
                  className="w-full bg-[#1c1d24]/50 border border-[#2b2c30] rounded-xl px-5 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,222,81,0.2)] flex items-center justify-center gap-3 group"
              >
                Send Message
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Fixed Vertical Navigation Bar (Right) */}
      <div className="hidden lg:flex fixed right-6 lg:right-16 xl:right-24 top-[150px] flex-col items-center gap-8 z-40">

        {/* Middle Group: Sun + Nav Pill */}
        <div className="flex flex-col items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-full bg-[#1c1d24]/50 backdrop-blur-xl border border-[#2b2c30] flex items-center justify-center text-primary/80 hover:text-primary transition-all shadow-xl"
          >
            <Sun size={20} fill="currentColor" className="opacity-20" />
          </motion.button>

          {/* Navigation Pill Container */}
          <div className="bg-[#1c1d24]/50 backdrop-blur-xl border border-[#2b2c30] rounded-full py-6 flex flex-col items-center gap-6 shadow-2xl relative w-12">

            {navItems.map((item) => {
              const Icon = item.icon;
              const isHovered = hoveredItem === item.id;

              return (
                <div
                  key={item.id}
                  className="relative flex items-center justify-center w-full"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Hover Label Pill */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.8 }}
                        animate={{ opacity: 1, x: -10, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.8 }}
                        className="absolute right-full mr-2 pointer-events-none"
                      >
                        <div className="bg-[#1c1d24]/90 backdrop-blur-md border border-[#2b2c30] px-4 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-xl whitespace-nowrap">
                          {item.label}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    onClick={() => {
                      const element = document.getElementById(item.id);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`${activeSection === item.id ? 'text-primary' : 'text-white/30 hover:text-white'} transition-colors relative`}
                  >
                    <Icon size={20} />
                  </motion.button>
                </div>
              );
            })}
          </div>

          {/* Desktop Bot Icon (Below Pill Menu) */}
          <div 
            className="mt-2 relative flex items-center justify-center w-full"
            onMouseEnter={() => setHoveredItem('bot')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Hover Label Pill */}
            <AnimatePresence>
              {hoveredItem === 'bot' && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.8 }}
                  animate={{ opacity: 1, x: -10, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.8 }}
                  className="absolute right-full mr-2 pointer-events-none z-50"
                >
                  <div className="bg-[#1c1d24]/90 backdrop-blur-md border border-[#2b2c30] px-4 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-xl whitespace-nowrap">
                    Chat with Me!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-12 h-12 cursor-pointer drop-shadow-xl saturate-150"
            >
              <Image
                src="/bot1.png"
                alt="AI Assistant"
                fill
                className="object-contain"
              />
            </motion.div>
          </div>

        </div>
      </div>

      {/* Footer Branding */}
      <footer className="pt-24 pb-12 opacity-40">
        <div className="flex items-center gap-4 text-xs tracking-[0.2em] font-medium uppercase">
          <Star size={12} className="text-primary" />
          <span>Our clients (2015-25©)</span>
        </div>
      </footer>
      {/* Mobile Bot Icon */}
      <motion.div 
        animate={{ 
          y: showScrollTop ? -34 : 0 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-6 right-6 z-50 pointer-events-auto lg:hidden"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-16 h-16 cursor-pointer block"
        >
          <Image
            src="/bot1.png"
            alt="AI Assistant"
            fill
            className="object-contain"
          />
        </motion.button>
      </motion.div>

      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 lg:right-16 xl:right-24 z-50 px-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-12 h-12 rounded-full bg-[#1c1d24]/80 backdrop-blur-xl border border-[#2b2c30] flex items-center justify-center text-primary shadow-2xl hover:border-primary/50 transition-all cursor-pointer"
            >
              <ArrowUp size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
