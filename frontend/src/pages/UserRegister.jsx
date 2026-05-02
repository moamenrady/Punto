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

  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
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
    setSuccessMessage("");

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
        setSuccessMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
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
        onClick={() => navigate("/login")}
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
            Create Your Account
          </h1>
          <p className={`text-[13px] ${theme.textM}`}>
            Join our platform and start managing your workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border outline-none text-[13px] ${theme.input} ${theme.textP} ${errors.name ? "border-red-500" : theme.border} focus:ring-1`}
            />
            {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Work Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-xl border outline-none text-[13px] ${theme.input} ${theme.textP} ${errors.email ? "border-red-500" : theme.border} focus:ring-1`}
            />
            {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border outline-none text-[13px] ${theme.input} ${theme.textP} ${errors.password ? "border-red-500" : theme.border}`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className={`absolute right-3 top-3.5 ${theme.textM}`}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.password}</p>}
            </div>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm"
                value={formData.passwordConfirm}
                onChange={(e) =>
                  setFormData({ ...formData, passwordConfirm: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl border outline-none text-[13px] ${theme.input} ${theme.textP} ${errors.passwordConfirm ? "border-red-500" : theme.border}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className={`absolute right-3 top-3.5 ${theme.textM}`}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.passwordConfirm && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.passwordConfirm}</p>}
            </div>
          </div>

          {apiError && (
            <p className="bg-red-50 text-red-500 text-[11px] p-3 rounded-xl text-center">
              {apiError}
            </p>
          )}

          {successMessage && (
            <p className="bg-green-50 text-green-600 text-[12px] font-medium p-3 rounded-xl text-center shadow-sm border border-green-100">
              {successMessage}
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
