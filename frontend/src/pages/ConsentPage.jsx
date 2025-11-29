import React, { useState } from 'react';

export default function ConsentPage() {
  const [consents, setConsents] = useState([
    {
      id: 1,
      party: 'FinBank Ltd',
      fields: ['Invoice Amount', 'Invoice Date', 'Buyer Name'],
      date: '2025-11-12',
      status: 'active'
    }
  ]);

  return (
    <div className="consent-page">
      <h1>Consent Management</h1>

      <div className="consent-info">
        <p>You have full control over what data is shared with whom. Review and manage your consents below.</p>
      </div>

      <div className="consents-list">
        {consents.map((consent) => (
          <div key={consent.id} className="consent-item">
            <div className="consent-header">
              <h3>{consent.party}</h3>
              <span className={`badge badge-${consent.status}`}>{consent.status}</span>
            </div>

            <div className="consent-fields">
              <p className="label">Data Shared:</p>
              <ul>
                {consent.fields.map((field, idx) => (
                  <li key={idx}>✓ {field}</li>
                ))}
              </ul>
            </div>

            <div className="consent-meta">
              <small>Given on: {new Date(consent.date).toLocaleDateString()}</small>
            </div>

            <div className="consent-actions">
              <button className="btn btn-secondary btn-sm">View Details</button>
              <button className="btn btn-danger btn-sm">Revoke Consent</button>
            </div>
          </div>
        ))}
      </div>

      {consents.length === 0 && (
        <div className="empty-state">
          <p>No active consents.</p>
        </div>
      )}
    </div>
  );
}