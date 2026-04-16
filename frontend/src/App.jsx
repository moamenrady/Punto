import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './context/useAuth';

// Auth pages
import LoginPage from './pages/LoginPage';
import SignUpRole from './pages/SignUpRole';
import UserRegister from './pages/UserRegister';
import AdminRegister from './pages/AdminRegister';
import SetupEnvironment from './pages/SetupEnvironment';

// Main app
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TicketingPage from './pages/TicketingPage';
import TicketDetailsPage from './pages/TicketDetailsPage';
import StockManagementPage from './pages/StockManagementPage';
import CreateTicketModal from './components/CreateTicketModal';
import { mockTickets } from './mockData';

/* ─── Main app layout (shown after login) ───────────────────── */
function MainApp() {
  const [currentUserRole, setCurrentUserRole] = useState('admin');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState(mockTickets);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleAddTicket = (newTicket) => {
    const nextId = `TKT-00${tickets.length + 1}`;
    setTickets([{
      id: nextId,
      title: newTicket.title,
      category: newTicket.category,
      status: 'Open',
      priority: newTicket.priority,
      description: newTicket.description,
      createdAt: 'Just now',
      createdBy: {
        name: 'Ahmed Ali',
        role: 'Current User',
        avatar: 'https://ui-avatars.com/api/?name=Ahmed+Ali&background=E2E8F0&color=475569'
      },
      assignedTo: '-'
    }, ...tickets]);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-wrapper">
        <Header
          currentUserRole={currentUserRole}
          setCurrentUserRole={setCurrentUserRole}
          theme={theme}
          setTheme={setTheme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <Routes>
          <Route path="/" element={
            <TicketingPage
              tickets={tickets}
              isITUser={currentUserRole === 'admin'}
              searchQuery={searchQuery}
              onOpenCreate={() => setIsCreateOpen(true)}
            />
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stock" element={<StockManagementPage currentUserRole={currentUserRole} />} />
          <Route path="/ticket/:id" element={
            <TicketDetailsPage tickets={tickets} isITUser={currentUserRole === 'admin'} />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Floating support-chat button */}
        <div className="fab" title="Support Chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
          </svg>
        </div>
      </main>

      {isCreateOpen && (
        <CreateTicketModal
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleAddTicket}
        />
      )}
    </div>
  );
}

/* ─── Auth-aware content (rendered inside AuthProvider) ─────── */
function AppContent() {
  const { token } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode
    ? { bg: 'bg-[#12102A]', textP: 'text-[#E2E0FF]', textM: 'text-[#8480B8]',
        border: 'border-[#2E2B5A]', input: 'bg-[#1E1B3A]', primary: '#7F6FF5',
        accent: '#3ECFAA', btn: 'from-[#7F6FF5] to-[#3ECFAA]' }
    : { bg: 'bg-[#F5F4FF]', textP: 'text-[#1E1B3A]', textM: 'text-[#7F77DD]',
        border: 'border-[#DDD9FF]', input: 'bg-white', primary: '#534AB7',
        accent: '#0F6E56', btn: 'from-[#534AB7] to-[#7F77DD]' };

  const commonProps = { isDarkMode, setIsDarkMode, theme };

  return (
    <Routes>
      {/* Auth pages always accessible */}
      <Route path="/login"        element={<LoginPage        {...commonProps} />} />
      <Route path="/signup"       element={<SignUpRole       {...commonProps} />} />
      <Route path="/signup/user"  element={<UserRegister     {...commonProps} />} />
      <Route path="/signup/admin" element={<AdminRegister    {...commonProps} />} />
      <Route path="/setup"        element={<SetupEnvironment {...commonProps} />} />

      {/* Main app — shown directly (auth integration ready when backend is live) */}
      <Route path="/*" element={<MainApp />} />
    </Routes>
  );
}

/* ─── Root component ─────────────────────────────────────────── */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
