// src/components/Discussions.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaComments,
  FaUserGraduate,
  FaClock,
  FaReply,
  FaTimes,
  FaThumbsUp,
  FaBookOpen,
  FaChalkboardTeacher,
  FaStar,
  FaRegLightbulb,
  FaFilter,
  FaSortAmountDown,
  FaUsers,
  FaCheckCircle,
  FaQuestionCircle,
  FaMicrophone,
  FaPaperPlane,
  FaUserCircle,
  FaTag,
  FaEye,
  FaBookmark,
  FaRegBookmark,
  FaImage,
  FaLink,
  FaCode,
  FaListUl,
  FaBold,
  FaItalic,
  FaQuoteRight,
  FaPaperclip,
  FaSmile,
  FaPoll,
  FaCalendarAlt,
  FaVideo,
  FaFileAlt,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaSpinner,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaTrophy,
} from "react-icons/fa";
import { MdVerified, MdEmojiEvents, MdFormatQuote,MdQuiz } from "react-icons/md";

// Rich Text Editor Component
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const insertText = (before, after = '') => {
    const textarea = document.getElementById('rich-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value;
    const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);
    onChange({ target: { value: newText } });
  };

  const buttons = [
    { icon: FaBold, action: () => insertText('**', '**'), tooltip: 'Bold' },
    { icon: FaItalic, action: () => insertText('*', '*'), tooltip: 'Italic' },
    { icon: FaListUl, action: () => insertText('\n• '), tooltip: 'Bullet List' },
    { icon: FaCode, action: () => insertText('`', '`'), tooltip: 'Inline Code' },
    { icon: FaQuoteRight, action: () => insertText('\n> '), tooltip: 'Quote' },
    { icon: FaLink, action: () => insertText('[', '](url)'), tooltip: 'Insert Link' },
  ];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition">
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={btn.action}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors group relative"
            title={btn.tooltip}
          >
            <btn.icon className="text-gray-600 text-sm" />
          </button>
        ))}
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors relative"
        >
          <FaSmile className="text-gray-600 text-sm" />
        </button>
      </div>
      <textarea
        id="rich-editor"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows="6"
        className="w-full px-4 py-3 outline-none resize-none text-gray-700"
      />
    </div>
  );
};

