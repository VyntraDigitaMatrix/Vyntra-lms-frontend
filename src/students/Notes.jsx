import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { studentNotesApi } from "./auth/api";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  FaPlus, FaFilter, FaSortAmountDown, FaEllipsisH, FaTimes,
  FaStickyNote, FaCalendarAlt, FaTag, FaUser, FaClock, FaSearch,
  FaThumbsUp, FaComment, FaShare, FaBold, FaItalic, FaUnderline,
  FaStrikethrough, FaListUl, FaListOl, FaQuoteLeft, FaAlignLeft,
  FaAlignCenter, FaAlignRight, FaUndo, FaRedo, FaSave, FaArrowLeft,
  FaHeading, FaCode, FaHighlighter, FaChevronDown, FaFont,
  FaPalette, FaPaintBrush, FaFillDrip, FaTextHeight, FaCheck,
  FaCopy, FaLink, FaFacebook, FaTwitter, FaWhatsapp, FaTrash,
  FaPaperPlane, FaSmile,
} from "react-icons/fa";
import { MdFormatSize, MdHorizontalRule, MdFormatColorText, MdFormatColorFill } from "react-icons/md";

/* ═══════════════════════════════════
   PORTAL DROPDOWN
═══════════════════════════════════ */
const PortalDropdown = ({ anchorRef, open, onClose, children }) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !anchorRef.current) return;
    const update = () => {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update, true); window.removeEventListener("resize", update); };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (anchorRef.current && !anchorRef.current.contains(e.target)) onClose(); };
    const id = setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => { clearTimeout(id); document.removeEventListener("mousedown", handler); };
  }, [open, onClose, anchorRef]);

  if (!open) return null;
  return createPortal(
    <div style={{ position: "absolute", top: pos.top, left: pos.left, zIndex: 9999 }} onMouseDown={(e) => e.stopPropagation()}>
      {children}
    </div>,
    document.body
  );
};

