import React from 'react';
import { 
  HiHome, 
  HiUpload, 
  HiLightningBolt, 
  HiCurrencyDollar, 
  HiShieldCheck, 
  HiClipboardList 
} from 'react-icons/hi';

export default function Sidebar({ currentPage, setCurrentPage, isOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HiHome /> },
    { id: 'upload-invoice', label: 'Upload Invoice', icon: <HiUpload /> },
    { id: 'agent-analysis', label: 'AI Agents', icon: <HiLightningBolt /> },
    { id: 'offers', label: 'Offers', icon: <HiCurrencyDollar /> },
    { id: 'consent', label: 'Consent', icon: <HiShieldCheck /> },
    { id: 'audit', label: 'Audit Trail', icon: <HiClipboardList /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            className={`sidebar-item glass-card ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
            {currentPage === item.id && <div className="active-indicator" />}
          </button>
        ))}
      </nav>
      
      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 70px;
          left: 0;
          width: 280px;
          height: calc(100vh - 70px);
          background: var(--bg-primary);
          border-right: 1px solid var(--border-color);
          padding: var(--space-6);
          transition: transform var(--transition-normal);
          z-index: var(--z-dropdown);
          overflow-y: auto;
        }
        
        .sidebar.closed {
          transform: translateX(-100%);
        }
        
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4) var(--space-5);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          position: relative;
          animation: slideInRight 0.4s ease both;
          text-align: left;
          width: 100%;
        }
        
        .sidebar-item:hover {
          background: var(--glass-bg);
          border-color: var(--brand-primary);
          color: var(--text-primary);
          transform: translateX(4px);
        }
        
        .sidebar-item.active {
          background: linear-gradient(135deg, var(--brand-primary), var(--brand-hover));
          border-color: var(--brand-primary);
          color: white;
          box-shadow: var(--shadow-glow);
        }
        
        .sidebar-icon {
          font-size: 1.25rem;
          min-width: 24px;
        }
        
        .sidebar-label {
          flex: 1;
        }
        
        .active-indicator {
          position: absolute;
          right: -1px;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 60%;
          background: white;
          border-radius: 4px 0 0 4px;
        }
        
        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            transform: translateX(-100%);
          }
          
          .sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
}
