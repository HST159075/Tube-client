"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

// ─── Types matching controllers exactly ───────────────────────────────────────
type Stats = {
  totalUsers: number;
  totalMovies: number; // getAdminStats returns totalMovies (not totalMedia)
  activeSubscriptions: number;
};

type Media = {
  id: string;
  title: string;
  synopsis: string;
  type: "MOVIE" | "SERIES";
  genres: string[]; // schema: genres String[]
  releaseYear: number;
  director: string;
  cast: string[];
  posterUrl?: string; // schema: posterUrl
  videoUrl: string; // schema: videoUrl
  priceType: "FREE" | "PREMIUM";
  avgRating: number;
  _count?: { reviews: number };
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  image?: string;
  isSubscribed: boolean;
  subscriptionEnd?: string;
  createdAt: string;
  _count?: { reviews: number };
};

type Review = {
  id: string;
  rating: number;
  content: string; // schema: content
  isApproved: boolean; // schema: isApproved
  hasSpoiler: boolean;
  tags: string[];
  createdAt: string;
  mediaId: string;
  userId: string;
  user?: { name: string; email: string; image?: string };
  media?: { title: string };
};

const API = process.env.NEXT_PUBLIC_API_URL!;

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

const EMPTY_FORM = {
  title: "",
  synopsis: "",
  type: "MOVIE" as "MOVIE" | "SERIES",
  genres: [] as string[],
  releaseYear: new Date().getFullYear(),
  director: "",
  cast: [] as string[],
  videoUrl: "",
  posterUrl: "",
  priceType: "FREE" as "FREE" | "PREMIUM",
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [tab, setTab] = useState<"overview" | "media" | "users" | "reviews" | "reports">(
    "overview",
  );

  // Data
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalMovies: 0,
    activeSubscriptions: 0,
  });
  const [media, setMedia] = useState<Media[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Filtering & Pagination
  const [mediaSearch, setMediaSearch]   = useState("");
  const [userSearch, setUserSearch]     = useState("");
  const [reviewSearch, setReviewSearch] = useState("");
  const [pageSize]                      = useState(5);
  const [mediaPage, setMediaPage]       = useState(1);
  const [userPage, setUserPage]         = useState(1);
  const [reviewPage, setReviewPage]     = useState(1);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Media | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formErr, setFormErr] = useState("");

  // Tag inputs
  const [genreIn, setGenreIn] = useState("");
  const [castIn, setCastIn] = useState("");

  // ── Auth guard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPending) {
      if (!session || (session.user as any)?.role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [session, isPending, router]);

  // ── Load stats on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    loadStats();
  }, []);

  // ── Load per tab ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (tab === "media") loadMedia();
    if (tab === "users") loadUsers();
    if (tab === "reviews") loadReviews();
  }, [tab]);

  // ── Stats: GET /api/v1/users/admin/stats ─────────────────────────────────────
  // Returns: { success, data: { totalUsers, totalMovies, activeSubscriptions } }
  const loadStats = async () => {
    try {
      const d = await apiFetch("/users/admin/stats");
      const s = d.data || d;
      setStats({
        totalUsers: s.totalUsers || 0,
        totalMovies: s.totalMovies || 0,
        activeSubscriptions: s.activeSubscriptions || 0,
      });
    } catch (e: any) {
      console.error("Stats error:", e.message);
    }
  };

  // ── Media: GET /api/v1/media ─────────────────────────────────────────────────
  // Returns: { success, data: Media[] }
  const loadMedia = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const d = await apiFetch("/media");
      setMedia(d.data || []);
    } catch (e: any) {
      setFetchError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Users: GET /api/v1/users/admin/all-users ─────────────────────────────────
  // Returns: { success, meta: {...}, data: User[] }
  const loadUsers = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const d = await apiFetch("/users/admin/all-users");
      setUsers(d.data || []);
    } catch (e: any) {
      setFetchError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Reviews: GET /api/v1/reviews ─────────────────────────────────────────────
  // Note: your getReviewsByMedia requires mediaId param
  // For admin "all reviews" — fetch all media first, then get reviews per media
  // OR add a new route in backend. Using a workaround here:
  const loadReviews = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const d = await apiFetch("/reviews/admin/all");
      setReviews(d.data || []);
    } catch (e: any) {
      setFetchError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Media CRUD ───────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setGenreIn("");
    setCastIn("");
    setFormErr("");
    setShowModal(true);
  };

  const openEdit = (m: Media) => {
    setEditing(m);
    setForm({
      title: m.title,
      synopsis: m.synopsis || "",
      type: m.type,
      genres: m.genres || [],
      releaseYear: m.releaseYear,
      director: m.director || "",
      cast: m.cast || [],
      videoUrl: m.videoUrl || "",
      posterUrl: m.posterUrl || "",
      priceType: m.priceType || "FREE",
    });
    setGenreIn("");
    setCastIn("");
    setFormErr("");
    setShowModal(true);
  };

  // POST /api/v1/media — createMedia controller
  // Required: title, videoUrl
  const handleSave = async () => {
    if (!form.title.trim()) return setFormErr("Title is required");
    if (!form.videoUrl.trim()) return setFormErr("Video URL is required");
    setSubmitting(true);
    setFormErr("");
    try {
      const payload = {
        ...form,
        releaseYear: Number(form.releaseYear),
        // Ensure arrays
        genres: form.genres,
        cast: form.cast,
      };
      if (editing) {
        // No PUT route in your backend — you'd need to add it
        // For now show error
        await apiFetch(`/media/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        // POST /api/v1/media
        await apiFetch("/media", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setShowModal(false);
      loadMedia();
      loadStats();
    } catch (e: any) {
      setFormErr(e.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE /api/v1/media/:id
  const handleDeleteMedia = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await apiFetch(`/media/${id}`, { method: "DELETE" });
      setMedia((p) => p.filter((m) => m.id !== id));
      loadStats();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // DELETE /api/v1/users/:id
  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    try {
      await apiFetch(`/users/${id}`, { method: "DELETE" });
      setUsers((p) => p.filter((u) => u.id !== id));
      loadStats();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // PATCH /api/v1/reviews/approve/:id — approveReview controller
  // This also recalculates avgRating on media ✅
  const handleApprove = async (reviewId: string) => {
    try {
      await apiFetch(`/reviews/approve/${reviewId}`, { method: "PATCH" });
      setReviews((p) =>
        p.map((r) => (r.id === reviewId ? { ...r, isApproved: true } : r)),
      );
    } catch (e: any) {
      alert(e.message || "Approve failed");
    }
  };

  // Tag helpers
  const addTag = (field: "genres" | "cast", val: string) => {
    const v = val.trim();
    if (!v) return;
    setForm((p) => ({ ...p, [field]: [...p[field], v] }));
    field === "genres" ? setGenreIn("") : setCastIn("");
  };
  const removeTag = (field: "genres" | "cast", i: number) =>
    setForm((p) => ({ ...p, [field]: p[field].filter((_, idx) => idx !== i) }));

  if (isPending) return <Spinner />;

  const NAV = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "media", icon: "🎬", label: "Media Library" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "reviews", icon: "📝", label: "Reviews" },
    { id: "reports", icon: "📈", label: "Reports" },
  ];

  const approvedReviews = reviews.filter((r) => r.isApproved);
  const pendingReviews = reviews.filter((r) => !r.isApproved);

  // Derived filtered lists
  const filteredMedia = media.filter(m => m.title.toLowerCase().includes(mediaSearch.toLowerCase()));
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const filteredReviews = reviews.filter(r => r.content.toLowerCase().includes(reviewSearch.toLowerCase()) || r.user?.name?.toLowerCase().includes(reviewSearch.toLowerCase()));

  // Paginated lists
  const pMedia = filteredMedia.slice((mediaPage - 1) * pageSize, mediaPage * pageSize);
  const pUsers = filteredUsers.slice((userPage - 1) * pageSize, userPage * pageSize);
  const pReviews = filteredReviews.slice((reviewPage - 1) * pageSize, reviewPage * pageSize);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
      }}
    >
      {/* ══ SIDEBAR ══ */}
      <aside
        style={{
          width: "230px",
          flexShrink: 0,
          background: "rgba(255,255,255,0.03)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          padding: "24px 14px",
          position: "fixed",
          top: 0,
          bottom: 0,
          overflowY: "auto",
          zIndex: 50,
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
            padding: "0 6px",
          }}
        >
          <span
            style={{
              background: "#e50914",
              color: "#fff",
              fontWeight: 900,
              fontSize: "1rem",
              padding: "3px 8px",
              borderRadius: "5px",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            CINE
          </span>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "0.95rem" }}>
            RATE
          </span>
          <span
            style={{
              background: "rgba(245,197,24,0.2)",
              color: "#f5c518",
              fontSize: "8px",
              fontWeight: 700,
              padding: "2px 5px",
              borderRadius: "4px",
              letterSpacing: "1px",
            }}
          >
            ADMIN
          </span>
        </Link>

        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id as any)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              padding: "10px 12px",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              marginBottom: "3px",
              textAlign: "left",
              fontFamily: "'DM Sans', sans-serif",
              background:
                tab === item.id ? "rgba(229,9,20,0.15)" : "transparent",
              color: tab === item.id ? "#e50914" : "#888",
              fontWeight: tab === item.id ? 700 : 400,
              fontSize: "0.88rem",
            }}
          >
            <span style={{ fontSize: "0.95rem" }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
          </button>
        ))}

        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "14px",
            right: "14px",
          }}
        >
          <p
            style={{
              color: "#333",
              fontSize: "0.75rem",
              padding: "0 6px",
              marginBottom: "4px",
            }}
          >
            {session?.user?.email}
          </p>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#444",
              textDecoration: "none",
              fontSize: "0.83rem",
              padding: "8px 12px",
            }}
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main style={{ flex: 1, marginLeft: "230px", padding: "32px 36px 80px" }}>
        {/* Page header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              fontSize: "1.7rem",
              fontWeight: 800,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {NAV.find((n) => n.id === tab)?.label}
          </h1>
          {tab === "media" && (
            <button
              onClick={openAdd}
              style={{
                background: "#e50914",
                color: "#fff",
                border: "none",
                borderRadius: "9px",
                padding: "10px 20px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.88rem",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              + Add Media
            </button>
          )}
          {tab !== "overview" && (
            <button
              onClick={() => {
                if (tab === "media") loadMedia();
                if (tab === "users") loadUsers();
                if (tab === "reviews") loadReviews();
              }}
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#888",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "8px 14px",
                cursor: "pointer",
                fontSize: "0.82rem",
                fontFamily: "'DM Sans', sans-serif",
                marginLeft: tab === "media" ? "10px" : 0,
              }}
            >
              ↻ Refresh
            </button>
          )}
        </div>

        {/* Error banner */}
        {fetchError && (
          <div
            style={{
              background: "rgba(229,9,20,0.1)",
              border: "1px solid rgba(229,9,20,0.3)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              color: "#ff6b6b",
              fontSize: "0.85rem",
            }}
          >
            ⚠️ {fetchError}
          </div>
        )}

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div>
            {/* Stats cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
                marginBottom: "32px",
              }}
            >
              {[
                {
                  label: "Total Users",
                  value: stats.totalUsers,
                  icon: "👥",
                  color: "#4ade80",
                },
                {
                  label: "Total Titles",
                  value: stats.totalMovies,
                  icon: "🎬",
                  color: "#e50914",
                },
                {
                  label: "Active Subscribers",
                  value: stats.activeSubscriptions,
                  icon: "⭐",
                  color: "#f5c518",
                },
                {
                  label: "Published Reviews",
                  value: approvedReviews.length,
                  icon: "📝",
                  color: "#60a5fa",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "14px",
                    padding: "20px",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
                    {s.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      color: s.color,
                      marginBottom: "4px",
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ color: "#555", fontSize: "0.82rem" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <DashboardCharts />

            {/* Quick actions */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                padding: "22px",
              }}
            >
              <p
                style={{
                  color: "#555",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "14px",
                  fontWeight: 700,
                }}
              >
                Quick Actions
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[
                  { label: "🎬 Add Movie/Series", t: "media", c: "#e50914" },
                  { label: "📝 Moderate Reviews", t: "reviews", c: "#f5c518" },
                  { label: "👥 View Users", t: "users", c: "#4ade80" },
                ].map(({ label, t, c }) => (
                  <button
                    key={t}
                    onClick={() => setTab(t as any)}
                    style={{
                      background: `${c}15`,
                      color: c,
                      border: `1px solid ${c}35`,
                      borderRadius: "9px",
                      padding: "9px 16px",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── REPORTS ── */}
        {tab === "reports" && (
          <div style={{ padding: "40px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px dashed rgba(255,255,255,0.1)" }}>
             <p style={{ fontSize: "3rem", marginBottom: "20px" }}>📈</p>
             <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: "10px" }}>Advanced Reports</h2>
             <p style={{ color: "#555", maxWidth: "400px", margin: "0 auto" }}>Detailed analytics and exportable CSV reports are currently being generated. Check back soon for deeper insights.</p>
          </div>
        )}

        {/* ── MEDIA ── */}
        {tab === "media" &&
          (loading ? (
            <Skel rows={5} />
          ) : media.length === 0 ? (
            <Empty
              icon="🎬"
              title="No titles yet"
              sub="Click '+ Add Title' to add your first movie or series"
            />
          ) : (
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                overflow: "auto",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <input
                  value={mediaSearch}
                  onChange={(e) => { setMediaSearch(e.target.value); setMediaPage(1); }}
                  placeholder="Search media..."
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px", padding: "8px 12px", color: "#fff", fontSize: "0.85rem", outline: "none",
                  }}
                />
                <div style={{ color: "#444", fontSize: "0.8rem", alignSelf: "center" }}>
                  {filteredMedia.length} titles
                </div>
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "680px",
                }}
              >
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {[
                      "",
                      "Title",
                      "Type",
                      "Genres",
                      "Year",
                      "Price",
                      "Rating",
                      "Actions",
                    ].map((h) => (
                      <TH key={h}>{h}</TH>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pMedia.map((m) => (
                    <tr
                      key={m.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {/* Poster */}
                      <td style={{ padding: "10px 12px", width: "48px" }}>
                        {m.posterUrl ? (
                          <img
                            src={m.posterUrl}
                            alt=""
                            style={{
                              width: "36px",
                              height: "54px",
                              objectFit: "cover",
                              borderRadius: "5px",
                              display: "block",
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "36px",
                              height: "54px",
                              background: "#1a1a1a",
                              borderRadius: "5px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.1rem",
                            }}
                          >
                            🎬
                          </div>
                        )}
                      </td>
                      {/* Title */}
                      <td style={{ padding: "10px 12px", maxWidth: "180px" }}>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: "0.88rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginBottom: "2px",
                          }}
                        >
                          {m.title}
                        </p>
                        <p style={{ color: "#444", fontSize: "0.72rem" }}>
                          {m._count?.reviews || 0} reviews
                        </p>
                      </td>
                      {/* Type */}
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            background:
                              m.type === "MOVIE"
                                ? "rgba(96,165,250,0.15)"
                                : "rgba(167,139,250,0.15)",
                            color: m.type === "MOVIE" ? "#60a5fa" : "#a78bfa",
                            padding: "2px 7px",
                            borderRadius: "5px",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                          }}
                        >
                          {m.type}
                        </span>
                      </td>
                      {/* Genres */}
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#666",
                          fontSize: "0.8rem",
                          maxWidth: "120px",
                        }}
                      >
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "block",
                          }}
                        >
                          {(m.genres || []).slice(0, 2).join(", ") || "—"}
                        </span>
                      </td>
                      {/* Year */}
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#666",
                          fontSize: "0.8rem",
                        }}
                      >
                        {m.releaseYear}
                      </td>
                      {/* Price */}
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            background:
                              m.priceType === "PREMIUM"
                                ? "rgba(245,197,24,0.15)"
                                : "rgba(74,222,128,0.12)",
                            color:
                              m.priceType === "PREMIUM" ? "#f5c518" : "#4ade80",
                            padding: "2px 7px",
                            borderRadius: "5px",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                          }}
                        >
                          {m.priceType}
                        </span>
                      </td>
                      {/* Rating */}
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#f5c518",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                        }}
                      >
                        {m.avgRating > 0
                          ? `★ ${Number(m.avgRating).toFixed(1)}`
                          : "—"}
                      </td>
                      {/* Actions */}
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <SBtn color="#60a5fa" onClick={() => openEdit(m)}>
                            Edit
                          </SBtn>
                          <SBtn
                            color="#e50914"
                            onClick={() => handleDeleteMedia(m.id, m.title)}
                          >
                            Delete
                          </SBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

        {/* ── USERS ── */}
        {tab === "users" &&
          (loading ? (
            <Skel rows={5} />
          ) : users.length === 0 ? (
            <Empty
              icon="👥"
              title="No users"
              sub="Users will appear after registration"
            />
          ) : (
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px",
                overflow: "auto",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <input
                  value={userSearch}
                  onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                  placeholder="Search users..."
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px", padding: "8px 12px", color: "#fff", fontSize: "0.85rem", outline: "none",
                  }}
                />
                <div style={{ color: "#444", fontSize: "0.8rem", alignSelf: "center" }}>
                  {filteredUsers.length} users
                </div>
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "600px",
                }}
              >
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {[
                      "User",
                      "Email",
                      "Role",
                      "Reviews",
                      "Subscribed",
                      "Joined",
                      "Actions",
                    ].map((h) => (
                      <TH key={h}>{h}</TH>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {/* Avatar + name */}
                      <td style={{ padding: "12px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "9px",
                          }}
                        >
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              flexShrink: 0,
                              background: "#e50914",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {u.image ? (
                              <img
                                src={u.image}
                                alt=""
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <span
                                style={{
                                  color: "#fff",
                                  fontWeight: 700,
                                  fontSize: "0.85rem",
                                }}
                              >
                                {u.name?.[0]?.toUpperCase() || "?"}
                              </span>
                            )}
                          </div>
                          <span
                            style={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            {u.name}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "#666",
                          fontSize: "0.8rem",
                        }}
                      >
                        {u.email}
                      </td>
                      {/* Role badge */}
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            background:
                              u.role === "ADMIN"
                                ? "rgba(245,197,24,0.15)"
                                : "rgba(255,255,255,0.06)",
                            color: u.role === "ADMIN" ? "#f5c518" : "#777",
                            padding: "2px 8px",
                            borderRadius: "5px",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      {/* Review count */}
                      <td
                        style={{
                          padding: "12px",
                          color: "#555",
                          fontSize: "0.8rem",
                        }}
                      >
                        {u._count?.reviews ?? "—"}
                      </td>
                      {/* Subscribed */}
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            color: u.isSubscribed ? "#4ade80" : "#444",
                            fontWeight: 600,
                            fontSize: "0.82rem",
                          }}
                        >
                          {u.isSubscribed ? "✓ Yes" : "—"}
                        </span>
                      </td>
                      {/* Joined */}
                      <td
                        style={{
                          padding: "12px",
                          color: "#444",
                          fontSize: "0.78rem",
                        }}
                      >
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      {/* Delete */}
                      <td style={{ padding: "12px" }}>
                        <SBtn
                          color="#e50914"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                        >
                          Delete
                        </SBtn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

        {/* ── REVIEWS ── */}
        {tab === "reviews" &&
          (loading ? (
            <Skel rows={4} />
          ) : reviews.length === 0 ? (
            <div>
              <Empty
                icon="📝"
                title="No reviews yet"
                sub="Reviews will appear here after users submit them"
              />
              <div
                style={{
                  background: "rgba(245,197,24,0.08)",
                  border: "1px solid rgba(245,197,24,0.2)",
                  borderRadius: "10px",
                  padding: "14px 18px",
                  marginTop: "20px",
                  fontSize: "0.85rem",
                  color: "#f5c518",
                }}
              >
                ⚠️ Note: To see pending reviews, add a route{" "}
                <code
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    padding: "1px 6px",
                    borderRadius: "4px",
                  }}
                >
                  GET /api/v1/reviews/all
                </code>{" "}
                that returns all reviews without the{" "}
                <code
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    padding: "1px 6px",
                    borderRadius: "4px",
                  }}
                >
                  isApproved: true
                </code>{" "}
                filter.
              </div>
            </div>
          ) : (
            <div>
              {/* Pending */}
              {pendingReviews.length > 0 && (
                <div style={{ marginBottom: "28px" }}>
                  <h3
                    style={{
                      color: "#f5c518",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      marginBottom: "12px",
                    }}
                  >
                    ⏳ Pending ({pendingReviews.length})
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {pendingReviews.map((r) => (
                      <ReviewRow
                        key={r.id}
                        r={r}
                        onApprove={() => handleApprove(r.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {/* Approved */}
              {approvedReviews.length > 0 && (
                <div>
                  <h3
                    style={{
                      color: "#4ade80",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      marginBottom: "12px",
                    }}
                  >
                    ✓ Published ({approvedReviews.length})
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {approvedReviews.map((r) => (
                      <ReviewRow key={r.id} r={r} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
      </main>

      {/* ══ MODAL ══ */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.88)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            style={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "18px",
              padding: "28px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "22px",
              }}
            >
              <h2
                style={{
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {editing ? "✏️ Edit Title" : "🎬 Add New Media"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#555",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {formErr && (
              <div
                style={{
                  background: "rgba(229,9,20,0.1)",
                  border: "1px solid rgba(229,9,20,0.3)",
                  borderRadius: "8px",
                  padding: "9px 13px",
                  marginBottom: "14px",
                  color: "#ff6b6b",
                  fontSize: "0.83rem",
                }}
              >
                ⚠️ {formErr}
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "13px",
              }}
            >
              <div style={{ gridColumn: "1/-1" }}>
                <FL>Movies or Series Name</FL>
                <FI
                  value={form.title}
                  onChange={(v) => setForm((p) => ({ ...p, title: v }))}
                  placeholder="Movie or series title"
                />
              </div>

              <div>
                <FL>Type</FL>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, type: e.target.value as any }))
                  }
                  style={SS}
                >
                  <option value="MOVIE">Movie</option>
                  <option value="SERIES">Series</option>
                </select>
              </div>

              <div>
                <FL>Price Type</FL>
                <select
                  value={form.priceType}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, priceType: e.target.value as any }))
                  }
                  style={SS}
                >
                  <option value="FREE">Free</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>

              <div>
                <FL>Release Year</FL>
                <FI
                  type="number"
                  value={String(form.releaseYear)}
                  onChange={(v) =>
                    setForm((p) => ({ ...p, releaseYear: Number(v) }))
                  }
                  placeholder="2024"
                />
              </div>

              <div>
                <FL>Director</FL>
                <FI
                  value={form.director}
                  onChange={(v) => setForm((p) => ({ ...p, director: v }))}
                  placeholder="Director name"
                />
              </div>

              <div style={{ gridColumn: "1/-1" }}>
                <FL>Poster URL</FL>
                <FI
                  value={form.posterUrl}
                  onChange={(v) => setForm((p) => ({ ...p, posterUrl: v }))}
                  placeholder="https://image.tmdb.org/..."
                />
                {form.posterUrl && (
                  <img
                    src={form.posterUrl}
                    alt="preview"
                    style={{
                      width: "40px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      marginTop: "7px",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>

              <div style={{ gridColumn: "1/-1" }}>
                <FL>Video URL </FL>
                <FI
                  value={form.videoUrl}
                  onChange={(v) => setForm((p) => ({ ...p, videoUrl: v }))}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div style={{ gridColumn: "1/-1" }}>
                <FL>Description </FL>
                <textarea
                  value={form.synopsis}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, synopsis: e.target.value }))
                  }
                  rows={3}
                  placeholder="Brief description..."
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "9px 12px",
                    color: "#fff",
                    fontSize: "0.87rem",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "'DM Sans', sans-serif",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ gridColumn: "1/-1" }}>
                <FL>Genres </FL>
                <TagList
                  tags={form.genres}
                  onRemove={(i) => removeTag("genres", i)}
                />
                <TagRow
                  val={genreIn}
                  onChange={setGenreIn}
                  onAdd={() => addTag("genres", genreIn)}
                  ph="e.g. Action (press Enter)"
                />
              </div>

              <div style={{ gridColumn: "1/-1" }}>
                <FL>Cast</FL>
                <TagList
                  tags={form.cast}
                  onRemove={(i) => removeTag("cast", i)}
                />
                <TagRow
                  val={castIn}
                  onChange={setCastIn}
                  onAdd={() => addTag("cast", castIn)}
                  ph="e.g. Tom Hanks (press Enter)"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={handleSave}
                disabled={submitting}
                style={{
                  flex: 1,
                  background: submitting ? "#1a1a1a" : "#e50914",
                  color: submitting ? "#444" : "#fff",
                  border: "none",
                  borderRadius: "9px",
                  padding: "12px",
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.9rem",
                }}
              >
                {submitting
                  ? "Saving..."
                  : editing
                    ? "Save Changes"
                    : "Add Title"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "12px 20px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "9px",
                  color: "#777",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ReviewRow({ r, onApprove }: { r: Review; onApprove?: () => void }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${!r.isApproved ? "rgba(245,197,24,0.18)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <div>
          <p
            style={{
              fontWeight: 700,
              fontSize: "0.88rem",
              marginBottom: "2px",
            }}
          >
            <span style={{ color: "#e50914" }}>{r.user?.name || "User"}</span>
            <span style={{ color: "#444" }}> → </span>
            <span style={{ color: "#ccc" }}>
              {r.media?.title || "Unknown title"}
            </span>
          </p>
          <p style={{ color: "#444", fontSize: "0.72rem" }}>
            {new Date(r.createdAt).toLocaleDateString()}
            {r.hasSpoiler && " · ⚠️ Spoiler"}
            {r.tags?.length > 0 &&
              ` · ${r.tags
                .slice(0, 2)
                .map((t: string) => `#${t}`)
                .join(" ")}`}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{ color: "#f5c518", fontWeight: 700, fontSize: "0.88rem" }}
          >
            ★ {r.rating}/10
          </span>
          <span
            style={{
              background: r.isApproved
                ? "rgba(74,222,128,0.15)"
                : "rgba(245,197,24,0.15)",
              color: r.isApproved ? "#4ade80" : "#f5c518",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "0.7rem",
              fontWeight: 700,
            }}
          >
            {r.isApproved ? "PUBLISHED" : "PENDING"}
          </span>
        </div>
      </div>
      <p
        style={{
          color: "#999",
          lineHeight: 1.6,
          fontSize: "0.85rem",
          marginBottom: onApprove ? "12px" : 0,
        }}
      >
        {r.content}
      </p>
      {onApprove && (
        <button
          onClick={onApprove}
          style={{
            background: "rgba(74,222,128,0.15)",
            color: "#4ade80",
            border: "1px solid rgba(74,222,128,0.25)",
            borderRadius: "7px",
            padding: "6px 14px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.8rem",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          ✓ Approve & Publish
        </button>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      Loading...
    </div>
  );
}

function Skel({ rows }: { rows: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height: "58px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "10px",
          }}
        />
      ))}
    </div>
  );
}

function Empty({
  icon,
  title,
  sub,
}: {
  icon: string;
  title: string;
  sub: string;
}) {
  return (
    <div style={{ textAlign: "center", padding: "70px 20px" }}>
      <p style={{ fontSize: "2.5rem", marginBottom: "12px" }}>{icon}</p>
      <p style={{ fontWeight: 700, color: "#555", marginBottom: "6px" }}>
        {title}
      </p>
      <p style={{ color: "#333", fontSize: "0.85rem" }}>{sub}</p>
    </div>
  );
}

function TH({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        padding: "11px 12px",
        textAlign: "left",
        color: "#444",
        fontSize: "0.7rem",
        textTransform: "uppercase",
        letterSpacing: "1px",
        fontWeight: 600,
      }}
    >
      {children}
    </th>
  );
}

function SBtn({
  color,
  onClick,
  children,
}: {
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}35`,
        borderRadius: "6px",
        padding: "4px 10px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "0.76rem",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {children}
    </button>
  );
}

function FL({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        color: "#555",
        fontSize: "0.76rem",
        fontWeight: 600,
        marginBottom: "5px",
      }}
    >
      {children}
    </p>
  );
}

