import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

export default function Auth() {
  const navigate = useNavigate();
  const isLogin = window.location.pathname === '/login';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'An error occurred');
        return;
      }

      // Store token if login/register successful
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Header Box */}
      <div className="rpg-box header-box">
        <h1 className="title">DSA QUEST</h1>
        <p className="subtitle">
          {isLogin ? 'CONTINUE YOUR JOURNEY' : 'BEGIN YOUR LEGEND'}
        </p>
      </div>

      {/* Form Box */}
      <div className="rpg-box form-box">
        <div className="corner-accent top-left"></div>
        <div className="corner-accent top-right"></div>
        <div className="corner-accent bottom-left"></div>
        <div className="corner-accent bottom-right"></div>

        <form onSubmit={handleSubmit} className="form">
          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Username Field */}
          <div className="form-group">
            <label className="form-label">HERO NAME (EMAIL)</label>
            <input
              type="text"
              className="form-input"
              placeholder="hero@guild.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">SECRET CODE (PASSWORD)</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'LOADING...' : isLogin ? 'ENTER WORLD' : 'CREATE HERO'}
          </button>
        </form>
      </div>

      {/* Toggle Auth Mode */}
      <div className="auth-toggle">
        <button
          onClick={() => {
            navigate(isLogin ? '/signup' : '/login');
            setError('');
            setUsername('');
            setPassword('');
          }}
          className="toggle-btn"
          disabled={loading}
        >
          {isLogin
            ? "[ DON'T HAVE AN ACCOUNT? SIGN UP ]"
            : "[ ALREADY A HERO? LOG IN ]"}
        </button>
      </div>
    </div>
  );
}
