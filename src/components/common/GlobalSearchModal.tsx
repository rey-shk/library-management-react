import React, { useState, useEffect, useRef } from 'react';
import { Search, Book, User, ArrowRight, X, Sparkles } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    books,
    members,
    setSelectedBook,
    setSelectedMember,
    setIsIssueModalOpen,
    setPreselectedBookId
  } = useLibrary();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isGlobalSearchOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  useEffect(() => {
    if (isGlobalSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const lowerQuery = query.toLowerCase().trim();

  const filteredBooks = lowerQuery
    ? books.filter(
        b =>
          b.title.toLowerCase().includes(lowerQuery) ||
          b.author.toLowerCase().includes(lowerQuery) ||
          b.isbn.toLowerCase().includes(lowerQuery) ||
          b.category.toLowerCase().includes(lowerQuery) ||
          b.tags.some(t => t.toLowerCase().includes(lowerQuery))
      ).slice(0, 5)
    : books.slice(0, 4);

  const filteredMembers = lowerQuery
    ? members.filter(
        m =>
          m.name.toLowerCase().includes(lowerQuery) ||
          m.memberCode.toLowerCase().includes(lowerQuery) ||
          m.email.toLowerCase().includes(lowerQuery) ||
          m.role.toLowerCase().includes(lowerQuery)
      ).slice(0, 4)
    : members.slice(0, 3);

  const handleSelectBook = (book: typeof books[0]) => {
    setSelectedBook(book);
    setIsGlobalSearchOpen(false);
  };

  const handleSelectMember = (member: typeof members[0]) => {
    setSelectedMember(member);
    setIsGlobalSearchOpen(false);
  };

  const handleQuickIssue = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    setPreselectedBookId(bookId);
    setIsGlobalSearchOpen(false);
    setIsIssueModalOpen(true);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsGlobalSearchOpen(false)}>
      <div
        className="modal-content animate-scale-in"
        style={{ maxWidth: '680px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-card)'
          }}
        >
          <Search size={22} style={{ color: 'var(--primary-light)' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type book title, author, ISBN, patron name, or department..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '1.05rem',
              color: 'var(--text-primary)',
              padding: 0,
              boxShadow: 'none'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
          )}
          <span className="search-shortcut">ESC</span>
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '16px 20px' }}>
          {/* Books Section */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Book size={14} />
              <span>Matching Books ({filteredBooks.length})</span>
            </div>

            {filteredBooks.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '8px 0' }}>
                No books found matching "{query}"
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredBooks.map(book => (
                  <div
                    key={book.id}
                    onClick={() => handleSelectBook(book)}
                    className="glass-panel"
                    style={{
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        style={{ width: '36px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {book.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {book.author} · <span style={{ color: 'var(--text-muted)' }}>{book.isbn}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.68rem' }}>
                        {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Checked Out'}
                      </span>
                      {book.availableCopies > 0 && (
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={(e) => handleQuickIssue(e, book.id)}
                        >
                          Issue
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Members Section */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <User size={14} />
              <span>Matching Members ({filteredMembers.length})</span>
            </div>

            {filteredMembers.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '8px 0' }}>
                No members found matching "{query}"
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredMembers.map(member => (
                  <div
                    key={member.id}
                    onClick={() => handleSelectMember(member)}
                    className="glass-panel"
                    style={{
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {member.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {member.memberCode} · <span style={{ textTransform: 'capitalize' }}>{member.role}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                        {member.activeLoanCount} Loans Active
                      </span>
                      <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-card)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} style={{ color: 'var(--primary-light)' }} />
            <span>Search books, barcodes, shelf numbers, or patrons</span>
          </div>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
