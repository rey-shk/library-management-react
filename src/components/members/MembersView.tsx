import React, { useState } from 'react';
import { UserPlus, Search, Sparkles } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import type { MemberRole } from '../../types';
import { MemberCard } from './MemberCard';
import { MemberDetailModal } from './MemberDetailModal';
import { AddEditMemberModal } from './AddEditMemberModal';
import { LibraryCardModal } from './LibraryCardModal';

export const MembersView: React.FC = () => {
  const {
    members,
    addMember,
    updateMember,
    selectedMember,
    setSelectedMember,
    editingMember,
    setEditingMember,
    cardMember,
    setCardMember,
    isAddMemberModalOpen,
    setIsAddMemberModalOpen
  } = useLibrary();

  const [roleFilter, setRoleFilter] = useState<'all' | MemberRole>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = members.filter(mem => {
    // Role filter
    if (roleFilter !== 'all' && mem.role !== roleFilter) return false;

    // Search query
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      mem.name.toLowerCase().includes(q) ||
      mem.memberCode.toLowerCase().includes(q) ||
      mem.email.toLowerCase().includes(q) ||
      (mem.department && mem.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="view-container animate-fade-in">
      {/* View Header */}
      <div className="view-header">
        <div className="view-header-title">
          <h2>Patron & Member Directory</h2>
          <p>Manage student IDs, faculty accounts, borrow quotas, and credentials</p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsAddMemberModalOpen(true)}>
          <UserPlus size={16} />
          <span>Register New Patron</span>
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="catalog-toolbar">
        {/* Role Pills */}
        <div className="filter-pills">
          <button
            className={`filter-pill ${roleFilter === 'all' ? 'active' : ''}`}
            onClick={() => setRoleFilter('all')}
          >
            All Patrons ({members.length})
          </button>
          <button
            className={`filter-pill ${roleFilter === 'student' ? 'active' : ''}`}
            onClick={() => setRoleFilter('student')}
          >
            Students ({members.filter(m => m.role === 'student').length})
          </button>
          <button
            className={`filter-pill ${roleFilter === 'faculty' ? 'active' : ''}`}
            onClick={() => setRoleFilter('faculty')}
          >
            Faculty ({members.filter(m => m.role === 'faculty').length})
          </button>
          <button
            className={`filter-pill ${roleFilter === 'researcher' ? 'active' : ''}`}
            onClick={() => setRoleFilter('researcher')}
          >
            Researchers ({members.filter(m => m.role === 'researcher').length})
          </button>
          <button
            className={`filter-pill ${roleFilter === 'patron' ? 'active' : ''}`}
            onClick={() => setRoleFilter('patron')}
          >
            Community ({members.filter(m => m.role === 'patron').length})
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
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
            placeholder="Search patron name, ID, email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', width: '100%', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '50px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Sparkles size={32} style={{ color: 'var(--text-muted)' }} />
          <h3>No patrons match your search</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Try adjusting your search criteria or register a new patron.
          </p>
        </div>
      ) : (
        <div className="members-grid">
          {filteredMembers.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              onSelect={setSelectedMember}
              onEdit={setEditingMember}
              onViewCard={setCardMember}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onEdit={m => {
          setSelectedMember(null);
          setEditingMember(m);
        }}
        onViewCard={m => {
          setSelectedMember(null);
          setCardMember(m);
        }}
      />

      <AddEditMemberModal
        isOpen={isAddMemberModalOpen || editingMember !== null}
        initialMember={editingMember}
        onClose={() => {
          setIsAddMemberModalOpen(false);
          setEditingMember(null);
        }}
        onSubmit={memberData => {
          if (editingMember) {
            updateMember(memberData);
          } else {
            addMember(memberData);
          }
        }}
      />

      <LibraryCardModal
        member={cardMember}
        onClose={() => setCardMember(null)}
      />
    </div>
  );
};
