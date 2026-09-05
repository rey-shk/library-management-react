import React from 'react';
import { CreditCard, Edit2, AlertCircle } from 'lucide-react';
import type { Member } from '../../types';

interface MemberCardProps {
  member: Member;
  onSelect: (member: Member) => void;
  onEdit: (member: Member) => void;
  onViewCard: (member: Member) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onSelect,
  onEdit,
  onViewCard
}) => {
  const quotaPercent = Math.round((member.activeLoanCount / member.maxLoanLimit) * 100);

  const getRoleBadge = (role: Member['role']) => {
    switch (role) {
      case 'faculty':
        return <span className="badge badge-purple">Faculty</span>;
      case 'researcher':
        return <span className="badge badge-info">Researcher</span>;
      case 'student':
        return <span className="badge badge-primary">Student</span>;
      default:
        return <span className="badge badge-warning">Patron</span>;
    }
  };

  return (
    <div
      className="glass-panel member-card glass-panel-interactive"
      onClick={() => onSelect(member)}
    >
      {/* Top Header */}
      <div className="member-card-top">
        <img
          src={member.avatarUrl}
          alt={member.name}
          className="member-avatar"
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
            <h4
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {member.name}
            </h4>
            {getRoleBadge(member.role)}
          </div>
          <div className="member-code-tag">{member.memberCode}</div>
        </div>
      </div>

      {/* Details */}
      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        {member.department || 'General Membership'}
      </div>

      {/* Quota & Fines */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Loans In Hand</span>
          <span style={{ fontWeight: 700, color: member.activeLoanCount >= member.maxLoanLimit ? '#fb7185' : 'var(--text-primary)' }}>
            {member.activeLoanCount} / {member.maxLoanLimit} Books
          </span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
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

      {/* Footer Info & Actions */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div>
          {member.totalFinesPending > 0 ? (
            <span style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <AlertCircle size={12} /> ${member.totalFinesPending.toFixed(2)} Fine
            </span>
          ) : (
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
              No Fines
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn-icon btn-secondary"
            style={{ width: '32px', height: '32px' }}
            onClick={() => onViewCard(member)}
            title="Digital Patron Pass"
          >
            <CreditCard size={14} />
          </button>
          <button
            className="btn-icon btn-secondary"
            style={{ width: '32px', height: '32px' }}
            onClick={() => onEdit(member)}
            title="Edit Profile"
          >
            <Edit2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
