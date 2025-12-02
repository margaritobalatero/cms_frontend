import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const API = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  // LOAD ARTICLE (hook is NOT conditional)
  useEffect(() => {
    axios.get(`${API}/api/articles/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => setArticle(res.data))
    .catch(() => setError("Failed to load article"));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete?")) return;

    try {
      await axios.delete(`${API}/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/");
    } catch {
      setError("Failed to delete article");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!article) return <p>Loading...</p>;

  return (
    <div style={{ background: "#fff", padding: 20 }}>
      <h2>{article.title}</h2>
      <p>Created: {new Date(article.createdAt).toLocaleString()}</p>

      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(article.content)
        }}
      />

      <br />

      <Link to={`/edit/${article._id}`}><button>Edit</button></Link>
      <button onClick={handleDelete}>Delete</button>
      <Link to="/"><button>Back</button></Link>
    </div>
  );
}

export default ArticleDetail;
