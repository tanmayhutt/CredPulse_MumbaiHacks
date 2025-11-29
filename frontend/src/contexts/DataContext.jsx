import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export function DataProvider({ children }) {
  const [invoices, setInvoices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [consents, setConsents] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist analysis result
  const saveAnalysisResult = (result) => {
    setCurrentAnalysis(result);
    sessionStorage.setItem('currentAnalysis', JSON.stringify(result));
  };

  // Retrieve analysis result from session
  const loadAnalysisResult = () => {
    const saved = sessionStorage.getItem('currentAnalysis');
    if (saved) {
      setCurrentAnalysis(JSON.parse(saved));
    }
  };

  useEffect(() => {
    loadAnalysisResult();
  }, []);

  return (
    <DataContext.Provider
      value={{
        invoices,
        setInvoices,
        offers,
        setOffers,
        consents,
        setConsents,
        currentAnalysis,
        saveAnalysisResult,
        auditLogs,
        setAuditLogs,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
