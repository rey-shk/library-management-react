import React, { useState, useEffect } from 'react';
import {
  X,
  PlusCircle,
  User,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const IssueLoanModal: React.FC = () => {
  const {
    isIssueModalOpen,
    setIsIssueModalOpen,
    preselectedBookId,
    setPreselectedBookId,
    books,
    members,
    issueBook
  } = useLibrary();

  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [loanDays, setLoanDays] = useState<number>(14);
  const [customDueDate, setCustomDueDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [memberSearch, setMemberSearch] = useState<string>('');
  const [bookSearch, setBookSearch] = useState<string>('');

  useEffect(() => {
    if (isIssueModalOpen) {
      if (preselectedBookId) {
        setSelectedBookId(preselectedBookId);
      } else {
        const firstAvailable = books.find(b => b.availableCopies > 0);
        if (firstAvailable) setSelectedBookId(firstAvailable.id);
      }

      if (members.length > 0 && !selectedMemberId) {
        const activeMem = members.find(m => m.status === 'active' && m.activeLoanCount < m.maxLoanLimit);
        if (activeMem) setSelectedMemberId(activeMem.id);
      }

      // Default due date: today + 14 days
      const d = new Date();
      d.setDate(d.getDate() + 14);
      setCustomDueDate(d.toISOString().split('T')[0]);
      setLoanDays(14);
    }
  }, [isIssueModalOpen, preselectedBookId, books, members]);

  if (!isIssueModalOpen) return null;

  const handleDaysPreset = (days: number) => {
    setLoanDays(days);
    const d = new Date();
    d.setDate(d.getDate() + days);
    setCustomDueDate(d.toISOString().split('T')[0]);
  };

  const selectedMember = members.find(m => m.id === selectedMemberId);
  const selectedBook = books.find(b => b.id === selectedBookId);

  const availableBooks = books.filter(b => b.availableCopies > 0);

  const filteredMembers = members.filter(
    m =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.memberCode.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const filteredBooks = availableBooks.filter(
    b =>
      b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.isbn.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const isMemberEligible = selectedMember && selectedMember.status === 'active' && selectedMember.activeLoanCount < selectedMember.maxLoanLimit;
  const isBookAvailable = selectedBook && selectedBook.availableCopies > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !selectedBookId || !customDueDate) return;

    const success = issueBook(selectedBookId, selectedMemberId, customDueDate, notes);
    if (success) {
      setPreselectedBookId(null);
      setIsIssueModalOpen(false);
      setNotes('');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsIssueModalOpen(false)}>
      <div
        className="modal-content animate-scale-in"
        style={{ maxWidth: '680px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} style={{ color: 'var(--primary-light)' }} />
            <h3 style={{ fontSize: '1.2rem' }}>Check Out Book to Patron</h3>
          </div>
          <button className="btn-icon btn-secondary" onClick={() => setIsIssueModalOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Step 1: Member Selector */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={15} style={{ color: 'var(--primary-light)' }} />
                  <span>1. Select Patron / Member *</span>
                </label>
                {selectedMember && (
                  <span
                    className={`badge ${
                      selectedMember.status === 'active'
                        ? selectedMember.activeLoanCount >= selectedMember.maxLoanLimit
                          ? 'badge-danger'
                          : 'badge-success'
                        : 'badge-danger'
                    }`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {selectedMember.activeLoanCount} / {selectedMember.maxLoanLimit} Books Borrowed
                  </span>
                )}
              </div>

              {/* Search member filter */}
              <input
                type="text"
                placeholder="Filter patron by name or code..."
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
                style={{ width: '100%', marginBottom: '8px', fontSize: '0.85rem' }}
              />

              <select
                value={selectedMemberId}
                onChange={e => setSelectedMemberId(e.target.value)}
                style={{ width: '100%' }}
                required
              >
                <option value="">-- Choose Member --</option>
                {filteredMembers.map(mem => (
                  <option
                    key={mem.id}
                    value={mem.id}
                    disabled={mem.status !== 'active' || mem.activeLoanCount >= mem.maxLoanLimit}
                  >
                    {mem.name} ({mem.memberCode}) — {mem.role.toUpperCase()} [{mem.activeLoanCount}/{mem.maxLoanLimit} books] {mem.status !== 'active' ? `(${mem.status})` : ''}
                  </option>
                ))}
              </select>

              {selectedMember && selectedMember.activeLoanCount >= selectedMember.maxLoanLimit && (
                <div style={{ color: '#fb7185', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={14} /> Member has reached their max loan limit of {selectedMember.maxLoanLimit} items.
                </div>
              )}
            </div>

            {/* Step 2: Book Selector */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={15} style={{ color: 'var(--primary-light)' }} />
                  <span>2. Select Available Book Title *</span>
                </label>
                {selectedBook && (
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                    {selectedBook.availableCopies} Copies In Stock
                  </span>
                )}
              </div>

              <input
                type="text"
                placeholder="Filter book by title or ISBN..."
                value={bookSearch}
                onChange={e => setBookSearch(e.target.value)}
                style={{ width: '100%', marginBottom: '8px', fontSize: '0.85rem' }}
              />

              <select
                value={selectedBookId}
                onChange={e => setSelectedBookId(e.target.value)}
                style={{ width: '100%' }}
                required
              >
                <option value="">-- Choose Book --</option>
                {filteredBooks.map(book => (
                  <option key={book.id} value={book.id}>
                    {book.title} by {book.author} ({book.availableCopies} available) — {book.rackLocation}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Loan Duration & Due Date */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Calendar size={15} style={{ color: 'var(--primary-light)' }} />
                <span>3. Loan Duration & Expected Due Date *</span>
              </label>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                {[7, 14, 21, 30, 45].map(days => (
                  <button
                    key={days}
                    type="button"
                    className={`filter-pill ${loanDays === days ? 'active' : ''}`}
                    onClick={() => handleDaysPreset(days)}
                    style={{ fontSize: '0.78rem' }}
                  >
                    +{days} Days
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Issue Date
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={new Date().toISOString().split('T')[0]}
                    style={{ width: '100%', opacity: 0.8 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={customDueDate}
                    onChange={e => setCustomDueDate(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Notes */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Circulation Desk Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Course reserve reading / Special research loan"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsIssueModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isMemberEligible || !isBookAvailable}
            >
              <CheckCircle2 size={16} />
              <span>Confirm & Issue Book</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
