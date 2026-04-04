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
  const [activeTab, setActiveTab] = useState<"profile" | "watchlist" | "reviews">("profile");
  const [tabLoading, setTabLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL!;

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

  const fetchWatchlist = async () => {
    setTabLoading(true);
    try {
      const res = await fetch(`${API}/watchlist`, { credentials: "include" });
      const d = await res.json();
      setWatchlist(d.data || d.watchlist || (Array.isArray(d) ? d : []));
    } catch { setWatchlist([]); }
    finally { setTabLoading(false); }
  };

  const fetchMyReviews = async () => {
    setTabLoading(true);
    try {
      const res = await fetch(`${API}/users/me`, { credentials: "include" });
      const d = await res.json();
      const userData = d.data || d;
      if (userData?.reviews) { setMyReviews(userData.reviews); return; }
      setMyReviews([]);
    } catch { setMyReviews([]); }
    finally { setTabLoading(false); }
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
    setSaving(true); setError(""); setSuccess("");
    try {
      await updateUser({ name: name.trim() });
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("name", name.trim());
        await fetch(`${API}/users/update`, { method: "PATCH", credentials: "include", body: formData });
      }
      await (refetch as any)?.();
      setSuccess("Profile updated successfully!");
      setImageFile(null);
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Failed to update profile");
    } finally { setSaving(false); }
  };

  const handleRemoveWatchlist = async (mediaId: string) => {
    try {
      await fetch(`${API}/watchlist/${mediaId}`, { method: "DELETE", credentials: "include" });
      setWatchlist(p => p.filter((w: any) => (w.mediaId || w.media?.id || w.id) !== mediaId));
    } catch {}
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await fetch(`${API}/reviews/${reviewId}`, { method: "DELETE", credentials: "include" });
      setMyReviews(p => p.filter((r: any) => r.id !== reviewId));
    } catch {}
  };

  if (isPending) return <PageLoader />;
  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── HERO BANNER ── */}
      <div style={{ position: "relative", height: "240px", background: "linear-gradient(135deg, #1a0005 0%, #0d0d1a 50%, #0a0a0a 100%)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 50%, rgba(229,9,20,0.15), transparent 70%)" }} />
        {isAdmin && (
          <div style={{ position: "absolute", top: "100px", right: "5%", zIndex: 10 }}>
            <Link href="/admin/dashboard">
              <button style={{ background: "rgba(245,197,24,0.1)", color: "#f5c518", border: "1px solid rgba(245,197,24,0.3)", borderRadius: "8px", padding: "8px 16px", fontWeight: 700, cursor: "pointer", backdropFilter: "blur(8px)" }}>
                ⚙️ Admin Panel
              </button>
            </Link>
          </div>
        )}
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
        {/* ── PROFILE HEADER INFO ── */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", marginTop: "-50px", marginBottom: "40px", position: "relative", zIndex: 5 }}>
          
          {/* Large Avatar */}
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", border: "4px solid #0a0a0a", overflow: "hidden", background: "#1a1a1a", flexShrink: 0, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            {imagePreview ? (
              <img src={imagePreview} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#e50914", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", fontWeight: 800 }}>
                {user.name?.[0] || "U"}
              </div>
            )}
          </div>

          {/* Identity Block */}
          <div style={{ marginTop: "60px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, fontFamily: "'Playfair Display', serif" }}>{user.name}</h1>
              <div style={{ display: "flex", gap: "8px" }}>
                 <span style={{ background: isAdmin ? "rgba(245,197,24,0.1)" : "rgba(74,222,128,0.1)", color: isAdmin ? "#f5c518" : "#4ade80", padding: "4px 12px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 700, border: "1px solid currentColor" }}>
                  {isAdmin ? "ADMIN" : "USER"}
                </span>
                {user.isSubscribed && (
                  <span style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa", padding: "4px 12px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 700, border: "1px solid #60a5fa" }}>
                    PRO
                  </span>
                )}
              </div>
            </div>
            <p style={{ color: "#666", margin: "4px 0 0 0", fontSize: "0.9rem" }}>{user.email}</p>
          </div>
        </div>

        {/* ── NAVIGATION TABS ── */}
        <div style={{ display: "flex", borderBottom: "1px solid #222", marginBottom: "32px", overflowX: "auto", gap: "10px" }}>
          {["profile", "watchlist", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                padding: "12px 20px",
                background: "none",
                border: "none",
                color: activeTab === tab ? "#e50914" : "#555",
                fontWeight: 700,
                cursor: "pointer",
                borderBottom: activeTab === tab ? "2px solid #e50914" : "2px solid transparent",
                textTransform: "capitalize",
                transition: "0.3s"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── CONTENT RENDERING ── */}
        <div style={{ paddingBottom: "100px" }}>
          
          {/* 1. Profile Tab */}
          {activeTab === "profile" && (
            <div style={{ maxWidth: "500px", background: "#111", padding: "30px", borderRadius: "16px", border: "1px solid #222" }}>
              <h3 style={{ margin: "0 0 20px 0" }}>Update Profile</h3>
              
              {success && <div style={{ color: "#4ade80", background: "rgba(74,222,128,0.1)", padding: "10px", borderRadius: "8px", marginBottom: "15px", fontSize: "0.85rem" }}>{success}</div>}
              {error && <div style={{ color: "#ff4d4d", background: "rgba(255,77,77,0.1)", padding: "10px", borderRadius: "8px", marginBottom: "15px", fontSize: "0.85rem" }}>{error}</div>}

              <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
                 <div style={{ width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden" }}>
                    <img src={imagePreview || ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                 </div>
                 <button onClick={() => fileRef.current?.click()} style={{ background: "#222", color: "#fff", border: "1px solid #333", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}>Change Photo</button>
                 <input ref={fileRef} type="file" hidden onChange={handleImageChange} />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", color: "#555", fontSize: "0.75rem", marginBottom: "5px", fontWeight: 700 }}>FULL NAME</label>
                <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #333", padding: "12px", borderRadius: "8px", color: "#fff", outline: "none" }} />
              </div>

              <button onClick={handleSave} disabled={saving} style={{ width: "100%", background: "#e50914", color: "#fff", border: "none", padding: "14px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", marginTop: "10px" }}>
                {saving ? "Updating..." : "Save Changes"}
              </button>
            </div>
          )}

          {/* 2. Watchlist Tab */}
          {activeTab === "watchlist" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "20px" }}>
              {tabLoading ? <p>Loading...</p> : watchlist.length === 0 ? <p style={{ color: "#444" }}>Your watchlist is empty.</p> : (
                watchlist.map((item) => {
                  const m = item.media || item;
                  return (
                    <div key={item.id} style={{ position: "relative" }}>
                      <Link href={`/movies/${item.mediaId || m.id}`}>
                        <div style={{ aspectRatio: "2/3", borderRadius: "10px", overflow: "hidden", background: "#1a1a1a" }}>
                          <img src={m.posterUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      </Link>
                      <button onClick={() => handleRemoveWatchlist(item.mediaId || m.id)} style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(0,0,0,0.7)", color: "#ff4d4d", border: "none", borderRadius: "50%", width: "25px", height: "25px", cursor: "pointer" }}>×</button>
                      <p style={{ fontSize: "0.8rem", marginTop: "8px", fontWeight: 600 }}>{m.title}</p>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* 3. Reviews Tab */}
          {activeTab === "reviews" && (
             <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {tabLoading ? <p>Loading...</p> : myReviews.length === 0 ? <p style={{ color: "#444" }}>You haven't written any reviews yet.</p> : (
                  myReviews.map((r) => (
                    <div key={r.id} style={{ background: "#111", padding: "20px", borderRadius: "12px", border: "1px solid #222" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Link href={`/movies/${r.mediaId}`} style={{ color: "#e50914", fontWeight: 700, textDecoration: "none" }}>{r.media?.title}</Link>
                        <span style={{ color: "#f5c518", fontWeight: 700 }}>★ {r.rating}</span>
                      </div>
                      <p style={{ color: "#888", fontSize: "0.9rem", margin: "10px 0" }}>{r.content}</p>
                      <button onClick={() => handleDeleteReview(r.id)} style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer", fontSize: "0.8rem", padding: 0 }}>Delete Review</button>
                    </div>
                  ))
                )}
             </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Minimal Components
function PageLoader() {
  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
      <div style={{ width: "40px", height: "40px", border: "4px solid #222", borderTopColor: "#e50914", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
