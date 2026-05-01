"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FEATURED = [
  { id: 1, title: "Oppenheimer", genre: "Drama / History", rating: 9.1, year: 2023, poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", backdrop: "https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg", description: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II." },
  { id: 2, title: "Breaking Bad", genre: "Crime / Thriller", rating: 9.5, year: 2008, poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", backdrop: "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg", description: "A high school chemistry teacher turned methamphetamine producer partners with a former student." },
  { id: 3, title: "Interstellar", genre: "Sci-Fi / Adventure", rating: 8.7, year: 2014, poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", backdrop: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
];

const TOP_RATED = [
  { id: 1, title: "The Godfather",   rating: 9.2, genre: "Crime",  year: 1972, poster: "https://image.tmdb.org/t/p/w300/3bhkrj58Vtu7enYsLLeHjThrVPa.jpg" },
  { id: 2, title: "The Dark Knight", rating: 9.0, genre: "Action", year: 2008, poster: "https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
  { id: 3, title: "Schindler's List",rating: 8.9, genre: "Drama",  year: 1993, poster: "https://image.tmdb.org/t/p/w300/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg" },
  { id: 4, title: "Pulp Fiction",    rating: 8.9, genre: "Crime",  year: 1994, poster: "https://image.tmdb.org/t/p/w300/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg" },
  { id: 5, title: "Inception",       rating: 8.8, genre: "Sci-Fi", year: 2010, poster: "https://image.tmdb.org/t/p/w300/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg" },
  { id: 6, title: "Fight Club",      rating: 8.8, genre: "Drama",  year: 1999, poster: "https://image.tmdb.org/t/p/w300/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg" },
];

const NEWLY_ADDED = [
  { id: 7, title: "Poor Things",   rating: 8.1, genre: "Fantasy",  year: 2023, poster: "https://image.tmdb.org/t/p/w300/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg" },
  { id: 8, title: "Dune: Part Two",rating: 8.5, genre: "Sci-Fi",   year: 2024, poster: "https://image.tmdb.org/t/p/w300/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg" },
  { id: 9, title: "Shogun",        rating: 9.0, genre: "Drama",    year: 2024, poster: "https://image.tmdb.org/t/p/w300/3b2MANGK0MuG7m0QJSA1ZEWJMZB.jpg" },
  { id: 10,title: "Baby Reindeer", rating: 8.2, genre: "Thriller", year: 2024, poster: "https://image.tmdb.org/t/p/w300/3BQfLXjzlP58dblXaBnvtKCnJ7J.jpg" },
];

const PLANS = [
  { name: "Free",    priceLabel: "৳0",     period: "forever",   color: "#4ade80", features: ["Browse all titles", "Read reviews", "Write reviews", "Watchlist (10 titles)"], highlight: false, cta: "Get Started" },
  { name: "Monthly", priceLabel: "৳299",   period: "per month", color: "#e50914", features: ["Everything in Free", "Watch ALL premium", "Unlimited watchlist", "HD streaming", "No ads"], highlight: true,  cta: "Start Monthly", badge: "Popular" },
  { name: "Yearly",  priceLabel: "৳2,499", period: "per year",  color: "#f5c518", features: ["Everything in Monthly", "4K streaming", "Download offline", "2 months FREE", "Priority support"], highlight: false, cta: "Best Value", badge: "Save 30%" },
];

export default function HomePage() {
  const router = useRouter();
  const [heroIndex, setHeroIndex]   = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [topRated, setTopRated]     = useState<any[]>([]);
  const [newlyAdded, setNewlyAdded] = useState<any[]>([]);
  const [featured, setFeatured]     = useState<any[]>(FEATURED);
  const [playingVideo, setPlayingVideo] = useState(false);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    if (!API) return;

    // Top Rated — sort by rating descending
    fetch(`${API}/media?sort=top-rated&limit=10`, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        const list = d.data || d.media || d || [];
        if (Array.isArray(list) && list.length > 0) {
          const sorted = [...list].sort((a, b) => (b.avgRating || b.rating || 0) - (a.avgRating || a.rating || 0));
          setTopRated(sorted.slice(0, 8));
        }
      })
      .catch(() => {});

    // Newly Added — sort by date descending
    fetch(`${API}/media?sort=newest&limit=10`, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        const list = d.data || d.media || d || [];
        if (Array.isArray(list) && list.length > 0) {
          const sorted = [...list].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setNewlyAdded(sorted.slice(0, 8));
        }
      })
      .catch(() => {});

    // Featured hero — top 3 by rating
    fetch(`${API}/media?sort=top-rated&limit=5`, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        const list = d.data || d.media || d || [];
        if (Array.isArray(list) && list.length > 0) {
          const sorted = [...list].sort((a, b) => (b.avgRating || b.rating || 0) - (a.avgRating || a.rating || 0));
          setFeatured(sorted.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(p => (p + 1) % featured.length), 6000);
    return () => clearInterval(timer);
  }, [featured]);

  const raw  = featured[heroIndex] || FEATURED[0];
  const hero = {
    id:          raw.id,
    title:       raw.title,
    genre:       Array.isArray(raw.genres) ? raw.genres.join(" / ") : raw.genre || (Array.isArray(raw.genre) ? raw.genre.join(" / ") : raw.genre) || "",
    rating:      raw.avgRating || raw.rating || 0,
    year:        raw.releaseYear || raw.year,
    poster:      raw.posterUrl  || raw.poster  || raw.image || "",
    backdrop:    raw.backdropUrl|| raw.backdrop || raw.posterUrl || raw.poster || raw.image || "",
    description: raw.synopsis   || raw.description || "",
    videoUrl:    raw.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ", // fallback trailer
  };

  const handleSearch = () => {
    if (searchQuery.trim()) router.push(`/movies?q=${encodeURIComponent(searchQuery)}`);
    else router.push("/movies");
  };

  return (
    <>
      {/* ── Global fix: no horizontal overflow ── */}
      <style>{`
        html, body { overflow-x: hidden; margin: 0; padding: 0; }
        .scroll-row::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", width: "100%", overflowX: "hidden", transition: "background 0.35s, color 0.35s" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
        <div style={{ position: "relative", height: "70vh", minHeight: "580px", maxHeight: "920px", overflow: "hidden", width: "100%" }}>

          {/* Backdrop image */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${hero.backdrop})`,
            backgroundSize: "cover", backgroundPosition: "center 20%",
            backgroundRepeat: "no-repeat",
            transition: "background-image 1s ease",
            transform: "scale(1.05)",
          }} />

          {/* Cinematic overlays */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.3) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--bg) 0%, transparent 40%)" }} />
          {/* Top vignette */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)" }} />
          {/* Red accent glow */}
          <div style={{ position: "absolute", bottom: 0, left: "10%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(229,9,20,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", padding: "0 5vw 60px", maxWidth: "1400px", margin: "0 auto" }}>
            
            {/* Badge */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px" }}>
              <span style={{
                background: "rgba(229,9,20,0.9)", color: "#fff", fontSize: "10px", fontWeight: 800,
                letterSpacing: "2.5px", padding: "5px 14px", borderRadius: "4px", textTransform: "uppercase",
                backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)",
              }}>
                ⭐ Featured
              </span>
              <span style={{
                background: "rgba(255,255,255,0.08)", color: "#f5c518", fontSize: "10px", fontWeight: 800,
                letterSpacing: "1px", padding: "5px 12px", borderRadius: "4px",
                backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.06)",
              }}>
                ★ {typeof hero.rating === "number" ? hero.rating.toFixed(1) : hero.rating}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: "clamp(2.2rem, 6vw, 4.2rem)", fontWeight: 900, lineHeight: 1.0,
              maxWidth: "650px", marginBottom: "14px",
              fontFamily: "'Playfair Display', serif",
              color: "#fff",
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            }}>
              {hero.title}
            </h1>

            {/* Meta info */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "14px", flexWrap: "wrap" }}>
              <span style={{
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px",
                padding: "4px 12px", color: "#ccc", fontSize: "0.82rem", fontWeight: 600,
              }}>{hero.year}</span>
              <span style={{
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px",
                padding: "4px 12px", color: "#ccc", fontSize: "0.82rem", fontWeight: 600,
              }}>{hero.genre}</span>
              <span style={{
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px",
                padding: "4px 12px", color: "#ccc", fontSize: "0.82rem", fontWeight: 600,
              }}>HD</span>
            </div>

            {/* Description */}
            <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: "500px", lineHeight: 1.7, marginBottom: "28px", fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)" }}>
              {hero.description}
            </p>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <button 
                onClick={() => setPlayingVideo(true)}
                style={{
                background: "linear-gradient(135deg, #e50914, #c0070f)",
                color: "#fff", border: "none", padding: "14px 32px", borderRadius: "12px",
                fontWeight: 800, fontSize: "0.95rem", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 6px 24px rgba(229,9,20,0.4)",
                transition: "all 0.3s",
                display: "flex", alignItems: "center", gap: "8px",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(229,9,20,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(229,9,20,0.4)"; }}
              >
                ▶ Watch Now
              </button>
              <Link href={`/movies/${hero.id}`} style={{ textDecoration: "none" }}>
                <button style={{
                  background: "rgba(255,255,255,0.08)", color: "#fff",
                  border: "1px solid rgba(255,255,255,0.18)", padding: "14px 28px",
                  borderRadius: "12px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
                  backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.3s",
                  display: "flex", alignItems: "center", gap: "8px",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
                >
                  + Watchlist
                </button>
              </Link>
            </div>

            {/* Slide indicators */}
            <div style={{ display: "flex", gap: "8px", marginTop: "36px", alignItems: "center" }}>
              {featured.map((_, i) => (
                <button key={i} onClick={() => setHeroIndex(i)}
                  style={{
                    width: i === heroIndex ? "32px" : "8px", height: "4px",
                    borderRadius: "2px",
                    background: i === heroIndex ? "#e50914" : "rgba(255,255,255,0.2)",
                    border: "none", cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)", padding: 0,
                  }} />
              ))}
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", marginLeft: "8px", fontWeight: 600 }}>
                {heroIndex + 1} / {featured.length}
              </span>
            </div>
          </div>
        </div>

        {/* ══ VIDEO MODAL ═══════════════════════════════════════════════════════ */}
        {playingVideo && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(10px)",
          }}>
            <div style={{ position: "relative", width: "90%", maxWidth: "1000px", aspectRatio: "16/9", background: "#000", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}>
              <button 
                onClick={() => setPlayingVideo(false)}
                style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.2)", color: "#fff", border: "none", width: "40px", height: "40px", borderRadius: "50%", fontSize: "1.5rem", cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
              >
                ✕
              </button>
              <iframe 
                src={hero.videoUrl.includes("youtube.com/watch?v=") ? hero.videoUrl.replace("watch?v=", "embed/") + "?autoplay=1" : hero.videoUrl} 
                style={{ width: "100%", height: "100%", border: "none" }} 
                allow="autoplay; fullscreen"
              />
            </div>
          </div>
        )}

        {/* ══ SEARCH ════════════════════════════════════════════════════════════ */}
        <div style={{ padding: "0 4vw", marginTop: "-32px", position: "relative", zIndex: 20, maxWidth: "1400px", margin: "-32px auto 0" }}>
          <div style={{
            background: "rgba(15,15,18,0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px", padding: "20px 24px",
            backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="🔍 Search movies, series, actors..."
                style={{
                  flex: 1, minWidth: "200px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px", padding: "13px 18px", color: "#fff",
                  fontSize: "0.95rem", outline: "none", fontFamily: "'DM Sans', sans-serif",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(229,9,20,0.4)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
              />
              <button onClick={handleSearch}
                style={{
                  background: "linear-gradient(135deg, #e50914, #c0070f)", color: "#fff",
                  border: "none", borderRadius: "12px", padding: "13px 24px",
                  fontWeight: 700, cursor: "pointer", fontSize: "0.9rem",
                  fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
                  boxShadow: "0 4px 16px rgba(229,9,20,0.3)",
                }}>
                Search
              </button>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
              {["Action", "Drama", "Sci-Fi", "Crime", "Comedy", "Thriller", "Horror"].map(g => (
                <button key={g} onClick={() => router.push(`/movies?genre=${g}`)}
                  style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "20px", padding: "6px 14px", color: "#777",
                    fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(229,9,20,0.12)"; e.currentTarget.style.color = "#e50914"; e.currentTarget.style.borderColor = "rgba(229,9,20,0.25)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#777"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ TOP RATED ═════════════════════════════════════════════════════════ */}
        <Section title="⭐ Top Rated" subtitle="Highest rated by our community" href="/movies?sort=top-rated">
          <ScrollRow>
            {(topRated.length > 0 ? topRated : TOP_RATED).map(m => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </ScrollRow>
        </Section>

        {/* ══ NEWLY ADDED ═══════════════════════════════════════════════════════ */}
        <Section title="🆕 Newly Added" subtitle="Fresh content this week" href="/movies?sort=newest">
          <ScrollRow>
            {(newlyAdded.length > 0 ? newlyAdded : NEWLY_ADDED).map(m => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </ScrollRow>
        </Section>

        {/* ══ EDITOR'S PICKS BANNER ═════════════════════════════════════════════ */}
        <div style={{ margin: "48px 4vw 0" }}>
          <div style={{ background: "linear-gradient(135deg, #12001a 0%, #0d0d1f 50%, #001a12 100%)", borderRadius: "20px", padding: "clamp(28px, 5vw, 48px)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: "-60px", top: "-60px", width: "280px", height: "280px", background: "radial-gradient(circle, rgba(229,9,20,0.25) 0%, transparent 70%)", borderRadius: "50%" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span style={{ color: "#f5c518", fontWeight: 700, letterSpacing: "2px", fontSize: "11px", textTransform: "uppercase" }}>🎬 Editor's Picks</span>
              <h2 style={{ fontSize: "clamp(1.4rem, 4vw, 2.2rem)", fontWeight: 900, margin: "10px 0 12px", fontFamily: "'Playfair Display', serif" }}>
                Handpicked by Our Film Critics
              </h2>
              <p style={{ color: "#888", maxWidth: "420px", lineHeight: 1.7, marginBottom: "22px", fontSize: "0.9rem" }}>
                The finest cinema experiences — from timeless classics to cutting-edge releases.
              </p>
              <Link href="/movies">
                <button style={{ background: "#e50914", color: "#fff", border: "none", padding: "12px 26px", borderRadius: "9px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif" }}>
                  Explore Picks
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ══ PRICING ═══════════════════════════════════════════════════════════ */}
        <div style={{ padding: "64px 4vw 80px" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, fontFamily: "'Playfair Display', serif", marginBottom: "8px" }}>
              Choose Your Plan
            </h2>
            <p style={{ color: "#666", fontSize: "0.92rem" }}>Unlock unlimited entertainment</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", maxWidth: "900px", margin: "0 auto" }}>
            {PLANS.map(plan => (
              <div key={plan.name} style={{
                background: plan.highlight ? "linear-gradient(145deg, #1a0005, #2a0008)" : "rgba(255,255,255,0.03)",
                border: `2px solid ${plan.highlight ? "#e50914" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "18px", padding: "28px 22px", position: "relative",
                transition: "transform 0.3s",
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                {plan.badge && (
                  <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: plan.highlight ? "#e50914" : "#f5c518", color: plan.highlight ? "#fff" : "#000", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", padding: "3px 12px", borderRadius: "20px", whiteSpace: "nowrap" }}>
                    {plan.badge}
                  </div>
                )}
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "6px", color: plan.color }}>{plan.name}</h3>
                <div style={{ marginBottom: "20px" }}>
                  <span style={{ fontSize: "2.2rem", fontWeight: 900 }}>{plan.priceLabel}</span>
                  <span style={{ color: "#555", fontSize: "0.82rem", marginLeft: "5px" }}>/{plan.period}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, marginBottom: "22px" }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ padding: "7px 0", color: "#aaa", fontSize: "0.85rem", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#4ade80", fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/subscription">
                  <button style={{ width: "100%", padding: "12px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", background: plan.highlight ? "#e50914" : "rgba(255,255,255,0.07)", color: "#fff", border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.12)", transition: "opacity 0.2s" }}>
                    {plan.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ══ STATISTICS ═════════════════════════════════════════════════════════ */}
        <div style={{ padding: "64px 4vw", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "32px", textAlign: "center" }}>
            {[
              { label: "Movies & Series", value: "5,000+", icon: "🎬" },
              { label: "Active Reviewers", value: "10,000+", icon: "👥" },
              { label: "Average Rating", value: "4.8/5", icon: "⭐" },
              { label: "Daily Streamers", value: "2,500+", icon: "🚀" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{s.icon}</div>
                <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#e50914", marginBottom: "4px" }}>{s.value}</div>
                <div style={{ color: "#666", fontSize: "0.85rem", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ TESTIMONIALS ══════════════════════════════════════════════════════ */}
        <div style={{ padding: "80px 4vw" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, fontFamily: "'Playfair Display', serif", marginBottom: "8px" }}>What Fans Are Saying</h2>
            <p style={{ color: "#666" }}>Join the community of film enthusiasts</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              { name: "Sarah J.", role: "Film Critic", text: "CineTube has completely changed how I discover independent films. The recommendations are spot on!" },
              { name: "Mark D.", role: "Casual Viewer", text: "The Pro Plan is worth every penny for the 4K quality alone. Best streaming experience out there." },
              { name: "Elena R.", role: "Movie Blogger", text: "I love the community reviews. It's so easy to find what's actually worth watching this weekend." },
            ].map(t => (
              <div key={t.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", padding: "28px" }}>
                <p style={{ color: "#aaa", fontStyle: "italic", marginBottom: "20px", lineHeight: 1.6 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#e50914", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{t.name[0]}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{t.name}</p>
                    <p style={{ color: "#444", fontSize: "0.75rem" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ FAQ ═══════════════════════════════════════════════════════════════ */}
        <div style={{ padding: "80px 4vw", background: "rgba(0,0,0,0.3)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 900, fontFamily: "'Playfair Display', serif", marginBottom: "32px", textAlign: "center" }}>Got Questions?</h2>
            {[
              { q: "How do I cancel my subscription?", a: "You can cancel your subscription at any time from your profile settings. No hidden fees." },
              { q: "Can I watch on multiple devices?", a: "Yes! Depending on your plan, you can stream on up to 4 devices simultaneously." },
              { q: "Do you offer a student discount?", a: "Currently, we don't, but our Yearly plan offers the best value with 2 months free!" },
            ].map((f, i) => (
              <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "20px 0" }}>
                <p style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "10px", color: "#eee" }}>Q: {f.q}</p>
                <p style={{ color: "#666", lineHeight: 1.6, fontSize: "0.92rem" }}>A: {f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ NEWSLETTER ════════════════════════════════════════════════════════ */}
        <div style={{ padding: "80px 4vw" }}>
          <div style={{ background: "linear-gradient(135deg, #e50914 0%, #c0070f 100%)", borderRadius: "24px", padding: "60px 20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
             <div style={{ position: "absolute", inset: 0, background: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')", opacity: 0.1 }} />
             <div style={{ position: "relative", zIndex: 1 }}>
               <h2 style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 900, marginBottom: "16px", fontFamily: "'Playfair Display', serif" }}>Never Miss a Premiere</h2>
               <p style={{ color: "rgba(255,255,255,0.8)", maxWidth: "500px", margin: "0 auto 32px", lineHeight: 1.6 }}>Join our mailing list to get exclusive trailers, early access to tickets, and movie news delivered to your inbox.</p>
               <div style={{ display: "flex", gap: "10px", maxWidth: "450px", margin: "0 auto", flexWrap: "wrap" }}>
                 <input placeholder="Enter your email address" style={{ flex: 1, minWidth: "200px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px", padding: "14px 20px", color: "#fff", fontSize: "1rem", outline: "none", backdropFilter: "blur(10px)" }} />
                 <button style={{ background: "#fff", color: "#e50914", border: "none", borderRadius: "12px", padding: "14px 28px", fontWeight: 800, cursor: "pointer", fontSize: "0.95rem" }}>Subscribe</button>
               </div>
             </div>
          </div>
        </div>

        {/* ══ APP CTA ═══════════════════════════════════════════════════════════ */}
        <div style={{ padding: "80px 4vw 100px", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: "#444", marginBottom: "24px" }}>Available Everywhere</h2>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
             <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 24px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
               <span style={{ fontSize: "1.5rem" }}>🍎</span>
               <div style={{ textAlign: "left" }}>
                 <p style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "#666" }}>Download on the</p>
                 <p style={{ fontWeight: 700, fontSize: "1rem" }}>App Store</p>
               </div>
             </button>
             <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 24px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
               <span style={{ fontSize: "1.5rem" }}>🤖</span>
               <div style={{ textAlign: "left" }}>
                 <p style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "#666" }}>Get it on</p>
                 <p style={{ fontWeight: 700, fontSize: "1rem" }}>Google Play</p>
               </div>
             </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────────── */

function Section({ title, subtitle, href, children }: { title: string; subtitle: string; href: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: "48px 0 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 4vw", marginBottom: "18px" }}>
        <div>
          <h2 style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", fontWeight: 800, fontFamily: "'Playfair Display', serif", marginBottom: "3px" }}>{title}</h2>
          <p style={{ color: "#666", fontSize: "0.8rem" }}>{subtitle}</p>
        </div>
        <Link href={href} style={{ color: "#e50914", textDecoration: "none", fontWeight: 600, fontSize: "0.82rem", whiteSpace: "nowrap", marginLeft: "12px" }}>
          View All →
        </Link>
      </div>
      {children}
    </section>
  );
}

function ScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="scroll-row" style={{ display: "flex", gap: "14px", overflowX: "auto", padding: "0 4vw 12px", scrollbarWidth: "none" }}>
      {children}
    </div>
  );
}

function MovieCard({ movie }: { movie: any }) {
  const [hovered, setHovered] = useState(false);
  const poster = movie.posterUrl || movie.poster || movie.image;
  const title  = movie.title;
  const genre  = Array.isArray(movie.genres) ? movie.genres[0] : Array.isArray(movie.genre) ? movie.genre[0] : movie.genre;
  const year   = movie.releaseYear || movie.year;
  const rating = movie.avgRating  || movie.rating;

  return (
    <Link href={`/movies/${movie.id}`} style={{ textDecoration: "none", flexShrink: 0, width: "clamp(130px, 28vw, 170px)" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s",
          transform: hovered ? "scale(1.05) translateY(-4px)" : "scale(1)",
          boxShadow: hovered ? "0 12px 40px rgba(229,9,20,0.2)" : "none",
        }}
      >
        <div style={{
          position: "relative", borderRadius: "14px", overflow: "hidden",
          aspectRatio: "2/3", background: "#1a1a1a", marginBottom: "9px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          {poster
            ? <img src={poster} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🎬</div>
          }
          {/* Glassmorphism hover overlay */}
          {hovered && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.3s",
            }}>
              <span style={{
                background: "rgba(229,9,20,0.85)",
                backdropFilter: "blur(10px)",
                color: "#fff", padding: "8px 18px", borderRadius: "20px",
                fontWeight: 700, fontSize: "0.8rem",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 4px 16px rgba(229,9,20,0.4)",
              }}>▶ Watch</span>
            </div>
          )}
          {/* Glass rating badge */}
          {rating && (
            <div style={{
              position: "absolute", top: "8px", right: "8px",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", padding: "3px 8px",
              fontSize: "11px", fontWeight: 700, color: "#f5c518",
            }}>
              ★ {typeof rating === "number" ? rating.toFixed(1) : rating}
            </div>
          )}
        </div>
        <p style={{ fontSize: "0.83rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "3px" }}>{title}</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#666", fontSize: "0.73rem" }}>{genre}</span>
          <span style={{ color: "#666", fontSize: "0.73rem" }}>{year}</span>
        </div>
      </div>
    </Link>
  );
}