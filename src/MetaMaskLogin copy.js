import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function MetaMaskLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (localStorage.getItem("token")) return <Navigate to="/" replace />;

  async function connectWallet() {
    try {
      setError("");
      if (!window.ethereum) {
        alert("MetaMask not detected.");
        return;
      }

      setLoading(true);

      // 1️⃣ Connect wallet
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const wallet = accounts[0].trim().toLowerCase(); // <-- TRIM + LOWERCASE for backend

      // 2️⃣ Request nonce
      const nonceRes = await fetch(`${API}/auth/request-nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });

      if (!nonceRes.ok) {
        const errData = await nonceRes.json();
        throw new Error(errData.message || "Failed to get nonce");
      }

      const nonceData = await nonceRes.json();
      const message = `Login nonce: ${nonceData.nonce}`;

      // 3️⃣ Sign message
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, accounts[0]], // original case
      });

      // 4️⃣ Verify signature
      const verifyRes = await fetch(`${API}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet, signature }),
      });

      if (!verifyRes.ok) {
        const errData = await verifyRes.json();
        throw new Error(errData.message || "Login verification failed");
      }

      const verifyData = await verifyRes.json();

      localStorage.setItem("token", verifyData.token);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError("Login failed: " + err.message);
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login with MetaMask</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={connectWallet}
        disabled={loading}
        style={{ padding: "8px 15px", cursor: "pointer" }}
      >
        {loading ? "Connecting..." : "Connect MetaMask"}
      </button>
    </div>
  );
}
