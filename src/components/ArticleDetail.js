import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

// ✅ Use environment variable for backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setArticle(res.data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        navigate('/');
      } catch (err) {
        console.error('Error deleting article:', err);
        alert('Failed to delete article.');
      }
    }
  };

  if (loading) return <p>Loading article...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!article) return <p>No article found.</p>;

  // Sanitize content allowing basic tags
  const cleanHTML = DOMPurify.sanitize(article.content, {
    ALLOWED_TAGS: ['pre', 'b', 'i', 'u', 'p', 'br', 'strong', 'em'],
  });

  return (
    <div>
      <h2>{article.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
      <p>
        <small>Created at: {new Date(article.createdAt).toLocaleString()}</small>
      </p>
      <Link to={`/edit/${article._id}`}>Edit</Link> |{' '}
      <button onClick={handleDelete}>Delete</button> |{' '}
      <Link to="/">Back</Link>
    </div>
  );
}

export default ArticleDetail;