/* ═══════════════════════════════════
   SHARE MODAL
═══════════════════════════════════ */
const ShareModal = ({ note, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/student/notes?id=${note.id}`;

  const copy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const platforms = [
    { name: "WhatsApp", icon: <FaWhatsapp className="text-lg" />, color: "bg-green-500 hover:bg-green-600", url: `https://wa.me/?text=${encodeURIComponent(note.title + " " + shareUrl)}` },
    { name: "Twitter", icon: <FaTwitter className="text-lg" />, color: "bg-sky-500 hover:bg-sky-600", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(note.title)}&url=${encodeURIComponent(shareUrl)}` },
    { name: "Facebook", icon: <FaFacebook className="text-lg" />, color: "bg-blue-600 hover:bg-blue-700", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Share Note</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">{note.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 transition"><FaTimes /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Social buttons */}
          <div className="flex gap-2">
            {platforms.map(p => (
              <button key={p.name} onClick={() => window.open(p.url, "_blank")}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-white transition ${p.color}`}>
                {p.icon}
                <span className="text-[10px] font-semibold">{p.name}</span>
              </button>
            ))}
          </div>
          {/* Copy link */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Or copy link</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                <FaLink className="text-gray-400 text-xs flex-shrink-0" />
                <span className="text-xs text-gray-500 truncate">{shareUrl}</span>
              </div>
              <button onClick={copy}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${copied ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
                {copied ? <><FaCheck className="text-[9px]" /> Copied!</> : <><FaCopy className="text-[9px]" /> Copy</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════
   COMMENTS MODAL
═══════════════════════════════════ */
const CommentsModal = ({ note, onClose, onAddComment }) => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAddComment(note.id, text.trim());
    setText("");
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Comments</h2>
            <p className="text-xs text-gray-400 mt-0.5">{note.commentsList?.length || 0} comment{(note.commentsList?.length || 0) !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 transition"><FaTimes /></button>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {(!note.commentsList || note.commentsList.length === 0) ? (
            <div className="text-center py-10">
              <FaComment className="text-gray-200 text-3xl mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-medium">No comments yet</p>
              <p className="text-xs text-gray-300 mt-1">Be the first to share your thoughts!</p>
            </div>
          ) : (
            note.commentsList.map((c, i) => (
              <div key={i} className="flex gap-3">
                <img src={c.avatar} alt={c.author} className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-sm" />
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                    <p className="text-xs font-bold text-gray-800">{c.author}</p>
                    <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{c.text}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 px-1">{c.time}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="me" className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-sm" />
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <input ref={inputRef} type="text" value={text} onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSubmit()}
                placeholder="Write a comment..."
                className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400" />
            </div>
            <button onClick={handleSubmit} disabled={!text.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0">
              <FaPaperPlane className="text-xs" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 text-center">Press Enter to send</p>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════
   NOTE EDITOR (full screen)
═══════════════════════════════════ */
const NoteEditor = ({ onSave, onCancel }) => {
  const editorRef = useRef(null);
  const titleRef = useRef(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Weekly");
  const [category, setCategory] = useState("Product");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [activeFormats, setActiveFormats] = useState({});
  const [showFontSize, setShowFontSize] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [showHeading, setShowHeading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTextColor, setShowTextColor] = useState(false);
  const fontFamilyBtnRef = useRef(null);
  const fontSizeBtnRef = useRef(null);
  const headingBtnRef = useRef(null);
  const textColorBtnRef = useRef(null);
  const highlightBtnRef = useRef(null);
  const [currentFontSize, setCurrentFontSize] = useState("16");
  const [currentFontFamily, setCurrentFontFamily] = useState("Georgia");
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const autoSaveTimer = useRef(null);

  const fontSizes = ["12", "14", "16", "18", "20", "24", "28", "32", "36", "48"];
  const fontFamilies = [
    { name: "Default", value: "'Georgia', 'Times New Roman', serif" },
    { name: "Arial", value: "'Arial', sans-serif" },
    { name: "Helvetica", value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
    { name: "Times New Roman", value: "'Times New Roman', Times, serif" },
    { name: "Courier New", value: "'Courier New', Courier, monospace" },
    { name: "Verdana", value: "Verdana, Geneva, sans-serif" },
    { name: "Roboto", value: "'Roboto', sans-serif" },
    { name: "Open Sans", value: "'Open Sans', sans-serif" },
    { name: "Montserrat", value: "'Montserrat', sans-serif" },
    { name: "Inter", value: "'Inter', sans-serif" },
  ];
  const headings = ["H1", "H2", "H3", "H4", "H5", "H6", "Normal"];
  const textColors = [
    { name: "Default", value: "#1e293b" }, { name: "Blue", value: "#2563eb" },
    { name: "Green", value: "#16a34a" }, { name: "Red", value: "#dc2626" },
    { name: "Purple", value: "#9333ea" }, { name: "Orange", value: "#ea580c" },
    { name: "Pink", value: "#ec4899" }, { name: "Teal", value: "#14b8a6" },
    { name: "Indigo", value: "#6366f1" }, { name: "Cyan", value: "#06b6d4" },
  ];
  const highlightColors = [
    { name: "Yellow", value: "#fef08a" }, { name: "Green", value: "#bbf7d0" },
    { name: "Blue", value: "#bfdbfe" }, { name: "Red", value: "#fecaca" },
    { name: "Purple", value: "#e9d5ff" }, { name: "Orange", value: "#fed7aa" },
    { name: "Pink", value: "#fbcfe8" }, { name: "Cyan", value: "#cffafe" },
  ];

  const closeAll = () => { setShowFontSize(false); setShowFontFamily(false); setShowHeading(false); setShowColorPicker(false); setShowTextColor(false); };

  useEffect(() => {
    titleRef.current?.focus();
    if (editorRef.current) { editorRef.current.style.fontFamily = currentFontFamily; editorRef.current.style.fontSize = `${currentFontSize}px`; }
  }, []);

  const exec = useCallback((cmd, value = null) => {
    editorRef.current?.focus(); document.execCommand(cmd, false, value); updateActiveFormats(); editorRef.current?.focus();
  }, []);

  const updateActiveFormats = useCallback(() => {
    setActiveFormats({
      bold: document.queryCommandState("bold"), italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"), strikeThrough: document.queryCommandState("strikeThrough"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"), insertOrderedList: document.queryCommandState("insertOrderedList"),
      justifyLeft: document.queryCommandState("justifyLeft"), justifyCenter: document.queryCommandState("justifyCenter"), justifyRight: document.queryCommandState("justifyRight"),
    });
  }, []);

  const updateCounts = useCallback(() => {
    const text = editorRef.current?.innerText || "";
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    setCharCount(text.length);
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => { setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })); }, 1500);
  }, []);

  const insertHeading = (h) => { editorRef.current?.focus(); document.execCommand("formatBlock", false, h === "Normal" ? "p" : h.toLowerCase()); setShowHeading(false); updateActiveFormats(); };
  const setFontSize = (size) => { editorRef.current?.focus(); document.execCommand("fontSize", false, "7"); editorRef.current?.querySelectorAll('font[size="7"]').forEach(el => { el.removeAttribute("size"); el.style.fontSize = `${size}px`; }); setCurrentFontSize(size); setShowFontSize(false); };
  const setFontFamily = (fontValue, fontName) => { editorRef.current?.focus(); document.execCommand("fontName", false, fontName); setCurrentFontFamily(fontValue); setShowFontFamily(false); };
  const setTextColor = (color) => { editorRef.current?.focus(); document.execCommand("foreColor", false, color); setShowTextColor(false); };
  const setHighlightColor = (color) => { editorRef.current?.focus(); document.execCommand("hiliteColor", false, color); setShowColorPicker(false); };
  const insertHRule = () => exec("insertHTML", "<hr class='my-4 border-t-2 border-gray-200' />");
  const insertBlockquote = () => exec("formatBlock", "blockquote");
  const insertCode = () => exec("insertHTML", "<code class='bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800'>code</code>");

  const handleSave = () => {
    if (!title.trim()) { titleRef.current?.focus(); titleRef.current?.classList.add("ring-2", "ring-red-400"); setTimeout(() => titleRef.current?.classList.remove("ring-2", "ring-red-400"), 1500); return; }
    const content = editorRef.current?.innerHTML || "";
    const plainText = editorRef.current?.innerText || "";
    const points = plainText.split("\n").filter(l => l.trim().startsWith("•") || l.trim().startsWith("-")).map(l => l.trim().replace(/^[•\-]\s*/, "")).slice(0, 3);
    setSaved(true);
    setTimeout(() => onSave({ title, type, category, description: plainText.slice(0, 150), points, content }), 600);
  };

  const ToolBtn = ({ icon, cmd, value, title: tip, active, onClick }) => (
    <button title={tip} onMouseDown={e => { e.preventDefault(); onClick ? onClick() : exec(cmd, value); }}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all text-sm flex-shrink-0 ${active || activeFormats[cmd] ? "bg-blue-100 text-blue-700 shadow-inner" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`}>
      {icon}
    </button>
  );
  const Divider = () => <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0" />;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50" style={{ animation: "fadeInScale 0.2s ease" }}>
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onCancel} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition px-2 py-1 rounded-lg hover:bg-gray-100">
              <FaArrowLeft className="text-xs" /> Back
            </button>
            <div className="w-px h-5 bg-gray-200 hidden sm:block" />
          </div>
          <input ref={titleRef} type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Untitled Note…"
            className="flex-1 text-xl font-bold text-gray-800 bg-transparent border-none outline-none placeholder-gray-300 min-w-0" />
          <div className="flex items-center gap-2">
            <select value={type} onChange={e => setType(e.target.value)} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 bg-amber-50 text-amber-700 outline-none cursor-pointer">
              <option value="Weekly">Weekly</option><option value="Monthly">Monthly</option><option value="Personal">Personal</option>
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 bg-blue-50 text-blue-700 outline-none cursor-pointer">
              <option value="Product">Product</option><option value="Business">Business</option>
            </select>
          </div>
          {lastSavedTime && <span className="hidden md:flex items-center gap-1 text-xs text-gray-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400" />Saved {lastSavedTime}</span>}
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${saved ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
            <FaSave className="text-xs" />{saved ? "Saved!" : "Save Note"}
          </button>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 flex-shrink-0 overflow-x-auto">
        <div className="flex items-center gap-0.5 px-4 py-2 min-w-max">
          <div className="relative flex-shrink-0">
            <button ref={fontFamilyBtnRef} onMouseDown={e => { e.preventDefault(); const next = !showFontFamily; closeAll(); setShowFontFamily(next); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition">
              <FaFont className="text-sm" /><span className="hidden sm:inline text-[11px]">Font</span><FaChevronDown className={`text-[9px] transition-transform ${showFontFamily ? "rotate-180" : ""}`} />
            </button>
            <PortalDropdown anchorRef={fontFamilyBtnRef} open={showFontFamily} onClose={() => setShowFontFamily(false)}>
              <div className="bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 w-48">
                {fontFamilies.map(f => <button key={f.name} onMouseDown={e => { e.preventDefault(); setFontFamily(f.value, f.name); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition text-gray-700">{f.name}</button>)}
              </div>
            </PortalDropdown>
          </div>
          <div className="relative flex-shrink-0">
            <button ref={fontSizeBtnRef} onMouseDown={e => { e.preventDefault(); const next = !showFontSize; closeAll(); setShowFontSize(next); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition w-16">
              <MdFormatSize className="text-sm" /><span>{currentFontSize}</span><FaChevronDown className={`text-[9px] transition-transform ${showFontSize ? "rotate-180" : ""}`} />
            </button>
            <PortalDropdown anchorRef={fontSizeBtnRef} open={showFontSize} onClose={() => setShowFontSize(false)}>
              <div className="bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 w-20">
                {fontSizes.map(s => <button key={s} onMouseDown={e => { e.preventDefault(); setFontSize(s); }} className={`w-full text-left px-3 py-1 text-sm hover:bg-gray-50 transition ${currentFontSize === s ? "text-blue-600 font-bold" : "text-gray-700"}`}>{s}px</button>)}
              </div>
            </PortalDropdown>
          </div>
          <Divider />
          <div className="relative flex-shrink-0">
            <button ref={headingBtnRef} onMouseDown={e => { e.preventDefault(); const next = !showHeading; closeAll(); setShowHeading(next); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition">
              <FaHeading className="text-sm" /><FaChevronDown className={`text-[9px] transition-transform ${showHeading ? "rotate-180" : ""}`} />
            </button>
            <PortalDropdown anchorRef={headingBtnRef} open={showHeading} onClose={() => setShowHeading(false)}>
              <div className="bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 w-[120px]">
                {headings.map(h => <button key={h} onMouseDown={e => { e.preventDefault(); insertHeading(h); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition font-medium text-gray-700">{h}</button>)}
              </div>
            </PortalDropdown>
          </div>
          <Divider />
          <ToolBtn icon={<FaBold />} cmd="bold" title="Bold" />
          <ToolBtn icon={<FaItalic />} cmd="italic" title="Italic" />
          <ToolBtn icon={<FaUnderline />} cmd="underline" title="Underline" />
          <ToolBtn icon={<FaStrikethrough />} cmd="strikeThrough" title="Strikethrough" />
          <Divider />
          <div className="relative flex-shrink-0">
            <button ref={textColorBtnRef} onMouseDown={e => { e.preventDefault(); const next = !showTextColor; closeAll(); setShowTextColor(next); }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition text-gray-500" title="Text Color">
              <MdFormatColorText className="text-base" />
            </button>
            <PortalDropdown anchorRef={textColorBtnRef} open={showTextColor} onClose={() => setShowTextColor(false)}>
              <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-64">
                <p className="text-[10px] text-gray-400 font-semibold mb-2 uppercase">Text Colors</p>
                <div className="grid grid-cols-5 gap-2">{textColors.map(c => <button key={c.name} onMouseDown={e => { e.preventDefault(); setTextColor(c.value); }} className="w-8 h-8 rounded-lg hover:scale-110 transition shadow-sm" style={{ background: c.value }} title={c.name} />)}</div>
              </div>
            </PortalDropdown>
          </div>
          <div className="relative flex-shrink-0">
            <button ref={highlightBtnRef} onMouseDown={e => { e.preventDefault(); const next = !showColorPicker; closeAll(); setShowColorPicker(next); }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition text-gray-500" title="Highlight Color">
              <MdFormatColorFill className="text-base" />
            </button>
            <PortalDropdown anchorRef={highlightBtnRef} open={showColorPicker} onClose={() => setShowColorPicker(false)}>
              <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-64">
                <p className="text-[10px] text-gray-400 font-semibold mb-2 uppercase">Highlight Colors</p>
                <div className="grid grid-cols-4 gap-2">{highlightColors.map(c => <button key={c.name} onMouseDown={e => { e.preventDefault(); setHighlightColor(c.value); }} className="h-8 rounded-lg hover:scale-110 transition" style={{ background: c.value }} title={c.name} />)}</div>
              </div>
            </PortalDropdown>
          </div>
          <Divider />
          <ToolBtn icon={<FaListUl />} cmd="insertUnorderedList" title="Bullet List" />
          <ToolBtn icon={<FaListOl />} cmd="insertOrderedList" title="Numbered List" />
          <Divider />
          <ToolBtn icon={<FaAlignLeft />} cmd="justifyLeft" title="Align Left" />
          <ToolBtn icon={<FaAlignCenter />} cmd="justifyCenter" title="Align Center" />
          <ToolBtn icon={<FaAlignRight />} cmd="justifyRight" title="Align Right" />
          <Divider />
          <ToolBtn icon={<FaQuoteLeft className="text-xs" />} title="Blockquote" onClick={insertBlockquote} />
          <ToolBtn icon={<FaCode className="text-xs" />} title="Inline Code" onClick={insertCode} />
          <ToolBtn icon={<MdHorizontalRule className="text-base" />} title="Divider" onClick={insertHRule} />
          <Divider />
          <ToolBtn icon={<FaUndo className="text-xs" />} cmd="undo" title="Undo" />
          <ToolBtn icon={<FaRedo className="text-xs" />} cmd="redo" title="Redo" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex justify-center px-4 py-8 bg-gray-100">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-xl min-h-[calc(100vh-220px)] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-2xl" />
            <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={updateCounts} onKeyUp={updateActiveFormats} onMouseUp={updateActiveFormats} onClick={closeAll}
              className="min-h-[calc(100vh-240px)] px-8 sm:px-12 py-10 outline-none text-gray-800 leading-relaxed"
              style={{ fontFamily: currentFontFamily, fontSize: `${currentFontSize}px`, lineHeight: "1.9" }} data-placeholder="Start writing your note here…" />
          </div>
          <div className="flex justify-end gap-4 mt-3 px-1">
            <span className="text-xs text-gray-400">{wordCount} words</span>
            <span className="text-xs text-gray-400">{charCount} characters</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        [contenteditable]:empty:before { content: attr(data-placeholder); color: #cbd5e1; pointer-events: none; font-style: italic; }
        [contenteditable] blockquote { border-left: 3px solid #3b82f6; margin: 12px 0; padding: 8px 16px; background: #eff6ff; border-radius: 0 8px 8px 0; color: #1e40af; font-style: italic; }
        [contenteditable] h1 { font-size: 2em; font-weight: 800; margin: 16px 0 8px; color: #0f172a; }
        [contenteditable] h2 { font-size: 1.5em; font-weight: 700; margin: 14px 0 7px; color: #1e293b; }
        [contenteditable] h3 { font-size: 1.25em; font-weight: 700; margin: 12px 0 6px; color: #334155; }
        [contenteditable] h4 { font-size: 1.1em; font-weight: 600; margin: 10px 0 5px; color: #475569; }
        [contenteditable] ul { list-style: disc; padding-left: 24px; margin: 8px 0; }
        [contenteditable] ol { list-style: decimal; padding-left: 24px; margin: 8px 0; }
      `}</style>
    </div>
  );
};

/* ═══════════════════════════════════
   MAIN NOTES COMPONENT
═══════════════════════════════════ */
const INITIAL_NOTES = [
  {
    id: 1, type: "Weekly", category: "Product", title: "Product Team Meeting",
    description: "Reviewing Q4 targets and planning next sprint.",
    points: ["Introduction to New Product Plan", "Monthly Revenue updates"],
    author: "Floyd Miles", date: "Mar 5 04:25", avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    likes: 24, liked: false, comments: 8,
    commentsList: [
      { author: "Priya M.", avatar: "https://randomuser.me/api/portraits/women/44.jpg", text: "Great notes! Very detailed.", time: "2 hours ago" },
      { author: "Arjun S.", avatar: "https://randomuser.me/api/portraits/men/55.jpg", text: "Thanks for sharing these.", time: "1 hour ago" },
    ],
  },
  {
    id: 2, type: "Monthly", category: "Business", title: "Business Strategy Review",
    description: "Evaluating market position and growth opportunities.",
    points: ["Market Analysis Review", "Growth Strategy Planning"],
    author: "Dianne Russell", date: "Apr 11 18:30", avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    likes: 42, liked: false, comments: 15, commentsList: [],
  },
  {
    id: 3, type: "Personal", category: "Business", title: "HR Interview Notes",
    description: "Candidate shortlisting process notes.",
    points: ["Technical Round Feedback", "Communication Skills Assessment"],
    author: "Annette Black", date: "Jun 23 14:31", avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    likes: 18, liked: false, comments: 5, commentsList: [],
  },
  {
    id: 4, type: "Monthly", category: "Product", title: "Monthly Team Progress",
    description: "Team achievements and challenges review.",
    points: ["Sprint Goals Achieved", "Blockers Identified"],
    author: "Robert Fox", date: "Jan 31 09:53", avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    likes: 56, liked: false, comments: 23, commentsList: [],
  },
  {
    id: 5, type: "Monthly", category: "Business", title: "Weekly Sync Meeting",
    description: "Weekly meeting summaries for reference.",
    points: ["Project Updates", "Next Week Planning"],
    author: "Brooklyn Simmons", date: "Aug 15 10:29", avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    likes: 31, liked: false, comments: 12, commentsList: [],
  },
  {
    id: 6, type: "Personal", category: "Image", title: "Document Images Archive",
    description: "Important files and document images.",
    points: ["Project Documents", "Reference Materials"],
    author: "Cameron Williamson", date: "Dec 30 21:28", avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    likes: 12, liked: false, comments: 4, commentsList: [],
  },
];

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const courseId = 1; // get from params or selected course
  const [sortType, setSortType] = useState("Latest");
  const [filter, setFilter] = useState("All");
  const [showEditor, setShowEditor] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuNote, setActiveMenuNote] = useState(null);
  const [messageModal, setMessageModal] = useState({ show: false, type: "", message: "" });

  // Like / Comment / Share modal state
  const [shareNote, setShareNote] = useState(null);
  const [commentNote, setCommentNote] = useState(null);

  const filterOptions = ["All", "Weekly", "Monthly", "Personal"];
  const sortOptions = ["Latest", "Oldest", "Most Liked", "Most Commented"];

  const tagColors = {
    Weekly: "bg-amber-50 text-amber-700 border border-amber-200",
    Monthly: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Personal: "bg-orange-50 text-orange-700 border border-orange-200",
    Product: "bg-blue-50 text-blue-700 border border-blue-200",
    Business: "bg-purple-50 text-purple-700 border border-purple-200",
    Image: "bg-pink-50 text-pink-700 border border-pink-200",
  };

  const filteredNotes = useMemo(() => {
    let data = [...notes];
    if (searchTerm) data = data.filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()) || i.description.toLowerCase().includes(searchTerm.toLowerCase()) || (i.userName || "").toLowerCase().includes(searchTerm.toLowerCase()));
    if (filter !== "All") data = data.filter(i => i.type === filter);
    if (sortType === "Latest") data.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortType === "Oldest") data.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortType === "Most Liked") data.sort((a, b) => b.likes - a.likes);
    else if (sortType === "Most Commented") data.sort((a, b) => b.comments - a.comments);
    return data;
  }, [filter, sortType, notes, searchTerm]);

  /* ── Like handler ── */
  const handleLike = (id) => {
    setNotes(prev => prev.map(n => n.id === id
      ? { ...n, liked: !n.liked, likes: n.liked ? n.likes - 1 : n.likes + 1 }
      : n
    ));
  };

  /* ── Add comment handler ── */
  const handleAddComment = (noteId, text) => {
    setNotes(prev => prev.map(n => n.id === noteId
      ? {
        ...n,
        comments: n.comments + 1,
        commentsList: [
          ...(n.commentsList || []),
          { author: "You", avatar: "https://randomuser.me/api/portraits/men/32.jpg", text, time: "Just now" },
        ],
      }
      : n
    ));
    // keep modal open with updated note
    setCommentNote(prev => prev ? { ...prev, comments: prev.comments + 1, commentsList: [...(prev.commentsList || []), { author: "You", avatar: "https://randomuser.me/api/portraits/men/32.jpg", text, time: "Just now" }] } : null);
  };

  /* ── Open comment modal with latest note data ── */
  const openComments = (noteId) => {
    const n = notes.find(n => n.id === noteId);
    if (n) setCommentNote(n);
  };

  const handleSaveNote = async ({
    title,
    type,
    category,
    description,
    points,
    content,
  }) => {
    try {
      const payload = {
        title,
        description,
        courseId: 1,
      };

      await studentNotesApi.createNote(payload);

      setShowEditor(false);

      setMessageModal({
        show: true,
        type: "success",
        message: "Note Created Successfully!",
      });

      fetchNotes(currentPage);
    } catch (error) {
      console.error("Create Note Error:", error);

      setMessageModal({
        show: true,
        type: "error",
        message: "Failed to create note",
      });
    }
  };

  const handleDeleteNote = async (id) => {
    const confirmed = window.confirm("Delete this note?");

    if (!confirmed) return;

    try {
      await studentNotesApi.deleteNote(id);

      setNotes((prev) => prev.filter((note) => note.id !== id));

      setActiveMenuNote(null);

      setMessageModal({
        show: true,
        type: "success",
        message: "Note Deleted Successfully!",
      });

      // Refresh current page
      fetchNotes(currentPage);

    } catch (error) {
      console.error("Delete Note Error:", error);

      setMessageModal({
        show: true,
        type: "error",
        message: "Failed to delete note",
      });
    }
  };

  const fetchNotes = async (page = 0) => {
    try {
      setLoading(true);

      const response = await studentNotesApi.getNotes(
        courseId,
        page,
        10
      );

      const data = response.data;
      console.log("API DATA:", data.content);

      const formattedNotes = (data.content || []).map((note) => ({
        ...note,

        likes: 0,
        comments: 0,
        liked: false,
        commentsList: [],

        type: "Personal",
        category: "Product",

        date: new Date(note.createdAt).toLocaleDateString(),

        points: [],
      }));

      setNotes(formattedNotes);
      setCurrentPage(data.number);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [courseId]);

  const stats = {
    total: notes.length,
    weekly: notes.filter(n => n.type === "Weekly").length,
    monthly: notes.filter(n => n.type === "Monthly").length,
    personal: notes.filter(n => n.type === "Personal").length,
  };

  useEffect(() => {
    if (localStorage.getItem("openNoteEditor") === "true") { setShowEditor(true); localStorage.removeItem("openNoteEditor"); }
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handler = () => setActiveMenuNote(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  if (showEditor) return <NoteEditor onSave={handleSaveNote} onCancel={() => setShowEditor(false)} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-6">
        <p className="text-xs sm:text-sm text-gray-400">
          <Link to="/student/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
          <span className="mx-1 sm:mx-2">&gt;</span>
          <span className="text-gray-600 font-medium">Notes</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Notes Library</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Organize your thoughts and important information</p>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md text-sm">
            <FaPlus className="text-xs" /> Add New Note
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 pb-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {[
            { label: "Total Notes", value: stats.total, icon: <FaStickyNote className="text-blue-600 text-lg sm:text-2xl" />, bg: "bg-blue-50" },
            { label: "Weekly Notes", value: stats.weekly, icon: <FaCalendarAlt className="text-amber-600 text-base sm:text-[22px]" />, bg: "bg-amber-50" },
            { label: "Monthly Notes", value: stats.monthly, icon: <FaCalendarAlt className="text-emerald-600 text-base sm:text-[22px]" />, bg: "bg-emerald-50" },
            { label: "Personal Notes", value: stats.personal, icon: <FaUser className="text-orange-600 text-base sm:text-[22px]" />, bg: "bg-orange-50" },
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

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
              <input type="text" placeholder="Search notes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-xs sm:text-sm" />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <div className="relative">
                <button onClick={e => { e.stopPropagation(); setShowFilterDropdown(!showFilterDropdown); setShowSortDropdown(false); }}
                  className="h-9 sm:h-11 px-3 sm:px-5 border border-gray-200 rounded-lg flex items-center gap-1.5 sm:gap-2 text-gray-700 hover:bg-gray-50 transition text-xs sm:text-sm">
                  <FaFilter className="text-xs" /><span className="font-medium hidden sm:inline">Filter:</span><span>{filter}</span>
                </button>
                {showFilterDropdown && (
                  <div className="absolute top-10 sm:top-12 left-0 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-2">
                    {filterOptions.map(item => (
                      <button key={item} onClick={() => { setFilter(item); setShowFilterDropdown(false); }}
                        className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm transition ${filter === item ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>{item}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button onClick={e => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown); setShowFilterDropdown(false); }}
                  className="h-9 sm:h-11 px-3 sm:px-5 border border-gray-200 rounded-lg flex items-center gap-1.5 sm:gap-2 text-gray-700 hover:bg-gray-50 transition text-xs sm:text-sm">
                  <FaSortAmountDown className="text-xs" /><span className="font-medium hidden sm:inline">Sort:</span><span>{sortType}</span>
                </button>
                {showSortDropdown && (
                  <div className="absolute top-10 sm:top-12 right-0 w-40 sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-2">
                    {sortOptions.map(item => (
                      <button key={item} onClick={() => { setSortType(item); setShowSortDropdown(false); }}
                        className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm transition ${sortType === item ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>{item}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {notes.map(note => (
              <div key={note.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
                <div className="p-3 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <span className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium ${tagColors[note.type]}`}>{note.noteType || "Note"}</span>
                      {note.category !== "Image" && (
                        <span className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium ${tagColors[note.category]}`}>{note.category}</span>
                      )}
                    </div>
                    <div className="relative">
                      <button onClick={e => { e.stopPropagation(); setActiveMenuNote(activeMenuNote === note.id ? null : note.id); }}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition">
                        <FaEllipsisH className="text-xs sm:text-sm" />
                      </button>
                      {activeMenuNote === note.id && (
                        <div className="absolute right-0 top-6 sm:top-8 w-36 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-1.5 overflow-hidden">
                          <button onClick={() => { openComments(note.id); setActiveMenuNote(null); }}
                            className="w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                            <FaComment className="text-blue-400 text-[10px]" /> View Comments
                          </button>
                          <button onClick={() => { setShareNote(note); setActiveMenuNote(null); }}
                            className="w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                            <FaShare className="text-green-400 text-[10px]" /> Share Note
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button onClick={() => handleDeleteNote(note.id)}
                            className="w-full text-left px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2">
                            <FaTrash className="text-[10px]" /> Delete Note
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h2 className="text-sm sm:text-lg font-bold text-gray-800 mb-1.5 sm:mb-2 line-clamp-2 hover:text-blue-600 transition-colors">{note.title}</h2>
                  <p className="text-gray-600 text-[11px] sm:text-sm mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3">{note.description}</p>

                  {note.points?.length > 0 && (
                    <ul className="space-y-0.5 sm:space-y-1 mb-2 sm:mb-3">
                      {note.points.slice(0, 2).map((point, i) => (
                        <li key={i} className="text-gray-500 text-[10px] sm:text-xs flex items-start gap-1.5">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span className="line-clamp-1">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-gray-50 px-3 sm:px-5 py-2 sm:py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <img
                      src="https://ui-avatars.com/api/?name=User"
                      alt="User" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-2 ring-white" />
                    <span className="text-[10px] sm:text-sm font-medium text-gray-700 truncate max-w-[100px] sm:max-w-none">{note.userName || "Unknown User"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] sm:text-xs text-gray-500">
                    <FaClock className="text-[8px] sm:text-xs" /><span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-sm border border-gray-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FaStickyNote className="text-2xl sm:text-4xl text-gray-400" />
            </div>
            <h3 className="text-base sm:text-xl font-semibold text-gray-600 mb-1 sm:mb-2">No notes found</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Try adjusting your search or filter criteria</p>
            <button onClick={() => { setSearchTerm(""); setFilter("All"); setSortType("Latest"); }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8 mb-4 flex-wrap">
        <button
          disabled={currentPage === 0}
          onClick={() => fetchNotes(currentPage - 1)}
          className={`px-4 py-2 rounded-lg border transition ${currentPage === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-blue-50 hover:border-blue-500"
            }`}
        >
          ← Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => fetchNotes(index)}
            className={`w-10 h-10 rounded-lg font-medium transition ${currentPage === index
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white border hover:bg-blue-50"
              }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => fetchNotes(currentPage + 1)}
          className={`px-4 py-2 rounded-lg border transition ${currentPage === totalPages - 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-blue-50 hover:border-blue-500"
            }`}
        >
          Next →
        </button>
      </div>

      {/* Success / Error modal */}
      {messageModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-3">
          <div className="w-80 sm:w-96 bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-xl text-center">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4 ${messageModal.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
              {messageModal.type === "success" ? "✓" : "!"}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">{messageModal.type === "success" ? "Success!" : "Error!"}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">{messageModal.message}</p>
            <button onClick={() => setMessageModal({ show: false, type: "", message: "" })}
              className={`w-full py-2 sm:py-2.5 rounded-lg text-white font-semibold text-sm ${messageModal.type === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} transition`}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareNote && <ShareModal note={shareNote} onClose={() => setShareNote(null)} />}

      {/* Comments Modal */}
      {commentNote && (
        <CommentsModal
          note={notes.find(n => n.id === commentNote.id) || commentNote}
          onClose={() => setCommentNote(null)}
          onAddComment={handleAddComment}
        />
      )}

      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}

export default Notes;