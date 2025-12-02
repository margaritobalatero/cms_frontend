// src/components/ArticleList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Fetch all articles for the logged-in user ---
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load articles");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Search articles by title/content ---
  const searchArticles = async (keyword) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Simple filter on title/content
      const filtered = res.data.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword.toLowerCase()) ||
          (item.content && item.content.toLowerCase().includes(keyword.toLowerCase()))
      );
      setArticles(filtered);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Search failed");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch articles on mount
  useEffect(() => {
    fetchArticles();
  }, []);

  // Update list when search changes
  useEffect(() => {
    if (search.trim() === "") fetchArticles();
    else searchArticles(search);
  }, [search]);

  if (loading) return <p>Loading articles...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (articles.length === 0) return <p>No articles found.</p>;

  return (
    <div>
      <h2>Articles</h2>

      <input
        type="text"
        placeholder="Search articles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "15px",
          fontSize: "16px",
        }}
      />

      <div style={{ display: "grid", gap: "15px" }}>
        {articles.map((article) => (
          <Link
            key={article._id}
            to={`/article/${article._id}`}
            style={{
              display: "block",
              padding: "15px",
              backgroundColor: "#e9e9e9",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              textDecoration: "none",
              color: "#333",
              transition: "transform 0.1s, box-shadow 0.2s",
            }}
          >
            <h3 style={{ margin: 0 }}>{article.title}</h3>
            <p style={{ margin: "5px 0", color: "#444", fontSize: "14px" }}>
              {new Date(article.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ArticleList;
