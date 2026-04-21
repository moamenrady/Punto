import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

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
import Settings from "./pages/Settings";

function MainApp({ themeObj, theme, setTheme, user, setUser }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const isAdmin = user?.role === "admin";

  const API_URL = "http://127.0.0.1:5000/api/v1/tickets";

  // Define refreshTicketList to re-fetch data from the API
  const refreshTicketList = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      if (response.ok) {
        setTickets(Array.isArray(data) ? data : (data.tickets || []));
      }
    } catch (error) {
      console.error("Failed to refresh tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshTicketList();
  }, [API_URL]);

  const openProfile = (userData) => {
    setSelectedUser(userData || user);
    setIsProfileOpen(true);
  };

  const handleAddTicket = async (newTicket) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTicket,
          createdBy: { name: user.name, role: user.role, avatar: user.avatar },
        }),
      });
      if (response.ok) {
        // Refresh the list from server to get the official saved state
        await refreshTicketList();
        setIsCreateOpen(false);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  return (
    <div className={`app-container flex min-h-screen ${themeObj.bg}`}>
      <Sidebar isDarkMode={theme === "dark"} theme={themeObj} />
      <main className="main-wrapper flex-1 flex flex-col relative overflow-hidden">
        <Header
          user={user}
          onProfileClick={() => openProfile(user)}
          theme={theme}
          setTheme={setTheme}
          themeObj={themeObj}
        />
        <div className="p-4 flex-1 overflow-auto">
          <Routes>
            <Route
              path="/tickets"
              element={
                <TicketingPage
                  tickets={tickets}
                  user={user}
                  onProfileClick={openProfile}
                  isITUser={isAdmin}
                  onOpenCreate={() => setIsCreateOpen(true)}
                  theme={themeObj}
                  isLoading={isLoading}
                />
              }
            />
            <Route path="/dashboard" element={<Dashboard theme={themeObj} />} />
            <Route
              path="/stock"
              element={
                <StockManagementPage
                  currentUserRole={user?.role}
                  theme={themeObj}
                />
              }
            />
            <Route
              path="/ticket/:id"
              element={
                <TicketDetailsPage
                  tickets={tickets}
                  isITUser={isAdmin}
                  theme={themeObj}
                  user={user}
                />
              }
            />
            <Route path="/settings" element={<Settings refreshUser={() => setUser(user)} />} />
            <Route path="/" element={<Navigate to="/tickets" replace />} />
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
          user={user} 
          onClose={() => setIsCreateOpen(false)} 
          onSubmit={refreshTicketList} 
        />
      )}
    </div>
  );
}

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState("light");

  const [user, setUserState] = useState(() => {
    const savedUser = localStorage.getItem("vertex_user");
    const expiry = localStorage.getItem("vertex_expiry");
    if (savedUser && expiry && Date.now() < parseInt(expiry)) {
      return JSON.parse(savedUser);
    }
    localStorage.removeItem("vertex_user");
    localStorage.removeItem("vertex_expiry");
    return null;
  });

  const setUser = (userData) => {
    if (userData) {
      const tenHours = 10 * 60 * 60 * 1000;
      const expiryTime = Date.now() + tenHours;
      localStorage.setItem("vertex_user", JSON.stringify(userData));
      localStorage.setItem("vertex_expiry", expiryTime.toString());
      setUserState(userData);
    } else {
      localStorage.removeItem("vertex_user");
      localStorage.removeItem("vertex_expiry");
      localStorage.removeItem("token");
      setUserState(null);
    }
  };

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

  const commonProps = { isDarkMode, setIsDarkMode, theme: themeObj, setUser };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage {...commonProps} />} />
      <Route path="/signup" element={<SignUpRole {...commonProps} />} />
      <Route path="/signup/user" element={<UserRegister {...commonProps} />} />
      <Route path="/signup/admin" element={<AdminRegister {...commonProps} />} />
      <Route path="/setup" element={<SetupEnvironment {...commonProps} />} />

      <Route
        path="/*"
        element={
          user ? (
            <MainApp
              themeObj={themeObj}
              theme={theme}
              setTheme={setTheme}
              user={user}
              setUser={setUser}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
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