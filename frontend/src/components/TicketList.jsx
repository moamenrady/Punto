import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserProfileModal from "./UserProfileModal";

const TicketList = ({
  tickets,
  isITUser,
  currentUser,
  allTickets,
  users,
  setUsers,
}) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s === "open")
      return <span className="ds-badge ds-badge-open">Open</span>;
    if (s === "in progress")
      return <span className="ds-badge ds-badge-progress">In Progress</span>;
    if (s === "assigned")
      return <span className="ds-badge ds-badge-assigned">Assigned</span>;
    if (s === "closed")
      return <span className="ds-badge ds-badge-closed">Closed</span>;
    return <span className="ds-badge ds-badge-closed">{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    if (!priority) return <span className="ds-badge ds-badge-low">Low</span>;
    const p = priority.toLowerCase();
    if (p === "high")
      return <span className="ds-badge ds-badge-high">{priority}</span>;
    if (p === "medium")
      return <span className="ds-badge ds-badge-medium">{priority}</span>;
    if (p === "low")
      return <span className="ds-badge ds-badge-low">{priority}</span>;
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

  const isMe = selectedUser?.name === currentUser?.name;

  return (
    <>
      <div className="ticket-list">
        <div className="ticket-list-table-wrapper">
          <table className="ticket-table">
            <thead>
              <tr>
                {[
                  "Ticket ID",
                  "Title",
                  "Category",
                  "Created By",
                  "Created At",
                  "Priority",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      color: "#9CA3AF",
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {h}
                  </th>
                ))}
                {isITUser && (
                  <th
                    style={{
                      color: "#9CA3AF",
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      textAlign: "right",
                    }}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {tickets?.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="ticket-table-row group"
                  style={{ "--hover-bg": "#F9FAFB" }}
                >
                  <td className="ticket-table-cell ticket-id-cell">
                    <span className="ticket-id-pill">{ticket._id}</span>
                  </td>
                  <td className="ticket-table-cell ticket-title-cell">
                    <div className="ticket-title-text" title={ticket.name}>
                      {ticket.name}
                    </div>
                  </td>
                  <td className="ticket-table-cell">
                    <span className="category-pill">{ticket.category}</span>
                  </td>

                  {/* ── Created By ── */}
                  <td className="ticket-table-cell">
                    {ticket.created_by.name ? (
                      <div
                        className="ticket-created-by"
                        onClick={() => handleUserClick(ticket.created_by.name)}
                        style={{ cursor: "pointer" }}
                        title={`View ${ticket.created_by.name}'s profile`}
                      >
                        {ticket.created_by.name ? (
                          <img
                            src={ticket.created_by.name}
                            alt={ticket.created_by.name}
                            style={{
                              borderRadius: "50%",
                              transition: "transform 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.transform = "scale(1.12)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          />
                        ) : (
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #7F6FF5, #3ECFAA)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "13px",
                              fontWeight: "700",
                              flexShrink: 0,
                              transition: "transform 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.transform = "scale(1.12)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          >
                            {ticket.created_by.name?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="ticket-created-by-name">
                            {ticket.created_by.name}
                          </div>
                          <div className="ticket-created-by-role">
                            {ticket.created_by.role}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="ticket-meta-value">Unknown</span>
                    )}
                  </td>

                  <td className="ticket-table-cell">
                    <div className="ticket-meta-value">
                      {ticket.createdAt || "N/A"}
                    </div>
                  </td>
                  <td className="ticket-table-cell">
                    {getPriorityBadge(ticket.priority)}
                  </td>
                  <td className="ticket-table-cell">
                    {getStatusBadge(ticket.status)}
                  </td>

                  {isITUser && (
                    <td
                      className="ticket-table-cell ticket-actions-cell"
                      style={{ textAlign: "right" }}
                    >
                      <Link
                        to={`/ticket/${ticket.id}`}
                        className="ds-btn ds-btn-secondary"
                        style={{
                          padding: "4px 10px",
                          fontSize: "0.78rem",
                          textDecoration: "none",
                        }}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
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

      <UserProfileModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser ?? {}}
        setUser={(updated) => {
          if (setUsers)
            setUsers((prev) =>
              prev.map((u) => (u.name === updated.name ? updated : u)),
            );
          setSelectedUser(updated);
        }}
        currentUser={currentUser}
        allTickets={allTickets}
      />
    </>
  );
};

export default TicketList;
