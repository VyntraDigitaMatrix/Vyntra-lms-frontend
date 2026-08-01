import React, { useState, useEffect, useCallback } from "react";
import { useInstructorAuth } from "../auth/AuthContext";
import { instructorManagementApi, instructorStudentApi } from "../auth/api";
import {
  FaEdit, FaEnvelope, FaPhone, FaCamera, FaSave, FaTimes,
  FaShieldAlt, FaCheckCircle, FaIdCard, FaAt, FaUsers,
  FaBookOpen, FaStar, FaBriefcase, FaExclamationCircle,
  FaQuoteLeft, FaFileUpload, FaTrash, FaExternalLinkAlt,
  FaChevronLeft, FaChevronRight, FaArrowLeft, FaGraduationCap,
} from "react-icons/fa";

/* Reasonable guess at proof type options based on the "AADHAAR" example in
   the schema — adjust this list to match your backend enum exactly. */
const PROOF_TYPES = ["AADHAAR", "PAN", "PASSPORT", "DRIVING_LICENSE", "VOTER_ID", "OTHER"];

const TABS = [
  { key: "overview", label: "Overview", icon: <FaIdCard size={11} /> },
  { key: "proofs", label: "Verification Proofs", icon: <FaShieldAlt size={11} /> },
  { key: "courses", label: "My Courses", icon: <FaBookOpen size={11} /> },
  { key: "students", label: "My Students", icon: <FaUsers size={11} /> },
];

