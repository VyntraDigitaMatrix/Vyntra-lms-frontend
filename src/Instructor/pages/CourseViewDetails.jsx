import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import S1 from "../../assets/S1.jpg";
import S2 from "../../assets/S2.jpg";
import S3 from "../../assets/S3.jpg";
import S4 from "../../assets/S4.jpg";
import S5 from "../../assets/S5.jpg";
import S6 from "../../assets/S6.jpg";
import S7 from "../../assets/S7.jpg";
import S8 from "../../assets/S8.jpg";

import { FaStar, FaUser, FaBook, FaClock, FaTrophy, FaCheckCircle, FaChevronDown, FaPlay, FaLock, FaShieldAlt, FaLinkedin, FaEdit, FaTrash, FaPlus, FaTimes, FaVideo, FaFilePdf, FaLink, FaUpload, FaCheck, FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaEraser } from "react-icons/fa";
import { AiOutlinePlaySquare } from "react-icons/ai";
import { instructorCourseApi, instructorModuleApi, instructorLessonApi } from "../auth/api";

/* ── Data ── */
const coursesData = {
  1: { id: 1, title: "Digital Marketing Fundamentals", badge: "Bestseller", image: S1, rating: "4.7", reviews: "1,250", lessons: 28, modules: 6, duration: "4h 35m", description: "Learn the basics of digital marketing and kickstart your career.", price: "₹999", oldPrice: "₹2,499", offer: "60% OFF", students: "5,432", level: "Beginner", language: "English", instructorId: 101 },
  2: { id: 2, title: "Search Engine Optimization (SEO)", badge: "Popular", image: S2, rating: "4.6", reviews: "980", lessons: 26, modules: 5, duration: "3h 50m", description: "Master SEO strategies to rank higher on search engines.", price: "₹1,199", oldPrice: "₹2,999", offer: "60% OFF", students: "2,110", level: "Intermediate", language: "English", instructorId: 101 },
  3: { id: 3, title: "Social Media Marketing Mastery", badge: "Trending", image: S3, rating: "4.8", reviews: "1,450", lessons: 30, modules: 6, duration: "5h 10m", description: "Build brand awareness using powerful social platforms.", price: "₹1,299", oldPrice: "₹2,999", offer: "57% OFF", students: "4,050", level: "All Levels", language: "Telugu", instructorId: 102 },
  4: { id: 4, title: "Email Marketing Essentials", badge: "", image: S4, rating: "4.5", reviews: "760", lessons: 18, modules: 4, duration: "2h 45m", description: "Learn email marketing strategies that drive results.", price: "₹899", oldPrice: "₹1,999", offer: "55% OFF", students: "1,340", level: "Beginner", language: "Hindi", instructorId: 101 },
  5: { id: 5, title: "YouTube Marketing Success", badge: "", image: S5, rating: "4.7", reviews: "820", lessons: 22, modules: 5, duration: "3h 20m", description: "Grow your YouTube channel and brand with proven strategies.", price: "₹1,099", oldPrice: "₹2,699", offer: "50% OFF", students: "1,890", level: "Intermediate", language: "English", instructorId: 103 },
  6: { id: 6, title: "Google Ads Campaigns", badge: "", image: S6, rating: "4.6", reviews: "650", lessons: 20, modules: 5, duration: "3h 05m", description: "Run profitable ad campaigns and get high ROI.", price: "₹1,299", oldPrice: "₹2,999", offer: "57% OFF", students: "1,560", level: "Advanced", language: "English", instructorId: 101 },
  7: { id: 7, title: "Google Analytics Mastery", badge: "", image: S7, rating: "4.6", reviews: "540", lessons: 16, modules: 4, duration: "2h 30m", description: "Analyze data and make smart marketing decisions.", price: "₹899", oldPrice: "₹1,999", offer: "55% OFF", students: "980", level: "Intermediate", language: "Tamil", instructorId: 102 },
  8: { id: 8, title: "E-commerce Marketing Strategies", badge: "", image: S8, rating: "4.7", reviews: "610", lessons: 24, modules: 6, duration: "4h 00m", description: "Boost sales and grow your online business.", price: "₹1,199", oldPrice: "₹2,499", offer: "52% OFF", students: "1,230", level: "All Levels", language: "English", instructorId: 101 },
};

const modulesData = [
  { title: "Module 1: Introduction to Digital Marketing", lessons: 5, color: "#7C3AED", icon: "📚" },
  { title: "Module 2: Search Engine Optimization (SEO)", lessons: 6, color: "#EA580C", icon: "🔍" },
  { title: "Module 3: Social Media Marketing", lessons: 6, color: "#059669", icon: "📱" },
  { title: "Module 4: Content Marketing", lessons: 4, color: "#2563EB", icon: "✏️" },
  { title: "Module 5: Email Marketing", lessons: 4, color: "#DB2777", icon: "✉️" },
  { title: "Module 6: Google Ads & Analytics", lessons: 3, color: "#D97706", icon: "📊" },
];

const reviewsData = [
  { name: "Rajesh Kumar", initial: "R", rating: 5, time: "2 weeks ago", text: "Excellent course! Very detailed and practical examples." },
  { name: "Priya Sharma", initial: "P", rating: 4, time: "1 month ago", text: "Great content, very helpful for my career." },
  { name: "Amit Patel", initial: "A", rating: 5, time: "2 months ago", text: "Best course I've taken! Highly recommend." },
];

