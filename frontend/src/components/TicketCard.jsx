// import React from 'react';

// const TicketCard = ({ ticket, onClick }) => {
//     const getCategoryTheme = (category) => {
//         switch (category.toLowerCase()) {
//             case 'network': return 'badge-network';
//             case 'hardware': return 'badge-hardware';
//             case 'software': return 'badge-software';
//             default: return 'badge-software';
//         }
//     };

//     const getStatusTheme = (status) => {
//         switch (status.toLowerCase()) {
//             case 'open': return 'badge-open';
//             case 'in progress': return 'badge-inprogress';
//             case 'closed': return 'badge-closed';
//             default: return 'badge-open';
//         }
//     };

//     return (
//         <div className="ticket-card" onClick={onClick}>
//             <div className="ticket-header">
//                 <div className="ticket-title-wrapper">
//                     <h3 className="ticket-title">{ticket.title}</h3>
//                     <span className={`badge ${getCategoryTheme(ticket.category)}`}>
//                         {ticket.category}
//                     </span>
//                 </div>
//                 <span className={`badge ${getStatusTheme(ticket.status)}`}>
//                     {ticket.status}
//                 </span>
//             </div>

//             <div className="ticket-desc">
//                 <p>{ticket.description}</p>
//                 <span className="ticket-id">{ticket.id}</span>
//             </div>

//             <div className="ticket-footer">
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
//                 <span>Updated {ticket.updatedAt}</span>
//             </div>
//         </div>
//     );
// };

// export default TicketCard;

import React from "react";

// updatedAt بييجي ISO string من MongoDB
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};
const TicketCard = ({ ticket, onClick }) => {
  // category مش في الـ DB - هنحذفه مؤقتاً أو نعمله fallback
  const getCategoryTheme = (category) => {
    if (!category) return "badge-software";
    switch (category.toLowerCase()) {
      case "network":
        return "badge-network";
      case "hardware":
        return "badge-hardware";
      case "software":
        return "badge-software";
      default:
        return "badge-software";
    }
  };

  // الباك اند بيرجع: open / in_progress / resolved / closed
  const getStatusTheme = (status) => {
    if (!status) return "badge-open";
    switch (status.toLowerCase()) {
      case "open":
        return "badge-open";
      case "in_progress":
        return "badge-inprogress";
      case "resolved":
        return "badge-closed";
      case "closed":
        return "badge-closed";
      default:
        return "badge-open";
    }
  };

  // عشان يتعرض حلو في الـ UI مش in_progress
  const formatStatus = (status) => {
    if (!status) return "Open";
    const map = {
      open: "Open",
      in_progress: "In Progress",
      resolved: "Resolved",
      closed: "Closed",
    };
    return map[status.toLowerCase()] || status;
  };

  return (
    <div className="ticket-card" onClick={onClick}>
      <div className="ticket-header">
        <div className="ticket-title-wrapper">
          {/* title → name */}
          <h3 className="ticket-title">{ticket.name}</h3>
          {/* category مش في الـ DB — بنعرضه لو موجود أو نخبيه */}
          {ticket.category && (
            <span className={`badge ${getCategoryTheme(ticket.category)}`}>
              {ticket.category}
            </span>
          )}
        </div>
        <span className={`badge ${getStatusTheme(ticket.status)}`}>
          {formatStatus(ticket.status)}
        </span>
      </div>

      <div className="ticket-desc">
        <p>{ticket.description}</p>
        {/* id → _id */}
        <span className="ticket-id">{ticket._id}</span>
      </div>

      <div className="ticket-footer">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        {/* updatedAt بييجي ISO من MongoDB */}
        <span>Updated {formatDate(ticket.updatedAt)}</span>
      </div>
    </div>
  );
};

export default TicketCard;
