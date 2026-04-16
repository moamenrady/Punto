import React from 'react';
import { Link } from 'react-router-dom';

const TicketList = ({ tickets, isITUser }) => {
    const getStatusBadge = (status) => {
        const s = status.toLowerCase();
        if (s === 'open') return <span className="ds-badge ds-badge-open">Open</span>;
        if (s === 'in progress') return <span className="ds-badge ds-badge-progress">In Progress</span>;
        if (s === 'assigned') return <span className="ds-badge ds-badge-assigned">Assigned</span>;
        if (s === 'closed') return <span className="ds-badge ds-badge-closed">Closed</span>;
        return <span className="ds-badge ds-badge-closed">{status}</span>;
    };

    const getPriorityBadge = (priority) => {
        if (!priority) return <span className="ds-badge ds-badge-low">Low</span>;
        const p = priority.toLowerCase();
        if (p === 'high') return <span className="ds-badge ds-badge-high">{priority}</span>;
        if (p === 'medium') return <span className="ds-badge ds-badge-medium">{priority}</span>;
        if (p === 'low') return <span className="ds-badge ds-badge-low">{priority}</span>;
        return <span className="ds-badge ds-badge-closed">{priority}</span>;
    };

    return (
        <div className="ticket-list">
            <div className="ticket-list-table-wrapper">
                <table className="ticket-table">
                    <thead>
                        <tr>
                            <th style={{ color: '#9CA3AF', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ticket ID</th>
                            <th style={{ color: '#9CA3AF', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Title</th>
                            <th style={{ color: '#9CA3AF', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category</th>
                            <th style={{ color: '#9CA3AF', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Created By</th>
                            <th style={{ color: '#9CA3AF', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Created At</th>
                            <th style={{ color: '#9CA3AF', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Priority</th>
                            <th style={{ color: '#9CA3AF', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                            {isITUser && <th style={{ color: '#9CA3AF', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {tickets?.map(ticket => (
                            <tr key={ticket.id} className="ticket-table-row group" style={{ '--hover-bg': '#F9FAFB' }}>
                                <td className="ticket-table-cell ticket-id-cell">
                                    <span className="ticket-id-pill">{ticket.id}</span>
                                </td>
                                <td className="ticket-table-cell ticket-title-cell">
                                    <div className="ticket-title-text" title={ticket.title}>{ticket.title}</div>
                                </td>
                                <td className="ticket-table-cell">
                                    <span className="category-pill">{ticket.category}</span>
                                </td>
                                <td className="ticket-table-cell">
                                    {ticket.createdBy ? (
                                        <div className="ticket-created-by">
                                            <img src={ticket.createdBy.avatar} alt={ticket.createdBy.name} />
                                            <div>
                                                <div className="ticket-created-by-name">{ticket.createdBy.name}</div>
                                                <div className="ticket-created-by-role">{ticket.createdBy.role}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="ticket-meta-value">Unknown</span>
                                    )}
                                </td>
                                <td className="ticket-table-cell">
                                    <div className="ticket-meta-value">{ticket.createdAt || 'N/A'}</div>
                                </td>
                                <td className="ticket-table-cell">
                                    {getPriorityBadge(ticket.priority)}
                                </td>
                                <td className="ticket-table-cell">
                                    {getStatusBadge(ticket.status)}
                                </td>
                                {isITUser && (
                                    <td className="ticket-table-cell ticket-actions-cell" style={{ textAlign: 'right' }}>
                                        <Link
                                            to={`/ticket/${ticket.id}`}
                                            className="ds-btn ds-btn-secondary"
                                            style={{ padding: '4px 10px', fontSize: '0.78rem', textDecoration: 'none' }}
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                            View
                                        </Link>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TicketList;
