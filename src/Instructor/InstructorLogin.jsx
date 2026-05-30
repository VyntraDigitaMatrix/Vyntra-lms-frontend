import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";
import instructorImage from "../assets/LoginImage.png";

const InstructorLogin = () => {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleSignIn = () => {
    if (!loginEmail || !loginPassword) {
      alert("Please enter email and password");
      return;
    }

    const newOtp = "123456"; // Demo OTP

    setGeneratedOtp(newOtp);
    setShowOtpInput(true);
  };

  const verifyOtp = () => {
    if (otp !== generatedOtp) {
      alert("Invalid OTP");
      return;
    }

    sessionStorage.setItem(
      "instructorSession",
      JSON.stringify({
        email: loginEmail,
        isLoggedIn: true,
      })
    );

    navigate("/instructor/dashboard");
  };

  const handleSignUp = () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }
    navigate("/instructor/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f6f5f7] flex items-center justify-center px-4">
      <div className="relative w-[820px] max-w-full min-h-[500px] bg-white rounded-lg overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl">

        {/* Sign In Panel */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-14 transition-all duration-700 ${isSignUp ? "translate-x-full opacity-0 z-10" : "z-20"
            }`}
        >
          <h1 className="text-3xl font-extrabold mb-6">Instructor Sign In</h1>

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-gray-100 px-4 py-3 mb-4 outline-none text-sm"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-gray-100 px-4 py-3 mb-5 outline-none text-sm"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          {showOtpInput && (
            <div className="mt-4 w-full">
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full bg-gray-100 px-4 py-3 mb-3 outline-none text-sm"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                onClick={verifyOtp}
                className="w-full py-3 bg-green-600 text-white rounded-full text-xs font-bold uppercase mb-5"
              >
                Verify OTP
              </button>
            </div>
          )}

          <a href="#" className="text-sm text-gray-600 mb-5">
            Forgot your password?
          </a>

          <button
            onClick={handleSignIn}
            className="px-12 py-3 bg-[#7c3aed] text-white rounded-full text-xs font-bold uppercase"
          >
            Sign In
          </button>

        </div>

        {/* Sign Up Panel */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-14 transition-all duration-700 ${isSignUp ? "translate-x-full opacity-100 z-20" : "opacity-0 z-10"
            }`}
        >
          <h1 className="text-3xl font-extrabold mb-6">Create Account</h1>

          <div className="flex gap-4 mb-5">
            <button className="w-11 h-11 border rounded-full flex items-center justify-center">
              <FaFacebookF />
            </button>
            <button className="w-11 h-11 border rounded-full flex items-center justify-center">
              <FaGooglePlusG />
            </button>
            <button className="w-11 h-11 border rounded-full flex items-center justify-center">
              <FaLinkedinIn />
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            or use your email for registration
          </p>

          <input
            type="text"
            placeholder="Name"
            className="w-full bg-gray-100 px-4 py-3 mb-4 outline-none text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-gray-100 px-4 py-3 mb-4 outline-none text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-gray-100 px-4 py-3 mb-5 outline-none text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSignUp}
            className="px-12 py-3 bg-[#7c3aed] text-white border border-[#7c3aed] rounded-full text-xs font-bold uppercase"
          >
            Sign Up
          </button>
        </div>

        {/* Overlay */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full transition-all duration-700 z-30 ${isSignUp ? "-translate-x-full" : ""
            }`}
        >
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
