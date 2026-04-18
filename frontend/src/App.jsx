import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import useAuth from "./context/useAuth";

import LoginPage from "./pages/LoginPage";
import SignUpRole from "./pages/SignUpRole";
import UserRegister from "./pages/UserRegister";
import AdminRegister from "./pages/AdminRegister";
import SetupEnvironment from "./pages/SetupEnvironment";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import TicketingPage from "./pages/TicketingPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import StockManagementPage from "./pages/StockManagementPage";
import CreateTicketModal from "./components/CreateTicketModal";
import UserProfileModal from "./components/UserProfileModal";
import { mockTickets } from "./mockData";

function MainApp() {
  const [currentUserRole, setCurrentUserRole] = useState("admin");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [tickets, setTickets] = useState(mockTickets);
  const [theme, setTheme] = useState("light");
  const [selectedUser, setSelectedUser] = useState(null);

  const [user, setUser] = useState({
    name: "hamada Hassan",
    email: "a.hassan@company.com",
    phone: "+20 100 000 0000",
    dept: "Infrastructure",
    role: "Senior IT Engineer",
    team: "Infrastructure Team",
    location: "Cairo, EG",
    avatar: null,
    isOnline: true,
  });

  const themeObj =
    theme === "dark"
      ? {
          bg: "bg-[#12102A]",
          surface: "bg-[#1E1B3A]",
          textP: "text-[#E2E0FF]",
          textM: "text-[#8480B8]",
          border: "border-[#2E2B5A]",
          input: "bg-[#1E1B3A]",
          primary: "#7F6FF5",
          accent: "#3ECFAA",
          btn: "from-[#7F6FF5] to-[#3ECFAA]",
        }
      : {
          bg: "bg-[#F5F4FF]",
          surface: "bg-white",
          textP: "text-[#1E1B3A]",
          textM: "text-[#7F77DD]",
          border: "border-[#DDD9FF]",
          input: "bg-white",
          primary: "#534AB7",
          accent: "#0F6E56",
          btn: "from-[#534AB7] to-[#7F77DD]",
        };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleAddTicket = (newTicket) => {
    const nextId = `TKT-00${tickets.length + 1}`;
    const createdTicket = {
      id: nextId,
      title: newTicket.title,
      category: newTicket.category,
      status: "Open",
      priority: newTicket.priority,
      description: newTicket.description,
      createdAt: "Just now",
      createdBy: { name: user.name, role: user.role, avatar: user.avatar },
      assignedTo: "-",
    };
    setTickets([createdTicket, ...tickets]);
    setIsCreateOpen(false);
  };

  const openProfile = (userData) => {
    setSelectedUser(userData || user);
    setIsProfileOpen(true);
  };

  return (
    <div className={`app-container ${themeObj.bg}`}>
      <Sidebar isDarkMode={theme === "dark"} theme={themeObj} />
      <main className="main-wrapper">
        <Header
          user={user}
          onProfileClick={() => openProfile(user)}
          currentUserRole={currentUserRole}
          setCurrentUserRole={setCurrentUserRole}
          theme={theme}
          setTheme={setTheme}
          themeObj={themeObj}
        />
        <div className="p-4 flex-1 overflow-auto">
          <Routes>
            <Route
              path="/"
              element={
                <TicketingPage
                  tickets={tickets}
                  user={user}
                  onProfileClick={openProfile}
                  isITUser={currentUserRole === "admin"}
                  onOpenCreate={() => setIsCreateOpen(true)}
                  theme={themeObj}
                />
              }
            />
            <Route path="/dashboard" element={<Dashboard theme={themeObj} />} />
            <Route
              path="/stock"
              element={
                <StockManagementPage
                  currentUserRole={currentUserRole}
                  theme={themeObj}
                />
              }
            />
            <Route
              path="/ticket/:id"
              element={
                <TicketDetailsPage
                  tickets={tickets}
                  isITUser={currentUserRole === "admin"}
                  theme={themeObj}
                />
              }
            />
          </Routes>
        </div>
      </main>

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={selectedUser || user}
        setUser={setUser}
        currentUser={user}
        allTickets={tickets}
        theme={themeObj}
      />

      {isCreateOpen && (
        <CreateTicketModal
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleAddTicket}
        />
      )}
    </div>
  );
}

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const themeObj = isDarkMode
    ? {
        bg: "bg-[#12102A]",
        textP: "text-[#E2E0FF]",
        textM: "text-[#8480B8]",
        border: "border-[#2E2B5A]",
        input: "bg-[#1E1B3A]",
        primary: "#7F6FF5",
        accent: "#3ECFAA",
        btn: "from-[#7F6FF5] to-[#3ECFAA]",
      }
    : {
        bg: "bg-[#F5F4FF]",
        textP: "text-[#1E1B3A]",
        textM: "text-[#7F77DD]",
        border: "border-[#DDD9FF]",
        input: "bg-white",
        primary: "#534AB7",
        accent: "#0F6E56",
        btn: "from-[#534AB7] to-[#7F77DD]",
      };
  const commonProps = { isDarkMode, setIsDarkMode, theme: themeObj };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage {...commonProps} />} />
      <Route path="/signup" element={<SignUpRole {...commonProps} />} />
      <Route path="/signup/user" element={<UserRegister {...commonProps} />} />
      <Route
        path="/signup/admin"
        element={<AdminRegister {...commonProps} />}
      />
      <Route path="/setup" element={<SetupEnvironment {...commonProps} />} />
      <Route path="/*" element={<MainApp />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
