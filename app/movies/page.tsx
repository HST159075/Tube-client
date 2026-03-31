"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const GENRES = ["All", "Action", "Drama", "Comedy", "Sci-Fi", "Crime", "Thriller", "Fantasy", "Horror", "Romance"];
const PLATFORMS = ["All", "Netflix", "Disney+", "Amazon Prime", "HBO Max", "Apple TV+"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "top-rated", label: "Top Rated" },
  { value: "most-liked", label: "Most Liked" },
  { value: "most-reviewed", label: "Most Reviewed" },
];

const PAGE_SIZE = 8;

function MoviesContent() {
  const searchParams = useSearchParams();
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [genre, setGenre] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [typeFilter, setTypeFilter] = useState("All");
  const [ratingMin, setRatingMin] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  // ─── Real API call ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (genre !== "All") params.set("genre", genre);
        if (platform !== "All") params.set("platform", platform);
        if (typeFilter !== "All") params.set("type", typeFilter);
        if (ratingMin > 0) params.set("minRating", String(ratingMin));
        if (searchQuery) params.set("search", searchQuery);
        params.set("sort", sortBy);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/media?${params.toString()}`,
          { credentials: "include" }
        );
        const data = await res.json();

        // backend যেভাবে return করে সেটা adjust করো
        setAllMovies(data.data || data.media || data || []);
      } catch (err) {
        setError("Failed to load movies. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [genre, platform, typeFilter, ratingMin, sortBy, searchQuery]);

  const totalPages = Math.ceil(allMovies.length / PAGE_SIZE);
  const paginated = allMovies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'DM Sans', sans-serif", paddingTop: "90px" }}>

      {/* Page Header */}
      <div style={{ padding: "40px 5vw 0", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, fontFamily: "'Playfair Display', serif", marginBottom: "8px" }}>
          Browse Movies & Series
        </h1>
        <p style={{ color: "#888" }}>Discover, rate, and review your favorite titles</p>
      </div>

      <div style={{ display: "flex", gap: "32px", padding: "0 5vw", alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* SIDEBAR FILTERS */}
        <aside style={{ width: "220px", flexShrink: 0, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px", position: "sticky", top: "90px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "20px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase" }}>Filters</h3>

          {/* Type */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Type</p>
            {["All", "MOVIE", "SERIES"].map(t => (
              <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", marginBottom: "4px", borderRadius: "8px", border: "none", background: typeFilter === t ? "rgba(229,9,20,0.2)" : "transparent", color: typeFilter === t ? "#e50914" : "#aaa", cursor: "pointer", fontWeight: typeFilter === t ? 700 : 400, fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif" }}>
                {t === "All" ? "All" : t === "MOVIE" ? "Movie" : "Series"}
              </button>
            ))}
          </div>

          {/* Genre */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Genre</p>
            {GENRES.map(g => (
              <button key={g} onClick={() => { setGenre(g); setPage(1); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", marginBottom: "4px", borderRadius: "8px", border: "none", background: genre === g ? "rgba(229,9,20,0.2)" : "transparent", color: genre === g ? "#e50914" : "#aaa", cursor: "pointer", fontWeight: genre === g ? 700 : 400, fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif" }}>
                {g}
              </button>
            ))}
          </div>

          {/* Platform */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Platform</p>
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => { setPlatform(p); setPage(1); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", marginBottom: "4px", borderRadius: "8px", border: "none", background: platform === p ? "rgba(229,9,20,0.2)" : "transparent", color: platform === p ? "#e50914" : "#aaa", cursor: "pointer", fontWeight: platform === p ? 700 : 400, fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif" }}>
                {p}
              </button>
            ))}
          </div>

          {/* Rating Min */}
          <div>
            <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Min Rating: {ratingMin}+</p>
            <input type="range" min={0} max={9} step={0.5} value={ratingMin}
              onChange={e => { setRatingMin(Number(e.target.value)); setPage(1); }}
              style={{ width: "100%", accentColor: "#e50914" }}
            />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Search + Sort */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search titles..."
              style={{ flex: 1, minWidth: "200px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 16px", color: "#fff", fontSize: "0.95rem", outline: "none", fontFamily: "'DM Sans', sans-serif" }}
            />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 16px", color: "#fff", cursor: "pointer", outline: "none", fontFamily: "'DM Sans', sans-serif" }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: "#1a1a1a" }}>{o.label}</option>)}
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "24px" }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ aspectRatio: "2/3", background: "rgba(255,255,255,0.06)", borderRadius: "12px", animation: "pulse 1.5s infinite" }} />
                  <div style={{ height: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "6px", margin: "10px 0 6px" }} />
                  <div style={{ height: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", width: "60%" }} />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.3)", borderRadius: "12px", padding: "20px", textAlign: "center", color: "#ff6b6b" }}>
              ⚠️ {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && allMovies.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#555" }}>
              <p style={{ fontSize: "3rem", marginBottom: "16px" }}>🎬</p>
              <p style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px", color: "#888" }}>No titles found</p>
              <p style={{ fontSize: "0.9rem" }}>Try adjusting your filters</p>
            </div>
          )}

          {/* Results */}
          {!loading && !error && allMovies.length > 0 && (
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
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "10px 20px", borderRadius: "8px", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, fontFamily: "'DM Sans', sans-serif" }}>
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ background: p === page ? "#e50914" : "rgba(255,255,255,0.08)", border: p === page ? "none" : "1px solid rgba(255,255,255,0.15)", color: "#fff", width: "42px", height: "42px", borderRadius: "8px", cursor: "pointer", fontWeight: p === page ? 700 : 400, fontFamily: "'DM Sans', sans-serif" }}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "10px 20px", borderRadius: "8px", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1, fontFamily: "'DM Sans', sans-serif" }}>
                    Next →
                  </button>
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
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontFamily: "'DM Sans', sans-serif" }}>
        Loading...
      </div>
    }>
      <MoviesContent />
    </Suspense>
  );
}

function MovieCard({ movie }: { movie: any }) {
  const [hovered, setHovered] = useState(false);

  // backend field names adjust করো তোমার schema অনুযায়ী
  const poster = movie.poster || movie.posterUrl || movie.image || movie.thumbnail;
  const title = movie.title;
  const genre = Array.isArray(movie.genre) ? movie.genre[0] : movie.genre;
  const year = movie.releaseYear || movie.year;
  const rating = movie.avgRating || movie.rating || "N/A";
  const reviews = movie._count?.reviews || movie.reviewCount || 0;
  const isPremium = movie.price === "premium" || movie.isPremium;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer" }}
    >
      <div style={{
        position: "relative", borderRadius: "12px", overflow: "hidden",
        aspectRatio: "2/3", background: "#1a1a1a",
        transition: "transform 0.3s", transform: hovered ? "scale(1.04)" : "scale(1)"
      }}>
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
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px" }}>
            <span style={{ background: "#e50914", color: "#fff", padding: "6px 14px", borderRadius: "6px", fontWeight: 700, fontSize: "0.8rem", textAlign: "center", marginBottom: "8px" }}>▶ View Details</span>
            <span style={{ color: "#ccc", fontSize: "0.75rem", textAlign: "center" }}>+ Add to Watchlist</span>
          </div>
        )}

        <div style={{ position: "absolute", top: "8px", left: "8px", background: isPremium ? "rgba(245,197,24,0.9)" : "rgba(74,222,128,0.9)", color: "#000", borderRadius: "4px", padding: "2px 6px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>
          {isPremium ? "PRO" : "FREE"}
        </div>

        {rating !== "N/A" && (
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
