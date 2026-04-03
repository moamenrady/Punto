import { useState, useEffect } from "react";
import TicketList from "../components/TicketList";
import CreateTicketModal from "../components/CreateTicketModal";
import TicketDetailsModal from "../components/TicketDetailsModal";
import { getTickets, createTicket } from "../services/ticketService";

export default function TicketsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTickets()
      .then((data) => setTickets(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddTicket = async (newTicket) => {
    try {
      const created = await createTicket({
        name: newTicket.name,
        description: newTicket.description,
        priority: newTicket.priority || "medium",
      });
      setTickets((prev) => [created, ...prev]);
      setIsCreateOpen(false);
    } catch (err) {
      alert("Error creating ticket: " + err.message);
    }
  };

  return (
    <div className="content-area">
      <div className="page-header">
        <h1 className="page-title">My Tickets</h1>
        <p className="page-subtitle">Manage and track your support requests</p>
        <button className="create-btn" onClick={() => setIsCreateOpen(true)}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create new ticket
        </button>
      </div>

      <div className="ticket-history">
        <h2 className="section-title">Ticket History</h2>
        {loading && (
          <p style={{ textAlign: "center", padding: "2rem" }}>
            Loading tickets...
          </p>
        )}
        {error && (
          <p style={{ textAlign: "center", padding: "2rem", color: "red" }}>
            Error: {error}
          </p>
        )}
        {!loading && !error && (
          <TicketList tickets={tickets} onTicketClick={setSelectedTicket} />
        )}
      </div>

      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddTicket={handleAddTicket}
      />
      <TicketDetailsModal
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
}
