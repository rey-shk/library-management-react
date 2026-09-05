import React from 'react';
import {
  BookOpen,
  ArrowLeftRight,
  AlertTriangle,
  Users,
  BookmarkCheck,
  Receipt,
  TrendingUp,
  PlusCircle,
  BookPlus,
  UserPlus,
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
  ChevronRight,
  Star
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const DashboardView: React.FC = () => {
  const {
    stats,
    books,
    loans,
    activities,
    settings,
    setActiveTab,
    setIsIssueModalOpen,
    setIsAddBookModalOpen,
    setIsAddMemberModalOpen,
    setSelectedBook,
    setPreselectedBookId
  } = useLibrary();

  // Find overdue loans
  const overdueLoans = loans.filter(l => l.status === 'overdue');

  // Top trending / popular books
  const popularBooks = [...books]
    .sort((a, b) => b.rating - a.rating || a.availableCopies - b.availableCopies)
    .slice(0, 4);

  // Category counts
  const categoryCounts = books.reduce<Record<string, number>>((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {});

  const handleQuickIssue = (bookId: string) => {
    setPreselectedBookId(bookId);
    setIsIssueModalOpen(true);
  };

  return (
    <div className="view-container animate-fade-in">
      {/* Header */}
      <div className="view-header">
        <div className="view-header-title">
          <h2>Library Command Center</h2>
          <p>Real-time circulation metrics, inventory distribution, and patron activity</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => setIsAddBookModalOpen(true)}>
            <BookPlus size={16} />
            <span>Add Title</span>
          </button>
          <button className="btn btn-primary" onClick={() => setIsIssueModalOpen(true)}>
            <PlusCircle size={16} />
            <span>Issue Loan</span>
          </button>
        </div>
      </div>

      {/* Urgent Overdue Alert Banner if any */}
      {overdueLoans.length > 0 && (
        <div className="attention-banner">
          <div className="attention-left">
            <div className="attention-icon">
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fb7185' }}>
                Action Required: {overdueLoans.length} Overdue {overdueLoans.length === 1 ? 'Book' : 'Books'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Patrons with overdue loans have accrued a total of ${stats.totalFinesPending.toFixed(2)} in pending fines.
              </div>
            </div>
          </div>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => setActiveTab('circulation')}
          >
            Manage Overdues
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="kpi-grid">
        {/* Total Titles */}
        <div className="glass-panel kpi-card" style={{ '--kpi-color': '#6366f1', '--kpi-bg': 'rgba(99, 102, 241, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Catalog Titles</span>
            <div className="kpi-icon-box">
              <BookOpen size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.totalTitles}</div>
          <div className="kpi-subtitle">
            <span style={{ color: '#10b981', fontWeight: 600 }}>{stats.availableCopies} available</span> of {stats.totalCopies} physical copies
          </div>
        </div>

        {/* Active Circulation */}
        <div className="glass-panel kpi-card" style={{ '--kpi-color': '#3b82f6', '--kpi-bg': 'rgba(59, 130, 246, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Active Loans</span>
            <div className="kpi-icon-box">
              <ArrowLeftRight size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.activeLoansCount}</div>
          <div className="kpi-subtitle">
            {stats.issuedCopies} books currently in circulation
          </div>
        </div>

        {/* Overdue Loans */}
        <div
          className="glass-panel kpi-card"
          style={{
            '--kpi-color': stats.overdueLoansCount > 0 ? '#f43f5e' : '#10b981',
            '--kpi-bg': stats.overdueLoansCount > 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)'
          } as React.CSSProperties}
        >
          <div className="kpi-header">
            <span className="kpi-title">Overdue Items</span>
            <div className="kpi-icon-box">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: stats.overdueLoansCount > 0 ? '#fb7185' : '#34d399' }}>
            {stats.overdueLoansCount}
          </div>
          <div className="kpi-subtitle">
            {stats.overdueLoansCount > 0 ? 'Late returns pending check-in' : 'All loans are on schedule'}
          </div>
        </div>

        {/* Members */}
        <div className="glass-panel kpi-card" style={{ '--kpi-color': '#8b5cf6', '--kpi-bg': 'rgba(139, 92, 246, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Registered Patrons</span>
            <div className="kpi-icon-box">
              <Users size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.totalMembers}</div>
          <div className="kpi-subtitle">
            Faculty, students & researchers
          </div>
        </div>

        {/* Hold Queue */}
        <div className="glass-panel kpi-card" style={{ '--kpi-color': '#f59e0b', '--kpi-bg': 'rgba(245, 158, 11, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Hold Requests</span>
            <div className="kpi-icon-box">
              <BookmarkCheck size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.pendingReservationsCount}</div>
          <div className="kpi-subtitle">
            Queued reservations for high-demand titles
          </div>
        </div>

        {/* Pending Fines */}
        <div className="glass-panel kpi-card" style={{ '--kpi-color': '#06b6d4', '--kpi-bg': 'rgba(6, 182, 212, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Pending Fines</span>
            <div className="kpi-icon-box">
              <Receipt size={20} />
            </div>
          </div>
          <div className="kpi-value">
            {settings.currencySymbol}{stats.totalFinesPending.toFixed(2)}
          </div>
          <div className="kpi-subtitle">
            Collected to date: {settings.currencySymbol}{stats.totalFinesCollected.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
          <Sparkles size={16} style={{ color: 'var(--primary-light)' }} />
          <span>Quick Workflows:</span>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setIsIssueModalOpen(true)}>
            <ArrowLeftRight size={15} />
            <span>Check Out Loan</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('circulation')}>
            <CheckCircle2 size={15} />
            <span>Process Return</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setIsAddMemberModalOpen(true)}>
            <UserPlus size={15} />
            <span>New Member ID</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('fines')}>
            <Receipt size={15} />
            <span>Collect Payment</span>
          </button>
        </div>
      </div>

      {/* 2-Column Main Section */}
      <div className="dashboard-grid-2col">
        {/* Left Column: Popular Books + Category Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Featured & High Demand Books */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={20} style={{ color: 'var(--primary-light)' }} />
                <h3 style={{ fontSize: '1.15rem' }}>Popular & High-Demand Titles</h3>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setActiveTab('books')}
              >
                View Full Catalog <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {popularBooks.map(book => (
                <div
                  key={book.id}
                  className="glass-panel glass-panel-interactive"
                  onClick={() => setSelectedBook(book)}
                  style={{
                    padding: '14px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    style={{
                      width: '60px',
                      height: '84px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '2px'
                      }}
                    >
                      {book.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      {book.author}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <Star size={13} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{book.rating}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>· {book.category}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}
                        style={{ fontSize: '0.65rem' }}
                      >
                        {book.availableCopies > 0 ? `${book.availableCopies} In Stock` : 'Checked Out'}
                      </span>
                      {book.availableCopies > 0 && (
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickIssue(book.id);
                          }}
                        >
                          Issue
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution Cloud */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Layers size={20} style={{ color: 'var(--accent-purple)' }} />
              <h3 style={{ fontSize: '1.15rem' }}>Collection Category Breakdown</h3>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {Object.entries(categoryCounts).map(([catName, count]) => (
                <div
                  key={catName}
                  onClick={() => setActiveTab('books')}
                  className="glass-panel glass-panel-interactive"
                  style={{
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem'
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{catName}</span>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                    {count} {count === 1 ? 'title' : 'titles'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Activity Feed */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} style={{ color: 'var(--accent-blue)' }} />
              <h3 style={{ fontSize: '1.15rem' }}>Live Activity Feed</h3>
            </div>
            <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>Real-Time</span>
          </div>

          <div className="activity-list" style={{ flex: 1, maxHeight: '480px', overflowY: 'auto' }}>
            {activities.map((act) => (
              <div key={act.id} className="activity-item">
                <div className="activity-dot" style={{ background: act.badgeColor || 'var(--primary-light)' }} />
                <div className="activity-info">
                  <div className="activity-title-row">
                    <span className="activity-title">{act.title}</span>
                    <span className="activity-time">{act.timestamp}</span>
                  </div>
                  <div className="activity-desc">{act.description}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Triggered by: <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{act.actorName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
