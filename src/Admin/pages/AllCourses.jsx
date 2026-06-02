import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  PlayCircle,
  Clock,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  BarChart3,
  Palette,
  Megaphone,
  Brain,
  X,
  CheckSquare,
  Square,
  Download,
  Eye,
  MoreVertical,
  Copy,
  Archive,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Tag,
  Upload,
  Video,
  ImageIcon,
  FileVideo,
  
} from "lucide-react";

// StatCard Component
const StatCard = ({ icon, title, value, trend, color }) => {
  const colorMap = {
    teal: "bg-teal-50 text-teal-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
  };
  const trendValue = parseFloat(trend);
  const isPositive = trendValue > 0;
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`w-8 h-8 rounded-lg ${colorMap[color]} flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'} bg-gray-50 px-1.5 py-0.5 rounded`}>
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend}%
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-gray-500 text-xs">{title}</p>
        <h3 className="text-xl font-bold text-gray-800">{value.toLocaleString()}</h3>
      </div>
    </div>
  );
};

// SelectBox Component
const SelectBox = ({ value, onChange, children }) => (
  <div className="relative">
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="appearance-none border border-gray-200 rounded-lg px-3 py-1.5 pr-7 bg-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm cursor-pointer"
    >
      {children}
    </select>
    <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
  </div>
);

