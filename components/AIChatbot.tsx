"use client";
import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";

const INITIAL_MESSAGES = [
  { role: "bot", content: "Hi there! I'm your CineTube AI assistant. How can I help you today? I can recommend movies, explain our Pro plans, or help you navigate the site." },
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = "I'm not sure about that. Try asking about our 'Pro Plan' or 'Action Movies'!";
      
      const low = userMsg.toLowerCase();
      if (low.includes("hello") || low.includes("hi")) response = "Hello! Ready to find your next favorite movie?";
      else if (low.includes("recommend") || low.includes("movie") || low.includes("suggest")) response = "Based on trending data, I recommend watching 'Oppenheimer' or 'Dune: Part Two'. Both are available in 4K for Pro members!";
      else if (low.includes("pro") || low.includes("plan") || low.includes("price") || low.includes("subscription")) response = "Our Pro Plan starts at just ৳299/month. You get 4K streaming, offline downloads, and no ads!";
      else if (low.includes("admin") || low.includes("dashboard")) response = "The Admin Dashboard is only for authorized personnel. You can manage media, users, and reviews there.";
      else if (low.includes("search")) response = "You can use the search bar at the top of the 'Media' page to filter by genre, year, or rating.";

      setMessages(prev => [...prev, { role: "bot", content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 9999, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: "60px", height: "60px", borderRadius: "50%",
            background: "linear-gradient(135deg, #e50914, #c0070f)",
            color: "#fff", border: "none", cursor: "pointer",
            boxShadow: "0 8px 32px rgba(229,9,20,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1) rotate(5deg)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1) rotate(0deg)"}
        >
          <Sparkles size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: "360px", height: "500px", background: "#0f0f11",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px",
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
          animation: "slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <style>{`
            @keyframes slideIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            .msg-user { align-self: flex-end; background: #e50914; color: #fff; border-radius: 15px 15px 2px 15px; }
            .msg-bot { align-self: flex-start; background: rgba(255,255,255,0.06); color: #ccc; border-radius: 15px 15px 15px 2px; }
          `}</style>

          {/* Header */}
          <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#e50914", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={18} color="#fff" />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>CineTube AI</p>
                <p style={{ fontSize: "0.7rem", color: "#4ade80" }}>● Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "msg-user" : "msg-bot"} style={{ padding: "10px 14px", maxWidth: "80%", fontSize: "0.88rem", lineHeight: 1.5 }}>
                {msg.content}
              </div>
            ))}
            {isTyping && (
              <div className="msg-bot" style={{ padding: "10px 14px", fontSize: "0.8rem", color: "#666" }}>
                AI is typing...
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", gap: "8px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "4px" }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Ask something..."
                style={{ flex: 1, background: "transparent", border: "none", color: "#fff", padding: "10px 14px", outline: "none", fontSize: "0.88rem", fontFamily: "inherit" }}
              />
              <button
                onClick={handleSend}
                style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#e50914", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
