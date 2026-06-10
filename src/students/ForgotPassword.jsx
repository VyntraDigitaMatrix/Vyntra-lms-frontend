import React, { useState } from "react";
import { Link } from "react-router-dom";
import { studentAuth } from "./auth/api";

const ForgotPassword = () => {
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
      const res = await studentAuth.forgotPassword({ email });
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
    <div className="min-h-screen bg-[#f6f5f7] flex items-center justify-center px-4">
      <div className="w-[450px] max-w-full bg-white rounded-lg shadow-xl p-8 transition-all duration-200 hover:shadow-2xl">
        <h1 className="text-2xl font-extrabold mb-3 text-center">Forgot Password</h1>
        <p className="text-xs text-gray-500 text-center mb-6">
          Enter your registered email address below. We'll send you a link to reset your password.
        </p>

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
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 outline-none text-sm rounded border border-transparent focus:border-blue-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-[#ff3b30] text-white rounded-full text-xs font-bold uppercase transition duration-300 hover:bg-[#e03126] cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending link..." : "Send Reset Link"}
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

export default ForgotPassword;
