import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AssignMemberModal from '../components/AssignMemberModal';
import './ticket-details.css';

/* ── helpers ─────────────────────────────── */
const getStatusBadgeClass = (status) => {
  if (!status) return 'td-badge td-badge-closed';
  const s = status.toLowerCase();
  if (s === 'open')        return 'td-badge td-badge-open';
  if (s === 'in progress') return 'td-badge td-badge-inprogress';
  if (s === 'assigned')    return 'td-badge td-badge-assigned';
  return 'td-badge td-badge-closed';
};

const getPriorityBadgeClass = (priority) => {
  if (!priority) return 'td-badge td-badge-low';
  const p = priority.toLowerCase();
  if (p === 'high')   return 'td-badge td-badge-high';
  if (p === 'medium') return 'td-badge td-badge-medium';
  return 'td-badge td-badge-low';
};

/* Split the ticket title so the second word gets the accent colour */
const AccentTitle = ({ title }) => {
  const words = title.split(' ');
  if (words.length < 2) return <span>{title}</span>;
  return (
    <>
      {words[0]}{' '}
      <span className="accent">{words[1]}</span>
      {words.length > 2 ? ' ' + words.slice(2).join(' ') : ''}
    </>
  );
};

/* ── component ───────────────────────────── */
export default function TicketDetailsPage({ tickets, isITUser }) {
  const { id } = useParams();
  const ticket = tickets.find((t) => t.id === id);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  if (!ticket) {
    return (
      <div className="td-bg flex flex-col items-center justify-center h-full gap-4">
        <p className="text-lg font-semibold text-slate-700">Ticket not found.</p>
        <Link to="/" className="text-sm text-blue-600 hover:underline">← Back to My Tickets</Link>
      </div>
    );
  }

  const initials = ticket.createdBy
    ? ticket.createdBy.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
    : '?';

  const email = ticket.createdBy
    ? `${ticket.createdBy.name.split(' ')[0].toLowerCase()}@corporate.com`
    : '—';

  return (
    <div className="td-bg">

      {/* ── Page header ── */}
      <div className="td-header">
        <div className="td-header-left">
          <Link to="/" className="td-back-btn" aria-label="Back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </Link>
          <div>
            <h1 className="td-header-title">Ticket {ticket.id}</h1>
            <p className="td-header-sub">View and manage ticket details</p>
          </div>
        </div>

        {isITUser && (
          <button className="td-assign-btn" onClick={() => setIsAssignModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Assign To Me
          </button>
        )}
      </div>

      {/* ── 2-column grid ── */}
      <div className="td-grid">

        {/* LEFT COLUMN */}
        <div>

          {/* Title card */}
          <div className="td-card">
            <p className="td-ticket-headline">
              <AccentTitle title={ticket.title} />
            </p>
          </div>

          {/* Creator card */}
          <div className="td-card">
            <p className="td-card-title">Ticket Creator</p>
            {ticket.createdBy ? (
              <div className="td-creator-layout">
                <div className="td-avatar">{initials}</div>
                <div className="td-creator-grid">
                  <div>
                    <div className="td-field-label">Name</div>
                    <div className="td-field-value">{ticket.createdBy.name}</div>
                  </div>
                  <div>
                    <div className="td-field-label">Department</div>
                    <div className="td-field-value">{ticket.createdBy.role}</div>
                  </div>
                  <div>
                    <div className="td-field-label">Created At</div>
                    <div className="td-field-value">{ticket.createdAt || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="td-field-label">Email</div>
                    <div className="td-field-value">{email}</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No creator information.</p>
            )}
          </div>

          {/* Description card */}
          <div className="td-card">
            <p className="td-card-title">Ticket Description</p>
            <p className="td-description-text">
              {ticket.description || 'No description provided.'}
            </p>
          </div>

          {/* Attachments card */}
          <div className="td-card">
            <p className="td-card-title">Attachments</p>
            <div className="td-upload-zone">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              No file attached
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN — Ticket Details */}
        <div className="td-details-card">
          <h3>Ticket Details</h3>

          <div className="td-detail-row">
            <div className="td-detail-label">Status</div>
            <span className={getStatusBadgeClass(ticket.status)}>{ticket.status}</span>
          </div>

          <div className="td-detail-row">
            <div className="td-detail-label">Priority</div>
            <span className={getPriorityBadgeClass(ticket.priority)}>{ticket.priority || 'Low'}</span>
          </div>

          <div className="td-detail-row">
            <div className="td-detail-label">Category</div>
            <div className="td-detail-value">{ticket.category}</div>
          </div>

          <div className="td-detail-row">
            <div className="td-detail-label">Assign To</div>
            <div className="td-detail-value">{ticket.assignedTo && ticket.assignedTo !== '-' ? ticket.assignedTo : '—'}</div>
          </div>
        </div>

      </div>

      {/* Modal */}
      {isAssignModalOpen && (
        <AssignMemberModal
          onClose={() => setIsAssignModalOpen(false)}
          onAssign={() => setIsAssignModalOpen(false)}
        />
      )}
    </div>
  );
}
