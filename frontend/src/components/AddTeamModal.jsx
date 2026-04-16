import React, { useState } from 'react';

const AddTeamModal = ({ isOpen, onClose, members = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchError, setSearchError] = useState('');

    if (!isOpen) return null;

    const blockNumbers = (e) => { if (/\d/.test(e.key)) e.preventDefault(); };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        if (/\d/.test(value.charAt(value.length - 1)) && value.length > searchTerm.length) {
            setSearchError('Search accepts letters only');
            return;
        }
        setSearchError('');
        setSearchTerm(value);
    };

    const filteredMembers = members.filter((member) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return member.name.toLowerCase().includes(term) || member.role.toLowerCase().includes(term);
    });

    return (
        <div className="ds-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
            <div className="ds-modal">
                <div className="ds-modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF1FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#8A9FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        </div>
                        <h2 className="ds-modal-title">Team Members</h2>
                    </div>
                    <button className="ds-modal-close" onClick={onClose}>×</button>
                </div>

                <div className="ds-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Search */}
                    <div className="ds-form-group">
                        <label className="ds-label">Search Members</label>
                        <div className="ds-search-wrap">
                            <span className="ds-search-icon">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg>
                            </span>
                            <input
                                type="text"
                                className="ds-search-input"
                                placeholder="Search by name or role..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onKeyDown={blockNumbers}
                            />
                        </div>
                        {searchError && <span className="ds-error">{searchError}</span>}
                    </div>

                    {/* Members list */}
                    <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                            Members
                            {searchTerm && <span style={{ fontWeight: 400, color: '#9CA3AF', marginLeft: 6 }}>({filteredMembers.length} found)</span>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {filteredMembers.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.875rem', padding: '20px 0' }}>No members match your search</p>
                            ) : (
                                filteredMembers.map(member => (
                                    <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid #E9EBF0', borderRadius: 10, background: '#F9FAFB' }}>
                                        <img
                                            style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0 }}
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=EEF1FD&color=8A9FE8&size=34`}
                                            alt={member.name}
                                        />
                                        <div style={{ flexGrow: 1 }}>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{member.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{member.role}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button style={{ padding: '5px 10px', border: '1px solid #C7D2F8', borderRadius: 6, background: 'transparent', fontSize: '0.75rem', color: '#8A9FE8', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
                                            <button style={{ padding: '5px 10px', border: '1px solid #FECACA', borderRadius: 6, background: 'transparent', fontSize: '0.75rem', color: '#DC2626', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="ds-modal-footer">
                    <button className="ds-btn ds-btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="ds-btn ds-btn-primary">
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTeamModal;
