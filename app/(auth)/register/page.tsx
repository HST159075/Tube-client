"use client";
export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = (p: string) => {
    if (!p) return { score: 0, label: "", color: "" };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = [
      { label: "Too short", color: "#e50914" },
      { label: "Weak", color: "#e50914" },
      { label: "Fair", color: "#f5c518" },
      { label: "Good", color: "#4ade80" },
      { label: "Strong", color: "#4ade80" },
    ];
    return { score, ...levels[score] };
  };

  const strength = passwordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 8)
      return setError("Password must be at least 8 characters");
    setLoading(true);
    setError("");

    const { error: authError } = await signUp.email({ email, password, name });
    if (authError) {
      setError(authError.message || "Registration failed. Try again.");
      setLoading(false);
      return;
    }
    router.push("/login");
  };

const handleGoogle = async () => {
  setGoogleLoading(true); setError("");
  try {
    await signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`
    });
  } catch (e: any) {
    setError(e.message || "Google login failed");
    setGoogleLoading(false);
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        display: "flex",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Left decorative panel */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(145deg, #0a0a1a 0%, #0d0005 50%, #1a0008 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px",
        }}
        className="auth-left-panel"
      >
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "15%",
            width: "280px",
            height: "280px",
            background:
              "radial-gradient(circle, rgba(229,9,20,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: "10%",
            width: "220px",
            height: "220px",
            background:
              "radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "40px",
            width: "1px",
            height: "100%",
            background:
              "linear-gradient(to bottom, transparent, rgba(229,9,20,0.25), transparent)",
          }}
        />

        <div style={{ position: "relative", textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              gap: "6px",
              justifyContent: "center",
              marginBottom: "32px",
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  width: "44px",
                  height: "60px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                }}
              >
                ★
              </div>
            ))}
          </div>

          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              fontFamily: "'Playfair Display', serif",
              color: "#fff",
              marginBottom: "16px",
              lineHeight: 1.2,
            }}
          >
            Your opinion
            <br />
            shapes cinema
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.95rem",
              lineHeight: 1.75,
              maxWidth: "300px",
            }}
          >
            Rate movies, write reviews, build your watchlist, and discover films
            that match your taste.
          </p>

          <div
            style={{
              marginTop: "44px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              textAlign: "left",
            }}
          >
            {[
              "★ Rate on a 1–10 scale",
              "🔖 Build your watchlist",
              "💬 Comment & like reviews",
              "🎬 Discover premium films",
            ].map((f) => (
              <div
                key={f}
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "0.87rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px",
          background: "#0a0a0a",
          borderLeft: "1px solid rgba(255,255,255,0.05)",
          overflowY: "auto",
        }}
        className="auth-right-panel"
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "44px",
          }}
        >
          <span
            style={{
              background: "#e50914",
              color: "#fff",
              fontWeight: 900,
              fontSize: "1.3rem",
              padding: "5px 10px",
              borderRadius: "7px",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            CINE
          </span>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem" }}>
            TUBE
          </span>
        </Link>

        <h1
          style={{
            fontSize: "1.9rem",
            fontWeight: 900,
            fontFamily: "'Playfair Display', serif",
            marginBottom: "8px",
            color: "#fff",
          }}
        >
          Create account
        </h1>
        <p style={{ color: "#555", marginBottom: "28px", fontSize: "0.92rem" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#e50914",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>

        {error && (
          <div
            style={{
              background: "rgba(229,9,20,0.08)",
              border: "1px solid rgba(229,9,20,0.25)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              color: "#ff6b6b",
              fontSize: "0.87rem",
              display: "flex",
              gap: "8px",
            }}
          >
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            fontWeight: 600,
            cursor: googleLoading ? "not-allowed" : "pointer",
            fontSize: "0.92rem",
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "22px",
            opacity: googleLoading ? 0.6 : 1,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!googleLoading)
              e.currentTarget.style.background = "rgba(255,255,255,0.09)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }}
        >
          {googleLoading ? (
            <Spinner />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          {googleLoading ? "Connecting..." : "Sign up with Google"}
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(255,255,255,0.07)",
            }}
          />
          <span style={{ color: "#333", fontSize: "0.8rem" }}>
            or with email
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(255,255,255,0.07)",
            }}
          />
        </div>

        <form onSubmit={handleRegister}>
          {/* Name */}
          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                display: "block",
                color: "#666",
                fontSize: "0.75rem",
                fontWeight: 700,
                marginBottom: "6px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              type="text"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "10px",
                padding: "12px 14px",
                color: "#fff",
                fontSize: "0.93rem",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(229,9,20,0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.09)")
              }
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                display: "block",
                color: "#666",
                fontSize: "0.75rem",
                fontWeight: 700,
                marginBottom: "6px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              type="email"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "10px",
                padding: "12px 14px",
                color: "#fff",
                fontSize: "0.93rem",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(229,9,20,0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.09)")
              }
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "6px" }}>
            <label
              style={{
                display: "block",
                color: "#666",
                fontSize: "0.75rem",
                fontWeight: 700,
                marginBottom: "6px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min 8 characters"
                type={showPass ? "text" : "password"}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "10px",
                  padding: "12px 44px 12px 14px",
                  color: "#fff",
                  fontSize: "0.93rem",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(229,9,20,0.5)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.09)")
                }
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "#555",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Password strength bar */}
          {password && (
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: "3px",
                      borderRadius: "2px",
                      background:
                        i <= strength.score
                          ? strength.color
                          : "rgba(255,255,255,0.08)",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
              <p
                style={{
                  color: strength.color,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                }}
              >
                {strength.label}
              </p>
            </div>
          )}

          {/* Confirm password */}
          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                color: "#666",
                fontSize: "0.75rem",
                fontWeight: 700,
                marginBottom: "6px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Confirm Password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repeat password"
              type="password"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${confirmPassword && confirmPassword !== password ? "rgba(229,9,20,0.4)" : "rgba(255,255,255,0.09)"}`,
                borderRadius: "10px",
                padding: "12px 14px",
                color: "#fff",
                fontSize: "0.93rem",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(229,9,20,0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor =
                  confirmPassword && confirmPassword !== password
                    ? "rgba(229,9,20,0.4)"
                    : "rgba(255,255,255,0.09)")
              }
            />
            {confirmPassword && confirmPassword !== password && (
              <p
                style={{
                  color: "#e50914",
                  fontSize: "0.73rem",
                  marginTop: "4px",
                }}
              >
                Passwords don't match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            style={{
              width: "100%",
              background: loading ? "#222" : "#e50914",
              color: loading ? "#555" : "#fff",
              border: "none",
              borderRadius: "11px",
              padding: "14px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "0.95rem",
              fontFamily: "'DM Sans', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? (
              <>
                <Spinner /> Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p
          style={{
            color: "#222",
            fontSize: "0.73rem",
            textAlign: "center",
            marginTop: "28px",
            lineHeight: 1.6,
          }}
        >
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
          .auth-right-panel {
            max-width: 100% !important;
            padding: 32px 24px !important;
            border-left: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: "16px",
        height: "16px",
        border: "2px solid rgba(255,255,255,0.2)",
        borderTop: "2px solid #fff",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin 0.7s linear infinite",
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}