import React, { useState } from 'react';

export default function OffersPage() {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const offers = [
    {
      id: 1,
      invoice: 'INV-001',
      amount: 50000,
      offer_amount: 45000,
      rate: 2.3,
      tenor: 30,
      score: 850,
      tier: 'excellent',
      reasons: [
        '✓ Excellent buyer payment history',
        '✓ Fast payment cycle (avg 18 days)',
        '✓ Low invoice amount'
      ]
    },
    {
      id: 2,
      invoice: 'INV-002',
      amount: 75000,
      offer_amount: 67500,
      rate: 2.8,
      tenor: 30,
      score: 720,
      tier: 'very_good',
      reasons: [
        '✓ Good payment history',
        '✓ Regular business relationship'
      ]
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '800',
          marginBottom: '8px',
          background: 'var(--gradient-success)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Financing Offers
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Personalized offers based on your credit profile
        </p>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {offers.map((offer, idx) => (
          <div key={offer.id} className="card" style={{ cursor: 'pointer', animationDelay: `${idx * 0.1}s` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '24px', alignItems: 'start' }}>
              {/* Left: Invoice & Score */}
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Invoice</p>
                <p style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-primary)' }}>{offer.invoice}</p>
                <div style={{ marginTop: '12px' }}>
                  <span className={`badge badge-${offer.tier === 'excellent' ? 'success' : 'warning'}`}>
                    Score: {offer.score}
                  </span>
                </div>
              </div>

              {/* Middle: Amount & Rate */}
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Offer Amount</p>
                  <p style={{ fontSize: '1.3rem', fontWeight: '700', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    ₹{offer.offer_amount.toLocaleString()}
                  </p>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Annual Rate</p>
                <p style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--warning)' }}>{offer.rate}%</p>
              </div>

              {/* Right: Terms */}
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Tenor</p>
                <p style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--secondary)' }}>{offer.tenor} days</p>
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Monthly cost</p>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>₹{Math.round((offer.offer_amount - (offer.offer_amount * (offer.rate / 100) * offer.tenor / 365)))}</p>
                </div>
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setSelectedOffer(offer)}
                  style={{ minWidth: '140px' }}
                >
                  Details
                </button>
                <button className="btn btn-success" style={{ minWidth: '140px' }}>
                  Accept
                </button>
              </div>
            </div>

            {/* Why this price */}
            {selectedOffer?.id === offer.id && (
              <div style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border)',
                background: 'var(--bg-tertiary)',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <h4 style={{ marginBottom: '12px', fontWeight: '600' }}>Why this price?</h4>
                {offer.reasons.map((reason, i) => (
                  <p key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '6px' }}>
                    {reason}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}