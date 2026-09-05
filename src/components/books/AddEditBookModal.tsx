import React, { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, Image as ImageIcon } from 'lucide-react';
import type { Book, BookCategory } from '../../types';

interface AddEditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: any) => void;
  initialBook?: Book | null;
}

const CATEGORIES: BookCategory[] = [
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

const PRESET_COVERS = [
  { label: 'Technology / Code', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
  { label: 'AI & Data', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80' },
  { label: 'Classic Library', url: 'https://images.unsplash.com/photo-1532012164546-f432f2e37278?auto=format&fit=crop&w=600&q=80' },
  { label: 'Science / Space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80' },
  { label: 'Philosophy / Art', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Psychology / Mind', url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80' }
];

export const AddEditBookModal: React.FC<AddEditBookModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialBook
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState<BookCategory>('Computer Science');
  const [publisher, setPublisher] = useState('');
  const [publishedYear, setPublishedYear] = useState<number>(2024);
  const [totalCopies, setTotalCopies] = useState<number>(3);
  const [availableCopies, setAvailableCopies] = useState<number>(3);
  const [rackLocation, setRackLocation] = useState('Rack CS-101, 3rd Floor');
  const [coverUrl, setCoverUrl] = useState(PRESET_COVERS[0].url);
  const [rating, setRating] = useState<number>(4.8);
  const [language, setLanguage] = useState('English');
  const [pages, setPages] = useState<number>(320);
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialBook) {
      setTitle(initialBook.title);
      setAuthor(initialBook.author);
      setIsbn(initialBook.isbn);
      setCategory(initialBook.category);
      setPublisher(initialBook.publisher);
      setPublishedYear(initialBook.publishedYear);
      setTotalCopies(initialBook.totalCopies);
      setAvailableCopies(initialBook.availableCopies);
      setRackLocation(initialBook.rackLocation);
      setCoverUrl(initialBook.coverUrl);
      setRating(initialBook.rating);
      setLanguage(initialBook.language);
      setPages(initialBook.pages);
      setTags(initialBook.tags.join(', '));
      setDescription(initialBook.description);
    } else {
      // Default reset
      setTitle('');
      setAuthor('');
      setIsbn(`978-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
      setCategory('Computer Science');
      setPublisher("O'Reilly Media");
      setPublishedYear(2024);
      setTotalCopies(4);
      setAvailableCopies(4);
      setRackLocation('Rack CS-105, 3rd Floor');
      setCoverUrl(PRESET_COVERS[0].url);
      setRating(4.8);
      setLanguage('English');
      setPages(350);
      setTags('Architecture, Best Practices, Cloud');
      setDescription('');
    }
  }, [initialBook, isOpen]);

  if (!isOpen) return null;

  const handleGenerateIsbn = () => {
    const randomIsbn = `978-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
    setIsbn(randomIsbn);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !isbn.trim()) {
      alert('Please provide title, author, and ISBN.');
      return;
    }

    const tagArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      ...(initialBook ? { id: initialBook.id, addedDate: initialBook.addedDate } : {}),
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      category,
      publisher: publisher.trim() || 'Lumina Press',
      publishedYear: Number(publishedYear) || 2024,
      totalCopies: Number(totalCopies) || 1,
      availableCopies: Math.min(Number(totalCopies) || 1, Number(availableCopies) || 1),
      rackLocation: rackLocation.trim() || 'General Stacks',
      coverUrl: coverUrl.trim() || PRESET_COVERS[0].url,
      rating: Number(rating) || 4.5,
      language: language.trim() || 'English',
      pages: Number(pages) || 250,
      tags: tagArray.length > 0 ? tagArray : ['General'],
      description: description.trim() || 'No description provided.'
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale-in"
        style={{ maxWidth: '750px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} style={{ color: 'var(--primary-light)' }} />
            <h3 style={{ fontSize: '1.2rem' }}>{initialBook ? 'Edit Catalog Book' : 'Catalog New Book'}</h3>
          </div>
          <button className="btn-icon btn-secondary" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Title & Author */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Designing Data-Intensive Applications"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Author(s) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Martin Kleppmann"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* ISBN & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    ISBN-13 *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateIsbn}
                    style={{ fontSize: '0.72rem', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <Sparkles size={12} /> Auto-Gen
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={isbn}
                  onChange={e => setIsbn(e.target.value)}
                  style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Subject Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as BookCategory)}
                  style={{ width: '100%' }}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Publisher, Year, Pages */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Publisher
                </label>
                <input
                  type="text"
                  placeholder="e.g. MIT Press"
                  value={publisher}
                  onChange={e => setPublisher(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Year
                </label>
                <input
                  type="number"
                  min="1900"
                  max="2030"
                  value={publishedYear}
                  onChange={e => setPublishedYear(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Pages
                </label>
                <input
                  type="number"
                  min="1"
                  value={pages}
                  onChange={e => setPages(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Copies and Shelf Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Total Copies
                </label>
                <input
                  type="number"
                  min="1"
                  value={totalCopies}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setTotalCopies(val);
                    if (!initialBook) setAvailableCopies(val);
                  }}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Available Free
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalCopies}
                  value={availableCopies}
                  onChange={e => setAvailableCopies(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Physical Shelf / Rack Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rack CS-204, 3rd Floor"
                  value={rackLocation}
                  onChange={e => setRackLocation(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Cover Image & Presets */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Cover Image URL or Choose Preset
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={coverUrl}
                  onChange={e => setCoverUrl(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {PRESET_COVERS.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setCoverUrl(preset.url)}
                    className={`filter-pill ${coverUrl === preset.url ? 'active' : ''}`}
                    style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                  >
                    <ImageIcon size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Subject Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="Databases, Distributed Systems, Cloud"
                value={tags}
                onChange={e => setTags(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Synopsis / Book Summary
              </label>
              <textarea
                rows={3}
                placeholder="Enter a brief overview of the book contents..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialBook ? 'Save Changes' : 'Add to Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
