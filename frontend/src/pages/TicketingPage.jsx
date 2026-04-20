import React, { useState, useEffect } from "react";
import TicketList from "../components/TicketList";
import DonutChartWidget from "../components/DonutChartWidget";

const formatTimeAgo = (dateString) => {
  if (!dateString) return "Date unknown";
  const now = new Date();
  const created = new Date(dateString);
  const diffInSeconds = Math.floor((now - created) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export default function TicketingPage({
  tickets = [],
  user, // Current logged-in user object
  isITUser,
  searchQuery,
  onOpenCreate,
  isLoading,
}) {
  const [, setTick] = useState(0);
  const [showClosed, setShowClosed] = useState(false);
  const [showAssignedToMe, setShowAssignedToMe] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const safeTickets = Array.isArray(tickets) ? tickets : [];

  // Calculate Stats for the Charts
  const stats = {
    total: safeTickets.length,
    open: safeTickets.filter(t => t.status?.toLowerCase() === "open").length,
    inProgress: safeTickets.filter(t => 
      t.status?.toLowerCase() === "in_progress" || t.status?.toLowerCase() === "in progress"
    ).length,
    closed: safeTickets.filter(t => t.status?.toLowerCase() === "closed").length,
  };

  // 1. Core Filtering Logic
  const statusFiltered = safeTickets.filter((t) => {
    // Priority 1: If user wants to see only their assigned tickets
    if (showAssignedToMe) {
      return t.assign_to?._id === user?._id;
    }
    // Priority 2: Toggle between Closed and Active
    if (showClosed) {
      return t.status?.toLowerCase() === "closed";
    } else {
      return t.status?.toLowerCase() !== "closed";
    }
  });

  const processedTickets = statusFiltered.map((ticket) => ({
    ...ticket,
    createdAt: formatTimeAgo(ticket.createdAt),
  }));

  const filteredTickets = processedTickets.filter((ticket) => {
    if (!searchQuery?.trim()) return true;
    const term = searchQuery.toLowerCase();
    const candidateValues = [
      ticket.id || ticket._id,
      ticket.title,
      ticket.category,
      ticket.status,
      ticket.priority,
      ticket.assignedTo?.name,
      ticket.created_by?.name,
    ];
    return candidateValues.some((value) =>
      value?.toString().toLowerCase().includes(term)
    );
  });

  return (
    <div className="ds-page">
      <div className="page-content-wrapper">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", margin: 0 }}>
              {showAssignedToMe ? "My Tasks" : showClosed ? "Closed Archive" : "Ticketing Dashboard"}
            </h1>
            <p style={{ color: "#6B7280", fontSize: "0.875rem", marginTop: 4 }}>
              {showAssignedToMe ? "Viewing tickets assigned to you" : "Real-time overview of support requests"}
            </p>
          </div>
          
          <button className="ds-btn ds-btn-primary" onClick={onOpenCreate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create new ticket
          </button>
        </div>

        <DonutChartWidget 
          tickets={safeTickets} 
          stats={stats} 
          isLoading={isLoading} 
        />

        <div className="ds-card" style={{ padding: 0, overflow: "hidden", marginTop: 24 }}>
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #E9EBF0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              minHeight: "64px"
            }}
          >
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", margin: 0 }}>
              {showAssignedToMe ? "Assigned to Me" : showClosed ? "Closed History" : "Ticket History"}
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Assigned to Me Toggle */}
              <button 
                onClick={() => {
                  setShowAssignedToMe(!showAssignedToMe);
                  setShowClosed(false); // Turn off closed filter
                }}
                style={{
                  padding: "6px 14px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: "1px solid #E5E7EB",
                  backgroundColor: showAssignedToMe ? "#7F6FF5" : "white",
                  color: showAssignedToMe ? "white" : "#4B5563",
                  transition: "all 0.2s"
                }}
              >
                {showAssignedToMe ? "Showing My Tickets" : "Assigned to Me"}
              </button>

              {/* Show Closed Toggle */}
              <button 
                onClick={() => {
                  setShowClosed(!showClosed);
                  setShowAssignedToMe(false); // Turn off assigned filter
                }}
                style={{
                  padding: "6px 14px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: "1px solid #E5E7EB",
                  backgroundColor: showClosed ? "#111827" : "white",
                  color: showClosed ? "white" : "#4B5563",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}
              >
                {showClosed ? "← Back to Active" : "View Closed"}
              </button>

              <span style={{ fontSize: "0.75rem", color: "#6B7280", fontWeight: 500, backgroundColor: "#F3F4F6", padding: "4px 8px", borderRadius: "12px" }}>
                {isLoading ? "..." : `${filteredTickets.length} tickets`}
              </span>
            </div>
          </div>
          
          {isLoading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#9CA3AF" }}>
              <div className="spinner" style={{ marginBottom: 10 }}></div>
              Syncing with database...
            </div>
          ) : (
            <TicketList tickets={filteredTickets} isITUser={isITUser} />
          )}
        </div>
      </div>
    </div>
  );
}