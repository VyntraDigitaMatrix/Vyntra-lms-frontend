import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../students/auth/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  MdEmail, MdLock, MdPerson, MdPhone,
  MdSchool, MdWork, MdRocketLaunch,
} from "react-icons/md";
import logo from "../assets/logo-plain.jpg";
import logoImage from "../assets/logo-image2.jpg";

const FEATURES = [
  { Icon: MdSchool, title: "Expert-Led Courses", desc: "Learn from industry experts with hands-on courses.", color: "bg-blue-50 text-[#043573]" },
  { Icon: MdWork, title: "Real-World Projects", desc: "Build projects that showcase your skills.", color: "bg-indigo-50 text-indigo-600" },
  { Icon: MdRocketLaunch, title: "Career Advancement", desc: "Get hired faster with our career resources.", color: "bg-blue-50 text-blue-700" },
];

/* ── Reusable input ──────────────────────────────────── */
function Field({ icon: Icon, type = "text", placeholder, value, onChange, right, maxLength }) {
  return (
    <div className="relative w-full">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
        <Icon />
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white placeholder-gray-400"
      />
      {right && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">{right}</span>
      )}
    </div>
  );
}

/* ── Left branding panel ─────────────────────────────── */
/* ── Left branding panel ─────────────────────────────── */
function BrandPanel({ isSignUp }) {
  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50 flex flex-col px-8 lg:px-10 py-6 lg:py-8 relative overflow-hidden select-none h-full">
      {/* Decorative circles */}
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-200/30" />
      <div className="absolute top-20 right-0 w-40 h-40 rounded-full bg-indigo-200/20" />
      <div className="absolute bottom-40 left-10 w-24 h-24 rounded-full bg-amber-200/20" />

      {/* Logo */}
      <div className="mb-2 relative z-10">
        <img src={logo} alt="VYNTRA ONE" className="h-10 lg:h-12 object-contain" />
      </div>

      {/* Badge */}
      <div className="relative z-10 mb-2 lg:mb-3">
        <span className="inline-flex items-center gap-2 px-3 lg:px-4 py-1 lg:py-1.5 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full text-xs font-semibold text-[#043573] shadow-sm">
          {isSignUp ? "🚀 Create Account!" : "👋 Welcome Back!"}
        </span>
      </div>

      {/* Headline */}
      <div className="relative z-10 mb-3 lg:mb-4">
        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
          {isSignUp ? "Start Your" : "Continue Your"}
          <br />
          <span className="text-[#043573]">Learning</span>{" "}
          <span className="text-amber-500">Journey</span>
        </h2>
        <p className="text-xs lg:text-sm text-gray-500 mt-2 lg:mt-3 leading-relaxed max-w-xs">
          {isSignUp
            ? "Create your account and join thousands of learners achieving their goals."
            : "Sign in to access your personalized dashboard, continue learning, and achieve your goals."}
        </p>
      </div>

      {/* Feature list - hidden on mobile, shown on desktop */}
      <div className="hidden lg:flex relative z-10 flex-col gap-3 mb-6">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex items-start gap-3 p-2 rounded-xl transition">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
              <f.Icon className="text-xl text-[#043573]" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{f.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Illustration - Increased gap with more top padding */}
      <div className="relative flex-1 min-h-[120px] lg:min-h-[150px] mt-4 lg:mt-6 hidden md:block">
        {/* Decorative dots grid - top right */}
        <div className="absolute top-0 lg:top-2 right-4 lg:right-8 grid grid-cols-3 lg:grid-cols-4 gap-1.5 lg:gap-2 z-20">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-amber-400/60"
            />
          ))}
        </div>

        {/* Decorative circles behind image - adjusted positioning */}
        <div className="absolute -right-10 -bottom-10 w-40 lg:w-48 h-40 lg:h-48 rounded-full bg-blue-200/40 z-0" />
        <div className="absolute left-10 lg:left-16 top-5 lg:top-8 w-20 lg:w-28 h-20 lg:h-28 rounded-full bg-indigo-200/30 z-0" />

        {/* Image - positioned with more bottom padding for extra gap */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 w-[65%] lg:w-[50%] max-w-[250px] lg:max-w-[320px] z-10 pb-2">
          <img
            src={logoImage}
            alt="Learning Illustration"
            className="w-full h-auto object-contain drop-shadow-lg"
          />
        </div>

        {/* Bottom gradient fade for better integration */}
        <div className="absolute bottom-0 left-0 right-0 h-12 lg:h-16 bg-gradient-to-t from-blue-50/80 to-transparent z-5" />
      </div>

      {/* Footer - hidden on mobile */}
      <p className="hidden lg:block relative z-10 text-[11px] text-gray-400 mt-3">
        © 2024 VYNTRA ONE. All rights reserved.
      </p>
    </div>
  );
}
/* ── Shared UI pieces ────────────────────────────────── */
function OrDivider() {
  return (
    <div className="flex items-center gap-3 w-full my-3 lg:my-4">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-[10px] lg:text-xs text-gray-400 whitespace-nowrap">or continue with</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function GoogleBtn({ googleLoaded }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!window.google || !googleLoaded) return;

    try {
      window.google.accounts.id.renderButton(
        containerRef.current,
        {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: containerRef.current?.offsetWidth || 350,
        }
      );
    } catch (err) {
      console.error("Failed to render Google button:", err);
    }
  }, [googleLoaded]);

  return (
    <div className="relative w-full overflow-hidden h-[42px] lg:h-[46px]">
      {/* Our premium custom button */}
      <button type="button"
        className="w-full h-full flex items-center justify-center gap-2 lg:gap-3 py-2.5 lg:py-3 border border-gray-200 rounded-lg text-xs lg:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 bg-white transition pointer-events-none">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-4 h-4 lg:w-5 lg:h-5" />
        <span className="hidden xs:inline">Continue with Google</span>
      </button>

      {/* Invisible overlay containing the official Google button */}
      <div
        ref={containerRef}
        className="google-signin-overlay absolute inset-0 opacity-0 cursor-pointer z-10"
      />
    </div>
  );
}

