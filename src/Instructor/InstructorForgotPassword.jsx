import React, { useState } from "react";
import { Link } from "react-router-dom";
import { instructorAuth } from "./auth/api";
import logo from "../assets/logo-plain.jpg";
import { MdEmail, MdLockReset } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";

const InstructorForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await instructorAuth.forgotPassword({ email });
      setLoading(false);
      if (res.data && res.data.message) {
        setMessage(res.data.message);
      } else {
        setMessage("Password reset link sent successfully!");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center px-4 py-10">
      <div className="mb-6">
        <img src={logo} alt="VYNTRA ONE" className="h-9 object-contain" />
      </div>

      <div className="w-[440px] max-w-full bg-white rounded-2xl shadow-xl border border-slate-200/70 p-7 sm:p-9">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#043573] flex items-center justify-center text-xl font-bold mb-4">
          <MdLockReset />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1.5">Forgot Password?</h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          Enter your registered instructor email address below and we'll send you a link to reset your password.
        </p>

        {error && (
          <div className="text-red-600 text-xs mb-4 text-center w-full bg-red-50 border border-red-200 p-2.5 rounded-xl font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="text-emerald-700 text-xs mb-4 text-center w-full bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
            <div className="relative w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                <MdEmail />
              </span>
              <input
                type="email"
                placeholder="instructor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 outline-none text-sm rounded-xl border border-slate-200 focus:border-[#043573] focus:ring-2 focus:ring-blue-100 transition placeholder-slate-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-[#043573] text-white rounded-xl text-sm font-bold transition shadow-sm shadow-blue-200 hover:bg-blue-900 cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending link..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/InstructorLogin"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#043573] font-semibold transition"
          >
            <FaArrowLeft size={10} />
            Back to Sign In
          </Link>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mt-6">© 2026 VYNTRA ONE. All rights reserved.</p>
    </div>
  );
};

export default InstructorForgotPassword;
