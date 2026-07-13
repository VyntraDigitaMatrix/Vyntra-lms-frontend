import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../auth/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const [step, setStep] = useState("login"); // 'login' or 'otp'
  const { login, verifyOtp } = useAdminAuth();
  const navigate = useNavigate();

  // Step 1 States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 States
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");

  // Common UI States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setSessionId(result.sessionId);
      setStep("otp");
      setError("");
    } else {
      setError(result.message);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the 6-digit OTP code");
      return;
    }
    if (otp.length !== 6 || isNaN(otp)) {
      setError("OTP must be a 6-digit number");
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
    <div className="min-h-screen bg-[#f6f5f7] flex items-center justify-center px-4 py-8">
      <div className="relative w-[820px] max-w-full min-h-[500px] bg-white rounded-lg overflow-hidden shadow-xl transition-all duration-200 hover:shadow-2xl">

        {/* Left Side Info Panel */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-blue-600 text-white flex flex-col items-center justify-center text-center px-12">
          <div>
            <h1 className="text-3xl font-extrabold mb-5">Admin Portal</h1>
            <p className="text-sm mb-8 leading-relaxed">
              Vyntra LMS Admin Control Console. Manage your institution's operations, students, instructors, and system courses.
            </p>
          </div>
        </div>

        {/* Right Side Interaction Panel */}
        <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-14">

          {step === "login" ? (
            <form onSubmit={handleSubmitLogin} className="w-full flex flex-col items-center">
              <h1 className="text-3xl font-extrabold mb-6">Sign In</h1>

              {error && (
                <div className="text-red-500 text-xs mb-4 text-center w-full bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-100 px-4 py-3 mb-4 outline-none text-sm rounded border border-transparent focus:border-blue-600 transition"
                required
                disabled={loading}
              />

              <div className="relative w-full mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-100 px-4 py-3 outline-none text-sm rounded border border-transparent focus:border-blue-600 transition pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`px-12 py-3 bg-blue-600 text-white rounded-full text-xs font-bold uppercase transition duration-300 hover:bg-blue-700 cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? "Requesting OTP..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitOtp} className="w-full flex flex-col items-center">
              <h1 className="text-3xl font-extrabold mb-4">Verify OTP</h1>
              <p className="text-xs text-gray-500 text-center mb-6 leading-relaxed">
                A 6-digit one-time password has been sent to your registered email. Enter it below to authorize this session.
              </p>

              {error && (
                <div className="text-red-500 text-xs mb-4 text-center w-full bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-gray-100 px-4 py-3 mb-6 outline-none text-lg text-center tracking-[8px] font-bold rounded border border-transparent focus:border-blue-600 transition"
                required
                disabled={loading}
              />

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep("login");
                  }}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full text-xs font-bold uppercase hover:bg-gray-300 transition cursor-pointer"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 bg-blue-600 text-white rounded-full text-xs font-bold uppercase transition duration-300 hover:bg-blue-700 cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;