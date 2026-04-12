import React, { useState } from "react";
import {
  Eye,
  Cloud,
  Moon,
  Sun,
  Loader2,
  ArrowLeft,
  Mail,
  EyeOff,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { DarkLogo, LightLogo } from "../components/logo";

const LOGIN_URL = "http://localhost:5000/api/v1/users/login";
const FORGOT_URL = "http://localhost:5000/api/v1/users/forgetPassword";

export default function LoginPage({ isDarkMode, setIsDarkMode, theme }) {
  const [view, setView] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError("");
    try {
      const response = await axios.post(LOGIN_URL, formData);
      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        alert(`Welcome back!`);
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError("");
    setApiSuccess("");
    try {
      const response = await axios.post(FORGOT_URL, {
        email: formData.email.trim(),
      });
      if (response.data.status === "success") {
        setApiSuccess(response.data.message);
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Check your email and try again",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-500 ${theme.bg}`}
    >
      <AnimatePresence>
        {view === "forgot" && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => {
              setView("login");
              setApiError("");
              setApiSuccess("");
            }}
            className={`fixed top-8 left-8 p-3 rounded-full border transition-all shadow-sm z-50 ${isDarkMode ? "bg-[#1E1B3A] border-[#2E2B5A]" : "bg-white border-[#DDD9FF]"}`}
            style={{ color: theme.primary }}
          >
            <ArrowLeft size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-8 right-8 p-3 rounded-full border transition-all shadow-sm z-50 ${isDarkMode ? "bg-[#1E1B3A] border-[#2E2B5A]" : "bg-white border-[#DDD9FF]"}`}
      >
        {isDarkMode ? (
          <Sun size={20} className="text-[#E2E0FF]" />
        ) : (
          <Moon size={20} className="text-[#534AB7]" />
        )}
      </button>

      <div className="w-full max-w-[440px]">
        <AnimatePresence mode="wait">
          {view === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-center mb-10">
                {isDarkMode ? (
                  <DarkLogo primary={theme.primary} accent={theme.accent} />
                ) : (
                  <LightLogo />
                )}
                <h2
                  className="text-[32px] font-bold mb-2"
                  style={{ color: isDarkMode ? "#E2E0FF" : "#1E1B3A" }}
                >
                  Welcome{" "}
                  <span
                    className={
                      isDarkMode
                        ? "bg-gradient-to-r from-[#7F6FF5] to-[#3ECFAA] bg-clip-text text-transparent"
                        : ""
                    }
                    style={{ color: !isDarkMode ? "#534AB7" : "transparent" }}
                  >
                    back!
                  </span>
                </h2>
                <p className={`text-[14px] ${theme.textM}`}>
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-bold hover:underline"
                    style={{ color: theme.primary }}
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-5 py-3.5 rounded-xl border outline-none text-[14px] ${theme.input} ${theme.textP} ${theme.border} focus:ring-1`}
                  style={{ "--tw-ring-color": theme.primary }}
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={`w-full px-5 py-3.5 rounded-xl border outline-none text-[14px] ${theme.input} ${theme.textP} ${theme.border} focus:ring-1`}
                    style={{ "--tw-ring-color": theme.primary }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-4 ${theme.textM}`}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {apiError && (
                  <p className="text-red-500 text-[12px] text-center font-medium">
                    {apiError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 rounded-xl text-white font-bold text-[16px] bg-gradient-to-r shadow-lg ${theme.btn}`}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin mx-auto" size={24} />
                  ) : (
                    "Log In"
                  )}
                </button>
              </form>
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setView("forgot");
                    setApiError("");
                    setApiSuccess("");
                  }}
                  className="text-[14px] font-medium hover:underline"
                  style={{ color: theme.primary }}
                >
                  Forgot Password?
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-center mb-12">
                {isDarkMode ? (
                  <DarkLogo primary={theme.primary} accent={theme.accent} />
                ) : (
                  <LightLogo />
                )}
                <h2
                  className="text-[32px] font-bold mb-2 mt-4"
                  style={{ color: isDarkMode ? "#E2E0FF" : "#1E1B3A" }}
                >
                  Forgot{" "}
                  <span
                    className={
                      isDarkMode
                        ? "bg-gradient-to-r from-[#7F6FF5] to-[#3ECFAA] bg-clip-text text-transparent"
                        : ""
                    }
                    style={{ color: !isDarkMode ? "#534AB7" : "transparent" }}
                  >
                    Password?
                  </span>
                </h2>
                <p className={`text-[14px] ${theme.textM}`}>
                  Enter your email to reset your account
                </p>
              </div>

              <form onSubmit={handleForgot} className="space-y-8 mt-16">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter work email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full px-5 py-4 rounded-xl border outline-none text-[14px] ${theme.input} ${theme.textP} ${theme.border} focus:ring-1`}
                    style={{ "--tw-ring-color": theme.primary }}
                  />
                  <Mail
                    className={`absolute right-4 top-4.5 ${theme.textM}`}
                    size={20}
                  />
                </div>
                {apiError && (
                  <div className="bg-red-50 text-red-500 text-[12px] p-3 rounded-xl text-center border border-red-100">
                    {apiError}
                  </div>
                )}
                {apiSuccess && (
                  <div className="bg-green-50 text-green-600 text-[12px] p-4 rounded-xl text-center font-bold border border-green-100 shadow-sm">
                    {apiSuccess}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 rounded-xl text-white font-bold text-[16px] bg-gradient-to-r shadow-lg transition-all hover:scale-[1.01] ${theme.btn}`}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin mx-auto" size={24} />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-20 text-center">
          <a
            href="#"
            className={`text-[12px] ${theme.textM} transition-colors underline`}
          >
            Need help?
          </a>
        </div>
      </div>
    </div>
  );
}
