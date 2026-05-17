import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Settings,
  Sun,
  Moon,
  Ticket,
  Package,
  MessageSquare,
  Briefcase,
  Code2,
  UserPlus,
  Check,
} from "lucide-react";

export default function SetupEnvironment({ isDarkMode, setIsDarkMode, theme }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [activeModules, setActiveModules] = useState(["chat", "pm"]);
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);

  const toggleModule = (id) => {
    setActiveModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-12 px-4">
      {[1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= i ? "bg-[#7F6FF5] text-white shadow-lg" : "bg-gray-200 dark:bg-[#2E2B5A] text-gray-400"}`}
            >
              {i}
            </div>
            <span
              className={`text-[10px] font-bold ${step === i ? "text-[#7F6FF5]" : "text-gray-400 dark:text-gray-500"}`}
            >
              {i === 1
                ? "Teams"
                : i === 2
                  ? "Members"
                  : i === 3
                    ? "Modules&Plan"
                    : "Finish"}
            </span>
          </div>
          {i < 4 && (
            <div
              className={`h-[2px] flex-1 min-w-[30px] md:min-w-[80px] ${step > i ? "bg-[#7F6FF5]" : "bg-gray-200 dark:bg-[#2E2B5A]"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-6 transition-all duration-500 ${theme.bg}`}
    >
      {step === 1 && (
        <button
          onClick={() => navigate("/signup/admin")}
          className={`fixed top-6 left-6 p-2.5 rounded-full border transition-all shadow-sm z-50 ${isDarkMode ? "bg-[#1E1B3A] border-[#2E2B5A]" : "bg-white border-[#DDD9FF]"}`}
        >
          <ArrowLeft
            size={20}
            style={{ color: isDarkMode ? "#E2E0FF" : "#534AB7" }}
          />
        </button>
      )}

      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-6 right-6 p-2.5 rounded-full border shadow-sm z-50 ${isDarkMode ? "bg-[#1E1B3A] border-[#2E2B5A]" : "bg-white border-[#DDD9FF]"}`}
      >
        {isDarkMode ? (
          <Sun size={20} className="text-[#E2E0FF]" />
        ) : (
          <Moon size={20} className="text-[#534AB7]" />
        )}
      </button>

      <div className="text-center mt-10 mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span style={{ color: isDarkMode ? "#E2E0FF" : "#1E1B3A" }}>
            Setup Your{" "}
          </span>
          <span
            className={
              !isDarkMode
                ? "bg-gradient-to-r from-[#7F6FF5] to-[#3ECFAA] bg-clip-text text-transparent"
                : ""
            }
            style={{ color: isDarkMode ? "#7F6FF5" : "transparent" }}
          >
            Environment
          </span>
        </h1>
        <p className={`text-[13px] ${theme.textM}`}>
          Let's build your workspace — add your teams, members, and tools
        </p>
      </div>

      <div className="w-full max-w-[850px] flex-1 flex flex-col items-center mt-4">
        <StepIndicator />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`w-full ${isDarkMode ? "bg-[#1E1B3A] border-[#2E2B5A]" : "bg-white border-[#DDD9FF]"} rounded-[24px] p-8 md:p-12 shadow-xl border`}
          >
            {step === 1 && (
              <div className="space-y-6 text-left">
                <div className="flex items-center gap-3 mb-6">
                  <Users
                    size={24}
                    style={{ color: isDarkMode ? "#E2E0FF" : "#1E1B3A" }}
                  />
                  <h2
                    className="text-xl font-bold"
                    style={{ color: isDarkMode ? "#E2E0FF" : "#1E1B3A" }}
                  >
                    Add Teams
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className={`text-[12px] font-bold ${theme.textM}`}>
                      Team Name
                    </p>
                    <input
                      placeholder="Enter team name"
                      className={`w-full px-4 py-3 rounded-xl border outline-none text-[13px] ${theme.input} ${theme.textP} ${theme.border} focus:ring-1`}
                      style={{
                        "--tw-ring-color": isDarkMode ? "#7F6FF5" : "#534AB7",
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className={`text-[12px] font-bold ${theme.textM}`}>
                      Description
                    </p>
                    <input
                      placeholder="Enter team type"
                      className={`w-full px-4 py-3 rounded-xl border outline-none text-[13px] ${theme.input} ${theme.textP} ${theme.border} focus:ring-1`}
                      style={{
                        "--tw-ring-color": isDarkMode ? "#7F6FF5" : "#534AB7",
                      }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3.5 rounded-xl text-white font-bold text-[13px] bg-gradient-to-r ${theme.btn} shadow-md flex items-center justify-center gap-2`}
                  >
                    <Plus size={18} /> Add Team
                  </motion.button>
                </div>
                <div className="mt-10 space-y-3">
                  <p className={`text-[13px] font-bold ${theme.textM}`}>
                    Added Teams ({teams.length})
                  </p>
                  {teams.map((t) => (
                    <div
                      key={t.id}
                      className={`flex items-center p-3 rounded-2xl ${isDarkMode ? "bg-[#12102A]/50" : "bg-[#EEEDFE]"} border ${theme.border}`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4`}
                        style={{
                          backgroundColor: isDarkMode
                            ? `${t.iconColor}22`
                            : `${t.iconColor}15`,
                        }}
                      >
                        <span style={{ color: t.iconColor }}>{t.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className={`text-[14px] font-bold ${theme.textP}`}>
                          {t.name}
                        </p>
                        <p
                          className={`text-[11px] uppercase tracking-wider ${theme.textM}`}
                        >
                          {t.desc}
                        </p>
                      </div>
                      <Trash2
                        size={18}
                        className="text-red-400 cursor-pointer hover:text-red-600 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 text-left">
                <div className="flex items-center gap-3 mb-6">
                  <UserPlus
                    size={24}
                    style={{ color: isDarkMode ? "#E2E0FF" : "#1E1B3A" }}
                  />
                  <h2
                    className="text-xl font-bold"
                    style={{ color: isDarkMode ? "#E2E0FF" : "#1E1B3A" }}
                  >
                    Invite Members
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className={`text-[12px] font-bold ${theme.textM}`}>
                      Name
                    </p>
                    <input
                      placeholder="Enter member name"
                      className={`w-full px-4 py-3 rounded-xl border outline-none text-[13px] ${theme.input} ${theme.textP} ${theme.border} focus:ring-1`}
                      style={{
                        "--tw-ring-color": isDarkMode ? "#7F6FF5" : "#534AB7",
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className={`text-[12px] font-bold ${theme.textM}`}>
                      Email
                    </p>
                    <input
                      placeholder="Enter Email"
                      className={`w-full px-4 py-3 rounded-xl border outline-none text-[13px] ${theme.input} ${theme.textP} ${theme.border} focus:ring-1`}
                      style={{
                        "--tw-ring-color": isDarkMode ? "#7F6FF5" : "#534AB7",
                      }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3.5 rounded-xl text-white font-bold text-[13px] bg-gradient-to-r ${theme.btn} shadow-md flex items-center justify-center gap-2`}
                  >
                    <Plus size={18} /> Add Member
                  </motion.button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-12 text-left">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Settings
                      size={24}
                      style={{ color: isDarkMode ? "#E2E0FF" : "#1E1B3A" }}
                    />
                    <div>
                      <h2
                        className="text-lg font-bold"
                        style={{ color: isDarkMode ? "#E2E0FF" : "#1E1B3A" }}
                      >
                        Configure Modules
                      </h2>
                      <p className={`text-[11px] ${theme.textM}`}>
                        Choose which modules to enable for your workspace
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {[
                      {
                        id: "tkt",
                        n: "Ticketing",
                        d: "Manage support tickets and customer requests",
                      },
                      {
                        id: "stock",
                        n: "Stock Management",
                        d: "Track inventory and stock levels",
                      },
                      {
                        id: "chat",
                        n: "Team Chat",
                        d: "Real-time messaging and collaboration",
                      },
                      {
                        id: "pm",
                        n: "Project Management",
                        d: "Plan and track project progress",
                      },
                    ].map((m) => {
                      const isActive = activeModules.includes(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => toggleModule(m.id)}
                          className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${isActive ? (isDarkMode ? "border-[#3ECFAA] bg-[#3ECFAA]/5" : "border-[#7F6FF5] bg-[#7F6FF5]/5") : theme.border}`}
                        >
                          <div>
                            <p
                              className={`text-[13px] font-bold ${theme.textP}`}
                            >
                              {m.n}
                            </p>
                            <p className={`text-[11px] ${theme.textM}`}>
                              {m.d}
                            </p>
                          </div>
                          <div
                            className={`w-11 h-6 rounded-full relative transition-all border-2 ${isActive ? (isDarkMode ? "bg-[#3ECFAA]/20 border-[#3ECFAA]" : "bg-[#7F6FF5] border-[#7F6FF5]") : isDarkMode ? "bg-transparent border-[#2E2B5A]" : "bg-gray-200 border-transparent"}`}
                          >
                            <motion.div
                              animate={{ x: isActive ? 20 : 2 }}
                              className={`absolute top-0.5 w-4 h-4 rounded-full shadow-sm ${isActive && isDarkMode ? "bg-[#3ECFAA]" : "bg-white"}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cost Calculator */}
<div className={`mt-6 p-5 rounded-2xl border flex items-center justify-between ${isDarkMode ? "bg-[#12102A]/50 border-[#2E2B5A]" : "bg-[#F5F4FF] border-[#DDD9FF]"}`}>
  <div>
    <p className={`text-[13px] font-bold ${theme.textP}`}>
      Estimated Monthly Cost
    </p>
    <p className={`text-[11px] ${theme.textM}`}>
      {activeModules.length} module{activeModules.length !== 1 ? "s" : ""} × $50/month
    </p>
  </div>
  <div className="text-right">
    <p className="text-[28px] font-bold" style={{ color: isDarkMode ? "#3ECFAA" : "#534AB7" }}>
      ${activeModules.length * 50}
    </p>
    <p className={`text-[10px] ${theme.textM}`}>/month</p>
  </div>
</div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} className="text-green-500" />
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: isDarkMode ? "#E2E0FF" : "#1E1B3A" }}
                  >
                    You're all set!
                  </h2>
                  <p className={`text-[12px] mt-1 ${theme.textM}`}>
                    Review your configuration below and click finish to complete
                    setup
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      label: "Teams",
                      value:
                        teams.length > 0
                          ? `${teams.length} Teams added`
                          : "No Teams added",
                    },
                    {
                      label: "Members",
                      value:
                        members.length > 0
                          ? `${members.length} members added`
                          : "No members added",
                    },
                    {
                      label: "Enabled Modules",
                      value:
                        activeModules.length > 0
                          ? `${activeModules.length} modules enabled`
                          : "No modules added",
                    },
                    {
                      label: "Subscription Plan",
                      value: selectedPlan || "Not selected",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`w-full p-6 rounded-2xl border text-left flex flex-col gap-2 ${isDarkMode ? "bg-[#12102A]/50" : "bg-[#F9FAFF]"} ${theme.border}`}
                    >
                      <p className={`text-[14px] font-bold ${theme.textP}`}>
                        {item.label}
                      </p>
                      <p className={`text-[11px] ${theme.textM}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div
                  className={`w-full p-4 rounded-xl text-center bg-[#DDEBFF] dark:bg-[#7F6FF522]`}
                >
                  <p className="text-[12px] font-bold text-[#1E1B3A] dark:text-[#E2E0FF]">
                    Ready to go!{" "}
                    <span className="font-normal">
                      Click "Finish Setup" below to complete your onboarding and
                      access your dashboard
                    </span>
                  </p>
                </div>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/login")}
                  className={`w-full py-4 rounded-xl text-white font-bold text-[14px] bg-gradient-to-r ${theme.btn} shadow-xl`}
                >
                  Finish Setup
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="w-full mt-10 flex justify-between items-center px-4 pb-10">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={`flex items-center gap-2 text-[13px] font-medium ${theme.textM} ${step === 1 && "invisible"}`}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-6">
            <span
              className={`text-[13px] cursor-pointer hover:underline ${theme.textM}`}
            >
              Skip for now
            </span>
            {step < 4 && (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                className={`flex items-center gap-2 px-10 py-3 rounded-xl text-white font-bold bg-gradient-to-r ${theme.btn} shadow-lg transition-transform`}
              >
                Continue <ChevronRight size={18} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
