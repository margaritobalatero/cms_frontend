import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleForm from './components/ArticleForm';
import ArticleDetail from './components/ArticleDetail';
import MetaMaskLogin from './MetaMaskLogin';

// === Protected Route Wrapper ===
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// === Logout Function ===
function LogoutButton() {
  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <button 
      onClick={handleLogout}
      style={{
        marginLeft: "10px",
        padding: "5px 10px",
        cursor: "pointer"
      }}
    >
      Logout
    </button>
  );
}

function App() {
  const loggedIn = !!localStorage.getItem("token");

  return (
    <Router>
      <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
        <h1 style={{ 
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
}}>
  <img 
    src="/jie.png" 
    alt="Logo" 
    style={{ width: '40px', height: '40px', borderRadius: '6px' }}
  />
  Junjie Notes
</h1>


        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/new">New Article</Link>

          {" | "}
          {!loggedIn && <Link to="/login">Login</Link>}
          {loggedIn && <LogoutButton />}
        </nav>

        <Routes>
          {/* Public */}
          <Route path="/login" element={<MetaMaskLogin />} />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <ArticleList />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/new" 
            element={
              <ProtectedRoute>
                <ArticleForm />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/edit/:id" 
            element={
              <ProtectedRoute>
                <ArticleForm />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/article/:id" 
            element={
              <ProtectedRoute>
                <ArticleDetail />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
