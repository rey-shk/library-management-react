import React from 'react';
import { BarChart3, Download, TrendingUp, Layers, Users, BookOpen } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const AnalyticsView: React.FC = () => {
  const { books, members, loans, stats, exportDataJSON, addToast } = useLibrary();

  // Category counts and utilization
  const categoryStats = books.reduce<Record<string, { total: number; available: number }>>((acc, book) => {
    if (!acc[book.category]) {
      acc[book.category] = { total: 0, available: 0 };
    }
    acc[book.category].total += book.totalCopies;
    acc[book.category].available += book.availableCopies;
    return acc;
  }, {});

  // Role distribution
  const roleCounts = members.reduce<Record<string, number>>((acc, mem) => {
    acc[mem.role] = (acc[mem.role] || 0) + 1;
    return acc;
  }, {});

  const overdueRate = Math.round((stats.overdueLoansCount / (stats.activeLoansCount || 1)) * 100);
  const utilizationRate = Math.round((stats.issuedCopies / (stats.totalCopies || 1)) * 100);

  const exportCSV = () => {
    const headers = 'ID,Title,Author,ISBN,Category,TotalCopies,AvailableCopies,Location\n';
    const rows = books.map(b => `"${b.id}","${b.title}","${b.author}","${b.isbn}","${b.category}",${b.totalCopies},${b.availableCopies},"${b.rackLocation}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina_catalog_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'CSV Exported', 'Catalog report generated and downloaded.');
  };

  return (
    <div className="view-container animate-fade-in">
      {/* View Header */}
      <div className="view-header">
        <div className="view-header-title">
          <h2>Analytics & Intelligence Reports</h2>
          <p>Collection turnover rate, patron borrowing demographics, and inventory health</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={exportCSV}>
            <Download size={16} />
            <span>Export Catalog CSV</span>
          </button>
          <button className="btn btn-primary" onClick={exportDataJSON}>
            <Download size={16} />
            <span>Full JSON Backup</span>
          </button>
        </div>
      </div>

      {/* High-Level Efficiency Metrics */}
      <div className="kpi-grid" style={{ marginBottom: '28px' }}>
        <div className="glass-panel kpi-card" style={{ '--kpi-color': '#6366f1', '--kpi-bg': 'rgba(99, 102, 241, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Inventory Utilization</span>
            <TrendingUp size={20} />
          </div>
          <div className="kpi-value">{utilizationRate}%</div>
          <div className="kpi-subtitle">{stats.issuedCopies} of {stats.totalCopies} physical books in active use</div>
        </div>

        <div className="glass-panel kpi-card" style={{ '--kpi-color': stats.overdueLoansCount > 0 ? '#f43f5e' : '#10b981', '--kpi-bg': stats.overdueLoansCount > 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Overdue Rate</span>
            <BarChart3 size={20} />
          </div>
          <div className="kpi-value" style={{ color: stats.overdueLoansCount > 0 ? '#fb7185' : '#34d399' }}>{overdueRate}%</div>
          <div className="kpi-subtitle">Percentage of active loans exceeding due date</div>
        </div>

        <div className="glass-panel kpi-card" style={{ '--kpi-color': '#10b981', '--kpi-bg': 'rgba(16, 185, 129, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Total Circulation History</span>
            <BookOpen size={20} />
          </div>
          <div className="kpi-value">{loans.length}</div>
          <div className="kpi-subtitle">Total loans processed through system</div>
        </div>

        <div className="glass-panel kpi-card" style={{ '--kpi-color': '#8b5cf6', '--kpi-bg': 'rgba(139, 92, 246, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Patron Community</span>
            <Users size={20} />
          </div>
          <div className="kpi-value">{members.length}</div>
          <div className="kpi-subtitle">Registered readers & researchers</div>
        </div>
      </div>

      {/* Two Column Deep Dive */}
      <div className="dashboard-grid-2col">
        {/* Category breakdown bar charts */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Layers size={20} style={{ color: 'var(--primary-light)' }} />
            <h3 style={{ fontSize: '1.2rem' }}>Collection Volume & In-Circulation By Category</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(categoryStats).map(([category, data]) => {
              const borrowed = data.total - data.available;
              const borrowedPercent = Math.round((borrowed / (data.total || 1)) * 100);

              return (
                <div key={category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600 }}>{category}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{borrowed} Borrowed</span> / {data.total} Total Copies ({borrowedPercent}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${borrowedPercent}%`,
                        height: '100%',
                        background: 'var(--primary-gradient)',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demographics & System Health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Patron Demographics */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <Users size={20} style={{ color: 'var(--accent-purple)' }} />
              <h3 style={{ fontSize: '1.2rem' }}>Patron Demographics</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(roleCounts).map(([role, count]) => {
                const percent = Math.round((count / (members.length || 1)) * 100);
                return (
                  <div key={role} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: '0.9rem' }}>{role}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{percent}% of membership</div>
                    </div>
                    <span className="badge badge-primary" style={{ fontSize: '0.8rem' }}>
                      {count} {count === 1 ? 'Patron' : 'Patrons'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>Institutional Compliance</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              All circulation activities comply with standard library retention policies. Data is persisted in local browser storage and can be archived anytime via the JSON/CSV export actions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
