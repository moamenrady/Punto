import React, { useState } from 'react';

const CreateTaskModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        taskTitle: '',
        description: '',
        assignee: '',
        sprint: '',
        priority: '',
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    if (!isOpen) return null;

    const validate = (name, value) => {
        switch (name) {
            case 'taskTitle':
                if (!value.trim()) return 'Task title is required';
                if (value.trim().length < 3) return 'Title must be at least 3 characters';
                if (value.trim().length > 100) return 'Title must be under 100 characters';
                return '';
            case 'description':
                if (value.trim() && value.trim().length < 5)
                    return 'Description must be at least 5 characters if provided';
                return '';
            case 'assignee': return value ? '' : 'Please select a team member';
            case 'sprint':   return value ? '' : 'Please select a sprint';
            case 'priority': return value ? '' : 'Please select a priority';
            default: return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'taskTitle' && /\d/.test(value.charAt(value.length - 1)) && value.length > (formData.taskTitle || '').length) return;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (touched[name]) setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    };

    const blockNumbers = (e) => { if (/\d/.test(e.key)) e.preventDefault(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fields = ['taskTitle', 'assignee', 'sprint', 'priority'];
        const newErrors = {};
        let hasError = false;
        fields.forEach((f) => { const msg = validate(f, formData[f]); if (msg) { newErrors[f] = msg; hasError = true; } });
        const descMsg = validate('description', formData.description);
        if (descMsg) { newErrors.description = descMsg; hasError = true; }
        setErrors(newErrors);
        setTouched({ taskTitle: true, assignee: true, sprint: true, priority: true, description: true });
        if (hasError) return;
        if (onSubmit) onSubmit({ title: formData.taskTitle, assignee: formData.assignee, priority: formData.priority, sprint: formData.sprint, description: formData.description });
        setFormData({ taskTitle: '', description: '', assignee: '', sprint: '', priority: '' });
        setErrors({});
        setTouched({});
    };

    const inputClass = (name) => `ds-input${touched[name] && errors[name] ? ' error' : ''}`;
    const selectClass = (name) => `ds-select${touched[name] && errors[name] ? ' error' : ''}`;

    return (
        <div className="ds-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
            <div className="ds-modal">
                <div className="ds-modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF1FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#8A9FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="12" y1="18" x2="12" y2="12"/>
                                <line x1="9" y1="15" x2="15" y2="15"/>
                            </svg>
                        </div>
                        <h2 className="ds-modal-title">Create New Task</h2>
                    </div>
                    <button className="ds-modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="ds-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                        <div className="ds-form-group">
                            <label className="ds-label">Task Title <span style={{ color: '#EF4444' }}>*</span></label>
                            <input
                                type="text" name="taskTitle"
                                className={inputClass('taskTitle')}
                                placeholder="Enter task title (letters only)"
                                value={formData.taskTitle}
                                onChange={handleChange} onBlur={handleBlur} onKeyDown={blockNumbers}
                                required minLength={3} maxLength={100}
                            />
                            {touched.taskTitle && errors.taskTitle && <span className="ds-error">{errors.taskTitle}</span>}
                        </div>

                        <div className="ds-form-group">
                            <label className="ds-label">Description</label>
                            <textarea
                                name="description"
                                className={`ds-textarea${touched.description && errors.description ? ' error' : ''}`}
                                placeholder="Enter task description"
                                value={formData.description}
                                onChange={handleChange} onBlur={handleBlur}
                            />
                            {touched.description && errors.description && <span className="ds-error">{errors.description}</span>}
                        </div>

                        <div className="ds-form-row">
                            <div className="ds-form-group">
                                <label className="ds-label">Assigned To <span style={{ color: '#EF4444' }}>*</span></label>
                                <select name="assignee" className={selectClass('assignee')} value={formData.assignee} onChange={handleChange} onBlur={handleBlur}>
                                    <option value="" disabled>Select member</option>
                                    <option value="Ahmed Ali">Ahmed Ali</option>
                                    <option value="Sara Mohamed">Sara Mohamed</option>
                                    <option value="Youssef Khaled">Youssef Khaled</option>
                                    <option value="Nour Hassan">Nour Hassan</option>
                                    <option value="Ali Omar">Ali Omar</option>
                                </select>
                                {touched.assignee && errors.assignee && <span className="ds-error">{errors.assignee}</span>}
                            </div>
                            <div className="ds-form-group">
                                <label className="ds-label">Sprint <span style={{ color: '#EF4444' }}>*</span></label>
                                <select name="sprint" className={selectClass('sprint')} value={formData.sprint} onChange={handleChange} onBlur={handleBlur}>
                                    <option value="" disabled>Select sprint</option>
                                    <option value="Sprint 1">Sprint 1</option>
                                    <option value="Sprint 2">Sprint 2</option>
                                </select>
                                {touched.sprint && errors.sprint && <span className="ds-error">{errors.sprint}</span>}
                            </div>
                        </div>

                        <div className="ds-form-group">
                            <label className="ds-label">Priority <span style={{ color: '#EF4444' }}>*</span></label>
                            <select name="priority" className={selectClass('priority')} value={formData.priority} onChange={handleChange} onBlur={handleBlur}>
                                <option value="" disabled>Select Priority</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            {touched.priority && errors.priority && <span className="ds-error">{errors.priority}</span>}
                        </div>

                    </div>
                    <div className="ds-modal-footer">
                        <button type="button" className="ds-btn ds-btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="ds-btn ds-btn-primary">
                            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
