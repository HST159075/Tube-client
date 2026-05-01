"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    priceLabel: "৳0",
    period: "forever",
    color: "#4ade80",
    features: [
      { text: "Browse all titles",          ok: true  },
      { text: "Read published reviews",     ok: true  },
      { text: "Write & rate reviews",       ok: true  },
      { text: "Watchlist (up to 10)",       ok: true  },
      { text: "Watch FREE movies",          ok: true  },
      { text: "Watch PREMIUM movies",       ok: false },
      { text: "No ads",                     ok: false },
    ],
    cta: "Current Plan",
    highlight: false,
  },
  {
    id: "MONTHLY",
    name: "Monthly",
    price: 299,
    priceLabel: "৳299",
    period: "per month",
    color: "#e50914",
    badge: "Most Popular",
    features: [
      { text: "Everything in Free",         ok: true  },
      { text: "Watch ALL premium movies",   ok: true  },
      { text: "Unlimited watchlist",        ok: true  },
      { text: "HD Streaming",               ok: true  },
      { text: "No ads",                     ok: true  },
      { text: "Cancel anytime",             ok: true  },
      { text: "2 months free",              ok: false },
    ],
    cta: "Subscribe Monthly",
    highlight: true,
  },
  {
    id: "YEARLY",
    name: "Yearly",
    price: 2499,
    priceLabel: "৳2,499",
    period: "per year",
    color: "#f5c518",
    badge: "Best Value",
    features: [
      { text: "Everything in Monthly",      ok: true  },
      { text: "4K Streaming",               ok: true  },
      { text: "Download offline",           ok: true  },
      { text: "Priority support",           ok: true  },
      { text: "2 months FREE",              ok: true  },
      { text: "Family sharing (5 users)",   ok: true  },
      { text: "Early access to new titles", ok: true  },
    ],
    cta: "Subscribe Yearly",
    highlight: false,
  },
];