function PrimaryBtn({ onClick, disabled, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full py-3 lg:py-3 bg-[#043573]/80 hover:bg-[#043573] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs lg:text-sm font-bold rounded-lg transition shadow-sm shadow-blue-200 flex items-center justify-center gap-2">
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
const UserLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    const handleCredentialResponse = async (response) => {
      setError("");
      setLoading(true);
      const result = await googleLogin(response.credential);
      setLoading(false);
      if (!result.success) {
        setError(result.message);
      }
    };

    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "256766214617-fh3iv47c8c2guocmftnuekvlne6agljd.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });
        setGoogleLoaded(true);
      }
    };

    const scriptId = "google-jssdk";
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    } else {
      initializeGoogle();
    }
  }, [googleLogin]);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [showConfPwd, setShowConfPwd] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchTo = (signup) => { setError(""); setIsSignUp(signup); };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!loginEmail) { setError("Please enter your email"); return; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      setError("Invalid email");
      return;
    }

    if (!loginPassword) { setError("Please enter your password"); return; }

    const specialCharRegex = /[@$!%*?&]/;
    if (!specialCharRegex.test(loginPassword)) {
      setError("Invalid password");
      return;
    }

    setError(""); setLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);
    if (!result.success) setError(result.message);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regPassword) { setError("Please fill in all required fields"); return; }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(regPhone)) {
      setError("Invalid mobile number. It must be 10 digits.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      setError("Invalid email");
      return;
    }

    const specialCharRegex = /[@$!%*?&]/;
    if (!specialCharRegex.test(regPassword)) {
      setError("Invalid password");
      return;
    }

    if (regPassword !== regConfirm) { setError("Passwords do not match"); return; }
    if (!agreeTerms) { setError("Please agree to the Terms of Service"); return; }

    setError(""); setLoading(true);
    const username = regEmail.split('@')[0];
    const result = await register({
      fullName: regName,
      email: regEmail,
      username: username,
      password: regPassword,
      mobileNumber: regPhone
    });
    setLoading(false);
    if (result.success) {
      alert("Registration successful! Please sign in.");
      setRegName(""); setRegEmail(""); setRegPhone(""); setRegPassword(""); setRegConfirm(""); setAgreeTerms(false);
      switchTo(false);
    } else { setError(result.message); }
  };

  const EyeToggle = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle} className="text-gray-400 hover:text-gray-600 transition flex items-center justify-center p-1 focus:outline-none focus:ring-2 focus:ring-blue-100 rounded">
      {show ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
    </button>
  );

  return (
    <div className="w-full min-h-screen bg-[#F7F9FC] font-sans overflow-y-auto lg:overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .xs\\:inline { @media (min-width: 400px) { display: inline; } }
        .xs\\:hidden { @media (max-width: 399px) { display: none; } }
        .google-signin-overlay iframe {
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>

      {/* ══ DESKTOP ══ */}
      <div className="hidden lg:flex w-full h-screen bg-white overflow-hidden shadow-2xl">

        {/* Left - Brand Panel with Image Settled */}
        <div className="w-1/2 h-full">
          <BrandPanel isSignUp={isSignUp} />
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 flex-shrink-0" />

        {/* Right - Form */}
        <div className="w-1/2 bg-white overflow-y-auto h-screen">
          <div className="min-h-full flex justify-center pt-10 pb-10 px-8 xl:px-12">

            {/* ── SIGN IN ── */}
            {!isSignUp && (
              <div className="w-full max-w-sm mx-auto">
                <h1 className="text-2xl lg:text-3xl font-black text-gray-900 mb-1">Sign In</h1>
                <p className="text-sm text-gray-400 mb-6 lg:mb-7">Enter your credentials to access your account</p>

                {error && (
                  <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">{error}</div>
                )}

                <div className="flex flex-col gap-4 mb-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Email Address</label>
                    <Field icon={MdEmail} type="email" placeholder="Enter your email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Password</label>
                    <Field icon={MdLock} type={showLoginPwd ? "text" : "password"} placeholder="Enter your password"
                      value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                      right={<EyeToggle show={showLoginPwd} onToggle={() => setShowLoginPwd(v => !v)} />} />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6 lg:mb-7 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-gray-300 accent-[#043573]" />
                    <span className="text-xs text-gray-600">Remember me</span>
                  </label>
                  <Link to="/ForgotPassword" className="text-xs font-semibold text-[#043573] hover:text-[#043573] transition">Forgot Password?</Link>
                </div>

                <PrimaryBtn onClick={handleSignIn} disabled={loading}>
                  {loading ? "Signing In…" : "Sign In"}
                </PrimaryBtn>

                <OrDivider />
                <GoogleBtn googleLoaded={googleLoaded} />

                <p className="text-center text-xs text-gray-500 mt-5 lg:mt-6">
                  Don't have an account?{" "}
                  <button onClick={() => switchTo(true)} className="text-[#043573] font-bold hover:underline">Sign Up</button>
                </p>
                <div className="flex justify-center gap-4 lg:gap-6 mt-4 lg:mt-5">
                  <Link to="/privacy" className="text-[10px] lg:text-[11px] text-gray-400 hover:text-gray-600 transition">Privacy Policy</Link>
                  <Link to="/terms" className="text-[10px] lg:text-[11px] text-gray-400 hover:text-gray-600 transition">Terms of Service</Link>
                </div>
              </div>
            )}

            {/* ── SIGN UP ── */}
            {isSignUp && (
              <div className="w-full max-w-sm mx-auto">
                <h1 className="text-3xl lg:text-2xl font-black text-gray-900 mb-1">Create Account</h1>
                <p className="text-sm text-gray-400 mb-5 lg:mb-3">Fill in the details to create your account</p>

                {error && (
                  <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">{error}</div>
                )}

                <div className="flex flex-col gap-2.5 lg:gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
                    <Field icon={MdPerson} placeholder="Enter your full name" value={regName} onChange={e => setRegName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address</label>
                    <Field icon={MdEmail} type="email" placeholder="Enter your email" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Phone Number</label>
                    <Field icon={MdPhone} type="tel" placeholder="Enter your phone number" value={regPhone} onChange={e => setRegPhone(e.target.value.replace(/\D/g, ''))} maxLength={10} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Password</label>
                    <Field icon={MdLock} type={showRegPwd ? "text" : "password"} placeholder="Create a password"
                      value={regPassword} onChange={e => setRegPassword(e.target.value)}
                      right={<EyeToggle show={showRegPwd} onToggle={() => setShowRegPwd(v => !v)} />} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Confirm Password</label>
                    <Field icon={MdLock} type={showConfPwd ? "text" : "password"} placeholder="Confirm your password"
                      value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                      right={<EyeToggle show={showConfPwd} onToggle={() => setShowConfPwd(v => !v)} />} />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer mt-3 lg:mt-3 mb-4 lg:mb-5">
                  <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-[#043573] flex-shrink-0" />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <Link to="/terms" className="text-[#043573] font-semibold hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-[#043573] font-semibold hover:underline">Privacy Policy</Link>
                  </span>
                </label>

                <PrimaryBtn onClick={handleSignUp} disabled={loading}>
                  {loading ? "Creating Account…" : "Create Account"}
                </PrimaryBtn>

                <OrDivider />
                <GoogleBtn googleLoaded={googleLoaded} />

                <p className="text-center text-xs text-gray-500 mt-5 lg:mt-6">
                  Already have an account?{" "}
                  <button onClick={() => switchTo(false)} className="text-[#043573] font-bold hover:underline">Sign In</button>
                </p>
                <div className="flex justify-center gap-4 lg:gap-6 mt-4 lg:mt-5">
                  <Link to="/privacy" className="text-[10px] lg:text-[11px] text-gray-400 hover:text-gray-600 transition">Privacy Policy</Link>
                  <Link to="/terms" className="text-[10px] lg:text-[11px] text-gray-400 hover:text-gray-600 transition">Terms of Service</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ MOBILE ══ */}
      <div className="lg:hidden w-full min-h-screen bg-white flex flex-col">
        {/* Mobile Header with Logo */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
          <img src={logo} alt="VYNTRA ONE" className="h-8 object-contain" />

        </div>

        {/* Mobile Tabs */}
        <div className="flex border-b border-gray-100">
          {["Sign In", "Sign Up"].map((label, i) => {
            const active = i === 0 ? !isSignUp : isSignUp;
            return (
              <button key={label} onClick={() => switchTo(i === 1)}
                className={`flex-1 py-3.5 text-sm font-bold transition border-b-2 ${active ? "border-[#043573] text-[#043573]" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 px-5 py-5 overflow-y-auto">
          {/* Mobile Welcome Section */}
          <div className="mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-[#043573] mb-3">
              {isSignUp ? "🚀 Create Account!" : "👋 Welcome Back!"}
            </span>
            <h2 className="text-xl font-black text-gray-900 mb-1">
              {isSignUp ? "Start Your" : "Continue Your"}{" "}
              <span className="text-[#043573]">Learning</span>{" "}
              <span className="text-amber-500">Journey</span>
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              {isSignUp ? "Create your account and join thousands of learners." : "Sign in to access your personalized dashboard."}
            </p>
          </div>

          {/* Mobile Image - HIDDEN ON MOBILE (removed) */}

          {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">{error}</div>}

          {!isSignUp ? (
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Email Address</label>
                <Field icon={MdEmail} type="email" placeholder="Enter your email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Password</label>
                <Field icon={MdLock} type={showLoginPwd ? "text" : "password"} placeholder="Enter your password"
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  right={<button type="button" onClick={() => setShowLoginPwd(v => !v)} className="text-gray-400 hover:text-gray-600 transition">{showLoginPwd ? <FaEyeSlash /> : <FaEye />}</button>} />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-gray-300 accent-[#043573]" />
                  <span className="text-xs text-gray-600">Remember me</span>
                </label>
                <Link to="/ForgotPassword" className="text-xs font-semibold text-[#043573]">Forgot Password?</Link>
              </div>
              <PrimaryBtn onClick={handleSignIn} disabled={loading}>{loading ? "Signing In…" : "Sign In"}</PrimaryBtn>
              <OrDivider />
              <GoogleBtn googleLoaded={googleLoaded} />
              <p className="text-center text-xs text-gray-500">Don't have an account? <button onClick={() => switchTo(true)} className="text-[#043573] font-bold">Sign Up</button></p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Full Name</label>
                <Field icon={MdPerson} placeholder="Enter your full name" value={regName} onChange={e => setRegName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Email Address</label>
                <Field icon={MdEmail} type="email" placeholder="Enter your email" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Phone Number</label>
                <Field icon={MdPhone} type="tel" placeholder="Enter your phone number" value={regPhone} onChange={e => setRegPhone(e.target.value.replace(/\D/g, ''))} maxLength={10} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Password</label>
                <Field icon={MdLock} type={showRegPwd ? "text" : "password"} placeholder="Create a password"
                  value={regPassword} onChange={e => setRegPassword(e.target.value)}
                  right={<button type="button" onClick={() => setShowRegPwd(v => !v)} className="text-gray-400 hover:text-gray-600 transition">{showRegPwd ? <FaEyeSlash /> : <FaEye />}</button>} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Confirm Password</label>
                <Field icon={MdLock} type={showConfPwd ? "text" : "password"} placeholder="Confirm your password"
                  value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                  right={<button type="button" onClick={() => setShowConfPwd(v => !v)} className="text-gray-400 hover:text-gray-600 transition">{showConfPwd ? <FaEyeSlash /> : <FaEye />}</button>} />
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-[#043573] flex-shrink-0" />
                <span className="text-xs text-gray-600 leading-relaxed">I agree to the <Link to="/terms" className="text-[#043573] font-semibold">Terms of Service</Link> and <Link to="/privacy" className="text-[#043573] font-semibold">Privacy Policy</Link></span>
              </label>
              <PrimaryBtn onClick={handleSignUp} disabled={loading}>{loading ? "Creating Account…" : "Create Account"}</PrimaryBtn>
              <OrDivider />
              <GoogleBtn googleLoaded={googleLoaded} />
              <p className="text-center text-xs text-gray-500">Already have an account? <button onClick={() => switchTo(false)} className="text-[#043573] font-bold">Sign In</button></p>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-gray-100">
            <Link to="/privacy" className="text-[10px] text-gray-400 hover:text-gray-600 transition">Privacy Policy</Link>
            <Link to="/terms" className="text-[10px] text-gray-400 hover:text-gray-600 transition">Terms of Service</Link>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-3">© 2024 VYNTRA ONE. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;