import React, { useState, useEffect } from 'react';
import { X, UserPlus } from 'lucide-react';
import type { Member, MemberRole, MemberStatus } from '../../types';

interface AddEditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberData: any) => void;
  initialMember?: Member | null;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
];

export const AddEditMemberModal: React.FC<AddEditMemberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialMember
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<MemberRole>('student');
  const [department, setDepartment] = useState('');
  const [maxLoanLimit, setMaxLoanLimit] = useState<number>(5);
  const [status, setStatus] = useState<MemberStatus>('active');
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0]);

  useEffect(() => {
    if (initialMember) {
      setName(initialMember.name);
      setEmail(initialMember.email);
      setPhone(initialMember.phone);
      setRole(initialMember.role);
      setDepartment(initialMember.department || '');
      setMaxLoanLimit(initialMember.maxLoanLimit);
      setStatus(initialMember.status);
      setAvatarUrl(initialMember.avatarUrl);
    } else {
      setName('');
      setEmail('');
      setPhone('+1 (555) 000-0000');
      setRole('student');
      setDepartment('Computer Science');
      setMaxLoanLimit(5);
      setStatus('active');
      setAvatarUrl(PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]);
    }
  }, [initialMember, isOpen]);

  if (!isOpen) return null;

  const handleRoleChange = (newRole: MemberRole) => {
    setRole(newRole);
    if (newRole === 'faculty') setMaxLoanLimit(10);
    else if (newRole === 'researcher') setMaxLoanLimit(8);
    else if (newRole === 'student') setMaxLoanLimit(5);
    else setMaxLoanLimit(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Please fill out member name and email.');
      return;
    }

    const payload = {
      ...(initialMember ? { id: initialMember.id, memberCode: initialMember.memberCode, joinDate: initialMember.joinDate, activeLoanCount: initialMember.activeLoanCount, totalFinesPending: initialMember.totalFinesPending } : {}),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      department: department.trim() || 'General Patron',
      maxLoanLimit: Number(maxLoanLimit) || 5,
      status,
      avatarUrl: avatarUrl.trim() || PRESET_AVATARS[0]
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-scale-in"
        style={{ maxWidth: '600px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} style={{ color: 'var(--primary-light)' }} />
            <h3 style={{ fontSize: '1.2rem' }}>{initialMember ? 'Edit Patron Profile' : 'Register New Patron'}</h3>
          </div>
          <button className="btn-icon btn-secondary" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Full Name */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="maya.lin@lumina.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Role & Department */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Membership Category
                </label>
                <select
                  value={role}
                  onChange={e => handleRoleChange(e.target.value as MemberRole)}
                  style={{ width: '100%' }}
                >
                  <option value="student">Student (Allowance: 5)</option>
                  <option value="faculty">Faculty / Professor (Allowance: 10)</option>
                  <option value="researcher">Research Scholar (Allowance: 8)</option>
                  <option value="patron">Community Patron (Allowance: 3)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Department / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Department of Engineering"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Max Loans & Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Max Loan Allowance (Books)
                </label>
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={maxLoanLimit}
                  onChange={e => setMaxLoanLimit(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Account Standing Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as MemberStatus)}
                  style={{ width: '100%' }}
                >
                  <option value="active">Active Standing</option>
                  <option value="suspended">Suspended (Fines/Discipline)</option>
                  <option value="expired">Membership Expired</option>
                </select>
              </div>
            </div>

            {/* Avatar Pickers */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Profile Avatar
              </label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {PRESET_AVATARS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Avatar ${idx + 1}`}
                    onClick={() => setAvatarUrl(url)}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: avatarUrl === url ? '3px solid var(--primary-light)' : '2px solid transparent',
                      transition: 'transform 0.15s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialMember ? 'Save Profile' : 'Register Patron'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
