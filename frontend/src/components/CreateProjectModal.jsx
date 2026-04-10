import React from 'react';

const CreateProjectModal = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const project = {
            name: form.projectName.value,
            description: form.description.value,
            startDate: form.startDate.value,
            endDate: form.endDate.value,
        };
        if (onSubmit) onSubmit(project);
        form.reset();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <h2 className="modal-header-title primary">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    Create New Project
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Project Name</label>
                        <input type="text" name="projectName" className="form-input" placeholder="Enter project name" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea name="description" className="form-textarea" placeholder="Enter project description" required></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Start Date</label>
                            <input type="date" name="startDate" className="form-input" required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">End Date</label>
                            <input type="date" name="endDate" className="form-input" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Team Members</label>
                        <select name="members" className="form-select" multiple style={{ minHeight: '80px' }}>
                            <option value="Ahmed Ali">Ahmed Ali</option>
                            <option value="Sara Mohamed">Sara Mohamed</option>
                            <option value="Youssef Khaled">Youssef Khaled</option>
                            <option value="Nour Hassan">Nour Hassan</option>
                            <option value="Ali Omar">Ali Omar</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
