import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');

  const fetchArticles = () => {
    axios.get(`${API_BASE_URL}/api/articles`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setArticles(res.data))
      .catch(console.error);
  };

  const searchArticles = (keyword) => {
    axios.get(`${API_BASE_URL}/api/articles/search?q=${keyword}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setArticles(res.data))
      .catch(console.error);
  };

  useEffect(() => { fetchArticles(); }, []);
  useEffect(() => {
    if (search.trim() === '') fetchArticles();
    else searchArticles(search);
  }, [search]);

  return (
    <div>
      <h2>Articles</h2>
      <input
        type="text"
        placeholder="Search articles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '15px',
          fontSize: '16px',
        }}
      />

      {articles.length === 0 && <p>No articles found.</p>}

      <div style={{ display: 'grid', gap: '15px' }}>
        {articles.map(article => (
          <Link
            key={article._id}
            to={`/article/${article._id}`}
            style={{
              display: 'block',
              padding: '15px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              color: '#333',
              transition: 'transform 0.1s, box-shadow 0.2s',
            }}
          >
            <h3 style={{ margin: 0 }}>{article.title}</h3>
            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
              {new Date(article.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ArticleList;
