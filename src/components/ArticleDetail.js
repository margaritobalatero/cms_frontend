import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const API_BASE_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/articles/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setArticle(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to delete article');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!article) return <p>Article not found.</p>;

  const cleanHTML = DOMPurify.sanitize(article.content, {
    ALLOWED_TAGS: ['pre', 'b', 'i', 'u', 'p', 'br', 'strong', 'em'],
  });

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ marginTop: 0 }}>{article.title}</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Created at: {new Date(article.createdAt).toLocaleString()}
      </p>
      <div
        style={{ margin: '20px 0', lineHeight: '1.6' }}
        dangerouslySetInnerHTML={{ __html: cleanHTML }}
      />
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
