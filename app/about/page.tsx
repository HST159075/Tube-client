"use client";

import React, { useEffect, useRef, useState } from "react";

export default function AboutPage() {
  const DEVELOPER_INFO = {
    name: "Md Tasinul Alam",
    role: "MERN Stack Developer & UI/UX Enthusiast",
    email: "hsttasin90@gmail.com",
    github: "https://github.com/HST159075",
    avatarUrl: "/my-avatar.png",
  };

  const STATS = [
    { label: "Projects Done", value: "15+", icon: "🚀" },
    { label: "Tech Stack", value: "8+", icon: "⚡" },
    { label: "Experience", value: "2 Yrs", icon: "🏆" },
  ];

  const SKILLS = [
    { name: "React", color: "#61dafb" },
    { name: "Next.js", color: "#fff" },
    { name: "Node.js", color: "#68a063" },
    { name: "MongoDB", color: "#47a248" },
    { name: "Express", color: "#aaa" },
    { name: "Tailwind CSS", color: "#38bdf8" },
    { name: "TypeScript", color: "#3178c6" },
    { name: "PostgreSQL", color: "#4169e1" },
    { name: "Prisma", color: "#5a67d8" },
  ];

  const FEATURES = [
    { title: "Cinematic UI", desc: "Every frame crafted with the precision of a film director — dark, dramatic, immersive.", icon: "🎨" },
    { title: "Blazing Fast", desc: "Optimized with SSR, lazy loading, and intelligent caching for sub-second loads.", icon: "⚡" },
    { title: "Full Stack", desc: "End-to-end architecture with Next.js, Express, Prisma and PostgreSQL.", icon: "💻" },
    { title: "User First", desc: "Every interaction designed around delight, accessibility, and intuition.", icon: "👥" },
  ];

  const [visible, setVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      background: "#060608",
      minHeight: "100vh",
      color: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      overflowX: "hidden",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(110px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(229,9,20,0.3); }
          50%       { box-shadow: 0 0 50px rgba(229,9,20,0.7), 0 0 80px rgba(229,9,20,0.3); }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .hero-animate { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.25s; }
        .delay-3 { animation-delay: 0.4s; }
        .delay-4 { animation-delay: 0.55s; }
        .delay-5 { animation-delay: 0.7s; }
        .feature-card:hover { transform: translateY(-10px) !important; border-color: rgba(229,9,20,0.5) !important; background: rgba(229,9,20,0.04) !important; }
        .feature-card { transition: all 0.4s cubic-bezier(0.16,1,0.3,1) !important; }
        .skill-pill:hover { transform: scale(1.08) translateY(-3px) !important; }
        .cta-btn:hover { transform: scale(1.04) !important; opacity: 0.9 !important; }
      `}</style>

      {/* ── HERO ── */}
      <div ref={heroRef} style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 5vw 80px",
        textAlign: "center",
        overflow: "hidden",
      }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(229,9,20,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(229,9,20,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />

        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "15%", left: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(229,9,20,0.12) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />

        {/* Scanline effect */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", opacity: 0.03 }}>
          <div style={{ position: "absolute", width: "100%", height: "2px", background: "rgba(255,255,255,0.8)", animation: "scanline 4s linear infinite" }} />
        </div>

        {/* Badge */}
        <div className="hero-animate delay-1" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(229,9,20,0.08)", border: "1px solid rgba(229,9,20,0.2)",
          borderRadius: "30px", padding: "8px 20px", marginBottom: "28px",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e50914", display: "inline-block", animation: "glow-pulse 2s ease-in-out infinite" }} />
          <span style={{ color: "#e50914", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>Developer Profile</span>
        </div>

        {/* Heading */}
        <h1 className="hero-animate delay-2" style={{
          fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
          fontWeight: 900,
          fontFamily: "'Playfair Display', serif",
          lineHeight: 1.05,
          marginBottom: "20px",
          letterSpacing: "-1px",
        }}>
          I'm{" "}
          <span style={{
            background: "linear-gradient(90deg, #e50914, #ff4d4d, #e50914)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer 3s linear infinite",
          }}>
            {DEVELOPER_INFO.name}
          </span>
        </h1>

        {/* Role */}
        <p className="hero-animate delay-3" style={{
          color: "#555", fontSize: "1.1rem", maxWidth: "580px",
          lineHeight: 1.75, marginBottom: "48px",
        }}>
          A passionate full-stack developer and the creator of <strong style={{ color: "#888" }}>CineTube</strong> — building high-performance web applications with obsessive attention to UI/UX.
        </p>

        {/* Stats */}
        <div className="hero-animate delay-4" style={{
          display: "flex", gap: "0", justifyContent: "center", flexWrap: "wrap",
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "20px", overflow: "hidden",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: "28px 44px",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>{s.icon}</div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", marginBottom: "4px", fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
              <div style={{ color: "#444", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="hero-animate delay-5" style={{ marginTop: "60px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#333", fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase" }}>Scroll to explore</span>
          <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(229,9,20,0.6), transparent)", animation: "float 2s ease-in-out infinite" }} />
        </div>
      </div>

      {/* ── TICKER ── */}
      <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "14px 0", background: "rgba(229,9,20,0.03)" }}>
        <div style={{ display: "flex", animation: "ticker 20s linear infinite", whiteSpace: "nowrap" }}>
          {[...Array(2)].map((_, ri) => (
            <div key={ri} style={{ display: "flex", gap: "48px", paddingRight: "48px" }}>
              {["React", "Next.js", "Node.js", "PostgreSQL", "Prisma", "TypeScript", "Express", "Tailwind CSS", "MongoDB", "SSLCommerz", "Better Auth", "Vercel"].map((t, i) => (
                <span key={i} style={{ color: "#333", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>
                  {t} <span style={{ color: "#e50914", margin: "0 4px" }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ maxWidth: "1100px", margin: "100px auto", padding: "0 5vw" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <p style={{ color: "#e50914", fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "14px" }}>What I Built</p>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>
            Crafted with Purpose
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card" style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "20px",
              padding: "36px 28px",
              cursor: "default",
              animationDelay: `${i * 0.1}s`,
            }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                background: "rgba(229,9,20,0.08)", border: "1px solid rgba(229,9,20,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem", marginBottom: "20px",
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "10px", fontFamily: "'Playfair Display', serif" }}>{f.title}</h3>
              <p style={{ color: "#555", fontSize: "0.88rem", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ME CARD ── */}
      <div style={{ maxWidth: "960px", margin: "0 auto 100px", padding: "0 5vw" }}>
        <div style={{
          position: "relative", borderRadius: "28px", overflow: "hidden",
          background: "linear-gradient(145deg, #0f0f0f, #080808)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
          {/* Decorative corner glow */}
          <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(229,9,20,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

          <div style={{ position: "relative", padding: "60px", display: "flex", gap: "60px", alignItems: "center", flexWrap: "wrap" }}>

            {/* Avatar with orbit */}
            <div style={{ position: "relative", flexShrink: 0, width: "200px", height: "200px", margin: "0 auto" }}>
              {/* Pulse rings */}
              <div style={{ position: "absolute", inset: "-16px", borderRadius: "50%", border: "1px solid rgba(229,9,20,0.2)", animation: "pulse-ring 2.5s ease-out infinite" }} />
              <div style={{ position: "absolute", inset: "-8px", borderRadius: "50%", border: "1px solid rgba(229,9,20,0.15)", animation: "pulse-ring 2.5s ease-out infinite", animationDelay: "0.8s" }} />

              {/* Avatar */}
              <div style={{
                width: "200px", height: "200px", borderRadius: "50%",
                overflow: "hidden", border: "3px solid rgba(229,9,20,0.5)",
                animation: "glow-pulse 3s ease-in-out infinite",
              }}>
                <img
                  src={DEVELOPER_INFO.avatarUrl}
                  alt="Developer"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=Tasin&background=e50914&color=fff&size=200`;
                  }}
                />
              </div>

              {/* Orbit dot */}
              <div style={{ position: "absolute", inset: 0, animation: "orbit 4s linear infinite" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#e50914", boxShadow: "0 0 10px rgba(229,9,20,0.8)" }} />
              </div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: "280px" }}>
              <p style={{ color: "#e50914", fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>
                {DEVELOPER_INFO.role}
              </p>
              <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, fontFamily: "'Playfair Display', serif", marginBottom: "18px", lineHeight: 1.2 }}>
                The Mind Behind CineTube
              </h2>
              <p style={{ color: "#555", lineHeight: 1.8, marginBottom: "28px", fontSize: "0.93rem" }}>
                আমি এই প্ল্যাটফর্মটির ইউআই থেকে শুরু করে ব্যাকএন্ড আর্কিটেকচার পর্যন্ত প্রতিটি অংশ নিখুঁতভাবে তৈরি করার চেষ্টা করেছি। বিশেষ করে ইউজারদের ডেটা সিকিউরিটি এবং ফাস্ট লোডিং স্পিড আমার প্রধান লক্ষ্য ছিল।
              </p>

              {/* Skills */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
                {SKILLS.map((skill, i) => (
                  <span
                    key={i}
                    className="skill-pill"
                    onMouseEnter={() => setHoveredSkill(i)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    style={{
                      background: hoveredSkill === i ? `${skill.color}18` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${hoveredSkill === i ? skill.color + "55" : "rgba(255,255,255,0.08)"}`,
                      color: hoveredSkill === i ? skill.color : "#666",
                      padding: "5px 12px", borderRadius: "8px",
                      fontSize: "0.75rem", fontWeight: 600,
                      cursor: "default",
                      transition: "all 0.2s ease",
                      display: "inline-block",
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a
                  href={DEVELOPER_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-btn"
                  style={{
                    background: "#fff", color: "#000",
                    padding: "13px 28px", borderRadius: "12px",
                    textDecoration: "none", fontWeight: 700, fontSize: "0.88rem",
                    display: "flex", alignItems: "center", gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub Profile
                </a>
                <a
                  href={`mailto:${DEVELOPER_INFO.email}`}
                  className="cta-btn"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#ccc", padding: "13px 28px", borderRadius: "12px",
                    textDecoration: "none", fontWeight: 600, fontSize: "0.88rem",
                    display: "flex", alignItems: "center", gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                >
                  ✉️ Contact Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        textAlign: "center", padding: "40px 20px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        color: "#2a2a2a", fontSize: "0.8rem",
      }}>
        <div style={{ marginBottom: "8px", fontSize: "1.2rem" }}>🎬</div>
        © {new Date().getFullYear()} CineTube • Built with passion by{" "}
        <span style={{ color: "#444" }}>{DEVELOPER_INFO.name}</span>
      </footer>
    </div>
  );
}