import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useInstructorAuth } from "./auth/AuthContext";
import instructorImage from "../assets/LoginImage.png";

const InstructorLogin = () => {
  const { login, verifyOtp } = useInstructorAuth();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!loginEmail || !loginPassword) {
      setError("Please enter email and password");
      return;
    }

    setError("");
    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);

    if (result.success) {
      setSessionId(result.sessionId);
      setShowOtpInput(true);
      setError("");
    } else {
      setError(result.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setError("");
    setLoading(true);
    const result = await verifyOtp(sessionId, otp);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f7] flex items-center justify-center px-4">
      <div className="relative w-[820px] max-w-full min-h-[500px] bg-white rounded-lg overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl flex">
        
        {/* Sign In Panel */}
        <div className="w-1/2 flex flex-col items-center justify-center px-14 py-8 z-20">
          <h1 className="text-3xl font-extrabold mb-6">Instructor Sign In</h1>

          {error && (
            <div className="text-red-500 text-xs mb-4 text-center w-full bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {!showOtpInput ? (
            <>
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-gray-100 px-4 py-3 mb-4 outline-none text-sm rounded border border-transparent focus:border-purple-500 transition"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                disabled={loading}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full bg-gray-100 px-4 py-3 mb-5 outline-none text-sm rounded border border-transparent focus:border-purple-500 transition"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                disabled={loading}
              />

              <Link to="/instructor/forgot-password" className="text-sm text-gray-600 hover:text-purple-600 font-semibold mb-5 transition">
                Forgot your password?
              </Link>

              <button
                onClick={handleSignIn}
                disabled={loading}
                className={`px-12 py-3 bg-[#7c3aed] text-white rounded-full text-xs font-bold uppercase transition hover:bg-[#6d28d9] ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending OTP..." : "Sign In"}
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col items-center">
              <p className="text-xs text-gray-500 text-center mb-4 leading-relaxed">
                A 6-digit OTP code has been sent to your email. Enter it below to verify:
              </p>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full bg-gray-100 px-4 py-3 mb-4 outline-none text-sm rounded text-center font-bold tracking-wider border border-transparent focus:border-purple-500 transition"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
              />

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowOtpInput(false);
                    setError("");
                    setOtp("");
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-full text-xs font-bold uppercase hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="flex-1 py-3 bg-green-600 text-white rounded-full text-xs font-bold uppercase hover:bg-green-700 transition"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Banner Section */}
        <div className="w-1/2 relative z-30">
          <img
            src={instructorImage}
            alt="Instructor"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default InstructorLogin;
