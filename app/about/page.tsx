"use client";

import React from "react";

export default function AboutPage() {
  const DEVELOPER_INFO = {
    name: "Md Tasinul Alam",
    role: "MERN Stack Developer & UI/UX Enthusiast",
    email: "hsttasin90@gmail.com",
    github: "https://github.com/HST159075", // Updated link
    avatarUrl: "/my-avatar.png", 
  };

  const STATS = [
    { label: "Projects Done", value: "15+" },
    { label: "Tech Stack", value: "8+" },
    { label: "Experience", value: "2 Years" },
  ];

  const SKILLS = ["React", "Next.js", "Node.js", "MongoDB", "Express", "Tailwind CSS", "TypeScript"];

  const FEATURES = [
    { title: "Modern UI", desc: "Intuitive and clean dashboard designed with best UI/UX practices.", icon: "🎨" },
    { title: "Fast Loading", desc: "Optimized for speed and performance, ensuring smooth user experience.", icon: "⚡" },
    { title: "Tech Stack", desc: "Built with Next.js (MERN), Tailwind CSS, and modern technologies.", icon: "💻" },
    { title: "User Focused", desc: "Designed keeping user needs and accessibility in mind.", icon: "👥" },
  ];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "'DM Sans', sans-serif", paddingBottom: "80px", overflowX: "hidden" }}>
      
      {/* ── Hero Section ── */}
      <div style={{ padding: "100px 5vw 60px", textAlign: "center", background: "linear-gradient(to bottom, #111 0%, #0a0a0a 100%)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ background: "#e50914", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "2px", padding: "5px 12px", borderRadius: "4px", textTransform: "uppercase" }}>
          Developer Profile
        </span>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, marginTop: "20px", marginBottom: "15px" }}>
          I'm <span style={{ color: "#e50914" }}>{DEVELOPER_INFO.name}</span>
        </h1>
        <p style={{ color: "#888", fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" }}>
          I am a passionate developer and the creator of Tube Client. I build high-performance web applications with a focus on user experience.
        </p>

        {/* ── Stats Summary ── */}
        <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap", marginTop: "40px" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ color: "#e50914", fontSize: "1.8rem", fontWeight: 900 }}>{s.value}</div>
              <div style={{ color: "#666", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features Grid ── */}
      <div style={{ maxWidth: "1100px", margin: "60px auto", padding: "0 5vw" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
          {FEATURES.map((f, i) => (
            <div 
              key={i} 
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: "30px", borderRadius: "20px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", cursor: "default" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor = "rgba(229, 9, 20, 0.4)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "15px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "10px" }}>{f.title}</h3>
              <p style={{ color: "#666", fontSize: "0.9rem", lineHeight: "1.6" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── About Me / Identity ── */}
      <div style={{ maxWidth: "900px", margin: "80px auto", padding: "0 5vw" }}>
        <div style={{ background: "linear-gradient(145deg, #111, #050505)", borderRadius: "30px", padding: "50px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "40px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
          
          <div style={{ width: "200px", height: "200px", borderRadius: "50%", background: "#222", overflow: "hidden", border: "4px solid #e50914", flexShrink: 0, margin: "0 auto", boxShadow: "0 0 20px rgba(229, 9, 20, 0.3)" }}>
            <img src={DEVELOPER_INFO.avatarUrl} alt="Me" style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                 onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Tasin&background=e50914&color=fff"; }} />
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "10px" }}>My Work on Tube Client</h2>
            <p style={{ color: "#e50914", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px" }}>{DEVELOPER_INFO.role}</p>
            
            {/* Skills Badges */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "20px" }}>
              {SKILLS.map(skill => (
                <span key={skill} style={{ background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "6px", fontSize: "0.7rem", color: "#aaa", border: "1px solid rgba(255,255,255,0.1)" }}>{skill}</span>
              ))}
            </div>

            <p style={{ color: "#aaa", lineHeight: "1.8", marginBottom: "30px" }}>
              আমি এই প্ল্যাটফর্মটির ইউআই থেকে শুরু করে ব্যাকএন্ড আর্কিটেকচার পর্যন্ত প্রতিটি অংশ নিখুঁতভাবে তৈরি করার চেষ্টা করেছি। বিশেষ করে ইউজারদের ডেটা সিকিউরিটি এবং ফাস্ট লোডিং স্পিড আমার প্রধান লক্ষ্য ছিল।
            </p>
            
            <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href={DEVELOPER_INFO.github} target="_blank" rel="noopener noreferrer" style={{ background: "#fff", color: "#000", padding: "12px 25px", borderRadius: "10px", textDecoration: "none", fontWeight: 700, fontSize: "0.9rem", transition: "0.2s" }}
                 onMouseEnter={e => e.currentTarget.style.opacity = "0.8"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                GitHub Profile
              </a>
              <a href={`mailto:${DEVELOPER_INFO.email}`} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "12px 25px", borderRadius: "10px", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem", border: "1px solid rgba(255,255,255,0.2)", transition: "0.2s" }}
                 onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ textAlign: "center", padding: "40px 0", color: "#444", fontSize: "0.8rem", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "40px" }}>
        © {new Date().getFullYear()} Tube Client • Built with passion by {DEVELOPER_INFO.name}
      </footer>
    </div>
  );
}