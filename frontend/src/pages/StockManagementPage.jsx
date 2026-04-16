import React, { useMemo, useState } from 'react';
import AssetTable from '../components/AssetTable';
import UploadCSVModal from '../components/UploadCSVModal';
import ViewAssetModal from '../components/ViewAssetModal';
import ReduceAssetModal from '../components/ReduceAssetModal';
import { AddAssetModal, EditAssetModal } from '../components/AssetFormModal';
import { mockAssets, getAssetStatus } from '../data/assetData';

const formatCurrency = (value) => `$${value.toLocaleString()}`;

const StockManagementPage = ({ currentUserRole }) => {
  const [assets, setAssets] = useState(mockAssets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const filteredAssets = useMemo(() => {
    if (!searchQuery.trim()) return assets;
    const term = searchQuery.toLowerCase();
    return assets.filter((asset) =>
      [asset.id, asset.name, asset.category, asset.sku, asset.status]
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [searchQuery, assets]);

  const summary = useMemo(() => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.value * asset.quantity, 0);
    const lowStock = assets.filter((asset) => getAssetStatus(asset.quantity) === 'Low Stock').length;
    const outOfStock = assets.filter((asset) => getAssetStatus(asset.quantity) === 'Out of Stock').length;
    return { totalItems: assets.length, lowStock, outOfStock, totalValue };
  }, [assets]);

  const openModal = (name, asset = null) => {
    setSelectedAsset(asset);
    setActiveModal(name);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedAsset(null);
  };

  const handleAddOrEdit = (newAsset) => {
    setAssets((prev) => {
      const existing = prev.find((item) => item.id === newAsset.id);
      if (existing) {
        return prev.map((item) => (item.id === newAsset.id ? { ...newAsset, status: getAssetStatus(newAsset.quantity) } : item));
      }
      return [...prev, { ...newAsset, status: getAssetStatus(newAsset.quantity) }];
    });
    closeModal();
  };

  const handleDelete = (asset) => {
    setAssets((prev) => prev.filter((item) => item.id !== asset.id));
  };

  const handleReduce = (id, quantityToReduce, reason) => {
    setAssets((prev) => prev.map((asset) => {
      if (asset.id !== id) return asset;
      const quantity = Math.max(0, asset.quantity - quantityToReduce);
      return { ...asset, quantity, status: getAssetStatus(quantity) };
    }));
    closeModal();
    console.log('Reduce audit', { id, quantityToReduce, reason });
  };

  const statCards = [
    { label: 'Total Items',   value: summary.totalItems,              icon: '📦', valueColor: '#059669' },
    { label: 'Low Stock',     value: summary.lowStock,                icon: '⚠️', valueColor: '#D97706' },
    { label: 'Out of Stock',  value: summary.outOfStock,              icon: '🔴', valueColor: '#DC2626' },
    { label: 'Total Value',   value: formatCurrency(summary.totalValue), icon: '💰', valueColor: '#8A9FE8' },
  ];

  return (
    <div className="ds-page">
      <div className="page-content-wrapper">

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>Stock Management</h1>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8A9FE8', background: '#EEF1FD', border: '1px solid #C7D2F8', borderRadius: 20, padding: '2px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {currentUserRole === 'admin' ? 'IT Admin' : 'IT User'}
              </span>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', margin: 0 }}>
              Role-based inventory controls for IT assets — Manage stock across departments with audit tracking.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div className="ds-search-wrap" style={{ width: 300 }}>
              <span className="ds-search-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets by name, sku, category..."
                className="ds-search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', padding: 2 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
            {currentUserRole === 'admin' && (
              <>
                <button onClick={() => openModal('upload')} className="ds-btn ds-btn-secondary">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                  </svg>
                  Upload CSV
                </button>
                <button onClick={() => openModal('add')} className="ds-btn ds-btn-primary">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Asset
                </button>
              </>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {statCards.map((stat) => (
            <div key={stat.label} className="ds-card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>{stat.label}</p>
                  <p style={{ fontSize: stat.label === 'Total Value' ? '1.5rem' : '2rem', fontWeight: 800, color: stat.valueColor, margin: 0, lineHeight: 1 }}>{stat.value}</p>
                </div>
                <span style={{ fontSize: '1.5rem', opacity: 0.7 }}>{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Asset Inventory Card */}
        <div className="ds-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #E9EBF0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>Asset Inventory</h2>
              <p style={{ fontSize: '0.78rem', color: '#9CA3AF', margin: 0 }}>Complete list of managed assets with real-time status.</p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', background: '#F3F4F6', border: '1px solid #E9EBF0', borderRadius: 20, padding: '4px 12px', whiteSpace: 'nowrap' }}>
              {filteredAssets.length} of {assets.length} showing
            </span>
          </div>

          <AssetTable
            assets={filteredAssets}
            currentUserRole={currentUserRole}
            onViewAsset={(asset) => openModal('view', asset)}
            onEditAsset={(asset) => openModal('edit', asset)}
            onDeleteAsset={handleDelete}
            onReduceAsset={(asset) => openModal('reduce', asset)}
          />
        </div>

      </div>

      {activeModal === 'view' && selectedAsset && (
        <ViewAssetModal asset={selectedAsset} onClose={closeModal} />
      )}
      {activeModal === 'reduce' && selectedAsset && (
        <ReduceAssetModal asset={selectedAsset} onClose={closeModal} onConfirm={handleReduce} />
      )}
      {activeModal === 'upload' && (
        <UploadCSVModal onClose={closeModal} onUpload={(file) => { console.log('Upload CSV file', file); closeModal(); }} />
      )}
      {activeModal === 'add' && (
        <AddAssetModal onClose={closeModal} onSubmit={handleAddOrEdit} />
      )}
      {activeModal === 'edit' && selectedAsset && (
        <EditAssetModal asset={selectedAsset} onClose={closeModal} onSubmit={handleAddOrEdit} />
      )}
    </div>
  );
};

export default StockManagementPage;