const faqsData = [
  { q: "Is this course for beginners?", a: "Yes, this course is designed for absolute beginners with no prior experience." },
  { q: "Will I get a certificate?", a: "Yes, you will receive a certificate of completion after finishing the course." },
  { q: "How long do I have access?", a: "You get lifetime access to all course materials." },
  { q: "Is there any support?", a: "Yes, you can ask questions in the discussion forum and get instructor support." },
];

/* ── Custom Rich Text Editor Component ── */
const RichTextEditor = ({ value, onChange, placeholder, disabled }) => {
  const editorRef = React.useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command, arg = null) => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-violet-400 focus-within:bg-white transition flex flex-col">
      <style>{`
        .rich-editor[contenteditable]:empty:before {
          content: attr(placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
        .rich-editor {
          min-height: 120px;
          outline: none;
        }
        .rich-editor ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rich-editor ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rich-editor a {
          color: #7c3aed;
          text-decoration: underline;
        }
      `}</style>
      
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-100 border-b border-gray-200 select-none">
        <button
          type="button"
          onClick={() => execCmd("bold")}
          className="w-8 h-8 rounded-lg hover:bg-white/85 hover:shadow-sm flex items-center justify-center text-gray-700 hover:text-violet-600 transition border-none bg-transparent cursor-pointer"
          title="Bold"
          disabled={disabled}
        >
          <FaBold className="text-xs" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("italic")}
          className="w-8 h-8 rounded-lg hover:bg-white/85 hover:shadow-sm flex items-center justify-center text-gray-700 hover:text-violet-600 transition border-none bg-transparent cursor-pointer"
          title="Italic"
          disabled={disabled}
        >
          <FaItalic className="text-xs" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("underline")}
          className="w-8 h-8 rounded-lg hover:bg-white/85 hover:shadow-sm flex items-center justify-center text-gray-700 hover:text-violet-600 transition border-none bg-transparent cursor-pointer"
          title="Underline"
          disabled={disabled}
        >
          <FaUnderline className="text-xs" />
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1.5" />
        
        <button
          type="button"
          onClick={() => execCmd("insertUnorderedList")}
          className="w-8 h-8 rounded-lg hover:bg-white/85 hover:shadow-sm flex items-center justify-center text-gray-700 hover:text-violet-600 transition border-none bg-transparent cursor-pointer"
          title="Bullet List"
          disabled={disabled}
        >
          <FaListUl className="text-xs" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("insertOrderedList")}
          className="w-8 h-8 rounded-lg hover:bg-white/85 hover:shadow-sm flex items-center justify-center text-gray-700 hover:text-violet-600 transition border-none bg-transparent cursor-pointer"
          title="Numbered List"
          disabled={disabled}
        >
          <FaListOl className="text-xs" />
        </button>
        
        <div className="w-px h-5 bg-gray-300 mx-1.5" />
        
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) execCmd("createLink", url);
          }}
          className="w-8 h-8 rounded-lg hover:bg-white/85 hover:shadow-sm flex items-center justify-center text-gray-700 hover:text-violet-600 transition border-none bg-transparent cursor-pointer"
          title="Insert Link"
          disabled={disabled}
        >
          <FaLink className="text-xs" />
        </button>
        
        <button
          type="button"
          onClick={() => execCmd("removeFormat")}
          className="w-8 h-8 rounded-lg hover:bg-white/85 hover:shadow-sm flex items-center justify-center text-gray-700 hover:text-violet-600 transition border-none bg-transparent cursor-pointer ml-auto"
          title="Clear Format"
          disabled={disabled}
        >
          <FaEraser className="text-xs" />
        </button>
      </div>

      {/* Editor Body */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        placeholder={placeholder}
        className="rich-editor w-full px-3.5 py-2.5 text-sm text-gray-800 bg-transparent overflow-y-auto"
      />
    </div>
  );
};

