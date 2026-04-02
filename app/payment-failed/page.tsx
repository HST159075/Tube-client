"use client";
import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "20px" }}>
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "rgba(229,9,20,0.1)", border: "2px solid rgba(229,9,20,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: "3rem" }}>
          ✕
        </div>

        <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", marginBottom: "12px", fontFamily: "'Playfair Display', serif" }}>
          Payment Failed
        </h1>
        <p style={{ color: "#e50914", fontSize: "1rem", fontWeight: 600, marginBottom: "8px" }}>
          Something went wrong with your payment
        </p>
        <p style={{ color: "#666", marginBottom: "32px", lineHeight: 1.7 }}>
          Don't worry — your card was not charged. Please try again or contact support if the issue persists.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/subscription">
            <button style={{ background: "#e50914", color: "#fff", border: "none", borderRadius: "10px", padding: "13px 28px", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem", fontFamily: "'DM Sans', sans-serif" }}>
              Try Again
            </button>
          </Link>
          <Link href="/">
            <button style={{ background: "rgba(255,255,255,0.07)", color: "#ccc", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "13px 24px", fontWeight: 600, cursor: "pointer", fontSize: "0.95rem", fontFamily: "'DM Sans', sans-serif" }}>
              Go to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}