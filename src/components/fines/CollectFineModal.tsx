import React, { useState } from 'react';
import { X, Receipt, CheckCircle2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import type { FineTransaction } from '../../types';

interface CollectFineModalProps {
  fine: FineTransaction | null;
  onClose: () => void;
}

export const CollectFineModal: React.FC<CollectFineModalProps> = ({ fine, onClose }) => {
  const { payFine, waiveFine, settings } = useLibrary();

  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Credit Card' | 'Campus Card' | 'Online / UPI'>('Credit Card');
  const [isWaiveMode, setIsWaiveMode] = useState(false);
  const [waiveReason, setWaiveReason] = useState('');

  if (!fine) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (isWaiveMode) {
      waiveFine(fine.id, waiveReason);
    } else {
      payFine(fine.id, paymentMethod);
    }
    onClose();
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
            <Receipt size={20} style={{ color: 'var(--primary-light)' }} />
            <h3 style={{ fontSize: '1.2rem' }}>{isWaiveMode ? 'Waive Outstanding Fine' : 'Collect Fine Payment'}</h3>
          </div>
          <button className="btn-icon btn-secondary" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handlePay}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Fine summary */}
            <div
              className="glass-panel"
              style={{
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{fine.memberName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {fine.memberCode}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Reason: {fine.reason.replace('_', ' ').toUpperCase()} ({fine.bookTitle})
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fb7185' }}>
                {settings.currencySymbol}{fine.amount.toFixed(2)}
              </div>
            </div>

            {/* Toggle Mode: Pay or Waive */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className={`filter-pill ${!isWaiveMode ? 'active' : ''}`}
                style={{ flex: 1, textAlign: 'center' }}
                onClick={() => setIsWaiveMode(false)}
              >
                Payment Received
              </button>
              <button
                type="button"
                className={`filter-pill ${isWaiveMode ? 'active' : ''}`}
                style={{ flex: 1, textAlign: 'center' }}
                onClick={() => setIsWaiveMode(true)}
              >
                Administrative Waiver
              </button>
            </div>

            {!isWaiveMode ? (
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  Payment Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {(['Cash', 'Credit Card', 'Campus Card', 'Online / UPI'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      className={`glass-panel ${paymentMethod === method ? 'active' : ''}`}
                      onClick={() => setPaymentMethod(method)}
                      style={{
                        padding: '10px 14px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: paymentMethod === method ? '2px solid var(--primary-light)' : '1px solid var(--border-subtle)',
                        background: paymentMethod === method ? 'var(--primary-glow)' : 'var(--bg-card)'
                      }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Reason for Fee Waiver *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medical emergency / System glitch / First offense waiver"
                  value={waiveReason}
                  onChange={e => setWaiveReason(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ background: isWaiveMode ? '#64748b' : 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <CheckCircle2 size={16} />
              <span>{isWaiveMode ? 'Confirm Waiver' : `Collect ${settings.currencySymbol}${fine.amount.toFixed(2)}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
