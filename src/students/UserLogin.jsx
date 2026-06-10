import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  // Sign In States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up States
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerMobile, setRegisterMobile] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerReferralCode, setRegisterReferralCode] = useState("");

  // Common UI States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError("Please enter email and password");
      return;
    }

    setError("");
    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (
      !registerName ||
      !registerEmail ||
      !registerMobile ||
      !registerPassword
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setError("");
    setLoading(true);
    const result = await register({
      fullName: registerName,
      username: "", // Backend will automatically generate a unique username from email
      email: registerEmail,
      mobileNumber: registerMobile,
      password: registerPassword,
      referralCode: registerReferralCode || null,
    });
    setLoading(false);

    if (result.success) {
      alert("Registration successful! Please sign in with your credentials.");
      setError("");
      // Reset registration form fields
      setRegisterName("");
      setRegisterEmail("");
      setRegisterMobile("");
      setRegisterPassword("");
      setRegisterReferralCode("");
      setIsSignUp(false); // Redirect to sign-in view
    } else {
      setError(result.message);
    }
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };

  return (
    <div className="min-h-screen bg-[#f6f5f7] flex items-center justify-center px-4 py-8">
      <div className="relative w-[820px] max-w-full min-h-[580px] bg-white rounded-lg overflow-hidden shadow-xl transition-all duration-200 hover:shadow-2xl flex flex-col justify-center">
        
        {/* Sign In */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-14 transition-all duration-700 ${
            isSignUp ? "translate-x-full opacity-0 z-10" : "z-20"
          }`}
        >
          <h1 className="text-3xl font-extrabold mb-4">Sign in</h1>

          <div className="flex gap-4 mb-4">
            <button
              onClick={handleGoogleLogin}
              className="px-6 h-11 border border-gray-300 rounded-full flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-red-500 transition duration-300 cursor-pointer"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-700">
                Continue with Google
              </span>
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-4">or use your account</p>
          
          {error && !isSignUp && (
            <div className="text-red-500 text-xs mb-3 text-center w-full bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="w-full bg-gray-100 px-4 py-3 mb-4 outline-none text-sm rounded border border-transparent focus:border-blue-500 transition"
            required
          />

          <div className="relative w-full mb-4">
            <input
              type={showLoginPassword ? "text" : "password"}
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 outline-none text-sm rounded border border-transparent focus:border-blue-500 transition pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <Link to="/ForgotPassword" className="text-sm text-gray-600 mb-4 hover:text-blue-600 transition">
            Forgot your password?
          </Link>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className={`px-12 py-3 bg-[#ff3b30] text-white rounded-full text-xs font-bold uppercase transition duration-300 hover:bg-[#e03126] cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>

        {/* Sign Up */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-14 transition-all duration-700 ${
            isSignUp ? "translate-x-full opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          <h1 className="text-3xl font-extrabold mb-4">Create Account</h1>

          <div className="flex gap-4 mb-4">
            <button
              onClick={handleGoogleLogin}
              className="px-6 h-11 border border-gray-300 rounded-full flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-red-500 transition duration-300 cursor-pointer"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-700">
                Continue with Google
              </span>
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-3">or use your email for registration</p>

          {error && isSignUp && (
            <div className="text-red-500 text-xs mb-3 text-center w-full bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="w-full flex flex-col gap-3 mb-4">
            <input
              type="text"
              placeholder="Full Name"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 outline-none text-sm rounded border border-transparent focus:border-blue-500 transition"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 outline-none text-sm rounded border border-transparent focus:border-blue-500 transition"
              required
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={registerMobile}
              onChange={(e) => setRegisterMobile(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 outline-none text-sm rounded border border-transparent focus:border-blue-500 transition"
              required
            />
            <div className="relative w-full">
              <input
                type={showRegisterPassword ? "text" : "password"}
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full bg-gray-100 px-4 py-3 outline-none text-sm rounded border border-transparent focus:border-blue-500 transition pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <input
              type="text"
              placeholder="Referral Code (Optional)"
              value={registerReferralCode}
              onChange={(e) => setRegisterReferralCode(e.target.value)}
              className="w-full bg-gray-100 px-4 py-3 outline-none text-sm rounded border border-transparent focus:border-blue-500 transition"
            />
          </div>

          <button
            onClick={handleSignUp}
            disabled={loading}
            className={`px-12 py-3 bg-[#ff3b30] text-white rounded-full text-xs font-bold uppercase transition duration-300 hover:bg-[#e03126] cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </div>

        {/* Overlay */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white flex items-center justify-center text-center px-12 transition-all duration-700 z-30 ${
            isSignUp ? "-translate-x-full" : ""
          }`}
        >
          {!isSignUp ? (
            <div>
              <h1 className="text-3xl font-extrabold mb-5">Hello, Friend!</h1>
              <p className="text-sm mb-8">
                Enter your details to create an account and start your learning journey with us.
              </p>
              <button
                onClick={() => {
                  setError("");
                  setIsSignUp(true);
                }}
                className="px-12 py-3 border border-white rounded-full text-xs font-bold uppercase cursor-pointer hover:bg-white/10 transition"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-extrabold mb-5">Welcome Back!</h1>
              <p className="text-sm mb-8">
                To keep connected with us please login with your account credentials.
              </p>
              <button
                onClick={() => {
                  setError("");
                  setIsSignUp(false);
                }}
                className="px-12 py-3 border border-white rounded-full text-xs font-bold uppercase cursor-pointer hover:bg-white/10 transition"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLogin;