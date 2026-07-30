import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { adminManagementApi } from "../auth/api";
import {
  FaSearch, FaEdit, FaToggleOn, FaToggleOff, FaUserGraduate,
  FaChalkboardTeacher, FaFileAlt, FaPlus, FaTimes, FaCheckCircle,
  FaExclamationCircle, FaChevronLeft, FaChevronRight, FaExternalLinkAlt,
  FaEnvelope, FaPhone, FaAt, FaIdCard,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const TABS = [
  { id: "students", label: "Students", icon: <FaUserGraduate /> },
  { id: "instructors", label: "Instructors", icon: <FaChalkboardTeacher /> },
  { id: "proofs", label: "Instructor Proofs", icon: <FaFileAlt /> },
];

const initials = (name = "") =>
  name.trim().split(/\s+/).filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";

/* ── Status pill ── */
const StatusPill = ({ active }) => (
  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
    active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
  }`}>
    {active ? "Active" : "Inactive"}
  </span>
);

/* ── Pagination ── */
const Pagination = ({ page, totalPages, last, onChange }) => (
  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
    <span className="text-xs text-gray-400">Page {page + 1} of {Math.max(totalPages, 1)}</span>
    <div className="flex items-center gap-2">
      <button onClick={() => onChange(p => Math.max(0, p - 1))} disabled={page === 0}
        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
        <FaChevronLeft size={10} />
      </button>
      <button onClick={() => onChange(p => p + 1)} disabled={last}
        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
        <FaChevronRight size={10} />
      </button>
    </div>
  </div>
);

/* ── Edit User Modal (students & instructors share the same PUT shape) ── */
const EditUserModal = ({ code, kind, onClose, onSaved, notify }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState({ fullName: "", mobileNumber: "", profileImage: "" });

  useEffect(() => {
    const fetcher = kind === "student" ? adminManagementApi.getStudentByCode : adminManagementApi.getInstructorByCode;
    fetcher(code)
      .then(res => {
        const d = res.data?.data;
        setDetail(d);
        setForm({ fullName: d?.fullName || "", mobileNumber: d?.mobileNumber || "", profileImage: d?.profileImage || "" });
      })
      .catch(err => notify(err?.response?.data?.message || "Failed to load details", "error"))
      .finally(() => setLoading(false));
  }, [code, kind]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updater = kind === "student" ? adminManagementApi.updateStudent : adminManagementApi.updateInstructor;
      const res = await updater(code, form);
      notify("Profile updated successfully!");
      onSaved(res.data?.data);
      onClose();
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to save changes", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-black text-gray-900">Edit {kind === "student" ? "Student" : "Instructor"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
        </div>

        {loading ? (
          <div className="p-10 flex justify-center"><AiOutlineLoading3Quarters className="animate-spin text-2xl text-[#2BB2A9]" /></div>
        ) : (
          <>
            <div className="px-6 py-5 space-y-4">
              {detail && (
                <div className="flex items-center gap-3 mb-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-[#2BB2A9] text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                    {initials(detail.fullName)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{detail.email}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{detail.studentCode || detail.instructorCode}</p>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:bg-white outline-none focus:border-[#2BB2A9] focus:ring-2 focus:ring-[#2BB2A9] transition" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Mobile Number</label>
                <input value={form.mobileNumber} onChange={e => setForm(f => ({ ...f, mobileNumber: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:bg-white outline-none focus:border-[#2BB2A9] focus:ring-2 focus:ring-[#2BB2A9] transition" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Profile Image URL</label>
                <input value={form.profileImage} onChange={e => setForm(f => ({ ...f, profileImage: e.target.value }))}
                  placeholder="https://…"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:bg-white outline-none focus:border-[#2BB2A9] focus:ring-2 focus:ring-[#2BB2A9] transition" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
              <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition bg-white">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-[#2BB2A9] hover:bg-[#2BB2A9] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition">
                {saving && <AiOutlineLoading3Quarters className="animate-spin" size={11} />}
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ── Create Instructor Modal ── */
const CreateInstructorModal = ({ onClose, onCreated, notify }) => {
  const [form, setForm] = useState({ fullName: "", email: "", username: "", password: "", mobileNumber: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.username.trim() || !form.password.trim()) {
      setError("Full name, email, username, and password are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await adminManagementApi.createInstructor(form);
      notify(`Instructor created — code: ${res.data?.data?.instructorCode}`);
      onCreated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create instructor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#2BB2A9] to-[#1A8C80] rounded-t-2xl">
          <FaPlus className="text-white" />
          <h3 className="text-sm font-black text-white flex-1">Create Instructor</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white"><FaTimes /></button>
        </div>
        <div className="px-6 py-5 space-y-3">
          {[
            { k: "fullName", label: "Full Name", type: "text" },
            { k: "email", label: "Email", type: "email" },
            { k: "username", label: "Username", type: "text" },
            { k: "password", label: "Password", type: "password" },
            { k: "mobileNumber", label: "Mobile Number", type: "text" },
          ].map(f => (
            <div key={f.k}>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{f.label}</label>
              <input type={f.type} value={form[f.k]} onChange={e => set(f.k, e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:bg-white outline-none focus:border-[#2BB2A9] focus:ring-2 focus:ring-[#2BB2A9] transition" />
            </div>
          ))}
          {error && (
            <div className="flex items-start gap-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl text-[11px] font-semibold text-rose-600">
              <FaExclamationCircle className="flex-shrink-0 mt-0.5" size={11} /> {error}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition bg-white">Cancel</button>
          <button onClick={handleCreate} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[#2BB2A9] hover:bg-[#2BB2A9] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition">
            {saving && <AiOutlineLoading3Quarters className="animate-spin" size={11} />}
            {saving ? "Creating…" : "Create Instructor"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Instructor Proofs Modal (for a single instructor) ── */
const InstructorProofsModal = ({ instructorCode, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [proofs, setProofs] = useState([]);

  useEffect(() => {
    adminManagementApi.getInstructorProofs(instructorCode)
      .then(res => setProofs(res.data?.data || []))
      .catch(() => setProofs([]))
      .finally(() => setLoading(false));
  }, [instructorCode]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-black text-gray-900">Documents — {instructorCode}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
        </div>
        <div className="px-6 py-5 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8"><AiOutlineLoading3Quarters className="animate-spin text-2xl text-[#2BB2A9]" /></div>
          ) : proofs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No documents uploaded.</p>
          ) : (
            <div className="space-y-2">
              {proofs.map(p => (
                <div key={p.proofId} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{p.proofName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{p.proofType}</p>
                  </div>
                  {p.proofUrl && (
                    <a href={p.proofUrl} target="_blank" rel="noopener noreferrer" className="text-[#2BB2A9] hover:text-[#2BB2A9] flex-shrink-0">
                      <FaExternalLinkAlt size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
export default function AdminManagement() {
  const [activeTab, setActiveTab] = useState("students");
  const [toast, setToast] = useState(null);

  const notify = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Students
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsPage, setStudentsPage] = useState(0);
  const [studentsMeta, setStudentsMeta] = useState({ totalPages: 0, last: true });
  const [studentSearch, setStudentSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [togglingCode, setTogglingCode] = useState(null);

  const fetchStudents = useCallback(async (page, query) => {
    setStudentsLoading(true);
    try {
      const res = query
        ? await adminManagementApi.searchStudents(query, page, 10)
        : await adminManagementApi.getAllStudents(page, 10);
      const body = res.data?.data;
      setStudents(body?.content || []);
      setStudentsMeta({ totalPages: body?.totalPages ?? 0, last: body?.last ?? true });
    } catch (err) {
      notify("Failed to load students", "error");
    } finally {
      setStudentsLoading(false);
    }
  }, []);

  useEffect(() => { if (activeTab === "students") fetchStudents(studentsPage, studentSearch); }, [activeTab, studentsPage, fetchStudents]);

  const handleStudentSearch = (e) => {
    e.preventDefault();
    setStudentsPage(0);
    fetchStudents(0, studentSearch);
  };

  const handleToggleStudent = async (code) => {
    setTogglingCode(code);
    try {
      await adminManagementApi.toggleStudentStatus(code);
      setStudents(prev => prev.map(s => s.studentCode === code ? { ...s, isActive: !s.isActive } : s));
      notify("Student status updated.");
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to toggle status", "error");
    } finally {
      setTogglingCode(null);
    }
  };

  // Instructors
  const [instructors, setInstructors] = useState([]);
  const [instructorsLoading, setInstructorsLoading] = useState(true);
  const [instructorsPage, setInstructorsPage] = useState(0);
  const [instructorsMeta, setInstructorsMeta] = useState({ totalPages: 0, last: true });
  const [instructorSearch, setInstructorSearch] = useState("");
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [viewingProofsFor, setViewingProofsFor] = useState(null);
  const [showCreateInstructor, setShowCreateInstructor] = useState(false);

  const fetchInstructors = useCallback(async (page, query) => {
    setInstructorsLoading(true);
    try {
      const res = query
        ? await adminManagementApi.searchInstructors(query, page, 10)
        : await adminManagementApi.getAllInstructors(page, 10);
      const body = res.data?.data;
      setInstructors(body?.content || []);
      setInstructorsMeta({ totalPages: body?.totalPages ?? 0, last: body?.last ?? true });
    } catch (err) {
      notify("Failed to load instructors", "error");
    } finally {
      setInstructorsLoading(false);
    }
  }, []);

  useEffect(() => { if (activeTab === "instructors") fetchInstructors(instructorsPage, instructorSearch); }, [activeTab, instructorsPage, fetchInstructors]);

  const handleInstructorSearch = (e) => {
    e.preventDefault();
    setInstructorsPage(0);
    fetchInstructors(0, instructorSearch);
  };

  const handleToggleInstructor = async (code) => {
    setTogglingCode(code);
    try {
      await adminManagementApi.toggleInstructorStatus(code);
      setInstructors(prev => prev.map(i => i.instructorCode === code ? { ...i, isActive: !i.isActive } : i));
      notify("Instructor status updated.");
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to toggle status", "error");
    } finally {
      setTogglingCode(null);
    }
  };

  // Proofs (all)
  const [allProofs, setAllProofs] = useState([]);
  const [proofsLoading, setProofsLoading] = useState(true);
  const [proofsPage, setProofsPage] = useState(0);
  const [proofsMeta, setProofsMeta] = useState({ totalPages: 0, last: true });

  const fetchAllProofs = useCallback(async (page) => {
    setProofsLoading(true);
    try {
      const res = await adminManagementApi.getAllInstructorProofs(page, 10);
      const body = res.data?.data;
      setAllProofs(body?.content || []);
      setProofsMeta({ totalPages: body?.totalPages ?? 0, last: body?.last ?? true });
    } catch (err) {
      notify("Failed to load proofs", "error");
    } finally {
      setProofsLoading(false);
    }
  }, []);

  useEffect(() => { if (activeTab === "proofs") fetchAllProofs(proofsPage); }, [activeTab, proofsPage, fetchAllProofs]);

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {toast && (
          <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold ${
            toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
          }`}>
            {toast.type === "error" ? <FaExclamationCircle /> : <FaCheckCircle />}
            {toast.text}
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">
              <Link to="/admin/dashboard" className="hover:text-[#2BB2A9] transition">Dashboard</Link>
              <span className="mx-2">›</span>Management
            </p>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">User Management</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Manage students, instructors, and verification documents</p>
          </div>
          {activeTab === "instructors" && (
            <button onClick={() => setShowCreateInstructor(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#2BB2A9] hover:bg-[#2BB2A9] text-white text-sm font-bold rounded-xl transition shadow-sm flex-shrink-0">
              <FaPlus size={11} /> Create Instructor
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit overflow-x-auto max-w-full">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id ? "bg-[#2BB2A9] text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ══ STUDENTS ══ */}
        {activeTab === "students" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <form onSubmit={handleStudentSearch} className="flex gap-2 mb-5">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                <input value={studentSearch} onChange={e => setStudentSearch(e.target.value)}
                  placeholder="Search students by name, email, code…"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2BB2A9] focus:border-[#2BB2A9] outline-none transition" />
              </div>
              <button type="submit" className="px-4 py-2.5 bg-[#2BB2A9] hover:bg-[#2BB2A9] text-white text-xs font-bold rounded-xl transition">Search</button>
              {studentSearch && (
                <button type="button" onClick={() => { setStudentSearch(""); setStudentsPage(0); fetchStudents(0, ""); }}
                  className="px-4 py-2.5 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 transition">Clear</button>
              )}
            </form>

            {studentsLoading ? (
              <div className="flex justify-center py-12"><AiOutlineLoading3Quarters className="animate-spin text-2xl text-[#2BB2A9]" /></div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <FaUserGraduate className="text-4xl text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-500">No students found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {["Student", "Email", "Mobile", "Verified", "Status", ""].map(h => (
                          <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => (
                        <tr key={s.studentCode} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-[#2BB2A9] text-white flex items-center justify-center text-[10px] font-black">{initials(s.fullName)}</div>
                              <div className="min-w-0">
                                <p className="font-bold text-gray-800 truncate">{s.fullName}</p>
                                <p className="text-[10px] text-gray-400 font-mono">{s.studentCode}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-gray-600 truncate max-w-[180px]">{s.email}</td>
                          <td className="px-3 py-2.5 text-gray-600">{s.mobileNumber || "—"}</td>
                          <td className="px-3 py-2.5">
                            {s.emailVerified
                              ? <span className="text-emerald-600 text-xs font-bold">Yes</span>
                              : <span className="text-orange-500 text-xs font-bold">No</span>}
                          </td>
                          <td className="px-3 py-2.5"><StatusPill active={s.isActive} /></td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2 justify-end">
                              <button onClick={() => setEditingStudent(s.studentCode)}
                                className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#2BB2A9] transition" title="Edit">
                                <FaEdit size={11} />
                              </button>
                              <button onClick={() => handleToggleStudent(s.studentCode)} disabled={togglingCode === s.studentCode}
                                className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#2BB2A9] transition disabled:opacity-50"
                                title={s.isActive ? "Deactivate" : "Activate"}>
                                {togglingCode === s.studentCode
                                  ? <AiOutlineLoading3Quarters className="animate-spin" size={12} />
                                  : s.isActive ? <FaToggleOn className="text-emerald-500" size={16} /> : <FaToggleOff size={16} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={studentsPage} totalPages={studentsMeta.totalPages} last={studentsMeta.last} onChange={setStudentsPage} />
              </>
            )}
          </div>
        )}

        {/* ══ INSTRUCTORS ══ */}
        {activeTab === "instructors" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <form onSubmit={handleInstructorSearch} className="flex gap-2 mb-5">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                <input value={instructorSearch} onChange={e => setInstructorSearch(e.target.value)}
                  placeholder="Search instructors by name, email, code…"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2BB2A9] focus:border-[#2BB2A9] outline-none transition" />
              </div>
              <button type="submit" className="px-4 py-2.5 bg-[#2BB2A9] hover:bg-[#2BB2A9] text-white text-xs font-bold rounded-xl transition">Search</button>
              {instructorSearch && (
                <button type="button" onClick={() => { setInstructorSearch(""); setInstructorsPage(0); fetchInstructors(0, ""); }}
                  className="px-4 py-2.5 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 transition">Clear</button>
              )}
            </form>

            {instructorsLoading ? (
              <div className="flex justify-center py-12"><AiOutlineLoading3Quarters className="animate-spin text-2xl text-[#2BB2A9]" /></div>
            ) : instructors.length === 0 ? (
              <div className="text-center py-12">
                <FaChalkboardTeacher className="text-4xl text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-500">No instructors found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {["Instructor", "Email", "Code", ""].map(h => (
                          <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {instructors.map(inst => (
                        <tr key={inst.instructorCode} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition">
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black">{initials(inst.fullName)}</div>
                              <p className="font-bold text-gray-800 truncate">{inst.fullName}</p>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-gray-600 truncate max-w-[200px]">{inst.email}</td>
                          <td className="px-3 py-2.5 text-gray-400 font-mono text-xs">{inst.instructorCode}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2 justify-end">
                              <button onClick={() => setViewingProofsFor(inst.instructorCode)}
                                className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#2BB2A9] transition" title="View documents">
                                <FaFileAlt size={11} />
                              </button>
                              <button onClick={() => setEditingInstructor(inst.instructorCode)}
                                className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#2BB2A9] transition" title="Edit">
                                <FaEdit size={11} />
                              </button>
                              <button onClick={() => handleToggleInstructor(inst.instructorCode)} disabled={togglingCode === inst.instructorCode}
                                className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#2BB2A9] transition disabled:opacity-50"
                                title="Toggle status">
                                {togglingCode === inst.instructorCode
                                  ? <AiOutlineLoading3Quarters className="animate-spin" size={12} />
                                  : <FaToggleOn className="text-emerald-500" size={16} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={instructorsPage} totalPages={instructorsMeta.totalPages} last={instructorsMeta.last} onChange={setInstructorsPage} />
              </>
            )}
          </div>
        )}

        {/* ══ PROOFS ══ */}
        {activeTab === "proofs" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="text-sm font-black text-gray-900 mb-4">All Instructor Documents</h2>
            {proofsLoading ? (
              <div className="flex justify-center py-12"><AiOutlineLoading3Quarters className="animate-spin text-2xl text-[#2BB2A9]" /></div>
            ) : allProofs.length === 0 ? (
              <div className="text-center py-12">
                <FaFileAlt className="text-4xl text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-500">No documents uploaded yet</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allProofs.map(p => (
                    <div key={p.proofId} className="flex items-center justify-between gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{p.proofName}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">{p.proofType}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{p.instructorCode}</p>
                      </div>
                      {p.proofUrl && (
                        <a href={p.proofUrl} target="_blank" rel="noopener noreferrer" className="text-[#2BB2A9] hover:text-[#2BB2A9] flex-shrink-0">
                          <FaExternalLinkAlt size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
                <Pagination page={proofsPage} totalPages={proofsMeta.totalPages} last={proofsMeta.last} onChange={setProofsPage} />
              </>
            )}
          </div>
        )}
      </div>

      {editingStudent && (
        <EditUserModal code={editingStudent} kind="student" notify={notify}
          onClose={() => setEditingStudent(null)}
          onSaved={() => fetchStudents(studentsPage, studentSearch)} />
      )}
      {editingInstructor && (
        <EditUserModal code={editingInstructor} kind="instructor" notify={notify}
          onClose={() => setEditingInstructor(null)}
          onSaved={() => fetchInstructors(instructorsPage, instructorSearch)} />
      )}
      {viewingProofsFor && (
        <InstructorProofsModal instructorCode={viewingProofsFor} onClose={() => setViewingProofsFor(null)} />
      )}
      {showCreateInstructor && (
        <CreateInstructorModal notify={notify}
          onClose={() => setShowCreateInstructor(false)}
          onCreated={() => fetchInstructors(0, "")} />
      )}
    </div>
  );
}