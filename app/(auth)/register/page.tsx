"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 8) return setError("Password must be at least 8 characters");

    setLoading(true);
    setError("");

    // Better Auth signUp.email — matches your backend config
    const { data, error: authError } = await signUp.email({
      email,
      password,
      name,
     
    });

    if (authError) {
      setError(authError.message || "Registration failed. Try again.");
      setLoading(false);
      return;
    }

    // On success, redirect to login
    router.push("/login");
  };

  const fields = [
    { key: "name", label: "Full Name", type: "text", value: name, setter: setName, placeholder: "John Doe" },
    { key: "email", label: "Email Address", type: "email", value: email, setter: setEmail, placeholder: "you@example.com" },
    { key: "password", label: "Password", type: "password", value: password, setter: setPassword, placeholder: "Minimum 8 characters" },
    { key: "confirm", label: "Confirm Password", type: "password", value: confirmPassword, setter: setConfirmPassword, placeholder: "Repeat your password" },
  ];

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
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(229,9,20,0.12) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", width: "100%", maxWidth: "440px" }}>
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
            Create Account
          </h1>
          <p style={{ color: "#888", marginBottom: "32px" }}>
            Join CineRate and start reviewing today
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

          <form onSubmit={handleRegister}>
            {fields.map(({ key, label, type, value, setter, placeholder }) => (
              <div key={key} style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#888",
                    fontSize: "0.85rem",
                    marginBottom: "8px",
                    fontWeight: 600,
                  }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  required
                  placeholder={placeholder}
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
            ))}

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
                marginTop: "8px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
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
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "#e50914",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
