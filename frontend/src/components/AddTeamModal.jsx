import React from 'react';

const AddTeamModal = ({ isOpen, onClose, members = [] }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <h2 className="modal-header-title primary">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Add Team
                </h2>

                <div className="form-group">
                    <label className="form-label">Search Members</label>
                    <input type="text" className="form-input" placeholder="Search by name or role..." />
                </div>

                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '12px' }}>Modify Members</h3>

                <div className="team-members-list">
                    {members.map(member => (
                        <div className="team-member-row" key={member.id}>
                            <img className="team-member-avatar" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=E2E8F0&color=475569&size=36`} alt={member.name} />
                            <div className="team-member-info">
                                <h4>{member.name}</h4>
                                <p>{member.role}</p>
                            </div>
                            <div className="team-member-actions">
                                <button className="member-action-btn edit-member">Edit</button>
                                <button className="member-action-btn remove-member">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="modal-actions" style={{ marginTop: '24px' }}>
                    <button className="btn-outline" onClick={onClose}>Cancel</button>
                    <button className="btn-primary">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTeamModal;
