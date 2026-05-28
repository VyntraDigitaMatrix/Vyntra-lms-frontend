import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";
const AdminLogin = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSignUp = () => {
  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

 navigate("/admin/dashboard");
};
  return (
    <div className="min-h-screen bg-[#f6f5f7] flex items-center justify-center px-4">
      <div className="relative w-[820px] max-w-full min-h-[500px] bg-white rounded-lg overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl">
        
        {/* Welcome Left Side */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-blue-600 text-white flex items-center justify-center text-center px-12">
          <div>
            <h1 className="text-3xl font-extrabold mb-5">Welcome Back!</h1>
            <p className="text-sm mb-8">
              To keep connected with us please login with your personal info
            </p>
            <button className="px-12 py-3 border border-white rounded-full text-xs font-bold uppercase">
              Sign In
            </button>
          </div>
        </div>

        {/* Create Account Right Side */}
        <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-14">
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
  className="px-12 py-3 bg-blue-600 text-white border border-[#7c3aed] rounded-full text-xs font-bold uppercase"
>
  Sign Up
</button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;