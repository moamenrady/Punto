import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Camera, Pencil, Check, Mail, Phone, Briefcase, MapPin, ArrowLeft,
} from "lucide-react";
import { createPortal } from "react-dom";

const priorityColor = { critical: "#EF4444", high: "#F59E0B", medium: "#3B82F6", low: "#10B981" };
const priorityBg    = { critical: "#FEF2F2", high: "#FFFBEB", medium: "#EFF6FF", low: "#F0FDF4" };
const ACCENT_BG     = "#F5F4FF";

/* ── shared ticket row ── */
const TicketRow = ({ t }) => {
  const p = t.priority?.toLowerCase();
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "11px 16px", borderRadius: "14px",
      border: "1px solid #EDE9FE", backgroundColor: "#fff",
    }}>
      <div style={{ display: "flex", gap: "10px", minWidth: 0 }}>
        <span style={{ color: "#7F6FF5", fontWeight: "900", fontSize: "12px", flexShrink: 0 }}>{t.id}</span>
        <span style={{ fontWeight: "600", color: "#374151", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {t.title}
        </span>
      </div>
      <span style={{
        fontSize: "9px", fontWeight: "900", flexShrink: 0, marginLeft: "10px",
        padding: "3px 8px", borderRadius: "6px",
        color: priorityColor[p] ?? "#9CA3AF",
        backgroundColor: priorityBg[p] ?? "#F9FAFB",
      }}>
        {t.priority?.toUpperCase()}
      </span>
    </div>
  );
};

