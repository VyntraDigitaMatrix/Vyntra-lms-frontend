import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch, FaPlus, FaComments, FaUserGraduate, FaClock,
  FaReply, FaTimes, FaThumbsUp, FaBookOpen, FaChalkboardTeacher,
  FaStar, FaRegLightbulb, FaFilter, FaSortAmountDown, FaUsers,
  FaCheckCircle, FaQuestionCircle, FaMicrophone, FaPaperPlane,
  FaUserCircle, FaTag, FaEye, FaBookmark, FaRegBookmark,
  FaImage, FaLink, FaCode, FaListUl, FaBold, FaItalic,
  FaQuoteRight, FaPaperclip, FaSmile, FaPoll, FaCalendarAlt,
  FaVideo, FaFileAlt, FaArrowRight, FaArrowLeft, FaCheck,
  FaSpinner, FaExclamationTriangle, FaClipboardCheck, FaTrophy,
  FaEllipsisV, FaHeart, FaShare, FaChevronDown, FaInfoCircle,
} from "react-icons/fa";
import { MdVerified, MdEmojiEvents, MdFormatQuote, MdQuiz } from "react-icons/md";

/* RICH TEXT EDITOR */
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const buttons = [
    { icon: FaBold, action: () => insertText("**", "**"), tooltip: "Bold" },
    { icon: FaItalic, action: () => insertText("*", "*"), tooltip: "Italic" },
    { icon: FaListUl, action: () => insertText("\n• "), tooltip: "Bullet List" },
    { icon: FaCode, action: () => insertText("`", "`"), tooltip: "Inline Code" },
    { icon: FaQuoteRight, action: () => insertText("\n> "), tooltip: "Quote" },
    { icon: FaLink, action: () => insertText("[", "](url)"), tooltip: "Insert Link" },
  ];

  const insertText = (before, after = "") => {
    const textarea = document.getElementById("rich-editor");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText =
      value.substring(0, start) + before + value.substring(start, end) + after + value.substring(end);
    onChange({ target: { value: newText } });
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition">
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
        {buttons.map((btn, idx) => (
          <button key={idx} type="button" onClick={btn.action}
            className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-lg transition-colors" title={btn.tooltip}>
            <btn.icon className="text-gray-600 text-xs sm:text-sm" />
          </button>
        ))}
      </div>
      <textarea id="rich-editor" value={value} onChange={onChange} placeholder={placeholder}
        rows="6" className="w-full px-3 sm:px-4 py-2 sm:py-3 outline-none resize-none text-gray-700 text-sm" />
    </div>
  );
};

