import { useState } from "react";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function makeCall() {
    setLoading(true);
    setStatus("⏳ Dzwonię...");
    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("✅ Połączenie rozpoczęte! Call ID: " + data.callId);
      } else {
        setStatus("❌ Błąd: " + (data.error || "nieznany"));
      }
    } catch (e) {
      setStatus("❌ Błąd: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 420, margin: "60px auto", padding: 20 }}>
      <h1>📞 CallAgent Backend</h1>
      <p>Ten backend bezpiecznie woła Vapi API po stronie serwera (brak CORS).</p>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+48601234567"
        style={{ width: "100%", padding: 12, fontSize: 16, marginBottom: 12, boxSizing: "border-box" }}
      />
      <button
        onClick={makeCall}
        disabled={loading || !phone}
        style={{ width: "100%", padding: 14, fontSize: 16, background: "#16A34A", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
      >
        {loading ? "Dzwonię..." : "Zadzwoń"}
      </button>
      {status && <p style={{ marginTop: 16 }}>{status}</p>}
    </div>
  );
}
