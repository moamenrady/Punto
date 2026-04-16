import React from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_META = {
  '/': {
    label: 'Ticketing System',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A9FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
      </svg>
    )
  },
  '/dashboard': {
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A9FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    )
  },
  '/stock': {
    label: 'Stock Management',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A9FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      </svg>
    )
  }
};

const TICKET_DETAIL_META = {
  label: 'Ticket Details',
  icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A9FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  )
};

const Header = ({ currentUserRole, setCurrentUserRole, theme, setTheme, searchQuery, setSearchQuery }) => {
  const location = useLocation();
  const isTicketDetail = location.pathname.startsWith('/ticket/');
  const meta = isTicketDetail
    ? TICKET_DETAIL_META
    : (PAGE_META[location.pathname] || PAGE_META['/']);

  return (
    <header className="top-header">
      {/* Left: Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {meta.icon}
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>
          {meta.label}
        </span>
      </div>

      {/* Center: Search */}
      <div className="ds-search-wrap" style={{ flex: 1, maxWidth: 480, margin: '0 24px' }}>
        <span className="ds-search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          type="search"
          placeholder="Search by ID, title, category, or user..."
          className="ds-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', padding: 4
            }}
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Right: Actions */}
      <div className="header-actions">
        {/* Role Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F9FAFB', padding: '6px 10px', borderRadius: 8, border: '1px solid #E9EBF0' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Role:</span>
          <button
            onClick={() => setCurrentUserRole(currentUserRole === 'admin' ? 'user' : 'admin')}
            className={`ds-btn ${currentUserRole === 'admin' ? 'ds-btn-primary' : 'ds-btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.78rem', borderRadius: 6 }}
          >
            {currentUserRole === 'admin' ? 'Admin' : 'User'}
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="icon-btn"
          aria-label="Toggle theme"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>

        {/* Messages */}
        <button className="icon-btn" aria-label="Messages" title="Messages">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>

        {/* Notifications */}
        <button className="icon-btn" aria-label="Notifications" title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 12, borderLeft: '1px solid #E9EBF0' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>User</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Ahmed Ali</div>
          </div>
          <img
            className="avatar"
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #EEF1FD' }}
            src="https://ui-avatars.com/api/?name=Ahmed+Ali&background=EEF1FD&color=8A9FE8"
            alt="User Profile Avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
