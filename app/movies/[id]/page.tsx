"use client";
import { useState } from "react";
import Link from "next/link";

// Mock detail data — replace with: const movie = await fetch(`${API_URL}/movies/${params.id}`)
const MOCK_MOVIE = {
  id: 1,
  title: "The Godfather",
  synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son. An epic tale of power, family, loyalty, and betrayal that has defined American cinema.",
  genre: ["Crime", "Drama"],
  year: 1972,
  director: "Francis Ford Coppola",
  cast: ["Marlon Brando", "Al Pacino", "James Caan", "Robert De Niro"],
  platform: ["Netflix", "Amazon Prime"],
  avgRating: 9.2,
  totalReviews: 1240,
  poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLLeHjThrVPa.jpg",
  backdrop: "https://image.tmdb.org/t/p/original/tmU7GeKVPlXMYLVoNxQIRRhLZOd.jpg",
  streamingLink: "https://www.youtube.com/watch?v=sY1S34973zA",
  price: "free",
  duration: "175 min",
};

const MOCK_REVIEWS = [
  {
    id: 1, user: "CinemaBuff92", avatar: "C", rating: 10, date: "2024-03-15",
    review: "An absolute masterpiece of cinema. Every frame, every performance, every line of dialogue is perfection. Coppola created something timeless here.",
    likes: 234, spoiler: false, tags: ["classic", "masterpiece"], approved: true,
    comments: [
      { id: 1, user: "FilmLover", text: "Completely agree! The score by Nino Rota is unforgettable.", date: "2024-03-16" },
      { id: 2, user: "MoviesForever", text: "Marlon Brando's performance alone deserves 10/10", date: "2024-03-17" },
    ]
  },
  {
    id: 2, user: "MovieCritic2024", avatar: "M", rating: 9, date: "2024-02-20",
    review: "Still holds up after 50 years. The power dynamics and family loyalty themes are explored with incredible depth. A must-watch for anyone serious about film.",
    likes: 187, spoiler: false, tags: ["underrated"], approved: true,
    comments: []
  },
  {
    id: 3, user: "SpoilerKing", avatar: "S", rating: 8, date: "2024-01-10",
    review: "⚠️ SPOILER: The moment Michael transforms from innocent war hero to cold-blooded don is the greatest character arc in film history.",
    likes: 98, spoiler: true, tags: ["classic"], approved: true,
    comments: []
  },
];

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie = MOCK_MOVIE;
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [spoilerToggle, setSpoilerToggle] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSpoiler, setShowSpoiler] = useState<{ [key: number]: boolean }>({});
  const [liked, setLiked] = useState<{ [key: number]: boolean }>({});
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});
  const [inWatchlist, setInWatchlist] = useState(false);
  const [activeTab, setActiveTab] = useState<"reviews" | "details">("reviews");

  const TAGS = ["classic", "underrated", "masterpiece", "family-friendly", "must-watch", "overrated"];

  const handleSubmitReview = () => {
    if (!userRating || !reviewText.trim()) return alert("Please add a rating and review text!");
    const newReview = {
      id: Date.now(), user: "You", avatar: "Y", rating: userRating, date: new Date().toISOString().split("T")[0],
      review: reviewText, likes: 0, spoiler: spoilerToggle, tags: selectedTags, approved: false,
      comments: [],
    };
    setReviews(prev => [newReview, ...prev]);
    setUserRating(0); setReviewText(""); setSpoilerToggle(false); setSelectedTags([]);
    alert("✅ Review submitted! It will be published after admin approval.");
  };

  const handleLike = (reviewId: number) => {
    setLiked(prev => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  const handleComment = (reviewId: number) => {
    const text = commentText[reviewId];
    if (!text?.trim()) return;
    setReviews(prev => prev.map(r => r.id === reviewId
      ? { ...r, comments: [...r.comments, { id: Date.now(), user: "You", text, date: new Date().toISOString().split("T")[0] }] }
      : r
    ));
    setCommentText(prev => ({ ...prev, [reviewId]: "" }));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>

      {/* HERO BACKDROP */}
      <div style={{ position: "relative", height: "500px", overflow: "hidden" }}>
        <img src={movie.backdrop} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.5) 50%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.8) 0%, transparent 60%)" }} />
      </div>

      {/* MOVIE INFO */}
      <div style={{ padding: "0 5vw", marginTop: "-200px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", gap: "40px", alignItems: "flex-end", flexWrap: "wrap" }}>
          {/* Poster */}
          <img src={movie.poster} alt={movie.title} style={{ width: "200px", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.8)", flexShrink: 0 }}
            onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/200x300/1a1a1a/666?text=No+Image"; }}
          />
          {/* Info */}
          <div style={{ flex: 1, paddingBottom: "8px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
              {movie.genre.map(g => (
                <span key={g} style={{ background: "rgba(255,255,255,0.1)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", color: "#ccc" }}>{g}</span>
              ))}
              <span style={{ background: movie.price === "premium" ? "rgba(245,197,24,0.2)" : "rgba(74,222,128,0.2)", color: movie.price === "premium" ? "#f5c518" : "#4ade80", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700 }}>
                {movie.price === "premium" ? "⭐ Premium" : "✓ Free"}
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, fontFamily: "'Playfair Display', serif", marginBottom: "8px" }}>
              {movie.title}
            </h1>
            <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "#f5c518", fontSize: "1.8rem", fontWeight: 900 }}>★ {movie.avgRating}</span>
                <span style={{ color: "#888", fontSize: "0.9rem" }}>/ 10</span>
              </div>
              <span style={{ color: "#888" }}>•</span>
              <span style={{ color: "#aaa" }}>{movie.year}</span>
              <span style={{ color: "#888" }}>•</span>
              <span style={{ color: "#aaa" }}>{movie.duration}</span>
              <span style={{ color: "#888" }}>•</span>
              <span style={{ color: "#aaa" }}>{movie.totalReviews} reviews</span>
            </div>
            <p style={{ color: "#aaa", lineHeight: 1.8, marginBottom: "20px", maxWidth: "600px" }}>{movie.synopsis}</p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href={movie.streamingLink} target="_blank" rel="noopener noreferrer">
                <button style={{ background: "#e50914", color: "#fff", border: "none", padding: "13px 28px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}>
                  ▶ Watch on YouTube
                </button>
              </a>
              <button onClick={() => setInWatchlist(p => !p)}
                style={{ background: inWatchlist ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.08)", color: inWatchlist ? "#4ade80" : "#fff", border: `1px solid ${inWatchlist ? "#4ade80" : "rgba(255,255,255,0.2)"}`, padding: "13px 24px", borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontSize: "1rem" }}>
                {inWatchlist ? "✓ In Watchlist" : "+ Watchlist"}
              </button>
            </div>
          </div>
        </div>

        {/* Meta Details */}
        <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
          <div><p style={{ color: "#888", fontSize: "0.8rem", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>Director</p><p style={{ fontWeight: 600 }}>{movie.director}</p></div>
          <div><p style={{ color: "#888", fontSize: "0.8rem", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>Cast</p><p style={{ fontWeight: 600 }}>{movie.cast.join(", ")}</p></div>
          <div><p style={{ color: "#888", fontSize: "0.8rem", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>Streaming</p><p style={{ fontWeight: 600 }}>{movie.platform.join(", ")}</p></div>
          <div><p style={{ color: "#888", fontSize: "0.8rem", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>Release Year</p><p style={{ fontWeight: 600 }}>{movie.year}</p></div>
        </div>

        {/* TABS */}
        <div style={{ marginTop: "48px", display: "flex", gap: "4px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "40px" }}>
          {(["reviews", "details"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: "12px 24px", background: "transparent", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", textTransform: "capitalize", color: activeTab === tab ? "#e50914" : "#888", borderBottom: activeTab === tab ? "2px solid #e50914" : "2px solid transparent", transition: "all 0.2s" }}>
              {tab} {tab === "reviews" ? `(${reviews.filter(r => r.approved).length})` : ""}
            </button>
          ))}
        </div>

        {activeTab === "reviews" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" }}>

            {/* REVIEWS LIST */}
            <div>
              {reviews.filter(r => r.approved || r.user === "You").map(review => (
                <div key={review.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
                  {!review.approved && (
                    <div style={{ background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.3)", borderRadius: "8px", padding: "8px 14px", marginBottom: "16px", fontSize: "0.85rem", color: "#f5c518" }}>
                      ⏳ Pending admin approval
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div style={{ width: "42px", height: "42px", background: "#e50914", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.1rem" }}>
                        {review.avatar}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, marginBottom: "2px" }}>{review.user}</p>
                        <p style={{ color: "#888", fontSize: "0.8rem" }}>{review.date}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(245,197,24,0.1)", padding: "6px 12px", borderRadius: "8px" }}>
                      <span style={{ color: "#f5c518", fontWeight: 900 }}>★</span>
                      <span style={{ fontWeight: 700 }}>{review.rating}/10</span>
                    </div>
                  </div>

                  {review.spoiler ? (
                    showSpoiler[review.id] ? (
                      <p style={{ color: "#ccc", lineHeight: 1.7, marginBottom: "16px" }}>{review.review}</p>
                    ) : (
                      <div style={{ background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.3)", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#e50914", fontWeight: 600 }}>⚠️ This review contains spoilers</span>
                        <button onClick={() => setShowSpoiler(p => ({ ...p, [review.id]: true }))}
                          style={{ background: "rgba(229,9,20,0.2)", color: "#e50914", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>
                          Show anyway
                        </button>
                      </div>
                    )
                  ) : (
                    <p style={{ color: "#ccc", lineHeight: 1.7, marginBottom: "16px" }}>{review.review}</p>
                  )}

                  {review.tags.length > 0 && (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                      {review.tags.map(t => (
                        <span key={t} style={{ background: "rgba(255,255,255,0.08)", color: "#aaa", padding: "3px 10px", borderRadius: "12px", fontSize: "0.78rem" }}>#{t}</span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "12px", alignItems: "center", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <button onClick={() => handleLike(review.id)}
                      style={{ background: liked[review.id] ? "rgba(229,9,20,0.15)" : "transparent", border: `1px solid ${liked[review.id] ? "rgba(229,9,20,0.5)" : "rgba(255,255,255,0.1)"}`, color: liked[review.id] ? "#e50914" : "#888", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "all 0.2s" }}>
                      {liked[review.id] ? "❤️" : "🤍"} {review.likes + (liked[review.id] ? 1 : 0)}
                    </button>
                    <span style={{ color: "#888", fontSize: "0.85rem" }}>{review.comments.length} comments</span>
                  </div>

                  {/* Comments */}
                  {review.comments.length > 0 && (
                    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      {review.comments.map(c => (
                        <div key={c.id} style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                          <div style={{ width: "30px", height: "30px", background: "#333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, flexShrink: 0 }}>
                            {c.user[0]}
                          </div>
                          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "10px 14px", flex: 1 }}>
                            <span style={{ fontWeight: 700, fontSize: "0.85rem", marginRight: "8px" }}>{c.user}</span>
                            <span style={{ color: "#888", fontSize: "0.75rem" }}>{c.date}</span>
                            <p style={{ color: "#ccc", fontSize: "0.9rem", marginTop: "4px" }}>{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add comment */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <input
                      value={commentText[review.id] || ""}
                      onChange={e => setCommentText(p => ({ ...p, [review.id]: e.target.value }))}
                      placeholder="Add a comment..."
                      style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 14px", color: "#fff", fontSize: "0.85rem", outline: "none" }}
                    />
                    <button onClick={() => handleComment(review.id)}
                      style={{ background: "#e50914", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>
                      Post
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* WRITE REVIEW FORM */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px", position: "sticky", top: "90px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "24px", fontFamily: "'Playfair Display', serif" }}>Write a Review</h3>

              <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "12px" }}>Your Rating</p>
              <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                  <button key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setUserRating(star)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.4rem", color: star <= (hoverRating || userRating) ? "#f5c518" : "#333", transition: "color 0.1s, transform 0.1s", transform: star <= (hoverRating || userRating) ? "scale(1.2)" : "scale(1)", padding: "2px" }}>
                    ★
                  </button>
                ))}
              </div>
              {userRating > 0 && <p style={{ color: "#f5c518", fontSize: "0.85rem", marginBottom: "16px", fontWeight: 700 }}>You rated: {userRating}/10</p>}

              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this title..."
                rows={5}
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px", color: "#fff", fontSize: "0.9rem", outline: "none", resize: "vertical", marginBottom: "16px", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
              />

              <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "10px" }}>Tags</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                {TAGS.map(tag => (
                  <button key={tag} onClick={() => setSelectedTags(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag])}
                    style={{ background: selectedTags.includes(tag) ? "rgba(229,9,20,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${selectedTags.includes(tag) ? "rgba(229,9,20,0.5)" : "rgba(255,255,255,0.1)"}`, color: selectedTags.includes(tag) ? "#e50914" : "#aaa", padding: "5px 12px", borderRadius: "20px", cursor: "pointer", fontSize: "0.8rem", fontWeight: selectedTags.includes(tag) ? 700 : 400 }}>
                    #{tag}
                  </button>
                ))}
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "20px", color: "#aaa", fontSize: "0.9rem" }}>
                <input type="checkbox" checked={spoilerToggle} onChange={e => setSpoilerToggle(e.target.checked)}
                  style={{ accentColor: "#e50914", width: "16px", height: "16px" }} />
                ⚠️ This review contains spoilers
              </label>

              <button onClick={handleSubmitReview}
                style={{ width: "100%", background: "#e50914", color: "#fff", border: "none", borderRadius: "10px", padding: "14px", fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}>
                Submit Review
              </button>
              <p style={{ color: "#666", fontSize: "0.78rem", textAlign: "center", marginTop: "10px" }}>Reviews are published after admin approval</p>
            </div>
          </div>
        )}
      </div>

      <div style={{ height: "80px" }} />
    </div>
  );
}
