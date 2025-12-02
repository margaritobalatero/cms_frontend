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

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const wallet = accounts[0].toLowerCase();

      // 1. Request nonce
      const nonceRes = await axios.post(`${API}/auth/request-nonce`, { wallet });
      const message = `Login nonce: ${nonceRes.data.nonce}`;

      // 2. Sign nonce
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, wallet]
      });

      // 3. Verify
      const verifyRes = await axios.post(`${API}/auth/verify`, { wallet, signature });

      localStorage.setItem("token", verifyRes.data.token);
      localStorage.setItem("wallet", wallet);

      alert("Login success!");
      if (onLogin) onLogin();

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <button onClick={connectWallet}>
      Connect with MetaMask
    </button>
  );
}

export default MetaMaskLogin;
