import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');

  const fetchArticles = () => {
    axios.get(`${API}/api/articles`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    .then(res => setArticles(res.data))
    .catch(console.error);
  };

  const searchArticles = (keyword) => {
    axios.get(`${API}/api/articles/search?q=${keyword}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    .then(res => setArticles(res.data))
    .catch(console.error);
  };

  useEffect(() => { fetchArticles(); }, []);
  useEffect(() => {
    if (!search.trim()) fetchArticles();
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
      />

      {articles.length === 0 && <p>No articles found.</p>}

      {articles.map(a => (
        <Link key={a._id} to={`/article/${a._id}`}>
          <div style={{ padding: "12px", background: "#eee", borderRadius: 8 }}>
            <h3>{a.title}</h3>
            <p>{new Date(a.createdAt).toLocaleString()}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ArticleList;