/* TAG INPUT */
const TagInput = ({ tags, onAddTag, onRemoveTag, suggestions }) => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  );

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            #{tag}
            <button type="button" onClick={() => onRemoveTag(tag)}><FaTimes size={9} /></button>
          </span>
        ))}
      </div>
      <input type="text" value={input}
        onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
        onKeyDown={e => { if (e.key === "Enter" && input.trim()) { e.preventDefault(); onAddTag(input.trim()); setInput(""); setShowSuggestions(false); } }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="Add tags (press Enter)..."
        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-32 overflow-y-auto">
          {filteredSuggestions.map(s => (
            <button key={s} type="button"
              onClick={() => { onAddTag(s); setInput(""); setShowSuggestions(false); }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 text-xs sm:text-sm">#{s}</button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   DISCUSSION CHAT VIEW  ← NEW
───────────────────────────────────────── */
const DiscussionChat = ({ discussion, onClose }) => {
  const [messages, setMessages] = useState(() => generateInitialMessages(discussion));
  const [input, setInput] = useState("");
  const [likedMessages, setLikedMessages] = useState({});
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  function generateInitialMessages(d) {
    const seed = [
      {
        id: 1, author: d.postedBy, avatar: d.avatar,
        role: d.role, isVerified: d.isVerified, time: d.time,
        text: d.description,
        likes: d.likes || 0, isOriginal: true,
      },
      {
        id: 2, author: "Prof. Michael Chen", avatar: null, role: "instructor", isVerified: true,
        time: "1 hour ago",
        text: "Great question! Let me break this down step by step. This is actually a fundamental concept that many students find challenging at first.",
        likes: 12,
      },
      {
        id: 3, author: "Priya Sharma", avatar: null, role: "student", isVerified: false,
        time: "45 mins ago",
        text: "I had the same doubt last week. The key thing to remember is to think about it from a practical standpoint rather than theoretical.",
        likes: 8,
      },
      {
        id: 4, author: "You", avatar: null, role: "student", isVerified: false,
        time: "30 mins ago",
        text: "Thanks for the explanation! Could you share a code example to make it clearer?",
        likes: 3, isSelf: true,
      },
      {
        id: 5, author: "Prof. Michael Chen", avatar: null, role: "instructor", isVerified: true,
        time: "20 mins ago",
        text: "Sure! Here's a simple example:\n\n```\nconst example = () => {\n  // Your code here\n  return result;\n};\n```\n\nThis demonstrates the core principle clearly.",
        likes: 18,
      },
    ];
    return seed;
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(), author: "You", avatar: null, role: "student", isVerified: false,
        time: "Just now", text: input.trim(), likes: 0, isSelf: true,
      },
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const toggleLike = (id) => {
    setLikedMessages(prev => ({ ...prev, [id]: !prev[id] }));
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, likes: likedMessages[id] ? m.likes - 1 : m.likes + 1 } : m
    ));
  };

  const getAvatar = (author, role) => {
    if (role === "instructor")
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=16a34a&color=fff&size=80`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=4F46E5&color=fff&size=80`;
  };

  const statusConfig = {
    Open: { color: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-700", label: "Open" },
    Answered: { color: "from-green-500 to-green-600", bg: "bg-green-50", text: "text-green-700", label: "Answered" },
    Hot: { color: "from-orange-500 to-red-500", bg: "bg-orange-50", text: "text-orange-700", label: "Trending" },
    Pinned: { color: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-700", label: "Pinned" },
  };
  const cfg = statusConfig[discussion.status] || statusConfig.Open;

  const formatText = (text) => {
    if (!text) return null;
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const code = part.slice(3, -3).replace(/^\n/, "");
        return (
          <pre key={i} className="bg-gray-900 text-green-400 rounded-lg p-3 text-xs font-mono my-2 overflow-x-auto whitespace-pre-wrap">
            {code}
          </pre>
        );
      }
      return <span key={i} style={{ whiteSpace: "pre-wrap" }}>{part}</span>;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50" style={{ animation: "slideUp 0.25s ease" }}>
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onClose}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition px-2 py-1 rounded-lg hover:bg-gray-100">
            <FaArrowLeft className="text-xs" /> Back
          </button>
          <div className="w-px h-5 bg-gray-200" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                {cfg.label}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px]">
                <FaTag size={8} /> {discussion.course}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-gray-800 mt-0.5 truncate">{discussion.title}</h2>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 shrink-0">
            <span className="hidden sm:flex items-center gap-1"><FaReply size={10} /> {messages.length} replies</span>
            <span className="hidden sm:flex items-center gap-1"><FaEye size={10} /> {discussion.views || 0}</span>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.isSelf ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div className="shrink-0">
              <div className="relative">
                <img
                  src={msg.avatar || getAvatar(msg.author, msg.role)}
                  alt={msg.author}
                  className={`w-9 h-9 rounded-full object-cover border-2 ${msg.role === "instructor" ? "border-green-400" : "border-white"} shadow-sm`}
                />
                {msg.isVerified && (
                  <MdVerified className="absolute -bottom-1 -right-1 text-blue-500 bg-white rounded-full text-xs" />
                )}
              </div>
            </div>

            {/* Bubble */}
            <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${msg.isSelf ? "items-end" : "items-start"}`}>
              <div className={`flex items-center gap-2 mb-1 ${msg.isSelf ? "flex-row-reverse" : ""}`}>
                <span className="text-xs font-semibold text-gray-800">{msg.author}</span>
                {msg.role === "instructor" && (
                  <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">Instructor</span>
                )}
                <span className="text-[10px] text-gray-400">{msg.time}</span>
              </div>

              <div className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.isOriginal
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tl-sm"
                  : msg.isSelf
                    ? "bg-blue-500 text-white rounded-tr-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
                }`}>
                {msg.isOriginal && (
                  <div className="flex items-center gap-1.5 mb-2 opacity-75">
                    <FaRegLightbulb size={10} />
                    <span className="text-[10px] font-semibold uppercase tracking-wide">Original Post</span>
                  </div>
                )}
                <div className={msg.isOriginal || msg.isSelf ? "text-white" : "text-gray-800"}>
                  {formatText(msg.text)}
                </div>
                {discussion.tags && msg.isOriginal && (
                  <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-white/20">
                    {discussion.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Like row */}
              <div className={`flex items-center gap-2 mt-1.5 ${msg.isSelf ? "flex-row-reverse" : ""}`}>
                <button onClick={() => toggleLike(msg.id)}
                  className={`flex items-center gap-1 text-[11px] transition ${likedMessages[msg.id] ? "text-blue-600" : "text-gray-400 hover:text-blue-500"}`}>
                  <FaThumbsUp size={10} />
                  <span>{msg.likes}</span>
                </button>
                <button className="text-[11px] text-gray-400 hover:text-gray-600 transition flex items-center gap-1">
                  <FaReply size={10} /> Reply
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── Input Bar ── */}
      <div className="bg-white border-t border-gray-200 px-3 sm:px-6 py-3 flex-shrink-0">
        <div className="flex items-end gap-2 sm:gap-3 max-w-4xl mx-auto">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
            Y
          </div>
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a reply… (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none overflow-hidden"
              style={{ minHeight: "42px", maxHeight: "120px" }}
              onInput={e => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
          </div>
          <button onClick={sendMessage}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm shrink-0
              ${input.trim() ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
            <FaPaperPlane size={14} />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-1.5">
          {messages.length} messages · {discussion.views || 0} views
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────
   DISCUSSION CARD
───────────────────────────────────────── */
const DiscussionCard = ({ discussion, onJoin, onLike, isBookmarked, onBookmark }) => {
  const statusConfig = {
    Open: { color: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-700", icon: <FaQuestionCircle size={10} />, label: "Needs Help" },
    Answered: { color: "from-green-500 to-green-600", bg: "bg-green-50", text: "text-green-700", icon: <FaCheckCircle size={10} />, label: "Solved" },
    Hot: { color: "from-orange-500 to-red-500", bg: "bg-orange-50", text: "text-orange-700", icon: <FaRegLightbulb size={10} />, label: "Trending" },
    Pinned: { color: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-700", icon: <FaStar size={10} />, label: "Pinned" },
  };
  const config = statusConfig[discussion.status] || statusConfig.Open;

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl transition-all duration-300 shadow-md border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5">
      <div className={`h-1 bg-gradient-to-r ${config.color}`} />
      <div className="p-3 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${config.bg} ${config.text}`}>
                {config.icon}<span className="hidden sm:inline">{config.label}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] sm:text-xs">
                <FaTag size={8} /><span className="truncate max-w-[100px] sm:max-w-none">{discussion.course}</span>
              </span>
              {discussion.isPinned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 text-[10px] sm:text-xs">
                  <FaStar size={8} />Pinned
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors">
              {discussion.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{discussion.description}</p>
            {discussion.tags && (
              <div className="flex flex-wrap gap-1 mb-2">
                {discussion.tags.map(tag => (
                  <span key={tag} className="text-[10px] text-blue-500 hover:text-blue-700 cursor-pointer">#{tag}</span>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => onBookmark(discussion.id)} className="text-gray-400 hover:text-yellow-500 transition-colors shrink-0">
            {isBookmarked ? <FaBookmark className="text-yellow-500 text-sm sm:text-base" /> : <FaRegBookmark className="text-sm sm:text-base" />}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative shrink-0">
              <img
                src={discussion.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(discussion.postedBy)}&background=4F46E5&color=fff`}
                alt={discussion.postedBy}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              {discussion.isVerified && (
                <MdVerified className="absolute -bottom-1 -right-1 text-blue-500 bg-white rounded-full text-[10px] sm:text-sm" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1">
                <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{discussion.postedBy}</span>
                {discussion.role === "instructor" && (
                  <span className="text-[9px] sm:text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded-full">Instructor</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-gray-500 mt-0.5">
                <span className="flex items-center gap-0.5"><FaClock size={8} /> {discussion.time}</span>
                <span className="flex items-center gap-0.5"><FaReply size={8} /> {discussion.replies}</span>
                <span className="flex items-center gap-0.5"><FaEye size={8} /> {discussion.views || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => onLike(discussion.id)}
              className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-gray-50 hover:bg-blue-50 transition-colors group">
              <FaThumbsUp className="text-gray-500 group-hover:text-blue-500 text-[11px] sm:text-sm" />
              <span className="text-[11px] sm:text-sm font-medium text-gray-600 group-hover:text-blue-600">{discussion.likes || 0}</span>
            </button>
            <button onClick={() => onJoin(discussion)}
              className="px-4 sm:px-5 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-[11px] sm:text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm flex items-center gap-1.5">
              <FaComments size={11} /> Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
function Discussions() {
  const [discussions, setDiscussions] = useState([
    {
      id: 1, title: "Understanding React's Virtual DOM - Need Clear Explanation",
      description: "I'm struggling to grasp how Virtual DOM actually works under the hood. Can someone explain it with a real-world example?",
      course: "React JS", postedBy: "Sarah Johnson", avatar: null, isVerified: true, role: "student",
      replies: 24, time: "2 hours ago", status: "Hot", isPinned: true,
      likes: 45, views: 342, tags: ["React", "Performance", "DOM"],
    },
    {
      id: 2, title: "Best Practices for State Management in Large Applications",
      description: "What's the recommended approach for state management when building enterprise-level React apps?",
      course: "JavaScript", postedBy: "Prof. Michael Chen", avatar: null, isVerified: true, role: "instructor",
      replies: 18, time: "Yesterday", status: "Answered", isPinned: false,
      likes: 89, views: 567, tags: ["State Management", "Redux", "Best Practices"],
    },
    {
      id: 3, title: "CSS Grid vs Flexbox - When to Use Which?",
      description: "I'm confused about the use cases. Can someone share practical scenarios where one is better than the other?",
      course: "Frontend Design", postedBy: "Emily Rodriguez", avatar: null, isVerified: false, role: "student",
      replies: 32, time: "3 days ago", status: "Open", isPinned: false,
      likes: 67, views: 890, tags: ["CSS", "Grid", "Flexbox"],
    },
  ]);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [showNewModal, setShowNewModal] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "", course: "", description: "", tags: [], isAnonymous: false,
    attachments: [], discussionType: "question",
    poll: { enabled: false, question: "", options: ["", ""], multiple: false, anonymous: false },
  });

  const courses = ["React JS", "JavaScript", "Frontend Design", "Node.js", "Data Structures", "Algorithms"];
  const popularTags = ["React", "JavaScript", "CSS", "Performance", "Best Practices", "Interview", "HTML", "Python"];

  const categories = [
    { id: "all", label: "All Discussions", icon: FaComments, count: discussions.length },
    { id: "unanswered", label: "Need Help", icon: FaQuestionCircle, count: discussions.filter(d => d.status === "Open").length },
    { id: "solved", label: "Solved", icon: FaCheckCircle, count: discussions.filter(d => d.status === "Answered").length },
    { id: "trending", label: "Trending", icon: FaRegLightbulb, count: discussions.filter(d => d.status === "Hot").length },
    { id: "pinned", label: "Pinned", icon: FaStar, count: discussions.filter(d => d.isPinned).length },
  ];

  const handleLike = (id) => setDiscussions(prev => prev.map(d => d.id === id ? { ...d, likes: d.likes + 1 } : d));
  const handleBookmark = (id) => setBookmarkedPosts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  const handleAddTag = (tag) => { if (!formData.tags.includes(tag) && formData.tags.length < 5) setFormData({ ...formData, tags: [...formData.tags, tag] }); };
  const handleRemoveTag = (tag) => setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    const newDisc = {
      id: Date.now(), title: formData.title, description: formData.description,
      course: formData.course, postedBy: formData.isAnonymous ? "Anonymous" : "Current User",
      avatar: null, isVerified: false, role: "student", replies: 0, time: "Just now",
      status: "Open", isPinned: false, likes: 0, views: 0, tags: formData.tags,
    };
    setDiscussions(prev => [newDisc, ...prev]);
    setShowNewModal(false);
    setFormData({ title: "", course: "", description: "", tags: [], isAnonymous: false, attachments: [], discussionType: "question", poll: { enabled: false, question: "", options: ["", ""], multiple: false, anonymous: false } });
    setCurrentStep(1);
    setIsSubmitting(false);
  };

  const filteredDiscussions = discussions.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "all" ||
      (activeCategory === "unanswered" && d.status === "Open") ||
      (activeCategory === "solved" && d.status === "Answered") ||
      (activeCategory === "trending" && d.status === "Hot") ||
      (activeCategory === "pinned" && d.isPinned);
    return matchSearch && matchCat;
  }).sort((a, b) => {
    if (sortBy === "popular") return b.likes - a.likes;
    if (sortBy === "mostReplies") return b.replies - a.replies;
    return 0;
  });

  const stats = {
    total: discussions.length,
    solved: discussions.filter(d => d.status === "Answered").length,
    trending: discussions.filter(d => d.status === "Hot").length,
    students: 1247,
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: FaFileAlt },
    { number: 2, title: "Content", icon: FaComments },
    { number: 3, title: "Enhancements", icon: FaStar },
  ];

  // If a chat is active, render it full-screen
  if (activeChat) {
    return <DiscussionChat discussion={activeChat} onClose={() => setActiveChat(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full -mr-16 -mt-16 sm:-mr-24 sm:-mt-24" />
        <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-white/5 rounded-full -ml-20 -mb-20 sm:-ml-32 sm:-mb-32" />
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-2">
                <p className="text-xs sm:text-sm text-white">
                  <Link to="/student/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
                  <span className="mx-1 sm:mx-2">&gt;</span>
                  <span className="font-medium">Discussions</span>
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mb-1 sm:mb-2">
                <FaChalkboardTeacher size={10} />
                <span className="text-[10px] sm:text-xs font-medium">Learning Community</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Knowledge Exchange Hub</h1>
              <p className="text-xs sm:text-sm text-blue-100 mb-2 sm:mb-3 max-w-xl mx-auto lg:mx-0">
                Connect with peers and instructors, ask questions, share insights, and grow together.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                <button onClick={() => setShowNewModal(true)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-blue-600 rounded-lg font-semibold flex items-center gap-1.5 sm:gap-2 hover:shadow-lg transition-all text-xs sm:text-sm">
                  <FaPlus size={10} /> Start Discussion
                </button>
                <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg font-semibold flex items-center gap-1.5 sm:gap-2 hover:bg-blue-400 transition-all text-xs sm:text-sm">
                  <FaMicrophone size={10} /> Ask AI
                </button>
              </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end mt-3 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 w-full max-w-[200px] sm:max-w-xs">
                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                  <FaUsers size={14} />
                  <div>
                    <div className="text-base sm:text-xl font-bold">{stats.students}+</div>
                    <div className="text-[10px] sm:text-xs text-blue-100">Active Learners</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] sm:text-xs">
                    <span>Discussions Solved</span>
                    <span className="font-semibold">{Math.round((stats.solved / stats.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                    <div className="bg-green-400 h-full rounded-full" style={{ width: `${(stats.solved / stats.total) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {[
            { label: "Total Discussions", value: stats.total, icon: <MdQuiz className="text-purple-600 text-lg sm:text-2xl" />, bg: "bg-purple-50" },
            { label: "Solved Questions", value: stats.solved, icon: <FaClipboardCheck className="text-blue-600 text-lg sm:text-[22px]" />, bg: "bg-blue-50" },
            { label: "Trending Topics", value: "76%", icon: <FaCheckCircle className="text-green-600 text-lg sm:text-[22px]" />, bg: "bg-green-50" },
            { label: "Community Members", value: `${stats.students}+`, icon: <FaTrophy className="text-orange-500 text-lg sm:text-[22px]" />, bg: "bg-orange-50" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-sm">
              <div className={`w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-xl ${s.bg} flex items-center justify-center`}>{s.icon}</div>
              <div>
                <p className="text-[10px] sm:text-sm text-gray-500 font-medium">{s.label}</p>
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">{s.value}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
              <input type="text" placeholder="Search discussions..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm" />
            </div>
            <div className="relative w-full lg:w-auto">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="w-full pl-9 pr-8 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-xs sm:text-sm">
                <option value="latest">Latest First</option>
                <option value="popular">Most Popular</option>
                <option value="mostReplies">Most Replies</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-nowrap lg:flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 whitespace-nowrap ${activeCategory === cat.id ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
              <cat.icon size={12} />
              <span className="text-xs sm:text-sm font-medium">{cat.label}</span>
              {cat.count > 0 && (
                <span className={`text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full ${activeCategory === cat.id ? "bg-white/20" : "bg-gray-200"}`}>
                  {cat.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Discussion Cards */}
        {filteredDiscussions.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {filteredDiscussions.map(d => (
              <DiscussionCard
                key={d.id} discussion={d}
                onJoin={(disc) => setActiveChat(disc)}
                onLike={handleLike}
                isBookmarked={bookmarkedPosts.includes(d.id)}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-16 text-center shadow-md">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FaComments className="text-2xl sm:text-4xl text-gray-400" />
            </div>
            <h3 className="text-base sm:text-xl font-semibold text-gray-600 mb-1 sm:mb-2">No discussions found</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Be the first to start a discussion on this topic!</p>
            <button onClick={() => setShowNewModal(true)} className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition">
              Start a Discussion
            </button>
          </div>
        )}

        {/* New Discussion Modal */}
        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4" onClick={() => setShowNewModal(false)}>
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Start New Discussion</h2>
                  <button onClick={() => setShowNewModal(false)} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"><FaTimes size={14} /></button>
                </div>
                <div className="grid grid-cols-3 items-start w-full relative">
                  <div className="absolute top-4 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-0" />
                  {steps.map(step => (
                    <div key={step.number} className="relative z-10 flex flex-col items-center">
                      <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all text-xs sm:text-base ${currentStep >= step.number ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                        {currentStep > step.number ? <FaCheck size={10} /> : step.number}
                      </div>
                      <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs font-medium text-gray-500 text-center">{step.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                {currentStep === 1 && (
                  <div className="space-y-3 sm:space-y-5">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Discussion Type</label>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {[
                          { value: "question", label: "Question", icon: FaQuestionCircle, color: "blue" },
                          { value: "discussion", label: "Discussion", icon: FaComments, color: "green" },
                          { value: "poll", label: "Poll", icon: FaPoll, color: "purple" },
                        ].map(type => (
                          <button key={type.value} type="button"
                            onClick={() => setFormData({ ...formData, discussionType: type.value })}
                            className={`p-2 sm:p-3 rounded-xl border-2 transition-all ${formData.discussionType === type.value ? `border-${type.color}-500 bg-${type.color}-50` : "border-gray-200"}`}>
                            <type.icon className={`text-lg sm:text-2xl mx-auto mb-0.5 sm:mb-1 text-${type.color}-500`} />
                            <div className="text-[10px] sm:text-sm font-medium">{type.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="What's your question or topic?" value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Course <span className="text-red-500">*</span></label>
                      <select value={formData.course} onChange={e => setFormData({ ...formData, course: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" required>
                        <option value="">Select a course</option>
                        {courses.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-3 sm:space-y-5">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                      <RichTextEditor value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Provide detailed information..." />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Tags <span className="text-gray-500 text-[10px]">(Max 5)</span></label>
                      <TagInput tags={formData.tags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} suggestions={popularTags} />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-3 sm:space-y-5">
                    <div className="flex items-center gap-2 pt-1">
                      <input type="checkbox" id="anonymous" checked={formData.isAnonymous}
                        onChange={e => setFormData({ ...formData, isAnonymous: e.target.checked })} className="w-4 h-4" />
                      <label htmlFor="anonymous" className="text-xs sm:text-sm text-gray-600">Post anonymously</label>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Preview</h4>
                      <div className="bg-white rounded-lg p-3 sm:p-4">
                        <h5 className="font-bold text-gray-800 text-sm sm:text-base">{formData.title || "Your Title Here"}</h5>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1.5">{formData.description || "Your description will appear here..."}</p>
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {formData.tags.map(tag => <span key={tag} className="text-[10px] text-blue-600">#{tag}</span>)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between gap-3 pt-4 sm:pt-6 mt-4 border-t border-gray-100">
                  <div>
                    {currentStep > 1 && (
                      <button type="button" onClick={() => setCurrentStep(s => s - 1)}
                        className="px-3 sm:px-6 py-1.5 sm:py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition flex items-center gap-1.5 text-xs sm:text-sm">
                        <FaArrowLeft size={10} /> Back
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <button type="button" onClick={() => setShowNewModal(false)}
                      className="px-3 sm:px-6 py-1.5 sm:py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition text-xs sm:text-sm">
                      Cancel
                    </button>
                    {currentStep < 3 ? (
                      <button type="button"
                        onClick={() => { if (currentStep === 1 && (!formData.title || !formData.course)) return; if (currentStep === 2 && !formData.description) return; setCurrentStep(s => s + 1); }}
                        className="px-4 sm:px-6 py-1.5 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md flex items-center gap-1.5 text-xs sm:text-sm">
                        Continue <FaArrowRight size={10} />
                      </button>
                    ) : (
                      <button type="submit" disabled={isSubmitting}
                        className="px-4 sm:px-6 py-1.5 sm:py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition shadow-md flex items-center gap-1.5 text-xs sm:text-sm disabled:opacity-50">
                        {isSubmitting ? <><FaSpinner className="animate-spin" size={12} /> Posting...</> : <><FaCheck size={10} /> Post</>}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
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