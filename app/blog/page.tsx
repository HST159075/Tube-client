"use client";
import Link from "next/link";

const POSTS = [
  { id: 1, title: "The Rise of Sci-Fi: Why 2024 is the Year of Space Epics", category: "Trends", date: "Oct 12, 2024", time: "5 min read", img: "https://picsum.photos/seed/blog1/600/400" },
  { id: 2, title: "10 Hidden Gems on CineTube You Probably Missed", category: "Recommendations", date: "Oct 10, 2024", time: "8 min read", img: "https://picsum.photos/seed/blog2/600/400" },
  { id: 3, title: "Interview: The Cinematography of Dune: Part Two", category: "Interviews", date: "Oct 08, 2024", time: "12 min read", img: "https://picsum.photos/seed/blog3/600/400" },
  { id: 4, title: "Everything We Know About the Upcoming Batman Sequel", category: "News", date: "Oct 05, 2024", time: "4 min read", img: "https://picsum.photos/seed/blog4/600/400" },
];

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", paddingTop: "120px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 5vw" }}>
        
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, fontFamily: "'Playfair Display', serif", marginBottom: "16px" }}>The Cinema Log</h1>
          <p style={{ color: "#666", fontSize: "1.1rem" }}>News, reviews, and insights from the world of film.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
          {POSTS.map(post => (
            <article key={post.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px", overflow: "hidden", transition: "transform 0.3s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                <img src={post.img} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ background: "rgba(229,9,20,0.1)", color: "#e50914", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>{post.category}</span>
                  <span style={{ color: "#444", fontSize: "0.75rem" }}>{post.time}</span>
                </div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, lineHeight: 1.4, marginBottom: "16px", fontFamily: "'Playfair Display', serif" }}>{post.title}</h2>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  <span style={{ color: "#666", fontSize: "0.85rem" }}>{post.date}</span>
                  <Link href={`/blog/${post.id}`} style={{ color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "0.9rem" }}>Read More →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
