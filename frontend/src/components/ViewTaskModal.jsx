import React from 'react';

const statusStyle = {
    'To Do':       { background: '#DBEAFE', color: '#1E40AF' },
    'In Progress': { background: '#FEF3C7', color: '#92400E' },
    'Completed':   { background: '#D1FAE5', color: '#065F46' },
};

const priorityStyle = {
    'High':   { background: '#FCE7F3', color: '#9D174D' },
    'Medium': { background: '#FEF3C7', color: '#92400E' },
    'Low':    { background: '#D1FAE5', color: '#065F46' },
};

const ViewTaskModal = ({ task, isOpen, onClose }) => {
    if (!isOpen || !task) return null;

    const rows = [
        { label: 'Title', value: task.title, bold: true },
        { label: 'Assigned To', value: task.assignee },
        { label: 'Sprint', value: task.sprint },
    ];

    return (
        <div className="ds-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
            <div className="ds-modal" style={{ maxWidth: 480 }}>
                <div className="ds-modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF1FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#8A9FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                        </div>
                        <h2 className="ds-modal-title">Task Details</h2>
                    </div>
                    <button className="ds-modal-close" onClick={onClose}>×</button>
                </div>

                <div className="ds-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {rows.map(({ label, value, bold }) => value ? (
                        <div key={label} style={{ background: '#F9FAFB', border: '1px solid #E9EBF0', borderRadius: 8, padding: '10px 14px' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: bold ? 700 : 500, color: '#111827' }}>{value}</div>
                        </div>
                    ) : null)}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={{ background: '#F9FAFB', border: '1px solid #E9EBF0', borderRadius: 8, padding: '10px 14px' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Status</div>
                            <span className="ds-badge" style={statusStyle[task.status] || { background: '#F1F5F9', color: '#475569' }}>{task.status}</span>
                        </div>
                        <div style={{ background: '#F9FAFB', border: '1px solid #E9EBF0', borderRadius: 8, padding: '10px 14px' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Priority</div>
                            <span className="ds-badge" style={priorityStyle[task.priority] || { background: '#F1F5F9', color: '#475569' }}>{task.priority}</span>
                        </div>
                    </div>

                    {task.description && (
                        <div style={{ background: '#F9FAFB', border: '1px solid #E9EBF0', borderRadius: 8, padding: '10px 14px' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Description</div>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6 }}>{task.description}</div>
                        </div>
                    )}
                </div>

                <div className="ds-modal-footer">
                    <button className="ds-btn ds-btn-secondary" style={{ justifyContent: 'center', flex: 1 }} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewTaskModal;
