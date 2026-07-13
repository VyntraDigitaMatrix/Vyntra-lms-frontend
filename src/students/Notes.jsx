import React, { useMemo, useState, useRef, useEffect } from "react";
import { studentNotesApi, studentLearningApi } from "./auth/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaPlus, FaTimes, FaStickyNote, FaUser, FaClock, FaSearch,
  FaSave, FaArrowLeft, FaTrash, FaEdit, FaEye, FaEllipsisH,
  FaSortAmountDown, FaBook, FaChevronLeft, FaChevronRight,
  FaArrowRight,
} from "react-icons/fa";

/* ═══════════════════════════════════
   NOTE VIEWER MODAL
═══════════════════════════════════ */
const NoteViewer = ({ note, onClose, onEdit }) => {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-widest mb-1">
              {note.courseName || "Personal Note"}
            </p>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{note.title}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <FaUser className="text-[10px]" /> {note.userName || "Unknown"}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <FaClock className="text-[10px]"/>{" "}
                {new Date(note.createdAt).toLocaleDateString("en-US", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => { onEdit(note); onClose(); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
            >
              <FaEdit className="text-[10px]" /> Edit
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-400 transition"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {note.description ? (
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{note.description}</p>
          ) : (
            <p className="text-gray-300 text-sm italic">No description provided.</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 text-sm transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════
   NOTE EDITOR
═══════════════════════════════════ */
const NoteEditor = ({ onSave, onCancel, editNote, defaultCourseId, defaultCourseName, enrolledCourses = [] }) => {
  const titleRef = useRef(null);
  const [title, setTitle] = useState(editNote?.title || "");
  const [description, setDescription] = useState(editNote?.description || "");
  const [courseId, setCourseId] = useState(editNote?.courseId || defaultCourseId || "");
  const [saved, setSaved] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const courseDropdownRef = useRef(null);

  // Derive display name from selected courseId
  const selectedCourseName = enrolledCourses.find(c => c.courseId === courseId)?.courseTitle
    || (courseId === defaultCourseId ? defaultCourseName : "");

  const filteredCourses = courseSearch
    ? enrolledCourses.filter(c =>
        (c.courseTitle || "").toLowerCase().includes(courseSearch.toLowerCase())
      )
    : enrolledCourses;

  useEffect(() => { titleRef.current?.focus(); }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (courseDropdownRef.current && !courseDropdownRef.current.contains(e.target)) {
        setShowCourseDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSave = () => {
    if (!title.trim()) {
      titleRef.current?.focus();
      titleRef.current?.classList.add("ring-2", "ring-red-400");
      setTimeout(() => titleRef.current?.classList.remove("ring-2", "ring-red-400"), 1500);
      return;
    }
    setSaved(true);
    setTimeout(() =>
      onSave({ 
        title: title.trim(), 
        description: description.trim(), 
        id: editNote?.id,
        courseId: courseId || null,
        courseName: selectedCourseName,
      }),
      500
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onCancel} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition px-2 py-1 rounded-lg hover:bg-gray-100">
              <FaArrowLeft className="text-xs" /> Back
            </button>
          </div>
          <input 
            ref={titleRef} 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Note title…"
            className="flex-1 text-xl font-bold text-gray-800 bg-transparent border-none outline-none placeholder-gray-300 min-w-0" 
          />
          <button 
            onClick={handleSave} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm flex-shrink-0 ${saved ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            <FaSave className="text-xs" />{saved ? "Saved!" : (editNote ? "Update" : "Save")}
          </button>
        </div>

        {/* Course selector – hidden while editing (courseId is fixed) */}
        {!editNote && (
          <div className="px-4 pb-3" ref={courseDropdownRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCourseDropdown(v => !v)}
                className="w-full sm:w-72 flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              >
                <FaBook className="text-blue-500 text-[10px] flex-shrink-0" />
                <span className={`flex-1 text-left truncate ${selectedCourseName ? "text-gray-800 font-medium" : "text-gray-400"}`}>
                  {selectedCourseName || "Select a course (optional)"}
                </span>
                <FaChevronRight className={`text-gray-400 text-[9px] flex-shrink-0 transition-transform ${showCourseDropdown ? "rotate-90" : ""}`} />
              </button>

              {showCourseDropdown && (
                <div className="absolute top-full mt-1 left-0 w-full sm:w-80 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {/* Search */}
                  <div className="px-3 pt-3 pb-2">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-[10px]" />
                      <input
                        type="text"
                        placeholder="Search courses…"
                        value={courseSearch}
                        onChange={e => setCourseSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-100 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-52 overflow-y-auto pb-2">
                    {/* None option */}
                    <button
                      type="button"
                      onClick={() => { setCourseId(""); setShowCourseDropdown(false); setCourseSearch(""); }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-left hover:bg-gray-50 transition ${
                        !courseId ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-500"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-[9px] flex-shrink-0">—</span>
                      No course (personal note)
                    </button>
                    {filteredCourses.length === 0 && (
                      <p className="text-center text-xs text-gray-400 py-4">No courses found</p>
                    )}
                    {filteredCourses.map(course => {
                      const id = course.courseId;
                      const name = course.courseTitle || "Untitled Course";
                      const isSelected = courseId === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => { setCourseId(id); setShowCourseDropdown(false); setCourseSearch(""); }}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-left hover:bg-blue-50 transition ${
                            isSelected ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] flex-shrink-0 ${
                            isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                          }`}>
                            {isSelected ? "✓" : <FaBook />}
                          </span>
                          <span className="truncate">{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Show fixed course label when editing */}
        {editNote && selectedCourseName && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg w-fit">
              <FaBook className="text-[10px]" />
              <span>Note for: <strong>{selectedCourseName}</strong></span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto flex justify-center px-4 py-8 bg-gray-100">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-xl min-h-[calc(100vh-220px)] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-2xl" />
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Write your note content here…"
              className="w-full min-h-[calc(100vh-240px)] px-8 sm:px-12 py-10 outline-none text-gray-800 leading-relaxed resize-none"
              style={{ fontFamily: "'Georgia', serif", fontSize: "16px", lineHeight: "1.9" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════
   MAIN NOTES COMPONENT
═══════════════════════════════════ */
const Notes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const courseFromModule = location.state?.course || null;
  const defaultCourseId = courseFromModule?.id || null;
  const defaultCourseName = courseFromModule?.name || "";

  const [sortType, setSortType] = useState("Latest");
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuNote, setActiveMenuNote] = useState(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [messageModal, setMessageModal] = useState({ show: false, type: "", message: "" });
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Fetch enrolled courses once for the course picker
  useEffect(() => {
    studentLearningApi.getMyEnrolledCourses(0, 100)
      .then(res => {
        const data = res.data;
        // studentLearningApi returns { data: { content: [...] } }
        const list = data?.data?.content || data?.content || [];
        setEnrolledCourses(list);
      })
      .catch(err => console.warn("[Notes] Failed to fetch enrolled courses:", err));
  }, []);

  const sortOptions = ["Latest", "Oldest", "A–Z", "Z–A"];

  // Filter notes for current page (6 per page)
  const getCurrentPageNotes = useMemo(() => {
    let data = [...notes];
    
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.description?.toLowerCase().includes(q) ||
          (n.userName || "").toLowerCase().includes(q) ||
          (n.courseName || "").toLowerCase().includes(q)
      );
    }
    
    if (sortType === "Latest") data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortType === "Oldest") data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortType === "A–Z") data.sort((a, b) => a.title?.localeCompare(b.title));
    else if (sortType === "Z–A") data.sort((a, b) => b.title?.localeCompare(a.title));
    
    return data;
  }, [notes, searchTerm, sortType]);

  // Pagination logic
  const ITEMS_PER_PAGE = 6;
  const totalFilteredItems = getCurrentPageNotes.length;
  const totalFilteredPages = Math.ceil(totalFilteredItems / ITEMS_PER_PAGE);
  const paginatedNotes = getCurrentPageNotes.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const fetchNotes = async (page = 0) => {
    try {
      setLoading(true);
      const response = await studentNotesApi.getNotes(defaultCourseId, page, 100);
      const data = response.data;
      setNotes(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(0);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, [defaultCourseId]);

  useEffect(() => {
    if (localStorage.getItem("openNoteEditor") === "true") {
      setShowEditor(true);
      localStorage.removeItem("openNoteEditor");
    }
  }, []);

  useEffect(() => {
    const handler = () => { setActiveMenuNote(null); setShowSortDropdown(false); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleSaveNote = async ({ title, description, id, courseId, courseName }) => {
    try {
      if (id) {
        const updatePayload = { title, description };
        await studentNotesApi.updateNote(id, updatePayload);
        setMessageModal({ show: true, type: "success", message: "Note updated successfully!" });
      } else {
        const createPayload = { title, description };
        // Only attach courseId if it's a valid string/uuid, not if it's empty or 1 (the old default)
        if (courseId && courseId !== 1) {
            createPayload.courseId = courseId;
        }
        await studentNotesApi.createNote(createPayload);
        setMessageModal({ show: true, type: "success", message: "Note created successfully!" });
      }
      setShowEditor(false);
      setEditingNote(null);
      fetchNotes(0);
    } catch (error) {
      console.error("Save Note Error:", error);
      setMessageModal({ show: true, type: "error", message: id ? "Failed to update note." : "Failed to create note." });
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await studentNotesApi.deleteNote(id);
      setActiveMenuNote(null);
      setMessageModal({ show: true, type: "success", message: "Note deleted successfully!" });
      fetchNotes(0);
    } catch (error) {
      setMessageModal({ show: true, type: "error", message: "Failed to delete note." });
    }
  };

  const openEditNote = (note) => { setEditingNote(note); setShowEditor(true); };
  const openViewNote = (note) => setViewingNote(note);

  const goToPage = (page) => {
    if (page >= 0 && page < totalFilteredPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const total = totalFilteredPages;
    if (total <= 5) {
      for (let i = 0; i < total; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 2) {
        for (let i = 0; i < 3; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(total - 1);
      } else if (currentPage >= total - 3) {
        pageNumbers.push(0);
        pageNumbers.push('...');
        for (let i = total - 3; i < total; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(0);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(total - 1);
      }
    }
    return pageNumbers;
  };

  const goBackToCourses = () => {
    navigate('/courses');
  };

  if (showEditor) {
    return (
      <NoteEditor
        onSave={handleSaveNote}
        onCancel={() => { setShowEditor(false); setEditingNote(null); }}
        editNote={editingNote}
        defaultCourseId={defaultCourseId}
        defaultCourseName={defaultCourseName}
        enrolledCourses={enrolledCourses}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Link to="/student/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-blue-600 transition">Courses</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Notes</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {defaultCourseName ? `${defaultCourseName} Notes` : "My Notes"}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {notes.length} note{notes.length !== 1 ? "s" : ""} saved
              </p>
            </div>
            <div className="flex items-center gap-3">
              {defaultCourseName && (
                <button
                  onClick={goBackToCourses}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition"
                >
                  <FaArrowLeft className="text-xs" /> Back to Courses
                </button>
              )}
              <button
                onClick={() => { setEditingNote(null); setShowEditor(true); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition shadow-sm shadow-blue-200"
              >
                <FaPlus className="text-xs" /> New Note
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
            <input
              type="text"
              placeholder="Search by title, description or author…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm text-gray-700 placeholder-gray-300 transition"
            />
          </div>
          <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="h-10 px-4 border border-gray-200 rounded-xl flex items-center gap-2 bg-white text-gray-600 hover:bg-gray-50 text-sm transition"
            >
              <FaSortAmountDown className="text-xs text-gray-400" />
              <span className="font-medium text-xs">{sortType}</span>
            </button>
            {showSortDropdown && (
              <div className="absolute top-12 right-0 w-36 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-1.5">
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortType(opt); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-xs transition ${sortType === opt ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          </div>
        ) : paginatedNotes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedNotes.map((note) => (
                <div
                  key={note.id}
                  className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col overflow-hidden"
                  onClick={() => openViewNote(note)}
                >
                  <div className="h-0.5 bg-gradient-to-r from-blue-400 to-blue-300" />

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h2 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors flex-1">
                        {note.title}
                      </h2>
                      <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuNote(activeMenuNote === note.id ? null : note.id);
                          }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition"
                        >
                          <FaEllipsisH className="text-xs" />
                        </button>
                        {activeMenuNote === note.id && (
                          <div className="absolute right-0 top-8 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1.5">
                            <button
                              onClick={() => { openViewNote(note); setActiveMenuNote(null); }}
                              className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                            >
                              <FaEye className="text-blue-400" /> View
                            </button>
                            <button
                              onClick={() => { openEditNote(note); setActiveMenuNote(null); }}
                              className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                            >
                              <FaEdit className="text-emerald-400" /> Edit
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2 transition"
                            >
                              <FaTrash className="text-[10px]" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {note.courseName && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <FaBook className="text-[9px] text-blue-300" />
                        <span className="text-[10px] font-medium text-blue-500 truncate">{note.courseName}</span>
                      </div>
                    )}

                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 flex-1">
                      {note.description || <span className="italic">No description.</span>}
                    </p>
                  </div>

                  <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-[8px] text-blue-400" />
                      </div>
                      <span className="text-[10px] font-medium text-gray-500 truncate">
                        {note.userName || "Unknown"}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-300 flex items-center gap-1 flex-shrink-0">
                      <FaClock className="text-[8px]" />
                      {new Date(note.createdAt).toLocaleDateString("en-US", {
                        day: "numeric", month: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalFilteredPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className={`px-3 py-2 rounded-xl border text-sm transition flex items-center gap-1 ${
                    currentPage === 0
                      ? "bg-gray-100 text-gray-300 cursor-not-allowed border-gray-100"
                      : "bg-white hover:bg-blue-50 hover:border-blue-300 text-gray-600"
                  }`}
                >
                  <FaChevronLeft className="text-xs" /> Prev
                </button>

                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400 text-sm">…</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-500 hover:bg-blue-50"
                      }`}
                    >
                      {page + 1}
                    </button>
                  )
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalFilteredPages - 1}
                  className={`px-3 py-2 rounded-xl border text-sm transition flex items-center gap-1 ${
                    currentPage === totalFilteredPages - 1
                      ? "bg-gray-100 text-gray-300 cursor-not-allowed border-gray-100"
                      : "bg-white hover:bg-blue-50 hover:border-blue-300 text-gray-600"
                  }`}
                >
                  Next <FaChevronRight className="text-xs" />
                </button>
              </div>
            )}

            {/* Showing results info */}
            <div className="text-center text-xs text-gray-400 mt-4">
              Showing {paginatedNotes.length} of {totalFilteredItems} notes
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaStickyNote className="text-2xl text-blue-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-600 mb-1">No notes found</h3>
            <p className="text-sm text-gray-400 mb-4">
              {searchTerm ? "Try a different search term." : "Create your first note to get started."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm text-blue-500 hover:text-blue-700 transition"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Success / Error modal */}
      {messageModal.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="w-80 bg-white rounded-2xl p-6 shadow-2xl text-center">
            <div
              className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-4 ${
                messageModal.type === "success" ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"
              }`}
            >
              {messageModal.type === "success" ? "✓" : "!"}
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              {messageModal.type === "success" ? "Done!" : "Error"}
            </h2>
            <p className="text-sm text-gray-400 mb-5">{messageModal.message}</p>
            <button
              onClick={() => setMessageModal({ show: false, type: "", message: "" })}
              className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm transition ${
                messageModal.type === "success" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* View Note Modal */}
      {viewingNote && (
        <NoteViewer
          note={viewingNote}
          onClose={() => setViewingNote(null)}
          onEdit={openEditNote}
        />
      )}

      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default Notes;