import React, { useState, useEffect } from "react";
import { useInstructorAuth } from "../auth/AuthContext";
import { instructorManagementApi } from "../auth/api";
import {
  FaEdit, FaEnvelope, FaPhone, FaCamera, FaSave, FaTimes,
  FaShieldAlt, FaCheckCircle, FaIdCard, FaAt, FaUsers,
  FaBookOpen, FaStar, FaBriefcase, FaExclamationCircle,
  FaQuoteLeft,
} from "react-icons/fa";

const InstructorProfile = () => {
  const { instructor, setInstructor } = useInstructorAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: "",
    headline: "",
    shortBio: "",
    yearsOfExperience: 0,
  });

  // Email change
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ text: "", type: "" });

  useEffect(() => {
    if (instructor) {
      setForm({
        fullName: instructor.fullName || "",
        mobileNumber: instructor.mobileNumber || "",
        headline: instructor.headline || "",
        shortBio: instructor.shortBio || "",
        yearsOfExperience: instructor.yearsOfExperience || 0,
      });
    }
  }, [instructor]);

  const notify = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: "", type: "" }), 3500);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const res = await instructorManagementApi.updateProfileImage(file);
      if (res.data?.success) {
        setInstructor(prev => ({ ...prev, ...res.data.data }));
        notify("Profile photo updated!");
      }
    } catch (err) {
      notify(err.response?.data?.message || "Failed to update photo", "error");
    } finally { setLoading(false); }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const res = await instructorManagementApi.updateProfile(form);
      if (res.data?.success) {
        setInstructor(prev => ({ ...prev, ...res.data.data }));
        setIsEditing(false);
        notify("Profile updated successfully!");
      }
    } catch (err) {
      notify(err.response?.data?.message || "Failed to save profile", "error");
    } finally { setLoading(false); }
  };

  const handleRequestEmail = async () => {
    if (!newEmail) return;
    setLoading(true);
    try {
      await instructorManagementApi.requestEmailChange(newEmail);
      setOtpSent(true);
      notify("OTP sent to your new email.");
    } catch (err) {
      notify(err.response?.data?.message || "Failed to send OTP", "error");
    } finally { setLoading(false); }
  };

  const handleVerifyEmail = async () => {
    if (!otp) return;
    setLoading(true);
    try {
      const res = await instructorManagementApi.verifyEmailChange(otp);
      if (res.data?.success) {
        setInstructor(prev => ({ ...prev, ...res.data.data }));
        setIsChangingEmail(false); setOtpSent(false); setNewEmail(""); setOtp("");
        notify("Email changed successfully!");
      }
    } catch (err) {
      notify(err.response?.data?.message || "Invalid OTP", "error");
    } finally { setLoading(false); }
  };

  if (!instructor) return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-[#f7f8fc] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#043573] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const initials = instructor.fullName?.split(" ").map(n => n?.[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-[#f7f8fc] font-sans">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Page Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">My Profile</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Manage your instructor profile and account settings</p>
        </div>

        {/* Toast */}
        {toast.text && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold ${
            toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
          }`}>
            {toast.type === "error" ? <FaExclamationCircle /> : <FaCheckCircle />}
            {toast.text}
          </div>
        )}

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT: Identity card */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-[#043573]" />
              <div className="p-6 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  {instructor.profileImage ? (
                    <img src={instructor.profileImage} alt="Profile"
                      className="w-24 h-24 rounded-2xl object-cover shadow ring-4 ring-white" />
                  ) : (
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow ring-4 ring-white"
                      style={{ background: "linear-gradient(135deg,#043573 0%,#1e57c4 100%)" }}
                    >{initials}</div>
                  )}
                  <label htmlFor="photo-upload"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#043573] text-white rounded-xl flex items-center justify-center shadow-md cursor-pointer hover:bg-[#032551] transition"
                    title="Change photo"
                  >
                    {loading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaCamera size={11} />}
                  </label>
                  <input id="photo-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>

                <h2 className="text-lg font-black text-gray-900">{instructor.fullName}</h2>
                {instructor.headline && (
                  <p className="text-xs text-gray-500 mt-1 leading-snug">{instructor.headline}</p>
                )}
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <FaAt size={9} className="text-gray-300" />{instructor.username}
                </p>

                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  {instructor.isActive && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Active
                    </span>
                  )}
                  {instructor.emailVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#043573] text-[10px] font-bold border border-blue-100">
                      <FaCheckCircle size={9} /> Verified
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="w-full mt-5 pt-5 border-t border-gray-50 grid grid-cols-3 gap-2 text-center">
                  <StatBadge icon={<FaStar className="text-yellow-400" />} value={Number(instructor.averageRating || 0).toFixed(1)} label="Rating" />
                  <StatBadge icon={<FaUsers className="text-blue-500" />} value={instructor.totalStudents || 0} label="Students" />
                  <StatBadge icon={<FaBookOpen className="text-emerald-500" />} value={instructor.totalCourses || 0} label="Courses" />
                </div>

                {/* Codes */}
                <div className="w-full mt-4 pt-4 border-t border-gray-50 space-y-3 text-left">
                  <SideItem icon={<FaIdCard size={12} />} label="Instructor Code" value={instructor.instructorCode} mono />
                  <SideItem icon={<FaBriefcase size={12} />} label="Experience" value={`${instructor.yearsOfExperience || 0} year${(instructor.yearsOfExperience || 0) !== 1 ? "s" : ""}`} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Detail / forms */}
          <div className="lg:col-span-2 space-y-5">

            {isChangingEmail ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <SectionHeader icon={<FaEnvelope />} title="Change Email Address" subtitle="We'll send a verification code to your new email" />
                <div className="mt-5 space-y-4 max-w-md">
                  {!otpSent ? (
                    <>
                      <Field label="New Email Address">
                        <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="input-base" />
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
                      <Field label="Verification Code">
                        <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
                          placeholder="Enter code"
                          className="input-base tracking-[0.35em] font-mono text-center" />
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
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <SectionHeader icon={<FaEdit />} title="Edit Profile" subtitle="Update your professional details" />
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <input type="text" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} className="input-base" />
                  </Field>
                  <Field label="Mobile Number">
                    <input type="text" value={form.mobileNumber} onChange={e => setForm(p => ({ ...p, mobileNumber: e.target.value }))} className="input-base" />
                  </Field>
                  <Field label="Years of Experience">
                    <input type="number" min={0} value={form.yearsOfExperience} onChange={e => setForm(p => ({ ...p, yearsOfExperience: Number(e.target.value) }))} className="input-base" />
                  </Field>
                  <Field label="Headline">
                    <input type="text" value={form.headline} placeholder="e.g. Senior Java Instructor" onChange={e => setForm(p => ({ ...p, headline: e.target.value }))} className="input-base" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Short Bio">
                      <textarea rows={4} value={form.shortBio} placeholder="Tell students about yourself..."
                        onChange={e => setForm(p => ({ ...p, shortBio: e.target.value }))}
                        className="input-base resize-none" />
                    </Field>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <PrimaryBtn onClick={handleSaveProfile} disabled={loading}>
                    <FaSave size={12} />{loading ? "Saving..." : "Save Changes"}
                  </PrimaryBtn>
                  <GhostBtn onClick={() => setIsEditing(false)}>Cancel</GhostBtn>
                </div>
              </div>

            ) : (
              <>
                {/* Account Details */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <SectionHeader icon={<FaIdCard />} title="Account Details" subtitle="Your personal and account information" />
                    {!isChangingEmail && (
                      <button
                        onClick={() => { setIsEditing(true); setForm({ fullName: instructor.fullName || "", mobileNumber: instructor.mobileNumber || "", headline: instructor.headline || "", shortBio: instructor.shortBio || "", yearsOfExperience: instructor.yearsOfExperience || 0 }); }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#043573] bg-[#043573]/5 border border-[#043573]/10 hover:bg-[#043573]/10 transition"
                      >
                        <FaEdit size={10} /> Edit Profile
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DetailCard icon={<FaEnvelope />} label="Email Address" value={instructor.email}>
                      <button onClick={() => setIsChangingEmail(true)} className="text-[10px] font-bold text-[#043573] px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-100 transition">Change</button>
                    </DetailCard>
                    <DetailCard icon={<FaPhone />} label="Mobile Number" value={instructor.mobileNumber || "—"} />
                    <DetailCard icon={<FaCheckCircle />} label="Email Status" value={instructor.emailVerified ? "Verified" : "Not Verified"} valueClass={instructor.emailVerified ? "text-emerald-600" : "text-orange-500"} />
                    <DetailCard icon={<FaShieldAlt />} label="Account Status" value={instructor.isActive ? "Active" : "Inactive"} valueClass={instructor.isActive ? "text-emerald-600" : "text-red-500"} />
                  </div>
                </div>

                {/* Bio card */}
                {instructor.shortBio && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                    <SectionHeader icon={<FaQuoteLeft />} title="About Me" subtitle="Your public bio shown to students" />
                    <p className="mt-4 text-sm text-gray-600 leading-relaxed">{instructor.shortBio}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Global input style */}
      <style>{`.input-base{width:100%;border:1px solid #e5e7eb;border-radius:0.75rem;padding:0.625rem 1rem;font-size:0.875rem;background:#f9fafb;outline:none;transition:all .15s}.input-base:focus{background:#fff;border-color:#043573;box-shadow:0 0 0 3px rgba(4,53,115,0.1)}`}</style>
    </div>
  );
};

/* Sub-components */
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

const StatBadge = ({ icon, value, label }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="text-base">{icon}</div>
    <span className="text-sm font-black text-gray-900">{value}</span>
    <span className="text-[10px] text-gray-400 font-medium">{label}</span>
  </div>
);

const SideItem = ({ icon, label, value, mono = false }) => (
  <div className="flex items-center gap-2.5">
    <div className="text-gray-400 flex-shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{label}</p>
      <p className={`text-xs font-bold text-gray-700 truncate ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  </div>
);

const PrimaryBtn = ({ onClick, disabled, children, variant = "blue" }) => {
  const colors = variant === "green" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#043573] hover:bg-[#032551]";
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

export default InstructorProfile;