import React, { useState, useEffect } from 'react';
import { MdAdd, MdClose, MdSearch, MdCheck, MdPerson } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { instructorCourseApi } from "../auth/api";

/* ─── Add Authors Drawer (right panel) ─── */
const AddAuthorsDrawer = ({ courseSlug, existingIds, onClose, onAdded }) => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      try {
        const res = await instructorCourseApi.getAvailableInstructors?.();
        const list = res?.data?.data?.content || res?.data?.content || res?.data?.data || res?.data || [];
        // Do not filter out already added ones so we can show them as "already added"
        setInstructors(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to fetch instructors:", err);
        // Fallback: show empty list gracefully
        setInstructors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  const toggle = (id) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const handleSave = async () => {
    if (!selected.length) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        instructorIds: [...existingIds, ...selected],
      };
      console.log("courseSlug =", courseSlug);
      console.log("POST payload:", JSON.stringify(payload));
      await instructorCourseApi.updateCourseInstructors(courseSlug, payload);
      const added = instructors.filter(i => {
        const instId = i.instructorCode || i.id || i.instructorId || i.userId;
        return selected.includes(instId);
      });
      onAdded(added);
      onClose();
    } catch (err) {
      console.error("updateCourseInstructors error:", err?.response?.data);
      setError(err?.response?.data?.message || JSON.stringify(err?.response?.data) || "Failed to add authors.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = instructors.filter(i =>
    (i.fullName || i.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (i.gmail || i.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Right Drawer */}
      <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Authors</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select authors from the list to add to the course
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition flex-shrink-0 mt-0.5"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search instructors…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <AiOutlineLoading3Quarters className="animate-spin text-2xl text-violet-500" />
              <p className="text-sm text-gray-400">Loading instructors…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                <MdPerson className="text-3xl text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                {search ? "No instructors found" : "No instructors available"}
              </p>
              {search && (
                <p className="text-xs text-gray-400">Try a different search term</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(instructor => {
                const instId = instructor.instructorCode || instructor.id || instructor.instructorId || instructor.userId;
                const isAlreadyAdded = existingIds.includes(instId);
                const isSelected = selected.includes(instId) || isAlreadyAdded;
                const name = instructor.fullName || instructor.name || "Unknown";
                const email = instructor.gmail || instructor.email || "";
                const avatar = instructor.profilePic || instructor.avatarUrl || null;
                const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

                return (
                  <button
                    key={instId}
                    type="button"
                    onClick={isAlreadyAdded ? undefined : () => toggle(instId)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition text-left ${
                      isAlreadyAdded 
                        ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                        : isSelected
                          ? "border-violet-400 bg-violet-50"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm">
                          {initials}
                        </div>
                      )}
                      {/* Check indicator */}
                      {isSelected && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-violet-500 border-2 border-white flex items-center justify-center">
                          <MdCheck className="text-white text-[10px]" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isSelected && !isAlreadyAdded ? "text-violet-700" : "text-gray-800"}`}>
                        {name} {isAlreadyAdded && <span className="text-xs font-normal text-gray-500 ml-1">(Already added)</span>}
                      </p>
                      {email && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{email}</p>
                      )}
                    </div>

                    {/* Right check */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${isSelected ? "border-violet-500 bg-violet-500" : "border-gray-300"
                      }`}>
                      {isSelected && <MdCheck className="text-white text-[10px]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={!selected.length || saving}
            className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            {saving && <AiOutlineLoading3Quarters className="animate-spin text-sm" />}
            {saving ? "Adding…" : `SAVE${selected.length > 0 ? ` (${selected.length})` : ""}`}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition"
          >
            CANCEL
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Main AuthorsPage ─── */
const AuthorsPage = ({ courseSlug, course, data, setData }) => {
  const [authors, setAuthors] = useState(
    (course?.instructors || course?.authors || []).map(i => ({
      id: i.instructorCode || i.id, // Prefer instructorCode as the primary identifier
      name: i.fullName || i.name || "Unknown",
      email: i.gmail || i.email || "",
      role: "Instructor",
    }))
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdded = (newAuthors) => {
    const updated = [
      ...authors,
      ...newAuthors.map(i => ({
        id: i.instructorCode || i.id, // Prefer instructorCode
        name: i.fullName || i.name || "Unknown",
        email: i.gmail || i.email || "",
        role: "Instructor",
      })),
    ];
    setAuthors(updated);

    // Keep parent courseData synced
    setData?.(prev => ({
      ...prev,
      authors: updated.map(a => ({
        id: a.id,
        fullName: a.name,
        gmail: a.email,
      })),
    }));

    showToast(
      `${newAuthors.length} author${newAuthors.length > 1 ? "s" : ""} added successfully!`
    );
  };

  const handleRemove = async (authorId, idx) => {
    setRemoving(idx);
    try {
      await instructorCourseApi.deleteCourseInstructor(courseSlug, authorId);
      const remaining = authors.filter((_, i) => i !== idx);
      setAuthors(remaining);

      // Keep parent courseData synced
      setData?.(prev => ({
        ...prev,
        authors: remaining.map(a => ({
          id: a.id,
          fullName: a.name,
          gmail: a.email,
        })),
      }));

      showToast("Author removed.");
    } catch (err) {
      console.error("handleRemove error:", err?.response?.data);
      showToast(err?.response?.data?.message || JSON.stringify(err?.response?.data) || "Failed to remove author.", "error");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium
          ${toast.type === "success" ? "bg-white border-emerald-200 text-emerald-700" : "bg-white border-red-200 text-red-600"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
          <button onClick={() => setToast(null)} className="ml-1 text-gray-400">&times;</button>
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <AddAuthorsDrawer
          courseSlug={courseSlug}
          existingIds={authors.filter(a => a.id).map(a => a.id)}
          onClose={() => setDrawerOpen(false)}
          onAdded={handleAdded}
        />
      )}

      {/* Page content */}
      <div >
        {/* Header row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Authors</h2>
            <p className="text-sm text-gray-500 mt-1">Add authors associated with the course</p>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition shadow-sm shadow-green-200"
          >
            <MdAdd className="text-base" /> Add Authors
          </button>
        </div>

        {/* Authors list */}
        {authors.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 mb-5 opacity-30">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="40" r="22" fill="#d1d5db" />
                <ellipse cx="60" cy="95" rx="38" ry="18" fill="#d1d5db" />
                <circle cx="88" cy="32" r="14" fill="#e5e7eb" />
                <ellipse cx="88" cy="70" rx="22" ry="11" fill="#e5e7eb" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-600 mb-1">Add Authors</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              Add authors associated with the product
            </p>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition shadow-sm shadow-green-100"
            >
              <MdAdd className="text-base" /> ADD AUTHORS
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl">
            {authors.map((author, i) => {
              const initials = (author.name || "?")
                .split(" ")
                .map(n => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={author.id || i}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{author.name}</p>
                    <p className="text-xs text-gray-400 truncate">{author.email || author.role || "Instructor"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(author.id, i)}
                    disabled={removing === i}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  >
                    {removing === i
                      ? <AiOutlineLoading3Quarters className="animate-spin text-sm text-gray-400" />
                      : <MdClose className="text-base" />}
                  </button>
                </div>
              );
            })}

            {/* Add more */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="w-full flex items-center justify-center gap-2 p-3.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-violet-300 hover:text-violet-500 hover:bg-violet-50/30 transition"
            >
              <MdAdd /> Add more authors
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorsPage;