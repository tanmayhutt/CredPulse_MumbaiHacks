import React from 'react';
import { HiMenuAlt2, HiX } from 'react-icons/hi';
import ThemeToggle from './ThemeToggle';

export default function Header({ user, onLogout, theme, toggleTheme, toggleSidebar }) {
  return (
    <header className="header glass-card">
      <div className="header-content">
        <div className="header-left">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <HiMenuAlt2 />
          </button>
          
          <div className="logo">
            <img 
              src="/credpulse-full-logo.png" 
              alt="CredPulse" 
              className="logo-image"
              onError={(e) => {
                // Fallback to text if image not found
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="logo-text gradient-text" style={{display: 'none'}}>
              CredPulse
            </span>
          </div>
        </div>
        
        <div className="header-right">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          
          <div className="user-badge glass-card">
            <div className="user-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="user-email">{user?.email}</span>
          </div>
          
          <button className="btn btn-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          z-index: var(--z-sticky);
          border-bottom: 1px solid var(--border-color);
          padding: 0 var(--space-6);
        }
        
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          max-width: 100%;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        
        .sidebar-toggle {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: var(--text-primary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .sidebar-toggle:hover {
          background: var(--brand-primary);
          color: white;
          border-color: var(--brand-primary);
        }
        
        .logo {
          display: flex;
          align-items: center;
        }
        
        .logo-image {
          height: 40px;
          width: auto;
        }
        
        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        
        .user-badge {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2) var(--space-4);
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-primary), var(--brand-hover));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .user-email {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        
        @media (max-width: 768px) {
          .user-email {
            display: none;
          }
          .header {
            padding: 0 var(--space-4);
          }
        }
      `}</style>
    </header>
  );
}
