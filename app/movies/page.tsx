"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const GENRES = ["All", "Action", "Drama", "Comedy", "Sci-Fi", "Crime", "Thriller", "Fantasy", "Horror", "Romance"];
const PLATFORMS = ["All", "Netflix", "Disney+", "Amazon Prime", "HBO Max", "Apple TV+"];
const SORT_OPTIONS = [
  { value: "newest",       label: "Newest First" },
  { value: "top-rated",    label: "Top Rated" },
  { value: "most-liked",   label: "Most Liked" },
  { value: "most-reviewed",label: "Most Reviewed" },
];


const FALLBACK_MOVIES = [
  { id: 1,  title: "The Godfather",    rating: 9.2, genre: "Crime",   year: 1972, poster: "https://image.tmdb.org/t/p/w300/3bhkrj58Vtu7enYsLLeHjThrVPa.jpg", price: "free" },
  { id: 2,  title: "The Dark Knight",  rating: 9.0, genre: "Action",  year: 2008, poster: "https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg", price: "free" },
  { id: 3,  title: "Schindler's List", rating: 8.9, genre: "Drama",   year: 1993, poster: "https://image.tmdb.org/t/p/w300/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", price: "free" },
  { id: 4,  title: "Pulp Fiction",     rating: 8.9, genre: "Crime",   year: 1994, poster: "https://image.tmdb.org/t/p/w300/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", price: "premium" },
  { id: 5,  title: "Inception",        rating: 8.8, genre: "Sci-Fi",  year: 2010, poster: "https://image.tmdb.org/t/p/w300/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", price: "free" },
  { id: 6,  title: "Fight Club",       rating: 8.8, genre: "Drama",   year: 1999, poster: "https://image.tmdb.org/t/p/w300/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", price: "premium" },
  { id: 7,  title: "Poor Things",      rating: 8.1, genre: "Fantasy", year: 2023, poster: "https://image.tmdb.org/t/p/w300/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg", price: "premium" },
  { id: 8,  title: "Dune: Part Two",   rating: 8.5, genre: "Sci-Fi",  year: 2024, poster: "https://image.tmdb.org/t/p/w300/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg", price: "free" },
  { id: 9,  title: "Shogun",           rating: 9.0, genre: "Drama",   year: 2024, poster: "https://image.tmdb.org/t/p/w300/3b2MANGK0MuG7m0QJSA1ZEWJMZB.jpg", price: "free" },
  { id: 10, title: "Baby Reindeer",    rating: 8.2, genre: "Thriller",year: 2024, poster: "https://image.tmdb.org/t/p/w300/3BQfLXjzlP58dblXaBnvtKCnJ7J.jpg", price: "premium" },
  { id: 11, title: "Oppenheimer",      rating: 9.1, genre: "Drama",   year: 2023, poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", price: "free" },
  { id: 12, title: "Breaking Bad",     rating: 9.5, genre: "Crime",   year: 2008, poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", price: "premium" },
];

const PAGE_SIZE = 8;

function MoviesContent() {
  const searchParams = useSearchParams();
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [apiError, setApiError]   = useState(false); // API failed — using fallback

  const [genre,       setGenre]       = useState(searchParams.get("genre") || "All");
  const [platform,    setPlatform]    = useState("All");
  const [sortBy,      setSortBy]      = useState(searchParams.get("sort") || "newest");
  const [typeFilter,  setTypeFilter]  = useState(searchParams.get("type") || "All");
  const [ratingMin,   setRatingMin]   = useState(0);
  const [page,        setPage]        = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setApiError(false);

      const API = process.env.NEXT_PUBLIC_API_URL;


      if (!API) {
        applyFallback();
        return;
      }

      try {
        const params = new URLSearchParams();
        if (genre !== "All")    params.set("genre",     genre);
        if (platform !== "All") params.set("platform",  platform);
        if (typeFilter !== "All") params.set("type",    typeFilter);
        if (ratingMin > 0)      params.set("minRating", String(ratingMin));
        if (searchQuery)        params.set("search",    searchQuery);
        params.set("sort", sortBy);

        const res = await fetch(`${API}/media?${params.toString()}`, {
          credentials: "include",
          signal: AbortSignal.timeout(8000), // 8s timeout
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list: any[] = data.data || data.media || data || [];

        if (Array.isArray(list) && list.length > 0) {
          setAllMovies(list);
        } else {
         
          applyFallback();
        }
      } catch (err) {
        console.warn("API unavailable, using fallback data:", err);
        setApiError(true);
        applyFallback();
      } finally {
        setLoading(false);
      }
    };

    const applyFallback = () => {
     
      let result = [...FALLBACK_MOVIES];

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(m => m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q));
      }
      if (genre !== "All") result = result.filter(m => m.genre === genre);
      if (ratingMin > 0)   result = result.filter(m => m.rating >= ratingMin);

      if (sortBy === "top-rated") result.sort((a, b) => b.rating - a.rating);
      else if (sortBy === "newest") result.sort((a, b) => b.year - a.year);

      setAllMovies(result);
      setLoading(false);
    };

    fetchMedia();
  }, [genre, platform, typeFilter, ratingMin, sortBy, searchQuery]);

  const totalPages = Math.ceil(allMovies.length / PAGE_SIZE);
  const paginated  = allMovies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .skel-pulse { background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
      `}</style>

      {/* ══ PAGE HERO HEADER ═══════════════════════════════════════════════════ */}
      <div style={{
        position: "relative", padding: "140px 5vw 50px", overflow: "hidden",
        background: "linear-gradient(160deg, #0a0a0a 0%, #12001a 40%, #1a0005 80%, #0a0a0a 100%)",
      }}>
        {/* Decorative elements */}
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(229,9,20,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "20%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(100,50,200,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
        
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <span style={{ fontSize: "2rem" }}>🎬</span>
            <span style={{
              background: "rgba(229,9,20,0.15)", border: "1px solid rgba(229,9,20,0.25)",
              color: "#e50914", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "2px",
              padding: "5px 14px", borderRadius: "20px", textTransform: "uppercase",
            }}>Library</span>
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900,
            fontFamily: "'Playfair Display', serif", marginBottom: "10px",
            color: "#fff",
          }}>
            Browse Movies & Series
          </h1>
          <p style={{ color: "#666", fontSize: "1rem", maxWidth: "500px" }}>
            Discover, rate, and review your favorite titles from our curated collection
          </p>
          {apiError && (
            <div style={{
              marginTop: "16px", background: "rgba(245,197,24,0.06)",
              border: "1px solid rgba(245,197,24,0.15)", borderRadius: "10px",
              padding: "10px 18px", color: "#f5c518", fontSize: "0.82rem",
              backdropFilter: "blur(10px)",
            }}>
              ⚠️ Showing sample data — backend connection unavailable
            </div>
          )}
        </div>
        {/* Bottom gradient */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to top, var(--bg), transparent)" }} />
      </div>

      {/* ══ CONTENT ════════════════════════════════════════════════════════════ */}
      <div style={{ display: "flex", gap: "36px", padding: "32px 5vw 0", alignItems: "flex-start", flexWrap: "wrap", maxWidth: "1500px", margin: "0 auto" }}>

        {/* ── SIDEBAR FILTERS ── */}
        <aside style={{
          width: "240px", flexShrink: 0,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "20px", padding: "28px",
          position: "sticky", top: "84px",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--muted)", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>Filters</h3>
            <span style={{ fontSize: "0.7rem", color: "#444" }}>🎛️</span>
          </div>

          <FilterGroup label="Type" options={["All", "MOVIE", "SERIES"]}
            labels={{ All: "All", MOVIE: "🎬 Movie", SERIES: "📺 Series" }}
            value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1); }} />

          <FilterGroup label="Genre" options={GENRES} value={genre} onChange={v => { setGenre(v); setPage(1); }} />

          <FilterGroup label="Platform" options={PLATFORMS} value={platform} onChange={v => { setPlatform(v); setPage(1); }} />

          {/* Min Rating */}
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>
              Min Rating
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input type="range" min={0} max={9} step={0.5} value={ratingMin}
                onChange={e => { setRatingMin(Number(e.target.value)); setPage(1); }}
                style={{ flex: 1, accentColor: "#e50914" }} />
              <span style={{
                background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.2)",
                borderRadius: "6px", padding: "3px 10px", fontSize: "0.8rem",
                fontWeight: 700, color: "#e50914", minWidth: "36px", textAlign: "center",
              }}>{ratingMin}+</span>
            </div>
          </div>

          {/* Reset */}
          <button onClick={() => { setGenre("All"); setPlatform("All"); setTypeFilter("All"); setRatingMin(0); setSearchQuery(""); setPage(1); }}
            style={{
              width: "100%", background: "rgba(229,9,20,0.08)",
              border: "1px solid rgba(229,9,20,0.15)", color: "#e50914",
              borderRadius: "10px", padding: "11px", cursor: "pointer",
              fontSize: "0.82rem", fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(229,9,20,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(229,9,20,0.08)"; }}
          >
            ✕ Reset All Filters
          </button>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Search + Sort bar */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap", position: "relative" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <input value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="🔍 Search titles, genres, directors..."
                style={{
                  width: "100%", background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px", padding: "14px 18px", color: "var(--text)",
                  fontSize: "0.95rem", outline: "none", fontFamily: "'DM Sans', sans-serif",
                  boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(229,9,20,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(229,9,20,0.08)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
              />
              
              {/* Smart Suggestions */}
              {searchQuery.length > 1 && (
                <div style={{
                  position: "absolute", top: "56px", left: 0, right: 0,
                  background: "rgba(12,12,15,0.97)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px", padding: "8px", zIndex: 100,
                  boxShadow: "0 20px 48px rgba(0,0,0,0.6)", backdropFilter: "blur(20px)",
                }}>
                  <p style={{ padding: "8px 12px", fontSize: "0.68rem", fontWeight: 800, color: "#e50914", textTransform: "uppercase", letterSpacing: "1.5px" }}>✨ Suggestions</p>
                  {(allMovies.length > 0 ? allMovies : FALLBACK_MOVIES)
                    .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .slice(0, 5)
                    .map(m => (
                      <div key={m.id} onClick={() => setSearchQuery(m.title)}
                        style={{ padding: "10px 12px", borderRadius: "8px", color: "#aaa", fontSize: "0.9rem", cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#aaa"; }}>
                        🎬 {m.title} <span style={{ color: "#444", fontSize: "0.75rem", marginLeft: "6px" }}>• {m.genre}</span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

            <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
              style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px", padding: "14px 18px", color: "var(--text)",
                cursor: "pointer", outline: "none", fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem",
              }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: "var(--surface)" }}>{o.label}</option>)}
            </select>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "24px" }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="skel-pulse" style={{ aspectRatio: "2/3", borderRadius: "14px", marginBottom: "10px" }} />
                  <div className="skel-pulse" style={{ height: "14px", borderRadius: "6px", marginBottom: "6px", width: "80%" }} />
                  <div className="skel-pulse" style={{ height: "10px", borderRadius: "6px", width: "50%" }} />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && allMovies.length === 0 && (
            <div style={{
              textAlign: "center", padding: "80px 20px",
              background: "rgba(255,255,255,0.02)", borderRadius: "24px",
              border: "1px dashed rgba(255,255,255,0.08)",
            }}>
              <p style={{ fontSize: "4rem", marginBottom: "16px" }}>🎬</p>
              <p style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "8px", fontFamily: "'Playfair Display', serif" }}>No titles found</p>
              <p style={{ color: "#555", fontSize: "0.9rem" }}>Try adjusting your filters or search term</p>
            </div>
          )}

          {/* Results grid */}
          {!loading && allMovies.length > 0 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
                  Showing <strong style={{ color: "var(--text)" }}>{paginated.length}</strong> of <strong style={{ color: "var(--text)" }}>{allMovies.length}</strong> titles
                </p>
                <p style={{ color: "#444", fontSize: "0.78rem" }}>
                  Page {page} of {totalPages}
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "24px" }}>
                {paginated.map((movie: any) => (
                  <Link key={movie.id} href={`/movies/${movie.id}`} style={{ textDecoration: "none" }}>
                    <MovieCard movie={movie} />
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: "flex", gap: "6px", justifyContent: "center", marginTop: "48px",
                  flexWrap: "wrap", alignItems: "center",
                }}>
                  <PagBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</PagBtn>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <PagBtn key={p} onClick={() => setPage(p)} active={p === page}>{p}</PagBtn>
                  ))}
                  <PagBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</PagBtn>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div style={{ height: "80px" }} />
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontFamily: "'DM Sans', sans-serif", flexDirection: "column", gap: "16px" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #e50914", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p>Loading movies...</p>
      </div>
    }>
      <MoviesContent />
    </Suspense>
  );
}

/* ── Helper components ──────────────────────────────────────────────────────── */

function FilterGroup({ label, options, value, onChange, labels }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; labels?: Record<string, string>;
}) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</p>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", marginBottom: "4px", borderRadius: "8px", border: "none", background: value === o ? "rgba(229,9,20,0.2)" : "transparent", color: value === o ? "#e50914" : "#aaa", cursor: "pointer", fontWeight: value === o ? 700 : 400, fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif" }}>
          {labels?.[o] ?? o}
        </button>
      ))}
    </div>
  );
}

function PagBtn({ children, onClick, disabled, active }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: active ? "#e50914" : "rgba(255,255,255,0.08)", border: active ? "none" : "1px solid rgba(255,255,255,0.15)", color: "#fff", minWidth: "42px", height: "42px", padding: "0 14px", borderRadius: "8px", cursor: disabled ? "not-allowed" : "pointer", fontWeight: active ? 700 : 400, opacity: disabled ? 0.4 : 1, fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem" }}>
      {children}
    </button>
  );
}

function MovieCard({ movie }: { movie: any }) {
  const [hovered, setHovered] = useState(false);
  const poster    = movie.posterUrl || movie.poster || movie.image || movie.thumbnail;
  const title     = movie.title;
  const genre     = Array.isArray(movie.genre) ? movie.genre[0] : movie.genre;
  const year      = movie.releaseYear || movie.year;
  const rating    = movie.avgRating  || movie.rating;
  const reviews   = movie._count?.reviews || movie.reviewCount || 0;
  const isPremium = movie.priceType === "PREMIUM" || movie.price === "premium" || movie.isPremium;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s",
        transform: hovered ? "scale(1.04) translateY(-6px)" : "scale(1)",
        boxShadow: hovered ? "0 16px 48px rgba(229,9,20,0.15)" : "none",
      }}
    >
      <div style={{
        position: "relative", borderRadius: "14px", overflow: "hidden",
        aspectRatio: "2/3", background: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        {poster
          ? <img src={poster} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#333", fontSize: "3rem" }}>🎬</div>
        }

        {/* Glassmorphism hover overlay */}
        {hovered && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex", flexDirection: "column",
            justifyContent: "flex-end", padding: "16px",
            transition: "all 0.3s",
          }}>
            <span style={{
              background: "rgba(229,9,20,0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff", padding: "8px 14px", borderRadius: "8px",
              fontWeight: 700, fontSize: "0.8rem", textAlign: "center",
              marginBottom: "8px",
              boxShadow: "0 4px 16px rgba(229,9,20,0.3)",
            }}>▶ View Details</span>
            <span style={{
              color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", textAlign: "center",
            }}>+ Add to Watchlist</span>
          </div>
        )}

        {/* Glass premium/free badge */}
        <div style={{
          position: "absolute", top: "8px", left: "8px",
          background: isPremium ? "rgba(245,197,24,0.7)" : "rgba(74,222,128,0.7)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#000", borderRadius: "6px", padding: "3px 8px",
          fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
        }}>
          {isPremium ? "PRO" : "FREE"}
        </div>

        {/* Glass rating badge */}
        {rating && (
          <div style={{
            position: "absolute", top: "8px", right: "8px",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px", padding: "3px 8px",
            fontSize: "12px", fontWeight: 700, color: "#f5c518",
          }}>
            ★ {typeof rating === "number" ? rating.toFixed(1) : rating}
          </div>
        )}
      </div>

      <div style={{ padding: "10px 2px" }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "4px" }}>{title}</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "#888" }}>{genre}{year ? ` · ${year}` : ""}</span>
          {reviews > 0 && <span style={{ fontSize: "0.75rem", color: "#555" }}>{reviews} reviews</span>}
        </div>
      </div>
    </div>
  );
}