// Tag Input Component
const TagInput = ({ tags, onAddTag, onRemoveTag, suggestions }) => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      onAddTag(input.trim());
      setInput("");
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  );

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            #{tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="hover:text-blue-900"
            >
              <FaTimes size={10} />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowSuggestions(true);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="Add tags (press Enter)..."
        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
          {filteredSuggestions.map(suggestion => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                onAddTag(suggestion);
                setInput("");
                setShowSuggestions(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
            >
              #{suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// File Attachment Component
const FileAttachment = ({ files, onAddFile, onRemoveFile }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files);
    onAddFile([...files, ...newFiles]);
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <FaImage className="text-blue-500" />;
    if (type.startsWith('video/')) return <FaVideo className="text-purple-500" />;
    return <FaFileAlt className="text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
      >
        <FaPaperclip />
        <span className="text-sm">Attach Files</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {getFileIcon(file.type)}
                <div>
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveFile(idx)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Poll Creator Component
const PollCreator = ({ poll, onPollChange }) => {
  const addOption = () => {
    onPollChange({
      ...poll,
      options: [...poll.options, ""]
    });
  };

  const updateOption = (idx, value) => {
    const newOptions = [...poll.options];
    newOptions[idx] = value;
    onPollChange({ ...poll, options: newOptions });
  };

  const removeOption = (idx) => {
    onPollChange({
      ...poll,
      options: poll.options.filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Poll Question"
        value={poll.question}
        onChange={(e) => onPollChange({ ...poll, question: e.target.value })}
        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
      />
      {poll.options.map((option, idx) => (
        <div key={idx} className="flex gap-2">
          <input
            type="text"
            placeholder={`Option ${idx + 1}`}
            value={option}
            onChange={(e) => updateOption(idx, e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {poll.options.length > 2 && (
            <button
              type="button"
              onClick={() => removeOption(idx)}
              className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <FaTimes />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addOption}
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        + Add Option
      </button>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={poll.multiple}
            onChange={(e) => onPollChange({ ...poll, multiple: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">Allow multiple selections</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={poll.anonymous}
            onChange={(e) => onPollChange({ ...poll, anonymous: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm">Anonymous voting</span>
        </label>
      </div>
    </div>
  );
};

// Main Component
function Discussions() {
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "Understanding React's Virtual DOM - Need Clear Explanation",
      description: "I'm struggling to grasp how Virtual DOM actually works under the hood. Can someone explain it with a real-world example?",
      course: "React JS",
      postedBy: "Sarah Johnson",
      avatar: null,
      isVerified: true,
      role: "student",
      replies: 24,
      time: "2 hours ago",
      status: "Hot",
      isPinned: true,
      likes: 45,
      views: 342,
      tags: ["React", "Performance", "DOM"],
    },
    {
      id: 2,
      title: "Best Practices for State Management in Large Applications",
      description: "What's the recommended approach for state management when building enterprise-level React apps?",
      course: "JavaScript",
      postedBy: "Prof. Michael Chen",
      avatar: null,
      isVerified: true,
      role: "instructor",
      replies: 18,
      time: "Yesterday",
      status: "Answered",
      isPinned: false,
      likes: 89,
      views: 567,
      tags: ["State Management", "Redux", "Best Practices"],
    },
    {
      id: 3,
      title: "CSS Grid vs Flexbox - When to Use Which?",
      description: "I'm confused about the use cases. Can someone share practical scenarios?",
      course: "Frontend Design",
      postedBy: "Emily Rodriguez",
      avatar: null,
      isVerified: false,
      role: "student",
      replies: 32,
      time: "3 days ago",
      status: "Open",
      isPinned: false,
      likes: 67,
      views: 890,
      tags: ["CSS", "Grid", "Flexbox"],
    },
  ]);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [showNewModal, setShowNewModal] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    description: "",
    tags: [],
    isAnonymous: false,
    attachments: [],
    discussionType: "question",
    poll: {
      enabled: false,
      question: "",
      options: ["", ""],
      multiple: false,
      anonymous: false,
    },
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

  const handleLike = (id) => {
    setDiscussions(prev => prev.map(d => 
      d.id === id ? { ...d, likes: d.likes + 1 } : d
    ));
  };

  const handleBookmark = (id) => {
    setBookmarkedPosts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleAddTag = (tag) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleAddFile = (files) => {
    setFormData({ ...formData, attachments: files });
  };

  const handleRemoveFile = (index) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDiscussion = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      course: formData.course,
      postedBy: formData.isAnonymous ? "Anonymous" : "Current User",
      avatar: null,
      isVerified: false,
      role: "student",
      replies: 0,
      time: "Just now",
      status: "Open",
      isPinned: false,
      likes: 0,
      views: 0,
      tags: formData.tags,
      hasPoll: formData.poll.enabled,
      poll: formData.poll.enabled ? formData.poll : null,
      attachments: formData.attachments,
    };
    
    setDiscussions(prev => [newDiscussion, ...prev]);
    setShowNewModal(false);
    setFormData({
      title: "",
      course: "",
      description: "",
      tags: [],
      isAnonymous: false,
      attachments: [],
      discussionType: "question",
      poll: {
        enabled: false,
        question: "",
        options: ["", ""],
        multiple: false,
        anonymous: false,
      },
    });
    setCurrentStep(1);
    setIsSubmitting(false);
  };

  const filteredDiscussions = discussions.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
                         d.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" ||
      (activeCategory === "unanswered" && d.status === "Open") ||
      (activeCategory === "solved" && d.status === "Answered") ||
      (activeCategory === "trending" && d.status === "Hot") ||
      (activeCategory === "pinned" && d.isPinned);
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "latest") return new Date(b.time) - new Date(a.time);
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

  // Steps for wizard
  const steps = [
    { number: 1, title: "Basic Info", icon: FaFileAlt },
    { number: 2, title: "Content", icon: FaComments },
    { number: 3, title: "Enhancements", icon: FaStar },
  ];

  const nextStep = () => {
    if (currentStep === 1 && (!formData.title || !formData.course)) return;
    if (currentStep === 2 && !formData.description) return;
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
     {/* Hero Section - Compact Version */}
<div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
  <div className="absolute inset-0 bg-black/20"></div>
  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
  
  <div className="relative max-w-7xl mx-auto px-4 py-6">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
      <div className="flex-1 text-center lg:text-left">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-white">
            <Link to="/student/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white font-medium">Discussions</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200"></div>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-2">
          <FaChalkboardTeacher size={12} />
          <span className="text-xs font-medium">Learning Community</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          Knowledge Exchange Hub
        </h1>
        <p className="text-sm text-blue-100 mb-3 max-w-xl">
          Connect with peers and instructors, ask questions, share insights, and grow together.
        </p>
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all transform hover:scale-105 text-sm"
          >
            <FaPlus size={12} /> Start Discussion
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-400 transition-all text-sm">
            <FaMicrophone size={12} /> Ask AI
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center lg:justify-end">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 w-full max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <FaUsers className="text-lg" />
            <div>
              <div className="text-xl font-bold">{stats.students}+</div>
              <div className="text-xs text-blue-100">Active Learners</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Discussions Solved</span>
              <span className="font-semibold">{Math.round((stats.solved / stats.total) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-green-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.solved / stats.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 px-2 py-8">
        {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 -mt-4">

                    {/* CARD */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-[52px] h-[52px] rounded-xl bg-[#f3ebff] flex items-center justify-center">
                            <MdQuiz className="text-[#7c3aed] text-[24px]" />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Total Discussions
                            </p>

                            <h2 className="text-2xl font-bold text-[#1d1642]">
                                24
                            </h2>
                        </div>
                    </div>

                    {/* CARD */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-[52px] h-[52px] rounded-xl bg-[#e9f2ff] flex items-center justify-center">
                            <FaClipboardCheck className="text-[#2563eb] text-[22px]" />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                               Solved Questions
                            </p>

                            <h2 className="text-2xl font-bold text-[#1d1642]">
                                18
                            </h2>
                        </div>
                    </div>

                    {/* CARD */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-[52px] h-[52px] rounded-xl bg-[#eafaf0] flex items-center justify-center">
                            <FaCheckCircle className="text-[#16a34a] text-[22px]" />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Trending Topics
                            </p>

                            <h2 className="text-2xl font-bold text-[#1d1642]">
                                76%
                            </h2>
                        </div>
                    </div>

                    {/* CARD */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-[52px] h-[52px] rounded-xl bg-[#fff5e7] flex items-center justify-center">
                            <FaTrophy className="text-[#f59e0b] text-[22px]" />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Community Members
                            </p>

                            <h2 className="text-2xl font-bold text-[#1d1642]">
                                82%
                            </h2>
                        </div>
                    </div>
                </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 -mt-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search discussions by title, content, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white transition"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="latest">Latest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="mostReplies">Most Replies</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-6 mb-5">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                activeCategory === category.id 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transform scale-105' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <category.icon size={14} />
              <span className="text-sm font-medium">{category.label}</span>
              {category.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeCategory === category.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {category.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Discussions Grid */}
        {filteredDiscussions.length > 0 ? (
          <div className="space-y-4">
            {filteredDiscussions.map(discussion => (
              <DiscussionCard
                key={discussion.id}
                discussion={discussion}
                onView={setSelectedDiscussion}
                onLike={handleLike}
                isBookmarked={bookmarkedPosts.includes(discussion.id)}
                onBookmark={handleBookmark}
                userRole="student"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-16 text-center shadow-md">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaComments className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No discussions found</h3>
            <p className="text-gray-500 mb-4">Be the first to start a discussion on this topic!</p>
            <button
              onClick={() => setShowNewModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Start a Discussion
            </button>
          </div>
        )}

        {/* Enhanced New Discussion Modal */}
        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowNewModal(false)}>
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide" onClick={e => e.stopPropagation()}>
              {/* Modal Header with Steps */}
              <div className="sticky top-0 bg-white  border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Start New Discussion</h2>
                  <button onClick={() => setShowNewModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <FaTimes />
                  </button>
                </div>
{/* Step Progress Bar */}
<div className="flex justify-center mb-8">
  <div className="grid grid-cols-3 items-start w-full max-w-3xl relative">
    {/* Lines */}
    <div className="absolute top-5 left-[16%] right-[16%] h-1 bg-gray-200 -z-0" />

    {steps.map((step) => (
      <div key={step.number} className="relative z-10 flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            currentStep >= step.number
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {currentStep > step.number ? <FaCheck /> : step.number}
        </div>

        <p className="mt-1 text-xs font-medium text-gray-500 text-center">
          {step.title}
        </p>
          </div>
           ))}
       </div>
     </div>
              </div>
              <form onSubmit={handleSubmit} className="mt-2 p-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Discussion Type
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "question", label: "Question", icon: FaQuestionCircle, color: "blue" },
                          { value: "discussion", label: "Discussion", icon: FaComments, color: "green" },
                          { value: "poll", label: "Poll", icon: FaPoll, color: "purple" },
                        ].map(type => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, discussionType: type.value })}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              formData.discussionType === type.value
                                ? `border-${type.color}-500 bg-${type.color}-50`
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <type.icon className={`text-2xl mx-auto mb-1 text-${type.color}-500`} />
                            <div className="text-sm font-medium">{type.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="What's your question or topic?"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {formData.title.length}/200 characters
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.course}
                        onChange={(e) => setFormData({...formData, course: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      >
                        <option value="">Select a course</option>
                        {courses.map(course => <option key={course}>{course}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2: Content */}
                {currentStep === 2 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <RichTextEditor
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Provide detailed information about your question..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tags <span className="text-gray-500 text-xs">(Max 5 tags)</span>
                      </label>
                      <TagInput
                        tags={formData.tags}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                        suggestions={popularTags}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Enhancements */}
                {currentStep === 3 && (
                  <div className="space-y-5 animate-fadeIn">
                    {formData.discussionType === "poll" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Create Poll
                        </label>
                        <PollCreator
                          poll={formData.poll}
                          onPollChange={(poll) => setFormData({ ...formData, poll: { ...poll, enabled: true } })}
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Attachments
                      </label>
                      <FileAttachment
                        files={formData.attachments}
                        onAddFile={handleAddFile}
                        onRemoveFile={handleRemoveFile}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Supported formats: Images, PDF, Documents (Max 10MB)
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={formData.isAnonymous}
                        onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label htmlFor="anonymous" className="text-sm text-gray-600">
                        Post anonymously
                      </label>
                    </div>
                    
                    {/* Preview Section */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Preview</h4>
                      <div className="bg-white rounded-lg p-4">
                        <h5 className="font-bold text-gray-800">{formData.title || "Your Title Here"}</h5>
                        <p className="text-sm text-gray-600 mt-2">{formData.description || "Your description will appear here..."}</p>
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {formData.tags.map(tag => (
                              <span key={tag} className="text-xs text-blue-600">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-between gap-3 pt-6 mt-4 border-t border-gray-100">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                      >
                        <FaArrowLeft /> Back
                      </button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowNewModal(false)}
                      className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md flex items-center gap-2"
                      >
                        Continue <FaArrowRight />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition shadow-md flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <FaSpinner className="animate-spin" /> Posting...
                          </>
                        ) : (
                          <>
                            <FaCheck /> Post Discussion
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// DiscussionCard Component (keep as is from original)
const DiscussionCard = ({ discussion, onView, onLike, isBookmarked, onBookmark, userRole }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusConfig = {
    Open: { color: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-700", icon: <FaQuestionCircle />, label: "Needs Help" },
    Answered: { color: "from-green-500 to-green-600", bg: "bg-green-50", text: "text-green-700", icon: <FaCheckCircle />, label: "Solved" },
    Hot: { color: "from-orange-500 to-red-500", bg: "bg-orange-50", text: "text-orange-700", icon: <FaRegLightbulb />, label: "Trending" },
    Pinned: { color: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-700", icon: <FaStar />, label: "Pinned" },
  };

  const config = statusConfig[discussion.status] || statusConfig.Open;

  return (
    <div 
      className={`group relative bg-white rounded-2xl transition-all duration-300 ${
        isHovered ? 'shadow-xl transform -translate-y-1' : 'shadow-md hover:shadow-lg'
      } border border-gray-100 overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`h-1 bg-gradient-to-r ${config.color}`} />
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                {config.icon}
                <span>{config.label}</span>
              </span>
              
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                <FaTag size={10} />
                {discussion.course}
              </span>
              
              {discussion.isPinned && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 text-purple-600 text-xs">
                  <FaStar size={10} />
                  Pinned
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors">
              {discussion.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {discussion.description}
            </p>
          </div>
          
          <button 
            onClick={() => onBookmark(discussion.id)}
            className="text-gray-400 hover:text-yellow-500 transition-colors"
          >
            {isBookmarked ? <FaBookmark className="text-yellow-500" /> : <FaRegBookmark />}
          </button>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={discussion.avatar || `https://ui-avatars.com/api/?name=${discussion.postedBy}&background=4F46E5&color=fff`}
                alt={discussion.postedBy}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              {discussion.isVerified && (
                <MdVerified className="absolute -bottom-1 -right-1 text-blue-500 bg-white rounded-full text-sm" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-800 text-sm">{discussion.postedBy}</span>
                {discussion.role === 'instructor' && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Instructor</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <FaClock size={10} />
                  {discussion.time}
                </span>
                <span className="flex items-center gap-1">
                  <FaReply size={10} />
                  {discussion.replies} replies
                </span>
                <span className="flex items-center gap-1">
                  <FaEye size={10} />
                  {discussion.views || 0} views
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onLike(discussion.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-blue-50 transition-colors group"
            >
              <FaThumbsUp className="text-gray-500 group-hover:text-blue-500 text-sm" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                {discussion.likes || 0}
              </span>
            </button>
            
            <button
              onClick={() => onView(discussion)}
              className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
            >
              Join Discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discussions;