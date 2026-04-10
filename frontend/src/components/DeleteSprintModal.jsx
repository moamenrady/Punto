import React from 'react';

const DeleteSprintModal = ({ sprint, isOpen, onClose, onDelete }) => {
    if (!isOpen || !sprint) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', padding: '40px 32px' }}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className="delete-modal-content">
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ffe6e6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#f15858" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </div>
                    <h2>Delete Sprint</h2>
                    <p>Are you sure you want to delete <span className="sprint-name-highlight">{sprint.name}</span>? This action cannot be undone.</p>
                    <div className="delete-modal-actions">
                        <button className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button className="btn-danger" onClick={() => onDelete(sprint.id)}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteSprintModal;
