"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", paddingTop: "120px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 5vw" }}>
        
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 900, fontFamily: "'Playfair Display', serif", marginBottom: "16px" }}>Get in Touch</h1>
          <p style={{ color: "#666", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
            Have a question about your subscription? Found a bug? Or just want to talk about movies? Our team is here for you.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "48px" }}>
          
          {/* Info */}
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "32px", fontFamily: "'Playfair Display', serif" }}>Contact Information</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <ContactItem icon={<Mail color="#e50914" />} label="Email Us" value="support@cinetube.com" />
              <ContactItem icon={<Phone color="#e50914" />} label="Call Us" value="+880 1234 567 890" />
              <ContactItem icon={<MapPin color="#e50914" />} label="Our Office" value="Level 4, Cinema Plaza, Dhaka, Bangladesh" />
            </div>

            <div style={{ marginTop: "48px", padding: "32px", background: "rgba(229,9,20,0.05)", border: "1px solid rgba(229,9,20,0.15)", borderRadius: "20px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px", color: "#e50914" }}>Business Inquiries</h3>
              <p style={{ color: "#888", fontSize: "0.9rem", lineHeight: 1.6 }}>
                For partnership opportunities or content licensing, please reach out to our media department at <strong style={{ color: "#ccc" }}>media@cinetube.com</strong>.
              </p>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", padding: "40px" }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <Input label="Name" value={form.name} onChange={v => setForm({...form, name: v})} placeholder="John Doe" />
                <Input label="Email" value={form.email} onChange={v => setForm({...form, email: v})} placeholder="john@example.com" type="email" />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <Input label="Subject" value={form.subject} onChange={v => setForm({...form, subject: v})} placeholder="How can we help?" />
              </div>
              <div style={{ marginBottom: "32px" }}>
                <label style={{ display: "block", color: "#555", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Message</label>
                <textarea 
                  required
                  value={form.message} 
                  onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Your message here..." 
                  rows={5}
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "14px", color: "#fff", fontSize: "0.95rem", outline: "none", fontFamily: "inherit", resize: "none" }}
                />
              </div>

              {sent && (
                <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "10px", padding: "14px", marginBottom: "24px", color: "#4ade80", fontSize: "0.9rem", textAlign: "center" }}>
                  ✅ Your message has been sent successfully!
                </div>
              )}

              <button type="submit" style={{ width: "100%", background: "#e50914", color: "#fff", border: "none", borderRadius: "12px", padding: "16px", fontWeight: 800, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <div>
        <p style={{ color: "#555", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>{label}</p>
        <p style={{ fontWeight: 600, fontSize: "1rem" }}>{value}</p>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string, value: string, onChange: (v: string) => void, placeholder: string, type?: string }) {
  return (
    <div style={{ width: "100%" }}>
      <label style={{ display: "block", color: "#555", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{label}</label>
      <input 
        required
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "14px", color: "#fff", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} 
      />
    </div>
  );
}
