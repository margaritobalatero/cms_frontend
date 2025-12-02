// src/components/ArticleForm.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        console.error(err);
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (id) {
        await axios.put(
          `${API}/api/articles/${id}`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API}/api/articles`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        maxWidth: "600px",
        margin: "20px auto",
      }}
    >
      <h2>{id ? "Edit Article" : "New Article"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="8"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Article"}
        </button>
      </form>
    </div>
  );
}

export default ArticleForm;
