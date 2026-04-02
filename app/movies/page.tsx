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
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'DM Sans', sans-serif", paddingTop: "90px" }}>

      {/* Page Header */}
      <div style={{ padding: "40px 5vw 0", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, fontFamily: "'Playfair Display', serif", marginBottom: "8px" }}>
          Browse Movies & Series
        </h1>
        <p style={{ color: "#888" }}>Discover, rate, and review your favorite titles</p>
        {apiError && (
          <div style={{ marginTop: "12px", background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: "8px", padding: "10px 16px", color: "#f5c518", fontSize: "0.82rem" }}>
            ⚠️ Showing sample data — backend connection unavailable
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "32px", padding: "0 5vw", alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* ── SIDEBAR FILTERS ── */}
        <aside style={{ width: "220px", flexShrink: 0, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px", position: "sticky", top: "90px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "20px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase" }}>Filters</h3>

          {/* Type */}
          <FilterGroup label="Type" options={["All", "MOVIE", "SERIES"]}
            labels={{ All: "All", MOVIE: "Movie", SERIES: "Series" }}
            value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1); }} />

          {/* Genre */}
          <FilterGroup label="Genre" options={GENRES} value={genre} onChange={v => { setGenre(v); setPage(1); }} />

          {/* Platform */}
          <FilterGroup label="Platform" options={PLATFORMS} value={platform} onChange={v => { setPlatform(v); setPage(1); }} />

          {/* Min Rating */}
          <div>
            <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Min Rating: {ratingMin}+
            </p>
            <input type="range" min={0} max={9} step={0.5} value={ratingMin}
              onChange={e => { setRatingMin(Number(e.target.value)); setPage(1); }}
              style={{ width: "100%", accentColor: "#e50914" }} />
          </div>

          {/* Reset */}
          <button onClick={() => { setGenre("All"); setPlatform("All"); setTypeFilter("All"); setRatingMin(0); setSearchQuery(""); setPage(1); }}
            style={{ marginTop: "20px", width: "100%", background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.2)", color: "#e50914", borderRadius: "8px", padding: "9px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            Reset Filters
          </button>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Search + Sort bar */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
            <input value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search titles..."
              style={{ flex: 1, minWidth: "200px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 16px", color: "#fff", fontSize: "0.95rem", outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
            <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 16px", color: "#fff", cursor: "pointer", outline: "none", fontFamily: "'DM Sans', sans-serif" }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: "#1a1a1a" }}>{o.label}</option>)}
            </select>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "24px" }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ aspectRatio: "2/3", background: "rgba(255,255,255,0.06)", borderRadius: "12px" }} />
                  <div style={{ height: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "6px", margin: "10px 0 6px" }} />
                  <div style={{ height: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", width: "60%" }} />
                </div>
              ))}
              <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
            </div>
          )}

          {/* Empty state */}
          {!loading && allMovies.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#555" }}>
              <p style={{ fontSize: "3rem", marginBottom: "16px" }}>🎬</p>
              <p style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px", color: "#888" }}>No titles found</p>
              <p style={{ fontSize: "0.9rem" }}>Try adjusting your filters</p>
            </div>
          )}

          {/* Results grid */}
          {!loading && allMovies.length > 0 && (
            <>
              <p style={{ color: "#888", marginBottom: "20px", fontSize: "0.9rem" }}>
                Showing <strong style={{ color: "#fff" }}>{allMovies.length}</strong> titles
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "24px" }}>
                {paginated.map((movie: any) => (
                  <Link key={movie.id} href={`/movies/${movie.id}`} style={{ textDecoration: "none" }}>
                    <MovieCard movie={movie} />
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "48px", flexWrap: "wrap" }}>
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
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontFamily: "'DM Sans', sans-serif", flexDirection: "column", gap: "16px" }}>
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
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ cursor: "pointer" }}>
      <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", aspectRatio: "2/3", background: "#1a1a1a", transition: "transform 0.3s", transform: hovered ? "scale(1.04)" : "scale(1)" }}>
        {poster
          ? <img src={poster} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#333", fontSize: "3rem" }}>🎬</div>
        }

        {hovered && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px" }}>
            <span style={{ background: "#e50914", color: "#fff", padding: "6px 14px", borderRadius: "6px", fontWeight: 700, fontSize: "0.8rem", textAlign: "center", marginBottom: "8px" }}>▶ View Details</span>
            <span style={{ color: "#ccc", fontSize: "0.75rem", textAlign: "center" }}>+ Add to Watchlist</span>
          </div>
        )}

        <div style={{ position: "absolute", top: "8px", left: "8px", background: isPremium ? "rgba(245,197,24,0.9)" : "rgba(74,222,128,0.9)", color: "#000", borderRadius: "4px", padding: "2px 6px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>
          {isPremium ? "PRO" : "FREE"}
        </div>

        {rating && (
          <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.8)", borderRadius: "6px", padding: "3px 8px", fontSize: "12px", fontWeight: 700, color: "#f5c518" }}>
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