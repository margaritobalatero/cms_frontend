import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

// Dynamic API base URL (safe for Vercel)
const API_BASE_URL =
  typeof window !== "undefined"
    ? `http://${window.location.hostname}:5000`
    : "";

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();

  useEffect(function () {
    if (!API_BASE_URL) return; // prevent build-time errors
    axios.get(API_BASE_URL + '/api/articles/' + id)
      .then(function (res) { setArticle(res.data); })
      .catch(function (err) { console.error(err); });
  }, [id]);

  const handleDelete = async function () {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await axios.delete(API_BASE_URL + '/api/articles/' + id);
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!article) return <p>Loading...</p>;

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
      <Link to={`/edit/${article._id}`}>Edit</Link> |
      <button onClick={handleDelete}>Delete</button> |
      <Link to="/">Back</Link>
    </div>
  );
}

export default ArticleDetail;
