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
  const [isMaximized, setIsMaximized] = useState(false);

  const isAdmin = user?.role === "admin" || user?.role === "manager";

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const safeTickets = Array.isArray(tickets) ? tickets : [];

  const getRoleFilteredTickets = () => {
    if (isAdmin) {
      return safeTickets.filter((t) => {
        if (showAssignedToMe) {
          const isAssigned = t.assign_to?._id === user?._id;
          const isInProgress = t.status?.toLowerCase().includes("progress");
          return isAssigned && isInProgress;
        }
        if (showOpenOnly) return t.status?.toLowerCase() === "open";
        if (showClosed) return t.status?.toLowerCase() === "closed";
        return t.status?.toLowerCase() !== "closed";
      });
    }
    return safeTickets.filter((t) => t.created_by?._id === user?._id);
  };

  const filteredTickets = getRoleFilteredTickets().filter(t => {
    if (!searchQuery?.trim()) return true;
    const term = searchQuery.toLowerCase();
    return [t.name, t.category, t._id].some(v => v?.toLowerCase().includes(term));
  });

  const stats = {
    total: safeTickets.length,
    open: safeTickets.filter((t) => t.status?.toLowerCase() === "open").length,
    inProgress: safeTickets.filter((t) => t.status?.toLowerCase().includes("progress")).length,
    closed: safeTickets.filter((t) => t.status?.toLowerCase() === "closed").length,
  };

  // The logic that centers the content and handles the "Ticketing Area Maximize"
  const pageWrapperStyle = {
    position: "relative",
    width: "100%",
    minHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Centered horizontally
    padding: isMaximized ? "0" : "20px",
    boxSizing: "border-box"
  };

  const innerContentStyle = {
    width: "100%",
    maxWidth: isMaximized ? "100%" : "1400px", // Keeps it from spreading too thin on large screens
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    height: isMaximized ? "100%" : "auto"
  };

  const ticketingBoxStyle = isMaximized
    ? {
        position: "absolute", // Maximizes only within the ticketing area
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 50,
        backgroundColor: "white",
        display: "flex", flexDirection: "column",
        borderRadius: "12px", border: "1px solid #E9EBF0",
      }
    : {
        borderRadius: "12px",
        display: "flex", flexDirection: "column",
        backgroundColor: "white", border: "1px solid #E9EBF0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        height: isAdmin ? "650px" : "550px", 
        width: "100%"
      };

  return (
    <div className="ds-page" style={pageWrapperStyle}>
      <div className="inner-content-wrapper" style={innerContentStyle}>
        
        {/* Only show header and stats if NOT maximized */}
        {!isMaximized && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", width: "100%" }}>
              <div>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", margin: 0, letterSpacing: "-0.02em" }}>
                  {isAdmin ? "Command Center" : `Welcome back, ${user?.name?.split(' ')[0] || 'User'}!`}
                </h1>
                <p style={{ color: "#6B7280", fontSize: "0.95rem", marginTop: 6 }}>
                  {isAdmin 
                    ? "System health and infrastructure overview." 
                    : "Need a hand? Create a ticket and we'll get you sorted."}
                </p>
              </div>

              <button className="ds-btn ds-btn-primary" onClick={onOpenCreate} style={{ padding: "10px 20px", borderRadius: "10px", fontWeight: 600 }}>
                New Request
              </button>
            </div>

            {isAdmin && <DonutChartWidget tickets={safeTickets} stats={stats} isLoading={isLoading} />}
          </>
        )}

        <div style={ticketingBoxStyle}>
          {/* Box Header */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7F6FF5" }}></div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1F2937", margin: 0 }}>
                {isAdmin ? "System-Wide Tickets" : "Your Service History"}
              </h2>
              <span style={{ fontSize: "0.75rem", color: "#7F6FF5", fontWeight: 700, backgroundColor: "#EEF2FF", padding: "4px 10px", borderRadius: "20px" }}>
                {filteredTickets.length}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {isAdmin && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => { setShowOpenOnly(!showOpenOnly); setShowClosed(false); setShowAssignedToMe(false); }}
                    style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", backgroundColor: showOpenOnly ? "#10B981" : "white", color: showOpenOnly ? "white" : "#4B5563" }}>
                    Open Tickets
                  </button>
                  <button onClick={() => { setShowAssignedToMe(!showAssignedToMe); setShowClosed(false); setShowOpenOnly(false); }}
                    style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", backgroundColor: showAssignedToMe ? "#7F6FF5" : "white", color: showAssignedToMe ? "white" : "#4B5563" }}>
                    My Tasks
                  </button>
                </div>
              )}
              
              <button 
                onClick={() => setIsMaximized(!isMaximized)}
                style={{
                  padding: "8px",
                  borderRadius: "10px",
                  border: "1px solid #E5E7EB",
                  backgroundColor: "white",
                  display: "flex",
                  color: "#6B7280",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {isMaximized ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3v5H3M21 8h-5V3M3 16h5v5M16 21v-5h5"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
            {isLoading ? (
              <div style={{ padding: "80px", textAlign: "center", color: "#9CA3AF" }}>
                <div className="animate-pulse">Loading data...</div>
              </div>
            ) : filteredTickets.length > 0 ? (
              <div style={{ minWidth: "1100px" }}>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "100px 3fr 1fr 1.2fr 1.2fr 1fr 0.8fr 0.8fr", 
                  gap: "16px", padding: "12px 24px", 
                  backgroundColor: "#F9FAFB", borderBottom: "1px solid #E9EBF0",
                  fontSize: "0.75rem", fontWeight: 700, color: "#4B5563", textTransform: "uppercase",
                  position: "sticky", top: 0, zIndex: 10
                }}>
                  <span>ID</span>
                  <span>Subject</span>
                  <span>Category</span>
                  <span>Created By</span>
                  <span>Assigned To</span>
                  <span>Date</span>
                  <span>Priority</span>
                  <span>Status</span>
                </div>
                <TicketList tickets={filteredTickets} isITUser={isAdmin} currentUser={user} />
              </div>
            ) : (
              <div style={{ padding: "100px 40px", textAlign: "center" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#374151" }}>No tickets found.</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}