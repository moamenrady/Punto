import React, { useEffect, useState } from 'react';

const categories = ['Computers', 'Hardware', 'Accessories', 'Cables'];

const AssetFormModal = ({ mode, asset, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [quantity, setQuantity] = useState(1);
  const [value, setValue] = useState(0);
  const [sku, setSku] = useState('');

  useEffect(() => {
    if (asset) {
      setName(asset.name);
      setCategory(asset.category);
      setQuantity(asset.quantity);
      setValue(asset.value);
      setSku(asset.sku);
    }
  }, [asset]);

  const isSubmitDisabled = !name.trim() || !sku.trim() || quantity < 0 || value < 0;

  const handleSubmit = () => {
    if (isSubmitDisabled) return;
    onSubmit({
      id: asset?.id || `ASSET-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      name: name.trim(),
      category,
      quantity: Number(quantity),
      value: Number(value),
      sku: sku.trim()
    });
  };

  return (
    <div className="ds-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="ds-modal">
        {/* Header */}
        <div className="ds-modal-header">
          <h2 className="ds-modal-title">{mode === 'edit' ? 'Edit Asset' : 'Add Asset'}</h2>
          <button className="ds-modal-close" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="ds-modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Asset Name */}
            <div className="ds-form-group">
              <label className="ds-label">Asset Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="ds-input"
                placeholder="e.g., Dell Laptop Pro 15"
              />
            </div>

            {/* SKU */}
            <div className="ds-form-group">
              <label className="ds-label">SKU *</label>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="ds-input"
                placeholder="e.g., DLP-2024-001"
              />
            </div>

            {/* Category & Quantity Row */}
            <div className="ds-form-row">
              <div className="ds-form-group">
                <label className="ds-label">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="ds-select"
                >
                  {categories.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="ds-form-group">
                <label className="ds-label">Quantity *</label>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="ds-input"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Unit Value */}
            <div className="ds-form-group">
              <label className="ds-label">Unit Value *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontWeight: 600, pointerEvents: 'none' }}>$</span>
                <input
                  type="number"
                  min="0"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="ds-input"
                  style={{ paddingLeft: 26 }}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ds-modal-footer">
          <button className="ds-btn ds-btn-secondary" onClick={onClose}>Cancel</button>
          <button
            type="button"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
            className="ds-btn ds-btn-primary"
            style={{ opacity: isSubmitDisabled ? 0.5 : 1, cursor: isSubmitDisabled ? 'not-allowed' : 'pointer' }}
          >
            {mode === 'edit' ? 'Save Changes' : 'Save Asset'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AddAssetModal = (props) => <AssetFormModal mode="add" {...props} />;
export const EditAssetModal = (props) => <AssetFormModal mode="edit" {...props} />;
export default AssetFormModal;
