import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Building2, Globe, Briefcase, CheckCircle2, DollarSign } from "lucide-react";
import { DarkLogo, LightLogo } from "../components/logo";
import axios from "axios";

const AVAILABLE_FEATURES = [
  { id: "Project Management", icon: "📊" },
  { id: "Chat System", icon: "💬" },
  { id: "Ticketing System", icon: "🎫" },
  { id: "Stock Management", icon: "📦" },
];

const PRICE_PER_FEATURE = 50;

export default function CreateCompanyPage({ isDarkMode, theme, user, setUser }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    website: "",
  });

  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setTotalPrice(selectedFeatures.length * PRICE_PER_FEATURE);
  }, [selectedFeatures]);

  const toggleFeature = (featureId) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId) 
        : [...prev, featureId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return setApiError("Company name is required");
    if (selectedFeatures.length === 0) return setApiError("Please select at least one feature");
    
    setIsLoading(true);
    setApiError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/v1/companies",
        { ...formData, selectedFeatures },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.status === "success") {
        const updatedUser = { 
          ...user, 
          company_id: response.data.data.company._id,
          role: "manager"
        };
        setUser(updatedUser);
        navigate("/tickets");
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to create company");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-500 ${theme.bg}`}>
      <button
        onClick={() => navigate("/landing")}
        className={`fixed top-6 left-6 p-2.5 rounded-full border shadow-sm z-50 ${isDarkMode ? "bg-[#1E1B3A] border-[#2E2B5A]" : "bg-white border-[#DDD9FF]"}`}
      >
        <ArrowLeft size={20} style={{ color: theme.primary }} />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[600px]"
      >
        <div className="text-center mb-8">
          {isDarkMode ? <DarkLogo primary={theme.primary} accent={theme.accent} /> : <LightLogo />}
          <h1 className="text-3xl font-bold mt-6 mb-2" style={{ color: theme.primary }}>
            Configure Your Workspace
          </h1>
          <p className={`text-[13px] ${theme.textM}`}>
            Choose the features you need and launch your organization
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#1E1B3A] border-[#2E2B5A]" : "bg-white border-[#DDD9FF]"} shadow-sm space-y-4`}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-60">Company Details</h3>
            <div className="relative">
              <Building2 className={`absolute left-4 top-3.5 ${theme.textM}`} size={18} />
              <input
                type="text"
                placeholder="Company Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border outline-none text-[14px] ${theme.input} ${theme.textP} ${theme.border} focus:ring-1`}
                style={{ "--tw-ring-color": theme.primary }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Briefcase className={`absolute left-4 top-3.5 ${theme.textM}`} size={18} />
                <input
                  type="text"
                  placeholder="Industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border outline-none text-[14px] ${theme.input} ${theme.textP} ${theme.border} focus:ring-1`}
                />
              </div>
              <div className="relative">
                <Globe className={`absolute left-4 top-3.5 ${theme.textM}`} size={18} />
                <input
                  type="text"
                  placeholder="Website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border outline-none text-[14px] ${theme.input} ${theme.textP} ${theme.border} focus:ring-1`}
                />
              </div>
            </div>
          </div>

          {/* Features Selection Section */}
          <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#1E1B3A] border-[#2E2B5A]" : "bg-white border-[#DDD9FF]"} shadow-sm`}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-60">Select Features</h3>
            <div className="grid grid-cols-2 gap-4">
              {AVAILABLE_FEATURES.map((feature) => (
                <motion.div
                  key={feature.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleFeature(feature.id)}
                  className={`relative cursor-pointer p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                    selectedFeatures.includes(feature.id)
                      ? `border-[${theme.primary}] bg-opacity-10`
                      : `${theme.border} opacity-70`
                  }`}
                  style={{ 
                    borderColor: selectedFeatures.includes(feature.id) ? theme.primary : undefined,
                    backgroundColor: selectedFeatures.includes(feature.id) ? `${theme.primary}10` : undefined
                  }}
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className={`text-[13px] font-medium ${theme.textP}`}>{feature.id}</span>
                  {selectedFeatures.includes(feature.id) && (
                    <CheckCircle2 className="absolute top-2 right-2" size={16} style={{ color: theme.primary }} />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pricing & Submit Section */}
          <div className="flex items-center justify-between gap-4">
            <div className={`flex-1 p-4 rounded-2xl border ${isDarkMode ? "bg-[#1E1B3A] border-[#2E2B5A]" : "bg-white border-[#DDD9FF]"} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-green-500" />
                <span className={`text-lg font-extrabold ${theme.textP}`}>${totalPrice}</span>
                <span className={`text-[11px] ${theme.textM} font-medium`}>/ monthly</span>
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${isDarkMode ? "bg-purple-900/30 text-purple-300" : "bg-purple-50 text-purple-600"}`}>
                {selectedFeatures.length} Features
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex-[1.5] py-4 rounded-2xl text-white font-bold text-[15px] bg-gradient-to-r ${theme.btn} shadow-xl flex justify-center items-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50`}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Launch My Workspace"}
            </button>
          </div>

          {apiError && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-50 text-red-500 text-[12px] p-4 rounded-2xl text-center border border-red-100"
              >
                {apiError}
              </motion.div>
            </AnimatePresence>
          )}
        </form>

        <p className={`mt-8 text-center text-[10px] ${theme.textM} leading-relaxed uppercase tracking-widest font-bold`}>
          Secure Payment via Stripe • 30-Day Money Back Guarantee
        </p>
      </motion.div>
    </div>
  );
}
