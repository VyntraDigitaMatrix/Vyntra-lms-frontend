import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaFilter,
  FaSortAmountDown,
  FaEllipsisH,
  FaTimes,
  FaStickyNote,
  FaCalendarAlt,
  FaTag,
  FaUser,
  FaClock,
  FaSearch,
  FaThumbsUp,
  FaComment,
  FaShare,
} from "react-icons/fa";
import { MdCategory, MdDescription } from "react-icons/md";

function Notes() {
  const notesData = [
    {
      id: 1,
      type: "Weekly",
      category: "Product",
      title: "Product Team Meeting",
      description: "This monthly progress agenda is for reviewing the Q4 targets and planning next sprint.",
      points: [
        "Introduction to Newest Product Plan",
        "Monthly Revenue updates for each",
      ],
      author: "Floyd Miles",
      date: "Mar 5 04:25",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      type: "Monthly",
      category: "Business",
      title: "Business Strategy Review",
      description: "This monthly progress agenda is for evaluating market position and growth opportunities.",
      points: [
        "Introduction to Newest Product Plan",
        "Monthly Revenue updates for each",
      ],
      author: "Dianne Russell",
      date: "Apr 11 18:30",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      likes: 42,
      comments: 15,
    },
    {
      id: 3,
      type: "Personal",
      category: "Business",
      title: "HR Interview Notes",
      description: "This monthly progress agenda is following this candidate shortlisting process.",
      points: [
        "Introduction to Newest Product Plan",
        "Monthly Revenue updates for each",
      ],
      author: "Annette Black",
      date: "Jun 23 14:31",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      likes: 18,
      comments: 5,
    },
    {
      id: 4,
      type: "Monthly",
      category: "Product",
      title: "Monthly Team Progress",
      description: "This monthly progress agenda is following the team achievements and challenges.",
      points: [
        "Introduction to Newest Product Plan",
        "Monthly Revenue updates for each",
      ],
      author: "Robert Fox",
      date: "Jan 31 09:53",
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
      likes: 56,
      comments: 23,
    },
    {
      id: 5,
      type: "Monthly",
      category: "Business",
      title: "Weekly Sync Meeting",
      description: "Some summaries of this weeks meeting are captured for reference.",
      points: [
        "Introduction to Newest Product Plan",
        "Monthly Revenue updates for each",
      ],
      author: "Brooklyn Simmons",
      date: "Aug 15 10:29",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      likes: 31,
      comments: 12,
    },
    {
      id: 6,
      type: "Personal",
      category: "Image",
      title: "Document Images Archive",
      description: "Report Document of Weekly Meetings and important files.",
      points: [
        "Introduction to Newest Product Plan",
        "Monthly Revenue updates for each",
      ],
      author: "Cameron Williamson",
      date: "Dec 30 21:28",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
      likes: 12,
      comments: 4,
    },
  ];

  const [sortType, setSortType] = useState("Latest");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuNote, setActiveMenuNote] = useState(null);

  const filterOptions = ["All", "Weekly", "Monthly", "Personal"];
  const sortOptions = ["Latest", "Oldest", "Most Liked", "Most Commented"];

  const [messageModal, setMessageModal] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [notes, setNotes] = useState(notesData);

  const [formData, setFormData] = useState({
    title: "",
    type: "Weekly",
    category: "Product",
    description: "",
  });

  const filteredNotes = useMemo(() => {
    let data = [...notes];

    // Search filter
    if (searchTerm) {
      data = data.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filter !== "All") {
      data = data.filter((item) => item.type === filter);
    }

    // Sorting
    if (sortType === "Latest") {
      data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortType === "Oldest") {
      data = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortType === "Most Liked") {
      data = data.sort((a, b) => b.likes - a.likes);
    } else if (sortType === "Most Commented") {
      data = data.sort((a, b) => b.comments - a.comments);
    }

    return data;
  }, [filter, sortType, notes, searchTerm]);

  const tagColors = {
    Weekly: "bg-amber-50 text-amber-700 border border-amber-200",
    Monthly: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Personal: "bg-orange-50 text-orange-700 border border-orange-200",
    Product: "bg-blue-50 text-blue-700 border border-blue-200",
    Business: "bg-purple-50 text-purple-700 border border-purple-200",
    Image: "bg-pink-50 text-pink-700 border border-pink-200",
  };

  const handleAddNote = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      setMessageModal({
        show: true,
        type: "error",
        message: "Please fill all required fields.",
      });
      return;
    }

    const newNote = {
      id: Date.now(),
      type: formData.type,
      category: formData.category,
      title: formData.title,
      description: formData.description,
      points: [],
      author: "Current User",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      likes: 0,
      comments: 0,
    };

    setNotes((prev) => [newNote, ...prev]);

    setFormData({
      title: "",
      type: "Weekly",
      category: "Product",
      description: "",
    });

    setShowModal(false);

    setTimeout(() => {
      setMessageModal({
        show: true,
        type: "success",
        message: "Note Successfully Added!",
      });
    }, 200);
  };

  const handleDeleteNote = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter(note => note.id !== id));
      setActiveMenuNote(null);
      setMessageModal({
        show: true,
        type: "success",
        message: "Note Deleted Successfully!",
      });
    }
  };

  const stats = {
    total: notes.length,
    weekly: notes.filter(n => n.type === "Weekly").length,
    monthly: notes.filter(n => n.type === "Monthly").length,
    personal: notes.filter(n => n.type === "Personal").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="flex items-center justify-between -mb-5 px-6 pt-6">
          <p className="text-sm text-gray-400">
            <Link to="/student/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-600 font-medium">Notes</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200"></div>
          </div>
        </div>
      
        <div className="max-w-7xl mx-auto px-6 py-4 -mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Notes Library</h1>
                  <p className="text-sm text-gray-500">Organize your thoughts and important information</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
            >
              <FaPlus className="text-sm" />
              Add New Note
            </button>
          </div>
        </div>
      

      <div className="max-w-7xl mx-auto px-5 py-6">
  {/* Stats Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 -mt-2">
    {/* Total Notes Card */}
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
      <div className="w-[52px] h-[52px] rounded-xl bg-blue-50 flex items-center justify-center">
        <FaStickyNote className="text-blue-600 text-[24px]" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">Total Notes</p>
        <h2 className="text-2xl font-bold text-gray-800">{stats.total}</h2>
      </div>
    </div>

    {/* Weekly Notes Card */}
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
      <div className="w-[52px] h-[52px] rounded-xl bg-amber-50 flex items-center justify-center">
        <FaCalendarAlt className="text-amber-600 text-[22px]" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">Weekly Notes</p>
        <h2 className="text-2xl font-bold text-gray-800">{stats.weekly}</h2>
      </div>
    </div>

    {/* Monthly Notes Card */}
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
      <div className="w-[52px] h-[52px] rounded-xl bg-emerald-50 flex items-center justify-center">
        <FaCalendarAlt className="text-emerald-600 text-[22px]" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">Monthly Notes</p>
        <h2 className="text-2xl font-bold text-gray-800">{stats.monthly}</h2>
      </div>
    </div>

    {/* Personal Notes Card */}
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
      <div className="w-[52px] h-[52px] rounded-xl bg-orange-50 flex items-center justify-center">
        <FaUser className="text-orange-600 text-[22px]" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">Personal Notes</p>
        <h2 className="text-2xl font-bold text-gray-800">{stats.personal}</h2>
      </div>
    </div>
  </div>
        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-5">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes by title, description, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            
            <div className="flex gap-3">
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowFilterDropdown(!showFilterDropdown);
                    setShowSortDropdown(false);
                  }}
                  className="h-11 px-5 border border-gray-200 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition"
                >
                  <FaFilter className="text-sm" />
                  <span className="font-medium">{filter}</span>
                </button>

                {showFilterDropdown && (
                  <div className="absolute top-12 left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-2">
                    {filterOptions.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setFilter(item);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition ${
                          filter === item
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSortDropdown(!showSortDropdown);
                    setShowFilterDropdown(false);
                  }}
                  className="h-11 px-5 border border-gray-200 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition"
                >
                  <FaSortAmountDown className="text-sm" />
                  <span className="font-medium">Sort: {sortType}</span>
                </button>

                {showSortDropdown && (
                  <div className="absolute top-12 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-2">
                    {sortOptions.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSortType(item);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition ${
                          sortType === item
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Note Header with Gradient Line */}
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                
                <div className="p-5">
                  {/* Tags Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${tagColors[note.type]}`}>
                        {note.type}
                      </span>
                      {note.category !== "Image" && (
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${tagColors[note.category]}`}>
                          {note.category}
                        </span>
                      )}
                    </div>
                    
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuNote(activeMenuNote === note.id ? null : note.id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
                      >
                        <FaEllipsisH />
                      </button>
                      
                      {activeMenuNote === note.id && (
                        <div className="absolute right-0 top-8 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                          >
                            Delete Note
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {note.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {note.description}
                  </p>

                  {/* Points List */}
                  {note.points.length > 0 && (
                    <ul className="space-y-1 mb-3">
                      {note.points.map((point, index) => (
                        <li key={index} className="text-gray-500 text-xs flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span className="line-clamp-1">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                    <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition text-sm">
                      <FaThumbsUp />
                      <span>{note.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition text-sm">
                      <FaComment />
                      <span>{note.comments}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition text-sm">
                      <FaShare />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Author Footer */}
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={note.avatar}
                      alt={note.author}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                    />
                    <span className="text-sm font-medium text-gray-700">{note.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FaClock className="text-xs" />
                    <span>{note.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaStickyNote className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notes found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilter("All");
                setSortType("Latest");
              }}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Add New Note</h2>
                <p className="text-sm text-gray-500 mt-1">Capture your thoughts and important information</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Note Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter a descriptive title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Note Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Product">Product</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Write your note content here..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="5"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md"
                >
                  Add Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="w-96 bg-white rounded-2xl p-6 shadow-xl text-center animate-fadeIn">
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${
                messageModal.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {messageModal.type === "success" ? "✓" : "!"}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {messageModal.type === "success" ? "Success!" : "Error!"}
            </h2>

            <p className="text-gray-500 mb-6">{messageModal.message}</p>

            <button
              type="button"
              onClick={() =>
                setMessageModal({
                  show: false,
                  type: "",
                  message: "",
                })
              }
              className={`w-full py-2.5 rounded-lg text-white font-semibold ${
                messageModal.type === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } transition`}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default Notes;