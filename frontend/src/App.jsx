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

import { mockTickets } from "./mockData";

function MainApp({ themeObj, theme, setTheme, user, setUser }) {
  const [currentUserRole, setCurrentUserRole] = useState("admin");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [tickets, setTickets] = useState(mockTickets);
  const [selectedUser, setSelectedUser] = useState(null);

  const openProfile = (userData) => {
    setSelectedUser(userData || user);
    setIsProfileOpen(true);
  };

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

  return (
    <div className={`app-container flex min-h-screen ${themeObj.bg}`}>
      <Sidebar isDarkMode={theme === "dark"} theme={themeObj} />
      <main className="main-wrapper flex-1 flex flex-col relative overflow-hidden">
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
            {/* هنا المسار الافتراضي جوه السيستم هو التيكتات */}
            <Route
              path="/tickets"
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
            <Route path="/settings" element={<Settings />} />
            {/* لو حد دخل على / يوديه للتيكتات */}
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
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleAddTicket}
        />
      )}
    </div>
  );
}

function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState({
    name: "hamada Hassan",
    email: "a.hassan@company.com",
    role: "Senior IT Engineer",
    isOnline: true,
    avatar: null,
  });
  const [theme, setTheme] = useState("light");

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

  const commonProps = { isDarkMode, setIsDarkMode, theme: themeObj , setUser };

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

      {/* أي مسار تاني يفتح الـ MainApp */}
      <Route
        path="/*"
        element={
          <MainApp
            themeObj={themeObj}
            theme={theme}
            setTheme={setTheme}
            user={user}
            setUser={setUser}
          />
        }
      />

      {/* توجيه البداية للوجن */}
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
