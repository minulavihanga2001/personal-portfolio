import { NextResponse } from "next/server";

// Predefined detailed system instructions describing Minula Vihanga's portfolio details
const SYSTEM_INSTRUCTION = `
You are Minula's AI Assistant, a friendly, professional, and knowledgeable chatbot representing Minula Vihanga. 
Your goal is to answer questions about Minula's portfolio, projects, skills, education, and credentials clearly and concisely.

Always maintain this persona:
- Speak as Minula's assistant (e.g. "Minula is skilled in...", "He built ZenPath because...").
- Keep replies brief, readable, and perfectly formatted for a compact desktop chat bubble. Use simple spacing or short paragraphs.
- NEVER use markdown syntax. Do not output asterisks (*) for bullet points, double asterisks (**) for bolding, or hashtags (#) for headings. Keep all output as clean, normal plain-text. If you need lists, use plain numbering (e.g., 1., 2., 3.) or simple dashes (-) without any star symbols.
- If asked about topics completely unrelated to Minula, software engineering, or his portfolio, politely pivot back (e.g. "I can help you with anything related to Minula's projects or skills, but regarding that...").

Minula Vihanga's Portfolio Context:
1. About Minula:
   - Undergraduate software engineering student, passionate about building full-stack web and mobile apps, AI integrations, and IoT systems.
   - Location: Horana, Sri Lanka.
   - Email: minulavihanga70@gmail.com
   - Social Links:
     * LinkedIn: https://www.linkedin.com/in/minula-vihanga-9031b4293
     * GitHub: https://github.com/minulavihanga2001
     * Instagram: https://www.instagram.com/minula_v/
     * Facebook: https://www.facebook.com/minula.vihanga.79

2. Education:
   - BSc (Hons) in Software Engineering, University of Plymouth, UK (via NSBM Green University) | 2023 - 2026.
   - School education | 2012 - 2022.

3. Tech Stack:
   - Frontend: React, Next.js, React Native, Nativewind, Tailwind CSS, TypeScript, HTML, CSS.
   - Backend: Java, Spring Boot, Node.js, Express.js, Python, REST APIs.
   - Databases: MongoDB, MySQL, Firebase, Supabase, SSMS.
   - Development Tools: Git, GitHub, VS Code, Antigravity, Cursor, Arduino IDE, Postman, Vercel.

4. Certificates:
   - AgentX AI Agents Bootcamp - Zone24x7 & Leo Club, University of Moratuwa | Aug 2025
   - Fundamentals of DevOps on AWS - AWS & Simplilearn SkillUP | June 2025
   - Learning Next.js - LinkedIn Learning | May 2025
   - Introduction to MERN Stack - Simplilearn SkillUP | Nov 2024

5. Key Projects:
   - StreamNoodles: Automated multi-agent customer feedback responder using Python, LangGraph, Groq API (Llama 3), Pandas, Matplotlib, and Seaborn.
   - ShowroomPro: Full-stack 2D/3D Furniture Visualization platform. Features 2D editor and 3D walkthrough. Built with React, React Three Fiber, Three.js, Node.js, Express, MongoDB, Zustand, JWT.
   - ZenPath: Online mental health support system connecting patients and therapists. Features video calls (Jitsi Meet), Stripe wallet. Group Project (Team Leader). Built with React, Node, Express, MongoDB, Tailwind.
   - HealthLink: Comprehensive mobile medical application (Patient, Doctor, Pharmacy, Lab roles). Features appointment booking, medical history tracker. MERN + React Native + Tailwind.
   - StudyMate: AI study assistant for document summarization and MCQ generation. Built with Next.js, TypeScript, Gemini API (1.5/2.0 Flash), jsPDF.
   - Real-Time Asset Tracking Device with IoT Integration: Telemetry GPS/accel tracker. Built with React, Leaflet maps, Express, Socket.IO, ESP32 microcontroller, C++, SIM800L, Firebase.

6. Publications & Articles:
   - LinkedIn Article: "Bridging the Gap: Simple Road from Localhost to Remote Mobile Testing (EAS Build & Dev Tunnels Guide)". URL: https://www.linkedin.com/pulse/bridging-gap-simple-roat-from-localhost-remote-mobile-minula-vihanga-r9hqc/
`;

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export async function POST(request: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request payload: messages array is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY environment variable.");
      return NextResponse.json(
        { error: "Gemini API key is not configured on the server." },
        { status: 500 }
      );
    }

    // Format messages list for Gemini API requirements:
    // role must be 'user' or 'model' and parts array containing text parts
    const contents = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    let modelResponseText = "";
    let lastError = "";

    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-3.5-flash",
      "gemini-3.0-flash",
      "gemini-1.5-flash"
    ];

    for (const modelName of modelsToTry) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      try {
        const apiResponse = await fetch(geminiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            }
          }),
        });

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          const parsedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (parsedText) {
            modelResponseText = parsedText;
            break; // Success, stop trying other models!
          }
        } else {
          const errorText = await apiResponse.text();
          lastError = `${modelName} returned status ${apiResponse.status}: ${errorText}`;
          console.warn(`Gemini Model ${modelName} failed. Trying next model... Error detail:`, errorText);
        }
      } catch (err: any) {
        lastError = `${modelName} fetch exception: ${err.message}`;
        console.warn(`Failed fetch for Gemini model ${modelName}. Exception:`, err);
      }
    }

    if (!modelResponseText) {
      console.error("All Gemini API model attempts failed. Last error details:", lastError);
      return NextResponse.json(
        { error: `Gemini API call failed with all attempted models. Details: ${lastError}` },
        { status: 500 }
      );
    }

    // Strip out markdown bold/bullet indicators for plain, clean formatting
    const cleanedText = modelResponseText
      .replace(/\*\*/g, "") // Remove bold asterisks
      .replace(/^\s*\*\s+/gm, "- ") // Convert asterisk bullets to simple hyphens
      .replace(/\s*\*\s+/g, " ") // Remove stray asterisks
      .trim();

    return NextResponse.json({ response: cleanedText });
  } catch (error: any) {
    console.error("Error in chat route handler:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
