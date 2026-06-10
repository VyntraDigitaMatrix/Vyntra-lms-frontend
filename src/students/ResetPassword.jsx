import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { studentAuth } from "./auth/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid or missing password reset link.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await studentAuth.resetPassword({
        token,
        newPassword,
        confirmPassword,
      });
      setLoading(false);
      if (res.data && res.data.message) {
        setMessage(res.data.message);
      } else {
        setMessage("Password reset successfully!");
      }
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f7] flex items-center justify-center px-4">
      <div className="w-[450px] max-w-full bg-white rounded-lg shadow-xl p-8 transition-all duration-200 hover:shadow-2xl">
        <h1 className="text-2xl font-extrabold mb-3 text-center">Reset Password</h1>
        <p className="text-xs text-gray-500 text-center mb-6">
          Please enter and confirm your new password below.
        </p>

        {!token && (
          <div className="text-red-500 text-xs mb-4 text-center w-full bg-red-50 p-2 rounded">
            Invalid or missing password reset link. Please request a new one.
          </div>
        )}

        {error && (
          <div className="text-red-500 text-xs mb-4 text-center w-full bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="text-green-600 text-xs mb-4 text-center w-full bg-green-50 p-2 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 outline-none text-sm rounded border border-transparent focus:border-blue-500 transition"
              required
              disabled={!token}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 outline-none text-sm rounded border border-transparent focus:border-blue-500 transition"
              required
              disabled={!token}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className={`w-full py-3 bg-[#ff3b30] text-white rounded-full text-xs font-bold uppercase transition duration-300 hover:bg-[#e03126] cursor-pointer ${
              loading || !token ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/UserLogin" className="text-xs text-gray-600 hover:text-blue-600 font-semibold transition">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
