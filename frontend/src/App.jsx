import React, { useState, useEffect, createContext, useContext } from 'react';
import './styles/global.css';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InvoiceUploadPage from './pages/InvoiceUploadPage';
import AgentAnalysisPage from './pages/AgentAnalysisPage';
import OffersPage from './pages/OffersPage';
import ConsentPage from './pages/ConsentPage';
import AuditPage from './pages/AuditPage';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Theme Context
export const ThemeContext = createContext();

import { DataProvider } from './contexts/DataContext';


export const useTheme = () => useContext(ThemeContext);

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('accesstoken');
    if (token) {
      setUser({ email: localStorage.getItem('useremail') });
      setCurrentPage('dashboard');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('useremail');
    setUser(null);
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={(user) => {
          setUser(user);
          setCurrentPage('dashboard');
        }} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'upload-invoice':
        return <InvoiceUploadPage />;
      case 'agent-analysis':
        return <AgentAnalysisPage />;
      case 'offers':
        return <OffersPage />;
      case 'consent':
        return <ConsentPage />;
      case 'audit':
        return <AuditPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <DataProvider>
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app">
        {user && (
          <Header 
            user={user} 
            onLogout={handleLogout}
            theme={theme}
            toggleTheme={toggleTheme}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        )}
        
        {user ? (
          <div className="app-container">
            <Sidebar 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage}
              isOpen={sidebarOpen}
            />
            <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
              <div className="page-wrapper animate-fade-in">
                {renderPage()}
              </div>
            </main>
          </div>
        ) : (
          renderPage()
        )}
        
        <style jsx>{`
          .app {
            min-height: 100vh;
            background: var(--bg-primary);
          }
          
          .app-container {
            display: flex;
            padding-top: 70px;
          }
          
          .main-content {
            flex: 1;
            margin-left: 280px;
            padding: var(--space-8);
            transition: margin-left var(--transition-normal);
            min-height: calc(100vh - 70px);
          }
          
          .main-content.expanded {
            margin-left: 0;
          }
          
          .page-wrapper {
            max-width: 1400px;
            margin: 0 auto;
          }
          
          @media (max-width: 768px) {
            .main-content {
              margin-left: 0;
              padding: var(--space-4);
            }
          }
        `}</style>
      </div>
    </ThemeContext.Provider>
    </DataProvider>
  );
}
