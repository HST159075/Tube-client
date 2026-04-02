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

  useEffect(() => {
    refetch?.();
  }, [pathname]);
  useEffect(() => {
    const interval = setInterval(() => refetch?.(), 30000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node))
        setMobileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/movies", label: "Media" },
    { href: "/subscription", label: "Pro Plan" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background:
            scrolled || mobileOpen ? "rgba(10,10,10,0.97)" : "transparent",
          backdropFilter: scrolled || mobileOpen ? "blur(20px)" : "none",
          borderBottom:
            scrolled || mobileOpen
              ? "1px solid rgba(255,255,255,0.06)"
              : "none",
          transition: "all 0.3s ease",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            padding: "0 5vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                background: "#e50914",
                color: "#fff",
                fontWeight: 900,
                fontSize: "1.2rem",
                padding: "4px 9px",
                borderRadius: "6px",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              CINE
            </span>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: "1rem" }}>
              TUBE
            </span>
          </Link>

          {/* Desktop nav links — hidden on mobile */}
          <div
            className="desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: "24px" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: isActive(link.href) ? "#e50914" : "#aaa",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  borderBottom: isActive(link.href)
                    ? "2px solid #e50914"
                    : "2px solid transparent",
                  paddingBottom: "2px",
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div
            className="desktop-nav"
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <Link href={user ? "/profile" : "/login"}>
              <button
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "#ccc",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "8px",
                  padding: "7px 12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                🔖 Watchlist
              </button>
            </Link>

            {isPending ? (
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                }}
              />
            ) : user ? (
              <div ref={menuRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setMenuOpen((p) => !p)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid rgba(229,9,20,0.6)",
                    cursor: "pointer",
                    background: "#e50914",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                >
                  {user.image ? (
                    <img
                      key={user.image}
                      src={user.image}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                      }}
                    >
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </button>
                {menuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "44px",
                      right: 0,
                      background: "#111",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "14px",
                      padding: "8px",
                      minWidth: "200px",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.7)",
                      zIndex: 100,
                    }}
                  >
                    <div
                      style={{
                        padding: "10px 12px 12px",
                        borderBottom: "1px solid rgba(255,255,255,0.07)",
                        marginBottom: "6px",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: "0.88rem",
                          color: "#fff",
                          marginBottom: "2px",
                        }}
                      >
                        {user.name}
                      </p>
                      <p style={{ fontSize: "0.73rem", color: "#555" }}>
                        {user.email}
                      </p>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "5px",
                          background: isAdmin
                            ? "rgba(245,197,24,0.15)"
                            : "rgba(74,222,128,0.1)",
                          color: isAdmin ? "#f5c518" : "#4ade80",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: "10px",
                        }}
                      >
                        {user.role || "USER"}
                      </span>
                    </div>
                    <DropItem
                      href="/profile"
                      icon="👤"
                      label="My Profile"
                      onClick={() => setMenuOpen(false)}
                    />
                    <DropItem
                      href="/profile"
                      icon="🔖"
                      label="Watchlist"
                      onClick={() => setMenuOpen(false)}
                    />
                    {isAdmin && (
                      <DropItem
                        href="/admin/dashboard"
                        icon="⚙️"
                        label="Admin Panel"
                        onClick={() => setMenuOpen(false)}
                        highlight
                      />
                    )}
                    <div
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.07)",
                        marginTop: "6px",
                        paddingTop: "6px",
                      }}
                    >
                      <button
                        onClick={handleSignOut}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "100%",
                          padding: "9px 12px",
                          borderRadius: "8px",
                          border: "none",
                          background: "transparent",
                          color: "#e50914",
                          cursor: "pointer",
                          fontSize: "0.87rem",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        <span>🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <button
                    style={{
                      background: "transparent",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                      padding: "7px 16px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.88rem",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Log In
                  </button>
                </Link>
                <Link href="/register">
                  <button
                    style={{
                      background: "#e50914",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "7px 16px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "0.88rem",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile right: avatar + hamburger */}
          <div
            className="mobile-nav"
            style={{ display: "none", alignItems: "center", gap: "10px" }}
          >
            {/* Avatar on mobile */}
            {!isPending && user && (
              <Link href="/profile">
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid rgba(229,9,20,0.6)",
                    background: "#e50914",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
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
                      {user.name?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
              </Link>
            )}
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "#fff",
                  borderRadius: "2px",
                  transition: "all 0.3s",
                  transform: mobileOpen
                    ? "rotate(45deg) translate(5px, 5px)"
                    : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "#fff",
                  borderRadius: "2px",
                  transition: "all 0.3s",
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "#fff",
                  borderRadius: "2px",
                  transition: "all 0.3s",
                  transform: mobileOpen
                    ? "rotate(-45deg) translate(5px, -5px)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileOpen && (
          <div
            ref={mobileRef}
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "16px 5vw 24px",
            }}
          >
            {/* User info */}
            {user && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "12px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#e50914",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ color: "#fff", fontWeight: 700 }}>
                      {user.name?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "#fff",
                    }}
                  >
                    {user.name}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#555" }}>
                    {user.email}
                  </p>
                </div>
                <span
                  style={{
                    marginLeft: "auto",
                    background: isAdmin
                      ? "rgba(245,197,24,0.15)"
                      : "rgba(74,222,128,0.1)",
                    color: isAdmin ? "#f5c518" : "#4ade80",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "10px",
                  }}
                >
                  {user.role || "USER"}
                </span>
              </div>
            )}

            {/* Nav links */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                marginBottom: "12px",
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      color: isActive(link.href) ? "#e50914" : "#ccc",
                      fontWeight: isActive(link.href) ? 700 : 500,
                      fontSize: "0.95rem",
                      background: isActive(link.href)
                        ? "rgba(229,9,20,0.08)"
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {user ? (
                <>
                  <MobileLink href="/profile" icon="👤" label="My Profile" />
                  <MobileLink href="/profile" icon="🔖" label="Watchlist" />
                  {isAdmin && (
                    <MobileLink
                      href="/admin/dashboard"
                      icon="⚙️"
                      label="Admin Panel"
                      highlight
                    />
                  )}
                  <button
                    onClick={handleSignOut}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "none",
                      background: "transparent",
                      color: "#e50914",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <span>🚪</span> Sign Out
                  </button>
                </>
              ) : (
                <div
                  style={{ display: "flex", gap: "10px", paddingTop: "4px" }}
                >
                  <Link href="/login" style={{ flex: 1 }}>
                    <button
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.07)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "10px",
                        padding: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "0.92rem",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Log In
                    </button>
                  </Link>
                  <Link href="/register" style={{ flex: 1 }}>
                    <button
                      style={{
                        width: "100%",
                        background: "#e50914",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        padding: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: "0.92rem",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav  { display: none   !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none   !important; }
          .mobile-nav  { display: flex   !important; }
        }
      `}</style>
    </>
  );
}

function DropItem({
  href,
  icon,
  label,
  onClick,
  highlight,
}: {
  href: string;
  icon: string;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }} onClick={onClick}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "9px 12px",
          borderRadius: "8px",
          cursor: "pointer",
          color: highlight ? "#f5c518" : "#ccc",
          fontSize: "0.87rem",
          fontWeight: 600,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <span>{icon}</span>
        {label}
      </div>
    </Link>
  );
}

function MobileLink({
  href,
  icon,
  label,
  highlight,
}: {
  href: string;
  icon: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 16px",
          borderRadius: "10px",
          color: highlight ? "#f5c518" : "#ccc",
          fontSize: "0.95rem",
          fontWeight: 600,
        }}
      >
        <span>{icon}</span>
        {label}
      </div>
    </Link>
  );
}
