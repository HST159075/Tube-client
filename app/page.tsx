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

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    if (!API) return;
    const fetches = [
      { url: `${API}/media?sort=top-rated&limit=6`, set: setTopRated },
      { url: `${API}/media?sort=newest&limit=4`,    set: setNewlyAdded },
      { url: `${API}/media?sort=top-rated&limit=3`, set: (d: any[]) => { if (d.length > 0) setFeatured(d); } },
    ];
    fetches.forEach(({ url, set }) => {
      fetch(url, { credentials: "include" })
        .then(r => r.json())
        .then(d => { const list = d.data || d.media || d || []; if (Array.isArray(list) && list.length > 0) (set as any)(list); })
        .catch(() => {});
    });
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

      <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "'DM Sans', sans-serif", width: "100%", overflowX: "hidden" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
        <div style={{ position: "relative", height: "100svh", minHeight: "560px", maxHeight: "900px", overflow: "hidden", width: "100%" }}>

          {/* Backdrop — KEY FIX: width:100%, left:0, right:0 explicitly */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${hero.backdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center center", // center both axes
            backgroundRepeat: "no-repeat",
            transition: "background-image 0.8s ease",
          }} />

          {/* Left-to-right gradient overlay */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.25) 100%)",
          }} />

          {/* Bottom fade to page bg */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "linear-gradient(to top, rgba(10,10,10,1) 0%, transparent 45%)",
          }} />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "80px 5vw 40px" }}>
            <span style={{ background: "#e50914", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "2px", padding: "4px 10px", borderRadius: "3px", width: "fit-content", marginBottom: "14px", textTransform: "uppercase" }}>
              FEATURED
            </span>

            <h1 style={{ fontSize: "clamp(2rem, 7vw, 4.5rem)", fontWeight: 900, lineHeight: 1.05, maxWidth: "600px", marginBottom: "12px", fontFamily: "'Playfair Display', serif" }}>
              {hero.title}
            </h1>

            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
              <span style={{ color: "#f5c518", fontWeight: 700, fontSize: "1rem" }}>★ {typeof hero.rating === "number" ? hero.rating.toFixed(1) : hero.rating}</span>
              <span style={{ color: "#666" }}>•</span>
              <span style={{ color: "#aaa", fontSize: "0.88rem" }}>{hero.year}</span>
              <span style={{ color: "#666" }}>•</span>
              <span style={{ color: "#aaa", fontSize: "0.88rem" }}>{hero.genre}</span>
            </div>

            <p style={{ color: "#bbb", maxWidth: "480px", lineHeight: 1.65, marginBottom: "24px", fontSize: "clamp(0.85rem, 2vw, 0.97rem)" }}>
              {hero.description}
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href={`/movies/${hero.id}`}>
                <button style={{ background: "#e50914", color: "#fff", border: "none", padding: "13px 26px", borderRadius: "9px", fontWeight: 700, fontSize: "0.92rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  ▶ Watch Now
                </button>
              </Link>
              <Link href={`/movies/${hero.id}`}>
                <button style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", padding: "13px 22px", borderRadius: "9px", fontWeight: 600, fontSize: "0.92rem", cursor: "pointer", backdropFilter: "blur(8px)", fontFamily: "'DM Sans', sans-serif" }}>
                  + Watchlist
                </button>
              </Link>
            </div>

            {/* Dots */}
            <div style={{ display: "flex", gap: "6px", marginTop: "32px" }}>
              {featured.map((_, i) => (
                <button key={i} onClick={() => setHeroIndex(i)}
                  style={{ width: i === heroIndex ? "24px" : "7px", height: "7px", borderRadius: "4px", background: i === heroIndex ? "#e50914" : "rgba(255,255,255,0.25)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
              ))}
            </div>
          </div>
        </div>

        {/* ══ SEARCH ════════════════════════════════════════════════════════════ */}
        <div style={{ padding: "0 4vw", marginTop: "-28px", position: "relative", zIndex: 20 }}>
          <div style={{ background: "rgba(18,18,18,0.95)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "16px", padding: "16px", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search movies, series..."
                style={{ flex: 1, minWidth: "160px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "9px", padding: "11px 14px", color: "#fff", fontSize: "0.92rem", outline: "none", fontFamily: "'DM Sans', sans-serif" }}
              />
              <button onClick={handleSearch}
                style={{ background: "#e50914", color: "#fff", border: "none", borderRadius: "9px", padding: "11px 20px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                Search
              </button>
            </div>
            <div style={{ display: "flex", gap: "7px", marginTop: "10px", flexWrap: "wrap" }}>
              {["Action", "Drama", "Sci-Fi", "Crime", "Comedy", "Thriller"].map(g => (
                <button key={g} onClick={() => router.push(`/movies?genre=${g}`)}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "5px 12px", color: "#888", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(229,9,20,0.15)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}>
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
        style={{ transition: "transform 0.25s", transform: hovered ? "scale(1.04)" : "scale(1)" }}
      >
        <div style={{ position: "relative", borderRadius: "11px", overflow: "hidden", aspectRatio: "2/3", background: "#1a1a1a", marginBottom: "9px" }}>
          {poster
            ? <img src={poster} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🎬</div>
          }
          {hovered && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ background: "#e50914", color: "#fff", padding: "7px 16px", borderRadius: "20px", fontWeight: 700, fontSize: "0.8rem" }}>▶ Watch</span>
            </div>
          )}
          {rating && (
            <div style={{ position: "absolute", top: "7px", right: "7px", background: "rgba(0,0,0,0.82)", borderRadius: "5px", padding: "2px 6px", fontSize: "11px", fontWeight: 700, color: "#f5c518" }}>
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