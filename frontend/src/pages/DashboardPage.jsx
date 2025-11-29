import React from 'react';
import { 
  HiDocumentText, 
  HiCheckCircle, 
  HiClock, 
  HiCurrencyDollar,
  HiTrendingUp,
  HiArrowRight
} from 'react-icons/hi';

export default function DashboardPage() {
  const stats = [
    {
      label: 'Total Invoices',
      value: '12',
      change: '+12%',
      icon: <HiDocumentText />,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'var(--accent-blue)'
    },
    {
      label: 'Verified',
      value: '8',
      change: '+8%',
      icon: <HiCheckCircle />,
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'var(--success)'
    },
    {
      label: 'Pending Offers',
      value: '3',
      change: '-2',
      icon: <HiClock />,
      gradient: 'from-amber-500 to-orange-500',
      bgColor: 'var(--warning)'
    },
    {
      label: 'Total Amount',
      value: '₹5.2L',
      change: '+18%',
      icon: <HiCurrencyDollar />,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'var(--accent-purple)'
    }
  ];

  const recentActivity = [
    { event: 'Invoice INV-001 verified', time: '2 hours ago', status: 'success' },
    { event: 'Offer received for INV-002 @ 2.5% rate', time: '5 hours ago', status: 'info' },
    { event: 'Payment received for INV-003', time: '1 day ago', status: 'success' },
  ];

  return (
    <div className="dashboard-page">
      {/* Hero Section */}
      <div className="hero-section animate-fade-in">
        <div>
          <h1 className="gradient-text">Welcome Back!</h1>
          <p className="hero-subtitle">Here's your credit intelligence overview</p>
        </div>
        <button className="btn btn-primary">
          <HiTrendingUp />
          View Analytics
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="stat-card glass-card animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="stat-icon" style={{ background: stat.bgColor }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <span className={`stat-change ${stat.change.includes('+') ? 'positive' : 'negative'}`}>
                {stat.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="activity-section glass-card animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="section-header">
          <h2>Recent Activity</h2>
          <button className="btn btn-secondary btn-sm">
            View All <HiArrowRight />
          </button>
        </div>
        <div className="activity-list">
          {recentActivity.map((item, index) => (
            <div key={index} className="activity-item">
              <div className="activity-content">
                <p className="activity-event">{item.event}</p>
                <span className="activity-time">{item.time}</span>
              </div>
              <span className={`badge badge-${item.status}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }
        
        .hero-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
        }
        
        .hero-section h1 {
          font-size: 2.5rem;
          margin-bottom: var(--space-2);
        }
        
        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-6);
        }
        
        .stat-card {
          display: flex;
          gap: var(--space-4);
          padding: var(--space-6);
          position: relative;
          overflow: hidden;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--brand-primary);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }
        
        .stat-card:hover::before {
          opacity: 1;
        }
        
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          color: white;
          flex-shrink: 0;
        }
        
        .stat-content {
          flex: 1;
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-1);
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }
        
        .stat-change {
          font-size: 0.8rem;
          font-weight: 600;
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
        }
        
        .stat-change.positive {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
        }
        
        .stat-change.negative {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }
        
        .activity-section {
          padding: var(--space-6);
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
        }
        
        .section-header h2 {
          font-size: 1.5rem;
          color: var(--text-primary);
        }
        
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        
        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4);
          border-radius: var(--radius-md);
          background: var(--bg-tertiary);
          transition: all var(--transition-fast);
        }
        
        .activity-item:hover {
          background: var(--bg-secondary);
          transform: translateX(4px);
        }
        
        .activity-content {
          flex: 1;
        }
        
        .activity-event {
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }
        
        .activity-time {
          font-size: 0.85rem;
          color: var(--text-tertiary);
        }
        
        .badge {
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .badge-success {
          background: rgba(16, 185, 129, 0.15);
          color: var(--success);
        }
        
        .badge-info {
          background: rgba(59, 130, 246, 0.15);
          color: var(--info);
        }
        
        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-4);
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
