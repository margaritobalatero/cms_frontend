import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const API_BASE_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const getWalletFromToken = () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.wallet;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    if (!token) {
      setError('Please login first');
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.userId !== getWalletFromToken()) {
          setError('You are not authorized to view this article.');
          setArticle(null);
        } else {
          setArticle(res.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load article.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, token]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to delete article.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!article) return <p>Article not found.</p>;

  const cleanHTML = DOMPurify.sanitize(article.content, {
    ALLOWED_TAGS: ['pre', 'b', 'i', 'u', 'p', 'br', 'strong', 'em'],
  });

  return (
    <div
