import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

function ArticleForm() {
  const { id } = useParams();  // if id exists → editing
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // LOAD ARTICLE IF EDITING
  useEffect(() => {
    if (!id) return; // not conditional hook — safe

    axios.get(`${API}/api/articles/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(res => {
      setTitle(res.data.title);
      setContent(res.data.content);
    })
    .catch(() => setError("Failed to load article"));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // UPDATE
        await axios.put(`${API}/api/articles/${id}`, 
          { title, content },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } else {
        // CREATE
        await axios.post(`${API}/api/articles`,
          { title, content },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to save article");
    }
  };

  return (
    <div>
      <h2>{id ? "Edit Article" : "Create Article"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          rows="10"
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <button type="submit">{id ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}

export default ArticleForm;
