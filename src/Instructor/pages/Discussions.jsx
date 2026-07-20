import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaComments, FaUsers, FaClock,
  FaSpinner, FaPlus, FaTimes, FaSearch,
} from "react-icons/fa";
import { discussionApi, instructorCourseApi } from "../auth/api";
import DiscussionChat from "../components/Discussions/DiscussionChat";
import DiscussionCard from "../components/Discussions/DiscussionCard";

function Discussions() {
  const [groups, setGroups] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");
  const [creating, setCreating] = useState(null);
  const [createError, setCreateError] = useState("");
  const currentUserId = localStorage.getItem("instructor_userId") || null;

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await discussionApi.getMyGroups(0, 100);
      if (res.data.success) {
        setGroups(res.data.data.content);
      }
    } catch (err) {
      console.error("fetchGroups:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const fetchCourses = useCallback(async () => {
    setCoursesLoading(true);
    try {
      const res = await instructorCourseApi.getInstructorCourses(0, 200);
      if (res.data.success) {
        setCourses(res.data.data.content || []);
      }
    } catch (err) {
      console.error("fetchCourses:", err);
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  const openCreateModal = () => {
    setShowCreateModal(true);
    setCourseSearch("");
    setCreateError("");
    setCreating(null);
    fetchCourses();
  };

  const handleCreateDiscussion = async (courseId) => {
    setCreating(courseId);
    setCreateError("");
    try {
      const alreadyJoinedGroup = groups.find(g => g.courseId === courseId);
      if (alreadyJoinedGroup) {
        setActiveChat(alreadyJoinedGroup);
        setShowCreateModal(false);
        return;
      }

      const allGroupsRes = await discussionApi.getGroups(0, 100);
      if (allGroupsRes.data.success) {
        const publicGroups = allGroupsRes.data.data.content;
        const targetGroup = publicGroups.find(g => g.courseId === courseId);

        if (targetGroup) {
          await discussionApi.joinGroup(targetGroup.slug);
          setGroups(prev => [{ ...targetGroup, joined: true }, ...prev]);
          setShowCreateModal(false);
        } else {
          const courseObj = courses.find(c => (c.courseId || c.id) === courseId);
          if (courseObj && courseObj.title) {
            const guessedSlug = courseObj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + "-discussion";
            try {
              const joinRes = await discussionApi.joinGroup(guessedSlug);
              if (joinRes.data.success) {
                setGroups(prev => [{ ...joinRes.data.data, joined: true }, ...prev]);
                setShowCreateModal(false);
                return;
              }
            } catch (fallbackErr) {
              console.error("Fallback join failed:", fallbackErr);
            }
          }
          setCreateError("This course doesn't have a discussion group yet. Please ask an Admin to create it.");
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to join discussion group.";
      setCreateError(msg);
      console.error("joinDiscussion:", err);
    } finally {
      setCreating(null);
    }
  };

  const filteredCourses = courses.filter(c =>
    (c.title || "").toLowerCase().includes(courseSearch.toLowerCase())
  );

  const handleOpen = async (discussion) => {
    if (!discussion.joined) {
      setJoiningId(discussion.id);
      try {
        await discussionApi.joinGroup(discussion.slug);
        setGroups(prev => prev.map(g =>
          g.id === discussion.id ? { ...g, joined: true, totalMembers: (g.totalMembers || 0) + 1 } : g
        ));
        setActiveChat({ ...discussion, joined: true });
      } catch (err) {
        console.error("joinGroup failed:", err);
        setActiveChat(discussion);
      } finally {
        setJoiningId(null);
      }
    } else {
      setActiveChat(discussion);
    }
  };

  if (activeChat) {
    return (
      <DiscussionChat
        discussion={activeChat}
        currentUserId={currentUserId}
        onClose={() => { setActiveChat(null); fetchGroups(); }}
      />
    );
  }

  const totalMembersReached = groups.reduce((s, g) => s + (g.totalMembers || 0), 0);
  const activeToday = groups.filter(g => {
    if (!g.latestMessageTime) return false;
    return (Date.now() - new Date(g.latestMessageTime).getTime()) / 3600000 < 24;
  }).length;

  const statCards = [
    { label: "Discussion Groups", value: groups.length, icon: <FaComments />, iconBg: "bg-violet-50", iconColor: "text-violet-500" },
    { label: "Members Reached", value: totalMembersReached, icon: <FaUsers />, iconBg: "bg-indigo-50", iconColor: "text-indigo-500" },
    { label: "Active Today", value: activeToday, icon: <FaClock />, iconBg: "bg-teal-50", iconColor: "text-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header — plain, on-brand with the rest of the instructor app */}
        <div className="flex items-start justify-between gap-4">
          <div className="text-sm text-gray-400">
            <Link to="/instructor/dashboard" className="hover:text-violet-600 transition text-sm">Dashboard</Link>
            <span className="mx-2 text-sm">&gt;</span>
            <span className="text-gray-600 font-medium text-sm">Discussions</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-3">Course Discussions</h1>
            <p className="text-sm text-slate-500 mt-0.5">Engage with your students, answer questions, and foster learning.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-violet-200 flex-shrink-0"
          >
            <FaPlus size={12} /> Add Discussion
          </button>
        </div>

        {/* Stat cards — same visual language as the rest of the app, not a banner */}
        <div className="grid grid-cols-3 gap-3">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${s.iconBg} ${s.iconColor} flex-shrink-0`}>{s.icon}</div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{s.label}</p>
                <p className="text-2xl font-black text-slate-900 leading-none mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Channel list */}
        {loading ? (
          <div className="text-center py-16">
            <FaSpinner className="animate-spin text-violet-500 text-3xl mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-dashed border-slate-300">
            <FaComments className="text-4xl text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-600 mb-1">No discussion groups yet</h3>
            <p className="text-sm text-gray-400 mb-5">Add a discussion group for one of your courses to get started.</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              <FaPlus size={11} /> Add Discussion
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map(g => (
              <DiscussionCard
                key={g.id}
                discussion={g}
                onOpen={handleOpen}
                loading={joiningId === g.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Discussion Modal — plain header, violet accent, matches app system */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} style={{ animation: "fadeIn 0.15s ease" }}>
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[95%] max-w-lg mx-auto overflow-hidden"
            onClick={e => e.stopPropagation()}
            style={{ animation: "scaleIn 0.2s ease" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0">
                  <FaComments size={14} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900">Create Discussion Group</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Select a course to create a discussion group</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="px-5 pt-4 pb-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={e => setCourseSearch(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 outline-none transition"
                  autoFocus
                />
              </div>
            </div>

            {createError && (
              <div className="mx-5 mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                {createError}
              </div>
            )}

            <div className="px-5 pb-5 max-h-[340px] overflow-y-auto">
              {coursesLoading ? (
                <div className="text-center py-10">
                  <FaSpinner className="animate-spin text-violet-500 text-xl mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Loading courses...</p>
                </div>
              ) : filteredCourses.length === 0 ? (
                <p className="text-center py-6 text-sm text-gray-400">No courses found matching "{courseSearch}"</p>
              ) : (
                <div className="space-y-2 mt-2">
                  {filteredCourses.map(c => (
                    <div key={c.id || c.courseId} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-violet-200 hover:bg-violet-50/50 transition group">
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="text-sm font-bold text-gray-800 truncate">{c.title}</p>
                        {c.category && <p className="text-[10px] text-gray-400 mt-0.5 truncate">{c.category}</p>}
                      </div>
                      <button
                        onClick={() => handleCreateDiscussion(c.id || c.courseId)}
                        disabled={creating === (c.id || c.courseId)}
                        className="px-3 py-1.5 text-xs font-semibold bg-violet-100 text-violet-700 hover:bg-violet-200 rounded-lg transition disabled:opacity-50 whitespace-nowrap"
                      >
                        {creating === (c.id || c.courseId) ? "Joining..." : "Select"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

export default Discussions;