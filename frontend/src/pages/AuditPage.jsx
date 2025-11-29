import React, { useState } from 'react';

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      event: 'Invoice Uploaded',
      details: 'INV-001 uploaded',
      timestamp: '2025-11-12 10:30:00',
      status: 'success'
    },
    {
      id: 2,
      event: 'Invoice Verified',
      details: 'IRN generated: ABC123DEF456',
      timestamp: '2025-11-12 10:32:00',
      status: 'success'
    },
    {
      id: 3,
      event: 'Offer Generated',
      details: 'Offer: ₹45,000 @ 2.5%',
      timestamp: '2025-11-12 10:35:00',
      status: 'success'
    }
  ]);

  return (
    <div className="audit-page">
      <h1>Audit Trail</h1>
      
      <p className="audit-info">Complete audit trail of all transactions and consents for compliance and transparency.</p>

      <div className="audit-table">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Event</th>
              <th>Details</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.timestamp}</td>
                <td className="event-name">{log.event}</td>
                <td className="event-details">{log.details}</td>
                <td>
                  <span className={`badge badge-${log.status}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {auditLogs.length === 0 && (
        <div className="empty-state">
          <p>No audit logs yet.</p>
        </div>
      )}
    </div>
  );
}