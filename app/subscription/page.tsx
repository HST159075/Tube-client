"use client";
import { useState } from "react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: { monthly: "$0", yearly: "$0" },
    priceValue: 0,
    features: [
      { text: "Browse all titles", included: true },
      { text: "Read published reviews", included: true },
      { text: "Watchlist (up to 10 titles)", included: true },
      { text: "Write reviews", included: false },
      { text: "HD Streaming", included: false },
      { text: "No ads", included: false },
      { text: "Download offline", included: false },
    ],
    color: "#555",
    highlight: false,
  },
  {
    name: "Monthly",
    price: { monthly: "$9.99", yearly: "$7.99" },
    priceValue: 9.99,
    features: [
      { text: "Browse all titles", included: true },
      { text: "Read published reviews", included: true },
      { text: "Unlimited watchlist", included: true },
      { text: "Write & rate reviews", included: true },
      { text: "HD Streaming", included: true },
      { text: "No ads", included: true },
      { text: "Download offline", included: false },
    ],
    color: "#e50914",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Yearly",
    price: { monthly: "$79.99/yr", yearly: "$79.99/yr" },
    priceValue: 79.99,
    features: [
      { text: "Browse all titles", included: true },
      { text: "Read published reviews", included: true },
      { text: "Unlimited watchlist", included: true },
      { text: "Write & rate reviews", included: true },
      { text: "4K Streaming", included: true },
      { text: "No ads", included: true },
      { text: "Download offline", included: true },
    ],
    color: "#f5c518",
    highlight: false,
    badge: "Best Value",
  },
];

const FAQ = [
  { q: "Can I cancel anytime?", a: "Yes! Monthly subscribers can cancel anytime. You'll continue to have access until the end of your billing period." },
  { q: "Is there a free trial?", a: "Our Free plan is available forever. Monthly plan includes a 7-day free trial for new subscribers." },
  { q: "What payment methods are accepted?", a: "We accept credit/debit cards (Visa, Mastercard) and mobile banking via SSLCommerz." },
  { q: "Can I upgrade or downgrade?", a: "Yes, you can change your plan at any time from your account settings." },
];

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = async (planName: string) => {
    setSelectedPlan(planName);
    // Replace with actual API call:
    // const res = await fetch(`/api/payments/checkout`, { method: "POST", body: JSON.stringify({ planType: planName.toLowerCase() }) })
    alert(`Redirecting to payment for ${planName} plan...`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'DM Sans', sans-serif", paddingTop: "90px" }}>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "60px 5vw 0" }}>
        <span style={{ background: "rgba(229,9,20,0.15)", color: "#e50914", fontWeight: 700, fontSize: "12px", letterSpacing: "2px", padding: "6px 16px", borderRadius: "20px", textTransform: "uppercase" }}>
          Subscription Plans
        </span>
        <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", fontWeight: 900, fontFamily: "'Playfair Display', serif", margin: "20px 0 16px" }}>
          Unlock the Full CineRate Experience
        </h1>
        <p style={{ color: "#888", fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto 40px" }}>
          Stream, rate, and review unlimited titles. Cancel anytime.
        </p>

        {/* Billing Toggle */}
        <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "4px", marginBottom: "60px" }}>
          {(["monthly", "yearly"] as const).map(cycle => (
            <button key={cycle} onClick={() => setBillingCycle(cycle)}
              style={{ padding: "10px 24px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", textTransform: "capitalize", background: billingCycle === cycle ? "#e50914" : "transparent", color: "#fff", transition: "all 0.2s" }}>
              {cycle} {cycle === "yearly" && <span style={{ fontSize: "0.75rem", marginLeft: "4px", color: billingCycle === "yearly" ? "rgba(255,255,255,0.8)" : "#4ade80" }}>Save 20%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div style={{ display: "flex", gap: "24px", padding: "0 5vw 80px", justifyContent: "center", flexWrap: "wrap", maxWidth: "1000px", margin: "0 auto" }}>
        {PLANS.map(plan => (
          <div key={plan.name} style={{
            flex: "1 1 260px", maxWidth: "320px",
            background: plan.highlight ? "linear-gradient(145deg, #1a0005, #2d0008)" : "rgba(255,255,255,0.04)",
            border: `2px solid ${plan.highlight ? "#e50914" : "rgba(255,255,255,0.08)"}`,
            borderRadius: "24px", padding: "36px 28px", position: "relative",
            transition: "transform 0.3s",
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-8px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {plan.badge && (
              <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: plan.color, color: plan.name === "Yearly" ? "#000" : "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", padding: "4px 16px", borderRadius: "20px", whiteSpace: "nowrap" }}>
                {plan.badge}
              </div>
            )}

            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px", color: plan.color }}>{plan.name}</h3>
            <div style={{ marginBottom: "28px" }}>
              <span style={{ fontSize: "2.6rem", fontWeight: 900 }}>{plan.price[billingCycle]}</span>
              {plan.priceValue > 0 && <span style={{ color: "#888", fontSize: "0.9rem", marginLeft: "4px" }}>/{billingCycle === "monthly" ? "mo" : "yr"}</span>}
            </div>

            <ul style={{ listStyle: "none", padding: 0, marginBottom: "28px" }}>
              {plan.features.map(f => (
                <li key={f.text} style={{ padding: "10px 0", color: f.included ? "#ccc" : "#444", fontSize: "0.9rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: f.included ? "#4ade80" : "#333", fontWeight: 700 }}>{f.included ? "✓" : "✕"}</span>
                  {f.text}
                </li>
              ))}
            </ul>

            <button onClick={() => handleSubscribe(plan.name)}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px", fontWeight: 700, cursor: "pointer", fontSize: "1rem",
                background: plan.highlight ? "#e50914" : plan.name === "Yearly" ? "rgba(245,197,24,0.15)" : "rgba(255,255,255,0.08)",
                color: plan.name === "Yearly" ? "#f5c518" : "#fff",
                border: plan.highlight ? "none" : `1px solid ${plan.name === "Yearly" ? "rgba(245,197,24,0.4)" : "rgba(255,255,255,0.15)"}`,
                transition: "opacity 0.2s",
              }}>
              {plan.name === "Free" ? "Get Started Free" : `Subscribe to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 5vw 80px" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "'Playfair Display', serif", textAlign: "center", marginBottom: "40px" }}>
          Frequently Asked Questions
        </h2>
        {FAQ.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "16px", marginBottom: "16px" }}>
      <button onClick={() => setOpen(p => !p)}
        style={{ width: "100%", background: "transparent", border: "none", color: "#fff", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", fontWeight: 700, fontSize: "1rem", fontFamily: "'DM Sans', sans-serif" }}>
        {q}
        <span style={{ color: "#e50914", fontSize: "1.2rem", transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "rotate(0)" }}>+</span>
      </button>
      {open && <p style={{ color: "#aaa", lineHeight: 1.7, marginTop: "8px", paddingLeft: "0" }}>{a}</p>}
    </div>
  );
}