const InstructorProfile = () => {
  const { instructor, setInstructor } = useInstructorAuth();
  const [activeTab, setActiveTab] = useState("overview");
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

  // ── Proofs ──
  const [proofs, setProofs] = useState([]);
  const [proofsLoading, setProofsLoading] = useState(false);
  const [proofForm, setProofForm] = useState({ proofName: "", proofType: PROOF_TYPES[0], file: null });
  const [editingProofId, setEditingProofId] = useState(null); // null = not editing, "new" = uploading, else proofId
  const [proofSaving, setProofSaving] = useState(false);

  // ── My Courses ──
  const [myCourses, setMyCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesPage, setCoursesPage] = useState(0);
  const [coursesTotalPages, setCoursesTotalPages] = useState(0);

  // ── My Students (global) ──
  const [myStudents, setMyStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsPage, setStudentsPage] = useState(0);
  const [studentsTotalPages, setStudentsTotalPages] = useState(0);

  // ── Students filtered by a specific course (drill-down from My Courses) ──
  const [selectedCourse, setSelectedCourse] = useState(null); // { courseSlug, courseTitle }
  const [courseStudents, setCourseStudents] = useState([]);
  const [courseStudentsLoading, setCourseStudentsLoading] = useState(false);
  const [courseStudentsPage, setCourseStudentsPage] = useState(0);
  const [courseStudentsTotalPages, setCourseStudentsTotalPages] = useState(0);

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

  /* ── Profile / photo / email (existing flows) ── */
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

  /* ── Proofs ── */
  const fetchProofs = useCallback(async () => {
    setProofsLoading(true);
    try {
      const res = await instructorManagementApi.getMyProofs();
      if (res.data?.success) setProofs(res.data.data || []);
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load proofs", "error");
    } finally { setProofsLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === "proofs") fetchProofs();
  }, [activeTab, fetchProofs]);

  const openUploadProof = () => {
    setProofForm({ proofName: "", proofType: PROOF_TYPES[0], file: null });
    setEditingProofId("new");
  };

  const openEditProof = (proof) => {
    setProofForm({ proofName: proof.proofName || "", proofType: proof.proofType || PROOF_TYPES[0], file: null });
    setEditingProofId(proof.proofId);
  };

  const closeProofForm = () => setEditingProofId(null);

  const handleSaveProof = async () => {
    if (!proofForm.proofName.trim()) { notify("Proof name is required", "error"); return; }
    setProofSaving(true);
    try {
      if (editingProofId === "new") {
        const res = await instructorManagementApi.uploadProof(proofForm.proofName.trim(), proofForm.proofType, proofForm.file);
        if (res.data?.success) {
          notify("Proof uploaded successfully!");
          closeProofForm();
          fetchProofs();
        }
      } else {
        const res = await instructorManagementApi.updateProof(editingProofId, proofForm.proofName.trim(), proofForm.proofType, proofForm.file);
        if (res.data?.success) {
          notify("Proof updated successfully!");
          closeProofForm();
          fetchProofs();
        }
      }
    } catch (err) {
      notify(err.response?.data?.message || "Failed to save proof", "error");
    } finally { setProofSaving(false); }
  };

  const handleDeleteProof = async (proofId, proofName) => {
    if (!window.confirm(`Delete proof "${proofName}"?`)) return;
    try {
      const res = await instructorManagementApi.deleteProof(proofId);
      if (res.data?.success) {
        notify("Proof deleted.");
        fetchProofs();
      }
    } catch (err) {
      notify(err.response?.data?.message || "Failed to delete proof", "error");
    }
  };

  /* ── My Courses ── */
  const fetchMyCourses = useCallback(async (page = 0) => {
    setCoursesLoading(true);
    try {
      const res = await instructorManagementApi.getMyCourses(page, 10);
      if (res.data?.success) {
        setMyCourses(res.data.data?.content || []);
        setCoursesTotalPages(res.data.data?.totalPages || 0);
        setCoursesPage(page);
      }
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load courses", "error");
    } finally { setCoursesLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === "courses" && !selectedCourse) fetchMyCourses(0);
  }, [activeTab, selectedCourse, fetchMyCourses]);

  /* ── My Students (global) ── */
  const fetchMyStudents = useCallback(async (page = 0) => {
    setStudentsLoading(true);
    try {
      const res = await instructorManagementApi.getMyStudents(page, 10);
      if (res.data?.success) {
        setMyStudents(res.data.data?.content || []);
        setStudentsTotalPages(res.data.data?.totalPages || 0);
        setStudentsPage(page);
      }
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load students", "error");
    } finally { setStudentsLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === "students") fetchMyStudents(0);
  }, [activeTab, fetchMyStudents]);

  /* ── Students for a single course (drill-down) ── */
  const fetchCourseStudents = useCallback(async (courseSlug, page = 0) => {
    setCourseStudentsLoading(true);
    try {
      const res = await instructorStudentApi.getStudentsByCourse(courseSlug, page, 10);
      if (res.data?.success) {
        setCourseStudents(res.data.data?.content || []);
        setCourseStudentsTotalPages(res.data.data?.totalPages || 0);
        setCourseStudentsPage(page);
      }
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load course students", "error");
    } finally { setCourseStudentsLoading(false); }
  }, []);

  const handleViewCourseStudents = (course) => {
    setSelectedCourse({ courseSlug: course.courseSlug, courseTitle: course.courseTitle });
    fetchCourseStudents(course.courseSlug, 0);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setCourseStudents([]);
  };

  if (!instructor) return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-[#f7f8fc] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
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
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold ${toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
            }`}>
            {toast.type === "error" ? <FaExclamationCircle /> : <FaCheckCircle />}
            {toast.text}
          </div>
        )}

        {/* Tab bar */}
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1 overflow-x-auto w-full sm:w-fit">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setSelectedCourse(null); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap
                ${activeTab === key
                  ? "bg-violet-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-violet-500 hover:bg-violet-50"}`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT: Identity card (always visible) */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-violet-500" />
              <div className="p-6 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  {instructor.profileImage ? (
                    <img src={instructor.profileImage} alt="Profile"
                      className="w-24 h-24 rounded-2xl object-cover shadow ring-4 ring-white" />
                  ) : (
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow ring-4 ring-white bg-gradient-to-br from-violet-500 to-violet-700"
                    >
                      {initials}
                    </div>
                  )}
                  <label htmlFor="photo-upload"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-500 text-white rounded-xl flex items-center justify-center shadow-md cursor-pointer hover:bg-violet-600 transition"
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
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-blue-100">
                      <FaCheckCircle size={9} /> Verified
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="w-full mt-5 pt-5 border-t border-gray-50 grid grid-cols-3 gap-2 text-center">
                  <StatBadge icon={<FaStar className="text-yellow-400" />} value={Number(instructor.averageRating || 0).toFixed(1)} label="Rating" />
                  <StatBadge icon={<FaUsers className="text-violet-500" />} value={instructor.totalStudents || 0} label="Students" />
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

          {/* RIGHT: Tab content */}
          <div className="lg:col-span-2 space-y-5">

            {/* ══════════ OVERVIEW TAB ══════════ */}
            {activeTab === "overview" && (
              isChangingEmail ? (
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
                        <div className="flex items-start gap-3 p-3.5 bg-violet-50 border border-violet-100 rounded-xl text-xs text-violet-600 font-medium">
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
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-violet-500 bg-violet-500/5 border border-violet-500/10 hover:bg-violet-500/10 transition"
                        >
                          <FaEdit size={10} /> Edit Profile
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <DetailCard icon={<FaEnvelope />} label="Email Address" value={instructor.email}>
                        <button onClick={() => setIsChangingEmail(true)} className="text-[10px] font-bold text-violet-500 px-2.5 py-1 rounded-lg bg-violet-500/5 hover:bg-violet-500/10 border border-violet-500/10 transition">Change</button>
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
              )
            )}

            {/* ══════════ PROOFS TAB ══════════ */}
            {activeTab === "proofs" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                  <SectionHeader icon={<FaShieldAlt />} title="Verification Proofs" subtitle="Documents used to verify your identity" />
                  {editingProofId === null && (
                    <button
                      onClick={openUploadProof}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-violet-500 bg-violet-500/5 border border-violet-500/10 hover:bg-violet-500/10 transition"
                    >
                      <FaFileUpload size={10} /> Upload Proof
                    </button>
                  )}
                </div>

                {/* Upload / Edit form */}
                {editingProofId !== null && (
                  <div className="mb-5 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-xs font-bold text-gray-600 mb-3">
                      {editingProofId === "new" ? "Upload New Proof" : "Edit Proof"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Proof Name">
                        <input
                          type="text"
                          value={proofForm.proofName}
                          onChange={e => setProofForm(p => ({ ...p, proofName: e.target.value }))}
                          placeholder="e.g. Aadhaar Card"
                          className="input-base"
                        />
                      </Field>
                      <Field label="Proof Type">
                        <select
                          value={proofForm.proofType}
                          onChange={e => setProofForm(p => ({ ...p, proofType: e.target.value }))}
                          className="input-base"
                        >
                          {PROOF_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                        </select>
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label={editingProofId === "new" ? "File" : "Replace File (optional)"}>
                          <input
                            type="file"
                            onChange={e => setProofForm(p => ({ ...p, file: e.target.files[0] || null }))}
                            className="input-base"
                          />
                        </Field>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <PrimaryBtn onClick={handleSaveProof} disabled={proofSaving}>
                        <FaSave size={12} />{proofSaving ? "Saving..." : "Save Proof"}
                      </PrimaryBtn>
                      <GhostBtn onClick={closeProofForm}>Cancel</GhostBtn>
                    </div>
                  </div>
                )}

                {/* Proofs list */}
                {proofsLoading ? (
                  <div className="py-10 text-center">
                    <div className="w-7 h-7 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : proofs.length === 0 ? (
                  <div className="py-10 text-center">
                    <FaShieldAlt className="text-3xl text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No proofs uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {proofs.map(proof => (
                      <div key={proof.proofId} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100 gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-violet-500 text-xs flex-shrink-0 shadow-sm">
                            <FaIdCard />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{proof.proofName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold text-violet-500 bg-violet-500/5 border border-violet-500/10 rounded-full px-2 py-0.5">
                                {(proof.proofType || "").replace(/_/g, " ")}
                              </span>
                              {proof.message && (
                                <span className="text-[10px] text-gray-400 truncate">{proof.message}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {proof.proofUrl && (
                            <a href={proof.proofUrl} target="_blank" rel="noopener noreferrer"
                              title="View file"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-violet-50 hover:text-violet-500 transition">
                              <FaExternalLinkAlt size={11} />
                            </a>
                          )}
                          <button onClick={() => openEditProof(proof)} title="Edit"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-violet-50 hover:text-violet-500 transition">
                            <FaEdit size={12} />
                          </button>
                          <button onClick={() => handleDeleteProof(proof.proofId, proof.proofName)} title="Delete"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition">
                            <FaTrash size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══════════ MY COURSES TAB ══════════ */}
            {activeTab === "courses" && !selectedCourse && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <SectionHeader icon={<FaBookOpen />} title="My Courses" subtitle="Courses you're teaching" />

                {coursesLoading ? (
                  <div className="py-10 text-center">
                    <div className="w-7 h-7 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : myCourses.length === 0 ? (
                  <div className="py-10 text-center">
                    <FaBookOpen className="text-3xl text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No courses found</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2.5">
                    {myCourses.map(course => (
                      <div key={course.courseId} className="flex items-center gap-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                        <img
                          src={course.thumbnailUrl || ""}
                          onError={e => { e.target.style.visibility = "hidden"; }}
                          alt={course.courseTitle}
                          className="w-14 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-200"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-800 truncate">{course.courseTitle}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <StatusPill status={course.status} />
                            <span className="text-[11px] text-gray-500 flex items-center gap-1">
                              <FaUsers size={9} /> {course.totalStudents || 0}
                            </span>
                            <span className="text-[11px] text-gray-500 flex items-center gap-1">
                              <FaStar size={9} className="text-yellow-400" /> {Number(course.averageRating || 0).toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewCourseStudents(course)}
                          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-violet-500 bg-white border border-violet-500/15 hover:bg-violet-50 transition"
                        >
                          <FaGraduationCap size={11} /> Students
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Pagination page={coursesPage} totalPages={coursesTotalPages} onChange={fetchMyCourses} />
              </div>
            )}

            {/* ══════════ COURSE-SPECIFIC STUDENTS (drill-down) ══════════ */}
            {activeTab === "courses" && selectedCourse && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <button onClick={handleBackToCourses}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition flex-shrink-0">
                    <FaArrowLeft size={12} />
                  </button>
                  <SectionHeader icon={<FaGraduationCap />} title={selectedCourse.courseTitle} subtitle="Students enrolled in this course" />
                </div>

                {courseStudentsLoading ? (
                  <div className="py-10 text-center">
                    <div className="w-7 h-7 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : courseStudents.length === 0 ? (
                  <div className="py-10 text-center">
                    <FaUsers className="text-3xl text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No students enrolled yet</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {courseStudents.map(student => (
                      <StudentRow key={student.studentId} student={student} />
                    ))}
                  </div>
                )}

                <Pagination page={courseStudentsPage} totalPages={courseStudentsTotalPages}
                  onChange={(p) => fetchCourseStudents(selectedCourse.courseSlug, p)} />
              </div>
            )}

            {/* ══════════ MY STUDENTS TAB (global) ══════════ */}
            {activeTab === "students" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <SectionHeader icon={<FaUsers />} title="My Students" subtitle="All students across your courses" />

                {studentsLoading ? (
                  <div className="py-10 text-center">
                    <div className="w-7 h-7 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : myStudents.length === 0 ? (
                  <div className="py-10 text-center">
                    <FaUsers className="text-3xl text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No students found</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2.5">
                    {myStudents.map(student => (
                      <StudentRow key={student.studentId} student={student} />
                    ))}
                  </div>
                )}

                <Pagination page={studentsPage} totalPages={studentsTotalPages} onChange={fetchMyStudents} />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Global input style */}
      <style>{`.input-base{width:100%;border:1px solid #e5e7eb;border-radius:0.75rem;padding:0.625rem 1rem;font-size:0.875rem;background:#f9fafb;outline:none;transition:all .15s}.input-base:focus{background:#fff;border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124, 58, 237, 0.1)}`}</style>
    </div>
  );
};

/* ══════════════════════════════════════════
   Sub-components
══════════════════════════════════════════ */
const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-violet-500 text-sm flex-shrink-0">{icon}</div>
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
      <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-violet-500 text-xs flex-shrink-0 shadow-sm">{icon}</div>
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
  const colors = variant === "green" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-violet-500 hover:bg-violet-600";
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-sm transition disabled:opacity-50 ${colors}`}>
      {children}
    </button>
  );
};

const GhostBtn = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className="px-5 py-2.5 rounded-xl text-gray-500 text-sm font-bold border border-gray-200 hover:bg-gray-50 transition">
      {children}
    </button>
  );
};

const StatusPill = ({ status }) => {
  const map = {
    PUBLISHED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    ARCHIVED: "bg-orange-50 text-orange-600 border-orange-100",
    DRAFT: "bg-yellow-50 text-yellow-700 border-yellow-100",
  };
  const cls = map[status] || "bg-gray-50 text-gray-500 border-gray-100";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls}`}>
      {status || "DRAFT"}
    </span>
  );
};

const StudentRow = ({ student }) => {
  const initials = student.fullName?.split(" ").map(n => n?.[0]).join("").toUpperCase().slice(0, 2) || "?";
  return (
    <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
      {student.profileImage ? (
        <img src={student.profileImage} alt={student.fullName} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center text-xs font-black flex-shrink-0">
          {initials}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800 truncate">{student.fullName}</p>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          <span className="text-[11px] text-gray-500 truncate">{student.email}</span>
          {student.mobileNumber && (
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <FaPhone size={8} /> {student.mobileNumber}
            </span>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        {student.enrollmentStatus && (
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5">
            {student.enrollmentStatus}
          </span>
        )}
        {typeof student.progressPercentage === "number" && (
          <p className="text-[11px] text-gray-400 mt-1">{student.progressPercentage}% complete</p>
        )}
      </div>
    </div>
  );
};

const Pagination = ({ page, totalPages, onChange }) => {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-5">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="w-8 h-8 rounded-lg bg-white border border-gray-200 disabled:opacity-40 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition"
      >
        <FaChevronLeft className="text-[10px] text-slate-600" />
      </button>
      <span className="text-xs font-semibold text-slate-500 px-2">
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="w-8 h-8 rounded-lg bg-white border border-gray-200 disabled:opacity-40 flex items-center justify-center hover:bg-violet-50 hover:border-violet-200 transition"
      >
        <FaChevronRight className="text-[10px] text-slate-600" />
      </button>
    </div>
  );
};

export default InstructorProfile;