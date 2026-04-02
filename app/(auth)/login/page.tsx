"use client";
export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: authError } = await signIn.email({
      email,
      password,
      callbackURL: redirect,
    });
    if (authError) {
      setError(authError.message || "Invalid email or password");
      setLoading(false);
      return;
    }
    router.push(redirect);
    router.refresh();
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await signIn.social({
        provider: "google",
        // frontend URL দাও — backend এখানে redirect করবে OAuth শেষে
        callbackURL: `${window.location.origin}${redirect}`,
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
      {/* Left panel — decorative, hidden on mobile */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(145deg, #0d0005 0%, #1a0008 40%, #0a0a1a 100%)",
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
            top: "20%",
            left: "10%",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(229,9,20,0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: "250px",
            height: "250px",
            background:
              "radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
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
              "linear-gradient(to bottom, transparent, rgba(229,9,20,0.3), transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: "40px",
            width: "1px",
            height: "100%",
            background:
              "linear-gradient(to bottom, transparent, rgba(229,9,20,0.15), transparent)",
          }}
        />

        <div style={{ position: "relative", textAlign: "center" }}>
          <div
            style={{
              fontSize: "5rem",
              marginBottom: "24px",
              filter: "drop-shadow(0 0 30px rgba(229,9,20,0.5))",
            }}
          >
            🎬
          </div>
          <h2
            style={{
              fontSize: "2.2rem",
              fontWeight: 900,
              fontFamily: "'Playfair Display', serif",
              color: "#fff",
              marginBottom: "16px",
              lineHeight: 1.2,
            }}
          >
            Cinema lives
            <br />
            in every review
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: "320px",
            }}
          >
            Join thousands of film lovers rating, reviewing, and discovering
            their next favorite movie.
          </p>

          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "48px",
              justifyContent: "center",
            }}
          >
            {[
              { n: "10K+", l: "Reviews" },
              { n: "5K+", l: "Films" },
              { n: "2K+", l: "Users" },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "#e50914",
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.3)",
                    marginTop: "2px",
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px 40px",
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
            marginBottom: "48px",
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
          Welcome back
        </h1>
        <p style={{ color: "#555", marginBottom: "32px", fontSize: "0.92rem" }}>
          Don't have an account?{" "}
          <Link
            href={`/register${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
            style={{
              color: "#e50914",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Sign up free
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
              alignItems: "flex-start",
            }}
          >
            <span style={{ flexShrink: 0 }}>⚠️</span> {error}
          </div>
        )}

        {/* Google button */}
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
            marginBottom: "24px",
            transition: "all 0.2s",
            opacity: googleLoading ? 0.6 : 1,
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
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "24px",
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
            or continue with email
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(255,255,255,0.07)",
            }}
          />
        </div>

        {/* Email form */}
        <form onSubmit={handleLogin}>
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
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "10px",
                padding: "13px 15px",
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
                (e.target.style.borderColor = "rgba(255,255,255,0.09)")
              }
            />
          </div>

          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "7px",
              }}
            >
              <label
                style={{
                  color: "#666",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                style={{
                  color: "#e50914",
                  fontSize: "0.78rem",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Forgot?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "10px",
                  padding: "13px 44px 13px 15px",
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
                  padding: "4px",
                }}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "24px" }} />

          <button
            type="submit"
            disabled={loading || googleLoading}
            style={{
              width: "100%",
              background: loading ? "#333" : "#e50914",
              color: loading ? "#666" : "#fff",
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
                <Spinner /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p
          style={{
            color: "#2a2a2a",
            fontSize: "0.75rem",
            textAlign: "center",
            marginTop: "32px",
            lineHeight: 1.6,
          }}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
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
