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
  user,
  isITUser,
  searchQuery,
  onOpenCreate,
  isLoading,
}) {
  const [, setTick] = useState(0);
  const [showClosed, setShowClosed] = useState(false);
  const [showAssignedToMe, setShowAssignedToMe] = useState(false);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false); // State for full-screen mode

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Prevent background scrolling when maximized
  useEffect(() => {
    if (isMaximized) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMaximized]);

  const safeTickets = Array.isArray(tickets) ? tickets : [];

  const stats = {
    total: safeTickets.length,
    open: safeTickets.filter((t) => t.status?.toLowerCase() === "open").length,
    inProgress: safeTickets.filter(
      (t) => t.status?.toLowerCase() === "in_progress" || t.status?.toLowerCase() === "in progress"
    ).length,
    closed: safeTickets.filter((t) => t.status?.toLowerCase() === "closed").length,
  };

  const statusFiltered = safeTickets.filter((t) => {
    if (showAssignedToMe) {
      const isAssigned = t.assign_to?._id === user?._id;
      const isInProgress = t.status?.toLowerCase() === "in_progress" || t.status?.toLowerCase() === "in progress";
      return isAssigned && isInProgress;
    }
    if (showOpenOnly) return t.status?.toLowerCase() === "open";
    if (showClosed) return t.status?.toLowerCase() === "closed";
    return t.status?.toLowerCase() !== "closed";
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
      ticket.name,
      ticket.category,
      ticket.status,
      ticket.priority,
      ticket.assign_to?.name,
      ticket.created_by?.name,
    ];
    return candidateValues.some((value) => value?.toString().toLowerCase().includes(term));
  });

  // Dynamic Styles for Maximized State
  const containerStyle = isMaximized
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        backgroundColor: "white",
        marginTop: 0,
        borderRadius: 0,
      }
    : {
        marginTop: 24,
        borderRadius: "12px",
      };

  return (
    <div className="ds-page">
      <div className="page-content-wrapper">
        {/* Hide header and charts if maximized to give more space */}
        {!isMaximized && (
          <>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", margin: 0 }}>
                  {showAssignedToMe ? "My Active Tasks" : showOpenOnly ? "Open Support Requests" : showClosed ? "Closed Archive" : "Ticketing Dashboard"}
                </h1>
                <p style={{ color: "#6B7280", fontSize: "0.875rem", marginTop: 4 }}>
                  {showAssignedToMe ? "Viewing your 'In Progress' tickets" : "Real-time overview of support requests"}
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

            <DonutChartWidget tickets={safeTickets} stats={stats} isLoading={isLoading} />
          </>
        )}

        <div className="ds-card" style={{ ...containerStyle, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #E9EBF0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              minHeight: "64px",
              backgroundColor: "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", margin: 0 }}>
                {showAssignedToMe ? "Assigned (In Progress)" : showOpenOnly ? "Open Tickets" : showClosed ? "Closed History" : "Ticket History"}
              </h2>
              <span style={{ fontSize: "0.75rem", color: "#6B7280", fontWeight: 500, backgroundColor: "#F3F4F6", padding: "4px 8px", borderRadius: "12px" }}>
                {isLoading ? "..." : `${filteredTickets.length} tickets`}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={() => {
                  setShowOpenOnly(!showOpenOnly);
                  setShowClosed(false);
                  setShowAssignedToMe(false);
                }}
                style={{
                  padding: "6px 14px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: "1px solid #E5E7EB",
                  backgroundColor: showOpenOnly ? "#10B981" : "white",
                  color: showOpenOnly ? "white" : "#4B5563",
                  transition: "all 0.2s",
                }}
              >
                {showOpenOnly ? "Showing Open" : "Open Tickets"}
              </button>

              <button
                onClick={() => {
                  setShowAssignedToMe(!showAssignedToMe);
                  setShowClosed(false);
                  setShowOpenOnly(false);
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
                  transition: "all 0.2s",
                }}
              >
                {showAssignedToMe ? "My Tasks" : "Assigned to Me"}
              </button>

              <button
                onClick={() => {
                  setShowClosed(!showClosed);
                  setShowAssignedToMe(false);
                  setShowOpenOnly(false);
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
                }}
              >
                {showClosed ? "← Back to Active" : "View Closed"}
              </button>

              {/* MAXIMIZE / MINIMIZE BUTTON */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                style={{
                  padding: "6px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: "1px solid #E5E7EB",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                title={isMaximized ? "Minimize" : "Maximize"}
              >
                {isMaximized ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 14 10 14 10 20"></polyline>
                    <polyline points="20 10 14 10 14 4"></polyline>
                    <line x1="14" y1="10" x2="21" y2="3"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
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
    </div>
  );
}