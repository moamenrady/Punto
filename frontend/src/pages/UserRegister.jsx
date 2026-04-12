import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Sun, Moon, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { DarkLogo, LightLogo } from "../components/logo";
import axios from "axios";

export default function UserRegister({ isDarkMode, setIsDarkMode, theme }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    teamId: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let e = {};
    if (!formData.name.trim()) e.name = "Required";
    if (!formData.email.trim()) e.email = "Required";
    if (!formData.password) e.password = "Required";
    if (formData.password !== formData.passwordConfirm)
      e.passwordConfirm = "Not matching";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setApiError("");

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.passwordConfirm,
      };

      const response = await axios.post(
        "http://localhost:5000/api/v1/users/signup",
        payload,
      );

      if (response.data.status === "success") {
        alert("Account Created Successfully!");
        navigate("/login");
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Connection Error (Check CORS)",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-500 ${theme.bg}`}
    >
      <button
        onClick={() => navigate("/signup")}
        className={`fixed top-6 left-6 p-2.5 rounded-full border shadow-sm z-50 ${isDarkMode ? "bg-[#1E1B3A] border-[#2E2B5A]" : "bg-white border-[#DDD9FF]"}`}
      >
        <ArrowLeft size={20} style={{ color: theme.primary }} />
      </button>

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

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px]"
      >
        <div className="text-center mb-10">
          {isDarkMode ? (
            <DarkLogo primary={theme.primary} accent={theme.accent} />
          ) : (
            <LightLogo />
          )}
          <h1 className="text-3xl font-bold mb-2 mt-4 text-[#534AB7]">
            Join Your Team
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border outline-none text-[13px] ${theme.input} ${theme.textP} ${theme.border} focus:ring-1`}
          />

          <input
            type="email"
            placeholder="Work Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-xl border outline-none text-[13px] ${theme.input} ${theme.textP} ${theme.border} focus:ring-1`}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border outline-none text-[13px] ${theme.input} ${theme.textP} ${theme.border}`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className={`absolute right-3 top-3.5 ${theme.textM}`}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm"
                value={formData.passwordConfirm}
                onChange={(e) =>
                  setFormData({ ...formData, passwordConfirm: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border outline-none text-[13px] ${theme.input} ${theme.textP} ${theme.border}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className={`absolute right-3 top-3.5 ${theme.textM}`}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Team ID"
            value={formData.teamId}
            onChange={(e) =>
              setFormData({ ...formData, teamId: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-xl border outline-none text-[13px] ${theme.input} ${theme.textP} ${theme.border}`}
          />

          {apiError && (
            <p className="bg-red-50 text-red-500 text-[11px] p-3 rounded-xl text-center">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl text-white font-bold text-[14px] bg-gradient-to-r ${theme.btn} shadow-lg flex justify-center`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className={`text-[13px] ${theme.textM}`}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold hover:underline"
              style={{ color: theme.primary }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
