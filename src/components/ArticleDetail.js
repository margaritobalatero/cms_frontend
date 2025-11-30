import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

// Dynamic API base URL (no hardcoded IP)
let API_BASE_URL = "";
if (typeof window !== "undefined") {
  API_BASE_URL = `http://${window.location.hostname}:5000`;
}


function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();

  useEffect(function() {
    axios.get(API_BASE_URL + '/api/articles/' + id)
      .then(function(res) { setArticle(res.data); })
      .catch(function(err) { console.error(err); });
  }, [id]);

  const handleDelete = async function() {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await axios.delete(API_BASE_URL + '/api/articles/' + id);
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!article) return React.createElement('p', null, 'Loading...');

  // Sanitize content allowing <pre> and some common tags
  const cleanHTML = DOMPurify.sanitize(article.content, {
    ALLOWED_TAGS: ['pre', 'b', 'i', 'u', 'p', 'br', 'strong', 'em'],
  });

  return (
    React.createElement('div', null,
      React.createElement('h2', null, article.title),
      React.createElement('div', { dangerouslySetInnerHTML: { __html: cleanHTML } }),
      React.createElement('p', null,
        React.createElement('small', null, 'Created at: ', new Date(article.createdAt).toLocaleString())
      ),
      React.createElement(Link, { to: '/edit/' + article._id }, 'Edit'),
      ' | ',
      React.createElement('button', { onClick: handleDelete }, 'Delete'),
      ' | ',
      React.createElement(Link, { to: '/' }, 'Back')
    )
  );
}

export default ArticleDetail;
