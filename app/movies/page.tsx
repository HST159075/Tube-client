"use client";
import { useState, Suspense } from "react";
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

// Mock data — replace with real API call to your backend
const ALL_MOVIES = [
  { id: 1, title: "The Godfather", rating: 9.2, genre: "Crime", year: 1972, platform: "Netflix", type: "Movie", reviews: 1240, poster: "https://image.tmdb.org/t/p/w300/3bhkrj58Vtu7enYsLLeHjThrVPa.jpg", price: "free" },
  { id: 2, title: "The Dark Knight", rating: 9.0, genre: "Action", year: 2008, platform: "HBO Max", type: "Movie", reviews: 980, poster: "https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg", price: "premium" },
  { id: 3, title: "Breaking Bad", rating: 9.5, genre: "Crime", year: 2008, platform: "Netflix", type: "Series", reviews: 2100, poster: "https://image.tmdb.org/t/p/w300/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", price: "premium" },
  { id: 4, title: "Inception", rating: 8.8, genre: "Sci-Fi", year: 2010, platform: "Amazon Prime", type: "Movie", reviews: 870, poster: "https://image.tmdb.org/t/p/w300/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", price: "free" },
  { id: 5, title: "Interstellar", rating: 8.7, genre: "Sci-Fi", year: 2014, platform: "Amazon Prime", type: "Movie", reviews: 760, poster: "https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", price: "premium" },
  { id: 6, title: "Oppenheimer", rating: 9.1, genre: "Drama", year: 2023, platform: "Netflix", type: "Movie", reviews: 540, poster: "https://image.tmdb.org/t/p/w300/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", price: "premium" },
  { id: 7, title: "Pulp Fiction", rating: 8.9, genre: "Crime", year: 1994, platform: "Disney+", type: "Movie", reviews: 1100, poster: "https://image.tmdb.org/t/p/w300/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", price: "free" },
  { id: 8, title: "Fight Club", rating: 8.8, genre: "Drama", year: 1999, platform: "Netflix", type: "Movie", reviews: 990, poster: "https://image.tmdb.org/t/p/w300/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", price: "free" },
  { id: 9, title: "Dune: Part Two", rating: 8.5, genre: "Sci-Fi", year: 2024, platform: "HBO Max", type: "Movie", reviews: 430, poster: "https://image.tmdb.org/t/p/w300/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg", price: "premium" },
  { id: 10, title: "Shogun", rating: 9.0, genre: "Drama", year: 2024, platform: "Disney+", type: "Series", reviews: 380, poster: "https://image.tmdb.org/t/p/w300/3b2MANGK0MuG7m0QJSA1ZEWJMZB.jpg", price: "premium" },
  { id: 11, title: "Poor Things", rating: 8.1, genre: "Fantasy", year: 2023, platform: "Disney+", type: "Movie", reviews: 290, poster: "https://image.tmdb.org/t/p/w300/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg", price: "free" },
  { id: 12, title: "Schindler's List", rating: 8.9, genre: "Drama", year: 1993, platform: "Netflix", type: "Movie", reviews: 1050, poster: "https://image.tmdb.org/t/p/w300/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", price: "free" },
];

const PAGE_SIZE = 8;

