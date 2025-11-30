import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleForm from './components/ArticleForm';
import ArticleDetail from './components/ArticleDetail';

function App() {
  return (
    <Router>
      <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
        <h1>Junjie Notes</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/new">New Article</Link>
        </nav>
        <Routes>
          <Route path="/" element={<ArticleList />} />
          <Route path="/new" element={<ArticleForm />} />
          <Route path="/edit/:id" element={<ArticleForm />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
