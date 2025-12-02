// src/components/MetaMaskLogin.js
import React from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

function MetaMaskLogin({ onLogin }) {
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not found");
        return;
      }

      // Request wallet accounts
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const userId = accounts[0].toLowerCase();

      // Step 1: request nonce
      const nonceRes = await axios.post(`${API}/auth/request-nonce`, { userId });
      const message = `Login nonce: ${nonceRes.data.nonce}`;

      // Step 2: sign the nonce
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, userId]
      });

      // Step 3: verify signature
      const verifyRes = await axios.post(`${API}/auth/verify`, { userId, signature });

      // Save token and userId
      localStorage.setItem("token", verifyRes.data.token);
      localStorage.setItem("userId", userId);

      alert("Login success!");

      // Notify App.js
      if (onLogin) onLogin();

    } catch (err) {
      console.error(err);
      alert("Login failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <button
        onClick={connectWallet}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "5px",
          backgroundColor: "#f6851b",
          color: "#fff",
          border: "none"
        }}
      >
        Connect with MetaMask
      </button>
    </div>
  );
}

export default MetaMaskLogin;
