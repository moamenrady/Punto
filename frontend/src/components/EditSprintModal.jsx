import React, { useState, useEffect } from 'react';

const EditSprintModal = ({ sprint, isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (sprint) {
            setName(sprint.name || '');
            setStartDate(sprint.startDate || '');
            setEndDate(sprint.endDate || '');
            setStatus(sprint.status || 'Planned');
        }
    }, [sprint]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({ id: sprint.id, name, startDate, endDate, status });
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <h2 className="modal-header-title primary">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    Edit Day Schedules
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Sprint Name</label>
                        <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Start Date</label>
                            <input type="date" className="form-input" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">End Date</label>
                            <input type="date" className="form-input" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="Active">Active</option>
                            <option value="Planned">Planned</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSprintModal;
