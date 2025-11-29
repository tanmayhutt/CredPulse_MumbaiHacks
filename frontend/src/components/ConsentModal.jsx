import React, { useState } from 'react';

export default function ConsentModal({ isOpen, fields, party, onAccept, onReject }) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    onAccept();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Consent Notice</h2>
          <button className="close-btn" onClick={onReject}>✕</button>
        </div>

        <div className="modal-body">
          <p>You are about to share the following information:</p>
          
          <div className="fields-list">
            <h3>Data Fields Shared:</h3>
            <ul>
              {fields && fields.map((field, idx) => (
                <li key={idx}>
                  <input type="checkbox" checked disabled />
                  <span>{field}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="party-info">
            <h3>Sharing With:</h3>
            <p className="party-name">{party || 'Financial Partner'}</p>
          </div>

          <div className="privacy-info">
            <h3>Privacy & Data Handling:</h3>
            <ul>
              <li>✓ Your data is encrypted and protected</li>
              <li>✓ Limited to the fields selected above</li>
              <li>✓ You can revoke consent anytime</li>
              <li>✓ Full audit trail maintained</li>
            </ul>
          </div>

          <div className="legal-text">
            <p>
              By clicking "Accept", you consent to share the above data with {party} 
              for credit evaluation purposes. This consent is auditable and can be 
              withdrawn at any time.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onReject}>
            Reject
          </button>
          <button className="btn btn-primary" onClick={handleAccept}>
            I Accept
          </button>
        </div>

        {accepted && (
          <div className="success-message">
            ✓ Consent recorded and signed
          </div>
        )}
      </div>
    </div>
  );
}