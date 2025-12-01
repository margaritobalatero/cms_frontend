import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

// ✅ Use env variable for backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ArticleForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  // Load article if editing
  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/articles/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setTitle(res.data.title);
          setContent(res.data.content);
        } catch (err) {
          console.error('Error fetching article:', err);
          setError('Failed to load article');
        }
      };
      fetchArticle();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      if (id) {
        await axios.put(`${API_BASE_URL}/api/articles/${id}`, { title, content }, { headers });
      } else {
        await axios.post(`${API_BASE_URL}/api/articles`, { title, content }, { headers });
      }
      navigate('/');
    } catch (err) {
      console.error('Error saving article:', err);
      setError('Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit' : 'New'} Article</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Content:</label>
          <br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? (id ? 'Updating...' : 'Creating...') : id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}

export default ArticleForm;
