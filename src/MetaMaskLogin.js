import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function MetaMaskLogin() {
  const [loading, setLoading] = useState(false);

  // Already logged in? Redirect to home.
  if (localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected.");
        return;
      }

      setLoading(true);

      // 1. Connect Wallet
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const wallet = accounts[0];

      // 2. Request nonce
      const nonceRes = await fetch("http://localhost:5000/auth/request-nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });

      const nonceData = await nonceRes.json();
      const message = `Login nonce: ${nonceData.nonce}`;

      // 3. Sign message
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, wallet],
      });

      // 4. Verify signature & get JWT
      const verifyRes = await fetch("http://localhost:5000/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet, signature }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.token) {
        alert("Login failed.");
        return;
      }

      // 5. Save JWT
      localStorage.setItem("token", verifyData.token);

      // 6. Redirect home
      window.location.href = "/";
    } catch (err) {
      alert("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login with MetaMask</h2>

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

export default MetaMaskLogin;
