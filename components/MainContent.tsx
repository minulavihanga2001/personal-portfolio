"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowUp, Star, Home, User, Briefcase, Sun, GraduationCap, LayoutGrid, ArrowLeft, Maximize2, Minimize2, X, Award, MapPin, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function MainContent() {
  const [time, setTime] = useState("");
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMaximized, setIsChatMaximized] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "model"; content: string }[]>([
    { role: "model", content: "Hello! I'm Minula's AI assistant. Ask me anything about his projects, skills, or experience!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Pre-load and cache voices as soon as browser has them ready
  // getVoices() returns empty on first call — onvoiceschanged fires when they're loaded
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    loadVoices(); // Try immediately (sometimes they're already loaded)
    window.speechSynthesis.onvoiceschanged = loadVoices; // Always fires on first load

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Web Speech API — soothing voice helper
  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88;  // slower = more relaxed
    utterance.pitch = 1.0;  // neutral, natural tone
    utterance.volume = 0.9;

    // Use cached voices — always consistent, even on first open
    const voices = voicesRef.current;
    const preferred =
      voices.find((v) => v.name.includes("Samantha") && v.lang.startsWith("en")) ||
      voices.find((v) => v.name.includes("Karen")    && v.lang.startsWith("en")) ||
      voices.find((v) => v.name.includes("Moira")    && v.lang.startsWith("en")) ||
      voices.find((v) => v.name.includes("Zira")     && v.lang.startsWith("en")) ||
      voices.find((v) => v.lang === "en-GB") ||
      voices.find((v) => v.lang.startsWith("en"));

    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  };

  // Chat open/close with voice
  const handleChatToggle = () => {
    if (!isChatOpen && isVoiceEnabled) {
      speak("Hello there!, I am Minula's AI Assistant! How can I help you?");
    } else if (isChatOpen && isVoiceEnabled) {
      speak("Thanks, See you later!");
    }
    setIsChatOpen(!isChatOpen);
  };

  const handleChatClose = () => {
    if (isVoiceEnabled) speak("Thanks, See you later!");
    setIsChatOpen(false);
  };

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setIsChatLoading(true);

    const updatedMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(updatedMessages);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message to the AI Assistant.");
      }

      const data = await response.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: "model" as const, content: data.response }]);
      } else {
        throw new Error("Invalid response content received.");
      }
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "model" as const, content: "Sorry, I encountered an issue connecting to Minula's AI Assistant. Please try again in a moment." }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
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
    { id: "certificates", label: "Certificates", icon: Award },
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
      title: "Web & Mobile Applications",
      description: "I design modern, responsive web applications that balance creativity with usability, making sure your digital presence feels seamless and memorable.",
      images: ["/project1-1.png", "/project1-2.png"],
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      projects: [
        {
          name: "HealthLink : Privacy-Aware Patient Centric EHR System",
          role: "Final Year Project - Individual",
          thumbnail: "/healthlink/thumbnail.png",
          desc: "A cross-platform digital health record management system built for the Sri Lankan healthcare context. Key features include patient-centric medical record ownership via Google Drive API integration, consent-based doctor access with time-bound permissions, RSA digitally signed prescriptions with DigiCert timestamps and QR-based pharmacist verification, AI-powered bilingual medical report summarisation (English/Sinhala) using Google Gemini API with PII anonymisation via spaCy NER, AES-256 GCM encryption for all sensitive data, and full compliance with Sri Lanka's PDPA No. 9 of 2022 and HIPAA technical safeguards.",
          tech: ["React Native", "Expo", "Next.js", "Java Spring Boot", "Python FastAPI", "MongoDB Atlas", "Google Drive API", "Google Gemini API", "Supabase"],
          tools: ["IntelliJ IDEA", "VS Code", "Postman", "MongoDB Atlas", "Git", "GitHub", "Expo Go"],
          github: "https://github.com/minulavihanga2001/FYP_Healthlink_Project",
          displayRows: [
            [
              { src: "/healthlink/1.jpeg", label: "Overview" },
              { src: "/healthlink/2.jpeg", label: "Dashboard" },
              { src: "/healthlink/3.jpeg", label: "Patient Records" },
              { src: "/healthlink/4.jpeg", label: "Consent Management" }
            ],
            [
              { src: "/healthlink/5.jpeg", label: "Doctor Access" },
              { src: "/healthlink/6.jpeg", label: "Appointment System" },
              { src: "/healthlink/7.jpeg", label: "Medical History" }
            ],
            [
              { src: "/healthlink/8.png", label: "Web Dashboard" },
              { src: "/healthlink/9.png", label: "Admin Panel" },
              { src: "/healthlink/10.png", label: "Analytics" },
              { src: "/healthlink/11.png", label: "Reports" }
            ],
            [
              { src: "/healthlink/bmi.png", label: "BMI Calculator" },
              { src: "/healthlink/prescription.png", label: "Digital Prescription" }
            ]
          ],
          displays: []
        },
        {
          name: "ZenPath : Online Mental Health Support System",
          role: "Group Project - Team Leader",
          thumbnail: "/zenpath/thumbnail.png",
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
        },
        {
          name: "ShowroomPro : 2D/3D Furniture Visualization Platform",
          role: "Team Leader",   // ← update if different
          thumbnail: "/showroompro/thumbnail.png",
          desc: "A full-stack furniture visualization platform that lets designers plan and visualize interior spaces interactively. Features include a 2D blueprint editor with drag-and-drop furniture placement, real-time collision detection, and a fully immersive 3D walkthrough powered by React Three Fiber. The system supports 7 furniture categories, customizable room shapes (Rectangle, L-Shape, Square), 30-step undo/redo history, auto-save, and PNG export. The backend provides 16 REST API endpoints across 4 MongoDB collections, secured with JWT authentication and Zustand-managed scene state.",
          tech: ["React", "Node.js", "Express.js", "MongoDB", "Three.js", "React Three Fiber", "React-Konva", "TailwindCSS", "Zustand", "JWT"],
          tools: ["VS Code", "Postman", "MongoDB Atlas", "Git", "GitHub"],
          github: "https://github.com/minula-vihanga/HCI-Furniture-Visualizer",
          displayRows: [
            [
              { src: "/showroompro/1.png", label: "2D Editor" },
              { src: "/showroompro/2.png", label: "Furniture Placement" },
              { src: "/showroompro/3.png", label: "3D View" }
            ],
            [
              { src: "/showroompro/4.png", label: "Room Customizer" },
              { src: "/showroompro/5.png", label: "Save Scenario" }
            ]
          ]  // ← verify this URL
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
          name: "StudyMate : AI-Powered Study Assistant",
          role: "Personal Project",
          thumbnail: "/studymate/thumbnail.png",
          desc: "An AI-powered learning platform designed to streamline study workflows. Key features include document summarization, detailed concept explanation, and a dynamic MCQ generator capable of parsing uploaded PDF materials. Users can customize question volume, difficulty levels, and explanation toggles, and then copy results or export them directly as TXT or professionally formatted PDF files.",
          tech: ["Next.js (App Router)", "React", "TypeScript", "TailwindCSS", "Gemini API (2.0 Flash / 1.5 Flash)", "jsPDF"],
          tools: ["VS Code", "Postman", "Git", "GitHub"],
          github: "https://github.com/minula-vihanga/studymate",
          displayRows: [
            [
              { src: "/studymate/1.png", label: "Dashboard" },
              { src: "/studymate/2.png", label: "Study Tools" },
              { src: "/studymate/3.png", label: "Summarizer" }
            ],
            [
              { src: "/studymate/4.png", label: "MCQ Generator" },
              { src: "/studymate/5.png", label: "PDF Export" }
            ]
          ]
        },
        {
          name: "SteamNoodles : Automated Feedback Agent",
          role: "Solo Project",
          thumbnail: "/streamnoodles/thumbnail.png",
          desc: "An automated, multi-agent AI system built to analyze and respond to customer feedback for the SteamNoodles restaurant chain. Powered by LangGraph for multi-agent coordination and the Groq API (Llama 3) for lightning-fast inference, the system routes requests dynamically: a Feedback Response Agent classifies review sentiment and drafts context-aware replies, while a Sentiment Visualization Agent parses natural language date ranges to filter Kaggle's Yelp dataset using Pandas and generate trend charts with Matplotlib and Seaborn.",
          tech: ["Python", "LangGraph", "Groq API", "Llama 3", "Pandas", "Matplotlib", "Seaborn"],
          tools: ["VS Code", "Git", "GitHub", "Kaggle API", "python-dotenv"],
          github: "https://github.com/minula-vihanga/steamnoodles-feedback-agent",
          displayRows: [
            [
              { src: "/streamnoodles/1.png", label: "Feedback Agent" },
              { src: "/streamnoodles/2.png", label: "Sentiment Charts" }
            ]
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
          name: "Real-Time Asset Tracking Device with IoT Integration",
          role: "Co-Developer (IoT & Full-Stack)",
          thumbnail: "/iot/thumbnail.png",
          desc: "A comprehensive second-year IoT telemetry and visualization platform. The hardware module leverages an ESP32 micro-controller to gather temperature and humidity data from a DHT22 sensor, location coordinates via a NEO-6M GPS module, and motion/accident vectors from an MPU6050 accelerometer. Data is transmitted securely over GPRS using a SIM800L module to a Firebase Realtime Database. A Node.js/Express server monitors connection health and uses Socket.IO to stream real-time updates to a responsive React frontend. The dashboard features an animated moving vehicle icon mapped using React-Leaflet, interactive SensorCharts (recharts), a live alerts console for accident detection, and a paginated HistoryTable displaying the 100 most recent records alongside configurable threshold settings.",
          tech: ["React", "Node.js", "Express.js", "ESP32", "C++", "Firebase Realtime Database", "Socket.IO", "React-Leaflet", "TailwindCSS", "Recharts"],
          tools: ["Arduino IDE", "VS Code", "Postman", "Git", "GitHub"],
          github: "https://github.com/minula-vihanga/IoT-Asset-Tracker",
          displayRows: [
            [
              { src: "/iot/1.png", label: "Dashboard Map" },
              { src: "/iot/2.png", label: "Telemetry Charts" },
              { src: "/iot/3.png", label: "Threshold Alerts" }
            ]
          ]
        }
      ]
    },
    {
      id: "articles",
      title: "Articles",
      description: "My written thoughts and technical articles sharing insights, tutorials, and research on modern development, software engineering, and AI.",
      images: [],
      tags: ["Tech Writing", "Blogs", "Insights"],
      projects: [
        {
          name: "Bridging the Gap: Simple Road from Localhost to Remote Mobile Testing (EAS Build & Dev Tunnels Guide)",
          role: "Author",
          thumbnail: "/article1.png",
          desc: "A comprehensive guide on connecting your local backend to a remote mobile testing environment using Expo EAS Build and Dev Tunnels, solving common networking hurdles in mobile development.",
          tech: ["Expo", "React Native", "EAS Build", "Dev Tunnels"],
          tools: ["Expo CLI", "React Native"],
          github: "https://www.linkedin.com/pulse/bridging-gap-simple-roat-from-localhost-remote-mobile-minula-vihanga-r9hqc/",
          displays: [],
          date: "December 31, 2025"
        }
      ]
    }
  ];

  return (
    <main className="flex-1 lg:ml-[400px] xl:ml-[460px] 2xl:ml-[530px] min-h-screen px-4 sm:px-8 py-8 lg:px-0 lg:py-0 lg:pt-16 lg:pb-16 lg:pl-12 lg:pr-64 xl:pl-16 xl:pr-72 2xl:pl-20 2xl:pr-48 space-y-10 lg:space-y-16 relative transition-all w-full overflow-hidden lg:overflow-visible">
      {/* Fixed Top-Right Header (Date/Time) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-12 right-6 lg:right-8 xl:right-12 2xl:right-16 text-right z-50 pointer-events-none hidden lg:block"
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
          <div className="relative">
            <div
              onMouseEnter={() => setIsAvatarHovered(true)}
              onMouseLeave={() => setIsAvatarHovered(false)}
              className="w-15 h-15 rounded-full bg-white/5 border border-[#2b2c30] flex items-center justify-center overflow-hidden cursor-pointer group"
            >
              <Image
                src="/mini-image2.jpeg"
                alt="Minula"
                width={70}
                height={70}
                className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
              />
            </div>
            <AnimatePresence>
              {isAvatarHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-18 left-0 z-50 p-1.5 bg-[#1c1d24]/95 backdrop-blur-xl border border-primary/10 rounded-2xl shadow-2xl pointer-events-none"
                >
                  <div className="w-48 h-48 rounded-xl overflow-hidden relative">
                    <Image
                      src="/mini-image2.jpeg"
                      alt="Enlarged Minula"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
          <h2 className="text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-white max-w-2xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl leading-[1.2] tracking-tight">
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
          className="max-w-2xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl relative z-10"
        >
          <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-8 leading-tight">
            <span className="block">Every great application starts with a</span>
            <span className="block">simple idea and solid architecture</span>
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

        <div className="space-y-0 relative z-10 max-w-2xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
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
                <div className="py-4 lg:py-6 flex items-center justify-between transition-colors">
                  <h3 className={`text-xl sm:text-2xl lg:text-3xl font-semibold transition-all duration-500 font-sans tracking-tight ${isExpanded || isHovered ? 'text-white translate-x-4' : 'text-white/40'}`}>
                    {project.title}
                  </h3>

                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-[#2b2c30] flex items-center justify-center transition-all duration-500 ${isExpanded ? 'scale-110 border-primary shadow-[0_0_15px_rgba(0,222,81,0.2)]' : 'bg-transparent'}`}>
                    {isExpanded ? (
                      <motion.div initial={{ rotate: 0 }} animate={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                        <div className="w-3.5 h-[2px] bg-primary"></div>
                      </motion.div>
                    ) : (
                      <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                        <div className="w-3.5 h-[2px] bg-white group-hover:bg-primary transition-colors"></div>
                        <div className="absolute w-[2px] h-3.5 bg-white group-hover:bg-primary transition-colors"></div>
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
                      <div className="pb-8 lg:pb-12 pt-2 cursor-default" onClick={(e) => e.stopPropagation()}>
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
                              <p className="text-[#abb2bf] text-base lg:text-lg leading-relaxed mb-6 max-w-3xl text-justify">
                                {project.description}
                              </p>

                              {project.id === "articles" ? (
                                <div className="space-y-6">
                                  {project.projects?.map((article, aIdx) => (
                                    <motion.a
                                      key={aIdx}
                                      href={article.github}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      whileHover={{ y: -4 }}
                                      className="group flex flex-col md:flex-row bg-[#1c1d24]/30 border border-[#2b2c30]/30 rounded-xl overflow-hidden hover:border-primary/40 hover:bg-[#1c1d24]/70 shadow-md hover:shadow-[0_0_25px_rgba(0,222,81,0.05)] transition-all duration-300"
                                    >
                                      {/* Image container */}
                                      <div className="w-full md:w-72 aspect-[16/10.5] relative bg-[#2b2c30]/20 shrink-0 overflow-hidden">
                                        <Image
                                          src={article.thumbnail || "/project-placeholder.png"}
                                          alt={article.name}
                                          fill
                                          unoptimized={true}
                                          className="object-cover opacity-75 group-hover:opacity-100 group-hover:scale-102 transition-all duration-500 ease-out"
                                        />
                                      </div>

                                      {/* Content */}
                                      <div className="p-5 flex flex-col justify-between flex-1">
                                        <div className="space-y-2.5">
                                          <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#0a66c2] bg-[#0a66c2]/10 px-2 py-0.5 rounded-sm">LinkedIn Article</span>
                                            <span className="text-[9px] text-[#abb2bf]/60">{(article as any).date || "December 31, 2025"}</span>
                                          </div>
                                          <h4 className="text-white font-bold text-sm md:text-base group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                            {article.name}
                                          </h4>
                                          <p className="text-[#abb2bf] text-[10px] md:text-xs leading-relaxed text-justify line-clamp-2">
                                            {article.desc}
                                          </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                          <div className="flex flex-wrap gap-1.5">
                                            {article.tech?.map(t => (
                                              <span key={t} className="text-[8px] md:text-[9px] font-medium text-white/50 bg-white/5 border border-white/5 px-2 py-0.5 rounded-sm">{t}</span>
                                            ))}
                                          </div>
                                          <span className="text-[10px] font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0 uppercase tracking-wider">
                                            Read Article <span className="text-sm">→</span>
                                          </span>
                                        </div>
                                      </div>
                                    </motion.a>
                                  ))}
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                                  {project.projects?.map((p, pIdx) => (
                                    <motion.div
                                      key={pIdx}
                                      whileHover={{ y: -4 }}
                                      onClick={() => setActiveProjectName(p.name)}
                                      className="group/card bg-[#1c1d24]/30 border border-[#2b2c30]/30 rounded-lg overflow-hidden cursor-pointer hover:border-primary/40 hover:bg-[#1c1d24]/70 shadow-md hover:shadow-[0_0_25px_rgba(0,222,81,0.05)] transition-all duration-300 flex flex-col"
                                    >
                                      {/* Thumbnail Image */}
                                      <div className="h-32 md:h-44 bg-[#2b2c30]/20 relative flex items-center justify-center border-b border-[#2b2c30]/20 overflow-hidden">
                                        <Image
                                          src={p.thumbnail || "/project-placeholder.png"}
                                          alt={p.name}
                                          fill
                                          unoptimized={true}
                                          className="object-cover opacity-60 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-500 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1d24] to-transparent opacity-40"></div>
                                      </div>

                                      <div className="p-4 md:p-5 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-2.5">
                                          <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-sm">{p.role}</span>
                                        </div>
                                        <h4 className="text-white font-bold text-sm md:text-base mb-1.5 group-hover/card:text-primary transition-colors line-clamp-1 leading-snug">{p.name}</h4>
                                        <p className="text-[#abb2bf] text-[10px] md:text-xs leading-relaxed line-clamp-3 h-auto mb-4 flex-1 overflow-hidden text-justify">
                                          {p.desc}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 mt-auto">
                                          {p.tech?.slice(0, 4).map(t => (
                                            <span key={t} className="text-[8px] md:text-[9px] font-medium text-white/50 bg-white/5 border border-white/5 px-2 py-0.5 rounded-sm">{t}</span>
                                          ))}
                                          {p.tech && p.tech.length > 4 && <span className="text-[8px] md:text-[9px] font-medium text-white/30 px-1">+{p.tech.length - 4}</span>}
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              )}
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

                                    <p className="text-[#abb2bf] text-lg leading-relaxed max-w-3xl text-justify">
                                      {p.desc}
                                    </p>

                                    {/* Tech & Tools Pills */}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                      {p.tech?.map((t) => (
                                        <span key={t} className="px-3 py-1 rounded-md bg-[#1c1d24] border border-[#2b2c30] text-[#abb2bf] text-[10px] font-medium transition-colors hover:border-primary/30">{t}</span>
                                      ))}
                                      {p.tools?.map((t) => (
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

                                  {/* Display Images - Row-based layout */}
                                  {(p as any).displayRows ? (
                                    <div className="space-y-6">
                                      {(p as any).displayRows.map((row: Array<{ src: string; label: string }>, rowIdx: number) => {
                                        // Determine sizing & styling based on the row index
                                        const isWebProject = p.name.toLowerCase().includes("showroom") || p.name.toLowerCase().includes("studymate") || p.name.toLowerCase().includes("steamnoodles") || p.name.toLowerCase().includes("tracking");
                                        let aspectClass = isWebProject ? "aspect-[16/10]" : "aspect-[9/19.5]";
                                        let objectFitClass = isWebProject ? "object-cover" : "object-contain";
                                        let containerClass = "relative bg-[#1c1d24] rounded-md border border-[#2b2c30]/50 group/display shadow-lg hover:border-primary/30 cursor-pointer overflow-hidden";
                                        let wrapperClass = isWebProject ? "flex-1 min-w-[250px]" : "flex-1 max-w-[200px]";

                                        if (!isWebProject) {
                                          if (rowIdx === 2) {
                                            // Web screenshots within a hybrid project (like HealthLink)
                                            aspectClass = "aspect-[16/10]";
                                            objectFitClass = "object-cover";
                                            wrapperClass = "flex-1";
                                          } else if (rowIdx === 3) {
                                            // bmi and prescription within hybrid
                                            aspectClass = "aspect-[3/4]";
                                            objectFitClass = "object-contain";
                                            wrapperClass = "w-[180px]";
                                          }
                                        }

                                        const isWebRow = isWebProject || (!isWebProject && rowIdx === 2);

                                        if (isWebRow) {
                                          const gridColsClass = {
                                            1: "grid-cols-1",
                                            2: "grid-cols-1 sm:grid-cols-2",
                                            3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                                            4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
                                            5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
                                          }[row.length] || "grid-cols-1";

                                          return (
                                            <div key={rowIdx} className={`grid ${gridColsClass} gap-4 w-full`}>
                                              {row.map((display, dIdx) => (
                                                <div key={dIdx} className="w-full">
                                                  <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    whileHover={{ scale: 1.03, zIndex: 50 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    className={`${containerClass} ${aspectClass} w-full`}
                                                  >
                                                    <Image
                                                      src={display.src}
                                                      alt={display.label}
                                                      fill
                                                      unoptimized={true}
                                                      className={`${objectFitClass} opacity-80 group-hover/display:opacity-100 transition-opacity duration-500`}
                                                    />
                                                    {/* Expand Icon */}
                                                    <div
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedImage(display.src);
                                                      }}
                                                      className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white/70 opacity-0 group-hover/display:opacity-100 hover:text-white hover:bg-black hover:border-white/30 transition-all duration-300 z-20 cursor-pointer"
                                                    >
                                                      <Maximize2 size={12} />
                                                    </div>
                                                  </motion.div>
                                                </div>
                                              ))}
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div key={rowIdx} className="flex flex-wrap gap-4 justify-start">
                                              {row.map((display, dIdx) => (
                                                <div key={dIdx} className={wrapperClass}>
                                                  <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    whileHover={{ scale: 1.03, zIndex: 50 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    className={`${containerClass} ${aspectClass}`}
                                                  >
                                                    <Image
                                                      src={display.src}
                                                      alt={display.label}
                                                      fill
                                                      unoptimized={true}
                                                      className={`${objectFitClass} opacity-80 group-hover/display:opacity-100 transition-opacity duration-500`}
                                                    />
                                                    {/* Expand Icon */}
                                                    <div
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedImage(display.src);
                                                      }}
                                                      className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white/70 opacity-0 group-hover/display:opacity-100 hover:text-white hover:bg-black hover:border-white/30 transition-all duration-300 z-20 cursor-pointer"
                                                    >
                                                      <Maximize2 size={12} />
                                                    </div>
                                                  </motion.div>
                                                </div>
                                              ))}
                                            </div>
                                          );
                                        }
                                      })}
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                                      {p.displays?.map((display, dIdx) => (
                                        <motion.div
                                          key={dIdx}
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          whileHover={{ scale: 1.10, zIndex: 50 }}
                                          onClick={() => setSelectedImage(display.src)}
                                          transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20
                                          }}
                                          className="relative aspect-[16/10] bg-[#1c1d24] rounded-md border border-[#2b2c30]/50 group/display shadow-2xl hover:border-primary/30 cursor-pointer"
                                        >
                                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 z-10 pointer-events-none rounded-md"></div>
                                          <div className="w-full h-full relative flex items-center justify-center bg-[#2b2c30]/10 rounded-md overflow-hidden">
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
                                            {/* Expand Icon */}
                                            <div className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white/70 opacity-0 group-hover/display:opacity-100 hover:text-white hover:bg-black hover:border-white/30 transition-all duration-300 z-20">
                                              <Maximize2 size={12} />
                                            </div>
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  )}
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

      {/* Certificates Section */}
      <section id="certificates" className="pt-24 pb-32 border-t border-[#2b2c30]/50 relative">
        {/* Glow effect behind the section */}
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1c1d24]/50 border border-[#2b2c30] backdrop-blur-xl shadow-xl w-fit mb-12 relative z-10"
        >
          <Award size={16} className="text-primary" />
          <span className="text-white text-xs font-bold tracking-[0.3em] uppercase mt-[2px]">CERTIFICATES</span>
        </motion.div>

        <div className="max-w-xl md:max-w-2xl lg:max-w-2xl xl:max-w-2xl 2xl:max-w-3xl relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                title: "AgentX AI Agents Bootcamp",
                issuer: "Zone24x7 & Leo Club, UoM",
                date: "Aug 2025",
                img: "/certs/agentx.png"
              },
              {
                title: "Fundamentals of DevOps on AWS",
                issuer: "AWS & Simplilearn SkillUP",
                date: "June 2025",
                img: "/certs/devops.png"
              },
              {
                title: "Learning Next.js",
                issuer: "LinkedIn Learning",
                date: "May 2025",
                img: "/certs/next.png"
              },
              {
                title: "Introduction to MERN Stack",
                issuer: "Simplilearn SkillUP",
                date: "Nov 2024",
                img: "/certs/mern.png"
              }
            ].map((cert, cIdx) => (
              <motion.div
                key={cIdx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: cIdx * 0.05 }}
                className="group/cert bg-[#1c1d24]/30 border border-[#2b2c30]/30 rounded-md overflow-hidden hover:border-primary/40 hover:bg-[#1c1d24]/70 shadow-md hover:shadow-[0_0_25px_rgba(0,222,81,0.05)] transition-all duration-300 flex flex-col"
              >
                {/* Image / Lightbox trigger */}
                <div className="relative aspect-[1.414/1] bg-[#2b2c30]/20 overflow-hidden cursor-pointer">
                  <Image
                    src={cert.img}
                    alt={cert.title}
                    fill
                    unoptimized={true}
                    className="object-cover opacity-80 group-hover/cert:opacity-100 group-hover/cert:scale-102 transition-all duration-500 ease-out"
                  />
                  {/* Hover Overlay with Enlarge Icon */}
                  <div
                    onClick={() => setSelectedImage(cert.img)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white/70 opacity-0 group-hover/cert:opacity-100 hover:text-white hover:bg-black hover:border-white/30 transition-all duration-300 z-20 cursor-pointer"
                  >
                    <Maximize2 size={10} />
                  </div>
                </div>

                {/* Details */}
                <div className="p-2.5 flex flex-col justify-between flex-1">
                  <div className="space-y-1">
                    <span className="text-[7px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-1.5 py-0.5 rounded-sm w-fit block">{cert.date}</span>
                    <h4 className="text-white font-bold text-[10px] leading-snug group-hover/cert:text-primary transition-colors line-clamp-2">{cert.title}</h4>
                    <p className="text-[#abb2bf] text-[9px] leading-relaxed line-clamp-1">{cert.issuer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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

        <div className="max-w-2xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl relative z-10 space-y-12">
          {[
            {
              name: "Frontend",
              skills: ['React', 'Next.js', 'React Native', 'Nativewind', 'Tailwind CSS', 'TypeScript', 'HTML', 'CSS'],
              icons: ['/icons/front-1.png', '/icons/front-2.png', '/icons/front-3.png', '/icons/front-4.png', '/icons/front-5.png', '/icons/front-6.png']
            },
            {
              name: "Backend",
              skills: ['Java', 'Spring Boot', 'Node.js', 'Express.js', 'Python', 'REST APIs'],
              icons: ['/icons/back-1.png', '/icons/back-2.png', '/icons/back-3.png', '/icons/back-4.png', '/icons/back-5.png', '/icons/back-6.png']
            },
            {
              name: "Databases",
              skills: ['MongoDB', 'MySQL', 'Firebase', 'Supabase', 'SSMS'],
              icons: ['/icons/db-1.png', '/icons/db-2.png', '/icons/db-3.png', '/icons/db-4.png', '/icons/db-5.png', '/icons/db-6.png']
            },
            {
              name: "Development Tools",
              skills: ['Git', 'GitHub', 'VS Code', 'Antigravity', 'Cursor', 'Arduino IDE', 'Postman', 'Vercel'],
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
                      <div key={`${iconPath}-${sIdx}`} className="w-8 h-8 relative opacity-80 hover:opacity-100 transition-opacity">
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
                {category.skills.map((skill) => {
                  // Brand colors for specific technologies
                  const getSkillColor = (name: string) => {
                    const colors: Record<string, string> = {
                      'React': '#61DAFB',
                      'Next.js': '#FFFFFF',
                      'React Native': '#61DAFB',
                      'Nativewind': '#38BDF8',
                      'Tailwind CSS': '#06B6D4',
                      'TypeScript': '#3178C6',
                      'HTML': '#E34F26',
                      'CSS': '#1572B6',
                      'Node.js': '#339933',
                      'Express.js': '#828282',
                      'Python': '#3776AB',
                      'Java': '#ED8B00',
                      'Spring Boot': '#6DB33F',
                      'MongoDB': '#47A248',
                      'MySQL': '#4479A1',
                      'Firebase': '#FFCA28',
                      'Supabase': '#3ECF8E',
                      'SSMS': '#0078D4',
                      'Antigravity': '#00B2FF',
                      'Cursor': '#FFFFFF',
                      'Arduino IDE': '#00979D',
                      'VS Code': '#007ACC',
                      'Postman': '#FF6C37',
                      'Vercel': '#000000',
                      'Git': '#F05032',
                      'GitHub': '#FFFFFF'
                    };
                    return colors[name] || '#2b2c30';
                  };

                  const dotColor = getSkillColor(skill);

                  return (
                    <div
                      key={skill}
                      className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1c1d24]/30 border border-[#2b2c30] hover:border-primary/50 transition-all cursor-default"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:scale-125"
                        style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}44` }}
                      ></div>
                      <span className="text-[#abb2bf] font-medium text-xs lg:text-sm transition-colors group-hover:text-white">
                        {skill}
                      </span>
                    </div>
                  );
                })}
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

        <div className="max-w-2xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl relative">
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
              <p className="text-[#abb2bf] text-base leading-relaxed">University of Plymouth, UK (via NSBM Green University)</p>
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

        <div className="max-w-2xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl relative z-10 grid grid-cols-1 xl:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="xl:col-span-2 space-y-8">
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
                <a href="mailto:minulavihanga70@gmail.com" className="flex items-center gap-4 p-4 rounded-xl bg-[#1c1d24]/30 border border-[#2b2c30] hover:border-primary/30 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#1c1d24] flex items-center justify-center border border-[#2b2c30] group-hover:border-primary/50 transition-all text-[#abb2bf] group-hover:text-primary">
                    <Send size={18} />
                  </div>
                  <div>
                    <p className="text-white font-bold">Email</p>
                    <p className="text-[#abb2bf] text-sm">minulavihanga70@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1c1d24]/30 border border-[#2b2c30] cursor-default">
                  <div className="w-10 h-10 rounded-full bg-[#1c1d24] flex items-center justify-center border border-[#2b2c30] text-[#abb2bf]">
                    <MapPin size={18} />
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
          <div className="xl:col-span-3">
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white uppercase tracking-widest ml-1 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-[#1c1d24]/50 border border-[#2b2c30] rounded-xl px-5 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white uppercase tracking-widest ml-1 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-[#1c1d24]/50 border border-[#2b2c30] rounded-xl px-5 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-white uppercase tracking-widest ml-1 mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="Project Inquiry"
                  className="w-full bg-[#1c1d24]/50 border border-[#2b2c30] rounded-xl px-5 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-white uppercase tracking-widest ml-1 mb-2">Message</label>
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
      <div className="hidden lg:flex fixed right-6 lg:right-8 xl:right-12 2xl:right-16 top-[150px] flex-col items-center gap-8 z-40">

        {/* Middle Group: Sun + Nav Pill */}
        <div className="flex flex-col items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.1] backdrop-blur-2xl border border-white/20 flex items-center justify-center text-primary shadow-[0_8px_25px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:border-primary/40 hover:shadow-[0_0_15px_rgba(0,222,81,0.15)] transition-all cursor-pointer"
          >
            <Sun size={20} fill="currentColor" className="opacity-80" />
          </motion.button>

          {/* Voice Enable/Disable Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={`w-12 h-12 rounded-full backdrop-blur-2xl border flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.25)] transition-all cursor-pointer ${
              isVoiceEnabled
                ? "bg-gradient-to-br from-primary/20 to-primary/5 border-primary/40 text-primary shadow-[0_0_15px_rgba(0,222,81,0.15)] hover:bg-primary/25"
                : "bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.1] border-white/20 text-white/30 hover:text-white/70 hover:border-white/30"
            }`}
            title={isVoiceEnabled ? "Mute voice" : "Enable voice"}
          >
            {isVoiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </motion.button>

          {/* Navigation Pill Container */}
          <div className="bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-white/[0.1] backdrop-blur-2xl border border-white/20 rounded-full py-6 flex flex-col items-center gap-6 shadow-[0_15px_35px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_1px_rgba(0,0,0,0.15)] relative w-12">

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
                        <div className="bg-gradient-to-r from-white/[0.08] to-white/[0.02] backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-[0_4px_15px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] whitespace-nowrap">
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
                    className={`relative flex items-center justify-center transition-colors ${activeSection === item.id ? 'text-primary' : 'text-white/30 hover:text-white'}`}
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
                  <div className="bg-gradient-to-r from-white/[0.08] to-white/[0.02] backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-[0_4px_15px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] whitespace-nowrap">
                    Chat with Me!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleChatToggle}
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
          onClick={handleChatToggle}
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
            className="fixed bottom-6 right-6 lg:right-8 xl:right-12 2xl:right-16 z-50 px-2"
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

      {/* Lightbox / Enlarged Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-colors z-[110]"
            >
              <X size={20} />
            </motion.button>

            {/* Enlarged Image Wrapper */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-full max-h-full rounded-lg overflow-hidden border border-white/10 bg-[#121318] shadow-2xl select-none"
            >
              <img
                src={selectedImage}
                alt="Enlarged preview"
                className="max-w-[90vw] max-h-[85vh] object-contain pointer-events-none"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gemini AI Assistant Popup */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            layout
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              y: 30,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 26,
              mass: 0.85
            }}
            className={`fixed z-50 flex flex-col overflow-hidden border border-white/20 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-white/[0.12] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.2)] rounded-[24px] ${isChatMaximized
              ? "bottom-6 right-6 w-[92vw] sm:w-[600px] md:w-[750px] lg:w-[900px] h-[82vh]"
              : "bottom-24 right-6 lg:right-24 xl:right-32 w-[380px] sm:w-[440px] h-[560px]"
              }`}
          >
            {/* Shifting Liquid Blobs inside/behind the Glass for Refraction */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden rounded-[24px]">
              <div className="absolute -top-12 -left-12 w-44 h-44 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-1/3 left-1/4 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl animate-float"></div>
              <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-blue-500/25 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
            </div>

            {/* Header */}
            <div className="p-4 bg-white/[0.05] border-b border-white/10 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden">
                  <Image
                    src="/bot1.png"
                    alt="AI Avatar"
                    fill
                    className="object-contain p-1 animate-pulse"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs tracking-wider uppercase drop-shadow-sm">Minula's AI Assistant</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_4px_#00de51]"></span>
                    <span className="text-primary/90 text-[9px] font-bold tracking-wide uppercase drop-shadow-sm">Online & Ready</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChatMaximized(!isChatMaximized)}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:scale-105 transition-all cursor-pointer"
                  title={isChatMaximized ? "Minimize" : "Maximize"}
                >
                  {isChatMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button
                  onClick={handleChatClose}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:scale-105 transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/10">
              {messages.map((msg, mIdx) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={mIdx}
                    className={`flex items-start gap-2.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : ""}`}
                  >
                    {!isUser && (
                      <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 relative overflow-hidden flex-shrink-0 mt-0.5">
                        <Image
                          src="/bot1.png"
                          alt="AI Mini"
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                    )}
                    <div
                      className={`p-3 text-xs leading-relaxed rounded-xl backdrop-blur-sm ${isUser
                        ? "bg-primary/20 border border-primary/30 rounded-tr-sm text-white font-medium shadow-[0_2px_12px_rgba(0,222,81,0.1)]"
                        : "bg-white/[0.08] border border-white/10 rounded-tl-sm text-slate-200 shadow-sm"
                        }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                  </div>
                );
              })}

              {isChatLoading && (
                <div className="flex items-start gap-2.5 max-w-[85%] animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 relative overflow-hidden flex-shrink-0 mt-0.5">
                    <Image
                      src="/bot1.png"
                      alt="AI Mini"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="p-3 bg-white/[0.08] border border-white/10 rounded-xl rounded-tl-sm flex gap-1 items-center h-8 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white/[0.03] border-t border-white/10 flex gap-2 backdrop-blur-md">
              <input
                type="text"
                placeholder="Ask Minula's AI Assistant..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isChatLoading}
                className="flex-1 bg-black/25 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-black/35 transition-all disabled:cursor-not-allowed shadow-inner"
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/95 hover:scale-[1.02] text-black flex items-center justify-center transition-all disabled:bg-white/5 disabled:border-white/10 disabled:text-white/20 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_15px_rgba(0,222,81,0.15)]"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
