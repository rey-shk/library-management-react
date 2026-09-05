import React, { useState, useMemo } from 'react';
import {
  BookPlus,
  LayoutGrid,
  Table as TableIcon,
  Search,
  Sparkles
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { BookCard } from './BookCard';
import { BookTable } from './BookTable';
import { BookDetailModal } from './BookDetailModal';
import { AddEditBookModal } from './AddEditBookModal';

const ALL_CATEGORIES = [
  'All Genres',
  'Computer Science',
  'Software Engineering',
  'Artificial Intelligence',
  'Fiction & Literature',
  'Science & Physics',
  'Philosophy & Ethics',
  'Business & Economics',
  'History & Biography',
  'Design & UX',
  'Psychology'
];

export const BooksView: React.FC = () => {
  const {
    books,
    members,
    addBook,
    updateBook,
    deleteBook,
    selectedBook,
    setSelectedBook,
    editingBook,
    setEditingBook,
    isAddBookModalOpen,
    setIsAddBookModalOpen,
    setIsIssueModalOpen,
    setPreselectedBookId,
    createReservation,
    addToast
  } = useLibrary();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Genres');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'out_of_stock'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'title' | 'available' | 'year'>('rating');

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        // Search query
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.isbn.toLowerCase().includes(q) ||
          book.rackLocation.toLowerCase().includes(q) ||
          book.tags.some(t => t.toLowerCase().includes(q));

        // Category
        const matchesCategory = selectedCategory === 'All Genres' || book.category === selectedCategory;

        // Availability
        const matchesAvailability =
          availabilityFilter === 'all'
            ? true
            : availabilityFilter === 'available'
            ? book.availableCopies > 0
            : book.availableCopies === 0;

        return matchesSearch && matchesCategory && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'available') return b.availableCopies - a.availableCopies;
        if (sortBy === 'year') return b.publishedYear - a.publishedYear;
        return 0;
      });
  }, [books, searchQuery, selectedCategory, availabilityFilter, sortBy]);

  const handleQuickIssue = (bookId: string) => {
    setPreselectedBookId(bookId);
    setIsIssueModalOpen(true);
  };

  const handleReserve = (bookId: string) => {
    const memberCode = window.prompt('Enter Member ID/Code to place hold (e.g. LIB-2026-042 or LIB-2026-001):');
    if (!memberCode) return;
    const cleanCode = memberCode.trim().toLowerCase();
    const mem = members.find(m => m.memberCode.toLowerCase() === cleanCode || m.name.toLowerCase().includes(cleanCode));
    if (mem) {
      createReservation(bookId, mem.id);
    } else {
      addToast('error', 'Member Not Found', `No patron found matching "${memberCode}".`);
    }
  };

  return (
    <div className="view-container animate-fade-in">
      {/* View Header */}
      <div className="view-header">
        <div className="view-header-title">
          <h2>Catalog & Book Inventory</h2>
          <p>
            Browse, manage, and catalog physical and digital assets across all library stacks
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsAddBookModalOpen(true)}>
          <BookPlus size={16} />
          <span>Catalog New Book</span>
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="catalog-toolbar">
        {/* Search Input */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search by title, author, ISBN..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', width: '100%' }}
          />
        </div>

        {/* Right toolbar controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Availability Filter */}
          <select
            value={availabilityFilter}
            onChange={e => setAvailabilityFilter(e.target.value as any)}
            style={{ fontSize: '0.85rem' }}
          >
            <option value="all">All Availability</option>
            <option value="available">Available Now</option>
            <option value="out_of_stock">Checked Out (0 copies)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            style={{ fontSize: '0.85rem' }}
          >
            <option value="rating">Sort: Highest Rating</option>
            <option value="title">Sort: Title (A-Z)</option>
            <option value="available">Sort: Available Copies</option>
            <option value="year">Sort: Newest Published</option>
          </select>

          {/* View Toggle */}
          <div
            className="glass-panel"
            style={{ display: 'flex', padding: '3px', borderRadius: 'var(--radius-md)' }}
          >
            <button
              className={`btn-icon ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
              style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)' }}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              className={`btn-icon ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`}
              style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)' }}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <TableIcon size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="filter-pills" style={{ marginBottom: '22px' }}>
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div>
          Showing <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{filteredBooks.length}</span> titles in catalog
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{ color: 'var(--primary-light)', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Main Grid or Table */}
      {filteredBooks.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <Sparkles size={36} style={{ color: 'var(--text-muted)' }} />
          <h3>No books match your criteria</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.9rem' }}>
            Try changing your filter settings, searching for different keywords, or adding a new book to the library collection.
          </p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Genres');
              setAvailabilityFilter('all');
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="books-grid">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={setSelectedBook}
              onQuickIssue={handleQuickIssue}
              onReserve={handleReserve}
            />
          ))}
        </div>
      ) : (
        <BookTable
          books={filteredBooks}
          onSelect={setSelectedBook}
          onEdit={setEditingBook}
          onDelete={deleteBook}
          onQuickIssue={handleQuickIssue}
        />
      )}

      {/* Modals */}
      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onEdit={book => {
          setSelectedBook(null);
          setEditingBook(book);
        }}
        onIssue={handleQuickIssue}
        onReserve={handleReserve}
      />

      <AddEditBookModal
        isOpen={isAddBookModalOpen || editingBook !== null}
        initialBook={editingBook}
        onClose={() => {
          setIsAddBookModalOpen(false);
          setEditingBook(null);
        }}
        onSubmit={bookData => {
          if (editingBook) {
            updateBook(bookData);
          } else {
            addBook(bookData);
          }
        }}
      />
    </div>
  );
};