/* ── Main Component ── */
const CourseViewDetails = () => {
  const { id } = useParams();

  // Dynamic State
  const [courseData, setCourseData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [expandedModules, setExpandedModules] = useState({});
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 15, minutes: 48, seconds: 36 });

  // Module Modal states
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleModalMode, setModuleModalMode] = useState("add"); // "add" or "edit"
  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "", sortOrder: "", previewAllowed: false });
  const [moduleSubmitting, setModuleSubmitting] = useState(false);
  const [moduleError, setModuleError] = useState("");

  // Lesson Modal and dynamic states
  const [moduleLessons, setModuleLessons] = useState({});
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonModalMode, setLessonModalMode] = useState("add"); // "add" or "edit"
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [targetModuleId, setTargetModuleId] = useState(null);

  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    lessonType: "VIDEO",
    content: "",
    durationInMinutes: "",
    sortOrder: "",
    previewAllowed: false,
    mandatory: true,
    videoInputType: "URL",
    videoUrl: "",
    videoFile: null,
    resourceInputType: "URL",
    resourceUrl: "",
    resourceFile: null
  });
  const [lessonSubmitting, setLessonSubmitting] = useState(false);
  const [lessonError, setLessonError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [courseRes, modulesRes] = await Promise.all([
        instructorCourseApi.getInstructorCourseById(id),
        instructorModuleApi.getCourseModules(id, 0, 100)
      ]);
      if (courseRes.data && courseRes.data.data) {
        setCourseData(courseRes.data.data);
      }
      if (modulesRes.data && modulesRes.data.data) {
        const fetchedModules = modulesRes.data.data.content || [];
        fetchedModules.sort((a, b) => a.sortOrder - b.sortOrder);
        setModules(fetchedModules);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch course details or modules from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");
  const toggleModule = async (i, moduleId) => {
    const isExpanding = !expandedModules[i];
    setExpandedModules((p) => ({ ...p, [i]: isExpanding }));
    if (isExpanding && moduleId) {
      await fetchLessonsForModule(moduleId);
    }
  };

  // Computed course object to feed existing JSX seamlessly
  const course = courseData ? {
    ...courseData,
    title: courseData.title || "",
    description: courseData.description || "No description provided.",
    rating: courseData.averageRating || "4.7",
    reviews: courseData.totalRatings || "120",
    students: courseData.studentsEnrolled || "1,250",
    level: courseData.level || "Beginner",
    lessons: courseData.lessonsCount || 28,
    modules: modules.length,
    duration: courseData.duration || "4h 35m",
    price: courseData.discountPrice ? `₹${courseData.discountPrice}` : (courseData.price ? `₹${courseData.price}` : "₹999"),
    oldPrice: courseData.price ? `₹${courseData.price}` : "₹2,499",
    offer: courseData.discountPrice && courseData.price ? `${Math.round(((courseData.price - courseData.discountPrice) / courseData.price) * 100)}% OFF` : "60% OFF",
    image: courseData.thumbnailUrl || S1,
    language: courseData.language || "English",
  } : {
    id: id,
    title: "Loading...",
    description: "",
    rating: "4.7",
    reviews: "0",
    students: "0",
    level: "Beginner",
    lessons: 0,
    modules: 0,
    duration: "",
    price: "₹0",
    oldPrice: "₹0",
    offer: "0% OFF",
    image: S1,
    language: "English",
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "curriculum", label: "Curriculum" },
    { key: "instructor", label: "Instructor" },
    { key: "reviews", label: `Reviews (${course.reviews})` },
    { key: "faqs", label: "FAQs" },
  ];

  // Module action handlers
  const handleOpenAddModal = () => {
    const nextSortOrder = modules.length > 0 ? Math.max(...modules.map(m => m.sortOrder || 0)) + 1 : 1;
    setModuleForm({ title: "", description: "", sortOrder: nextSortOrder, previewAllowed: false });
    setModuleModalMode("add");
    setModuleError("");
    setShowModuleModal(true);
  };

  const handleOpenEditModal = (mod) => {
    setSelectedModule(mod);
    setModuleForm({
      title: mod.title || "",
      description: mod.description || "",
      sortOrder: mod.sortOrder || "",
      previewAllowed: mod.previewAllowed ?? false,
    });
    setModuleModalMode("edit");
    setModuleError("");
    setShowModuleModal(true);
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    if (!moduleForm.title.trim()) {
      setModuleError("Title is required.");
      return;
    }
    if (moduleForm.sortOrder === "") {
      setModuleError("Sort order is required.");
      return;
    }

    setModuleSubmitting(true);
    setModuleError("");
    try {
      const payload = {
        title: moduleForm.title.trim(),
        description: moduleForm.description.trim(),
        sortOrder: parseInt(moduleForm.sortOrder, 10),
        previewAllowed: moduleForm.previewAllowed ?? false,
      };

      if (moduleModalMode === "add") {
        await instructorModuleApi.createModule(id, payload);
      } else {
        await instructorModuleApi.updateModule(selectedModule.id, payload);
      }

      setShowModuleModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      const backendMessage = err.response?.data?.message || err.response?.data?.errors?.[0] || "An error occurred while saving the module.";
      setModuleError(backendMessage);
    } finally {
      setModuleSubmitting(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
      try {
        await instructorModuleApi.deleteModule(moduleId);
        fetchData();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to delete the module.");
      }
    }
  };

  const handleRequestPublish = async () => {
    if (window.confirm("Are you sure you want to request publication for this course? Administrators will review it.")) {
      setPublishing(true);
      try {
        await instructorCourseApi.requestCoursePublish(id);
        alert("Publish request submitted successfully!");
        fetchData();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to submit publish request.");
      } finally {
        setPublishing(false);
      }
    }
  };

  const fetchLessonsForModule = async (moduleId) => {
    try {
      const res = await instructorLessonApi.getModuleLessons(moduleId, 0, 100);
      if (res.data && res.data.data) {
        const fetchedLessons = res.data.data.content || [];
        fetchedLessons.sort((a, b) => a.sortOrder - b.sortOrder);
        setModuleLessons(prev => ({ ...prev, [moduleId]: fetchedLessons }));
      }
    } catch (err) {
      console.error("Failed to fetch lessons for module " + moduleId, err);
    }
  };

  const handleOpenAddLessonModal = (moduleId) => {
    setTargetModuleId(moduleId);
    const existingLessons = moduleLessons[moduleId] || [];
    const nextSortOrder = existingLessons.length > 0 ? Math.max(...existingLessons.map(l => l.sortOrder || 0)) + 1 : 1;

    setLessonForm({
      title: "",
      description: "",
      lessonType: "VIDEO",
      content: "",
      durationInMinutes: "",
      sortOrder: nextSortOrder,
      previewAllowed: false,
      mandatory: true,
      videoInputType: "URL",
      videoUrl: "",
      videoFile: null,
      resourceInputType: "URL",
      resourceUrl: "",
      resourceFile: null
    });
    setLessonModalMode("add");
    setLessonError("");
    setShowLessonModal(true);
  };

  const handleOpenEditLessonModal = (lesson, moduleId) => {
    setSelectedLesson(lesson);
    setTargetModuleId(moduleId);

    setLessonForm({
      title: lesson.title || "",
      description: lesson.description || "",
      lessonType: lesson.lessonType || "VIDEO",
      content: lesson.content || "",
      durationInMinutes: lesson.durationInMinutes || "",
      sortOrder: lesson.sortOrder || "",
      previewAllowed: lesson.previewAllowed ?? false,
      mandatory: lesson.mandatory ?? true,
      videoInputType: lesson.videoUrl ? "URL" : "FILE_UPLOAD",
      videoUrl: lesson.videoUrl || "",
      videoFile: null,
      resourceInputType: lesson.resourceUrl ? "URL" : "FILE_UPLOAD",
      resourceUrl: lesson.resourceUrl || "",
      resourceFile: null
    });
    setLessonModalMode("edit");
    setLessonError("");
    setShowLessonModal(true);
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) {
      setLessonError("Lesson Title is required.");
      return;
    }
    if (lessonForm.sortOrder === "") {
      setLessonError("Sort order is required.");
      return;
    }

    setLessonSubmitting(true);
    setLessonError("");
    try {
      const formData = new FormData();
      formData.append("title", lessonForm.title.trim());
      formData.append("description", lessonForm.description.trim());
      formData.append("lessonType", lessonForm.lessonType);
      formData.append("content", lessonForm.content.trim());
      formData.append("sortOrder", parseInt(lessonForm.sortOrder, 10));
      formData.append("previewAllowed", lessonForm.previewAllowed);
      formData.append("mandatory", lessonForm.mandatory);

      if (lessonForm.durationInMinutes !== "") {
        formData.append("durationInMinutes", parseInt(lessonForm.durationInMinutes, 10));
      }

      // Handle Video media fields
      if (lessonForm.lessonType === "VIDEO" || lessonForm.lessonType === "LIVE_CLASS") {
        formData.append("videoInputType", lessonForm.videoInputType);
        if (lessonForm.videoInputType === "URL") {
          formData.append("videoUrl", lessonForm.videoUrl.trim());
        } else if (lessonForm.videoFile) {
          formData.append("videoFile", lessonForm.videoFile);
        }
      }

      // Handle PDF media fields
      if (lessonForm.lessonType === "PDF") {
        formData.append("resourceInputType", lessonForm.resourceInputType);
        if (lessonForm.resourceInputType === "URL") {
          formData.append("resourceUrl", lessonForm.resourceUrl.trim());
        } else if (lessonForm.resourceFile) {
          formData.append("resourceFile", lessonForm.resourceFile);
        }
      }

      if (lessonModalMode === "add") {
        await instructorLessonApi.createLesson(targetModuleId, formData);
      } else {
        await instructorLessonApi.updateLesson(selectedLesson.id, formData);
      }

      setShowLessonModal(false);
      fetchLessonsForModule(targetModuleId);
    } catch (err) {
      console.error(err);
      const backendMessage = err.response?.data?.message || err.response?.data?.errors?.[0] || "An error occurred while saving the lesson.";
      setLessonError(backendMessage);
    } finally {
      setLessonSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId, moduleId) => {
    if (window.confirm("Are you sure you want to delete this lesson? This action cannot be undone.")) {
      try {
        await instructorLessonApi.deleteLesson(lessonId);
        fetchLessonsForModule(moduleId);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to delete the lesson.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex flex-col items-center justify-center p-5">
        <div className="w-10 h-10 border-4 border-t-violet-600 border-gray-200 rounded-full animate-spin mb-4"></div>
        <span className="text-sm text-gray-500 font-semibold">Loading course details...</span>
      </div>
    );
  }

  if (error && !courseData) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex flex-col items-center justify-center p-5">
        <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100 max-w-md text-center">
          <p className="text-sm font-bold mb-2">⚠️ Error Loading Course</p>
          <p className="text-xs text-gray-600 mb-4">{error}</p>
          <Link
            to="/instructor/courses"
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-5">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-sm text-gray-400 mb-1">
              <Link to="/instructor/courses" className="hover:text-violet-600 transition-colors">All Courses</Link>
              <span className="text-gray-300"> &gt; </span>
              <span className="text-gray-700 font-medium">{course.title}</span>
            </p>

          </div>
        </div>
      </div>


      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ══════════════════════════════
              LEFT COLUMN
          ══════════════════════════════ */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* ── Hero Row ── */}
          <div className="flex flex-col sm:flex-row gap-6">

            {/* Thumbnail */}
            <div className="relative w-full sm:w-72 h-48 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <FaPlay className="text-white w-8 h-8" />
              </div>
            </div>

            {/* Title + meta */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-xl font-extrabold text-gray-900 leading-tight mb-2">{course.title}</h1>
                <p className="text-sm text-gray-500">{course.description}</p>
              </div>

              {/* stats row */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FaStar className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold text-gray-900">{course.rating}</span>
                  <span className="text-gray-400">({course.reviews} ratings)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <FaUser className="w-4 h-4" />
                  <span>{course.students} Students Enrolled</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                  <span>{course.level} Level</span>
                </div>
              </div>

              {/* meta pills */}
              <div className="flex flex-wrap gap-1">
                {[
                  { Icon: FaBook, text: `${course.lessons} Lessons` },
                  { Icon: AiOutlinePlaySquare, text: `${course.modules} Modules` },
                  { Icon: FaClock, text: `${course.duration} Duration` },
                  { Icon: FaTrophy, text: "Certificate" },
                ].map(({ Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 bg-white">
                    <span className="text-gray-400"><Icon /></span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`relative px-5 pb-3 pt-1 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === key ? "text-violet-600" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {label}
                  {activeTab === key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab Panels ── */}
          <div>

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">About this course</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    This course covers all the essential concepts of digital marketing including SEO,
                    Social Media Marketing, Content Marketing, Email Marketing, Google Ads and Analytics.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
                    {[
                      "Understand Digital Marketing Basics",
                      "Run Google Ads Campaigns",
                      "Learn SEO and Keyword Research",
                      "Track Performance using Analytics",
                      "Create Social Media Marketing Strategy",
                      "Build a Career in Digital Marketing",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <FaCheckCircle className="text-violet-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Curriculum preview in overview */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Course Curriculum</h3>
                    <button
                      onClick={() => setActiveTab("curriculum")}
                      className="text-sm text-violet-600 font-semibold hover:underline"
                    >
                      Expand All
                    </button>
                  </div>
                  {modules.length === 0 ? (
                    <div className="py-8 text-center bg-white border border-gray-100 rounded-xl">
                      <p className="text-sm text-gray-500 font-medium">No modules created yet for this course.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {modules.map((mod, i) => {
                        const colors = ["#7C3AED", "#EA580C", "#059669", "#2563EB", "#DB2777", "#D97706"];
                        const icons = ["📚", "🔍", "📱", "✏️", "✉️", "📊"];
                        const modColor = colors[i % colors.length];
                        const modIcon = icons[i % icons.length];
                        const lessonsList = moduleLessons[mod.id] || [];

                        return (
                          <div key={mod.id || i} className="border border-gray-100 rounded-xl overflow-hidden bg-white">
                            <button
                              onClick={() => toggleModule(i, mod.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                            >
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                                style={{ backgroundColor: modColor + "18" }}
                              >
                                {modIcon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="block text-sm font-semibold text-gray-800 truncate">{mod.title}</span>
                                {mod.description && <span className="block text-[11px] text-gray-400 truncate mt-0.5">{mod.description}</span>}
                              </div>
                              <span className="text-xs text-gray-400 mr-2">{lessonsList.length} Lessons</span>
                              <FaChevronDown className={`text-gray-400 transition-transform ${expandedModules[i] ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedModules[i] && (
                              <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 space-y-0.5">
                                {lessonsList.length === 0 ? (
                                  <p className="text-xs text-gray-400 py-2 pl-2 italic">No lessons in this module.</p>
                                ) : (
                                  lessonsList.map((lesson, j) => {
                                    const isFree = lesson.previewAllowed;
                                    return (
                                      <Link
                                        key={lesson.id || j}
                                        to={`/instructor/course/${id}/lesson/${lesson.id}`}
                                        className="flex items-center gap-3 py-2 text-xs text-gray-600 px-2 hover:text-violet-600 transition-colors no-underline w-full"
                                      >
                                        <FaPlay className="text-violet-600 w-2 h-2 flex-shrink-0" />
                                        <span className="flex-1 truncate">{lesson.title}</span>
                                        {isFree && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">FREE</span>}
                                      </Link>
                                    );
                                  })
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CURRICULUM */}
            {activeTab === "curriculum" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Course Curriculum</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const nextExpanded = {};
                        modules.forEach((mod, idx) => {
                          nextExpanded[idx] = true;
                          fetchLessonsForModule(mod.id);
                        });
                        setExpandedModules(nextExpanded);
                      }}
                      className="text-sm text-violet-600 font-semibold hover:underline"
                    >
                      Expand All
                    </button>
                    <button
                      onClick={handleOpenAddModal}
                      className="flex items-center gap-2 h-9 px-4 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition shadow-sm animate-pulse"
                    >
                      <FaPlus className="text-[10px]" /> Add Module
                    </button>
                  </div>
                </div>
                {modules.length === 0 ? (
                  <div className="py-12 text-center bg-white border border-gray-100 rounded-xl space-y-3">
                    <p className="text-sm text-gray-500 font-medium">No modules created yet for this course.</p>
                    <button
                      onClick={handleOpenAddModal}
                      className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition"
                    >
                      <FaPlus className="text-[10px]" /> Create Your First Module
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {modules.map((mod, i) => {
                      const colors = ["#7C3AED", "#EA580C", "#059669", "#2563EB", "#DB2777", "#D97706"];
                      const icons = ["📚", "🔍", "📱", "✏️", "✉️", "📊"];
                      const modColor = colors[i % colors.length];
                      const modIcon = icons[i % icons.length];
                      const lessonsList = moduleLessons[mod.id] || [];

                      return (
                        <div key={mod.id || i} className="border border-gray-100 rounded-xl overflow-hidden bg-white hover:border-violet-200 transition">
                          <button
                            onClick={() => toggleModule(i, mod.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                          >
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                              style={{ backgroundColor: modColor + "18" }}>
                              {modIcon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="block text-sm font-semibold text-gray-800 truncate">{mod.title}</span>
                              {mod.description && <span className="block text-[11px] text-gray-400 truncate mt-0.5">{mod.description}</span>}
                            </div>
                            <span className="text-xs text-gray-400 mr-2">{lessonsList.length} Lessons</span>
                            <div className="flex items-center gap-1.5 mr-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditModal(mod);
                                }}
                                className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
                                title="Edit Module"
                              >
                                <FaEdit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteModule(mod.id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                title="Delete Module"
                              >
                                <FaTrash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <FaChevronDown className={`text-gray-400 transition-transform ${expandedModules[i] ? 'rotate-180' : ''}`} />
                          </button>
                          {expandedModules[i] && (
                            <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 space-y-1">
                              {lessonsList.length === 0 ? (
                                <p className="text-xs text-gray-400 py-3 pl-2 italic">No lessons created yet in this module.</p>
                              ) : (
                                lessonsList.map((lesson, j) => {
                                  const isFree = lesson.previewAllowed;
                                  const isVideo = lesson.lessonType === "VIDEO";
                                  const isPdf = lesson.lessonType === "PDF";
                                  const isLive = lesson.lessonType === "LIVE_CLASS";

                                  return (
                                    <div
                                      key={lesson.id || j}
                                      className="flex items-center gap-3 py-2.5 text-xs text-gray-600 hover:bg-violet-50/50 rounded-lg px-2 -mx-2 transition"
                                    >
                                      {isVideo && <FaVideo className="text-violet-500 w-3 h-3 flex-shrink-0" />}
                                      {isPdf && <FaFilePdf className="text-amber-500 w-3 h-3 flex-shrink-0" />}
                                      {isLive && <FaLink className="text-green-500 w-3 h-3 flex-shrink-0" />}

                                      <Link
                                        to={`/instructor/course/${id}/lesson/${lesson.id}`}
                                        className="flex-1 min-w-0 no-underline cursor-pointer group/title"
                                      >
                                        <p className="font-semibold text-gray-800 truncate group-hover/title:text-violet-600 transition-colors">{lesson.title}</p>
                                        {lesson.durationInMinutes && <p className="text-[10px] text-gray-400 mt-0.5">{lesson.durationInMinutes} mins</p>}
                                      </Link>

                                      <div className="flex items-center gap-1.5 flex-shrink-0">
                                        {isFree && (
                                          <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                                            FREE PREVIEW
                                          </span>
                                        )}
                                        {lesson.mandatory && (
                                          <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                            REQUIRED
                                          </span>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEditLessonModal(lesson, mod.id)}
                                          className="p-1 hover:text-violet-600 hover:bg-violet-50 rounded transition"
                                          title="Edit Lesson"
                                        >
                                          <FaEdit className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteLesson(lesson.id, mod.id)}
                                          className="p-1 hover:text-red-500 hover:bg-red-50 rounded transition"
                                          title="Delete Lesson"
                                        >
                                          <FaTrash className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })
                              )}

                              <div className="border-t border-gray-200/60 pt-2 mt-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenAddLessonModal(mod.id)}
                                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-dashed border-gray-200 text-xs text-violet-600 hover:text-violet-700 font-semibold hover:border-violet-300 rounded-lg w-full transition cursor-pointer"
                                >
                                  <FaPlus className="text-[9px]" /> Add Lesson to Module
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* INSTRUCTOR */}
            {activeTab === "instructor" && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">About the Instructor</h3>
                <div className="flex gap-4 p-5 bg-violet-50 rounded-2xl">
                  <div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    R
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">Rahul Mehta</h4>
                    <p className="text-sm text-violet-600 mb-3">Digital Marketing Expert &amp; Educator</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><FaStar className="w-3 h-3 text-yellow-400" /> 4.8 Rating</span>
                      <span className="flex items-center gap-1"><FaUser className="w-3 h-3" /> 12,500 Students</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      10+ years of experience in digital marketing. Worked with top brands across India.
                      Specializes in SEO, Google Ads, and Social Media strategy. Helped 50,000+ students launch their careers.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center gap-8 p-5 bg-amber-50 border border-amber-100 rounded-2xl mb-6">
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-gray-900 leading-none">{course.rating}</div>
                    <div className="flex justify-center mt-2 mb-1">
                      {[1, 2, 3, 4, 5].map(s => <FaStar key={s} className="w-4 h-4 text-yellow-400" />)}
                    </div>
                    <div className="text-xs text-gray-400">Course Rating</div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map(s => (
                      <div key={s} className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full"
                            style={{ width: s === 5 ? "70%" : s === 4 ? "20%" : s === 3 ? "6%" : "3%" }} />
                        </div>
                        <div className="flex gap-0.5 w-16 justify-end">
                          {Array(s).fill(0).map((_, i) => <FaStar key={i} className="w-3 h-3 text-yellow-400" />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {reviewsData.map((r, i) => (
                    <div key={i} className="py-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm flex-shrink-0">
                          {r.initial}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900">{r.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex gap-0.5">
                              {Array(5).fill(0).map((_, j) => (
                                <svg key={j} viewBox="0 0 24 24" fill={j < r.rating ? "#FBBF24" : "#E5E7EB"} className="w-3 h-3">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">{r.time}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 pl-12">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {activeTab === "faqs" && (
              <div className="space-y-3">
                {faqsData.map((faq, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 bg-white">
                    <div className="font-semibold text-sm text-gray-900 mb-1.5">{faq.q}</div>
                    <p className="text-sm text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════
              RIGHT COLUMN – Price Card
          ══════════════════════════════ */}
        <div className="w-full lg:w-[300px] flex-shrink-0">
          <div className="sticky top-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              <div className="p-5 space-y-4">
                {/* Price */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">Course Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-gray-900">{course.price}</span>
                    {courseData?.discountPrice && (
                      <>
                        <span className="text-sm text-gray-400 line-through">{course.oldPrice}</span>
                        <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">{course.offer}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Course Status & Info */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">Status</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full ${
                      courseData?.status === "PUBLISHED" 
                        ? "bg-green-100 text-green-700" 
                        : courseData?.publishRequested 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {courseData?.status === "PUBLISHED" ? "PUBLISHED" : courseData?.publishRequested ? "PUBLISH PENDING" : courseData?.status || "DRAFT"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">Level</span>
                    <span className="font-bold text-gray-800 uppercase">{course.level}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">Language</span>
                    <span className="font-bold text-gray-800">{course.language}</span>
                  </div>
                </div>

                {courseData?.status !== "PUBLISHED" && (
                  <div className="border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={handleRequestPublish}
                      disabled={courseData?.publishRequested || publishing}
                      className={`w-full h-11 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        courseData?.publishRequested
                          ? "bg-blue-50 border border-blue-100 text-blue-500 cursor-not-allowed animate-none"
                          : "bg-violet-600 text-white hover:bg-violet-700 shadow-sm border-none cursor-pointer"
                      }`}
                    >
                      {publishing ? "Submitting..." : courseData?.publishRequested ? "Sent for Approval" : "Request Course Publish"}
                    </button>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4">
                  <Link
                    to="/instructor/courses"
                    className="w-full h-11 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
                  >
                    Back to My Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Module Edit/Create Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative border border-gray-100 transform transition-all scale-100">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900">
                {moduleModalMode === "edit" ? "Edit Module" : "Add New Module"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModuleModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition border-none bg-transparent cursor-pointer"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleModuleSubmit} className="p-6 space-y-4">

              {moduleError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
                  <span>⚠️</span>
                  <span className="flex-1">{moduleError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Module Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="e.g. Introduction to SEO"
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-violet-400 focus:bg-white transition"
                  required
                  disabled={moduleSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  placeholder="Briefly describe what this module covers..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-violet-400 focus:bg-white transition placeholder:text-gray-400 resize-none"
                  disabled={moduleSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Sort Order <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={moduleForm.sortOrder}
                  onChange={(e) => setModuleForm({ ...moduleForm, sortOrder: e.target.value })}
                  placeholder="e.g. 1"
                  min="1"
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-violet-400 focus:bg-white transition"
                  required
                  disabled={moduleSubmitting}
                />
                <p className="text-[11px] text-gray-400 mt-1">Determines the display order of the module (must be unique for this course).</p>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={moduleForm.previewAllowed}
                    onChange={(e) => setModuleForm({ ...moduleForm, previewAllowed: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    disabled={moduleSubmitting}
                  />
                  <div>
                    <span className="block text-xs font-bold text-gray-800">Allow Preview</span>
                    <span className="block text-[10px] text-gray-400">Allow previewing module content before enrollment</span>
                  </div>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="h-10 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition border-none bg-transparent cursor-pointer"
                  disabled={moduleSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition flex items-center justify-center gap-1.5 shadow-md shadow-violet-100 border-none cursor-pointer"
                  disabled={moduleSubmitting}
                >
                  {moduleSubmitting ? "Saving..." : "Save Module"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
      {/* Lesson Edit/Create Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-gray-100 transform transition-all scale-100 my-8">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-base font-bold text-gray-900">
                {lessonModalMode === "edit" ? "Edit Lesson" : "Add New Lesson"}
              </h2>
              <button
                type="button"
                onClick={() => setShowLessonModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition border-none bg-transparent cursor-pointer"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleLessonSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

              {lessonError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
                  <span>⚠️</span>
                  <span className="flex-1">{lessonError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Lesson Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="e.g. Introduction to Keyword Research"
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-violet-400 focus:bg-white transition"
                  required
                  disabled={lessonSubmitting}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <RichTextEditor
                  value={lessonForm.description}
                  onChange={(val) => setLessonForm({ ...lessonForm, description: val })}
                  placeholder="What will students learn in this lesson..."
                  disabled={lessonSubmitting}
                />
              </div>

              {/* Lesson Type & Sort Order & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={lessonForm.lessonType}
                    onChange={(e) => setLessonForm({ ...lessonForm, lessonType: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-violet-400 focus:bg-white transition"
                    disabled={lessonSubmitting}
                  >
                    <option value="VIDEO">Video</option>
                    <option value="PDF">PDF / Document</option>
                    <option value="LIVE_CLASS">Live Class</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Sort Order <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={lessonForm.sortOrder}
                    onChange={(e) => setLessonForm({ ...lessonForm, sortOrder: e.target.value })}
                    placeholder="e.g. 1"
                    min="1"
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-violet-400 focus:bg-white transition"
                    required
                    disabled={lessonSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    value={lessonForm.durationInMinutes}
                    onChange={(e) => setLessonForm({ ...lessonForm, durationInMinutes: e.target.value })}
                    placeholder="e.g. 15"
                    min="1"
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-violet-400 focus:bg-white transition"
                    disabled={lessonSubmitting}
                  />
                </div>
              </div>

              {/* Text/Markdown Content (Optional) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Written Content (Optional)
                </label>
                <RichTextEditor
                  value={lessonForm.content}
                  onChange={(val) => setLessonForm({ ...lessonForm, content: val })}
                  placeholder="Text notes or content for the lesson body..."
                  disabled={lessonSubmitting}
                />
              </div>

              {/* Media Upload Subsections */}

              {/* VIDEO LESSON / LIVE CLASS MEDIA */}
              {(lessonForm.lessonType === "VIDEO" || lessonForm.lessonType === "LIVE_CLASS") && (
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3">
                  <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {lessonForm.lessonType === "LIVE_CLASS" ? "Meeting Connection" : "Lesson Video Content"}
                  </span>

                  {lessonForm.lessonType === "VIDEO" ? (
                    <>
                      <div className="flex gap-2">
                        {[["URL", "Video URL"], ["FILE_UPLOAD", "Upload File"]].map(([tab, label]) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setLessonForm({ ...lessonForm, videoInputType: tab })}
                            className={`flex-1 h-9 rounded-lg border text-xs font-semibold transition ${lessonForm.videoInputType === tab
                                ? "bg-violet-600 border-violet-600 text-white"
                                : "border-gray-200 text-gray-500 hover:border-violet-300 bg-white"
                              }`}
                            disabled={lessonSubmitting}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      {lessonForm.videoInputType === "URL" ? (
                        <input
                          type="text"
                          value={lessonForm.videoUrl}
                          onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                          placeholder="e.g. https://www.w3schools.com/html/mov_bbb.mp4"
                          className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-violet-400 transition"
                          disabled={lessonSubmitting}
                        />
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setLessonForm({ ...lessonForm, videoFile: e.target.files[0] })}
                            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            disabled={lessonSubmitting}
                          />
                          {lessonForm.videoFile && (
                            <p className="text-[11px] text-green-600 font-semibold mt-1">✓ {lessonForm.videoFile.name}</p>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <input
                      type="text"
                      value={lessonForm.videoUrl}
                      onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                      placeholder="e.g. Zoom or Google Meet URL"
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-violet-400 transition"
                      required
                      disabled={lessonSubmitting}
                    />
                  )}
                </div>
              )}

              {/* PDF LESSON MEDIA */}
              {lessonForm.lessonType === "PDF" && (
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3">
                  <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Document Resource File
                  </span>

                  <div className="flex gap-2">
                    {[["URL", "Document URL"], ["FILE_UPLOAD", "Upload PDF File"]].map(([tab, label]) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setLessonForm({ ...lessonForm, resourceInputType: tab })}
                        className={`flex-1 h-9 rounded-lg border text-xs font-semibold transition ${lessonForm.resourceInputType === tab
                            ? "bg-violet-600 border-violet-600 text-white"
                            : "border-gray-200 text-gray-500 hover:border-violet-300 bg-white"
                          }`}
                        disabled={lessonSubmitting}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {lessonForm.resourceInputType === "URL" ? (
                    <input
                      type="text"
                      value={lessonForm.resourceUrl}
                      onChange={(e) => setLessonForm({ ...lessonForm, resourceUrl: e.target.value })}
                      placeholder="e.g. https://domain.com/notes.pdf"
                      className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-violet-400 transition"
                      disabled={lessonSubmitting}
                    />
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setLessonForm({ ...lessonForm, resourceFile: e.target.files[0] })}
                        className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                        disabled={lessonSubmitting}
                      />
                      {lessonForm.resourceFile && (
                        <p className="text-[11px] text-green-600 font-semibold mt-1">✓ {lessonForm.resourceFile.name}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Toggles (Preview Allowed / Mandatory) */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lessonForm.previewAllowed}
                    onChange={(e) => setLessonForm({ ...lessonForm, previewAllowed: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    disabled={lessonSubmitting}
                  />
                  <div>
                    <span className="block text-xs font-bold text-gray-800">Allow Preview</span>
                    <span className="block text-[10px] text-gray-400">Students can watch/read without purchasing</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lessonForm.mandatory}
                    onChange={(e) => setLessonForm({ ...lessonForm, mandatory: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    disabled={lessonSubmitting}
                  />
                  <div>
                    <span className="block text-xs font-bold text-gray-800">Is Mandatory</span>
                    <span className="block text-[10px] text-gray-400">Must be completed to finish course</span>
                  </div>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="h-10 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition border-none bg-transparent cursor-pointer"
                  disabled={lessonSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition flex items-center justify-center gap-1.5 shadow-md shadow-violet-100 border-none cursor-pointer"
                  disabled={lessonSubmitting}
                >
                  {lessonSubmitting ? "Saving..." : "Save Lesson"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseViewDetails;