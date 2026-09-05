import React, { useState } from 'react';
import { X, BookmarkCheck, User, BookOpen, CheckCircle2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

interface CreateReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateReservationModal: React.FC<CreateReservationModalProps> = ({ isOpen, onClose }) => {
  const { books, members, createReservation } = useLibrary();

  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedBookId, setSelectedBookId] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !selectedBookId) return;

    const success = createReservation(selectedBookId, selectedMemberId);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale-in"
        style={{ maxWidth: '580px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookmarkCheck size={20} style={{ color: 'var(--accent-amber)' }} />
            <h3 style={{ fontSize: '1.2rem' }}>Place Title Reservation / Hold</h3>
          </div>
          <button className="btn-icon btn-secondary" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Patron Selection */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <User size={15} style={{ color: 'var(--primary-light)' }} />
                <span>Patron Requiring Reservation *</span>
              </label>
              <select
                value={selectedMemberId}
                onChange={e => setSelectedMemberId(e.target.value)}
                style={{ width: '100%' }}
                required
              >
                <option value="">-- Choose Member --</option>
                {members.map(mem => (
                  <option key={mem.id} value={mem.id}>
                    {mem.name} ({mem.memberCode}) — {mem.role.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Book Selection */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <BookOpen size={15} style={{ color: 'var(--primary-light)' }} />
                <span>Book Title for Queue *</span>
              </label>
              <select
                value={selectedBookId}
                onChange={e => setSelectedBookId(e.target.value)}
                style={{ width: '100%' }}
                required
              >
                <option value="">-- Choose Book --</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.availableCopies} in stock)
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}
            >
              When an issued copy is checked back in at circulation, the system will automatically alert the next queued patron and place the physical item on the hold shelf.
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <CheckCircle2 size={16} />
              <span>Confirm Reservation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