const FAQ = [
  { q: "Can I cancel anytime?", a: "Yes! Monthly subscribers can cancel anytime. You'll keep access until the end of your billing period." },
  { q: "What payment methods are accepted?", a: "We accept credit/debit cards, bKash, Nagad, Rocket, and all major mobile banking via SSLCommerz." },
  { q: "What happens when my subscription expires?", a: "You'll automatically be downgraded to the free plan. Your watchlist and reviews are saved." },
  { q: "Can I watch on multiple devices?", a: "Yes, you can stream on any device. Yearly plan supports up to 5 simultaneous users." },
];

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL!;

  const handleSubscribe = async (plan: typeof PLANS[0]) => {
    if (plan.id === "FREE") return;

    if (!user) {
      router.push("/login?redirect=/subscription");
      return;
    }

    // Already subscribed
    if (user.isSubscribed) {
      alert("You already have an active subscription!");
      return;
    }

    setLoading(plan.id);
    try {
      // POST /api/v1/payment/create-checkout
      const res = await fetch(`${API}/payment/create-checkout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType: plan.id,       // "MONTHLY" or "YEARLY"
          amount: plan.price,      // 299 or 2499 (BDT)
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Payment initiation failed");

      // Redirect to SSLCommerz payment gateway
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (e: any) {
      alert(`Payment Error: ${e.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", paddingTop: "90px" }}>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "60px 5vw 0" }}>
        <span style={{ background: "rgba(229,9,20,0.12)", color: "#e50914", fontWeight: 700, fontSize: "11px", letterSpacing: "2px", padding: "6px 16px", borderRadius: "20px", textTransform: "uppercase" }}>
          Subscription Plans
        </span>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, fontFamily: "'Playfair Display', serif", margin: "20px 0 14px" }}>
          Unlock Premium Entertainment
        </h1>
        <p style={{ color: "#666", fontSize: "1rem", maxWidth: "500px", margin: "0 auto 16px", lineHeight: 1.7 }}>
          Get unlimited access to all premium movies and series. Pay with bKash, Nagad, or card.
        </p>

        {/* Current status */}
        {user && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: user.isSubscribed ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${user.isSubscribed ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.08)"}`, borderRadius: "20px", padding: "8px 18px", marginBottom: "48px" }}>
            <span style={{ fontSize: "0.85rem", color: user.isSubscribed ? "#4ade80" : "#666", fontWeight: 600 }}>
              {user.isSubscribed ? "✓ Active subscription" : "Currently on Free plan"}
            </span>
          </div>
        )}
      </div>

      {/* Plans */}
      <div style={{ display: "flex", gap: "20px", padding: "0 5vw 80px", justifyContent: "center", flexWrap: "wrap", maxWidth: "1000px", margin: "0 auto" }}>
        {PLANS.map(plan => (
          <div key={plan.id} style={{
            flex: "1 1 260px", maxWidth: "310px",
            background: plan.highlight ? "linear-gradient(145deg, #1a0005, #2a0008)" : "rgba(255,255,255,0.03)",
            border: `2px solid ${plan.highlight ? "#e50914" : "rgba(255,255,255,0.07)"}`,
            borderRadius: "22px", padding: "32px 26px", position: "relative",
            transition: "transform 0.3s",
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-6px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {plan.badge && (
              <div style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: plan.highlight ? "#e50914" : "#f5c518", color: plan.highlight ? "#fff" : "#000", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", padding: "4px 14px", borderRadius: "20px", whiteSpace: "nowrap" }}>
                {plan.badge}
              </div>
            )}

            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "6px", color: plan.color }}>{plan.name}</h3>

            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontSize: "2.4rem", fontWeight: 900 }}>{plan.priceLabel}</span>
              <span style={{ color: "#555", fontSize: "0.85rem", marginLeft: "6px" }}>/{plan.period}</span>
            </div>

            <ul style={{ listStyle: "none", padding: 0, marginBottom: "26px" }}>
              {plan.features.map((f, i) => (
                <li key={i} style={{ padding: "9px 0", color: f.ok ? "#bbb" : "#333", fontSize: "0.87rem", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: f.ok ? "#4ade80" : "#2a2a2a", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>{f.ok ? "✓" : "✕"}</span>
                  {f.text}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan)}
              disabled={loading === plan.id || plan.id === "FREE" || (user?.isSubscribed && plan.id !== "FREE")}
              style={{
                width: "100%", padding: "13px", borderRadius: "11px",
                fontWeight: 700, cursor: (plan.id === "FREE" || user?.isSubscribed) ? "not-allowed" : "pointer",
                fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif",
                background: plan.id === "FREE"
                  ? "rgba(255,255,255,0.05)"
                  : plan.highlight
                  ? (loading === plan.id ? "#555" : "#e50914")
                  : (loading === plan.id ? "#555" : "rgba(245,197,24,0.12)"),
                color: plan.id === "FREE"
                  ? "#444"
                  : plan.highlight
                  ? "#fff"
                  : "#f5c518",
                border: plan.id === "FREE"
                  ? "1px solid rgba(255,255,255,0.06)"
                  : plan.highlight
                  ? "none"
                  : "1px solid rgba(245,197,24,0.3)",
                opacity: (user?.isSubscribed && plan.id !== "FREE") ? 0.4 : 1,
                transition: "all 0.2s",
              }}
            >
              {loading === plan.id
                ? "Redirecting to payment..."
                : plan.id === "FREE"
                ? "Current Free Plan"
                : user?.isSubscribed
                ? "Already Subscribed"
                : plan.cta}
            </button>

            {/* Payment methods note */}
            {plan.id !== "FREE" && (
              <p style={{ color: "#333", fontSize: "0.72rem", textAlign: "center", marginTop: "10px" }}>
                bKash · Nagad · Rocket · Card
              </p>
            )}
          </div>
        ))}
      </div>

      {/* SSLCommerz badge */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "12px 20px" }}>
          <span style={{ fontSize: "1.2rem" }}>🔒</span>
          <span style={{ color: "#555", fontSize: "0.83rem" }}>Secured by <strong style={{ color: "#888" }}>SSLCommerz</strong> — Bangladesh's #1 payment gateway</span>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 5vw 80px" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "'Playfair Display', serif", textAlign: "center", marginBottom: "36px" }}>
          Frequently Asked Questions
        </h2>
        {FAQ.map((item, i) => (
          <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "4px" }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ width: "100%", background: "transparent", border: "none", color: "#fff", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", fontWeight: 700, fontSize: "0.95rem", fontFamily: "'DM Sans', sans-serif" }}>
              {item.q}
              <span style={{ color: "#e50914", fontSize: "1.3rem", transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", flexShrink: 0, marginLeft: "16px" }}>+</span>
            </button>
            {openFaq === i && (
              <p style={{ color: "#777", lineHeight: 1.75, paddingBottom: "16px", fontSize: "0.9rem" }}>{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}