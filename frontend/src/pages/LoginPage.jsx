import React, { useState } from 'react';
import { login } from '../services/api';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await login(email, password);
      localStorage.setItem('accesstoken', response.accesstoken);
      localStorage.setItem('useremail', email);
      onLogin({ email });
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container glass-card animate-fade-in">
        {/* Logo */}
        <div className="login-logo">
          <img 
            src="/credpulse-full-logo.png" 
            alt="CredPulse"
            style={{ height: '60px', width: 'auto' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <h1 className="gradient-text" style={{ display: 'none' }}>CredPulse</h1>
        </div>
        
        <p className="login-subtitle">MSME Credit Intelligence Platform</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="merchant@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <a href="#register">Register</a>
        </p>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-6);
          background: linear-gradient(135deg, 
            rgba(16, 185, 129, 0.1) 0%, 
            rgba(31, 67, 78, 0.1) 100%),
            var(--bg-primary);
        }
        
        .login-container {
          width: 100%;
          max-width: 440px;
          padding: var(--space-10);
        }
        
        .login-logo {
          text-align: center;
          margin-bottom: var(--space-3);
        }
        
        .login-logo h1 {
          font-size: 2.5rem;
          margin: 0;
        }
        
        .login-subtitle {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: var(--space-8);
          font-size: 0.95rem;
        }
        
        .error-message {
          padding: var(--space-4);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error);
          border-radius: var(--radius-md);
          color: var(--error);
          margin-bottom: var(--space-6);
          font-size: 0.9rem;
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        
        .form-group label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        
        .btn-full {
          width: 100%;
          padding: var(--space-4);
          margin-top: var(--space-2);
        }
        
        .register-link {
          text-align: center;
          margin-top: var(--space-6);
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .register-link a {
          color: var(--brand-primary);
          font-weight: 600;
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        
        .register-link a:hover {
          color: var(--brand-hover);
        }
      `}</style>
    </div>
  );
}
