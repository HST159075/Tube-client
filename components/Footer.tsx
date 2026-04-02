"use client"

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    Browse: [
      { label: "All Movies", href: "/movies?type=MOVIE" },
      { label: "All Series", href: "/movies?type=SERIES" },
      { label: "Top Rated", href: "/movies?sort=top-rated" },
      { label: "Newly Added", href: "/movies?sort=newest" },
    ],
    Account: [
      { label: "My Profile", href: "/profile" },
      { label: "Watchlist", href: "/profile" },
      { label: "My Reviews", href: "/profile" },
      { label: "Subscription", href: "/subscription" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  };

  return (
    <footer style={{ background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,0.06)", color: "#fff", fontFamily: "'DM Sans', sans-serif", padding: "60px 5vw 32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Top row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px", flexWrap: "wrap" }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <span style={{ background: "#e50914", color: "#fff", fontWeight: 900, fontSize: "1.3rem", padding: "4px 10px", borderRadius: "6px", fontFamily: "'Playfair Display', serif" }}>CINE</span>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem" }}>RATE</span>
            </Link>
            <p style={{ color: "#555", lineHeight: 1.7, fontSize: "0.9rem", maxWidth: "280px", marginBottom: "20px" }}>
              The ultimate platform for discovering, rating, and reviewing movies and TV series. Join thousands of film enthusiasts.
            </p>
            {/* Social links */}
            <div style={{ display: "flex", gap: "10px" }}>
              {["𝕏", "📘", "📸", "▶"].map((icon, i) => (
                <a key={i} href="#" style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: "0.9rem", transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(229,9,20,0.2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#666", marginBottom: "16px" }}>{title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {items.map(item => (
                  <li key={item.label} style={{ marginBottom: "10px" }}>
                    <Link href={item.href} style={{ color: "#888", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ color: "#444", fontSize: "0.83rem" }}>
            © {currentYear} CineRate. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Terms of Service", "Privacy Policy", "Cookie Policy"].map(t => (
              <a key={t} href="#" style={{ color: "#444", textDecoration: "none", fontSize: "0.82rem" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#888")}
                onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
