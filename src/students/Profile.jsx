import React, { useState, useEffect } from "react";
import { useAuth } from "./auth/AuthContext";
import { studentManagementApi } from "./auth/api";
import {
  FaEdit, FaEnvelope, FaPhone, FaCamera, FaSave,
  FaTimes, FaShieldAlt, FaCheckCircle, FaIdCard,
  FaGift, FaAt, FaUser, FaExclamationCircle, FaTicketAlt,
} from "react-icons/fa";

const StudentProfile = () => {
  const { student, setStudent } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [toast, setToast] = useState({ text: "", type: "" });
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Apply referral code
  const [referralInput, setReferralInput] = useState("");
  const [applyingReferral, setApplyingReferral] = useState(false);
  const [referralApplied, setReferralApplied] = useState(false);

  useEffect(() => {
    if (student) {
      setFullName(student.fullName || "");
      setMobileNumber(student.mobileNumber || "");
    }
  }, [student]);

  const notify = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: "", type: "" }), 3500);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const res = await studentManagementApi.updateProfileImage(file);
      if (res.data?.success) { setStudent(res.data.data); notify("Profile photo updated!"); }
    } catch (err) { notify(err.response?.data?.message || "Failed to update photo", "error"); }
    finally { setLoading(false); }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const res = await studentManagementApi.updateProfile({ fullName, mobileNumber });
      if (res.data?.success) {
        // Merge with existing student to preserve fields not returned by this API (e.g. profileImage)
        setStudent(prev => ({ ...prev, ...res.data.data }));
        setIsEditing(false);
        notify("Profile saved!");
      }
    } catch (err) { notify(err.response?.data?.message || "Failed to save", "error"); }
    finally { setLoading(false); }
  };

  const handleRequestEmail = async () => {
    if (!newEmail) return;
    setLoading(true);
    try {
      await studentManagementApi.requestEmailChange(newEmail);
      setOtpSent(true);
      notify("OTP sent to your new email.");
    } catch (err) { notify(err.response?.data?.message || "Failed to send OTP", "error"); }
    finally { setLoading(false); }
  };

  const handleVerifyEmail = async () => {
    if (!otp) return;
    setLoading(true);
    try {
      const res = await studentManagementApi.verifyEmailChange(otp);
      if (res.data?.success) {
        setStudent(res.data.data);
        setIsChangingEmail(false); setOtpSent(false); setNewEmail(""); setOtp("");
        notify("Email updated!");
      }
    } catch (err) { notify(err.response?.data?.message || "Invalid OTP", "error"); }
    finally { setLoading(false); }
  };

  const handleApplyReferral = async () => {
    if (!referralInput.trim()) return;
    setApplyingReferral(true);
    try {
      const res = await studentManagementApi.applyReferralCode(referralInput.trim());
      if (res.data?.success) {
        notify(res.data.message || res.data.data || "Referral code applied!");
        setReferralApplied(true);
        setReferralInput("");
      }
    } catch (err) {
      notify(err.response?.data?.message || "Invalid or expired referral code", "error");
    } finally {
      setApplyingReferral(false);
    }
  };

  if (!student) return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-[#f7f8fc] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#043573] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const initials = student.fullName?.split(" ").map(n => n?.[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-[#f7f8fc] font-sans">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* ── Page Title ── */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">My Profile</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Manage your personal information and account settings</p>
        </div>

        {/* ── Toast ── */}
        {toast.text && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold ${
            toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
          }`}>
            {toast.type === "error" ? <FaExclamationCircle /> : <FaCheckCircle />}
            {toast.text}
          </div>
        )}

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT: Profile card */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Top accent */}
              <div className="h-1 w-full bg-[#043573]" />

              <div className="p-6 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  {student.profileImage ? (
                    <img
                      src={student.profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-2xl object-cover shadow ring-4 ring-white"
                    />
                  ) : (
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow ring-4 ring-white"
                      style={{ background: "linear-gradient(135deg,#043573 0%,#1e57c4 100%)" }}
                    >
                      {initials}
                    </div>
                  )}
                  <label
                    htmlFor="photo-upload"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#043573] text-white rounded-xl flex items-center justify-center shadow-md cursor-pointer hover:bg-[#032551] transition"
                  >
                    {loading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : <FaCamera size={11} />}
                  </label>
                  <input id="photo-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>

                <h2 className="text-lg font-black text-gray-900">{student.fullName}</h2>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <FaAt size={9} className="text-gray-300" />{student.username}
                </p>

                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  {student.isActive && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Active
                    </span>
                  )}
                  {student.emailVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#043573] text-[10px] font-bold border border-blue-100">
                      <FaCheckCircle size={9} /> Verified
                    </span>
                  )}
                </div>

                <div className="w-full mt-5 pt-5 border-t border-gray-50 space-y-3 text-left">
                  <SideInfoItem icon={<FaIdCard size={12} />} label="Student Code" value={student.studentCode} mono />
                  {student.referralCode && (
                    <SideInfoItem icon={<FaGift size={12} />} label="Your Referral Code" value={student.referralCode} mono />
                  )}
                </div>
              </div>
            </div>

            {/* Apply Referral Code */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#043573] text-sm flex-shrink-0">
                  <FaTicketAlt />
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-900">Apply Referral Code</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">Have a friend's code? Apply it here.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralInput}
                  onChange={e => setReferralInput(e.target.value.toUpperCase())}
                  placeholder="REF-ABC123"
                  disabled={referralApplied}
                  className="flex-1 min-w-0 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:bg-white outline-none focus:border-[#043573] focus:ring-2 focus:ring-[#043573]/10 transition font-mono tracking-wide disabled:opacity-60"
                />
                <button
                  onClick={handleApplyReferral}
                  disabled={!referralInput.trim() || applyingReferral || referralApplied}
                  className="px-4 py-2.5 rounded-xl bg-[#043573] hover:bg-[#032551] disabled:opacity-50 text-white text-xs font-bold shadow-sm transition flex-shrink-0"
                >
                  {applyingReferral ? "Applying..." : referralApplied ? "Applied ✓" : "Apply"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Details / Forms */}
          <div className="lg:col-span-2 space-y-5">

            {isChangingEmail ? (
              /* Email Change */
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <SectionHeader icon={<FaEnvelope />} title="Change Email Address" subtitle="We'll send a verification code to your new email" />
                <div className="mt-5 space-y-4 max-w-md">
                  {!otpSent ? (
                    <>
                      <Field label="New Email Address">
                        <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="you@example.com"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white outline-none focus:border-[#043573] focus:ring-2 focus:ring-[#043573]/10 transition" />
                      </Field>
                      <div className="flex gap-3">
                        <PrimaryBtn onClick={handleRequestEmail} disabled={!newEmail || loading}>{loading ? "Sending..." : "Send OTP"}</PrimaryBtn>
                        <GhostBtn onClick={() => setIsChangingEmail(false)}>Cancel</GhostBtn>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-3 p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-[#043573] font-medium">
                        <FaEnvelope size={13} className="mt-0.5 flex-shrink-0" />
                        OTP sent to <strong>{newEmail}</strong>. Check your inbox.
                      </div>
                      <Field label="Enter OTP">
                        <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter code"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white outline-none focus:border-[#043573] focus:ring-2 focus:ring-[#043573]/10 transition tracking-[0.35em] font-mono text-center" />
                      </Field>
                      <div className="flex gap-3">
                        <PrimaryBtn onClick={handleVerifyEmail} disabled={!otp || loading} variant="green">{loading ? "Verifying..." : "Verify & Update"}</PrimaryBtn>
                        <GhostBtn onClick={() => { setOtpSent(false); setOtp(""); }}>← Back</GhostBtn>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : isEditing ? (
              /* Edit Form */
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <SectionHeader icon={<FaEdit />} title="Edit Profile" subtitle="Update your name and contact number" />
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white outline-none focus:border-[#043573] focus:ring-2 focus:ring-[#043573]/10 transition" />
                  </Field>
                  <Field label="Mobile Number">
                    <input type="text" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white outline-none focus:border-[#043573] focus:ring-2 focus:ring-[#043573]/10 transition" />
                  </Field>
                </div>
                <div className="flex gap-3 mt-5">
                  <PrimaryBtn onClick={handleSaveProfile} disabled={loading}>
                    <FaSave size={12} />{loading ? "Saving..." : "Save Changes"}
                  </PrimaryBtn>
                  <GhostBtn onClick={() => setIsEditing(false)}>Cancel</GhostBtn>
                </div>
              </div>
            ) : (
              /* Account Details view */
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                  <SectionHeader icon={<FaUser />} title="Account Details" subtitle="Your personal and account information" />
                  <button
                    onClick={() => { setIsEditing(true); setFullName(student.fullName || ""); setMobileNumber(student.mobileNumber || ""); }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#043573] bg-[#043573]/5 border border-[#043573]/10 hover:bg-[#043573]/10 transition"
                  >
                    <FaEdit size={10} /> Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DetailCard icon={<FaEnvelope />} label="Email Address" value={student.email}>
                    <button
                      onClick={() => setIsChangingEmail(true)}
                      className="text-[10px] font-bold text-[#043573] px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-100 transition"
                    >
                      Change
                    </button>
                  </DetailCard>

                  <DetailCard icon={<FaPhone />} label="Mobile Number" value={student.mobileNumber || "—"} />

                  <DetailCard
                    icon={<FaCheckCircle />}
                    label="Email Status"
                    value={student.emailVerified ? "Verified" : "Not Verified"}
                    valueClass={student.emailVerified ? "text-emerald-600" : "text-orange-500"}
                  />

                  <DetailCard
                    icon={<FaShieldAlt />}
                    label="Account Status"
                    value={student.isActive ? "Active" : "Inactive"}
                    valueClass={student.isActive ? "text-emerald-600" : "text-red-500"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Sub-components ── */
const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#043573] text-sm flex-shrink-0">{icon}</div>
    <div>
      <h2 className="text-sm font-black text-gray-900">{title}</h2>
      {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</label>
    {children}
  </div>
);

const DetailCard = ({ icon, label, value, valueClass = "text-gray-800", children }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 gap-3">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#043573] text-xs flex-shrink-0 shadow-sm">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-semibold truncate mt-0.5 ${valueClass}`}>{value}</p>
      </div>
    </div>
    {children && <div className="flex-shrink-0">{children}</div>}
  </div>
);

const SideInfoItem = ({ icon, label, value, mono = false }) => (
  <div className="flex items-center gap-2.5">
    <div className="text-gray-400 flex-shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{label}</p>
      <p className={`text-xs font-bold text-gray-700 truncate ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  </div>
);

const PrimaryBtn = ({ onClick, disabled, children, variant = "blue" }) => {
  const colors = variant === "green"
    ? "bg-emerald-600 hover:bg-emerald-700"
    : "bg-[#043573] hover:bg-[#032551]";
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-sm transition disabled:opacity-50 ${colors}`}>
      {children}
    </button>
  );
};

const GhostBtn = ({ onClick, children }) => (
  <button onClick={onClick} className="px-5 py-2.5 rounded-xl text-gray-500 text-sm font-bold border border-gray-200 hover:bg-gray-50 transition">
    {children}
  </button>
);

export default StudentProfile;