"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const isAdmin = user?.role === "ADMIN";
  const isSubscribed = user?.isSubscribed === true;
  const router = useRouter();

  const [movie, setMovie]   = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  // Review form
  const [userRating, setUserRating]   = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText]   = useState("");
  const [hasSpoiler, setHasSpoiler]   = useState(false);
  const [tags, setTags]               = useState<string[]>([]);
  const [tagInput, setTagInput]       = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [submitMsg, setSubmitMsg]     = useState("");

  const [inWatchlist, setInWatchlist] = useState(false);
  const [likedReviews, setLikedReviews]   = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts]       = useState<Record<string, number>>({});
  const [showSpoiler, setShowSpoiler]     = useState<Record<string, boolean>>({});
  const [commentText, setCommentText]     = useState<Record<string, string>>({});
  const [showComments, setShowComments]   = useState<Record<string, boolean>>({});
  const [postingComment, setPostingComment] = useState<Record<string, boolean>>({});

  const API = process.env.NEXT_PUBLIC_API_URL!;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [mRes, rRes] = await Promise.all([
          fetch(`${API}/media/${params.id}`, { credentials: "include" }),
          fetch(`${API}/reviews?mediaId=${params.id}`, { credentials: "include" }),
        ]);
        if (!mRes.ok) throw new Error("Movie not found");
        const mData = await mRes.json();
        setMovie(mData.data || mData.media || mData);

        const rData = await rRes.json();
        const list: any[] = rData.data || rData.reviews || rData || [];
        const approved = list.filter((r: any) => r.isApproved);
        setReviews(approved);

        const counts: Record<string, number> = {};
        approved.forEach((r: any) => { counts[r.id] = r._count?.likes ?? 0; });
        setLikeCounts(counts);
      } catch (e: any) {
        setError(e.message);
      } finally { setLoading(false); }
    };
    load();
  }, [params.id]);

  // ── Premium check helper ────────────────────────────────────────────────────
  const canWatch = (priceType: string) => {
    if (priceType === "FREE") return true;
    if (isAdmin) return true;        // admin সব দেখতে পারে
    if (isSubscribed) return true;   // subscriber সব দেখতে পারে
    return false;
  };

  const handleWatchClick = (priceType: string, videoUrl: string) => {
    if (canWatch(priceType)) {
      window.open(videoUrl, "_blank");
    } else {
      // Premium content — redirect to subscription
      router.push("/subscription");
    }
  };

  const handleSubmitReview = async () => {
    if (!user) return setSubmitMsg("Please login first");
    if (!userRating) return setSubmitMsg("Select a rating (1-10)");
    if (!reviewText.trim()) return setSubmitMsg("Write your review");
    setSubmitting(true); setSubmitMsg("");
    try {
      const res = await fetch(`${API}/reviews`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId: params.id, rating: userRating, content: reviewText, hasSpoiler, tags }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setSubmitMsg("✅ Review submitted! Pending admin approval.");
      setUserRating(0); setReviewText(""); setHasSpoiler(false); setTags([]);
    } catch (e: any) {
      setSubmitMsg(`⚠️ ${e.message}`);
    } finally { setSubmitting(false); }
  };

  const handleLike = async (reviewId: string) => {
    if (!user) return;
    const wasLiked = likedReviews[reviewId];
    setLikedReviews(p => ({ ...p, [reviewId]: !wasLiked }));
    setLikeCounts(p => ({ ...p, [reviewId]: (p[reviewId] || 0) + (wasLiked ? -1 : 1) }));
    try {
      await fetch(`${API}/likes/${reviewId}`, { method: "POST", credentials: "include" });
    } catch {
      setLikedReviews(p => ({ ...p, [reviewId]: wasLiked }));
      setLikeCounts(p => ({ ...p, [reviewId]: (p[reviewId] || 0) + (wasLiked ? 1 : -1) }));
    }
  };

  const handleComment = async (reviewId: string) => {
    const text = commentText[reviewId]?.trim();
    if (!text || !user) return;
    setPostingComment(p => ({ ...p, [reviewId]: true }));
    try {
      const res = await fetch(`${API}/comments/${reviewId}`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setReviews(prev => prev.map(r =>
        r.id === reviewId
          ? { ...r, comments: [...(r.comments || []), data.data || { id: Date.now(), content: text, user: { name: user.name }, createdAt: new Date().toISOString() }] }
          : r
      ));
      setCommentText(p => ({ ...p, [reviewId]: "" }));
    } catch {} finally { setPostingComment(p => ({ ...p, [reviewId]: false })); }
  };

  const handleDeleteComment = async (reviewId: string, commentId: string) => {
    try {
      await fetch(`${API}/comments/${commentId}`, { method: "DELETE", credentials: "include" });
      setReviews(prev => prev.map(r =>
        r.id === reviewId ? { ...r, comments: (r.comments || []).filter((c: any) => c.id !== commentId) } : r
      ));
    } catch {}
  };

  const handleApprove = async (reviewId: string) => {
    try {
      await fetch(`${API}/reviews/approve/${reviewId}`, { method: "PATCH", credentials: "include" });
      setReviews(p => p.map(r => r.id === reviewId ? { ...r, isApproved: true } : r));
    } catch {}
  };

  const handleWatchlist = async () => {
    if (!user) return router.push("/login");
    try {
      if (inWatchlist) {
        await fetch(`${API}/watchlist/${params.id}`, { method: "DELETE", credentials: "include" });
        setInWatchlist(false);
      } else {
        await fetch(`${API}/watchlist`, {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mediaId: params.id }),
        });
        setInWatchlist(true);
      }
    } catch {}
  };

  const PRESET_TAGS = ["classic", "underrated", "masterpiece", "must-watch", "overrated", "family-friendly"];

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", paddingTop: "90px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ height: "380px", background: "rgba(255,255,255,0.04)" }} />
      <div style={{ padding: "0 5vw", marginTop: "-160px", display: "flex", gap: "28px" }}>
        <div style={{ width: "180px", height: "270px", borderRadius: "12px", background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />
        <div style={{ flex: 1, paddingTop: "120px" }}>
          {[200, 300, 180].map((w, i) => <div key={i} style={{ height: i === 1 ? "44px" : "16px", width: `${w}px`, background: "rgba(255,255,255,0.07)", borderRadius: "6px", marginBottom: "14px" }} />)}
        </div>
      </div>
    </div>
  );

  if (error || !movie) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", fontFamily: "'DM Sans', sans-serif" }}>
      <p style={{ fontSize: "3rem" }}>🎬</p>
      <p style={{ color: "#666", fontWeight: 700 }}>{error || "Movie not found"}</p>
      <Link href="/movies" style={{ color: "#e50914", textDecoration: "none" }}>← Browse all</Link>
    </div>
  );

  const poster    = movie.posterUrl;
  const title     = movie.title;
  const synopsis  = movie.synopsis;
  const genres    = movie.genres || [];
  const year      = movie.releaseYear;
  const director  = movie.director;
  const cast      = movie.cast || [];
  const videoUrl  = movie.videoUrl;
  const priceType = movie.priceType || "FREE";
  const avgRating = movie.avgRating || 0;
  const isPremium = priceType === "PREMIUM";
  const userCanWatch = canWatch(priceType);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>

      {/* BACKDROP */}
      <div style={{ position: "relative", height: "480px", overflow: "hidden" }}>
        {poster
          ? <img src={poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", filter: "blur(3px) brightness(0.35)" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1a0005, #0a0a0a)" }} />
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.5) 55%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.85) 0%, transparent 60%)" }} />
      </div>

      {/* MOVIE INFO */}
      <div style={{ padding: "0 5vw", marginTop: "-200px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", gap: "36px", alignItems: "flex-end", flexWrap: "wrap" }}>

          {/* Poster */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            {poster
              ? <img src={poster} alt={title} style={{ width: "175px", borderRadius: "14px", boxShadow: "0 24px 60px rgba(0,0,0,0.85)", display: "block" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              : <div style={{ width: "175px", height: "262px", borderRadius: "14px", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>🎬</div>
            }
            {/* Premium lock overlay on poster */}
            {isPremium && !userCanWatch && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", borderRadius: "14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <span style={{ fontSize: "2rem" }}>🔒</span>
                <span style={{ color: "#f5c518", fontSize: "0.75rem", fontWeight: 700 }}>PREMIUM</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: "260px", paddingBottom: "8px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
              {genres.map((g: string) => (
                <span key={g} style={{ background: "rgba(255,255,255,0.1)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.78rem", color: "#ccc" }}>{g}</span>
              ))}
              {/* Price badge */}
              <span style={{ background: isPremium ? "rgba(245,197,24,0.2)" : "rgba(74,222,128,0.2)", color: isPremium ? "#f5c518" : "#4ade80", padding: "4px 12px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 700, border: `1px solid ${isPremium ? "rgba(245,197,24,0.3)" : "rgba(74,222,128,0.25)"}` }}>
                {isPremium ? "⭐ Premium" : "✓ Free"}
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, fontFamily: "'Playfair Display', serif", marginBottom: "12px", lineHeight: 1.1 }}>{title}</h1>

            <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "14px", flexWrap: "wrap" }}>
              {avgRating > 0 && (
                <span style={{ color: "#f5c518", fontSize: "1.7rem", fontWeight: 900 }}>
                  ★ {Number(avgRating).toFixed(1)}<span style={{ color: "#555", fontSize: "1rem", fontWeight: 400 }}>/10</span>
                </span>
              )}
              {year && <><span style={{ color: "#555" }}>•</span><span style={{ color: "#aaa" }}>{year}</span></>}
              {reviews.length > 0 && <><span style={{ color: "#555" }}>•</span><span style={{ color: "#aaa" }}>{reviews.length} reviews</span></>}
            </div>

            <p style={{ color: "#aaa", lineHeight: 1.75, marginBottom: "24px", maxWidth: "560px", fontSize: "0.95rem" }}>{synopsis}</p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>

              {/* ── WATCH BUTTON — premium check ── */}
              {videoUrl && (
                userCanWatch ? (
                  /* Has access — open video */
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                    <button style={{ background: "#e50914", color: "#fff", border: "none", padding: "13px 28px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
                      ▶ Watch Now
                    </button>
                  </a>
                ) : (
                  /* Premium — no access */
                  <div>
                    <button
                      onClick={() => router.push("/subscription")}
                      style={{ background: "linear-gradient(135deg, #f5c518, #e6a800)", color: "#000", border: "none", padding: "13px 28px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
                      🔒 Subscribe to Watch
                    </button>
                  </div>
                )
              )}

              {/* Watchlist */}
              <button onClick={handleWatchlist}
                style={{ background: inWatchlist ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.08)", color: inWatchlist ? "#4ade80" : "#fff", border: `1px solid ${inWatchlist ? "#4ade80" : "rgba(255,255,255,0.2)"}`, padding: "13px 22px", borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontSize: "0.95rem", fontFamily: "'DM Sans', sans-serif" }}>
                {inWatchlist ? "✓ In Watchlist" : "+ Watchlist"}
              </button>
            </div>

            {/* ── PREMIUM UPSELL BANNER ── */}
            {isPremium && !userCanWatch && (
              <div style={{ marginTop: "20px", background: "linear-gradient(135deg, rgba(245,197,24,0.08), rgba(245,197,24,0.03))", border: "1px solid rgba(245,197,24,0.2)", borderRadius: "14px", padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: "#f5c518", marginBottom: "4px", fontSize: "0.95rem" }}>
                    🔒 This is a Premium title
                  </p>
                  <p style={{ color: "#888", fontSize: "0.85rem" }}>
                    Subscribe from <strong style={{ color: "#f5c518" }}>৳299/month</strong> to unlock all premium movies and series.
                  </p>
                </div>
                <Link href="/subscription">
                  <button style={{ background: "#f5c518", color: "#000", border: "none", borderRadius: "9px", padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                    View Plans →
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Meta grid */}
        <div style={{ marginTop: "32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px" }}>
          {director && <Meta label="Director" value={director} />}
          {cast.length > 0 && <Meta label="Cast" value={cast.join(", ")} />}
          {year && <Meta label="Release Year" value={String(year)} />}
          <Meta label="Type" value={movie.type} />
        </div>

        {/* ── REVIEWS + FORM ── */}
        <div style={{ marginTop: "52px", display: "grid", gridTemplateColumns: "1fr 360px", gap: "40px", alignItems: "flex-start" }}>

          {/* Reviews list */}
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "'Playfair Display', serif", marginBottom: "24px" }}>
              Reviews {reviews.length > 0 && <span style={{ color: "#444", fontSize: "1rem", fontWeight: 400 }}>({reviews.length})</span>}
            </h2>

            {reviews.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#333" }}>
                <p style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📝</p>
                <p style={{ color: "#555", fontWeight: 700 }}>No reviews yet — be the first!</p>
              </div>
            ) : reviews.map((r: any) => (
              <div key={r.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#e50914", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1rem", flexShrink: 0, overflow: "hidden" }}>
                      {r.user?.image ? <img src={r.user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : r.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "1px" }}>{r.user?.name || "Anonymous"}</p>
                      <p style={{ color: "#444", fontSize: "0.73rem" }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div style={{ background: "rgba(245,197,24,0.1)", padding: "5px 12px", borderRadius: "8px", color: "#f5c518", fontWeight: 700 }}>★ {r.rating}/10</div>
                </div>

                {r.hasSpoiler && !showSpoiler[r.id] ? (
                  <div style={{ background: "rgba(229,9,20,0.08)", border: "1px solid rgba(229,9,20,0.2)", borderRadius: "8px", padding: "11px 14px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#e50914", fontSize: "0.85rem", fontWeight: 600 }}>⚠️ Contains spoilers</span>
                    <button onClick={() => setShowSpoiler(p => ({ ...p, [r.id]: true }))} style={{ background: "rgba(229,9,20,0.2)", color: "#e50914", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif" }}>Show</button>
                  </div>
                ) : (
                  <p style={{ color: "#ccc", lineHeight: 1.7, marginBottom: "12px", fontSize: "0.92rem" }}>{r.content}</p>
                )}

                {r.tags?.length > 0 && (
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "12px" }}>
                    {r.tags.map((t: string) => <span key={t} style={{ background: "rgba(255,255,255,0.06)", color: "#666", padding: "2px 8px", borderRadius: "12px", fontSize: "0.72rem" }}>#{t}</span>)}
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", flexWrap: "wrap" }}>
                  {user && (
                    <button onClick={() => handleLike(r.id)} style={{ display: "flex", alignItems: "center", gap: "6px", background: likedReviews[r.id] ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${likedReviews[r.id] ? "rgba(229,9,20,0.4)" : "rgba(255,255,255,0.1)"}`, color: likedReviews[r.id] ? "#e50914" : "#777", padding: "6px 13px", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                      {likedReviews[r.id] ? "❤️" : "🤍"} {likeCounts[r.id] || 0}
                    </button>
                  )}
                  <button onClick={() => setShowComments(p => ({ ...p, [r.id]: !p[r.id] }))} style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#777", padding: "6px 13px", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
                    💬 {(r.comments || []).length} {showComments[r.id] ? "▲" : "▼"}
                  </button>
                  {isAdmin && !r.isApproved && (
                    <button onClick={() => handleApprove(r.id)} style={{ marginLeft: "auto", background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>✓ Approve</button>
                  )}
                </div>

                {showComments[r.id] && (
                  <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    {(r.comments || []).map((c: any) => (
                      <div key={c.id} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.73rem", fontWeight: 700, flexShrink: 0 }}>
                          {c.user?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "8px 12px", flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                            <span style={{ fontWeight: 700, fontSize: "0.82rem" }}>{c.user?.name}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ color: "#444", fontSize: "0.7rem" }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                              {user && c.user?.id === user.id && (
                                <button onClick={() => handleDeleteComment(r.id, c.id)} style={{ background: "transparent", border: "none", color: "#444", cursor: "pointer", fontSize: "0.8rem" }}>×</button>
                              )}
                            </div>
                          </div>
                          <p style={{ color: "#bbb", fontSize: "0.87rem" }}>{c.content}</p>
                        </div>
                      </div>
                    ))}
                    {user ? (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input value={commentText[r.id] || ""} onChange={e => setCommentText(p => ({ ...p, [r.id]: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleComment(r.id)} placeholder="Write a comment..." style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 12px", color: "#fff", fontSize: "0.85rem", outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
                        <button onClick={() => handleComment(r.id)} disabled={postingComment[r.id]} style={{ background: "#e50914", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif" }}>Post</button>
                      </div>
                    ) : (
                      <Link href="/login" style={{ color: "#e50914", fontSize: "0.85rem", textDecoration: "none" }}>Login to comment →</Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* WRITE REVIEW FORM */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "26px", position: "sticky", top: "90px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "20px", fontFamily: "'Playfair Display', serif" }}>Write a Review</h3>
            {!user ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "#555", marginBottom: "14px", fontSize: "0.88rem" }}>Login to write a review</p>
                <Link href="/login"><button style={{ background: "#e50914", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 24px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Log In</button></Link>
              </div>
            ) : (
              <>
                <p style={{ color: "#666", fontSize: "0.78rem", fontWeight: 600, marginBottom: "8px" }}>Rating</p>
                <div style={{ display: "flex", gap: "3px", marginBottom: "14px" }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button key={n} onMouseEnter={() => setHoverRating(n)} onMouseLeave={() => setHoverRating(0)} onClick={() => setUserRating(n)}
                      style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.25rem", color: n <= (hoverRating || userRating) ? "#f5c518" : "#222", transition: "all 0.1s", transform: n <= (hoverRating || userRating) ? "scale(1.2)" : "scale(1)", padding: "1px" }}>★</button>
                  ))}
                </div>
                {userRating > 0 && <p style={{ color: "#f5c518", fontSize: "0.8rem", fontWeight: 700, marginBottom: "12px" }}>{userRating}/10</p>}
                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your thoughts..." rows={4}
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "11px", color: "#fff", fontSize: "0.88rem", outline: "none", resize: "vertical", marginBottom: "13px", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
                <p style={{ color: "#666", fontSize: "0.78rem", fontWeight: 600, marginBottom: "7px" }}>Tags</p>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "10px" }}>
                  {PRESET_TAGS.map(t => (
                    <button key={t} onClick={() => setTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                      style={{ background: tags.includes(t) ? "rgba(229,9,20,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${tags.includes(t) ? "rgba(229,9,20,0.4)" : "rgba(255,255,255,0.08)"}`, color: tags.includes(t) ? "#e50914" : "#666", padding: "3px 9px", borderRadius: "14px", cursor: "pointer", fontSize: "0.75rem", fontFamily: "'DM Sans', sans-serif" }}>
                      #{t}
                    </button>
                  ))}
                </div>
                <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && tagInput.trim()) { setTags(p => [...p, tagInput.trim()]); setTagInput(""); } }}
                  placeholder="Custom tag + Enter"
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 10px", color: "#fff", fontSize: "0.82rem", outline: "none", marginBottom: "12px", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "16px", color: "#777", fontSize: "0.85rem" }}>
                  <input type="checkbox" checked={hasSpoiler} onChange={e => setHasSpoiler(e.target.checked)} style={{ accentColor: "#e50914" }} />
                  ⚠️ Contains spoilers
                </label>
                {submitMsg && (
                  <div style={{ background: submitMsg.startsWith("✅") ? "rgba(74,222,128,0.1)" : "rgba(229,9,20,0.1)", border: `1px solid ${submitMsg.startsWith("✅") ? "rgba(74,222,128,0.3)" : "rgba(229,9,20,0.3)"}`, borderRadius: "8px", padding: "9px 12px", marginBottom: "12px", fontSize: "0.83rem", color: submitMsg.startsWith("✅") ? "#4ade80" : "#ff6b6b" }}>
                    {submitMsg}
                  </div>
                )}
                <button onClick={handleSubmitReview} disabled={submitting}
                  style={{ width: "100%", background: submitting ? "#222" : "#e50914", color: submitting ? "#555" : "#fff", border: "none", borderRadius: "10px", padding: "12px", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif" }}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                <p style={{ color: "#333", fontSize: "0.72rem", textAlign: "center", marginTop: "7px" }}>Published after admin approval</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div style={{ height: "80px" }} />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ color: "#444", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px", fontWeight: 600 }}>{label}</p>
      <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{value}</p>
    </div>
  );
}