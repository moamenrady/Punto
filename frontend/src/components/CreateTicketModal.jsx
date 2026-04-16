import { useState, useRef } from "react";

const PRIORITY_COLORS = { High: '#EF4444', Medium: '#F59E0B', Low: '#22C55E' };

export default function CreateTicketModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "", category: "", subcategory: "", priority: "", description: "", assignToMe: true,
  });
  const [errors, setErrors] = useState({});
  const [dragging, setDragging] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef();

  const handleChange = (field) => (e) => {
    setFormData((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setAttachedFile(file.name);
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Ticket title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subcategory) newErrors.subcategory = "Subcategory is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    if (onSubmit) onSubmit(formData);
    if (onClose) onClose();
  };

  return (
    <div className="ds-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="ds-modal ds-modal-lg">

        {/* Header */}
        <div className="ds-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#EEF1FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A9FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <h2 className="ds-modal-title">Create New Ticket</h2>
          </div>
          <button className="ds-modal-close" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="ds-modal-body">

          {/* User Info */}
          <div className="ds-user-card">
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              User Information
            </div>
            <div className="ds-user-grid">
              {[["UserID:", "USR-1138"], ["Username:", "Alex Thompson"], ["Email:", "alex.t@corp.com"], ["Phone:", "+1 555-010-9988"]].map(([label, value]) => (
                <div key={label}>
                  <div className="ds-user-label">{label}</div>
                  <div className="ds-user-value">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Details */}
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', marginBottom: 14 }}>Ticket Details</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 148px', gap: 16, alignItems: 'start' }}>

            {/* Left: form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Title */}
              <div className="ds-form-group">
                <label className="ds-label">Ticket Title</label>
                <input
                  className={`ds-input${errors.title ? ' error' : ''}`}
                  placeholder="Enter a brief summary of the issue..."
                  value={formData.title}
                  onChange={handleChange("title")}
                />
                {errors.title && <span className="ds-error">{errors.title}</span>}
              </div>

              {/* Category + Subcategory */}
              <div className="ds-form-row">
                <div className="ds-form-group">
                  <label className="ds-label">Category</label>
                  <select className={`ds-select${errors.category ? ' error' : ''}`} value={formData.category} onChange={handleChange("category")}>
                    <option value="" disabled hidden>Select Category</option>
                    <option>Network Issues</option>
                    <option>Hardware</option>
                    <option>Software</option>
                    <option>Account Access</option>
                  </select>
                  {errors.category && <span className="ds-error">{errors.category}</span>}
                </div>
                <div className="ds-form-group">
                  <label className="ds-label">Subcategory</label>
                  <select className={`ds-select${errors.subcategory ? ' error' : ''}`} value={formData.subcategory} onChange={handleChange("subcategory")}>
                    <option value="" disabled hidden>Select Subcategory</option>
                    <option>VPN Connection</option>
                    <option>Wi-Fi</option>
                    <option>Firewall</option>
                    <option>DNS</option>
                  </select>
                  {errors.subcategory && <span className="ds-error">{errors.subcategory}</span>}
                </div>
              </div>

              {/* Priority */}
              <div className="ds-form-group">
                <label className="ds-label">Priority</label>
                <div style={{ position: 'relative' }}>
                  {formData.priority && (
                    <span style={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      width: 8, height: 8, borderRadius: '50%', pointerEvents: 'none',
                      background: PRIORITY_COLORS[formData.priority] || 'transparent'
                    }} />
                  )}
                  <select
                    className={`ds-select${errors.priority ? ' error' : ''}`}
                    style={formData.priority ? { paddingLeft: 26 } : {}}
                    value={formData.priority}
                    onChange={handleChange("priority")}
                  >
                    <option value="" disabled hidden>Select Priority</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                {errors.priority && <span className="ds-error">{errors.priority}</span>}
              </div>

              {/* Description */}
              <div className="ds-form-group">
                <label className="ds-label">Description</label>
                <textarea
                  className={`ds-textarea${errors.description ? ' error' : ''}`}
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={handleChange("description")}
                />
                {errors.description && <span className="ds-error">{errors.description}</span>}
              </div>
            </div>

            {/* Right: upload + assign */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label className="ds-label">Attach File</label>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                style={{
                  border: `1.5px dashed ${dragging ? '#8A9FE8' : '#D1D5DB'}`,
                  borderRadius: 10,
                  padding: '20px 12px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 8, cursor: 'pointer', background: dragging ? '#EEF1FD' : '#F9FAFB',
                  minHeight: 110, textAlign: 'center', transition: 'border-color 0.15s, background 0.15s'
                }}
              >
                <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={(e) => setAttachedFile(e.target.files[0]?.name)} />
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
                <span style={{ fontSize: '0.72rem', color: '#9CA3AF', lineHeight: 1.4 }}>
                  {attachedFile ? attachedFile : 'Drag & Drop\nor Click to Upload'}
                </span>
              </div>

              {/* Assign to me toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Assign to Me</span>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, assignToMe: !p.assignToMe }))}
                  style={{
                    width: 38, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                    background: formData.assignToMe ? '#8A9FE8' : '#D1D5DB',
                    position: 'relative', transition: 'background 0.2s', flexShrink: 0
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 2, width: 18, height: 18, borderRadius: '50%',
                    background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', transition: 'left 0.2s',
                    left: formData.assignToMe ? 18 : 2
                  }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ds-modal-footer">
          <button className="ds-btn ds-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="ds-btn ds-btn-primary" onClick={handleSubmit}>
            Submit Ticket
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
