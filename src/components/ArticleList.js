import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ✅ Use env variable for backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');

  // Load all articles
  const fetchArticles = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/articles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setArticles(res.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setArticles([]);
    }
  };

  // Search articles
  const searchArticles = async (keyword) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/articles/search?q=${keyword}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setArticles(res.data);
    } catch (err) {
      console.error('Error searching articles:', err);
      setArticles([]);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // When search changes
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
