import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  if (!token) return <p>Please login first.</p>;

  const getWalletFromToken = () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.wallet;
    } catch (err) {
      return null;
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/articles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(res.data.filter(a => a.userId === getWalletFromToken()));
    } catch (err) {
      console.error(err);
      setError('Failed to fetch articles.');
    } finally {
      setLoading(false);
    }
  };

  const searchArticles = async (keyword) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/articles/search?q=${keyword}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter(a => a.userId === getWalletFromToken());
      setArticles(filtered);
    } catch (err) {
      console.error(err);
      setError('Failed to search articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);
  useEffect(() => {
    if (search.trim() === '') fetchArticles();
    else searchArticles(search);
  }, [search]);

  if (loading) return <p>Loading articles...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Articles</h2>

      <input
        type="text"
        placeholder="Search articles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '15px', fontSize: '16px' }}
      />

      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {articles.map(article => (
            <Link
              key={article._id}
              to={`/article/${article._id}`}
              style={{
                display: 'block',
                padding: '15px',
                backgroundColor: '#e9e9e9',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                textDecoration: 'none',
                color: '#333',
              }}
            >
              <h3 style={{ margin: 0 }}>{article.title}</h3>
              <p style={{ margin: '5px 0', color: '#444', fontSize: '14px' }}>
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
