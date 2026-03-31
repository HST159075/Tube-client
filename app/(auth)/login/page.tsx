"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await signIn.email({
      email,
      password,
      callbackURL: "/", // redirect after login
    });

    if (authError) {
      setError(authError.message || "Login failed. Check your credentials.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh(); // refresh server components to pick up new session
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: "20px",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(229,9,20,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(245,197,24,0.06) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", width: "100%", maxWidth: "440px" }}>
        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              background: "#e50914",
              color: "#fff",
              fontWeight: 900,
              fontSize: "1.6rem",
              padding: "6px 12px",
              borderRadius: "8px",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            CINE
          </span>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "1.4rem" }}>
            RATE
          </span>
        </Link>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "40px",
            backdropFilter: "blur(20px)",
          }}
        >
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              marginBottom: "8px",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: "#888", marginBottom: "32px" }}>
            Sign in to your CineRate account
          </p>

          {error && (
            <div
              style={{
                background: "rgba(229,9,20,0.1)",
                border: "1px solid rgba(229,9,20,0.4)",
                borderRadius: "10px",
                padding: "12px 16px",
                marginBottom: "20px",
                color: "#ff6b6b",
                fontSize: "0.9rem",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  color: "#888",
                  fontSize: "0.85rem",
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  color: "#fff",
                  fontSize: "1rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(229,9,20,0.5)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <label
                  style={{
                    color: "#888",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  style={{
                    color: "#e50914",
                    fontSize: "0.8rem",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  color: "#fff",
                  fontSize: "1rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(229,9,20,0.5)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "#555" : "#e50914",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "15px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "1rem",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
              color: "#888",
              fontSize: "0.9rem",
            }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              style={{
                color: "#e50914",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
