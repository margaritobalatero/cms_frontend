// src/components/ArticleDetail.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";

const API = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await axios.get(`${API}/api/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setArticle(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to delete article");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!article) return <p>Article not found.</p>;

  const cleanHTML = DOMPurify.sanitize(article.content, {
    ALLOWED_TAGS: ["pre", "b", "i", "u", "p", "br", "strong", "em"],
  });

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        color: "#000",
        fontSize: "18px",
        lineHeight: "1.8",
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: "24px" }}>{article.title}</h2>
      <p style={{ fontSize: "14px", color: "#000" }}>
        Created at: {new Date(article.createdAt).toLocaleString()}
      </p>
      <div
        style={{ margin: "20px 0" }}
        dangerouslySetInnerHTML={{ __html: cleanHTML }}
      />
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Link to={`/edit/${article._id}`}>
          <button>Edit</button>
        </Link>
        <button onClick={handleDelete}>Delete</button>
        <Link to="/">
          <button>Back</button>
        </Link>
      </div>
    </div>
  );
}

export default ArticleDetail;
