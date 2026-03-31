"use client";
import { useState } from "react";
import Link from "next/link";

// Mock data — replace with real API calls to your backend
const STATS = [
  { label: "Total Movies", value: "284", icon: "🎬", change: "+12 this week", color: "#e50914" },
  { label: "Pending Reviews", value: "23", icon: "⏳", change: "Need approval", color: "#f5c518" },
  { label: "Total Users", value: "1,842", icon: "👥", change: "+38 this week", color: "#4ade80" },
  { label: "Monthly Revenue", value: "$4,280", icon: "💰", change: "+18% vs last month", color: "#60a5fa" },
];

const PENDING_REVIEWS = [
  { id: 1, user: "MovieFan99", movie: "Oppenheimer", rating: 9, excerpt: "Absolutely stunning cinematography and performances...", date: "2024-03-28", spoiler: false },
  { id: 2, user: "CinemaLover", movie: "Dune: Part Two", rating: 8, excerpt: "Villeneuve delivers another visually spectacular...", date: "2024-03-27", spoiler: true },
  { id: 3, user: "FilmCritic22", movie: "Poor Things", rating: 7, excerpt: "A surreal and bizarre take on the Frankenstein myth...", date: "2024-03-26", spoiler: false },
];

const RECENT_ACTIVITY = [
  { type: "review", user: "John D.", action: "submitted a review for", target: "The Godfather", time: "2 min ago" },
  { type: "user", user: "Sarah M.", action: "registered", target: "", time: "15 min ago" },
  { type: "purchase", user: "Ahmed K.", action: "subscribed to", target: "Monthly Plan", time: "1 hr ago" },
  { type: "review", user: "Admin", action: "approved review for", target: "Inception", time: "2 hr ago" },
];

const TOP_TITLES = [
  { title: "Breaking Bad", avgRating: 9.5, reviews: 2100, platform: "Netflix" },
  { title: "The Godfather", avgRating: 9.2, reviews: 1240, platform: "Netflix" },
  { title: "The Dark Knight", avgRating: 9.0, reviews: 980, platform: "HBO Max" },
  { title: "Oppenheimer", avgRating: 9.1, reviews: 540, platform: "Netflix" },
  { title: "Inception", avgRating: 8.8, reviews: 870, platform: "Amazon Prime" },
];

