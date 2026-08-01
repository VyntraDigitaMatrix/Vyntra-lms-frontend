import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaArrowLeft, FaUsers, FaComments, FaTimes, FaSpinner, FaPaperPlane } from "react-icons/fa";
import { discussionApi } from "../../auth/api";
import { channelStyle, initials, SystemMessage } from "./utils.jsx";
import ChatMessage from "./ChatMessage";

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
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50" style={{ animation: "slideUp 0.2s ease" }}>
      <div className="bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3 px-4 py-3 max-w-4xl mx-auto w-full">
          <button onClick={onClose} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition px-2 py-1 rounded-lg hover:bg-slate-100 flex-shrink-0">
            <FaArrowLeft size={12} /> Back
          </button>
          <div className="w-px h-5 bg-slate-200 flex-shrink-0" />
          <div className={`w-8 h-8 rounded-lg ${style.bg} text-white flex items-center justify-center text-[11px] font-black flex-shrink-0`}>
            {initials(discussion.groupName || discussion.courseTitle)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 truncate">{discussion.groupName || discussion.courseTitle}</h2>
          </div>
          <span className="hidden sm:flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
            <FaUsers size={10} /> {discussion.totalMembers} members
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3 max-w-4xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <FaComments className="text-4xl mx-auto mb-2 opacity-30" />
            <p className="text-sm">No messages yet. Be the first to write!</p>
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
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-2 flex items-center gap-2 max-w-4xl mx-auto w-full">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-blue-900">{replyTo.senderName}</p>
            <p className="text-xs text-[#043573] truncate">{replyTo.content}</p>
          </div>
          <button onClick={() => setReplyTo(null)} className="text-blue-400 hover:text-[#043573] flex-shrink-0">
            <FaTimes size={14} />
          </button>
        </div>
      )}

      <div className="bg-white border-t border-slate-200 px-3 sm:px-6 py-3 flex-shrink-0">
        <div className="flex items-end gap-2 sm:gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={replyTo ? `Replying to ${replyTo.senderName}...` : "Write a message... (Enter to send)"}
              rows={1}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#043573] outline-none text-sm resize-none overflow-hidden"
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
              ${input.trim() && !sending ? "bg-[#043573] hover:bg-blue-900 text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
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

export default DiscussionChat;
