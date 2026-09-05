import React from 'react';
import {
  X,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Receipt,
  PlusCircle,
  CreditCard,
  Edit2,
  CheckCircle2
} from 'lucide-react';
import type { Member } from '../../types';
import { useLibrary } from '../../context/LibraryContext';

interface MemberDetailModalProps {
  member: Member | null;
  onClose: () => void;
  onEdit: (member: Member) => void;
  onViewCard: (member: Member) => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  onClose,
  onEdit,
  onViewCard
}) => {
  const { loans, setIsIssueModalOpen, setReturnLoanTarget } = useLibrary();

  if (!member) return null;

  // Active loans for this member
  const memberActiveLoans = loans.filter(
    l => l.memberId === member.id && (l.status === 'active' || l.status === 'overdue')
  );

  // Past loans
  const memberPastLoans = loans.filter(
    l => l.memberId === member.id && l.status === 'returned'
  );

  const quotaPercent = Math.round((member.activeLoanCount / member.maxLoanLimit) * 100);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale-in"
        style={{ maxWidth: '780px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
              {member.role} Member
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {member.memberCode}
            </span>
          </div>
          <button className="btn-icon btn-secondary" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Top Profile Summary */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src={member.avatarUrl}
              alt={member.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--primary-light)'
              }}
            />

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '1.4rem' }}>{member.name}</h3>
                <span
                  className={`badge ${
                    member.status === 'active'
                      ? 'badge-success'
                      : member.status === 'suspended'
                      ? 'badge-danger'
                      : 'badge-warning'
                  }`}
                  style={{ fontSize: '0.68rem' }}
                >
                  {member.status.toUpperCase()}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {member.department || 'General Library Patron'}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Mail size={14} /> {member.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={14} /> {member.phone}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={14} /> Joined {member.joinDate}
                </span>
              </div>
            </div>
          </div>

          {/* Quota and Financial Snapshot */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Borrow Quota */}
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600 }}>Active Borrowing Quota</span>
                <span style={{ fontWeight: 700 }}>
                  {member.activeLoanCount} of {member.maxLoanLimit} Items
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${quotaPercent}%`,
                    height: '100%',
                    background: quotaPercent >= 100 ? '#f43f5e' : 'var(--primary-gradient)',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* Fine Balance */}
            <div className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Fine Balance</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: member.totalFinesPending > 0 ? '#fb7185' : '#34d399' }}>
                  ${member.totalFinesPending.toFixed(2)}
                </div>
              </div>
              <Receipt size={24} style={{ color: member.totalFinesPending > 0 ? '#fb7185' : '#34d399' }} />
            </div>
          </div>

          {/* Currently Borrowed Books */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={16} style={{ color: 'var(--primary-light)' }} />
              <span>Currently Borrowed Items ({memberActiveLoans.length})</span>
            </h4>

            {memberActiveLoans.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '10px 0' }}>
                No active loans currently checked out to this patron.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {memberActiveLoans.map(loan => (
                  <div
                    key={loan.id}
                    className="glass-panel"
                    style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={loan.bookCoverUrl}
                        alt={loan.bookTitle}
                        style={{ width: '34px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{loan.bookTitle}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Due date: <span style={{ fontWeight: 600 }}>{loan.dueDate}</span> {loan.status === 'overdue' ? ' (Overdue!)' : ''}
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      onClick={() => {
                        onClose();
                        setReturnLoanTarget(loan);
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>Return</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Loan History */}
          {memberPastLoans.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>
                Loan History ({memberPastLoans.length} Returned Items)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                {memberPastLoans.map(loan => (
                  <div
                    key={loan.id}
                    style={{
                      fontSize: '0.8rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <span>{loan.bookTitle}</span>
                    <span style={{ color: 'var(--text-muted)' }}>Returned {loan.returnDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => { onClose(); onViewCard(member); }}>
            <CreditCard size={16} />
            <span>Digital ID Card</span>
          </button>
          <button className="btn btn-secondary" onClick={() => { onClose(); onEdit(member); }}>
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </button>
          {member.status === 'active' && member.activeLoanCount < member.maxLoanLimit && (
            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                setIsIssueModalOpen(true);
              }}
            >
              <PlusCircle size={16} />
              <span>Issue New Loan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
