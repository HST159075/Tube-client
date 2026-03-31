"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const FEATURED = [
  {
    id: 1,
    title: "Oppenheimer",
    genre: "Drama / History",
    rating: 9.1,
    year: 2023,
    platform: "Netflix",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    description: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
  },
  {
    id: 2,
    title: "Breaking Bad",
    genre: "Crime / Thriller",
    rating: 9.5,
    year: 2008,
    platform: "Disney+",
    poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    description: "A high school chemistry teacher turned methamphetamine producer partners with a former student.",
  },
  {
    id: 3,
    title: "Interstellar",
    genre: "Sci-Fi / Adventure",
    rating: 8.7,
    year: 2014,
    platform: "Amazon Prime",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
  },
];

const TOP_RATED = [
  { id: 1, title: "The Godfather", rating: 9.2, genre: "Crime", year: 1972, platform: "Netflix", poster: "https://image.tmdb.org/t/p/w300/3bhkrj58Vtu7enYsLLeHjThrVPa.jpg" },
  { id: 2, title: "The Dark Knight", rating: 9.0, genre: "Action", year: 2008, platform: "HBO Max", poster: "https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
  { id: 3, title: "Schindler's List", rating: 8.9, genre: "Drama", year: 1993, platform: "Netflix", poster: "https://image.tmdb.org/t/p/w300/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg" },
  { id: 4, title: "Pulp Fiction", rating: 8.9, genre: "Crime", year: 1994, platform: "Disney+", poster: "https://image.tmdb.org/t/p/w300/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg" },
  { id: 5, title: "Inception", rating: 8.8, genre: "Sci-Fi", year: 2010, platform: "Amazon Prime", poster: "https://image.tmdb.org/t/p/w300/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg" },
  { id: 6, title: "Fight Club", rating: 8.8, genre: "Drama", year: 1999, platform: "Netflix", poster: "https://image.tmdb.org/t/p/w300/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg" },
];

const NEWLY_ADDED = [
  { id: 7, title: "Poor Things", rating: 8.1, genre: "Fantasy", year: 2023, platform: "Disney+", poster: "https://image.tmdb.org/t/p/w300/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg" },
  { id: 8, title: "Dune: Part Two", rating: 8.5, genre: "Sci-Fi", year: 2024, platform: "HBO Max", poster: "https://image.tmdb.org/t/p/w300/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg" },
  { id: 9, title: "Shogun", rating: 9.0, genre: "Drama", year: 2024, platform: "Disney+", poster: "https://image.tmdb.org/t/p/w300/3b2MANGK0MuG7m0QJSA1ZEWJMZB.jpg" },
  { id: 10, title: "Baby Reindeer", rating: 8.2, genre: "Thriller", year: 2024, platform: "Netflix", poster: "https://image.tmdb.org/t/p/w300/3BQfLXjzlP58dblXaBnvtKCnJ7J.jpg" },
];

const PLANS = [
  { name: "Free", price: "$0", period: "forever", features: ["Browse all titles", "Read reviews", "Limited watchlist (10)", "Ads supported"], color: "#555", cta: "Get Started", highlight: false },
  { name: "Monthly", price: "$9.99", period: "per month", features: ["Everything in Free", "Unlimited watchlist", "Write & rate reviews", "HD streaming", "No ads", "Early access"], color: "#e50914", cta: "Start Monthly", highlight: true },
  { name: "Yearly", price: "$79.99", period: "per year", features: ["Everything in Monthly", "4K streaming", "Priority support", "Offline downloads", "Family sharing (5 users)", "2 months free"], color: "#f5c518", cta: "Best Value", highlight: false },
];

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [topRated, setTopRated] = useState<any[]>([]);
  const [newlyAdded, setNewlyAdded] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>(FEATURED); // fallback to mock

  // Real API calls
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    if (!API) return;

    // Top rated
    fetch(`${API}/media?sort=top-rated&limit=6`, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        const list = d.data || d.media || d || [];
        if (list.length > 0) setTopRated(list);
      })
      .catch(() => {});

    // Newly added
    fetch(`${API}/media?sort=newest&limit=4`, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        const list = d.data || d.media || d || [];
        if (list.length > 0) setNewlyAdded(list);
      })
      .catch(() => {});

    // Featured (for hero)
    fetch(`${API}/media?sort=top-rated&limit=3`, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        const list = d.data || d.media || d || [];
        if (list.length > 0) setFeatured(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featured]);

  const rawHero = featured[heroIndex] || FEATURED[0];

  // normalize field names from backend
  const hero = {
    id: rawHero.id,
    title: rawHero.title,
    genre: Array.isArray(rawHero.genre) ? rawHero.genre.join(" / ") : rawHero.genre || rawHero.genres,
    rating: rawHero.avgRating || rawHero.rating || 0,
    year: rawHero.releaseYear || rawHero.year,
    platform: Array.isArray(rawHero.platform) ? rawHero.platform[0] : rawHero.platform,
    poster: rawHero.poster || rawHero.posterUrl || rawHero.image || "",
    backdrop: rawHero.backdrop || rawHero.backdropUrl || rawHero.poster || rawHero.posterUrl || rawHero.image || "",
    description: rawHero.synopsis || rawHero.description || "",
  };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>

      {/* HERO SECTION */}
      <div style={{ position: "relative", height: "90vh", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${hero.backdrop})`,
            backgroundSize: "cover", backgroundPosition: "center",
            transition: "all 1s ease",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,1) 0%, transparent 40%)" }} />

        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "0 5vw" }}>
          <span style={{ background: "#e50914", color: "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", padding: "4px 10px", borderRadius: "3px", width: "fit-content", marginBottom: "16px", textTransform: "uppercase" }}>
            FEATURED
          </span>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, lineHeight: 1.1, maxWidth: "600px", marginBottom: "16px", fontFamily: "'Playfair Display', serif" }}>
            {hero.title}
          </h1>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
            <span style={{ color: "#f5c518", fontWeight: 700, fontSize: "1.2rem" }}>★ {hero.rating}</span>
            <span style={{ color: "#aaa" }}>{hero.year}</span>
            <span style={{ color: "#aaa" }}>{hero.genre}</span>
            <span style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>{hero.platform}</span>
          </div>
          <p style={{ color: "#ccc", maxWidth: "500px", lineHeight: 1.7, marginBottom: "28px", fontSize: "1rem" }}>
            {hero.description}
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href={`/movies/${hero.id}`}>
              <button style={{ background: "#e50914", color: "#fff", border: "none", padding: "14px 32px", borderRadius: "8px", fontWeight: 700, fontSize: "1rem", cursor: "pointer", transition: "transform 0.2s", letterSpacing: "0.5px" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                ▶ Watch Now
              </button>
            </Link>
            <Link href={`/movies/${hero.id}`}>
              <button style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "14px 28px", borderRadius: "8px", fontWeight: 600, fontSize: "1rem", cursor: "pointer", backdropFilter: "blur(8px)" }}>
                + Watchlist
              </button>
            </Link>
          </div>

          {/* Hero dots */}
          <div style={{ display: "flex", gap: "8px", marginTop: "40px" }}>
            {FEATURED.map((_, i) => (
              <button key={i} onClick={() => setHeroIndex(i)}
                style={{ width: i === heroIndex ? "28px" : "8px", height: "8px", borderRadius: "4px", background: i === heroIndex ? "#e50914" : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", transition: "all 0.3s" }} />
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{ padding: "40px 5vw 0", maxWidth: "800px", margin: "-40px auto 0" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search movies, series, directors..."
              style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "14px 18px", color: "#fff", fontSize: "1rem", outline: "none", minWidth: "200px" }}
            />
            <select style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "14px 18px", color: "#fff", fontSize: "0.9rem", cursor: "pointer", outline: "none" }}>
              <option value="">All Genres</option>
              <option>Action</option>
              <option>Drama</option>
              <option>Sci-Fi</option>
              <option>Crime</option>
              <option>Comedy</option>
            </select>
            <select style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "14px 18px", color: "#fff", fontSize: "0.9rem", cursor: "pointer", outline: "none" }}>
              <option value="">All Platforms</option>
              <option>Netflix</option>
              <option>Disney+</option>
              <option>Amazon Prime</option>
              <option>HBO Max</option>
            </select>
            <Link href={`/movies?q=${searchQuery}`}>
              <button style={{ background: "#e50914", color: "#fff", border: "none", borderRadius: "10px", padding: "14px 28px", fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}>
                Search
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* TOP RATED THIS WEEK */}
      <section style={{ padding: "60px 5vw 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>
              ⭐ Top Rated This Week
            </h2>
            <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "4px" }}>Curated by ratings and engagement</p>
          </div>
          <Link href="/movies?sort=top-rated" style={{ color: "#e50914", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>View All →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "20px" }}>
          {(topRated.length > 0 ? topRated : TOP_RATED).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* NEWLY ADDED */}
      <section style={{ padding: "60px 5vw 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>
              🆕 Newly Added
            </h2>
            <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "4px" }}>Fresh content from 2024</p>
          </div>
          <Link href="/movies?sort=newest" style={{ color: "#e50914", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>View All →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "20px" }}>
          {(newlyAdded.length > 0 ? newlyAdded : NEWLY_ADDED).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* EDITOR'S PICKS BANNER */}
      <section style={{ margin: "60px 5vw 0", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", borderRadius: "20px", padding: "48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-40px", top: "-40px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(229,9,20,0.3) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{ color: "#f5c518", fontWeight: 700, letterSpacing: "2px", fontSize: "12px", textTransform: "uppercase" }}>🎬 EDITOR'S PICKS</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, margin: "12px 0 16px", fontFamily: "'Playfair Display', serif" }}>
            Handpicked by Our Film Critics
          </h2>
          <p style={{ color: "#aaa", maxWidth: "500px", lineHeight: 1.7, marginBottom: "28px" }}>
            Our editorial team curates the finest cinema experiences, from timeless classics to cutting-edge releases.
          </p>
          <Link href="/movies?filter=editors-picks">
            <button style={{ background: "#e50914", color: "#fff", border: "none", padding: "14px 32px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}>
              Explore Picks
            </button>
          </Link>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section style={{ padding: "80px 5vw" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "clamp(2rem, 3vw, 2.8rem)", fontWeight: 800, fontFamily: "'Playfair Display', serif", marginBottom: "12px" }}>
            Choose Your Plan
          </h2>
          <p style={{ color: "#888", fontSize: "1rem" }}>Unlock unlimited entertainment at the right price</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", maxWidth: "900px", margin: "0 auto" }}>
          {PLANS.map((plan) => (
            <div key={plan.name} style={{
              background: plan.highlight ? "linear-gradient(145deg, #1a0005, #2d0008)" : "rgba(255,255,255,0.04)",
              border: `2px solid ${plan.highlight ? "#e50914" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "20px", padding: "36px 28px",
              position: "relative", transition: "transform 0.3s",
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-8px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {plan.highlight && (
                <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#e50914", color: "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", padding: "4px 16px", borderRadius: "20px" }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "8px", color: plan.color }}>{plan.name}</h3>
              <div style={{ marginBottom: "24px" }}>
                <span style={{ fontSize: "2.8rem", fontWeight: 900 }}>{plan.price}</span>
                <span style={{ color: "#888", fontSize: "0.9rem", marginLeft: "4px" }}>/{plan.period}</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "28px" }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ padding: "8px 0", color: "#ccc", fontSize: "0.9rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#4ade80" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/subscription">
                <button style={{
                  width: "100%", padding: "14px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "1rem",
                  background: plan.highlight ? "#e50914" : "rgba(255,255,255,0.08)",
                  color: "#fff", border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.2)",
                  transition: "opacity 0.2s",
                }}>
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

function MovieCard({ movie }: { movie: any }) {
  const [hovered, setHovered] = useState(false);

  // normalize backend field names
  const poster = movie.poster || movie.posterUrl || movie.image || movie.thumbnail;
  const title = movie.title;
  const genre = Array.isArray(movie.genre) ? movie.genre[0] : movie.genre;
  const year = movie.releaseYear || movie.year;
  const rating = movie.avgRating || movie.rating;

  return (
    <Link href={`/movies/${movie.id}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: "pointer", transition: "transform 0.3s", transform: hovered ? "scale(1.05)" : "scale(1)" }}
      >
        <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", aspectRatio: "2/3", background: "#1a1a1a" }}>
          {poster ? (
            <img
              src={poster}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#333", fontSize: "3rem" }}>
              🎬
            </div>
          )}
          {hovered && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "8px" }}>
              <span style={{ background: "#e50914", color: "#fff", padding: "8px 20px", borderRadius: "20px", fontWeight: 700, fontSize: "0.85rem" }}>▶ Watch</span>
              <span style={{ color: "#fff", fontSize: "0.8rem" }}>+ Watchlist</span>
            </div>
          )}
          {rating && (
            <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.8)", borderRadius: "6px", padding: "3px 8px", fontSize: "12px", fontWeight: 700, color: "#f5c518" }}>
              ★ {typeof rating === "number" ? rating.toFixed(1) : rating}
            </div>
          )}
        </div>
        <div style={{ padding: "10px 2px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#888", fontSize: "0.78rem" }}>{genre}</span>
            <span style={{ color: "#888", fontSize: "0.78rem" }}>{year}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
