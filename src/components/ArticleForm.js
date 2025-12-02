import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

export default function ArticleForm() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchArticle = async () => {
      if (!token || !id) return; // Hooks always called, just early exit inside

      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/articles/${id}`, {
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
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login first");
    if (!title || !content) return alert("Title and content required");

    setLoading(true);
    try {
      if (id) {
        await axios.put(
          `${API_BASE_URL}/api/articles/${id}`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Article updated!");
      } else {
        await axios.post(
          `${API_BASE_URL}/api/articles`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Article created!");
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {!token && <p>Please login first.</p>}
      <h2>{id ? "Edit Article" : "Create New Article"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: 300 }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: 300, height: 100 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : id ? "Update Article" : "Create Article"}
        </button>
      </form>
    </div>
  );
}
