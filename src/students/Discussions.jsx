import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaComments, FaUsers, FaPaperPlane, FaArrowLeft,
  FaCheck, FaSpinner, FaClock, FaReply, FaTrash,
  FaEye, FaTimes, FaSignOutAlt, FaChevronRight
} from "react-icons/fa";
import { discussionApi } from "./auth/api";

/* ─── Helpers ─────────────────────────────────────────────── */
const fmt = (dateStr) => {
  if (!dateStr) return "";

  const utcDateStr =
    dateStr.endsWith("Z") || dateStr.includes("+")
      ? dateStr
      : `${dateStr}Z`;

  const d = new Date(utcDateStr);
  const now = new Date();

  const diff = Math.max(0, (now.getTime() - d.getTime()) / 1000);

  if (diff < 60) {
    return "just now";
  }

  if (diff < 3600) {
    return `${Math.floor(diff / 60)}m ago`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h ago`;
  }

  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
};

const avatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=1D4ED8&color=fff&size=80`;


const CHANNEL_PALETTE = [
  { bg: "bg-[#043573]", soft: "bg-[#043573]/10", text: "text-[#043573]" },
  { bg: "bg-[#043573]/80", soft: "bg-[#043573]/10", text: "text-[#043573]/80" },
  { bg: "bg-[#043573]/60", soft: "bg-[#043573]/10", text: "text-[#043573]/60" },
  { bg: "bg-[#043573]/40", soft: "bg-[#043573]/10", text: "text-[#043573]/40" },
  { bg: "bg-blue-800", soft: "bg-blue-50", text: "text-blue-800" },
  { bg: "bg-indigo-500", soft: "bg-indigo-50", text: "text-indigo-600" },
];

const channelStyle = (name = "") => {
  const sum = [...name].reduce((s, c) => s + c.charCodeAt(0), 0);
  return CHANNEL_PALETTE[sum % CHANNEL_PALETTE.length];
};

const initials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/* ─── Role Badge ──────────────────────────────────────────── */
const RoleBadge = ({ role }) => {
  if (role === "INSTRUCTOR")
    return <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">Instructor</span>;
  if (role === "ADMIN")
    return <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-semibold">Admin</span>;
  return null;
};

/* ─── System Message ──────────────────────────────────────── */
const SystemMessage = ({ content }) => (
  <div className="flex justify-center my-1">
    <span className="text-[11px] text-gray-400 bg-gray-100 rounded-full px-3 py-1 italic">{content}</span>
  </div>
);

/* ─── Chat Message ────────────────────────────────────────── */
const ChatMessage = ({ msg, currentUserId, onDelete, onReply }) => {
  const isOwn = String(msg.senderId) === String(currentUserId);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={msg.senderProfileImage || avatar(msg.senderName)}
        alt={msg.senderName}
        className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm flex-shrink-0 self-end"
      />

      <div className={`flex flex-col max-w-[72%] sm:max-w-[60%] ${isOwn ? "items-end" : "items-start"}`}>
        <div className={`flex items-center gap-1.5 mb-1 ${isOwn ? "mr-1 flex-row-reverse" : "ml-1"}`}>
          <span className="text-xs font-semibold text-gray-700">{isOwn ? "You" : msg.senderName}</span>
          <RoleBadge role={msg.senderRole} />
        </div>

        {msg.replyToMessageId && (
          <div className={`text-[11px] px-3 py-1.5 rounded-xl mb-1 border-l-2 ${isOwn ? "border-[#043573] bg-[#043573]/10 text-[#043573]" : "border-gray-300 bg-gray-100 text-gray-600"}`}>
            <span className="font-semibold block">{msg.replyToSenderName}</span>
            <span className="line-clamp-1">{msg.replyToMessageContent}</span>
          </div>
        )}

        <div className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
          ${isOwn
            ? "bg-[#043573] text-white rounded-br-sm"
            : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
          }
          ${msg.deleted ? "opacity-60 italic" : ""}
        `}>
          {msg.deleted ? "This message was deleted." : (
            <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
          )}
          {msg.edited && !msg.deleted && (
            <span className={`text-[9px] ml-1 ${isOwn ? "text-[#043573]" : "text-gray-400"}`}>(edited)</span>
          )}
        </div>

        <div className={`flex items-center gap-2 mt-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] text-gray-400">{fmt(msg.createdAt)}</span>
          {msg.seenCount > 0 && isOwn && (
            <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
              <FaEye size={9} /> {msg.seenCount}
            </span>
          )}
        </div>
      </div>

      {hovered && !msg.deleted && (
        <div className={`flex items-center gap-1 self-center ${isOwn ? "flex-row-reverse" : "flex-row"
          }`}>
          <button
            onClick={() => onReply(msg)}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
            title="Reply"
          >
            <FaReply size={10} />
          </button>

          <button
            onClick={() => onDelete(msg.messageId)}
            className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-400 transition"
            title="Delete"
          >
            <FaTrash size={10} />
          </button>
        </div>
      )}
    </div>
  );
};

