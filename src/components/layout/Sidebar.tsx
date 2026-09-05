import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  ArrowLeftRight,
  Users,
  BookmarkCheck,
  Receipt,
  BarChart3,
  Settings,
  Sparkles,
  BookMarked
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import type { ActiveTab } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, stats, settings } = useLibrary();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; badgeType?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'books', label: 'Book Catalog', icon: <BookOpen size={20} />, badge: stats.totalTitles },
    { id: 'circulation', label: 'Circulation', icon: <ArrowLeftRight size={20} />, badge: stats.overdueLoansCount, badgeType: 'danger' },
    { id: 'members', label: 'Members Directory', icon: <Users size={20} />, badge: stats.totalMembers },
    { id: 'reservations', label: 'Hold Queue', icon: <BookmarkCheck size={20} />, badge: stats.pendingReservationsCount, badgeType: 'warning' },
    { id: 'fines', label: 'Fines & Revenue', icon: <Receipt size={20} />, badge: stats.totalFinesPending > 0 ? Number(stats.totalFinesPending.toFixed(0)) : undefined, badgeType: 'danger' },
    { id: 'analytics', label: 'Analytics & Reports', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <BookMarked size={24} />
        </div>
        <div className="brand-text">
          <h1>Lumina</h1>
          <span>Library Commons</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        <div className="nav-section-title">Main Navigation</div>
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            <div className="nav-item-left">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span
                className={`nav-badge ${
                  item.badgeType === 'danger'
                    ? 'badge-danger'
                    : item.badgeType === 'warning'
                    ? 'badge-warning'
                    : 'badge-primary'
                }`}
              >
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-quick-stats">
          <div className="quick-stats-row">
            <span>Catalog Stock</span>
            <span className="quick-stats-val">{stats.availableCopies} / {stats.totalCopies}</span>
          </div>
          <div className="quick-stats-row">
            <span>Active Borrowers</span>
            <span className="quick-stats-val">{stats.activeLoansCount} patrons</span>
          </div>
          {stats.overdueLoansCount > 0 && (
            <div className="quick-stats-row" style={{ color: '#fb7185' }}>
              <span>Overdue Items</span>
              <span className="quick-stats-val" style={{ color: '#fb7185' }}>{stats.overdueLoansCount}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Sparkles size={14} style={{ color: 'var(--primary-light)' }} />
          <span>{settings.libraryName}</span>
        </div>
      </div>
    </aside>
  );
};
