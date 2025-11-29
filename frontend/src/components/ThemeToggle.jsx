import React from 'react';
import { HiSun, HiMoon } from 'react-icons/hi';

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-track">
        <div className={`theme-toggle-thumb ${theme === 'dark' ? 'active' : ''}`}>
          {theme === 'light' ? <HiSun /> : <HiMoon />}
        </div>
      </div>
      
      <style jsx>{`
        .theme-toggle {
          position: relative;
          width: 60px;
          height: 32px;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-normal);
          padding: 0;
        }
        
        .theme-toggle:hover {
          border-color: var(--brand-primary);
          box-shadow: var(--shadow-glow);
        }
        
        .theme-toggle-track {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .theme-toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, var(--brand-primary), var(--brand-hover));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          transition: transform var(--transition-normal);
          box-shadow: var(--shadow-md);
        }
        
        .theme-toggle-thumb.active {
          transform: translateX(28px);
        }
      `}</style>
    </button>
  );
}