export default function UserProfileModal({
  isOpen, onClose, user, setUser, currentUser, allTickets, theme,
}) {
  const [isEditing, setIsEditing]           = useState(false);
  const [formData, setFormData]             = useState({ ...user });
  const [showAllTickets, setShowAllTickets] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) { setFormData({ ...user }); setShowAllTickets(false); setIsEditing(false); }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const isMe          = user?.name === currentUser?.name;
  const userTickets   = allTickets?.filter((t) => t.createdBy?.name === user?.name) || [];
  const activeList    = userTickets.filter((t) => t.status?.toLowerCase() !== "closed");
  const openCount     = activeList.length;
  const resolvedCount = userTickets.filter((t) => t.status?.toLowerCase() === "closed").length;

  const handleSave = () => { setUser(formData); setIsEditing(false); };

  /* ════════════════════════════════════════════
     SIDE PANEL  — لو نفس اليوزر (isMe)
  ════════════════════════════════════════════ */
  if (isMe) {
    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              style={{ position: "fixed", inset: 0, zIndex: 99998, backgroundColor: "rgba(15,23,42,0.15)", backdropFilter: "blur(2px)" }}
            />
            <motion.div
              key="panel"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 99999,
                width: "420px", backgroundColor: "#fff",
                boxShadow: "-20px 0 60px rgba(0,0,0,0.1)",
                display: "flex", flexDirection: "column", overflowY: "auto",
              }}
            >
              <AnimatePresence mode="wait">
                {!showAllTickets ? (
                  <motion.div key="main" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.16 }} style={{ display: "flex", flexDirection: "column", flex: 1 }}>

                    {/* purple top */}
                    <div style={{ backgroundColor: ACCENT_BG, padding: "36px 28px 28px" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={22} /></button>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
                        <div style={{ position: "relative", cursor: "pointer" }} onClick={() => fileInputRef.current?.click()}>
                          <div style={{ width: "90px", height: "90px", borderRadius: "24px", background: "linear-gradient(135deg,#7F6FF5,#3ECFAA)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "38px", fontWeight: "bold", overflow: "hidden", border: "3px solid white", boxShadow: "0 8px 24px rgba(127,111,245,0.25)" }}>
                            {formData.avatar ? <img src={formData.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : formData.name?.charAt(0) ?? "U"}
                          </div>
                          <div style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "white", padding: "4px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                            <Camera size={12} color="#7F6FF5" />
                          </div>
                          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onloadend = () => setFormData({ ...formData, avatar: r.result }); r.readAsDataURL(f); } }} />
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
                            {isEditing
                              ? <input style={{ fontSize: "20px", fontWeight: "bold", border: "none", borderBottom: "2px solid #534AB7", outline: "none", background: "transparent", textAlign: "center" }} value={formData.name ?? ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                              : <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", margin: 0 }}>{formData.name}</h2>}
                            <span onClick={() => setFormData({ ...formData, isOnline: !formData.isOnline })} style={{ padding: "3px 10px", backgroundColor: formData.isOnline ? "#ECFDF5" : "#F9FAFB", color: formData.isOnline ? "#10B981" : "#9CA3AF", fontSize: "10px", fontWeight: "bold", borderRadius: "15px", border: "1px solid currentColor", cursor: "pointer" }}>
                              {formData.isOnline ? "ONLINE" : "OFFLINE"}
                            </span>
                          </div>
                          {isEditing
                            ? <input style={{ fontSize: "14px", color: "#9CA3AF", border: "none", borderBottom: "1px solid #DDD", outline: "none", background: "transparent", textAlign: "center", marginTop: "4px" }} value={formData.role ?? ""} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                            : <p style={{ fontSize: "14px", color: "#9CA3AF", margin: "4px 0 0" }}>{formData.role}</p>}
                        </div>
                        <button onClick={isEditing ? handleSave : () => setIsEditing(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 20px", borderRadius: "12px", border: "1px solid #E5E7EB", background: isEditing ? "#7F6FF5" : "white", color: isEditing ? "white" : "#374151", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
                          {isEditing ? <><Check size={14} /> Save</> : <><Pencil size={14} /> Edit Profile</>}
                        </button>
                      </div>
                    </div>

                    {/* stats */}
                    <div style={{ padding: "20px 28px 0", display: "flex", gap: "12px" }}>
                      {[{ val: resolvedCount, label: "Resolved" }, { val: openCount, label: "Open Tickets" }].map(({ val, label }) => (
                        <div key={label} style={{ flex: 1, textAlign: "center", padding: "18px 10px", borderRadius: "18px", border: "2.5px solid #7F6FF5", boxShadow: "0 4px 15px rgba(127,111,245,0.12)" }}>
                          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#111827" }}>{val}</div>
                          <div style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: "bold", marginTop: "2px" }}>{label}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ margin: "20px 28px 0", borderBottom: "1px solid #F3F4F6" }} />

                    {/* personal info */}
                    <div style={{ padding: "20px 28px 0" }}>
                      <p style={{ fontSize: "10px", fontWeight: "800", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Personal Info</p>
                      {[
                        { label: "Work Email", val: formData.email, k: "email", icon: Mail },
                        { label: "Phone Number", val: formData.phone, k: "phone", icon: Phone },
                        { label: "Department", val: formData.dept, k: "dept", icon: Briefcase },
                        { label: "Location", val: formData.location, k: "location", icon: MapPin },
                      ].map((item) => (
                        <div key={item.label} style={{ marginBottom: "16px" }}>
                          <label style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: "bold", display: "block", marginBottom: "4px" }}>{item.label}</label>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <item.icon size={15} color="#8A9FE8" />
                            {isEditing
                              ? <input style={{ border: "none", borderBottom: "1px solid #E5E7EB", outline: "none", width: "100%", fontSize: "14px" }} value={item.val ?? ""} onChange={(e) => setFormData({ ...formData, [item.k]: e.target.value })} />
                              : <span style={{ fontWeight: "600", color: "#374151", fontSize: "14px" }}>{item.val}</span>}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ margin: "4px 28px 0", borderBottom: "1px solid #F3F4F6" }} />

                    {/* tickets */}
                    <div style={{ padding: "20px 28px 32px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "10px", fontWeight: "800", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "1px" }}>Active Tickets</span>
                        {activeList.length > 3 && <button onClick={() => setShowAllTickets(true)} style={{ fontSize: "12px", fontWeight: "700", color: "#7F6FF5", background: "none", border: "none", cursor: "pointer", padding: 0 }}>View all ({activeList.length})</button>}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {activeList.length === 0 && <p style={{ fontSize: "13px", color: "#D1D5DB", fontStyle: "italic" }}>No active tickets</p>}
                        {activeList.slice(0, 3).map((t) => <TicketRow key={t.id} t={t} />)}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="all" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.16 }} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ padding: "32px 28px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <button onClick={() => setShowAllTickets(false)} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", fontWeight: "600", color: "#7F6FF5", background: "none", border: "none", cursor: "pointer", padding: 0 }}><ArrowLeft size={16} /> Back</button>
                        <span style={{ color: "#E5E7EB" }}>|</span>
                        <span style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>All Tickets <span style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: "500" }}>({activeList.length})</span></span>
                      </div>
                      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={20} /></button>
                    </div>
                    <div style={{ margin: "0 28px", borderBottom: "1px solid #F3F4F6" }} />
                    <div style={{ padding: "20px 28px 32px", flex: 1, overflowY: "auto" }}>
                      <div style={{ backgroundColor: ACCENT_BG, borderRadius: "20px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {activeList.map((t) => <TicketRow key={t.id} t={t} />)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    );
  }

  /* ════════════════════════════════════════════
     POPUP MODAL  — لو يوزر تاني
  ════════════════════════════════════════════ */
  const statCard = {
    padding: "25px", borderRadius: "20px", flex: 1, textAlign: "center",
    border: "2.5px solid #7F6FF5", boxShadow: "0 4px 15px rgba(127,111,245,0.15)",
  };

  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 999999, backgroundColor: "rgba(15,23,42,0.2)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: "#fff", borderRadius: "40px", width: "800px", boxShadow: "0 25px 70px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", border: "1px solid #E5E7EB", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div style={{ padding: "40px 50px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
            <div style={{ width: "95px", height: "95px", borderRadius: "25px", background: "linear-gradient(135deg,#7F6FF5,#3ECFAA)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "40px", fontWeight: "bold", overflow: "hidden", border: "2px solid white" }}>
              {formData.avatar ? <img src={formData.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : formData.name?.charAt(0) ?? "U"}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: 0 }}>{formData.name}</h2>
                <span style={{ padding: "3px 10px", backgroundColor: formData.isOnline ? "#ECFDF5" : "#F9FAFB", color: formData.isOnline ? "#10B981" : "#9CA3AF", fontSize: "10px", fontWeight: "bold", borderRadius: "15px", border: "1px solid currentColor" }}>
                  {formData.isOnline ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
              <p style={{ color: "#9CA3AF", margin: "4px 0", fontSize: "16px" }}>{formData.role}</p>
            </div>
          </div>
          <X size={32} color="#D1D5DB" style={{ cursor: "pointer" }} onClick={onClose} />
        </div>

        <div style={{ borderBottom: "1px solid #F3F4F6", margin: "0 50px" }} />

        {/* body */}
        <AnimatePresence mode="wait">
          {!showAllTickets ? (
            <motion.div key="main" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}
              style={{ padding: "0 50px 40px 50px", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "60px" }}
            >
              {/* left */}
              <div style={{ marginTop: "30px" }}>
                <p style={{ fontSize: "11px", fontWeight: "800", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "25px" }}>Personal Info</p>
                {[
                  { label: "Work Email", val: formData.email, icon: Mail },
                  { label: "Phone Number", val: formData.phone, icon: Phone },
                  { label: "Department", val: formData.dept, icon: Briefcase },
                  { label: "Location", val: formData.location, icon: MapPin },
                ].map((item) => (
                  <div key={item.label} style={{ marginBottom: "22px" }}>
                    <label style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: "bold", display: "block", marginBottom: "5px" }}>{item.label}</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <item.icon size={16} color="#8A9FE8" />
                      <span style={{ fontWeight: "600", color: "#374151", fontSize: "15px" }}>{item.val}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* right */}
              <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "28px" }}>
                <div style={{ display: "flex", gap: "15px" }}>
                  <div style={statCard}><div style={{ fontSize: "36px", fontWeight: "bold", color: "#111827" }}>{resolvedCount}</div><div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: "bold" }}>Resolved</div></div>
                  <div style={statCard}><div style={{ fontSize: "36px", fontWeight: "bold", color: "#111827" }}>{openCount}</div><div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: "bold" }}>Open tickets</div></div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#9CA3AF", textTransform: "uppercase" }}>Active Tickets</span>
                    {activeList.length > 3 && <button onClick={() => setShowAllTickets(true)} style={{ fontSize: "12px", fontWeight: "700", color: "#7F6FF5", background: "none", border: "none", cursor: "pointer", padding: 0 }}>View all ({activeList.length})</button>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {activeList.length === 0 && <p style={{ fontSize: "13px", color: "#D1D5DB", fontStyle: "italic" }}>No active tickets</p>}
                    {activeList.slice(0, 3).map((t) => <TicketRow key={t.id} t={t} />)}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="all" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.18 }} style={{ padding: "30px 50px 40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <button onClick={() => setShowAllTickets(false)} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", color: "#7F6FF5", background: "none", border: "none", cursor: "pointer", padding: 0 }}><ArrowLeft size={16} /> Back</button>
                <span style={{ color: "#E5E7EB" }}>|</span>
                <span style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>All Tickets <span style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: "500" }}>({activeList.length})</span></span>
              </div>
              <div style={{ backgroundColor: ACCENT_BG, borderRadius: "20px", padding: "20px", maxHeight: "340px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                {activeList.map((t) => <TicketRow key={t.id} t={t} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>,
    document.body
  );
}