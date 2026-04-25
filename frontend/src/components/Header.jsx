import React from "react";
import { useLocation } from "react-router-dom";
import { Sun, Moon, Bell, MessageSquare, FileText, Search, LayoutDashboard, Package, Settings } from "lucide-react";

const Header = ({
  user,
  onProfileClick,
  theme,
  setTheme,
  searchQuery,
  setSearchQuery,
}) => {
  const location = useLocation();

  const roleLabel = user?.role === "admin" ? "Admin" : "User";
  const roleBg = user?.role === "admin" ? "#EEF1FD" : "#F0FDF4";
  const roleColor = user?.role === "admin" ? "#534AB7" : "#15803D";
  const roleBorder = user?.role === "admin" ? "#C7D2F8" : "#BBF7D0";

  const getPageInfo = (path) => {
    if (path.startsWith("/dashboard")) return { title: "Dashboard", Icon: LayoutDashboard };
    if (path.startsWith("/stock")) return { title: "Stock Management", Icon: Package };
    if (path.startsWith("/chatmodal")) return { title: "Chat System", Icon: MessageSquare };
    if (path.startsWith("/settings")) return { title: "Settings", Icon: Settings };
    return { title: "Ticketing System", Icon: FileText };
  };

  const { title: pageTitle, Icon: PageIcon } = getPageInfo(location.pathname);

  return (
    <header
      className="top-header"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: "70px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E9EBF0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <PageIcon size={18} color="#8A9FE8" />
        <span
          style={{ fontSize: "0.95rem", fontWeight: 600, color: "#111827" }}
        >
          {pageTitle}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          maxWidth: "500px",
          margin: "0 40px",
          position: "relative",
        }}
      >
        <Search
          size={18}
          color="#9CA3AF"
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <input
          type="text"
          placeholder="Search by ID, title, category, or user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 16px 10px 45px",
            borderRadius: "30px",
            border: "1px solid #E5E7EB",
            backgroundColor: "#F9FAFB",
            fontSize: "0.85rem",
            outline: "none",
          }}
        />
      </div>

      <div
        className="header-actions"
        style={{ display: "flex", alignItems: "center", gap: 12 }}
      >
        {/* Read-only role badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: roleBg,
            padding: "5px 12px",
            borderRadius: "10px",
            border: `1px solid ${roleBorder}`,
          }}
        >
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9CA3AF" }}>
            ROLE:
          </span>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: roleColor,
            }}
          >
            {roleLabel}
          </span>
        </div>

        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="icon-btn"
          style={{
            padding: "8px",
            borderRadius: "12px",
            border: "1px solid #E9EBF0",
            background: "#F9FAFB",
            cursor: "pointer",
          }}
        >
          {theme === "light" ? (
            <Sun size={20} color="#6B7280" />
          ) : (
            <Moon size={20} color="#6B7280" />
          )}
        </button>

        <button
          className="icon-btn"
          style={{
            padding: "8px",
            borderRadius: "12px",
            border: "1px solid #E9EBF0",
            background: "#F9FAFB",
          }}
        >
          <MessageSquare size={20} color="#6B7280" />
        </button>

        <button
          className="icon-btn"
          style={{
            padding: "8px",
            borderRadius: "12px",
            border: "1px solid #E9EBF0",
            background: "#F9FAFB",
          }}
        >
          <Bell size={20} color="#6B7280" />
        </button>

        <div
          onClick={onProfileClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingLeft: 16,
            borderLeft: "1px solid #E9EBF0",
            cursor: "pointer",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 800,
                color: "#9CA3AF",
                textTransform: "uppercase",
              }}
            >
              {roleLabel}
            </div>
            <div
              style={{ fontSize: "0.9rem", fontWeight: 700, color: "#000000" }}
            >
              {user?.name}
            </div>
          </div>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              backgroundColor: "#EEF1FD",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#8A9FE8",
              fontWeight: 700,
              fontSize: "0.85rem",
              border: "1px solid #E0E7FF",
              overflow: "hidden",
            }}
          >
            {user?.avatar ? (
              <img
                src={user.avatar.startsWith("data:") ? user.avatar : `http://localhost:5000${user.avatar}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") ?? "?"
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
