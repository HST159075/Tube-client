"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending, refetch } = useSession();
  const user = session?.user as any;
  const isAdmin = user?.role === "ADMIN";

  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light";
    if (saved) {
      setTheme(saved);
      document.body.className = saved;
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.body.className = next;
  };

  useEffect(() => { refetch?.(); }, [pathname]);
  useEffect(() => {
    const interval = setInterval(() => refetch?.(), 30000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) setMobileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  useEffect(() => { setMobileOpen(false); setMenuOpen(false); }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/",            label: "Home",     icon: "🏠" },
    { href: "/movies",      label: "Media",    icon: "🎬" },
    { href: "/subscription",label: "Pro Plan", icon: "⭐" },
    { href: "/about",       label: "About",    icon: "👤" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes mobileSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-link {
          position: relative;
          color: var(--muted);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.88rem;
          padding: 6px 2px;
          transition: color 0.2s ease;
          letter-spacing: 0.2px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          background: #e50914;
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link:hover { color: var(--text); }
        .nav-link:hover::after { width: 100%; }
        .nav-link.active { color: var(--text); }
        .nav-link.active::after { width: 100%; }

        .drop-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 14px; border-radius: 10px;
          color: #bbb; font-size: 0.86rem; font-weight: 600;
          cursor: pointer; transition: all 0.15s ease;
          text-decoration: none;
        }
        .drop-item:hover { background: rgba(255,255,255,0.06); color: #fff; transform: translateX(3px); }
        .drop-item.highlight { color: #f5c518; }
        .drop-item.highlight:hover { background: rgba(245,197,24,0.08); }

        .mobile-link {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 16px; border-radius: 12px;
          color: #bbb; font-size: 0.93rem; font-weight: 600;
          text-decoration: none; transition: all 0.2s ease;
        }
        .mobile-link:hover, .mobile-link.active {
          background: rgba(229,9,20,0.08); color: #fff;
        }
        .mobile-link.active { color: #e50914; }

        .avatar-btn {
          width: 36px; height: 36px; border-radius: 50%;
          overflow: hidden; border: 2px solid rgba(229,9,20,0.5);
          cursor: pointer; background: #e50914;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease; padding: 0;
        }
        .avatar-btn:hover { border-color: #e50914; transform: scale(1.05); box-shadow: 0 0 0 3px rgba(229,9,20,0.2); }

        .watchlist-btn {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px; padding: 7px 14px;
          color: #999; font-weight: 600; font-size: 0.82rem;
          cursor: pointer; transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .watchlist-btn:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.18); }

        .login-btn {
          background: transparent; color: #ccc;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 9px; padding: 7px 16px;
          font-weight: 600; cursor: pointer; font-size: 0.86rem;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
        }
        .login-btn:hover { background: rgba(255,255,255,0.07); color: #fff; border-color: rgba(255,255,255,0.25); }

        .signup-btn {
          background: #e50914; color: #fff; border: none;
          border-radius: 9px; padding: 7px 18px;
          font-weight: 700; cursor: pointer; font-size: 0.86rem;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease; position: relative; overflow: hidden;
        }
        .signup-btn:hover { background: #c0070f; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(229,9,20,0.4); }

        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav  { display: none   !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none   !important; }
          .mobile-nav  { display: flex   !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled || mobileOpen
          ? "rgba(10,10,12,0.55)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
        backdropFilter: scrolled || mobileOpen ? "blur(20px) saturate(200%)" : "none",
        WebkitBackdropFilter: scrolled || mobileOpen ? "blur(20px) saturate(200%)" : "none",
        borderBottom: scrolled || mobileOpen ? "1px solid rgba(255,255,255,0.08)" : "none",
        boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Top red accent line */}
        {scrolled && (
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "1px",
            background: "linear-gradient(to right, transparent, rgba(229,9,20,0.6), transparent)",
            animation: "fadeIn 0.4s ease",
          }} />
        )}

        <div style={{
          padding: "0 5vw",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "64px",
        }}>

          {/* ── LOGO ── */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <div style={{
              background: "linear-gradient(135deg, #e50914, #c0070f)",
              color: "#fff", fontWeight: 900, fontSize: "1.15rem",
              padding: "4px 10px", borderRadius: "7px",
              fontFamily: "'Playfair Display', serif",
              boxShadow: "0 2px 12px rgba(229,9,20,0.35)",
              letterSpacing: "0.5px",
            }}>
              CINE
            </div>
            <span style={{ color: "var(--text)", fontWeight: 800, fontSize: "1rem", letterSpacing: "1px" }}>
              RATE
            </span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link${isActive(link.href) ? " active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── DESKTOP RIGHT ── */}
          <div className="desktop-nav" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* Theme Toggle — Pill Switch */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                position: "relative",
                width: "56px", height: "28px", borderRadius: "14px",
                background: theme === "dark"
                  ? "linear-gradient(135deg, #1a1a2e, #16213e)"
                  : "linear-gradient(135deg, #87CEEB, #f0c27f)",
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer", padding: 0,
                boxShadow: theme === "dark"
                  ? "inset 0 1px 3px rgba(0,0,0,0.4), 0 0 8px rgba(100,100,255,0.1)"
                  : "inset 0 1px 3px rgba(0,0,0,0.15), 0 0 8px rgba(255,200,50,0.2)",
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                overflow: "hidden",
              }}
            >
              {/* Sliding knob */}
              <div style={{
                position: "absolute",
                top: "2px",
                left: theme === "dark" ? "2px" : "28px",
                width: "24px", height: "24px", borderRadius: "50%",
                background: theme === "dark"
                  ? "linear-gradient(145deg, #e8e8e8, #c0c0c0)"
                  : "linear-gradient(145deg, #fff7e6, #ffd700)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px",
                boxShadow: theme === "dark"
                  ? "0 2px 8px rgba(0,0,0,0.5)"
                  : "0 2px 8px rgba(255,165,0,0.4)",
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}>
                {theme === "dark" ? "🌙" : "☀️"}
              </div>
            </button>

            {/* Watchlist */}
            <Link href={user ? "/profile" : "/login"}>
              <button className="watchlist-btn">
                <span style={{ fontSize: "0.9rem" }}>🔖</span>
                Watchlist
              </button>
            </Link>

            {isPending ? (
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", animation: "pulse 1.5s infinite" }} />
            ) : user ? (
              <div ref={menuRef} style={{ position: "relative" }}>
                <button className="avatar-btn" onClick={() => setMenuOpen(p => !p)}>
                  {user.image ? (
                    <img src={user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </button>

                {menuOpen && (
                  <div style={{
                    position: "absolute", top: "48px", right: 0,
                    background: "rgba(12,12,14,0.98)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px", padding: "8px",
                    minWidth: "220px",
                    boxShadow: "0 24px 48px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
                    animation: "slideDown 0.25s cubic-bezier(0.16,1,0.3,1)",
                    backdropFilter: "blur(20px)",
                    zIndex: 100,
                  }}>
                    {/* User info */}
                    <div style={{
                      padding: "12px 14px 14px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      marginBottom: "6px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", background: "#e50914", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {user.image
                            ? <img src={user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>{user.name?.[0]?.toUpperCase()}</span>
                          }
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: "0.87rem", color: "#fff", marginBottom: "1px" }}>{user.name}</p>
                          <p style={{ fontSize: "0.72rem", color: "#444" }}>{user.email}</p>
                        </div>
                      </div>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "4px",
                        background: isAdmin ? "rgba(245,197,24,0.12)" : "rgba(74,222,128,0.08)",
                        color: isAdmin ? "#f5c518" : "#4ade80",
                        fontSize: "0.68rem", fontWeight: 700,
                        padding: "3px 8px", borderRadius: "20px",
                        border: `1px solid ${isAdmin ? "rgba(245,197,24,0.2)" : "rgba(74,222,128,0.15)"}`,
                      }}>
                        {isAdmin ? "⚡ ADMIN" : "✓ USER"}
                      </span>
                      {user.isSubscribed && (
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "4px",
                          background: "rgba(96,165,250,0.08)", color: "#60a5fa",
                          fontSize: "0.68rem", fontWeight: 700,
                          padding: "3px 8px", borderRadius: "20px",
                          border: "1px solid rgba(96,165,250,0.15)",
                          marginLeft: "6px",
                        }}>
                          ⭐ PRO
                        </span>
                      )}
                    </div>

                    <a className="drop-item" href="/profile">👤 My Profile</a>
                    <a className="drop-item" href="/profile">🔖 Watchlist</a>
                    {isAdmin && <a className="drop-item highlight" href="/admin/dashboard">⚙️ Admin Panel</a>}

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "6px", paddingTop: "6px" }}>
                      <button onClick={handleSignOut} style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        width: "100%", padding: "9px 14px", borderRadius: "10px",
                        border: "none", background: "transparent",
                        color: "#e50914", cursor: "pointer", fontSize: "0.86rem",
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                        transition: "background 0.15s",
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(229,9,20,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login"><button className="login-btn">Log In</button></Link>
                <Link href="/register"><button className="signup-btn">Sign Up</button></Link>
              </>
            )}
          </div>

          {/* ── MOBILE RIGHT ── */}
          <div className="mobile-nav" style={{ display: "none", alignItems: "center", gap: "10px" }}>
            {!isPending && user && (
              <Link href="/profile">
                <div className="avatar-btn" style={{ width: "32px", height: "32px" }}>
                  {user.image
                    ? <img src={user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.82rem" }}>{user.name?.[0]?.toUpperCase()}</span>
                  }
                </div>
              </Link>
            )}

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(p => !p)} style={{
              background: "transparent", border: "none", cursor: "pointer",
              padding: "6px", display: "flex", flexDirection: "column", gap: "5px",
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: "block", width: "22px", height: "2px",
                  background: "#fff", borderRadius: "2px",
                  transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                  transform: mobileOpen
                    ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                    : i === 2 ? "rotate(-45deg) translate(5px, -5px)"
                    : "none"
                    : "none",
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>
          </div>
        </div>

        {/* ── MOBILE DRAWER ── */}
        {mobileOpen && (
          <div ref={mobileRef} style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "16px 5vw 28px",
            animation: "mobileSlide 0.25s cubic-bezier(0.16,1,0.3,1)",
          }}>
            {/* User card */}
            {user && (
              <div style={{
                padding: "14px 16px", background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px", marginBottom: "14px",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", overflow: "hidden", background: "#e50914", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(229,9,20,0.4)" }}>
                  {user.image
                    ? <img src={user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ color: "#fff", fontWeight: 700 }}>{user.name?.[0]?.toUpperCase()}</span>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
                  <p style={{ fontSize: "0.72rem", color: "#444", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                </div>
                <span style={{
                  background: isAdmin ? "rgba(245,197,24,0.12)" : "rgba(74,222,128,0.08)",
                  color: isAdmin ? "#f5c518" : "#4ade80",
                  fontSize: "0.65rem", fontWeight: 700,
                  padding: "3px 8px", borderRadius: "20px", whiteSpace: "nowrap",
                  border: `1px solid ${isAdmin ? "rgba(245,197,24,0.2)" : "rgba(74,222,128,0.15)"}`,
                }}>
                  {isAdmin ? "⚡ ADMIN" : "USER"}
                </span>
              </div>
            )}

            {/* Nav links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "14px" }}>
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className={`mobile-link${isActive(link.href) ? " active" : ""}`}>
                  <span style={{ fontSize: "1rem" }}>{link.icon}</span>
                  {link.label}
                  {isActive(link.href) && <span style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#e50914" }} />}
                </Link>
              ))}
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "2px" }}>
              {user ? (
                <>
                  <Link href="/profile" className="mobile-link"><span>👤</span> My Profile</Link>
                  <Link href="/profile" className="mobile-link"><span>🔖</span> Watchlist</Link>
                  {isAdmin && <Link href="/admin/dashboard" className="mobile-link" style={{ color: "#f5c518" }}><span>⚙️</span> Admin Panel</Link>}
                  <button onClick={handleSignOut} style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "13px 16px", borderRadius: "12px",
                    border: "none", background: "rgba(229,9,20,0.06)",
                    color: "#e50914", cursor: "pointer",
                    fontSize: "0.93rem", fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif", textAlign: "left", width: "100%",
                    marginTop: "4px",
                  }}>
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
                  <Link href="/login" style={{ flex: 1 }}>
                    <button style={{ width: "100%", background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "11px", padding: "13px", fontWeight: 600, cursor: "pointer", fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif" }}>
                      Log In
                    </button>
                  </Link>
                  <Link href="/register" style={{ flex: 1 }}>
                    <button style={{ width: "100%", background: "#e50914", color: "#fff", border: "none", borderRadius: "11px", padding: "13px", fontWeight: 700, cursor: "pointer", fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif" }}>
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}