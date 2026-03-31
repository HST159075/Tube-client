"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

// ─── Types ────────────────────────────────────────────────────────────────────
type Media = {
  id: string;
  title: string;
  type: "MOVIE" | "SERIES";
  genre: string[];
  releaseYear: number;
  director: string;
  cast: string[];
  platform: string[];
  price: string;
  poster?: string;
  synopsis?: string;
  streamingLink?: string;
  avgRating?: number;
  _count?: { reviews: number };
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  image?: string;
};

type Review = {
  id: string;
  rating: number;
  review: string;
  spoiler: boolean;
  status: string;
  createdAt: string;
  user?: { name: string; email: string };
  media?: { title: string };
};

type Stats = {
  totalUsers: number;
  totalMedia: number;
  totalReviews: number;
  pendingReviews: number;
  totalRevenue?: number;
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

const EMPTY_MEDIA = {
  title: "", type: "MOVIE" as "MOVIE" | "SERIES", synopsis: "",
  genre: [] as string[], releaseYear: new Date().getFullYear(),
  director: "", cast: [] as string[], platform: [] as string[],
  price: "free", poster: "", streamingLink: "",
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState<"overview" | "media" | "users" | "reviews">("overview");

  // Stats
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalMedia: 0, totalReviews: 0, pendingReviews: 0 });

  // Media
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [mediaForm, setMediaForm] = useState(EMPTY_MEDIA);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [castInput, setCastInput] = useState("");
  const [platformInput, setPlatformInput] = useState("");

  // Users
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // ── Auth guard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPending && session && (session.user as any)?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, isPending, router]);

  // ── Fetch stats on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    // GET /api/v1/users/admin/stats
    apiFetch("/users/admin/stats")
      .then(d => {
        const s = d.data || d;
        setStats({
          totalUsers: s.totalUsers || 0,
          totalMedia: s.totalMedia || 0,
          totalReviews: s.totalReviews || 0,
          pendingReviews: s.pendingReviews || 0,
          totalRevenue: s.totalRevenue,
        });
      })
      .catch(() => {
        // fallback: fetch individually
        apiFetch("/media").then(d => {
          const list = d.data || d.media || d || [];
          setStats(s => ({ ...s, totalMedia: Array.isArray(list) ? list.length : 0 }));
        }).catch(() => {});
        apiFetch("/users/admin/all-users").then(d => {
          const list = d.data || d.users || d || [];
          setStats(s => ({ ...s, totalUsers: Array.isArray(list) ? list.length : 0 }));
        }).catch(() => {});
      });
  }, []);

  // ── Fetch per tab ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === "media") fetchMedia();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "reviews") fetchReviews();
  }, [activeTab]);

  // GET /api/v1/media
  const fetchMedia = async () => {
    setMediaLoading(true);
    try {
      const d = await apiFetch("/media");
      setMediaList(d.data || d.media || d || []);
    } catch { } finally { setMediaLoading(false); }
  };

  // GET /api/v1/users/admin/all-users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const d = await apiFetch("/users/admin/all-users");
      setUsers(d.data || d.users || d || []);
    } catch { } finally { setUsersLoading(false); }
  };

  // GET /api/v1/reviews
  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const d = await apiFetch("/reviews");
      setReviews(d.data || d.reviews || d || []);
    } catch { } finally { setReviewsLoading(false); }
  };

  // ── Media CRUD ───────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingMedia(null);
    setMediaForm(EMPTY_MEDIA);
    setGenreInput(""); setCastInput(""); setPlatformInput("");
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (m: Media) => {
    setEditingMedia(m);
    setMediaForm({
      title: m.title, type: m.type,
      synopsis: m.synopsis || "", genre: m.genre || [],
      releaseYear: m.releaseYear, director: m.director || "",
      cast: m.cast || [], platform: m.platform || [],
      price: m.price || "free", poster: m.poster || "",
      streamingLink: m.streamingLink || "",
    });
    setGenreInput(""); setCastInput(""); setPlatformInput("");
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!mediaForm.title.trim()) return setFormError("Title is required");
    setSubmitting(true); setFormError("");
    try {
      if (editingMedia) {
        // PUT /api/v1/media/:id  (if you have it, otherwise adjust)
        await apiFetch(`/media/${editingMedia.id}`, {
          method: "PUT", body: JSON.stringify(mediaForm),
        });
      } else {
        // POST /api/v1/media
        await apiFetch("/media", { method: "POST", body: JSON.stringify(mediaForm) });
      }
      setShowModal(false);
      fetchMedia();
      // update stats
      setStats(s => ({ ...s, totalMedia: editingMedia ? s.totalMedia : s.totalMedia + 1 }));
    } catch (e: any) {
      setFormError(e.message || "Failed to save. Check your backend.");
    } finally { setSubmitting(false); }
  };

  // DELETE /api/v1/media/:id
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await apiFetch(`/media/${id}`, { method: "DELETE" });
      setMediaList(p => p.filter(m => m.id !== id));
      setStats(s => ({ ...s, totalMedia: Math.max(0, s.totalMedia - 1) }));
    } catch (e: any) { alert(e.message); }
  };

  // DELETE /api/v1/users/:id
  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    try {
      await apiFetch(`/users/${id}`, { method: "DELETE" });
      setUsers(p => p.filter(u => u.id !== id));
      setStats(s => ({ ...s, totalUsers: Math.max(0, s.totalUsers - 1) }));
    } catch (e: any) { alert(e.message); }
  };

  // Review actions — adjust route to match your review.routes.ts
  const handleReviewAction = async (id: string, action: "approve" | "reject") => {
    try {
      await apiFetch(`/reviews/${id}/${action}`, { method: "PATCH" });
      setReviews(p => p.map(r => r.id === id
        ? { ...r, status: action === "approve" ? "PUBLISHED" : "REJECTED" } : r));
      setStats(s => ({ ...s, pendingReviews: Math.max(0, s.pendingReviews - 1) }));
    } catch (e: any) { alert(e.message || "Action failed — check review route"); }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await apiFetch(`/reviews/${id}`, { method: "DELETE" });
      setReviews(p => p.filter(r => r.id !== id));
    } catch (e: any) { alert(e.message); }
  };

  // ── Tag helpers ──────────────────────────────────────────────────────────────
  const addTag = (field: "genre" | "cast" | "platform", val: string) => {
    const v = val.trim();
    if (!v) return;
    setMediaForm(p => ({ ...p, [field]: [...p[field], v] }));
    if (field === "genre") setGenreInput("");
    if (field === "cast") setCastInput("");
    if (field === "platform") setPlatformInput("");
  };
  const removeTag = (field: "genre" | "cast" | "platform", i: number) =>
    setMediaForm(p => ({ ...p, [field]: p[field].filter((_, idx) => idx !== i) }));

  if (isPending) return <Spinner />;

  const NAV_ITEMS = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "media",    icon: "🎬", label: "Media Library" },
    { id: "users",    icon: "👥", label: "Users" },
    { id: "reviews",  icon: "📝", label: "Reviews", badge: stats.pendingReviews },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>

      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════════ */}
      <aside style={{ width: "240px", flexShrink: 0, background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.07)", padding: "28px 16px", position: "fixed", top: 0, bottom: 0, overflowY: "auto", zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", marginBottom: "36px", padding: "0 8px" }}>
          <span style={{ background: "#e50914", color: "#fff", fontWeight: 900, fontSize: "1.1rem", padding: "4px 8px", borderRadius: "6px", fontFamily: "'Playfair Display', serif" }}>CINE</span>
          <span style={{ color: "#fff", fontWeight: 800 }}>RATE</span>
          <span style={{ background: "rgba(245,197,24,0.2)", color: "#f5c518", fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", letterSpacing: "1px" }}>ADMIN</span>
        </Link>

        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id as any)}
            style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "11px 14px", borderRadius: "10px", border: "none", cursor: "pointer", marginBottom: "4px", textAlign: "left", fontFamily: "'DM Sans', sans-serif", background: activeTab === item.id ? "rgba(229,9,20,0.15)" : "transparent", color: activeTab === item.id ? "#e50914" : "#aaa", fontWeight: activeTab === item.id ? 700 : 400, fontSize: "0.92rem" }}>
            <span>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge ? <span style={{ background: "#e50914", color: "#fff", borderRadius: "12px", padding: "1px 7px", fontSize: "11px", fontWeight: 700 }}>{item.badge}</span> : null}
          </button>
        ))}

        <div style={{ position: "absolute", bottom: "24px", left: "16px", right: "16px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#555", textDecoration: "none", fontSize: "0.88rem", padding: "10px 14px" }}>
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* ══ MAIN ═════════════════════════════════════════════════════════════════ */}
      <main style={{ flex: 1, marginLeft: "240px", padding: "36px 40px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "'Playfair Display', serif", marginBottom: "4px" }}>
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </h1>
            <p style={{ color: "#555", fontSize: "0.85rem" }}>
              {session?.user?.email}
            </p>
          </div>
          {activeTab === "media" && (
            <button onClick={openAdd} style={{ background: "#e50914", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 24px", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem", fontFamily: "'DM Sans', sans-serif" }}>
              + Add Title
            </button>
          )}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "36px" }}>
              {[
                { label: "Total Titles",    value: stats.totalMedia,    icon: "🎬", color: "#e50914" },
                { label: "Total Users",     value: stats.totalUsers,    icon: "👥", color: "#4ade80" },
                { label: "Pending Reviews", value: stats.pendingReviews,icon: "⏳", color: "#f5c518" },
                { label: "Total Reviews",   value: stats.totalReviews,  icon: "📝", color: "#60a5fa" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
                  <span style={{ fontSize: "1.8rem" }}>{s.icon}</span>
                  <p style={{ fontSize: "2.2rem", fontWeight: 900, color: s.color, margin: "8px 0 4px" }}>{s.value}</p>
                  <p style={{ color: "#666", fontSize: "0.88rem" }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px" }}>
              <h2 style={{ fontWeight: 700, marginBottom: "16px", fontSize: "1rem", color: "#aaa" }}>Quick Actions</h2>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {[
                  { label: "🎬 Add Movie/Series", tab: "media",   color: "#e50914" },
                  { label: "📝 Moderate Reviews", tab: "reviews", color: "#f5c518" },
                  { label: "👥 Manage Users",     tab: "users",   color: "#4ade80" },
                ].map(({ label, tab, color }) => (
                  <button key={tab} onClick={() => setActiveTab(tab as any)}
                    style={{ background: `${color}15`, color, border: `1px solid ${color}40`, borderRadius: "10px", padding: "10px 20px", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── MEDIA ── */}
        {activeTab === "media" && (
          <>
            {mediaLoading ? <SkeletonRows /> : mediaList.length === 0 ? (
              <Empty icon="🎬" title="No titles yet" sub="Click '+ Add Title' to add your first movie or series" />
            ) : (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      {["Poster", "Title", "Type", "Genre", "Year", "Price", "Rating", "Actions"].map(h => (
                        <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#555", fontSize: "0.73rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mediaList.map(m => (
                      <tr key={m.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "12px 16px" }}>
                          {m.poster
                            ? <img src={m.poster} alt="" style={{ width: "38px", height: "57px", objectFit: "cover", borderRadius: "6px" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            : <div style={{ width: "38px", height: "57px", background: "#1a1a1a", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🎬</div>
                          }
                        </td>
                        <td style={{ padding: "12px 16px", maxWidth: "200px" }}>
                          <p style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title}</p>
                          <p style={{ color: "#555", fontSize: "0.75rem", marginTop: "2px" }}>{m._count?.reviews || 0} reviews</p>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: m.type === "MOVIE" ? "rgba(96,165,250,0.15)" : "rgba(167,139,250,0.15)", color: m.type === "MOVIE" ? "#60a5fa" : "#a78bfa", padding: "3px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                            {m.type}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#888", fontSize: "0.85rem" }}>{(m.genre || []).slice(0, 2).join(", ")}</td>
                        <td style={{ padding: "12px 16px", color: "#888", fontSize: "0.85rem" }}>{m.releaseYear}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: m.price === "premium" ? "rgba(245,197,24,0.15)" : "rgba(74,222,128,0.15)", color: m.price === "premium" ? "#f5c518" : "#4ade80", padding: "3px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                            {(m.price || "free").toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#f5c518", fontWeight: 700, fontSize: "0.85rem" }}>
                          {m.avgRating ? `★ ${Number(m.avgRating).toFixed(1)}` : "—"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <Btn color="#60a5fa" onClick={() => openEdit(m)}>Edit</Btn>
                            <Btn color="#e50914" onClick={() => handleDelete(m.id, m.title)}>Delete</Btn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── USERS ── */}
        {activeTab === "users" && (
          <>
            {usersLoading ? <SkeletonRows /> : users.length === 0 ? (
              <Empty icon="👥" title="No users found" sub="Users appear here after they register" />
            ) : (
              <>
                <p style={{ color: "#555", fontSize: "0.88rem", marginBottom: "16px" }}>
                  <strong style={{ color: "#888" }}>{users.length}</strong> total users
                </p>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        {["User", "Email", "Role", "Status", "Joined", "Actions"].map(h => (
                          <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#555", fontSize: "0.73rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              {u.image
                                ? <img src={u.image} alt="" style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                : <div style={{ width: "34px", height: "34px", background: "#e50914", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>
                                    {u.name?.[0]?.toUpperCase() || "?"}
                                  </div>
                              }
                              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{u.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px", color: "#888", fontSize: "0.83rem" }}>{u.email}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ background: u.role === "ADMIN" ? "rgba(245,197,24,0.15)" : "rgba(255,255,255,0.06)", color: u.role === "ADMIN" ? "#f5c518" : "#aaa", padding: "3px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 700 }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ background: u.status === "ACTIVE" ? "rgba(74,222,128,0.1)" : "rgba(229,9,20,0.1)", color: u.status === "ACTIVE" ? "#4ade80" : "#e50914", padding: "3px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 700 }}>
                              {u.status || "ACTIVE"}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px", color: "#555", fontSize: "0.82rem" }}>
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <Btn color="#e50914" onClick={() => handleDeleteUser(u.id, u.name)}>Delete</Btn>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}

        {/* ── REVIEWS ── */}
        {activeTab === "reviews" && (
          <>
            {reviewsLoading ? <SkeletonRows /> : reviews.length === 0 ? (
              <Empty icon="📝" title="No reviews yet" sub="User reviews will appear here" />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${!r.status || r.status === "PENDING" ? "rgba(245,197,24,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: "14px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                      <div>
                        <p style={{ fontWeight: 700, marginBottom: "3px" }}>
                          <span style={{ color: "#e50914" }}>{r.user?.name || "Unknown user"}</span>
                          <span style={{ color: "#555", fontWeight: 400 }}> reviewed </span>
                          <span>{r.media?.title || "Unknown title"}</span>
                        </p>
                        <p style={{ color: "#555", fontSize: "0.78rem" }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                          {r.spoiler && " · ⚠️ Spoiler"}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "#f5c518", fontWeight: 700 }}>★ {r.rating}/10</span>
                        <StatusBadge status={r.status} />
                      </div>
                    </div>

                    <p style={{ color: "#ccc", lineHeight: 1.65, marginBottom: "14px", fontSize: "0.9rem" }}>{r.review}</p>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {(!r.status || r.status === "PENDING") && (
                        <>
                          <button onClick={() => handleReviewAction(r.id, "approve")}
                            style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "8px", padding: "7px 18px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
                            ✓ Approve
                          </button>
                          <button onClick={() => handleReviewAction(r.id, "reject")}
                            style={{ background: "rgba(229,9,20,0.1)", color: "#e50914", border: "1px solid rgba(229,9,20,0.3)", borderRadius: "8px", padding: "7px 18px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
                            ✕ Reject
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDeleteReview(r.id)}
                        style={{ background: "transparent", color: "#555", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "7px 16px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* ══ MEDIA MODAL ══════════════════════════════════════════════════════════ */}
      {showModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "640px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.3rem", fontFamily: "'Playfair Display', serif" }}>
                {editingMedia ? "✏️ Edit Title" : "🎬 Add New Title"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", color: "#555", fontSize: "1.6rem", cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>

            {formError && (
              <div style={{ background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#ff6b6b", fontSize: "0.88rem" }}>
                ⚠️ {formError}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

              <div style={{ gridColumn: "1 / -1" }}>
                <FLabel>Title *</FLabel>
                <FInput value={mediaForm.title} onChange={v => setMediaForm(p => ({ ...p, title: v }))} placeholder="Movie or Series title" />
              </div>

              <div>
                <FLabel>Type</FLabel>
                <select value={mediaForm.type} onChange={e => setMediaForm(p => ({ ...p, type: e.target.value as any }))} style={selStyle}>
                  <option value="MOVIE">Movie</option>
                  <option value="SERIES">Series</option>
                </select>
              </div>

              <div>
                <FLabel>Price</FLabel>
                <select value={mediaForm.price} onChange={e => setMediaForm(p => ({ ...p, price: e.target.value }))} style={selStyle}>
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div>
                <FLabel>Release Year</FLabel>
                <FInput type="number" value={String(mediaForm.releaseYear)} onChange={v => setMediaForm(p => ({ ...p, releaseYear: Number(v) }))} placeholder="2024" />
              </div>

              <div>
                <FLabel>Director</FLabel>
                <FInput value={mediaForm.director} onChange={v => setMediaForm(p => ({ ...p, director: v }))} placeholder="Christopher Nolan" />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <FLabel>Poster URL</FLabel>
                <FInput value={mediaForm.poster} onChange={v => setMediaForm(p => ({ ...p, poster: v }))} placeholder="https://image.tmdb.org/t/p/w500/..." />
                {mediaForm.poster && (
                  <img src={mediaForm.poster} alt="preview" style={{ width: "48px", height: "72px", objectFit: "cover", borderRadius: "6px", marginTop: "8px" }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <FLabel>YouTube / Streaming Link</FLabel>
                <FInput value={mediaForm.streamingLink} onChange={v => setMediaForm(p => ({ ...p, streamingLink: v }))} placeholder="https://youtube.com/watch?v=..." />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <FLabel>Synopsis</FLabel>
                <textarea value={mediaForm.synopsis} onChange={e => setMediaForm(p => ({ ...p, synopsis: e.target.value }))}
                  placeholder="Brief description..." rows={3}
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "0.9rem", outline: "none", resize: "vertical", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
              </div>

              {/* Genre */}
              <div style={{ gridColumn: "1 / -1" }}>
                <FLabel>Genres</FLabel>
                <TagList tags={mediaForm.genre} onRemove={i => removeTag("genre", i)} />
                <TagRow value={genreInput} onChange={setGenreInput} onAdd={() => addTag("genre", genreInput)} placeholder="Action, Drama... (Enter)" />
              </div>

              {/* Cast */}
              <div style={{ gridColumn: "1 / -1" }}>
                <FLabel>Cast</FLabel>
                <TagList tags={mediaForm.cast} onRemove={i => removeTag("cast", i)} />
                <TagRow value={castInput} onChange={setCastInput} onAdd={() => addTag("cast", castInput)} placeholder="Tom Hanks... (Enter)" />
              </div>

              {/* Platform */}
              <div style={{ gridColumn: "1 / -1" }}>
                <FLabel>Platforms</FLabel>
                <TagList tags={mediaForm.platform} onRemove={i => removeTag("platform", i)} />
                <TagRow value={platformInput} onChange={setPlatformInput} onAdd={() => addTag("platform", platformInput)} placeholder="Netflix, Disney+... (Enter)" />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button onClick={handleSubmit} disabled={submitting}
                style={{ flex: 1, background: submitting ? "#333" : "#e50914", color: submitting ? "#888" : "#fff", border: "none", borderRadius: "10px", padding: "13px", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", fontSize: "0.95rem", fontFamily: "'DM Sans', sans-serif" }}>
                {submitting ? "Saving..." : editingMedia ? "Save Changes" : "Add Title"}
              </button>
              <button onClick={() => setShowModal(false)}
                style={{ padding: "13px 24px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#aaa", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Small components ─────────────────────────────────────────────────────────
function Spinner() {
  return <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontFamily: "'DM Sans', sans-serif" }}>Loading...</div>;
}

function SkeletonRows() {
  return <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    {[1,2,3,4].map(i => <div key={i} style={{ height: "64px", background: "rgba(255,255,255,0.04)", borderRadius: "10px" }} />)}
  </div>;
}

function Empty({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return <div style={{ textAlign: "center", padding: "80px 20px" }}>
    <p style={{ fontSize: "3rem", marginBottom: "12px" }}>{icon}</p>
    <p style={{ fontWeight: 700, color: "#888", marginBottom: "8px" }}>{title}</p>
    <p style={{ color: "#444", fontSize: "0.9rem" }}>{sub}</p>
  </div>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    PUBLISHED: { bg: "rgba(74,222,128,0.15)",  color: "#4ade80" },
    REJECTED:  { bg: "rgba(229,9,20,0.15)",    color: "#e50914" },
    PENDING:   { bg: "rgba(245,197,24,0.15)",  color: "#f5c518" },
  };
  const s = map[status] || map.PENDING;
  return <span style={{ ...s, padding: "3px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700 }}>{status || "PENDING"}</span>;
}

function Btn({ color, onClick, children }: { color: string; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} style={{ background: `${color}20`, color, border: `1px solid ${color}40`, borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif" }}>{children}</button>;
}

function FLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ color: "#777", fontSize: "0.8rem", marginBottom: "6px", fontWeight: 600 }}>{children}</p>;
}

function FInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }}
    onFocus={e => e.target.style.borderColor = "rgba(229,9,20,0.5)"}
    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
  />;
}

function TagList({ tags, onRemove }: { tags: string[]; onRemove: (i: number) => void }) {
  if (!tags.length) return null;
  return <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
    {tags.map((t, i) => (
      <span key={i} style={{ background: "rgba(229,9,20,0.15)", color: "#e50914", border: "1px solid rgba(229,9,20,0.3)", borderRadius: "20px", padding: "3px 10px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "5px" }}>
        {t}
        <button onClick={() => onRemove(i)} style={{ background: "transparent", border: "none", color: "#e50914", cursor: "pointer", fontSize: "0.9rem", lineHeight: 1, padding: 0 }}>×</button>
      </span>
    ))}
  </div>;
}

function TagRow({ value, onChange, onAdd, placeholder }: { value: string; onChange: (v: string) => void; onAdd: () => void; placeholder: string }) {
  return <div style={{ display: "flex", gap: "8px" }}>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), onAdd())}
      style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 12px", color: "#fff", fontSize: "0.85rem", outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
    <button onClick={onAdd} style={{ background: "rgba(229,9,20,0.15)", color: "#e50914", border: "1px solid rgba(229,9,20,0.3)", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>Add</button>
  </div>;
}

const selStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "0.9rem",
  outline: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
};
