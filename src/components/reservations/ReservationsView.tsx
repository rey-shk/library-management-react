import React, { useState } from 'react';
import {
  BookmarkCheck,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Sparkles
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import type { Reservation } from '../../types';
import { CreateReservationModal } from './CreateReservationModal';

export const ReservationsView: React.FC = () => {
  const {
    reservations,
    cancelReservation,
    fulfillReservation,
    stats,
    addToast
  } = useLibrary();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'ready' | 'fulfilled'>('all');

  const filteredReservations = reservations.filter(res => {
    if (statusFilter === 'all') return true;
    return res.status === statusFilter;
  });

  const handleNotifyPatron = (res: Reservation) => {
    addToast('info', 'Notice Dispatched', `SMS/Email notification sent to ${res.memberName} that "${res.bookTitle}" is ready at the hold shelf!`);
  };

  return (
    <div className="view-container animate-fade-in">
      {/* View Header */}
      <div className="view-header">
        <div className="view-header-title">
          <h2>Hold & Reservation Queue</h2>
          <p>Manage prioritized holds for high-demand titles and ready-for-pickup notifications</p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle size={16} />
          <span>Create Hold Request</span>
        </button>
      </div>

      {/* KPI mini row */}
      <div className="kpi-grid" style={{ marginBottom: '22px' }}>
        <div className="glass-panel kpi-card" style={{ padding: '16px', '--kpi-color': '#f59e0b', '--kpi-bg': 'rgba(245, 158, 11, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Active Queue</span>
            <Clock size={18} />
          </div>
          <div className="kpi-value" style={{ fontSize: '1.6rem' }}>{stats.pendingReservationsCount}</div>
          <div className="kpi-subtitle">Waiting for returned copies</div>
        </div>

        <div className="glass-panel kpi-card" style={{ padding: '16px', '--kpi-color': '#10b981', '--kpi-bg': 'rgba(16, 185, 129, 0.15)' } as React.CSSProperties}>
          <div className="kpi-header">
            <span className="kpi-title">Ready on Shelf</span>
            <BookmarkCheck size={18} />
          </div>
          <div className="kpi-value" style={{ fontSize: '1.6rem', color: '#34d399' }}>
            {reservations.filter(r => r.status === 'ready').length}
          </div>
          <div className="kpi-subtitle">Awaiting patron pickup</div>
        </div>
      </div>

      {/* Filters */}
      <div className="catalog-toolbar">
        <div className="filter-pills">
          <button
            className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Holds ({reservations.length})
          </button>
          <button
            className={`filter-pill ${statusFilter === 'ready' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ready')}
          >
            Ready for Pickup ({reservations.filter(r => r.status === 'ready').length})
          </button>
          <button
            className={`filter-pill ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            In Queue ({reservations.filter(r => r.status === 'pending').length})
          </button>
          <button
            className={`filter-pill ${statusFilter === 'fulfilled' ? 'active' : ''}`}
            onClick={() => setStatusFilter('fulfilled')}
          >
            Fulfilled ({reservations.filter(r => r.status === 'fulfilled').length})
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredReservations.length === 0 ? (
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
          <h3>No holds found in this status</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Place a hold request when an in-demand book is out of stock.
          </p>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reserved Book</th>
                <th>Patron Name</th>
                <th>Request Date</th>
                <th>Queue Position</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(res => (
                <tr key={res.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={res.bookCoverUrl}
                        alt={res.bookTitle}
                        style={{ width: '36px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {res.bookTitle}
                      </div>
                    </div>
                  </td>

                  <td>{res.memberName}</td>

                  <td style={{ fontSize: '0.85rem' }}>{res.reservationDate}</td>

                  <td>
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                      Position #{res.queuePosition}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        res.status === 'ready'
                          ? 'badge-success'
                          : res.status === 'pending'
                          ? 'badge-warning'
                          : 'badge-info'
                      }`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {res.status === 'ready' ? 'Ready for Pickup' : res.status.toUpperCase()}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      {res.status === 'ready' && (
                        <>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                            onClick={() => fulfillReservation(res.id)}
                            title="Mark Collected & Fulfill"
                          >
                            <CheckCircle2 size={13} />
                            <span>Fulfill</span>
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            onClick={() => handleNotifyPatron(res)}
                            title="Resend Pickup SMS Notification"
                          >
                            <Send size={13} />
                          </button>
                        </>
                      )}

                      {res.status === 'pending' && (
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => cancelReservation(res.id)}
                          title="Cancel Hold"
                        >
                          <XCircle size={13} />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <CreateReservationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