// Rich Text Editor Component
const RichTextEditor = ({ value, onChange, editorRef }) => {
  const [isFocused, setIsFocused] = useState(false);

  const applyFormat = (command) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, null);
    const newContent = editorRef.current.innerHTML;
    onChange(newContent);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value, editorRef]);

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 bg-gray-50 border-b border-gray-200 px-2 py-1.5 flex-wrap">
        <button type="button" onClick={() => applyFormat("bold")} className="px-2 py-1 text-xs font-bold border rounded hover:bg-white transition-colors">B</button>
        <button type="button" onClick={() => applyFormat("italic")} className="px-2 py-1 text-xs italic border rounded hover:bg-white transition-colors">I</button>
        <button type="button" onClick={() => applyFormat("underline")} className="px-2 py-1 text-xs underline border rounded hover:bg-white transition-colors">U</button>
        <div className="w-px h-5 bg-gray-300 mx-1"></div>
        <button type="button" onClick={() => applyFormat("insertUnorderedList")} className="px-2 py-1 text-xs border rounded hover:bg-white transition-colors">• List</button>
        <button type="button" onClick={() => applyFormat("insertOrderedList")} className="px-2 py-1 text-xs border rounded hover:bg-white transition-colors">1. List</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[140px] w-full px-4 py-3 text-sm outline-none text-left whitespace-pre-wrap break-words ${
          isFocused ? 'ring-1 ring-teal-500' : ''
        }`}
        style={{ backgroundColor: '#fff' }}
      />
    </div>
  );
};

// Main AdminCourses Component
const AdminCourses = () => {
  const editorRef = useRef(null);
  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);
  
  // ---------- Mock Data with Thumbnails and Videos ----------
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Web Development Bootcamp",
      description: "Complete web development course with projects",
      instructor: "John Smith",
      category: "Development",
      students: 342,
      status: "Published",
      createdDate: "May 15, 2024",
      lastUpdated: "Jun 10, 2024",
      icon: "code",
      trend: "+12%",
      thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&h=100&fit=crop",
      mediaType: "image",
      promoVideoUrl: "",
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      description: "Learn data science from scratch with Python",
      instructor: "Sarah Johnson",
      category: "Data Science",
      students: 287,
      status: "Published",
      createdDate: "May 10, 2024",
      lastUpdated: "Jun 5, 2024",
      icon: "chart",
      trend: "+8%",
      thumbnailUrl: "",
      mediaType: "video",
      promoVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      description: "Design beautiful user experiences with Figma",
      instructor: "Mike Wilson",
      category: "Design",
      students: 156,
      status: "Published",
      createdDate: "May 5, 2024",
      lastUpdated: "May 28, 2024",
      icon: "design",
      trend: "+5%",
      thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop",
      mediaType: "image",
      promoVideoUrl: "",
    },
    {
      id: 4,
      title: "Python Programming",
      description: "Python for beginners to advanced concepts",
      instructor: "Emily Davis",
      category: "Programming",
      students: 423,
      status: "Published",
      createdDate: "Apr 28, 2024",
      lastUpdated: "Jun 12, 2024",
      icon: "code",
      trend: "+18%",
      thumbnailUrl: "",
      mediaType: "video",
      promoVideoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    },
    {
      id: 5,
      title: "Machine Learning Basics",
      description: "Introduction to machine learning algorithms",
      instructor: "David Brown",
      category: "Data Science",
      students: 198,
      status: "Draft",
      createdDate: "Apr 25, 2024",
      lastUpdated: "May 20, 2024",
      icon: "brain",
      trend: "-2%",
      thumbnailUrl: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=100&h=100&fit=crop",
      mediaType: "image",
      promoVideoUrl: "",
    },
    {
      id: 6,
      title: "Digital Marketing Strategy",
      description: "Complete digital marketing guide for 2024",
      instructor: "Lisa Anderson",
      category: "Marketing",
      students: 234,
      status: "Draft",
      createdDate: "Apr 20, 2024",
      lastUpdated: "May 15, 2024",
      icon: "marketing",
      trend: "+3%",
      thumbnailUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=100&h=100&fit=crop",
      mediaType: "image",
      promoVideoUrl: "",
    },
    {
      id: 7,
      title: "React Advanced Patterns",
      description: "Master React with advanced patterns and hooks",
      instructor: "James Wilson",
      category: "Development",
      students: 189,
      status: "Published",
      createdDate: "Jun 1, 2024",
      lastUpdated: "Jun 14, 2024",
      icon: "code",
      trend: "+25%",
      thumbnailUrl: "",
      mediaType: "video",
      promoVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: 8,
      title: "Cloud Computing AWS",
      description: "Complete AWS certification preparation",
      instructor: "Maria Garcia",
      category: "Development",
      students: 267,
      status: "Draft",
      createdDate: "May 25, 2024",
      lastUpdated: "Jun 8, 2024",
      icon: "code",
      trend: "+10%",
      thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop",
      mediaType: "image",
      promoVideoUrl: "",
    },
  ]);

  // ---------- UI State ----------
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewCourse, setViewCourse] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [mediaType, setMediaType] = useState("image");

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    slug: "",
    description: "",
    thumbnailUrl: "",
    promoVideoUrl: "",
    price: "",
    discountPrice: "",
    language: "",
    level: "Beginner",
    status: "Draft",
    instructorId: "",
    mediaType: "image",
  });

  // ---------- Data Lists ----------
  const categories = ["Development", "Data Science", "Design", "Programming", "Marketing"];

  // Helper functions
  const parseDate = (dateStr) => new Date(dateStr);

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setEditCourse(null);
    setFormData({
      id: "",
      title: "",
      slug: "",
      description: "",
      thumbnailUrl: "",
      promoVideoUrl: "",
      price: "",
      discountPrice: "",
      language: "",
      level: "Beginner",
      status: "Draft",
      instructorId: "",
      mediaType: "image",
    });
    setEditorContent("");
    setThumbnailPreview("");
    setVideoPreview("");
    setMediaType("image");
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditCourse(course);
    setFormData({
      id: course.id,
      title: course.title,
      slug: course.title?.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-") || "",
      description: course.description,
      thumbnailUrl: course.thumbnailUrl || "",
      promoVideoUrl: course.promoVideoUrl || "",
      price: course.price || "",
      discountPrice: course.discountPrice || "",
      language: course.language || "",
      level: course.level || "Beginner",
      status: course.status,
      instructorId: course.instructorId || "",
      mediaType: course.mediaType || "image",
    });
    setEditorContent(course.description || "");
    setThumbnailPreview(course.thumbnailUrl || "");
    setVideoPreview(course.promoVideoUrl || "");
    setMediaType(course.mediaType || "image");
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedData = {
      ...formData,
      mediaType: mediaType,
      description: editorContent,
      thumbnailUrl: mediaType === "image" ? formData.thumbnailUrl : "",
      promoVideoUrl: mediaType === "video" ? formData.promoVideoUrl : "",
    };

    if (editCourse) {
      setCourses(
        courses.map((course) =>
          course.id === editCourse.id
            ? { 
                ...course, 
                ...updatedData,
                lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              }
            : course
        )
      );
    } else {
      const newCourse = {
        id: Date.now(),
        title: formData.title,
        description: editorContent,
        instructor: "New Instructor",
        category: "Development",
        students: 0,
        status: formData.status,
        createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        icon: "code",
        trend: "0%",
        ...updatedData,
      };
      setCourses([newCourse, ...courses]);
    }
    setShowModal(false);
    setEditorContent("");
    setThumbnailPreview("");
    setVideoPreview("");
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ type: "single", id });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "single") {
      setCourses(courses.filter((c) => c.id !== deleteConfirm.id));
      setSelectedCourses(selectedCourses.filter((id) => id !== deleteConfirm.id));
    } else if (deleteConfirm.type === "bulk") {
      setCourses(courses.filter((c) => !deleteConfirm.ids.includes(c.id)));
      setSelectedCourses([]);
    }
    setDeleteConfirm(null);
  };

  const duplicateCourse = (course) => {
    const newCourse = {
      ...course,
      id: Date.now(),
      title: `${course.title} (Copy)`,
      students: 0,
      status: "Draft",
      createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      trend: "0%",
    };
    setCourses([newCourse, ...courses]);
    setActionMenu(null);
  };

  const archiveCourse = (id) => {
    setCourses(courses.map(c => c.id === id ? { ...c, status: "Archived" } : c));
    setActionMenu(null);
  };

  const toggleSelectCourse = (id) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCourses.length === paginatedCourses.length && paginatedCourses.length > 0) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(paginatedCourses.map((c) => c.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedCourses.length === 0) return;
    setDeleteConfirm({ type: "bulk", ids: [...selectedCourses] });
  };

  const handleBulkArchive = () => {
    if (selectedCourses.length === 0) return;
    setCourses(courses.map(c => selectedCourses.includes(c.id) ? { ...c, status: "Archived" } : c));
    setSelectedCourses([]);
  };

  const exportToCSV = () => {
    const headers = ["ID", "Title", "Instructor", "Category", "Students", "Status", "Created Date", "Last Updated", "Media Type"];
    const rows = filteredCourses.map((c) => [
      c.id,
      c.title,
      c.instructor,
      c.category,
      c.students,
      c.status,
      c.createdDate,
      c.lastUpdated,
      c.mediaType || "image",
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "courses_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtering & Sorting
  const filteredCourses = useMemo(() => {
    let result = [...courses.filter(c => c.status !== "Archived")];

    result = result.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All Categories" || course.category === categoryFilter;
      const matchesStatus = statusFilter === "All Status" || course.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sortBy === "Students") {
      result.sort((a, b) => b.students - a.students);
    } else if (sortBy === "Course Name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "Newest") {
      result.sort((a, b) => parseDate(b.createdDate) - parseDate(a.createdDate));
    }
    return result;
  }, [courses, searchTerm, categoryFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => setCurrentPage(1), [searchTerm, categoryFilter, statusFilter, sortBy, itemsPerPage]);

  // Stats
  const totalCourses = courses.filter(c => c.status !== "Archived").length;
  const publishedCourses = courses.filter(c => c.status === "Published").length;
  const draftCourses = courses.filter(c => c.status === "Draft").length;
  const totalEnrollments = courses.reduce((sum, c) => sum + c.students, 0);

  // Icon renderer for fallback
  const getIcon = (icon) => {
    const base = "w-12 h-12 rounded-lg flex items-center justify-center text-white";
    switch (icon) {
      case "chart":
        return <div className={`${base} bg-purple-500`}><BarChart3 size={20} /></div>;
      case "design":
        return <div className={`${base} bg-amber-500`}><Palette size={20} /></div>;
      case "marketing":
        return <div className={`${base} bg-blue-500`}><Megaphone size={20} /></div>;
      case "brain":
        return <div className={`${base} bg-orange-500`}><Brain size={20} /></div>;
      default:
        return <div className={`${base} bg-teal-600`}><Code2 size={20} /></div>;
    }
  };

  const getCategoryColor = (category) => {
    const map = {
      Development: "bg-teal-50 text-teal-700",
      "Data Science": "bg-purple-50 text-purple-700",
      Design: "bg-amber-50 text-amber-700",
      Programming: "bg-blue-50 text-blue-700",
      Marketing: "bg-pink-50 text-pink-700",
    };
    return map[category] || "bg-gray-50 text-gray-700";
  };

  const getTrendIcon = (trend) => {
    const val = parseFloat(trend);
    if (val > 0) return <TrendingUp size={12} className="text-green-600" />;
    if (val < 0) return <TrendingDown size={12} className="text-red-600" />;
    return null;
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const imageUrl = URL.createObjectURL(file);

  setThumbnailPreview(imageUrl);

  setFormData({
    ...formData,
    thumbnailUrl: imageUrl,
  });
};

 const handleVideoUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const videoUrl = URL.createObjectURL(file);

  setVideoPreview(videoUrl);

  setFormData({
    ...formData,
    promoVideoUrl: videoUrl,
  });
};

  const handleVideoUrlChange = (e) => {
    const url = e.target.value;
    setVideoPreview(url);
    setFormData({ ...formData, promoVideoUrl: url, thumbnailUrl: "" });
    if (url) {
      setMediaType("video");
    }
  };

  // Function to extract YouTube video ID
  const getYouTubeThumbnail = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-5 py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 flex items-center">
            <Link to="/admin/dashboard" className="hover:text-teal-600 transition">
              Dashboard
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">All Courses</span>
          </p>
        </div>
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage your course catalog, track performance, and organize content</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportToCSV} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 text-sm transition">
              <Download size={16} />
              Export
            </button>
            <button onClick={openAddModal} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm transition shadow-sm">
              <Plus size={16} />
              New Course
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<BookOpen size={18} />} title="Total Courses" value={totalCourses} trend="+2" color="teal" />
          <StatCard icon={<PlayCircle size={18} />} title="Published" value={publishedCourses} trend="+1" color="green" />
          <StatCard icon={<Clock size={18} />} title="Drafts" value={draftCourses} trend="-1" color="amber" />
          <StatCard icon={<Users size={18} />} title="Enrollments" value={totalEnrollments} trend="+15%" color="blue" />
        </div>

        {/* Filter Bar & Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Filters */}
          <div className="p-4 flex flex-wrap items-center gap-3 border-b border-gray-100">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search courses by title, instructor or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <SelectBox value={categoryFilter} onChange={setCategoryFilter}>
              <option>All Categories</option>
              {categories.map(cat => <option key={cat}>{cat}</option>)}
            </SelectBox>
            <SelectBox value={statusFilter} onChange={setStatusFilter}>
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </SelectBox>
            <SelectBox value={sortBy} onChange={setSortBy}>
              <option>Newest</option>
              <option>Students</option>
              <option>Course Name</option>
            </SelectBox>
            <button onClick={resetFilters} className="flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-sm text-gray-600 transition">
              <X size={14} />
              Clear
            </button>
          </div>

          {/* Bulk Actions Bar */}
          {selectedCourses.length > 0 && (
            <div className="bg-teal-50/40 px-4 py-2 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CheckSquare size={14} className="text-teal-700" />
                <span className="text-xs font-medium text-teal-800">{selectedCourses.length} course(s) selected</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleBulkArchive} className="flex items-center gap-1 text-xs bg-white border border-amber-200 text-amber-600 px-2 py-1 rounded hover:bg-amber-50 transition">
                  <Archive size={12} />
                  Archive
                </button>
                <button onClick={handleBulkDelete} className="flex items-center gap-1 text-xs bg-white border border-red-200 text-red-600 px-2 py-1 rounded hover:bg-red-50 transition">
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Courses Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <button 
                      onClick={toggleSelectAll} 
                      className="text-gray-400 hover:text-teal-600 transition"
                      disabled={paginatedCourses.length === 0}
                    >
                      {selectedCourses.length === paginatedCourses.length && paginatedCourses.length > 0 ? 
                        <CheckSquare size={14} /> : <Square size={14} />
                      }
                    </button>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Instructor</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Updated</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition group">
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelectCourse(course.id)} className="text-gray-400 hover:text-teal-600 transition">
                        {selectedCourses.includes(course.id) ? <CheckSquare size={14} /> : <Square size={14} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                      {/* Single Course Icon */}
                       {getIcon(course.icon)}
                        {/* Fallback Icon */}                        
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{course.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{course.description}</p>
                          <span className="text-xs text-gray-400 mt-1 inline-flex items-center gap-1">
                            {course.mediaType === "video" ? (
                              <><Video size={10} /> Video Course</>
                            ) : (
                              <><ImageIcon size={10} /> Image Course</>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">{course.instructor}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(course.category)}`}>
                        {course.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-700 text-sm">{course.students.toLocaleString()}</span>
                        {course.trend && (
                          <div className="flex items-center gap-0.5">
                            {getTrendIcon(course.trend)}
                            <span className={`text-xs ${parseFloat(course.trend) > 0 ? 'text-green-600' : parseFloat(course.trend) < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                              {course.trend}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        course.status === "Published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{course.lastUpdated}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setViewCourse(course)} 
                          className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition" 
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => openEditModal(course)} 
                          className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition" 
                          title="Edit course"
                        >
                          <Edit size={14} />
                        </button>
                        {/* Image Preview */}
{/* Image Preview */}
{course.thumbnailUrl && (
  <img
    src={course.thumbnailUrl}
    alt="course"
    className="w-[30px] h-[30px] rounded border border-gray-200 object-cover"
  />
)}

{/* Video Preview */}
{course.promoVideoUrl && (
  <div className="w-[30px] h-[30px] rounded border border-gray-200 overflow-hidden relative bg-black">
    <video
      src={course.promoVideoUrl}
      className="w-full h-full object-cover"
      muted
    />
    <PlayCircle
      size={10}
      className="absolute inset-0 m-auto text-white"
    />
  </div>
)}
                        <div className="relative">
                          <button 
                            onClick={() => setActionMenu(actionMenu === course.id ? null : course.id)} 
                            className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                          >
                            <MoreVertical size={14} />
                          </button>
                          {actionMenu === course.id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1">
                              <button onClick={() => { duplicateCourse(course); setActionMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Copy size={12} /> Duplicate
                              </button>
                              <button onClick={() => { archiveCourse(course.id); setActionMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Archive size={12} /> Archive
                              </button>
                              <button onClick={() => { handleDeleteClick(course.id); setActionMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedCourses.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <BookOpen size={48} strokeWidth={1} />
                        <p className="text-sm">No courses found. Try adjusting your filters or create a new course.</p>
                        <button onClick={resetFilters} className="text-teal-600 text-sm hover:text-teal-700 font-medium">Clear all filters</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
            <div className="text-xs text-gray-500">
              Showing {paginatedCourses.length} of {filteredCourses.length} courses
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">Rows per page:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => setItemsPerPage(Number(e.target.value))} 
                  className="border border-gray-200 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-teal-500"
                >
                  {[8, 16, 24, 32].map(num => <option key={num}>{num}</option>)}
                </select>
              </div>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(p-1, 1))} 
                  disabled={currentPage === 1} 
                  className="p-1.5 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-3 py-1 bg-teal-600 text-white rounded text-xs font-medium">{currentPage}</span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} 
                  disabled={currentPage === totalPages || totalPages === 0} 
                  className="p-1.5 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl" style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-gray-800">{editCourse ? "Edit Course" : "Create New Course"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Course ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course ID <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  placeholder="Enter course ID"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>

              {/* Course Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  placeholder="Enter course title"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({
                      ...formData,
                      title,
                      slug: title
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .trim()
                        .replace(/\s+/g, "-"),
                    });
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <input
                  type="text"
                  placeholder="auto-generated from title"
                  value={formData.slug}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-generated from course title</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <RichTextEditor value={editorContent} onChange={handleEditorChange} editorRef={editorRef} />
              </div>

              {/* Media Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaType("image")}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                      mediaType === "image"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <ImageIcon size={16} />
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType("video")}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                      mediaType === "video"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Video size={16} />
                    Video
                  </button>
                </div>
              </div>

              {/* Image Upload */}
              {mediaType === "image" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
                  <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition bg-gray-50">
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-48 object-cover rounded-lg" />
                    ) : (
                      <>
                        <Upload className="text-gray-400 mb-2" size={28} />
                        <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG supported</p>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={imageInputRef} />
                  </label>
                </div>
              )}

              {/* Video Upload */}
              {mediaType === "video" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video File</label>
                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition bg-gray-50">
                      {videoPreview && !videoPreview.includes('blob:') ? (
                        <video controls className="w-full h-48 object-cover rounded-lg">
                          <source src={videoPreview} type="video/mp4" />
                        </video>
                      ) : videoPreview && videoPreview.includes('blob:') ? (
                        <video controls className="w-full h-48 object-cover rounded-lg">
                          <source src={videoPreview} type="video/mp4" />
                        </video>
                      ) : (
                        <>
                          <FileVideo className="text-gray-400 mb-2" size={28} />
                          <p className="text-sm text-gray-600 font-medium">Click to upload video</p>
                          <p className="text-xs text-gray-400 mt-1">MP4, WebM, OGG supported</p>
                        </>
                      )}
                      <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" ref={videoInputRef} />
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Or Enter Video URL</label>
                    <input
                      type="text"
                      placeholder="https://example.com/video.mp4"
                      value={formData.promoVideoUrl}
                      onChange={handleVideoUrlChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supports MP4, WebM formats</p>
                  </div>
                </>
              )}

              {/* Price and Discount Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) <span className="text-red-500">*</span></label>
                  <input required type="number" step="0.01" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price ($)</label>
                  <input type="number" step="0.01" placeholder="0.00" value={formData.discountPrice} onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                </div>
              </div>

              {/* Language and Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language <span className="text-red-500">*</span></label>
                  <input required placeholder="e.g., English" value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level <span className="text-red-500">*</span></label>
                  <select required value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-1 focus:ring-teal-500 outline-none">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Status and Instructor ID */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                  <select required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-1 focus:ring-teal-500 outline-none">
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructor ID <span className="text-red-500">*</span></label>
                  <input required type="number" placeholder="Enter instructor ID" value={formData.instructorId} onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition">
                  {editCourse ? "Update Course" : "Create Course"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50 sticky top-0">
              <h2 className="text-lg font-semibold text-gray-800">Course Details</h2>
              <button onClick={() => setViewCourse(null)} className="text-gray-400 hover:text-gray-600 transition"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-4">
              {/* Media Preview */}
              <div className="flex items-start gap-4 pb-3 border-b">
                {viewCourse.mediaType === "video" && viewCourse.promoVideoUrl ? (
                  <div className="w-full">
                    <video controls className="w-full rounded-lg max-h-64">
                      <source src={viewCourse.promoVideoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="flex items-center gap-2 mt-2">
                      <Video size={14} className="text-red-500" />
                      <span className="text-xs text-gray-500">Promotional Video</span>
                    </div>
                  </div>
                ) : viewCourse.thumbnailUrl ? (
                  <div>
                    <img src={viewCourse.thumbnailUrl} alt={viewCourse.title} className="w-32 h-32 rounded-lg object-cover border border-gray-200" />
                    <div className="flex items-center gap-2 mt-2">
                      <ImageIcon size={14} className="text-blue-500" />
                      <span className="text-xs text-gray-500">Course Thumbnail</span>
                    </div>
                  </div>
                ) : (
                  getIcon(viewCourse.icon)
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{viewCourse.title}</h3>
                  <div className="text-xs text-gray-500 mt-1" dangerouslySetInnerHTML={{ __html: viewCourse.description }} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><User size={14} className="text-gray-400" /><span><span className="font-medium">Instructor:</span> {viewCourse.instructor}</span></div>
                <div className="flex items-center gap-2"><Tag size={14} className="text-gray-400" /><span><span className="font-medium">Category:</span> {viewCourse.category}</span></div>
                <div className="flex items-center gap-2"><Users size={14} className="text-gray-400" /><span><span className="font-medium">Students:</span> {viewCourse.students}</span></div>
                <div className="flex items-center gap-2"><PlayCircle size={14} className="text-gray-400" /><span><span className="font-medium">Status:</span> {viewCourse.status}</span></div>
                <div className="flex items-center gap-2"><Calendar size={14} className="text-gray-400" /><span><span className="font-medium">Created:</span> {viewCourse.createdDate}</span></div>
                <div className="flex items-center gap-2"><Clock size={14} className="text-gray-400" /><span><span className="font-medium">Updated:</span> {viewCourse.lastUpdated}</span></div>
                <div className="flex items-center gap-2"><Video size={14} className="text-gray-400" /><span><span className="font-medium">Media Type:</span> {viewCourse.mediaType === "video" ? "Video Course" : "Image Course"}</span></div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-2 rounded-b-lg sticky bottom-0">
              <button onClick={() => { setViewCourse(null); openEditModal(viewCourse); }} className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition">Edit Course</button>
              <button onClick={() => setViewCourse(null)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 text-center shadow-xl">
            <div className="mx-auto w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3"><Trash2 className="text-red-600" size={20} /></div>
            <h3 className="text-md font-semibold text-gray-800">Confirm Deletion</h3>
            <p className="text-gray-500 mt-1 text-sm">{deleteConfirm.type === "bulk" ? `Are you sure you want to delete ${deleteConfirm.ids.length} course(s)?` : "Are you sure you want to delete this course?"}</p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;