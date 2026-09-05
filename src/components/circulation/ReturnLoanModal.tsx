import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  RotateCcw
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import type { Loan } from '../../types';

interface ReturnLoanModalProps {
  loan: Loan | null;
  onClose: () => void;
}

export const ReturnLoanModal: React.FC<ReturnLoanModalProps> = ({ loan, onClose }) => {
  const { returnBook, settings } = useLibrary();

  const [condition, setCondition] = useState<'good' | 'damaged' | 'lost'>('good');
  const [damageFine, setDamageFine] = useState<number>(0);
  const [returnNotes, setReturnNotes] = useState<string>('');

  if (!loan) return null;

  const today = new Date().toISOString().split('T')[0];
  const isOverdue = loan.dueDate < today;
  const daysOverdue = isOverdue
    ? Math.max(1, Math.ceil((new Date(today).getTime() - new Date(loan.dueDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const calculatedOverdueFine = Number((daysOverdue * settings.finePerDay).toFixed(2));
  const totalFine = Number((calculatedOverdueFine + Number(damageFine || 0)).toFixed(2));

  const handleConditionChange = (cond: 'good' | 'damaged' | 'lost') => {
    setCondition(cond);
    if (cond === 'damaged') {
      setDamageFine(5.00);
    } else if (cond === 'lost') {
      setDamageFine(25.00);
    } else {
      setDamageFine(0);
    }
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    returnBook(loan.id, condition, Number(damageFine) || 0, returnNotes);
    onClose();
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
            <RotateCcw size={20} style={{ color: '#10b981' }} />
            <h3 style={{ fontSize: '1.2rem' }}>Process Book Return</h3>
          </div>
          <button className="btn-icon btn-secondary" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleConfirm}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Book & Borrower Summary Card */}
            <div
              className="glass-panel"
              style={{
                padding: '16px',
                display: 'flex',
                gap: '14px',
                alignItems: 'center'
              }}
            >
              <img
                src={loan.bookCoverUrl}
                alt={loan.bookTitle}
                style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>{loan.bookTitle}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Borrower: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{loan.memberName}</span> ({loan.memberCode})
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Issued: {loan.issueDate} · Due: {loan.dueDate}
                </div>
              </div>
            </div>

            {/* Overdue Assessment Alert if overdue */}
            {isOverdue && (
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <AlertTriangle size={22} style={{ color: '#fb7185' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fb7185' }}>
                    Item is {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} overdue!
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Late penalty rate: {settings.currencySymbol}{settings.finePerDay.toFixed(2)}/day = <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{settings.currencySymbol}{calculatedOverdueFine.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Book Condition Check */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Item Physical Condition Assessment
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  className={`glass-panel ${condition === 'good' ? 'active' : ''}`}
                  onClick={() => handleConditionChange('good')}
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: condition === 'good' ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                    background: condition === 'good' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)'
                  }}
                >
                  <div style={{ fontWeight: 700, color: condition === 'good' ? '#34d399' : 'var(--text-primary)', fontSize: '0.85rem' }}>
                    Good Condition
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>No damage</div>
                </button>

                <button
                  type="button"
                  className={`glass-panel ${condition === 'damaged' ? 'active' : ''}`}
                  onClick={() => handleConditionChange('damaged')}
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: condition === 'damaged' ? '2px solid #f59e0b' : '1px solid var(--border-subtle)',
                    background: condition === 'damaged' ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-card)'
                  }}
                >
                  <div style={{ fontWeight: 700, color: condition === 'damaged' ? '#fbbf24' : 'var(--text-primary)', fontSize: '0.85rem' }}>
                    Damaged / Torn
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Repair fee</div>
                </button>

                <button
                  type="button"
                  className={`glass-panel ${condition === 'lost' ? 'active' : ''}`}
                  onClick={() => handleConditionChange('lost')}
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: condition === 'lost' ? '2px solid #f43f5e' : '1px solid var(--border-subtle)',
                    background: condition === 'lost' ? 'rgba(244, 63, 94, 0.15)' : 'var(--bg-card)'
                  }}
                >
                  <div style={{ fontWeight: 700, color: condition === 'lost' ? '#fb7185' : 'var(--text-primary)', fontSize: '0.85rem' }}>
                    Lost Item
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Replacement cost</div>
                </button>
              </div>
            </div>

            {/* Extra damage / replacement fee input if condition is not good */}
            {condition !== 'good' && (
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {condition === 'damaged' ? 'Damage & Binding Repair Fee ($)' : 'Full Replacement Cost ($)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={damageFine}
                  onChange={e => setDamageFine(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {/* Total fine calculation box */}
            <div
              className="glass-panel"
              style={{
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: totalFine > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: totalFine > 0 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Receipt size={18} style={{ color: totalFine > 0 ? '#f59e0b' : '#10b981' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Total Penalty Assessed:
                </span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: totalFine > 0 ? '#fbbf24' : '#34d399' }}>
                {settings.currencySymbol}{totalFine.toFixed(2)}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Return Processing Remarks (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Returned at front desk, checked all pages"
                value={returnNotes}
                onChange={e => setReturnNotes(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <CheckCircle2 size={16} />
              <span>Complete Return & Check-in</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
