import React, { useState } from "react";
import UserProfileModal from "./UserProfileModal";

const TicketList = ({
  tickets,
  currentUser,
  allTickets,
  users,
  setUsers,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "open") return <span className="ds-badge ds-badge-open">Open</span>;
    if (s === "in progress" || s === "in_progress") return <span className="ds-badge ds-badge-progress">In Progress</span>;
    if (s === "assigned") return <span className="ds-badge ds-badge-assigned">Assigned</span>;
    if (s === "closed") return <span className="ds-badge ds-badge-closed">Closed</span>;
    return <span className="ds-badge ds-badge-closed">{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    const p = priority?.toLowerCase() || "low";
    if (p === "high" || p === "critical") return <span className="ds-badge ds-badge-high">{priority}</span>;
    if (p === "medium") return <span className="ds-badge ds-badge-medium">{priority}</span>;
    if (p === "low") return <span className="ds-badge ds-badge-low">{priority}</span>;
    return <span className="ds-badge ds-badge-closed">{priority}</span>;
  };

  const handleUserClick = (createdBy) => {
    const fullUser = users?.find((u) => u.name === createdBy.name) ?? createdBy;
    if (createdBy.role?.toLowerCase() === "admin") {
      setSelectedUser({ ...fullUser, _forcePanel: true });
    } else {
      setSelectedUser(fullUser);
    }
  };

  // Define the grid layout ratio here
  const gridLayout = {
    display: "grid",
    gridTemplateColumns: "100px 3fr 1.2fr 1.5fr 1.2fr 1fr 1fr",
    gap: "16px",
    alignItems: "center",
    padding: "12px 24px",
    minWidth: "1000px", // Ensures it doesn't break on small screens
  };

  const cellStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "0.85rem",
    color: "#374151"
  };

  return (
    <>
      <div className="ticket-list" style={{ overflowX: "auto", width: "100%" }}>
        {/* Table Header */}
        <div style={{ ...gridLayout, borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
          {["ID", "Title", "Category", "Created By", "Date", "Priority", "Status"].map((h) => (
            <span key={h} style={{ color: "#9CA3AF", fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {h}
            </span>
          ))}
        </div>

        {/* Table Body */}
        <div className="ticket-rows">
          {tickets?.map((ticket) => (
            <div 
              key={ticket._id} 
              style={{ ...gridLayout, borderBottom: "1px solid #F3F4F6", transition: "background 0.2s" }}
              className="ticket-row-hover"
            >
              {/* Ticket ID */}
              <span style={{ ...cellStyle, fontFamily: "monospace", color: "#6B7280" }}>
                #{ticket._id?.slice(-6)}
              </span>

              {/* Title (Truncated) */}
              <span style={{ ...cellStyle, fontWeight: "600" }} title={ticket.name}>
                {ticket.name}
              </span>

              {/* Category */}
              <span style={cellStyle}>
                <span className="category-pill" style={{ fontSize: "0.75rem" }}>{ticket.category || "General"}</span>
              </span>

              {/* Created By */}
              <div 
                style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", overflow: "hidden" }}
                onClick={() => handleUserClick(ticket.created_by)}
              >
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%", 
                  background: "linear-gradient(135deg, #7F6FF5, #3ECFAA)",
                  color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: "bold", flexShrink: 0
                }}>
                  {ticket.created_by?.name?.charAt(0)}
                </div>
                <span style={{ ...cellStyle, fontSize: "0.8rem" }}>{ticket.created_by?.name}</span>
              </div>

              {/* Created At */}
              <span style={{ ...cellStyle, color: "#6B7280" }}>{ticket.createdAt}</span>

              {/* Priority */}
              <div>{getPriorityBadge(ticket.priority)}</div>

              {/* Status */}
              <div>{getStatusBadge(ticket.status)}</div>
            </div>
          ))}
        </div>
      </div>

      <UserProfileModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser ?? {}}
        setUser={(updated) => {
          if (setUsers)
            setUsers((prev) => prev.map((u) => (u.name === updated.name ? updated : u)));
          setSelectedUser(updated);
        }}
        currentUser={currentUser}
        allTickets={allTickets}
      />
    </>
  );
};

export default TicketList;