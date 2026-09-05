import React, { useState } from 'react';
import { Receipt, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { CollectFineModal } from './CollectFineModal';

export const FinesView: React.FC = () => {
  const {
    fines,
    stats,
    settings,
    collectFineTarget,
    setCollectFineTarget
  } = useLibrary();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'waived'>('all');

  const filteredFines = fines.filter(f => {
    if (statusFilter === 'all') return true;
    return f.status === statusFilter;
  });

  const totalWaived = fines
    .filter(f => f.status === 'waived')
    .reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="view-container animate-fade-in">
      {/* View Header */}
      <div className="view-header">
        <div className="view-header-title">
          <h2>Fines & Financial Ledger</h2>
          <p>Track late fees, replacement charges, receipts, and fee waivers</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: '22px' }}>
        <div className="glass-panel kpi-card" style={{ padding: '16px', '--kpi-color': '#f43f5e', '--kpi-bg': 'rgba(244, 63, 94, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Uncollected Fines</span>
            <Receipt size={18} />
          </div>
          <div className="kpi-value" style={{ fontSize: '1.6rem', color: '#fb7185' }}>
            {settings.currencySymbol}{stats.totalFinesPending.toFixed(2)}
          </div>
          <div className="kpi-subtitle">
            {fines.filter(f => f.status === 'pending').length} unsettled charges
          </div>
        </div>

        <div className="glass-panel kpi-card" style={{ padding: '16px', '--kpi-color': '#10b981', '--kpi-bg': 'rgba(16, 185, 129, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Collected Revenue</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="kpi-value" style={{ fontSize: '1.6rem', color: '#34d399' }}>
            {settings.currencySymbol}{stats.totalFinesCollected.toFixed(2)}
          </div>
          <div className="kpi-subtitle">
            {fines.filter(f => f.status === 'paid').length} paid receipts
          </div>
        </div>

        <div className="glass-panel kpi-card" style={{ padding: '16px', '--kpi-color': '#64748b', '--kpi-bg': 'rgba(100, 116, 139, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Waived Fees</span>
            <ShieldCheck size={18} />
          </div>
          <div className="kpi-value" style={{ fontSize: '1.6rem' }}>
            {settings.currencySymbol}{totalWaived.toFixed(2)}
          </div>
          <div className="kpi-subtitle">
            {fines.filter(f => f.status === 'waived').length} approved waivers
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="catalog-toolbar">
        <div className="filter-pills">
          <button
            className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Transactions ({fines.length})
          </button>
          <button
            className={`filter-pill ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({fines.filter(f => f.status === 'pending').length})
          </button>
          <button
            className={`filter-pill ${statusFilter === 'paid' ? 'active' : ''}`}
            onClick={() => setStatusFilter('paid')}
          >
            Paid ({fines.filter(f => f.status === 'paid').length})
          </button>
          <button
            className={`filter-pill ${statusFilter === 'waived' ? 'active' : ''}`}
            onClick={() => setStatusFilter('waived')}
          >
            Waived ({fines.filter(f => f.status === 'waived').length})
          </button>
        </div>
      </div>

      {/* Fines Ledger Table */}
      {filteredFines.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '50px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Sparkles size={32} style={{ color: 'var(--text-muted)' }} />
          <h3>No financial transactions found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            No penalties or transactions match this status.
          </p>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Patron / Member</th>
                <th>Item / Description</th>
                <th>Reason</th>
                <th>Amount</th>
                <th>Status & Receipt</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFines.map(fine => (
                <tr key={fine.id}>
                  <td style={{ fontSize: '0.82rem' }}>{fine.date}</td>

                  <td>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{fine.memberName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {fine.memberCode}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 500 }}>{fine.bookTitle}</div>
                    {fine.notes && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {fine.notes}
                      </div>
                    )}
                  </td>

                  <td>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>
                      {fine.reason.replace('_', ' ')}
                    </span>
                  </td>

                  <td>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: fine.status === 'pending' ? '#fb7185' : fine.status === 'paid' ? '#34d399' : 'var(--text-muted)' }}>
                      {settings.currencySymbol}{fine.amount.toFixed(2)}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span
                        className={`badge ${
                          fine.status === 'paid'
                            ? 'badge-success'
                            : fine.status === 'pending'
                            ? 'badge-danger'
                            : 'badge-secondary'
                        }`}
                        style={{ fontSize: '0.68rem', width: 'fit-content' }}
                      >
                        {fine.status.toUpperCase()}
                      </span>
                      {fine.receiptNumber && (
                        <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          {fine.receiptNumber} ({fine.paymentMethod})
                        </span>
                      )}
                    </div>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    {fine.status === 'pending' ? (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => setCollectFineTarget(fine)}
                      >
                        Collect / Waive
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <CollectFineModal
        fine={collectFineTarget}
        onClose={() => setCollectFineTarget(null)}
      />
    </div>
  );
};
