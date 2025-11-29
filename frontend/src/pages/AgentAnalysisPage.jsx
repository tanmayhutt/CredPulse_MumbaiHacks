import React, { useState, useEffect } from 'react';
import { runAgentAnalysis } from '../services/api';
import { useData } from '../contexts/DataContext';

export default function AgentAnalysisPage() {
  const { currentAnalysis, saveAnalysisResult } = useData();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(currentAnalysis || null);
  const [error, setError] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(101);

  // Restore from context if available
  useEffect(() => {
    if (currentAnalysis) {
      setResult(currentAnalysis);
    }
  }, [currentAnalysis]);

  const runAnalysis = async (buyerId = 101) => {
    setSelectedBuyer(buyerId);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🚀 Starting agent analysis for buyer:', buyerId);
      const response = await runAgentAnalysis(buyerId, buyerId, 1);
      console.log('✅ Agent analysis complete:', response);
      
      setResult(response);
      saveAnalysisResult(response); // Persist to context
    } catch (err) {
      console.error('❌ Analysis failed:', err);
      const errorMsg =
      err.safeMessage ||
      err.response?.data?.detail ||
      err.message ||
        'Analysis failed. Make sure backend is running on port 8000';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Hero */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-8)',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
        className="animate-fade-in"
      >
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>
            🤖 Agentic AI Analysis
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Autonomous agents analyze invoices. Current: Buyer {selectedBuyer}
          </p>
        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={() => runAnalysis(selectedBuyer)}
          disabled={loading}
        >
          {loading ? '🔄 Analyzing...' : '🚀 Run AI Agents'}
        </button>
      </div>

      {/* Test Scenarios */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
          flexWrap: 'wrap',
        }}
      >
        {[
          { id: 101, label: 'Excellent (95%)', desc: 'High approval' },
          { id: 103, label: 'Medium (82%)', desc: 'Moderate' },
          { id: 105, label: 'High Risk (55%)', desc: 'May reject' },
        ].map((scenario) => (
          <button
            key={scenario.id}
            className={`btn ${selectedBuyer === scenario.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => runAnalysis(scenario.id)}
            disabled={loading}
          >
            {scenario.label} - {scenario.desc}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div
          className="card animate-fade-in"
          style={{
            padding: 'var(--space-6)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid var(--error)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
            <span style={{ fontSize: '2rem' }}>❌</span>
            <div>
              <h3 style={{ color: 'var(--error)', marginBottom: 'var(--space-2)', margin: 0 }}>
                Analysis Failed
              </h3>
              <p style={{ color: 'var(--error)', margin: '4px 0 8px 0', wordBreak: 'break-word' }}>
                {error}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                ℹ️ Check backend console for detailed errors
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)',
          }}
        >
          {[
            { name: 'Supply Chain', emoji: '🔗' },
            { name: 'Credit Scoring', emoji: '📊' },
            { name: 'Factoring', emoji: '💰' },
            { name: 'Orchestration', emoji: '🎯' },
          ].map((agent, idx) => (
            <div
              key={agent.name}
              className="card animate-fade-in"
              style={{
                animationDelay: `${idx * 150}ms`,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
              }}
            >
              <div className="pulse" style={{ fontSize: '2rem' }}>
                {agent.emoji}
              </div>
              <span style={{ fontWeight: '500' }}>{agent.name} Agent...</span>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="animate-fade-in">
          {/* Final Decision */}
          <div
            className="card"
            style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              marginBottom: 'var(--space-6)',
              background:
                result.final_decision?.decision === 'APPROVED' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
              border:
                result.final_decision?.decision === 'APPROVED'
                  ? '2px solid var(--success)'
                  : '2px solid var(--error)',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>
              {result.final_decision?.decision === 'APPROVED' ? '✅' : '❌'}
            </div>
            <h2
              style={{
                fontSize: '2rem',
                marginBottom: 'var(--space-3)',
                color:
                  result.final_decision?.decision === 'APPROVED' ? 'var(--success)' : 'var(--error)',
                margin: '0 0 16px 0',
              }}
            >
              {result.final_decision?.decision || 'ANALYZED'}
            </h2>
            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                maxWidth: '600px',
                margin: '0 auto 20px',
              }}
            >
              {result.final_decision?.reasoning || 'Analysis complete'}
            </p>
            {result.final_decision?.confidence && (
              <div
                style={{
                  display: 'inline-block',
                  padding: 'var(--space-2) var(--space-6)',
                  background: 'white',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '600',
                  color: 'var(--brand-primary)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                Confidence: {((result.final_decision.confidence || 0) * 100).toFixed(0)}%
              </div>
            )}
          </div>

          {/* Agent Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {result.agent_results?.supply_chain && (
              <AgentCard
                title="🔗 Supply Chain"
                data={result.agent_results.supply_chain}
                color="var(--accent-blue)"
              />
            )}
            {result.agent_results?.credit_scoring && (
              <AgentCard
                title="📊 Credit Scoring"
                data={result.agent_results.credit_scoring}
                color="var(--success)"
              />
            )}
            {result.agent_results?.factoring && (
              <AgentCard
                title="💰 Factoring"
                data={result.agent_results.factoring}
                color="var(--warning)"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Agent Card Component - COMPLETE & SAFE
function AgentCard({ title, data, color }) {
  const [expanded, setExpanded] = useState(false);

  if (!data) return null;

  return (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-5)',
        }}
      >
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
          {title}
        </h3>
        <button
          className="btn btn-secondary"
          style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.85rem' }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-4)',
        }}
      >
        {data.analysis?.decision && (
          <Stat
            label="Decision"
            value={data.analysis.decision}
            color={data.analysis.decision === 'YES' ? 'var(--success)' : 'var(--error)'}
          />
        )}
        {data.analysis?.recommended_rate && (
          <Stat label="Rate" value={`${data.analysis.recommended_rate}%`} color="var(--warning)" />
        )}
        {data.score?.credit_score && (
          <Stat
            label="Score"
            value={`${data.score.credit_score}/1000`}
            color="var(--accent-blue)"
          />
        )}
        {data.score?.tier && (
          <Stat
            label="Tier"
            value={data.score.tier}
            color="var(--success)"
          />
        )}
      </div>

      {/* Reasoning */}
      {data.analysis?.reasoning && (
        <div
          style={{
            padding: 'var(--space-4)',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            marginBottom: expanded ? 'var(--space-4)' : '0',
          }}
        >
          <strong>Reasoning:</strong> {data.analysis.reasoning}
        </div>
      )}

      {/* Expanded JSON */}
      {expanded && (
        <div
          style={{
            marginTop: 'var(--space-4)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <pre
            style={{
              background: 'var(--bg-tertiary)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              overflow: 'auto',
              maxHeight: '300px',
              margin: 0,
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// Stat Item Helper
function Stat({ label, value, color }) {
  return (
    <div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0, marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: '1.5rem', fontWeight: '700', color, margin: 0 }}>
        {value}
      </p>
    </div>
  );
}
