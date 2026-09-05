import React from 'react';
import { X, Printer, Download, BookMarked, QrCode } from 'lucide-react';
import type { Member } from '../../types';
import { useLibrary } from '../../context/LibraryContext';

interface LibraryCardModalProps {
  member: Member | null;
  onClose: () => void;
}

export const LibraryCardModal: React.FC<LibraryCardModalProps> = ({ member, onClose }) => {
  const { settings, addToast } = useLibrary();

  if (!member) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    addToast('success', 'Card Exported', `Digital library pass downloaded for ${member.name}.`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale-in"
        style={{ maxWidth: '520px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookMarked size={20} style={{ color: 'var(--primary-light)' }} />
            <h3 style={{ fontSize: '1.2rem' }}>Digital Patron Card</h3>
          </div>
          <button className="btn-icon btn-secondary" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px' }}>
          {/* Card Presentation Container */}
          <div className="digital-id-card">
            {/* Header */}
            <div className="digital-id-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookMarked size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.02em' }}>{settings.libraryName}</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Official Patron Pass</div>
                </div>
              </div>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.65rem' }}>
                {member.role.toUpperCase()}
              </span>
            </div>

            {/* Body */}
            <div className="digital-id-body">
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="digital-id-avatar"
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', lineHeight: 1.2 }}>
                  {member.name}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '2px' }}>
                  {member.department || 'General Membership'}
                </div>
                <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: '6px' }}>
                  Member Since: {member.joinDate}
                </div>
                <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>
                  Borrow Allowance: Up to {member.maxLoanLimit} Items
                </div>
              </div>
            </div>

            {/* Barcode Strip */}
            <div style={{ marginTop: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div className="barcode-strip" style={{ flex: 1 }}>
                |||| | ||||| || |||||| | ||||| |||
                <span style={{ fontSize: '0.75rem', letterSpacing: '1px', marginLeft: '8px' }}>
                  {member.memberCode}
                </span>
              </div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  background: 'white',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'black'
                }}
              >
                <QrCode size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleDownload}>
            <Download size={16} />
            <span>Download PNG</span>
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
