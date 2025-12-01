import React, { useState } from "react";
import { Navigate } from "react-router-dom";

// ✅ Set your backend URL here
// Use localhost for development, deployed URL for production
const API =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function MetaMaskLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  if (localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  async function connectWallet() {
    try {
      setError("");
      if (!window.ethereum) {
        alert("MetaMask not detected.");
        return;
      }

      setLoading(true);

      // 1️⃣ Connect Wallet
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const wallet = accounts[0];

      // 2️⃣ Request nonce from backend
      const nonceRes = await fetch(`${API}/auth/request-nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });

      if (!nonceRes.ok) throw new Error("Failed to get nonce");

      const nonceData = await nonceRes.json();
      const message = `Login nonce: ${nonceData.nonce}`;

      // 3️⃣ Sign message with MetaMask
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, wallet],
      });

      // 4️⃣ Verify signature on backend
      const verifyRes = await fetch(`${API}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet, signature }),
      });

      if (!verifyRes.ok) throw new Error("Login verification failed");

      const verifyData = await verifyRes.json();

      if (!verifyData.token) throw new Error("No token received");

      // 5️⃣ Save JWT in localStorage
      localStorage.setItem("token", verifyData.token);

      // 6️⃣ Redirect to home or dashboard
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
