"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function PaymentSuccessPage() {
  const { refetch } = useSession();
  const [counted, setCounted] = useState(5);

  useEffect(() => {
    (refetch as any)?.();
    const interval = setInterval(() => {
      setCounted(p => {
        if (p <= 1) { clearInterval(interval); window.location.href = "/"; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "20px" }}>
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        {/* Success animation */}
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "rgba(74,222,128,0.12)", border: "2px solid rgba(74,222,128,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: "3rem" }}>
          ✓
        </div>

        <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", marginBottom: "12px", fontFamily: "'Playfair Display', serif" }}>
          Payment Successful!
        </h1>
        <p style={{ color: "#4ade80", fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>
          Welcome to CineRate Premium 🎉
        </p>
        <p style={{ color: "#666", marginBottom: "32px", lineHeight: 1.7 }}>
          Your subscription is now active. You can now watch all premium movies and series without any restrictions.
        </p>

        <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "14px", padding: "20px", marginBottom: "28px" }}>
          <p style={{ color: "#aaa", fontSize: "0.88rem" }}>
            Redirecting to home in <strong style={{ color: "#4ade80", fontSize: "1.1rem" }}>{counted}s</strong>
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/">
            <button style={{ background: "#e50914", color: "#fff", border: "none", borderRadius: "10px", padding: "13px 28px", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem", fontFamily: "'DM Sans', sans-serif" }}>
              Go to Home
            </button>
          </Link>
          <Link href="/movies">
            <button style={{ background: "rgba(255,255,255,0.07)", color: "#ccc", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "13px 24px", fontWeight: 600, cursor: "pointer", fontSize: "0.95rem", fontFamily: "'DM Sans', sans-serif" }}>
              Browse Movies
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}