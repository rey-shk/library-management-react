import React, { useState } from 'react';
import {
  Menu,
  Search,
  PlusCircle,
  BookPlus,
  Sun,
  Moon,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

interface HeaderProps {
  setMobileOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

export const Header: React.FC<HeaderProps> = ({ setMobileOpen }) => {
  const {
    theme,
    toggleTheme,
    setIsGlobalSearchOpen,
    setIsIssueModalOpen,
    setIsAddBookModalOpen,
    activities,
    stats
  } = useLibrary();

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="app-header">
      {/* Left: Mobile trigger & Quick Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="btn-icon btn-secondary"
          style={{ display: 'flex' }}
          onClick={() => setMobileOpen(prev => !prev)}
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <button
          className="header-search-btn"
          onClick={() => setIsGlobalSearchOpen(true)}
          title="Press / to search anytime"
        >
          <Search size={18} />
          <span>Quick search catalog, patrons, ISBN...</span>
          <span className="search-shortcut">/</span>
        </button>
      </div>

      {/* Right: Actions, Theme, Notifications */}
      <div className="header-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setIsAddBookModalOpen(true)}
        >
          <BookPlus size={16} />
          <span>Add Book</span>
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsIssueModalOpen(true)}
        >
          <PlusCircle size={16} />
          <span>Issue Book</span>
        </button>

        {/* Theme Toggle */}
        <button
          className="btn-icon btn-secondary"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
        </button>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon btn-secondary"
            onClick={() => setShowNotifications(prev => !prev)}
            title="Recent Activity"
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            {stats.overdueLoansCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#f43f5e'
                }}
              />
            )}
          </button>

          {showNotifications && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: '48px',
                right: '0',
                width: '340px',
                padding: '16px',
                zIndex: 100,
                boxShadow: 'var(--shadow-lg)',
                background: 'var(--bg-card-solid)',
                border: '1px solid var(--border-strong)',
                animation: 'fadeIn 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Library Notifications</h4>
                <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Live Stream</span>
              </div>

              {stats.overdueLoansCount > 0 && (
                <div
                  style={{
                    background: 'rgba(244, 63, 94, 0.12)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                    fontSize: '0.78rem',
                    color: '#fb7185'
                  }}
                >
                  <AlertTriangle size={15} />
                  <span>{stats.overdueLoansCount} loans currently require overdue attention!</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
                {activities.slice(0, 5).map(act => (
                  <div key={act.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.8rem' }}>
                    <div style={{ marginTop: '2px', color: act.badgeColor || 'var(--primary-light)' }}>
                      <CheckCircle2 size={14} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{act.title}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{act.description}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                        <Clock size={10} /> {act.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