/* ─── Discussion Chat ─────────────────────────────────────── */
const DiscussionChat = ({ discussion, currentUserId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const style = channelStyle(discussion.groupName || discussion.courseTitle || "");

  const fetchMessages = useCallback(async () => {
    try {
      const res = await discussionApi.getMessages(discussion.slug, 0, 100);
      if (res.data.success) {
        const sorted = [...res.data.data.content].reverse();
        setMessages(sorted);
        for (const msg of res.data.data.content) {
          if (msg.seenCount === 0 && msg.senderId !== currentUserId) {
            discussionApi.markMessageAsSeen(msg.messageId).catch(() => { });
          }
        }
      }
    } catch (err) {
      console.error("fetchMessages:", err);
    }
  }, [discussion.slug, currentUserId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const payload = {
        content: input.trim(),
        type: "CHAT",
        ...(replyTo ? { replyToMessageId: replyTo.messageId } : {})
      };
      const res = await discussionApi.sendMessage(discussion.slug, payload);
      if (res.data.success) {
        setMessages(prev => [...prev, res.data.data]);
        setInput("");
        setReplyTo(null);
        inputRef.current?.focus();
      }
    } catch (err) {
      console.error("sendMessage:", err);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      const res = await discussionApi.deleteMessage(messageId);
      if (res.data.success) {
        setMessages(prev => prev.map(m =>
          m.messageId === messageId ? { ...m, deleted: true, content: "" } : m
        ));
      }
    } catch (err) {
      console.error("deleteMessage:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    if (e.key === "Escape" && replyTo) setReplyTo(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50" style={{ animation: "slideUp 0.2s ease" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3 px-4 py-3 max-w-4xl mx-auto w-full">
          <button onClick={onClose}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition px-2 py-1 rounded-lg hover:bg-gray-100 flex-shrink-0">
            <FaArrowLeft size={12} /> Back
          </button>
          <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
          <div className={`w-8 h-8 rounded-lg ${style.bg} text-white flex items-center justify-center text-[11px] font-black flex-shrink-0`}>
            {initials(discussion.groupName || discussion.courseTitle)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-gray-800 truncate">
              {discussion.groupName || discussion.courseTitle}
            </h2>
          </div>
          <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
            <FaUsers size={10} /> {discussion.totalMembers} members
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3 max-w-4xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <FaComments className="text-4xl mx-auto mb-2 opacity-30" />
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => {
          if (msg.type === "SYSTEM") return <SystemMessage key={msg.messageId} content={msg.content} />;
          return (
            <ChatMessage
              key={msg.messageId}
              msg={msg}
              currentUserId={currentUserId}
              onDelete={handleDelete}
              onReply={setReplyTo}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply preview */}
      {replyTo && (
        <div className="bg-[#043573]/10 border-t border-[#043573] px-4 py-2 flex items-center gap-2 max-w-4xl mx-auto w-full">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#043573]">{replyTo.senderName}</p>
            <p className="text-xs text-[#043573]/80 truncate">{replyTo.content}</p>
          </div>
          <button onClick={() => setReplyTo(null)} className="text-[#043573] hover:text-[#043573]/80 flex-shrink-0">
            <FaTimes size={14} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-3 sm:px-6 py-3 flex-shrink-0">
        <div className="flex items-end gap-2 sm:gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={replyTo ? `Replying to ${replyTo.senderName}...` : "Write a message... (Enter to send)"}
              rows={1}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#F39C12] outline-none text-sm resize-none overflow-hidden"
              style={{ minHeight: "42px", maxHeight: "120px" }}
              onInput={e => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm flex-shrink-0
              ${input.trim() && !sending ? "bg-[#043573] hover:bg-[#043573]/80 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            {sending ? <FaSpinner className="animate-spin" size={13} /> : <FaPaperPlane size={13} />}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

/* ─── Discussion Card — channel row, replaces the gradient-strip card ── */
const DiscussionCard = ({ discussion, onJoin, onOpen, onLeave }) => {
  const [joining, setJoining] = useState(false);
  const style = channelStyle(discussion.groupName || discussion.courseTitle || "");

  const handleJoin = async (e) => {
    e.stopPropagation();
    setJoining(true);
    await onJoin(discussion.slug);
    setJoining(false);
  };

  const handleLeaveClick = (e) => {
    e.stopPropagation();
    onLeave(discussion.slug);
  };

  return (
    <div
      onClick={() => discussion.joined && onOpen(discussion)}
      className={`w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#043573] transition-all duration-200 p-4 sm:p-5 flex items-center gap-4
        ${discussion.joined ? "cursor-pointer" : ""}`}
    >
      <div className={`w-12 h-12 rounded-xl ${style.bg} text-white flex items-center justify-center text-sm font-black flex-shrink-0 shadow-sm`}>
        {initials(discussion.groupName || discussion.courseTitle)}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-gray-800 truncate">
          {discussion.groupName || discussion.courseTitle}
        </h3>
        {discussion.courseTitle && discussion.groupName !== discussion.courseTitle && (
          <p className="text-[11px] text-gray-400">{discussion.courseTitle}</p>
        )}
        {discussion.latestMessage ? (
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
            <span className="font-medium text-gray-600">
              Latest:
            </span>
            {discussion.latestMessage}
          </p>
        ) : (
          <p className="text-xs text-gray-400 italic mt-0.5">
            No messages yet — start the conversation!
          </p>
        )}
        <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1.5">
          <span className="flex items-center gap-1"><FaUsers size={9} /> {discussion.totalMembers ?? 0} members</span>
          {discussion.latestMessageTime && (
            <span className="hidden sm:flex items-center gap-1"><FaClock size={9} /> {fmt(discussion.latestMessageTime)}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {discussion.joined ? (
          <>
            <button
              onClick={handleLeaveClick}
              className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
              title="Leave group"
            >
              <FaSignOutAlt size={12} />
            </button>
            <div className={`w-8 h-8 rounded-full ${style.soft} ${style.text} flex items-center justify-center`}>
              <FaChevronRight size={11} />
            </div>
          </>
        ) : (
          <button
            onClick={handleJoin}
            disabled={joining}
            className="px-4 py-1.5 bg-[#043573] hover:bg-[#043573]/90 disabled:bg-blue-300 text-white rounded-full text-xs font-semibold transition shadow-sm flex items-center gap-1.5"
          >
            {joining ? <FaSpinner className="animate-spin" size={11} /> : <FaCheck size={11} />}
            {joining ? "Joining..." : "Join Group"}
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Main Discussions Page ───────────────────────────────── */
function Discussions() {
  const [groups, setGroups] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("student_userId") || null;

  const fetchGroups = useCallback(async () => {
    setLoading(true);

    try {
      const res = await discussionApi.getGroups(0, 100);

      if (res.data.success) {
        const groupList = res.data.data.content || [];

        const groupsWithLatestMessage = await Promise.all(
          groupList.map(async (group) => {

            if (!group.joined) {
              return group;
            }

            try {
              const messageRes = await discussionApi.getMessages(
                group.slug,
                0,
                1
              );

              if (messageRes.data.success) {
                const messages = messageRes.data.data.content || [];

                // API pagination normally returns newest message first
                const latestMessage = messages[0];

                if (latestMessage) {
                  return {
                    ...group,
                    latestMessage: latestMessage.deleted
                      ? "This message was deleted."
                      : latestMessage.content,
                    latestMessageTime: latestMessage.createdAt,
                  };
                }
              }
            } catch (error) {
              console.error(
                `Failed to fetch latest message for ${group.slug}:`,
                error
              );
            }

            return group;
          })
        );

        setGroups(groupsWithLatestMessage);
      }
    } catch (err) {
      console.error("fetchGroups:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const handleJoin = async (slug) => {
    try {
      const res = await discussionApi.joinGroup(slug);
      if (res.data.success) {
        setGroups(prev => prev.map(g =>
          g.slug === slug ? { ...g, joined: true, totalMembers: (g.totalMembers || 0) + 1 } : g
        ));
        const group = groups.find(g => g.slug === slug);
        if (group) setActiveChat({ ...group, joined: true });
      }
    } catch (err) {
      console.error("joinGroup:", err);
    }
  };

  const handleLeave = async (slug) => {
    if (!window.confirm("Leave this discussion group?")) return;
    try {
      const res = await discussionApi.leaveGroup(slug);
      if (res.data.success) {
        setGroups(prev => prev.map(g =>
          g.slug === slug ? { ...g, joined: false, totalMembers: Math.max((g.totalMembers || 1) - 1, 0) } : g
        ));
      }
    } catch (err) {
      console.error("leaveGroup:", err);
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

  const joinedCount = groups.filter(g => g.joined).length;
  const totalMembersReached = groups.reduce((s, g) => s + (g.totalMembers || 0), 0);
  const activeToday = groups.filter(g => {
    if (!g.latestMessageTime) return false;
    return (Date.now() - new Date(g.latestMessageTime).getTime()) / 3600000 < 24;
  }).length;

  const statCards = [
    { label: "My Groups", value: joinedCount, icon: <FaComments />, iconBg: "bg-blue-50 text-[#043573]" },
    { label: "Total Groups", value: groups.length, icon: <FaUsers />, iconBg: "bg-purple-50 text-purple-600" },
    { label: "Active Today", value: activeToday, icon: <FaClock />, iconBg: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-slate-50/60 max-w-7xl mx-auto space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-xs">
          <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <Link to="/student/dashboard" className="hover:text-[#043573] transition">Dashboard</Link>
            <span>&gt;</span>
            <span className="text-slate-700 font-semibold">Discussions</span>
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Course Discussions</h1>
          <p className="text-xs text-slate-500 mt-1">Connect with instructors and peers — ask questions and share insights.</p>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-3 gap-4">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200/70 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-xs hover:shadow-md transition-all">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg ${s.iconBg} shrink-0 font-bold`}>{s.icon}</div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">{s.label}</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 leading-none mt-1">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Channel list */}
        {loading ? (
          <div className="text-center py-16">
            <FaSpinner className="animate-spin text-[#043573] text-3xl mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading discussion groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xs border border-slate-200/70">
            <FaComments className="text-4xl text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 mb-1">No discussion groups found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">Your enrolled courses will appear here once they have discussion groups enabled.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {groups.map(g => (
              <DiscussionCard
                key={g.id}
                discussion={g}
                onJoin={handleJoin}
                onOpen={setActiveChat}
                onLeave={handleLeave}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}

export default Discussions;