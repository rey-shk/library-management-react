import React from 'react';
import { PlusCircle, Edit2, Trash2, Eye, MapPin, Star } from 'lucide-react';
import type { Book } from '../../types';

interface BookTableProps {
  books: Book[];
  onSelect: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onQuickIssue: (bookId: string) => void;
}

export const BookTable: React.FC<BookTableProps> = ({
  books,
  onSelect,
  onEdit,
  onDelete,
  onQuickIssue
}) => {
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Book Title & Author</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Location</th>
            <th>Stock Status</th>
            <th>Rating</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => {
            const isAvailable = book.availableCopies > 0;
            return (
              <tr key={book.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      style={{
                        width: '38px',
                        height: '52px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                        flexShrink: 0
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          cursor: 'pointer'
                        }}
                        onClick={() => onSelect(book)}
                      >
                        {book.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {book.author} · {book.publishedYear}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  {book.isbn}
                </td>

                <td>
                  <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                    {book.category}
                  </span>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                    <MapPin size={13} style={{ color: 'var(--primary-light)' }} />
                    <span>{book.rackLocation}</span>
                  </div>
                </td>

                <td>
                  <span
                    className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}
                    style={{ fontSize: '0.72rem' }}
                  >
                    {book.availableCopies} / {book.totalCopies} Available
                  </span>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={13} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{book.rating}</span>
                  </div>
                </td>

                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <button
                      className="btn-icon btn-secondary"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => onSelect(book)}
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>

                    {isAvailable && (
                      <button
                        className="btn-icon btn-primary"
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => onQuickIssue(book.id)}
                        title="Issue Loan"
                      >
                        <PlusCircle size={14} />
                      </button>
                    )}

                    <button
                      className="btn-icon btn-secondary"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => onEdit(book)}
                      title="Edit Book"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      className="btn-icon btn-danger"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove "${book.title}" from catalog?`)) {
                          onDelete(book.id);
                        }
                      }}
                      title="Delete Book"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
