import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaComments, FaUsers, FaPaperPlane, FaArrowLeft,
  FaSpinner, FaClock, FaReply, FaTrash,
  FaEye, FaTimes, FaSignOutAlt
} from "react-icons/fa";
import { discussionApi } from "../auth/api";

/* ─── Helpers ─────────────────────────────────────────────── */
const fmt = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const avatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=7C3AED&color=fff&size=80`;

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
  const isOwn = msg.senderId === currentUserId;
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
        {!isOwn && (
          <div className="flex items-center gap-1.5 mb-1 ml-1">
            <span className="text-xs font-semibold text-gray-700">{msg.senderName}</span>
            <RoleBadge role={msg.senderRole} />
          </div>
        )}

        {msg.replyToMessageId && (
          <div className={`text-[11px] px-3 py-1.5 rounded-xl mb-1 border-l-2 ${isOwn ? "border-purple-400 bg-purple-50 text-purple-700" : "border-gray-300 bg-gray-100 text-gray-600"}`}>
            <span className="font-semibold block">{msg.replyToSenderName}</span>
            <span className="line-clamp-1">{msg.replyToMessageContent}</span>
          </div>
        )}

        <div className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
          ${isOwn ? "bg-purple-600 text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"}
          ${msg.deleted ? "opacity-60 italic" : ""}
        `}>
          {msg.deleted ? "This message was deleted." : (
            <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
          )}
          {msg.edited && !msg.deleted && (
            <span className={`text-[9px] ml-1 ${isOwn ? "text-purple-200" : "text-gray-400"}`}>(edited)</span>
          )}
        </div>

        <div className={`flex items-center gap-2 mt-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] text-gray-400">{fmt(msg.createdAt)}</span>
          {msg.seenCount > 0 && isOwn && (
            <span className="flex items-center gap-0.5 text-[10px] text-purple-500">
              <FaEye size={9} /> {msg.seenCount}
            </span>
          )}
        </div>
      </div>

      {hovered && !msg.deleted && (
        <div className={`flex items-center gap-1 self-center ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          <button onClick={() => onReply(msg)} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition" title="Reply">
            <FaReply size={10} />
          </button>
          {isOwn && (
            <button onClick={() => onDelete(msg.messageId)} className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-400 transition" title="Delete">
              <FaTrash size={10} />
            </button>
          )}
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

  const fetchMessages = useCallback(async () => {
    try {
      const res = await discussionApi.getMessages(discussion.slug, 0, 100);
      if (res.data.success) {
        const sorted = [...res.data.data.content].reverse();
        setMessages(sorted);
        for (const msg of res.data.data.content) {
          if (msg.seenCount === 0 && msg.senderId !== currentUserId) {
            discussionApi.markMessageAsSeen(msg.messageId).catch(() => {});
          }
        }
      }
    } catch (err) {
      console.error("fetchMessages:", err);
    }
  }, [discussion.slug, currentUserId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3 px-4 py-3 max-w-4xl mx-auto w-full">
          <button onClick={onClose} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition px-2 py-1 rounded-lg hover:bg-gray-100 flex-shrink-0">
            <FaArrowLeft size={12} /> Back
          </button>
          <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-gray-800 truncate">{discussion.groupName || discussion.courseTitle}</h2>
          </div>
          <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
            <FaUsers size={10} /> {discussion.totalMembers} members
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3 max-w-4xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <FaComments className="text-4xl mx-auto mb-2 opacity-30" />
            <p className="text-sm">No messages yet. Start moderating!</p>
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

      {replyTo && (
        <div className="bg-purple-50 border-t border-purple-200 px-4 py-2 flex items-center gap-2 max-w-4xl mx-auto w-full">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-purple-700">{replyTo.senderName}</p>
            <p className="text-xs text-purple-600 truncate">{replyTo.content}</p>
          </div>
          <button onClick={() => setReplyTo(null)} className="text-purple-400 hover:text-purple-600 flex-shrink-0">
            <FaTimes size={14} />
          </button>
        </div>
      )}

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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-sm resize-none overflow-hidden"
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
              ${input.trim() && !sending ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
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

/* ─── Discussion Card ─────────────────────────────────────── */
const DiscussionCard = ({ discussion, onOpen, onLeave }) => (
  <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden">
    <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-600" />
    <div className="p-4 sm:p-5">
      <div className="mb-3">
        <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1">
          {discussion.groupName || discussion.courseTitle}
        </h3>
        {discussion.courseTitle && discussion.groupName !== discussion.courseTitle && (
          <p className="text-[11px] text-gray-400 mb-1">{discussion.courseTitle}</p>
        )}
        {discussion.latestMessage ? (
          <p className="text-xs text-gray-500 line-clamp-2">
            <span className="font-medium text-gray-600">Latest: </span>{discussion.latestMessage}
          </p>
        ) : (
          <p className="text-xs text-gray-400 italic">No messages yet</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1"><FaUsers size={9} /> {discussion.totalMembers ?? 0} members</span>
          {discussion.latestMessageTime && (
            <span className="hidden sm:flex items-center gap-1"><FaClock size={9} /> {fmt(discussion.latestMessageTime)}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {discussion.joined && onLeave && (
            <button
              onClick={() => onLeave(discussion.slug)}
              className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
              title="Leave group"
            >
              <FaSignOutAlt size={12} />
            </button>
          )}
          <button
            onClick={() => onOpen(discussion)}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs font-semibold transition shadow-sm flex items-center gap-1.5"
          >
            <FaComments size={11} /> Open Chat
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Main Admin Discussions ──────────────────────────────── */
function Discussions() {
  const [groups, setGroups] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("admin_userId") || null;

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      // Admin sees all groups
      const res = await discussionApi.getGroups(0, 100);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-4xl mx-auto px-4 py-5 sm:py-7">
          <p className="text-xs text-purple-200 mb-2">
            <Link to="/admin/dashboard" className="hover:text-white transition">Dashboard</Link>
            <span className="mx-2">›</span>Discussions
          </p>
          <h1 className="text-xl sm:text-2xl font-bold mb-1">Admin Discussions</h1>
          <p className="text-xs sm:text-sm text-purple-100 opacity-90">
            Monitor, moderate and participate in all course discussions across the platform.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5 sm:py-7">
        {loading ? (
          <div className="text-center py-16">
            <FaSpinner className="animate-spin text-purple-500 text-3xl mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <FaComments className="text-4xl text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-600 mb-1">No discussion groups found</h3>
            <p className="text-sm text-gray-400">Discussion groups will appear here once courses have them enabled.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {groups.map(g => (
              <DiscussionCard
                key={g.id}
                discussion={g}
                onOpen={setActiveChat}
                onLeave={g.joined ? handleLeave : null}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}

export default Discussions;