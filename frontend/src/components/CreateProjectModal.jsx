import React, { useState } from 'react';

const CreateProjectModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        projectName: '', description: '', startDate: '', endDate: '', members: [],
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    if (!isOpen) return null;

    const validate = (name, value) => {
        switch (name) {
            case 'projectName':
                if (!value.trim()) return 'Project name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                if (value.trim().length > 80) return 'Name must be under 80 characters';
                return '';
            case 'description':
                if (!value.trim()) return 'Description is required';
                if (value.trim().length < 10) return 'Description must be at least 10 characters';
                return '';
            case 'startDate': return value ? '' : 'Start date is required';
            case 'endDate':
                if (!value) return 'End date is required';
                if (formData.startDate && value < formData.startDate) return 'End date must be after start date';
                return '';
            default: return '';
        }
    };

    const handleChange = (e) => {
        const { name, value, type, selectedOptions } = e.target;
        if (name === 'projectName' && /\d/.test(value.charAt(value.length - 1)) && value.length > (formData.projectName || '').length) return;
        if (type === 'select-multiple') {
            setFormData((prev) => ({ ...prev, [name]: Array.from(selectedOptions).map(o => o.value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
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
        const fields = ['projectName', 'description', 'startDate', 'endDate'];
        const newErrors = {};
        let hasError = false;
        fields.forEach((f) => { const msg = validate(f, formData[f]); if (msg) { newErrors[f] = msg; hasError = true; } });
        setErrors(newErrors);
        setTouched({ projectName: true, description: true, startDate: true, endDate: true });
        if (hasError) return;
        if (onSubmit) onSubmit({ name: formData.projectName, description: formData.description, startDate: formData.startDate, endDate: formData.endDate, members: formData.members });
        setFormData({ projectName: '', description: '', startDate: '', endDate: '', members: [] });
        setErrors({});
        setTouched({});
    };

    const inputClass = (name) => `ds-input${touched[name] && errors[name] ? ' error' : ''}`;

    return (
        <div className="ds-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
            <div className="ds-modal">
                <div className="ds-modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF1FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#8A9FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                            </svg>
                        </div>
                        <h2 className="ds-modal-title">Create New Project</h2>
                    </div>
                    <button className="ds-modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="ds-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                        <div className="ds-form-group">
                            <label className="ds-label">Project Name <span style={{ color: '#EF4444' }}>*</span></label>
                            <input
                                type="text" name="projectName"
                                className={inputClass('projectName')}
                                placeholder="Enter project name (letters only)"
                                value={formData.projectName}
                                onChange={handleChange} onBlur={handleBlur} onKeyDown={blockNumbers}
                                required minLength={2} maxLength={80}
                            />
                            {touched.projectName && errors.projectName && <span className="ds-error">{errors.projectName}</span>}
                        </div>

                        <div className="ds-form-group">
                            <label className="ds-label">Description <span style={{ color: '#EF4444' }}>*</span></label>
                            <textarea
                                name="description"
                                className={`ds-textarea${touched.description && errors.description ? ' error' : ''}`}
                                placeholder="Enter project description (min 10 characters)"
                                value={formData.description}
                                onChange={handleChange} onBlur={handleBlur}
                                required minLength={10}
                            />
                            {touched.description && errors.description && <span className="ds-error">{errors.description}</span>}
                        </div>

                        <div className="ds-form-row">
                            <div className="ds-form-group">
                                <label className="ds-label">Start Date <span style={{ color: '#EF4444' }}>*</span></label>
                                <input type="date" name="startDate" className={inputClass('startDate')} value={formData.startDate} onChange={handleChange} onBlur={handleBlur} required />
                                {touched.startDate && errors.startDate && <span className="ds-error">{errors.startDate}</span>}
                            </div>
                            <div className="ds-form-group">
                                <label className="ds-label">End Date <span style={{ color: '#EF4444' }}>*</span></label>
                                <input type="date" name="endDate" className={inputClass('endDate')} value={formData.endDate} onChange={handleChange} onBlur={handleBlur} required min={formData.startDate || undefined} />
                                {touched.endDate && errors.endDate && <span className="ds-error">{errors.endDate}</span>}
                            </div>
                        </div>

                        <div className="ds-form-group">
                            <label className="ds-label">Team Members</label>
                            <select name="members" className="ds-select" multiple style={{ minHeight: 80 }} value={formData.members} onChange={handleChange}>
                                <option value="Ahmed Ali">Ahmed Ali</option>
                                <option value="Sara Mohamed">Sara Mohamed</option>
                                <option value="Youssef Khaled">Youssef Khaled</option>
                                <option value="Nour Hassan">Nour Hassan</option>
                                <option value="Ali Omar">Ali Omar</option>
                            </select>
                            <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Hold Ctrl/Cmd to select multiple</span>
                        </div>

                    </div>
                    <div className="ds-modal-footer">
                        <button type="button" className="ds-btn ds-btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="ds-btn ds-btn-primary">
                            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
