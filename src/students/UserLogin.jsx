import React, { useState } from "react";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleSignIn = () => {
    if (!loginEmail || !loginPassword) {
      alert("Please enter email and password");
      return;
    }

    navigate("/student/dashboard");
  };
const handleGoogleLogin = () => {
  window.location.href =
    "https://accounts.google.com/signin";
};
  return (
    <div className="min-h-screen bg-[#f6f5f7] flex items-center justify-center px-4">
      <div className="relative w-[820px] max-w-full min-h-[500px] bg-white rounded-lg overflow-hidden shadow-xl transition-all duration-200 hover:shadow-2xl">
        
        {/* Sign In */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-14 transition-all duration-700 ${
            isSignUp ? "translate-x-full opacity-0 z-10" : "z-20"
          }`}
        >
          <h1 className="text-3xl font-extrabold mb-6">Sign in</h1>

        <div className="flex gap-4 mb-5">
  <button
  onClick={handleGoogleLogin}
  className="px-6 h-11 border border-gray-300 rounded-full flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-red-500 transition duration-300"
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

          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="w-full bg-gray-100 px-4 py-3 mb-4 outline-none text-sm"
          />

          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full bg-gray-100 px-4 py-3 mb-5 outline-none text-sm"
          />

          <a href="#" className="text-sm text-gray-600 mb-5">
            Forgot your password?
          </a>

          <button
            onClick={handleSignIn}
            className="px-12 py-3 bg-[#ff3b30] text-white rounded-full text-xs font-bold uppercase"
          >
            Sign In
          </button>
        </div>

        {/* Sign Up */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-14 transition-all duration-700 ${
            isSignUp ? "translate-x-full opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          <h1 className="text-3xl font-extrabold mb-6">Create Account</h1>

          <div className="flex gap-4 mb-5">
 <button
  onClick={handleGoogleLogin}
  className="px-6 h-11 border border-gray-300 rounded-full flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-red-500 transition duration-300"
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
          <p className="text-xs text-gray-500 mb-4">
            or use your email for registration
          </p>

          <input
            type="text"
            placeholder="Name"
            className="w-full bg-gray-100 px-4 py-3 mb-4 outline-none text-sm"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-gray-100 px-4 py-3 mb-4 outline-none text-sm"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-gray-100 px-4 py-3 mb-5 outline-none text-sm"
          />

          <button className="px-12 py-3 bg-[#ff3b30] text-white rounded-full text-xs font-bold uppercase">
            Sign Up
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
                Enter your personal details and start journey with us
              </p>
              <button
                onClick={() => setIsSignUp(true)}
                className="px-12 py-3 border border-white rounded-full text-xs font-bold uppercase"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-extrabold mb-5">Welcome Back!</h1>
              <p className="text-sm mb-8">
                To keep connected with us please login with your personal info
              </p>
              <button
                onClick={() => setIsSignUp(false)}
                className="px-12 py-3 border border-white rounded-full text-xs font-bold uppercase"
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