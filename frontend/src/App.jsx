import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TicketsPage from "./pages/TicketsPage";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-wrapper">
        <Header />
        <Routes>
          <Route path="/" element={<TicketsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

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
      </main>
    </div>
  );
}
