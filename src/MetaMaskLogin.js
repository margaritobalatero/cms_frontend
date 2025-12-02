// src/components/MetaMaskLogin.js
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

function MetaMaskLogin() {
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not found");
        return;
      }

      // Request accounts
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const wallet = accounts[0].toLowerCase();

      // 1. Request nonce
      const nonceRes = await axios.post(`${API}/auth/request-nonce`, { userId: wallet });
      const message = `Login nonce: ${nonceRes.data.nonce}`;

      // 2. Sign nonce
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, wallet],
      });

      // 3. Verify
      const verifyRes = await axios.post(`${API}/auth/verify`, { userId: wallet, signature });

      // Save JWT and wallet locally
      localStorage.setItem("token", verifyRes.data.token);
      localStorage.setItem("wallet", wallet);

      alert("Login success!");
      // Redirect to home page
      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div style={{ marginTop: "50px", textAlign: "center" }}>
      <h2>Login with MetaMask</h2>
      <button
        onClick={connectWallet}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "6px",
          backgroundColor: "#f6851b",
          color: "#fff",
          border: "none",
        }}
      >
        Connect Wallet
      </button>
    </div>
  );
}

export default MetaMaskLogin;
