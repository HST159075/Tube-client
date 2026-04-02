"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, updateUser } from "@/lib/auth-client";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user as any;

  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "profile" | "watchlist" | "reviews"
  >("profile");
  const [tabLoading, setTabLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL!;

  // ── Auth guard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPending && !user) router.push("/login?redirect=/profile");
  }, [user, isPending, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImagePreview(user.image || null);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "watchlist") fetchWatchlist();
    if (activeTab === "reviews") fetchMyReviews();
  }, [activeTab]);

  // GET /api/v1/watchlist
  const fetchWatchlist = async () => {
    setTabLoading(true);
    try {
      const res = await fetch(`${API}/watchlist`, { credentials: "include" });
      const d = await res.json();
      setWatchlist(d.data || d.watchlist || (Array.isArray(d) ? d : []));
    } catch {
      setWatchlist([]);
    } finally {
      setTabLoading(false);
    }
  };

  // GET /api/v1/reviews?mediaId — তোমার backend-এ /reviews/my নেই
  // তাই user-এর নিজের reviews আনতে profile endpoint ব্যবহার করছি
  // অথবা review list থেকে filter করছি
  const fetchMyReviews = async () => {
    setTabLoading(true);
    try {
      // তোমার backend-এ /reviews/my নেই, তাই /users/me থেকে আনব
      // অথবা সরাসরি /reviews?userId=... যদি থাকে
      // Safe fallback: /users/me এর reviews
      const res = await fetch(`${API}/users/me`, { credentials: "include" });
      const d = await res.json();
      const userData = d.data || d;

      // যদি user object-এ reviews থাকে
      if (userData?.reviews) {
        setMyReviews(userData.reviews);
        return;
      }

      // Alternative: তোমার getMyProfile তে reviews নেই
      // তাই empty দেখাবে এবং note দেব
      setMyReviews([]);
    } catch {
      setMyReviews([]);
    } finally {
      setTabLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError("Image must be under 5MB");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setError("");
  };

  const handleSave = async () => {
    if (!name.trim()) return setError("Name cannot be empty");
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateUser({ name: name.trim() });

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("name", name.trim());
        await fetch(`${API}/users/update`, {
          method: "PATCH",
          credentials: "include",
          body: formData,
        });
      }

      await (refetch as any)?.();
      setSuccess("Profile updated successfully!");
      setImageFile(null);
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveWatchlist = async (mediaId: string) => {
    try {
      await fetch(`${API}/watchlist/${mediaId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setWatchlist((p) =>
        p.filter((w: any) => (w.mediaId || w.media?.id || w.id) !== mediaId),
      );
    } catch {}
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await fetch(`${API}/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setMyReviews((p) => p.filter((r: any) => r.id !== reviewId));
    } catch {}
  };

  if (isPending) return <PageLoader />;
  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── HERO BANNER ── */}
      <div
        style={{
          position: "relative",
          height: "220px",
          background:
            "linear-gradient(135deg, #1a0005 0%, #0d0d1a 50%, #0a0a0a 100%)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(229,9,20,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(96,165,250,0.08) 0%, transparent 50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: "linear-gradient(to top, #0a0a0a, transparent)",
          }}
        />

        {/* Admin badge top right */}
        {isAdmin && (
          <div style={{ position: "absolute", top: "80px", right: "5vw" }}>
            <Link href="/admin/dashboard">
              <button
                style={{
                  background: "rgba(245,197,24,0.15)",
                  color: "#f5c518",
                  border: "1px solid rgba(245,197,24,0.3)",
                  borderRadius: "10px",
                  padding: "10px 18px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontFamily: "'DM Sans', sans-serif",
                  backdropFilter: "blur(10px)",
                }}
              >
                ⚙️ Admin Panel
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* ── PROFILE HEADER ── */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 5vw" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "24px",
            marginTop: "-60px",
            marginBottom: "32px",
            flexWrap: "wrap",
          }}
        >
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "4px solid #0a0a0a",
                background: "#1a1a1a",
                boxShadow: "0 0 0 2px rgba(229,9,20,0.4)",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #e50914, #c0070f)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.8rem",
                    fontWeight: 900,
                  }}
                >
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>

          {/* Name + meta */}
          <div style={{ paddingBottom: "8px", flex: 1, minWidth: "200px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "4px",
              }}
            >
              <h1
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  fontFamily: "'Playfair Display', serif",
                  margin: 0,
                  whiteSpace: "normal", 
                  wordBreak: "break-word", 
                  lineHeight: "1.2",
                  flex: "1",
                }}
              >
                {user.name}
              </h1>
              <span
                style={{
                  background: isAdmin
                    ? "rgba(245,197,24,0.15)"
                    : "rgba(74,222,128,0.1)",
                  color: isAdmin ? "#f5c518" : "#4ade80",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "20px",
                  border: `1px solid ${isAdmin ? "rgba(245,197,24,0.25)" : "rgba(74,222,128,0.2)"}`,
                }}
              >
                {isAdmin ? "⚡ ADMIN" : "USER"}
              </span>
              {user.isSubscribed && (
                <span
                  style={{
                    background: "rgba(96,165,250,0.12)",
                    color: "#60a5fa",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "20px",
                    border: "1px solid rgba(96,165,250,0.2)",
                  }}
                >
                  ⭐ Subscribed
                </span>
              )}
            </div>
            <p style={{ color: "#555", fontSize: "0.87rem", margin: 0 }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* ── TABS ── */}
        <div
          style={{
            display: "flex",
            gap: "0",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            marginBottom: "36px",
          }}
        >
          {[
            { id: "profile", label: "Profile", icon: "👤" },
            { id: "watchlist", label: "Watchlist", icon: "🔖" },
            { id: "reviews", label: "My Reviews", icon: "📝" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                padding: "12px 22px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: activeTab === t.id ? 700 : 500,
                fontSize: "0.9rem",
                color: activeTab === t.id ? "#fff" : "#555",
                borderBottom:
                  activeTab === t.id
                    ? "2px solid #e50914"
                    : "2px solid transparent",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <span style={{ fontSize: "0.9rem" }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <div style={{ maxWidth: "480px" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "32px",
              }}
            >
              <h2
                style={{
                  fontWeight: 800,
                  marginBottom: "24px",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.25rem",
                }}
              >
                Edit Profile
              </h2>

              {success && (
                <div
                  style={{
                    background: "rgba(74,222,128,0.08)",
                    border: "1px solid rgba(74,222,128,0.25)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    marginBottom: "18px",
                    color: "#4ade80",
                    fontSize: "0.87rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>✓</span> {success}
                </div>
              )}
              {error && (
                <div
                  style={{
                    background: "rgba(229,9,20,0.08)",
                    border: "1px solid rgba(229,9,20,0.25)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    marginBottom: "18px",
                    color: "#ff6b6b",
                    fontSize: "0.87rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Avatar upload */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  marginBottom: "24px",
                  padding: "16px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    width: "62px",
                    height: "62px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    boxShadow: "0 0 0 2px rgba(229,9,20,0.3)",
                  }}
                >
                  {imagePreview ? (
                    <img
                      key={imagePreview}
                      src={imagePreview}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(135deg, #e50914, #c0070f)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.6rem",
                        fontWeight: 900,
                      }}
                    >
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      marginBottom: "8px",
                      color: "#ccc",
                    }}
                  >
                    Profile Photo
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    style={{
                      background: "rgba(229,9,20,0.12)",
                      border: "1px solid rgba(229,9,20,0.25)",
                      borderRadius: "8px",
                      padding: "7px 14px",
                      color: "#e50914",
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    📷 Change Photo
                  </button>
                  {imageFile ? (
                    <p
                      style={{
                        color: "#f5c518",
                        fontSize: "0.72rem",
                        marginTop: "5px",
                      }}
                    >
                      ✓ {imageFile.name}
                    </p>
                  ) : (
                    <p
                      style={{
                        color: "#444",
                        fontSize: "0.72rem",
                        marginTop: "5px",
                      }}
                    >
                      Max 5MB · JPG, PNG, WebP
                    </p>
                  )}
                </div>
              </div>

              {/* Name */}
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#666",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    marginBottom: "7px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: "0.95rem",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(229,9,20,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
              </div>

              {/* Email read-only */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#666",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    marginBottom: "7px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Email{" "}
                  <span
                    style={{
                      color: "#333",
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    (cannot change)
                  </span>
                </label>
                <input
                  value={user.email}
                  readOnly
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    color: "#444",
                    fontSize: "0.95rem",
                    outline: "none",
                    boxSizing: "border-box",
                    cursor: "not-allowed",
                  }}
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  width: "100%",
                  background: saving
                    ? "#1a1a1a"
                    : "linear-gradient(135deg, #e50914, #c0070f)",
                  color: saving ? "#444" : "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "14px",
                  fontWeight: 700,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: "0.95rem",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "opacity 0.2s",
                  letterSpacing: "0.3px",
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* ── WATCHLIST TAB ── */}
        {activeTab === "watchlist" && (
          <div>
            {tabLoading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))",
                  gap: "20px",
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i}>
                    <div
                      style={{
                        aspectRatio: "2/3",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "12px",
                        marginBottom: "8px",
                      }}
                    />
                    <div
                      style={{
                        height: "12px",
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: "6px",
                        width: "80%",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : watchlist.length === 0 ? (
              <EmptyState
                icon="🔖"
                text="Watchlist is empty"
                sub="Browse movies and click + Watchlist to save titles"
              >
                <Link href="/movies">
                  <button
                    style={{
                      marginTop: "16px",
                      background: "#e50914",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "11px 24px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Browse Movies
                  </button>
                </Link>
              </EmptyState>
            ) : (
              <>
                <p
                  style={{
                    color: "#555",
                    fontSize: "0.85rem",
                    marginBottom: "20px",
                  }}
                >
                  <strong style={{ color: "#888" }}>{watchlist.length}</strong>{" "}
                  saved titles
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(155px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {watchlist.map((item: any) => {
                    const m = item.media || item;
                    const mediaId = item.mediaId || m.id;
                    return (
                      <div
                        key={item.id || mediaId}
                        style={{ position: "relative", group: "true" } as any}
                      >
                        <Link
                          href={`/movies/${mediaId}`}
                          style={{ textDecoration: "none" }}
                        >
                          <WatchCard m={m} />
                        </Link>
                        {/* Remove button */}
                        <button
                          onClick={() => handleRemoveWatchlist(mediaId)}
                          title="Remove from watchlist"
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            width: "28px",
                            height: "28px",
                            background: "rgba(0,0,0,0.8)",
                            border: "1px solid rgba(229,9,20,0.4)",
                            borderRadius: "50%",
                            color: "#e50914",
                            cursor: "pointer",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── MY REVIEWS TAB ── */}
        {activeTab === "reviews" && (
          <div>
            {tabLoading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: "100px",
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: "14px",
                    }}
                  />
                ))}
              </div>
            ) : myReviews.length === 0 ? (
              <div>
                <EmptyState
                  icon="📝"
                  text="No reviews yet"
                  sub="Go to a movie page and write your first review"
                >
                  <Link href="/movies">
                    <button
                      style={{
                        marginTop: "16px",
                        background: "#e50914",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        padding: "11px 24px",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Browse & Review
                    </button>
                  </Link>
                </EmptyState>
                {/* Backend note */}
                <div
                  style={{
                    background: "rgba(96,165,250,0.08)",
                    border: "1px solid rgba(96,165,250,0.2)",
                    borderRadius: "10px",
                    padding: "14px 18px",
                    marginTop: "20px",
                    fontSize: "0.83rem",
                    color: "#60a5fa",
                    lineHeight: 1.6,
                  }}
                >
                  ℹ️ To show user reviews here, add this route to your backend:
                  <br />
                  <code
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontFamily: "monospace",
                    }}
                  >
                    router.get("/my", authMiddleware, getMyReviews)
                  </code>
                  <br />
                  <span style={{ color: "#4a90d9", fontSize: "0.78rem" }}>
                    Controller: prisma.review.findMany({"{"} where: {"{"} userId{" "}
                    {"}"}, include: {"{"} media {"}"} {"}"})
                  </span>
                </div>
              </div>
            ) : (
              <>
                <p
                  style={{
                    color: "#555",
                    fontSize: "0.85rem",
                    marginBottom: "20px",
                  }}
                >
                  <strong style={{ color: "#888" }}>{myReviews.length}</strong>{" "}
                  reviews submitted
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  {myReviews.map((r: any) => (
                    <div
                      key={r.id}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "16px",
                        padding: "20px",
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.12)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.07)")
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "10px",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        <div>
                          <Link
                            href={`/movies/${r.mediaId}`}
                            style={{
                              color: "#e50914",
                              fontWeight: 700,
                              textDecoration: "none",
                              fontSize: "0.95rem",
                            }}
                          >
                            {r.media?.title || "Unknown title"}
                          </Link>
                          <p
                            style={{
                              color: "#444",
                              fontSize: "0.75rem",
                              marginTop: "3px",
                            }}
                          >
                            {new Date(r.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              background: "rgba(245,197,24,0.1)",
                              color: "#f5c518",
                              fontWeight: 700,
                              padding: "4px 10px",
                              borderRadius: "8px",
                              fontSize: "0.85rem",
                            }}
                          >
                            ★ {r.rating}/10
                          </span>
                          <span
                            style={{
                              background: r.isApproved
                                ? "rgba(74,222,128,0.12)"
                                : "rgba(245,197,24,0.12)",
                              color: r.isApproved ? "#4ade80" : "#f5c518",
                              padding: "4px 10px",
                              borderRadius: "8px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                            }}
                          >
                            {r.isApproved ? "✓ Published" : "⏳ Pending"}
                          </span>
                        </div>
                      </div>

                      <p
                        style={{
                          color: "#aaa",
                          lineHeight: 1.7,
                          fontSize: "0.9rem",
                          marginBottom: r.isApproved ? 0 : "14px",
                        }}
                      >
                        {r.content}
                      </p>

                      {/* Tags */}
                      {r.tags?.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            flexWrap: "wrap",
                            marginTop: "10px",
                            marginBottom: r.isApproved ? 0 : "12px",
                          }}
                        >
                          {r.tags.map((t: string) => (
                            <span
                              key={t}
                              style={{
                                background: "rgba(255,255,255,0.06)",
                                color: "#666",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "0.72rem",
                              }}
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Delete — only for pending reviews */}
                      {!r.isApproved && (
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          style={{
                            background: "rgba(229,9,20,0.08)",
                            color: "#e50914",
                            border: "1px solid rgba(229,9,20,0.2)",
                            borderRadius: "8px",
                            padding: "6px 14px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          🗑 Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div style={{ height: "60px" }} />
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function WatchCard({ m }: { m: any }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          borderRadius: "12px",
          overflow: "hidden",
          aspectRatio: "2/3",
          background: "#1a1a1a",
          marginBottom: "9px",
          transition: "transform 0.25s",
          transform: hovered ? "scale(1.04)" : "scale(1)",
        }}
      >
        {m.posterUrl ? (
          <img
            src={m.posterUrl}
            alt={m.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
              background: "linear-gradient(135deg, #1a1a1a, #0d0d0d)",
            }}
          >
            🎬
          </div>
        )}
        {hovered && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: "0.85rem",
                fontWeight: 700,
                background: "#e50914",
                padding: "7px 16px",
                borderRadius: "20px",
              }}
            >
              ▶ View
            </span>
          </div>
        )}
        {m.avgRating > 0 && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              background: "rgba(0,0,0,0.8)",
              borderRadius: "6px",
              padding: "2px 7px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#f5c518",
              backdropFilter: "blur(4px)",
            }}
          >
            ★ {Number(m.avgRating).toFixed(1)}
          </div>
        )}
      </div>
      <p
        style={{
          color: "#ccc",
          fontWeight: 700,
          fontSize: "0.83rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {m.title}
      </p>
      {m.releaseYear && (
        <p style={{ color: "#444", fontSize: "0.75rem", marginTop: "2px" }}>
          {m.releaseYear}
        </p>
      )}
    </div>
  );
}

function EmptyState({
  icon,
  text,
  sub,
  children,
}: {
  icon: string;
  text: string;
  sub: string;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "3.5rem", marginBottom: "14px" }}>{icon}</div>
      <p
        style={{
          fontWeight: 800,
          color: "#666",
          marginBottom: "8px",
          fontSize: "1.1rem",
        }}
      >
        {text}
      </p>
      <p style={{ color: "#333", fontSize: "0.88rem" }}>{sub}</p>
      {children}
    </div>
  );
}

function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          border: "3px solid rgba(229,9,20,0.2)",
          borderTop: "3px solid #e50914",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: "#555", fontSize: "0.9rem" }}>Loading profile...</p>
    </div>
  );
}
