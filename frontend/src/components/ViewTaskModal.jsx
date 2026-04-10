import React from 'react';

const ViewTaskModal = ({ task, isOpen, onClose }) => {
    if (!isOpen || !task) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <h2 className="modal-header-title">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                    Task Details
                </h2>

                <div className="view-task-details">
                    <div className="view-task-row">
                        <span className="view-task-label">Title</span>
                        <span className="view-task-value" style={{ fontWeight: 600 }}>{task.title}</span>
                    </div>

                    <div className="view-task-row">
                        <span className="view-task-label">Assigned To</span>
                        <span className="view-task-value">
                            <div className="task-assignee">
                                <img className="task-assignee-avatar" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee)}&background=E2E8F0&color=475569&size=28`} alt={task.assignee} />
                                {task.assignee}
                            </div>
                        </span>
                    </div>

                    <div className="view-task-row">
                        <span className="view-task-label">Status</span>
                        <span className="view-task-value">
                            <span className={`status-badge ${task.status === 'To Do' ? 'status-todo' : task.status === 'In Progress' ? 'status-inprogress' : 'status-completed'}`}>
                                {task.status}
                            </span>
                        </span>
                    </div>

                    <div className="view-task-row">
                        <span className="view-task-label">Priority</span>
                        <span className="view-task-value">
                            <span className={`priority-badge ${task.priority === 'High' ? 'priority-high' : task.priority === 'Medium' ? 'priority-medium' : 'priority-low'}`}>
                                {task.priority}
                            </span>
                        </span>
                    </div>

                    {task.sprint && (
                        <div className="view-task-row">
                            <span className="view-task-label">Sprint</span>
                            <span className="view-task-value">{task.sprint}</span>
                        </div>
                    )}

                    {task.description && (
                        <div className="view-task-row" style={{ flexDirection: 'column', gap: '6px' }}>
                            <span className="view-task-label">Description</span>
                            <span className="view-task-value" style={{ color: 'var(--text-muted)' }}>{task.description}</span>
                        </div>
                    )}
                </div>

                <div className="modal-actions" style={{ marginTop: '28px' }}>
                    <button className="btn-outline" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewTaskModal;