export default function AdminDashboard() {
  const [pendingReviews, setPendingReviews] = useState(PENDING_REVIEWS);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "movies" | "users">("overview");

  const handleApprove = (id: number) => setPendingReviews(p => p.filter(r => r.id !== id));
  const handleReject = (id: number) => setPendingReviews(p => p.filter(r => r.id !== id));

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>

      {/* SIDEBAR */}
      <aside style={{ width: "240px", flexShrink: 0, background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.07)", padding: "32px 20px", position: "fixed", top: 0, bottom: 0, overflowY: "auto" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
          <span style={{ background: "#e50914", color: "#fff", fontWeight: 900, fontSize: "1.2rem", padding: "4px 8px", borderRadius: "6px", fontFamily: "'Playfair Display', serif" }}>CINE</span>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "1rem" }}>RATE</span>
          <span style={{ background: "rgba(245,197,24,0.2)", color: "#f5c518", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", letterSpacing: "1px" }}>ADMIN</span>
        </Link>

        <nav>
          {[
            { id: "overview", icon: "📊", label: "Overview" },
            { id: "reviews", icon: "📝", label: "Reviews", badge: pendingReviews.length },
            { id: "movies", icon: "🎬", label: "Movies / Series" },
            { id: "users", icon: "👥", label: "Users" },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)}
              style={{
                display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 16px", borderRadius: "10px", border: "none", cursor: "pointer", marginBottom: "4px", textAlign: "left",
                background: activeTab === item.id ? "rgba(229,9,20,0.15)" : "transparent",
                color: activeTab === item.id ? "#e50914" : "#aaa",
                fontWeight: activeTab === item.id ? 700 : 400, fontSize: "0.95rem",
              }}>
              <span>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge ? <span style={{ background: "#e50914", color: "#fff", borderRadius: "12px", padding: "2px 8px", fontSize: "11px", fontWeight: 700 }}>{item.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "40px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#666", textDecoration: "none", fontSize: "0.9rem", padding: "10px" }}>
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: "240px", padding: "40px 40px 80px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "reviews" && "Review Moderation"}
            {activeTab === "movies" && "Media Library"}
            {activeTab === "users" && "User Management"}
          </h1>
          <p style={{ color: "#888", marginTop: "4px" }}>Monday, March 30, 2026</p>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
              {STATS.map(stat => (
                <div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <span style={{ fontSize: "1.8rem" }}>{stat.icon}</span>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: stat.color }} />
                  </div>
                  <p style={{ fontSize: "2rem", fontWeight: 900, color: stat.color, marginBottom: "4px" }}>{stat.value}</p>
                  <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "4px" }}>{stat.label}</p>
                  <p style={{ color: "#555", fontSize: "0.8rem" }}>{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Two columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
              {/* Pending Reviews */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Pending Reviews</h2>
                  <button onClick={() => setActiveTab("reviews")} style={{ background: "transparent", border: "none", color: "#e50914", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>View all →</button>
                </div>
                {pendingReviews.slice(0, 3).map(r => (
                  <div key={r.id} style={{ paddingBottom: "16px", marginBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{r.user}</span>
                      <span style={{ color: "#f5c518", fontSize: "0.85rem", fontWeight: 700 }}>★ {r.rating}/10</span>
                    </div>
                    <p style={{ color: "#888", fontSize: "0.8rem", marginBottom: "6px" }}>{r.movie} {r.spoiler && "⚠️"}</p>
                    <p style={{ color: "#ccc", fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.excerpt}</p>
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                      <button onClick={() => handleApprove(r.id)}
                        style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "6px", padding: "5px 14px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>
                        ✓ Approve
                      </button>
                      <button onClick={() => handleReject(r.id)}
                        style={{ background: "rgba(229,9,20,0.1)", color: "#e50914", border: "1px solid rgba(229,9,20,0.3)", borderRadius: "6px", padding: "5px 14px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
                {pendingReviews.length === 0 && <p style={{ color: "#555", textAlign: "center", padding: "20px" }}>✅ All reviews handled!</p>}
              </div>

              {/* Top Titles */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "20px" }}>Top Rated Titles</h2>
                {TOP_TITLES.map((t, i) => (
                  <div key={t.title} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <span style={{ color: "#555", fontWeight: 700, width: "20px", fontSize: "0.9rem" }}>#{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "2px" }}>{t.title}</p>
                      <p style={{ color: "#888", fontSize: "0.78rem" }}>{t.platform} · {t.reviews} reviews</p>
                    </div>
                    <span style={{ color: "#f5c518", fontWeight: 700 }}>★ {t.avgRating}</span>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px", gridColumn: "1 / -1" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "20px" }}>Recent Activity</h2>
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", paddingBottom: "14px", marginBottom: "14px", borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <span style={{ fontSize: "1.2rem" }}>{a.type === "review" ? "📝" : a.type === "user" ? "👤" : "💳"}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.9rem" }}>
                        <strong>{a.user}</strong> <span style={{ color: "#888" }}>{a.action}</span>
                        {a.target && <strong> {a.target}</strong>}
                      </p>
                    </div>
                    <span style={{ color: "#555", fontSize: "0.8rem" }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
              <h2 style={{ fontWeight: 700, marginBottom: "24px" }}>Pending Reviews ({pendingReviews.length})</h2>
              {pendingReviews.length === 0
                ? <p style={{ color: "#555", textAlign: "center", padding: "40px" }}>✅ No pending reviews!</p>
                : pendingReviews.map(r => (
                  <div key={r.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <p style={{ fontWeight: 700 }}>{r.user} <span style={{ color: "#888", fontWeight: 400 }}>reviewed</span> {r.movie}</p>
                        <p style={{ color: "#888", fontSize: "0.8rem" }}>{r.date} {r.spoiler && "· ⚠️ Contains spoilers"}</p>
                      </div>
                      <span style={{ color: "#f5c518", fontWeight: 700 }}>★ {r.rating}/10</span>
                    </div>
                    <p style={{ color: "#ccc", marginBottom: "16px", lineHeight: 1.6 }}>{r.excerpt}</p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => handleApprove(r.id)}
                        style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "8px", padding: "8px 20px", cursor: "pointer", fontWeight: 700 }}>
                        ✓ Approve & Publish
                      </button>
                      <button onClick={() => handleReject(r.id)}
                        style={{ background: "rgba(229,9,20,0.1)", color: "#e50914", border: "1px solid rgba(229,9,20,0.3)", borderRadius: "8px", padding: "8px 20px", cursor: "pointer", fontWeight: 700 }}>
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* MOVIES TAB */}
        {activeTab === "movies" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
              <Link href="/admin/movies/new">
                <button style={{ background: "#e50914", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}>
                  + Add New Title
                </button>
              </Link>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {["Title", "Genre", "Year", "Platform", "Rating", "Reviews", "Actions"].map(h => (
                      <th key={h} style={{ padding: "16px 20px", textAlign: "left", color: "#888", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TOP_TITLES.map(t => (
                    <tr key={t.title} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "16px 20px", fontWeight: 700 }}>{t.title}</td>
                      <td style={{ padding: "16px 20px", color: "#888" }}>Crime</td>
                      <td style={{ padding: "16px 20px", color: "#888" }}>1972</td>
                      <td style={{ padding: "16px 20px", color: "#888" }}>{t.platform}</td>
                      <td style={{ padding: "16px 20px", color: "#f5c518", fontWeight: 700 }}>★ {t.avgRating}</td>
                      <td style={{ padding: "16px 20px", color: "#888" }}>{t.reviews}</td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button style={{ background: "rgba(96,165,250,0.15)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.3)", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Edit</button>
                          <button style={{ background: "rgba(229,9,20,0.1)", color: "#e50914", border: "1px solid rgba(229,9,20,0.3)", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
