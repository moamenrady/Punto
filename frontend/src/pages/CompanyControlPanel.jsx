import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Settings, Plus, LayoutDashboard, ShieldCheck, Mail, Loader2 } from "lucide-react";
import axios from "axios";

export default function CompanyControlPanel({ theme, user, company }) {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // Ideally, we'd have a route to get all users in the company
    // For now, let's just show the current company info
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/v1/companies/add-user",
        { userId: newUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("User added successfully!");
      setNewUserId("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to add user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto"style={{ backgroundColor: "#F3F4F6", minHeight: "100vh" }}>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3" style={{ color: theme.textP }}>
            <ShieldCheck size={32} className="text-purple-500" />
            {company?.name} Control Panel
          </h1>
          <p className={`${theme.textM} mt-2`}>Manage your organization, team members, and subscription.</p>
        </div>
        <div className={`px-4 py-2 rounded-xl border ${theme.border} bg-opacity-5`} style={{ backgroundColor: `${theme.primary}20` }}>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.primary }}>
            {company?.plan_id?.name || "Active Plan"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className={`p-6 rounded-3xl border ${theme.border} ${theme.input} shadow-sm`}>
          <h4 className={`text-xs font-bold uppercase ${theme.textM} mb-4`}>Total Members</h4>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black">{company?.company_users?.length || 1}</span>
            <span className="text-sm font-medium opacity-50 mb-1">Users registered</span>
          </div>
        </div>
        <div className={`p-6 rounded-3xl border ${theme.border} ${theme.input} shadow-sm`}>
          <h4 className={`text-xs font-bold uppercase ${theme.textM} mb-4`}>Active Plan</h4>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-green-500">${company?.plan_id?.value || 0}</span>
            <span className="text-sm font-medium opacity-50 mb-1">/ month</span>
          </div>
        </div>
        <div className={`p-6 rounded-3xl border ${theme.border} ${theme.input} shadow-sm`}>
          <h4 className={`text-xs font-bold uppercase ${theme.textM} mb-4`}>Active Features</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {company?.plan_id?.features?.map(f => (
              <span key={f} className="text-[10px] px-2 py-1 bg-blue-50 text-blue-600 rounded-md font-bold uppercase">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className={`p-8 rounded-[40px] border ${theme.border} ${theme.input} shadow-xl`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">User Management</h3>
            <button 
              onClick={() => setShowAddUser(!showAddUser)}
              className={`p-2 rounded-full bg-gradient-to-r ${theme.btn} text-white shadow-lg`}
            >
              <Plus size={20} />
            </button>
          </div>

          {showAddUser && (
            <motion.form 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddUser} 
              className="mb-8 space-y-4"
            >
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 opacity-40" size={18} />
                <input 
                  type="text" 
                  placeholder="Enter User ID to invite" 
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border outline-none ${theme.border} bg-white`}
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-3.5 rounded-2xl text-white font-bold bg-gray-900 shadow-xl flex justify-center`}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Confirm Add"}
              </button>
              {msg && <p className={`text-center text-xs font-bold ${msg.includes("success") ? "text-green-500" : "text-red-500"}`}>{msg}</p>}
            </motion.form>
          )}

          <div className="space-y-4">
            <p className={`text-sm ${theme.textM}`}>Current members are automatically filtered in the system. Use the Ticketing or Project modules to assign them tasks.</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className={`p-8 rounded-[40px] border ${theme.border} ${theme.input} shadow-xl`}>
            <h3 className="text-xl font-bold mb-6">Quick Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white bg-opacity-40 border border-transparent hover:border-purple-200 cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                  <LayoutDashboard className="text-purple-500" />
                  <div>
                    <p className="font-bold">Organization Settings</p>
                    <p className="text-xs opacity-50">Change name, logo, and website</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white bg-opacity-40 border border-transparent hover:border-purple-200 cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                  <Settings className="text-blue-500" />
                  <div>
                    <p className="font-bold">Billing & Invoices</p>
                    <p className="text-xs opacity-50">Manage your subscription</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
