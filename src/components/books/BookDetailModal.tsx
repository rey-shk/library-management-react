import React from 'react';
import {
  X,
  Star,
  MapPin,
  Barcode,
  Layers,
  FileText,
  User,
  PlusCircle,
  Bookmark,
  Edit2
} from 'lucide-react';
import type { Book } from '../../types';
import { useLibrary } from '../../context/LibraryContext';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onEdit: (book: Book) => void;
  onIssue: (bookId: string) => void;
  onReserve: (bookId: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onEdit,
  onIssue,
  onReserve
}) => {
  const { loans, reservations } = useLibrary();

  if (!book) return null;

  const isAvailable = book.availableCopies > 0;
  const stockPercentage = Math.round((book.availableCopies / book.totalCopies) * 100);

  // Active loans for this book
  const activeBookLoans = loans.filter(l => l.bookId === book.id && (l.status === 'active' || l.status === 'overdue'));

  // Active holds for this book
  const activeBookHolds = reservations.filter(r => r.bookId === book.id && (r.status === 'pending' || r.status === 'ready'));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale-in"
        style={{ maxWidth: '800px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-primary">{book.category}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ISBN: {book.isbn}</span>
          </div>
          <button className="btn-icon btn-secondary" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top banner: Cover & Main Meta */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <img
              src={book.coverUrl}
              alt={book.title}
              style={{
                width: '160px',
                height: '230px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                flexShrink: 0
              }}
            />

            <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h2 style={{ fontSize: '1.45rem', lineHeight: 1.25 }}>{book.title}</h2>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                By <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{book.author}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={16} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                  <span style={{ fontWeight: 700 }}>{book.rating.toFixed(1)}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/ 5.0</span>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{book.publisher} ({book.publishedYear})</span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{book.pages} Pages</span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{book.language}</span>
              </div>

              {/* Shelf Location Box */}
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '6px'
                }}
              >
                <MapPin size={22} style={{ color: 'var(--primary-light)' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                    Physical Location
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {book.rackLocation}
                  </div>
                </div>
              </div>

              {/* Stock Gauge */}
              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <span>Inventory Availability</span>
                  <span style={{ fontWeight: 700 }}>
                    {book.availableCopies} of {book.totalCopies} Copies Free
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${stockPercentage}%`,
                      height: '100%',
                      background: isAvailable ? (stockPercentage <= 25 ? '#f59e0b' : '#10b981') : '#f43f5e',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} style={{ color: 'var(--primary-light)' }} />
              <span>Synopsis & Description</span>
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {book.description}
            </p>
          </div>

          {/* Tags */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={16} style={{ color: 'var(--primary-light)' }} />
              <span>Subject Tags & Keywords</span>
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {book.tags.map((tag, idx) => (
                <span key={idx} className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Active Borrowers list for this book */}
          {activeBookLoans.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} style={{ color: 'var(--accent-blue)' }} />
                <span>Currently Borrowed By ({activeBookLoans.length})</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeBookLoans.map(loan => (
                  <div
                    key={loan.id}
                    className="glass-panel"
                    style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{loan.memberName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {loan.memberCode}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${loan.status === 'overdue' ? 'badge-danger' : 'badge-primary'}`} style={{ fontSize: '0.68rem' }}>
                        Due {loan.dueDate} {loan.status === 'overdue' ? '(Overdue)' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Hold Queue */}
          {activeBookHolds.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bookmark size={16} style={{ color: 'var(--accent-amber)' }} />
                <span>Hold Queue ({activeBookHolds.length} Patron Waiting)</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeBookHolds.map(hold => (
                  <div
                    key={hold.id}
                    className="glass-panel"
                    style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{hold.memberName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reserved: {hold.reservationDate}</div>
                    </div>
                    <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>
                      Position #{hold.queuePosition} · {hold.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barcode & ISBN strip */}
          <div
            style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Barcode size={24} style={{ color: 'var(--text-muted)' }} />
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Standard ISBN-13</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600 }}>{book.isbn}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Added to collection on {book.addedDate}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => { onClose(); onEdit(book); }}>
            <Edit2 size={16} />
            <span>Edit Book</span>
          </button>

          {isAvailable ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onIssue(book.id);
              }}
            >
              <PlusCircle size={16} />
              <span>Issue This Book</span>
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onReserve(book.id);
              }}
            >
              <Bookmark size={16} />
              <span>Place Hold / Reserve</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
