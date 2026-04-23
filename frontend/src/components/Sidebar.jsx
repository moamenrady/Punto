import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Project Management',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    to: '/tickets',
    label: 'Ticketing System',
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    ),
  },
  {
    to: '/stock',
    label: 'Stock Management',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    to: '/chatmodal',
    label: 'Group Chat',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    label: 'Reports & Analytics',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

const Sidebar = ({ user }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sidebar_collapsed') === 'true'
  );

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar_collapsed', String(next));
  };

  const handleLogout = () => {
    localStorage.removeItem('vertex_user');
    localStorage.removeItem('vertex_expiry');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const W = collapsed ? 72 : 260;

  return (
    /*
     * Wrapper: position:relative so the toggle button (absolute inside it)
     * can poke out to the RIGHT of the <aside> without being clipped,
     * because the wrapper itself has NO overflow restriction.
     */
    <div style={{
      position: 'relative',
      flexShrink: 0,
      zIndex: 50,
      width: W,
      minWidth: W,
      transition: 'width .28s cubic-bezier(.4,0,.2,1), min-width .28s cubic-bezier(.4,0,.2,1)',
    }}>

      {/* ── The actual sidebar panel ── */}
      <aside style={{
        width: '100%',
        height: '100%',
        background: '#ffffff',
        borderRight: '1px solid #E9EBF0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
        overflow: 'hidden',   /* clips text during collapse — does NOT clip the button */
        position: 'absolute',
        top: 0, left: 0, bottom: 0,
      }}>

        {/* Logo */}
        <div style={{
          padding: collapsed ? '0 16px' : '0 20px',
          display: 'flex', alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid #E9EBF0',
          minHeight: 64,
          transition: 'padding .28s',
        }}>
          <div style={{
            width: 36, height: 36, background: '#8A9FE8', borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ color:'#fff', fontWeight:800, fontSize:'1rem' }}>V</span>
          </div>
          <span style={{
            color: '#8A9FE8', fontWeight: 700, fontSize: '1.15rem',
            letterSpacing: '-0.01em', whiteSpace: 'nowrap',
            opacity: collapsed ? 0 : 1,
            transition: 'opacity .2s',
            overflow: 'hidden',
          }}>
            VERTEX
          </span>
        </div>

        {/* Nav */}
        <nav style={{
          padding: collapsed ? '14px 8px' : '14px 10px',
          display: 'flex', flexDirection: 'column', gap: 3,
          flexGrow: 1, overflowY: 'auto', overflowX: 'hidden',
          transition: 'padding .28s',
        }}>
          {NAV_ITEMS.map(item => {
            const inner = (active = false) => (
              <div
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: 11,
                  padding: collapsed ? '11px 0' : '10px 13px',
                  color: active ? '#534AB7' : '#6B7280',
                  borderRadius: 12, cursor: 'pointer',
                  fontWeight: active ? 700 : 500, fontSize: '0.875rem',
                  background: active ? '#EEF1FD' : 'transparent',
                  border: `1px solid ${active ? '#C7D2F8' : 'transparent'}`,
                  transition: 'all .18s',
                  whiteSpace: 'nowrap', overflow: 'hidden',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background='#F5F6FF'; e.currentTarget.style.color='#534AB7'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#6B7280'; }}}
              >
                <span style={{ flexShrink:0, display:'flex', width:18, height:18 }}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span style={{ overflow:'hidden', textOverflow:'ellipsis' }}>
                    {item.label}
                  </span>
                )}
              </div>
            );

            if (item.to) {
              return (
                <NavLink key={item.label} to={item.to} end={item.end} style={{ textDecoration:'none' }}>
                  {({ isActive }) => inner(isActive)}
                </NavLink>
              );
            }
            return <div key={item.label}>{inner(false)}</div>;
          })}
        </nav>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid #E9EBF0',
          padding: collapsed ? '10px 8px' : '10px 10px',
          display: 'flex', flexDirection: 'column', gap: 6,
          transition: 'padding .28s',
        }}>
          {user && !collapsed && (
            <div style={{ display:'flex', alignItems:'center', gap:9, padding:'7px 9px', background:'#F9FAFB', borderRadius:10 }}>
              <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#8A9FE8,#534AB7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:800, color:'#fff', flexShrink:0 }}>
                {user.name?.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() ?? 'U'}
              </div>
              <div style={{ minWidth:0 }}>
                <p style={{ margin:0, fontSize:'0.8rem', fontWeight:700, color:'#111827', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</p>
                <p style={{ margin:0, fontSize:'0.68rem', color:'#9CA3AF', textTransform:'capitalize' }}>{user.role}</p>
              </div>
            </div>
          )}
          <div
            onClick={handleLogout}
            title={collapsed ? 'Log Out' : undefined}
            style={{ display:'flex', alignItems:'center', justifyContent: collapsed?'center':'flex-start', gap:10, padding: collapsed?'10px 0':'9px 13px', color:'#EF4444', borderRadius:10, cursor:'pointer', fontWeight:600, fontSize:'0.875rem', border:'1px solid transparent', transition:'background .18s, border-color .18s', whiteSpace:'nowrap', overflow:'hidden' }}
            onMouseEnter={e=>{ e.currentTarget.style.background='#FEF2F2'; e.currentTarget.style.borderColor='#FECACA'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=''; e.currentTarget.style.borderColor='transparent'; }}
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!collapsed && 'Log Out'}
          </div>
        </div>
      </aside>

      {/* ── Toggle button — outside <aside> so overflow:hidden can't clip it ── */}
      <button
        onClick={toggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{
          position: 'absolute',
          top: 18,
          right: -14,          /* half-outside the sidebar edge */
          zIndex: 999,          /* always on top of everything */
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: '#fff',
          border: '1.5px solid #DDD9FF',
          boxShadow: '0 2px 8px rgba(83,74,183,0.18), 0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: 'none',
          transition: 'box-shadow .2s, background .2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background='#EEF1FD'; e.currentTarget.style.boxShadow='0 3px 10px rgba(83,74,183,0.28)'; }}
        onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.boxShadow='0 2px 8px rgba(83,74,183,0.18), 0 1px 3px rgba(0,0,0,0.1)'; }}
      >
        <svg
          viewBox="0 0 24 24" width="13" height="13"
          fill="none" stroke="#8A9FE8" strokeWidth="2.8"
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform .28s cubic-bezier(.4,0,.2,1)',
          }}
        >
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

    </div>
  );
};

export default Sidebar;
