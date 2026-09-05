import React from 'react';
import { Star, MapPin, PlusCircle, Bookmark, Eye } from 'lucide-react';
import type { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  onQuickIssue: (bookId: string) => void;
  onReserve: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onSelect,
  onQuickIssue,
  onReserve
}) => {
  const isAvailable = book.availableCopies > 0;
  const stockPercentage = Math.round((book.availableCopies / book.totalCopies) * 100);

  return (
    <div
      className="glass-panel book-card glass-panel-interactive"
      onClick={() => onSelect(book)}
    >
      {/* Cover Header */}
      <div className="book-cover-wrap">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="book-cover-img"
          loading="lazy"
        />
        <div className="book-category-tag">
          {book.category}
        </div>
        <div className="book-copies-indicator">
          <span
            className={`badge ${
              isAvailable ? (stockPercentage <= 25 ? 'badge-warning' : 'badge-success') : 'badge-danger'
            }`}
            style={{ fontSize: '0.68rem', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
          >
            {isAvailable ? `${book.availableCopies}/${book.totalCopies} Available` : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Book Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 className="book-card-title" title={book.title}>
          {book.title}
        </h3>
        <div className="book-card-author">
          by <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{book.author}</span> ({book.publishedYear})
        </div>

        {/* Rating and Tags */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{book.rating.toFixed(1)}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({book.pages}p)</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            {book.isbn.slice(0, 10)}...
          </span>
        </div>

        {/* Shelf location */}
        <div className="book-location-chip" style={{ marginBottom: '12px' }}>
          <MapPin size={13} style={{ color: 'var(--primary-light)' }} />
          <span>{book.rackLocation}</span>
        </div>

        {/* Stock progress line */}
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden', marginBottom: '14px' }}>
          <div
            style={{
              width: `${stockPercentage}%`,
              height: '100%',
              background: isAvailable ? (stockPercentage <= 25 ? '#f59e0b' : '#10b981') : '#f43f5e',
              transition: 'width 0.3s ease'
            }}
          />
        </div>

        {/* Actions Footer */}
        <div className="book-card-footer" onClick={e => e.stopPropagation()}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onSelect(book)}
            style={{ padding: '5px 10px', fontSize: '0.75rem' }}
          >
            <Eye size={14} />
            <span>Details</span>
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
            {isAvailable ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onQuickIssue(book.id)}
                style={{ padding: '5px 12px', fontSize: '0.75rem' }}
              >
                <PlusCircle size={14} />
                <span>Issue</span>
              </button>
            ) : (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onReserve(book.id)}
                style={{ padding: '5px 10px', fontSize: '0.75rem' }}
              >
                <Bookmark size={14} />
                <span>Hold</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
