"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Better Auth session hook — works like useSession from next-auth
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isAdmin = (user as any)?.role === "ADMIN";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/movies", label: "Browse" },
    { href: "/subscription", label: "Plans" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
        padding: "0 5vw",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "70px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              background: "#e50914",
              color: "#fff",
              fontWeight: 900,
              fontSize: "1.4rem",
              padding: "4px 10px",
              borderRadius: "6px",
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "1px",
            }}
          >
            CINE
          </span>
          <span
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: "1.2rem",
              letterSpacing: "1px",
            }}
          >
            RATE
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: pathname === link.href ? "#e50914" : "#ccc",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                borderBottom:
                  pathname === link.href
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

        {/* Auth Section */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {isPending ? (
            // Loading skeleton
            <div
              style={{
                width: "80px",
                height: "36px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "8px",
                animation: "pulse 1.5s infinite",
              }}
            />
          ) : user ? (
            <>
              {/* Admin badge */}
              {isAdmin && (
                <Link href="/admin/dashboard">
                  <button
                    style={{
                      background: "rgba(245,197,24,0.15)",
                      color: "#f5c518",
                      border: "1px solid rgba(245,197,24,0.4)",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    ⚙️ Admin
                  </button>
                </Link>
              )}

              {/* Watchlist */}
              <Link href="/watchlist">
                <button
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  🔖 Watchlist
                </button>
              </Link>

              {/* Avatar dropdown */}
              <div style={{ position: "relative" }}>
                <Link href="/profile">
                  <div
                    title={user.name || user.email}
                    style={{
                      width: "38px",
                      height: "38px",
                      background: "#e50914",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "1rem",
                      color: "#fff",
                    }}
                  >
                    {(user.name || user.email)?.[0]?.toUpperCase() || "U"}
                  </div>
                </Link>
              </div>

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                style={{
                  background: "transparent",
                  color: "#888",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button
                  style={{
                    background: "transparent",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    padding: "9px 20px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.9rem",
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
                    padding: "9px 20px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
