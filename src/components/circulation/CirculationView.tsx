import React, { useState } from 'react';
import {
  ArrowLeftRight,
  PlusCircle,
  Search,
  AlertTriangle,
  CheckCircle2,
  RotateCw,
  Send,
  Sparkles
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import type { Loan } from '../../types';
import { IssueLoanModal } from './IssueLoanModal';
import { ReturnLoanModal } from './ReturnLoanModal';

export const CirculationView: React.FC = () => {
  const {
    loans,
    stats,
    renewLoan,
    setIsIssueModalOpen,
    returnLoanTarget,
    setReturnLoanTarget,
    addToast
  } = useLibrary();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'active' | 'overdue' | 'returned'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const filteredLoans = loans.filter(loan => {
    // Status filter
    if (activeSubTab === 'active' && loan.status !== 'active' && loan.status !== 'overdue') return false;
    if (activeSubTab === 'overdue' && loan.status !== 'overdue') return false;
    if (activeSubTab === 'returned' && loan.status !== 'returned') return false;

    // Search query
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      loan.bookTitle.toLowerCase().includes(q) ||
      loan.memberName.toLowerCase().includes(q) ||
      loan.memberCode.toLowerCase().includes(q) ||
      loan.bookIsbn.toLowerCase().includes(q)
    );
  });

  const handleSendReminder = (loan: Loan) => {
    addToast('info', 'Reminder Sent', `Automated SMS & email notification dispatched to ${loan.memberName} for "${loan.bookTitle}".`);
  };

  const calculateDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date(today);
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="view-container animate-fade-in">
      {/* View Header */}
      <div className="view-header">
        <div className="view-header-title">
          <h2>Circulation & Borrowing Desk</h2>
          <p>Manage checkouts, check-ins, renewals, and overdue borrower notices</p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsIssueModalOpen(true)}>
          <PlusCircle size={16} />
          <span>New Check-Out Loan</span>
        </button>
      </div>

      {/* Circulation KPI Quick Badges */}
      <div className="kpi-grid" style={{ marginBottom: '22px' }}>
        <div className="glass-panel kpi-card" style={{ padding: '16px', '--kpi-color': '#3b82f6', '--kpi-bg': 'rgba(59, 130, 246, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Active Loans</span>
            <ArrowLeftRight size={18} />
          </div>
          <div className="kpi-value" style={{ fontSize: '1.6rem' }}>{stats.activeLoansCount}</div>
          <div className="kpi-subtitle">In patrons' hands</div>
        </div>

        <div className="glass-panel kpi-card" style={{ padding: '16px', '--kpi-color': '#f43f5e', '--kpi-bg': 'rgba(244, 63, 94, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Overdue Items</span>
            <AlertTriangle size={18} />
          </div>
          <div className="kpi-value" style={{ fontSize: '1.6rem', color: stats.overdueLoansCount > 0 ? '#fb7185' : '#34d399' }}>
            {stats.overdueLoansCount}
          </div>
          <div className="kpi-subtitle">Require recovery notices</div>
        </div>

        <div className="glass-panel kpi-card" style={{ padding: '16px', '--kpi-color': '#10b981', '--kpi-bg': 'rgba(16, 185, 129, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Returned & Cleared</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="kpi-value" style={{ fontSize: '1.6rem' }}>
            {loans.filter(l => l.status === 'returned').length}
          </div>
          <div className="kpi-subtitle">Archived loan records</div>
        </div>
      </div>

      {/* Toolbar: Sub-tabs & Search */}
      <div className="catalog-toolbar">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`filter-pill ${activeSubTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('all')}
          >
            All Logs ({loans.length})
          </button>
          <button
            className={`filter-pill ${activeSubTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('active')}
          >
            Active ({stats.activeLoansCount})
          </button>
          <button
            className={`filter-pill ${activeSubTab === 'overdue' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('overdue')}
          >
            Overdue ({stats.overdueLoansCount})
          </button>
          <button
            className={`filter-pill ${activeSubTab === 'returned' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('returned')}
          >
            Returned History ({loans.filter(l => l.status === 'returned').length})
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search borrower, book, code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', width: '100%', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Loans Table */}
      {filteredLoans.length === 0 ? (
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
          <h3>No circulation records found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            No records matched your search query or tab filter.
          </p>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Borrowed Book</th>
                <th>Patron / Member</th>
                <th>Issue Date</th>
                <th>Due Date / Timeline</th>
                <th>Status</th>
                <th>Penalty / Fines</th>
                <th style={{ textAlign: 'right' }}>Circulation Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map(loan => {
                const daysLeft = calculateDaysRemaining(loan.dueDate);
                const isOverdue = loan.status === 'overdue' || (loan.status === 'active' && daysLeft < 0);

                return (
                  <tr key={loan.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={loan.bookCoverUrl}
                          alt={loan.bookTitle}
                          style={{
                            width: '36px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-sm)',
                            flexShrink: 0
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {loan.bookTitle}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {loan.bookIsbn}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {loan.memberName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {loan.memberCode}
                        </div>
                      </div>
                    </td>

                    <td style={{ fontSize: '0.82rem' }}>
                      {loan.issueDate}
                    </td>

                    <td>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{loan.dueDate}</div>
                        {loan.status !== 'returned' && (
                          <div style={{ fontSize: '0.72rem', marginTop: '2px' }}>
                            {daysLeft < 0 ? (
                              <span style={{ color: '#fb7185', fontWeight: 700 }}>
                                {Math.abs(daysLeft)} days overdue
                              </span>
                            ) : daysLeft === 0 ? (
                              <span style={{ color: '#fbbf24', fontWeight: 700 }}>Due Today!</span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>{daysLeft} days left</span>
                            )}
                          </div>
                        )}
                        {loan.status === 'returned' && (
                          <div style={{ fontSize: '0.72rem', color: '#34d399' }}>
                            Returned on {loan.returnDate}
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          loan.status === 'returned'
                            ? 'badge-success'
                            : isOverdue
                            ? 'badge-danger'
                            : 'badge-primary'
                        }`}
                        style={{ fontSize: '0.7rem' }}
                      >
                        {loan.status === 'returned'
                          ? 'Returned'
                          : isOverdue
                          ? 'Overdue'
                          : 'Active Loan'}
                      </span>
                    </td>

                    <td>
                      {loan.fineAmount > 0 ? (
                        <div>
                          <span style={{ fontWeight: 700, color: loan.finePaid ? '#34d399' : '#fb7185' }}>
                            ${loan.fineAmount.toFixed(2)}
                          </span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {loan.finePaid ? 'Paid' : 'Unpaid'}
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>$0.00</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        {loan.status !== 'returned' ? (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              onClick={() => setReturnLoanTarget(loan)}
                              title="Process Return"
                            >
                              <CheckCircle2 size={13} />
                              <span>Return</span>
                            </button>

                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              onClick={() => renewLoan(loan.id, 14)}
                              title="Extend Due Date by 14 Days"
                            >
                              <RotateCw size={13} />
                              <span>Renew</span>
                            </button>

                            {isOverdue && (
                              <button
                                className="btn btn-danger btn-sm"
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                onClick={() => handleSendReminder(loan)}
                                title="Send SMS / Email Notice"
                              >
                                <Send size={13} />
                              </button>
                            )}
                          </>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Archived</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <IssueLoanModal />
      <ReturnLoanModal
        loan={returnLoanTarget}
        onClose={() => setReturnLoanTarget(null)}
      />
    </div>
  );
};
