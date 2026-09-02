import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useInstructorAuth } from "./auth/AuthContext";
import logo from "../assets/logo-plain.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  MdEmail, MdLock, MdShield, MdOutlineSchool,
  MdOutlineInsights, MdOutlineVideocam,
} from "react-icons/md";

const FEATURES = [
  { Icon: MdOutlineSchool, title: "Manage Your Courses", desc: "Build, publish and update course content with ease.", color: "bg-blue-50 text-[#043573]" },
  { Icon: MdOutlineVideocam, title: "Host Live Classes", desc: "Run live sessions and connect with students in real time.", color: "bg-emerald-50 text-emerald-600" },
  { Icon: MdOutlineInsights, title: "Track Performance", desc: "Monitor enrollments, revenue and engagement at a glance.", color: "bg-amber-50 text-amber-600" },
];

/* ── Reusable input ──────────────────────────────────── */
function Field({ icon: Icon, type = "text", placeholder, value, onChange, right, maxLength, center, disabled }) {
  return (
    <div className="relative w-full">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
        <Icon />
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        disabled={disabled}
        className={`w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#043573] focus:ring-2 focus:ring-blue-100 transition bg-slate-50/50 placeholder-slate-400 disabled:opacity-60 ${
          center ? "text-center font-bold tracking-widest" : ""
        }`}
      />
      {right && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">{right}</span>
      )}
    </div>
  );
}

function PrimaryBtn({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 bg-[#043573] hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition shadow-sm shadow-blue-200 flex items-center justify-center gap-2"
    >
      {children}
    </button>
  );
}

/* ── Left branding panel ─────────────────────────────── */
function BrandPanel() {
  return (
    <div className="flex-1 bg-gradient-to-br from-[#043573] to-blue-900 flex flex-col justify-between px-8 lg:px-10 py-6 lg:py-8 relative overflow-hidden select-none h-full text-white">
      {/* Decorative circles */}
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
      <div className="absolute top-20 right-0 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute bottom-40 left-10 w-24 h-24 rounded-full bg-amber-400/10" />

      <div>
        {/* Logo */}
        <div className="mb-4 relative z-10">
          <div className="inline-block bg-white rounded-xl px-3 py-2 shadow-sm">
            <img src={logo} alt="VYNTRA ONE" className="h-7 lg:h-8 object-contain" />
          </div>
        </div>

        {/* Badge */}
        <div className="relative z-10 mb-3 lg:mb-4">
          <span className="inline-flex items-center gap-2 px-3 lg:px-4 py-1 lg:py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs font-semibold text-white shadow-sm">
            🎓 Instructor Portal
          </span>
        </div>

        {/* Headline */}
        <div className="relative z-10 mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-black leading-tight">
            Empower Your
            <br />
            <span className="text-amber-400">Teaching</span> Journey
          </h2>
          <p className="text-xs lg:text-sm text-blue-100/80 mt-2 lg:mt-3 leading-relaxed max-w-xs">
            Sign in to manage your courses, mentor students, and grow your impact on Vyntra One.
          </p>
        </div>

        {/* Feature list - hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex relative z-10 flex-col gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3 p-2.5 rounded-xl transition bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/10">
                <f.Icon className="text-xl text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{f.title}</p>
                <p className="text-xs text-blue-100/70 mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer - hidden on mobile */}
      <p className="hidden lg:block relative z-10 text-[11px] text-blue-100/60 mt-6">
        © 2026 VYNTRA ONE. All rights reserved.
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
const InstructorLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, verifyOtp } = useInstructorAuth();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e?.preventDefault();
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

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
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

  const renderFormPanel = (mobile) => (
    <div className={mobile ? "" : "w-full max-w-sm mx-auto"}>
      {!showOtpInput ? (
        <>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-1">Instructor Sign In</h1>
          <p className="text-sm text-slate-400 mb-6 lg:mb-7">Enter your credentials to access your dashboard</p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">{error}</div>
          )}

          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Email Address</label>
              <Field icon={MdEmail} type="email" placeholder="Enter your email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} disabled={loading} />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Password</label>
              <Field
                icon={MdLock}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                disabled={loading}
                right={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-slate-400 hover:text-[#043573] transition flex items-center justify-center p-1 focus:outline-none rounded"
                  >
                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                }
              />
            </div>

            <div className="flex justify-end -mt-1">
              <Link to="/instructor/forgot-password" className="text-xs font-semibold text-[#043573] hover:underline transition">
                Forgot your password?
              </Link>
            </div>

            <PrimaryBtn onClick={handleSignIn} disabled={loading}>
              {loading ? "Sending OTP…" : "Sign In"}
            </PrimaryBtn>
          </form>

          <p className="text-center text-[11px] text-slate-400 mt-6">
            © 2026 VYNTRA ONE. All rights reserved.
          </p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#043573] flex items-center justify-center text-lg shrink-0 font-bold">
              <MdShield />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Verify OTP</h1>
              <p className="text-xs text-slate-400">Security check</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mt-4 mb-5">
            A 6-digit OTP code has been sent to <span className="font-semibold text-slate-700">{loginEmail}</span>. Enter it below to verify your identity.
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">{error}</div>
          )}

          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <Field
              icon={MdShield}
              type="text"
              placeholder="••••••"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              center
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowOtpInput(false);
                  setError("");
                  setOtp("");
                }}
                disabled={loading}
                className="flex-1 py-3 bg-slate-100 text-[#043573] rounded-xl text-sm font-bold hover:bg-slate-200 transition disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-[#043573] hover:bg-blue-900 text-white rounded-xl text-sm font-bold transition disabled:opacity-50 shadow-sm shadow-blue-200"
              >
                {loading ? "Verifying…" : "Verify OTP"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#F7F9FC] font-sans overflow-y-auto lg:overflow-hidden">
      {/* ══ DESKTOP ══ */}
      <div className="hidden lg:flex w-full h-screen bg-white overflow-hidden">
        {/* Left - Brand Panel */}
        <div className="w-1/2 h-full">
          <BrandPanel />
        </div>

        {/* Divider */}
        <div className="w-px bg-slate-200 flex-shrink-0" />

        {/* Right - Form */}
        <div className="w-1/2 bg-white overflow-y-auto h-screen">
          <div className="min-h-full flex justify-center items-center pt-10 pb-10 px-8 xl:px-12">
            {renderFormPanel()}
          </div>
        </div>
      </div>

      {/* ══ MOBILE ══ */}
      <div className="lg:hidden w-full min-h-screen bg-white flex flex-col">
        <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <img src={logo} alt="VYNTRA ONE" className="h-8 object-contain" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[11px] font-semibold text-[#043573]">
            Instructor
          </span>
        </div>

        <div className="flex-1 px-5 py-6 overflow-y-auto">
          {renderFormPanel(true)}
        </div>
      </div>
    </div>
  );
};

export default InstructorLogin;
