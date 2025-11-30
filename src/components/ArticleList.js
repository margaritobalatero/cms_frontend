import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Dynamic API URL
const API_BASE_URL = `http://${window.location.hostname}:5000`;

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');

  // Load all articles
  const fetchArticles = () => {
    axios.get(`${API_BASE_URL}/api/articles`)
      .then(res => setArticles(res.data))
      .catch(console.error);
  };

  // Search articles
  const searchArticles = (keyword) => {
    axios.get(`${API_BASE_URL}/api/articles/search?q=${keyword}`)
      .then(res => setArticles(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // When search changes, reload or filter
  useEffect(() => {
    if (search.trim() === '') {
      fetchArticles();
    } else {
      searchArticles(search);
    }
  }, [search]);

  return (
    <div>
      <h2>Articles</h2>

      {/* 🔍 Search Bar */}
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

      <ul>
        {articles.map(article => (
          <li key={article._id}>
            <Link to={`/article/${article._id}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArticleList;
