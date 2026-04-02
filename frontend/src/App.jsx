// import React, { useState } from 'react';
// import Sidebar from './components/Sidebar';
// import Header from './components/Header';
// import TicketList from './components/TicketList';
// import CreateTicketModal from './components/CreateTicketModal';
// import TicketDetailsModal from './components/TicketDetailsModal';

// const mockTickets = [
//   {
//     id: 'TKT-001',
//     title: 'VPN Connection Issues',
//     category: 'Network',
//     status: 'In progress',
//     description: 'Unable to connect to company VPN from home office',
//     updatedAt: '2 hours ago'
//   },
//   {
//     id: 'TKT-002',
//     title: 'Monitor Replacement',
//     category: 'Hardware',
//     status: 'Open',
//     description: 'Second monitor is flickering constantly and giving me a headache',
//     updatedAt: '1 day ago'
//   },
//   {
//     id: 'TKT-003',
//     title: 'Adobe Suite Access',
//     category: 'Software',
//     status: 'Closed',
//     description: 'Need a license for Adobe Creative Cloud for a new project',
//     updatedAt: '3 days ago'
//   }
// ];

// function App() {
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [tickets, setTickets] = useState(mockTickets);

//   const handleAddTicket = (newTicket) => {
//     const nextId = `TKT-00${tickets.length + 1}`;
//     setTickets([{ ...newTicket, id: nextId, status: 'Open', updatedAt: 'Just now' }, ...tickets]);
//     setIsCreateOpen(false);
//   };

//   return (
//     <div className="app-container">
//       <Sidebar />

//       <main className="main-wrapper">
//         <Header />

//         <div className="content-area">
//           <div className="page-header">
//             <h1 className="page-title">My Tickets</h1>
//             <p className="page-subtitle">Manage and track your support requests</p>

//             <button className="create-btn" onClick={() => setIsCreateOpen(true)}>
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
//               Create new ticket
//             </button>
//           </div>

//           <div className="ticket-history">
//             <h2 className="section-title">Ticket History</h2>
//             <TicketList tickets={tickets} onTicketClick={setSelectedTicket} />
//           </div>
//         </div>

//         {/* Floating Action Button */}
//         <div className="fab" title="Support Chat">
//           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
//         </div>

//         {/* Modals */}
//         <CreateTicketModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onAddTicket={handleAddTicket} />
//         <TicketDetailsModal ticket={selectedTicket} isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} />
//       </main>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TicketList from "./components/TicketList";
import CreateTicketModal from "./components/CreateTicketModal";
import TicketDetailsModal from "./components/TicketDetailsModal";
import { getTickets, createTicket } from "./services/ticketService";

function App() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جيب التيكتس من الـ API
  useEffect(() => {
    getTickets()
      .then((data) => setTickets(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddTicket = async (newTicket) => {
    try {
      // الباك اند بيستخدم "name" مش "title"
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
    <div className="app-container">
      <Sidebar />
      <main className="main-wrapper">
        <Header />
        <div className="content-area">
          <div className="page-header">
            <h1 className="page-title">My Tickets</h1>
            <p className="page-subtitle">
              Manage and track your support requests
            </p>
            <button
              className="create-btn"
              onClick={() => setIsCreateOpen(true)}
            >
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
        </div>

        <div className="fab" title="Support Chat">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
          </svg>
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
      </main>
    </div>
  );
}

export default App;
