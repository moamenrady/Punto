import React from 'react';

const CreateTaskModal = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const task = {
            title: form.taskTitle.value,
            assignee: form.assignee.value,
            priority: form.priority.value,
            sprint: form.sprint.value,
            description: form.description.value,
        };
        if (onSubmit) onSubmit(task);
        form.reset();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <h2 className="modal-header-title primary">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    Create New Task
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Task Title</label>
                        <input type="text" name="taskTitle" className="form-input" placeholder="Enter task title" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-textarea" placeholder="Enter task description"></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Assigned To</label>
                            <select name="assignee" className="form-select" required>
                                <option value="" disabled>Select member</option>
                                <option value="Ahmed Ali">Ahmed Ali</option>
                                <option value="Sara Mohamed">Sara Mohamed</option>
                                <option value="Youssef Khaled">Youssef Khaled</option>
                                <option value="Nour Hassan">Nour Hassan</option>
                                <option value="Ali Omar">Ali Omar</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Sprint</label>
                            <select name="sprint" className="form-select" required>
                                <option value="" disabled>Select sprint</option>
                                <option value="Sprint 1">Sprint 1</option>
                                <option value="Sprint 2">Sprint 2</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Priority</label>
                        <select name="priority" className="form-select" defaultValue="" required>
                            <option value="" disabled>Select Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