function FI({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "7px",
        padding: "9px 12px",
        color: "#fff",
        fontSize: "0.86rem",
        outline: "none",
        boxSizing: "border-box",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onFocus={(e) => (e.target.style.borderColor = "rgba(229,9,20,0.5)")}
      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
    />
  );
}

function TagList({
  tags,
  onRemove,
}: {
  tags: string[];
  onRemove: (i: number) => void;
}) {
  if (!tags.length) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: "5px",
        flexWrap: "wrap",
        marginBottom: "7px",
      }}
    >
      {tags.map((t, i) => (
        <span
          key={i}
          style={{
            background: "rgba(229,9,20,0.12)",
            color: "#e50914",
            border: "1px solid rgba(229,9,20,0.25)",
            borderRadius: "14px",
            padding: "2px 8px",
            fontSize: "0.76rem",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {t}
          <button
            onClick={() => onRemove(i)}
            style={{
              background: "none",
              border: "none",
              color: "#e50914",
              cursor: "pointer",
              padding: 0,
              fontSize: "0.85rem",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}

function TagRow({
  val,
  onChange,
  onAdd,
  ph,
}: {
  val: string;
  onChange: (v: string) => void;
  onAdd: () => void;
  ph: string;
}) {
  return (
    <div style={{ display: "flex", gap: "7px" }}>
      <input
        value={val}
        onChange={(e) => onChange(e.target.value)}
        placeholder={ph}
        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onAdd())}
        style={{
          flex: 1,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "7px",
          padding: "7px 11px",
          color: "#fff",
          fontSize: "0.82rem",
          outline: "none",
          fontFamily: "'DM Sans', sans-serif",
        }}
      />
      <button
        onClick={onAdd}
        style={{
          background: "rgba(229,9,20,0.12)",
          color: "#e50914",
          border: "1px solid rgba(229,9,20,0.25)",
          borderRadius: "7px",
          padding: "7px 12px",
          cursor: "pointer",
          fontWeight: 700,
          fontSize: "0.8rem",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Add
      </button>
    </div>
  );
}

const SS: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "7px",
  padding: "9px 12px",
  color: "#fff",
  fontSize: "0.86rem",
  outline: "none",
  cursor: "pointer",
  fontFamily: "'DM Sans', sans-serif",
};

function DashboardCharts() {
  const data = [
    { label: "Jan", users: 40, rev: 2400 },
    { label: "Feb", users: 55, rev: 3100 },
    { label: "Mar", users: 70, rev: 4500 },
    { label: "Apr", users: 65, rev: 3800 },
    { label: "May", users: 90, rev: 5900 },
    { label: "Jun", users: 120, rev: 7200 },
  ];
  const maxUsers = Math.max(...data.map((d) => d.users));
  const maxRev = Math.max(...data.map((d) => d.rev));
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        marginTop: "32px",
        marginBottom: "32px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "14px",
          padding: "20px",
        }}
      >
        <p
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#aaa",
            marginBottom: "20px",
            textTransform: "uppercase",
          }}
        >
          User Growth
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "10px",
            height: "150px",
          }}
        >
          {data.map((d) => (
            <div
              key={d.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  background: "#e50914",
                  borderRadius: "4px 4px 0 0",
                  height: `${(d.users / maxUsers) * 100}%`,
                  transition: "all 0.5s",
                }}
              />
              <span style={{ fontSize: "0.65rem", color: "#444" }}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "14px",
          padding: "20px",
        }}
      >
        <p
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#aaa",
            marginBottom: "20px",
            textTransform: "uppercase",
          }}
        >
          Revenue Trends
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "10px",
            height: "150px",
          }}
        >
          {data.map((d) => (
            <div
              key={d.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  background: "#f5c518",
                  borderRadius: "4px 4px 0 0",
                  height: `${(d.rev / maxRev) * 100}%`,
                  transition: "all 0.5s",
                }}
              />
              <span style={{ fontSize: "0.65rem", color: "#444" }}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Paginate({
  total,
  current,
  size,
  set,
}: {
  total: number;
  current: number;
  size: number;
  set: (p: number) => void;
}) {
  const pages = Math.ceil(total / size);
  if (pages <= 1) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        padding: "16px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        justifyContent: "center",
      }}
    >
      {Array.from({ length: pages }).map((_, i) => (
        <button
          key={i}
          onClick={() => set(i + 1)}
          style={{
            background: current === i + 1 ? "#e50914" : "rgba(255,255,255,0.05)",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