function MoviesContent() {
  const searchParams = useSearchParams();
  const [genre, setGenre] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [typeFilter, setTypeFilter] = useState("All"); // Movie, Series, All
  const [ratingMin, setRatingMin] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const filtered = ALL_MOVIES
    .filter(m => genre === "All" || m.genre === genre)
    .filter(m => platform === "All" || m.platform === platform)
    .filter(m => typeFilter === "All" || m.type === typeFilter)
    .filter(m => m.rating >= ratingMin)
    .filter(m => !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "top-rated") return b.rating - a.rating;
      if (sortBy === "most-liked") return b.reviews - a.reviews;
      if (sortBy === "most-reviewed") return b.reviews - a.reviews;
      return b.year - a.year;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'DM Sans', sans-serif", paddingTop: "90px" }}>

      {/* Page Header */}
      <div style={{ padding: "40px 5vw 0", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, fontFamily: "'Playfair Display', serif", marginBottom: "8px" }}>
          Browse Movies & Series
        </h1>
        <p style={{ color: "#888" }}>Discover, rate, and review your favorite titles</p>
      </div>

      <div style={{ display: "flex", gap: "32px", padding: "0 5vw", alignItems: "flex-start" }}>

        {/* SIDEBAR FILTERS */}
        <aside style={{ width: "220px", flexShrink: 0, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px", position: "sticky", top: "90px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "20px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase" }}>Filters</h3>

          {/* Type */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Type</p>
            {["All", "Movie", "Series"].map(t => (
              <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", marginBottom: "4px", borderRadius: "8px", border: "none", background: typeFilter === t ? "rgba(229,9,20,0.2)" : "transparent", color: typeFilter === t ? "#e50914" : "#aaa", cursor: "pointer", fontWeight: typeFilter === t ? 700 : 400, fontSize: "0.9rem" }}>
                {t}
              </button>
            ))}
          </div>

          {/* Genre */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Genre</p>
            {GENRES.map(g => (
              <button key={g} onClick={() => { setGenre(g); setPage(1); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", marginBottom: "4px", borderRadius: "8px", border: "none", background: genre === g ? "rgba(229,9,20,0.2)" : "transparent", color: genre === g ? "#e50914" : "#aaa", cursor: "pointer", fontWeight: genre === g ? 700 : 400, fontSize: "0.9rem" }}>
                {g}
              </button>
            ))}
          </div>

          {/* Platform */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Platform</p>
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => { setPlatform(p); setPage(1); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", marginBottom: "4px", borderRadius: "8px", border: "none", background: platform === p ? "rgba(229,9,20,0.2)" : "transparent", color: platform === p ? "#e50914" : "#aaa", cursor: "pointer", fontWeight: platform === p ? 700 : 400, fontSize: "0.9rem" }}>
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
        <div style={{ flex: 1 }}>
          {/* Search + Sort */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search titles..."
              style={{ flex: 1, minWidth: "200px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 16px", color: "#fff", fontSize: "0.95rem", outline: "none" }}
            />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 16px", color: "#fff", cursor: "pointer", outline: "none" }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Results count */}
          <p style={{ color: "#888", marginBottom: "20px", fontSize: "0.9rem" }}>
            Showing <strong style={{ color: "#fff" }}>{filtered.length}</strong> titles
          </p>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "24px" }}>
            {paginated.map(movie => (
              <Link key={movie.id} href={`/movies/${movie.id}`} style={{ textDecoration: "none" }}>
                <MovieCard movie={movie} />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "48px", flexWrap: "wrap" }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "10px 20px", borderRadius: "8px", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ background: p === page ? "#e50914" : "rgba(255,255,255,0.08)", border: p === page ? "none" : "1px solid rgba(255,255,255,0.15)", color: "#fff", width: "42px", height: "42px", borderRadius: "8px", cursor: "pointer", fontWeight: p === page ? 700 : 400 }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "10px 20px", borderRadius: "8px", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}>
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default function MoviesPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
        Loading...
      </div>
    }>
      <MoviesContent />
    </Suspense>
  );
}
function MovieCard({ movie }: { movie: any }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer" }}
    >
      <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", aspectRatio: "2/3", background: "#1a1a1a", transition: "transform 0.3s", transform: hovered ? "scale(1.04)" : "scale(1)" }}>
        <img src={movie.poster} alt={movie.title} style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x450/1a1a1a/666?text=No+Image"; }}
        />
        {hovered && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px" }}>
            <span style={{ background: "#e50914", color: "#fff", padding: "6px 14px", borderRadius: "6px", fontWeight: 700, fontSize: "0.8rem", textAlign: "center", marginBottom: "8px" }}>▶ View Details</span>
            <span style={{ color: "#ccc", fontSize: "0.75rem", textAlign: "center" }}>+ Add to Watchlist</span>
          </div>
        )}
        <div style={{ position: "absolute", top: "8px", left: "8px", background: movie.price === "premium" ? "rgba(245,197,24,0.9)" : "rgba(74,222,128,0.9)", color: "#000", borderRadius: "4px", padding: "2px 6px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>
          {movie.price === "premium" ? "PRO" : "FREE"}
        </div>
        <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.8)", borderRadius: "6px", padding: "3px 8px", fontSize: "12px", fontWeight: 700, color: "#f5c518" }}>
          ★ {movie.rating}
        </div>
      </div>
      <div style={{ padding: "10px 2px" }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "4px" }}>{movie.title}</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "#888" }}>{movie.genre} · {movie.year}</span>
          <span style={{ fontSize: "0.75rem", color: "#555" }}>{movie.reviews} reviews</span>
        </div>
      </div>
    </div>
  );
}
