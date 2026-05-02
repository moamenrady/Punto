import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Users, ArrowRight } from "lucide-react";
import { DarkLogo, LightLogo } from "../components/logo";

export default function LandingPage({ isDarkMode, theme, user, setUser }) {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.company_id) {
      if (user.role === "manager" || user.role === "admin") {
        navigate("/control-panel");
      } else {
        navigate("/tickets");
      }
    }
  }, [user, navigate]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-500 ${theme.bg}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[800px] text-center"
      >
        <div className="mb-12">
          {isDarkMode ? <DarkLogo primary={theme.primary} accent={theme.accent} /> : <LightLogo />}
          <h1 className="text-4xl font-extrabold mt-6 mb-4 tracking-tight" style={{ color: theme.primary }}>
            Welcome to OmniSuite
          </h1>
          <p className={`text-lg ${theme.textM} max-w-[600px] mx-auto`}>
            Your workspace is currently empty. Start by creating a new organization or joining an existing one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Create Company Card */}
          <motion.div
            whileHover={{ y: -8, boxShadow: "0px 20px 40px rgba(0,0,0,0.1)" }}
            onClick={() => navigate("/create-company")}
            className={`cursor-pointer p-10 rounded-3xl border transition-all ${isDarkMode ? "bg-[#1E1B3A] border-[#2E2B5A]" : "bg-white border-[#DDD9FF]"} group`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${theme.btn} text-white shadow-lg`}>
              <PlusCircle size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2" style={{ color: theme.textP }}>
              Create Company
              <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </h3>
            <p className={`${theme.textM} text-sm leading-relaxed`}>
              Register a new organization and become the primary manager of your digital workspace.
            </p>
          </motion.div>

          {/* Join Company Card */}
          <motion.div
            whileHover={{ y: -8, boxShadow: "0px 20px 40px rgba(0,0,0,0.05)" }}
            className={`cursor-pointer p-10 rounded-3xl border transition-all ${isDarkMode ? "bg-[#1E1B3A] border-[#2E2B5A]" : "bg-white border-[#DDD9FF]"} opacity-60 grayscale hover:grayscale-0 hover:opacity-100`}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gray-100 text-gray-400">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: theme.textP }}>
              Join Organization
            </h3>
            <p className={`${theme.textM} text-sm leading-relaxed`}>
              Have an invite? Enter your company code to join your team and start collaborating.
              <span className="block mt-2 font-bold text-xs uppercase tracking-wider text-orange-500">(Coming Soon)</span>
            </p>
          </motion.div>
        </div>

        <button
          onClick={handleLogout}
          className={`text-sm font-bold underline opacity-60 hover:opacity-100 transition-all`}
          style={{ color: theme.primary }}
        >
          Sign out and use another account
        </button>
      </motion.div>
    </div>
  );
}
