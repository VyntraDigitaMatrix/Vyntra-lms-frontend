import React, { useMemo, useState } from "react";
import {
  FaPlus,
  FaFilter,
  FaSortAmountDown,
  FaEllipsisH,
} from "react-icons/fa";

function Notes() {
  const notesData = [
    {
      id: 1,
      type: "Weekly",
      category: "Product",
      title: "Product Team Meeting",
      description:
        "This monthly progress agenda is following this items:",
      points: [
        "Introduction to Newest Product Plan",
        "Monthly Revenue updates for each",
      ],
      author: "Floyd Miles",
      date: "Mar 5 04:25",
      avatar:
        "https://randomuser.me/api/portraits/men/32.jpg",
    },

    {
      id: 2,
      type: "Monthly",
      category: "Business",
      title: "Product Team Meeting",
      description:
        "This monthly progress agenda is following this items:",
      points: [
        "Introduction to Newest Product Plan",
        "Monthly Revenue updates for each",
      ],
      author: "Dianne Russell",
      date: "Apr 11 18:30",
      avatar:
        "https://randomuser.me/api/portraits/women/44.jpg",
    },

    {
      id: 3,
      type: "Personal",
      category: "Business",
      title: "HR Interview",
      description:
        "This monthly progress agenda is following this items:",
      points: [
        "Introduction to Newest Product Plan",
        "Monthly Revenue updates for each",
      ],
      author: "Annette Black",
      date: "Jun 23 14:31",
      avatar:
        "https://randomuser.me/api/portraits/women/68.jpg",
    },

    {
      id: 4,
      type: "Monthly",
      category: "Product",
      title: "Monthly Team Progress",
      description:
        "This monthly progress agenda is following this items:",
      points: [
        "Introduction to Newest Product Plan",
        "Monthly Revenue updates for each",
      ],
      author: "Robert Fox",
      date: "Jan 31 09:53",
      avatar:
        "https://randomuser.me/api/portraits/men/55.jpg",
    },

    {
      id: 5,
      type: "Monthly",
      category: "Business",
      title: "Product Team Meeting",
      description:
        "Some summaries of this weeks meeting with some conclusion we get :",
      points: [
        "Introduction to Newest Product Plan",
        "Monthly Revenue updates for each",
      ],
      author: "Brooklyn Simmons",
      date: "Aug 15 10:29",
      avatar:
        "https://randomuser.me/api/portraits/women/22.jpg",
    },

    {
      id: 6,
      type: "Personal",
      category: "Image",
      title: "Document Images",
      description: "Report Document of Weekly Meetings",
      points: [
        "Introduction to Newest Product Plan",
        "Monthly Revenue updates for each",
      ],
      author: "Cameron Williamson",
      date: "Dec 30 21:28",
      avatar:
        "https://randomuser.me/api/portraits/men/41.jpg",
    },
  ];

  const [sortType, setSortType] = useState("Latest");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

const filterOptions = ["All", "Weekly", "Monthly", "Personal"];

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

    if (filter !== "All") {
      data = data.filter((item) => item.type === filter);
    }

    if (sortType === "Latest") {
      data.reverse();
    }

    return data;
  }, [filter, sortType, notes]);

  const tagColors = {
    Weekly: "bg-[#f4f1d6] text-[#a39a00]",
    Monthly: "bg-[#e9f6e5] text-[#2c9b1f]",
    Personal: "bg-[#fff2e7] text-[#d78521]",
    Product: "bg-[#edf3ff] text-[#4285f4]",
    Business: "bg-[#f3e9ff] text-[#9c59d1]",
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
    author: "Shankar",
    date: "Just now",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
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

  return (
  <div className="bg-[#f7f7f7] min-h-screen px-6 pb-6 pt-2">

      {/* Top Header */}
      <div className="h-[90px] border-b border-gray-200 flex items-center justify-between px-10">
        <h1 className="text-[36px] font-semibold text-none ">
          Notes
        </h1>

        <div className="flex items-center gap-5">
          {/* Sort */}
          <button className="h-[40px] px-7 border border-[#ff5a1f] rounded-xl flex items-center gap-3 text-[#ff5a1f] text-[22px] hover:bg-orange-50 transition">
            <FaSortAmountDown className="text-lg" />
            Sort By
          </button>
          <div className="relative">
  <button
    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
    className="h-[40px] px-7 border border-[#ff5a1f] rounded-xl flex items-center gap-3 text-[#ff5a1f] text-[22px] hover:bg-orange-50 hover:border-orange-200 transition"
  >
    <FaFilter className="text-lg" />
    {filter}
  </button>

  {showFilterDropdown && (
    <div className="absolute top-12 left-0 w-[180px] bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-2">
      {filterOptions.map((item) => (
        <button
          key={item}
          onClick={() => {
            setFilter(item);
            setShowFilterDropdown(false);
          }}
          className={`w-full text-left px-4 py-2 rounded-lg text-[16px] transition ${
            filter === item
              ? "bg-orange-600 text-white"
              : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  )}
</div>
          {/* Add Notes */}
          <button
  onClick={() => setShowModal(true)}
  className="h-[40px] px-8 bg-[#ff5a1f] text-white rounded-xl flex items-center gap-3 text-[22px] hover:bg-[#e84d16] transition"
>
            <FaPlus className="text-lg" />
            Add Notes
          </button>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  {filteredNotes.map((note) => (
    <div
      key={note.id}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
    >
      <div className="p-5 h-[220px] overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-md text-xs font-medium ${tagColors[note.type]}`}>
            {note.type}
          </span>

          {note.category !== "Image" && (
            <span className={`px-3 py-1 rounded-md text-xs font-medium ${tagColors[note.category]}`}>
              {note.category}
            </span>
          )}
        </div>

        <h2 className="text-lg font-semibold text-black leading-snug mb-3">
          {note.title}
        </h2>

        <p className="text-gray-500 text-sm leading-6">
          {note.description}
        </p>

        {note.points.length > 0 && (
          <ul className="mt-3 space-y-1 list-disc list-inside">
            {note.points.map((point, index) => (
              <li key={index} className="text-gray-500 text-sm truncate">
                {point}
              </li>
            ))}
          </ul>
        )}

        {note.image && (
          <img
            src={note.image}
            alt=""
            className="w-full h-[95px] object-cover rounded-lg mt-3"
          />
        )}
      </div>

      <div className="h-[58px] border-t border-gray-200 px-5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={note.avatar}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />

          <span className="text-sm font-semibold text-black truncate">
            {note.author}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm whitespace-nowrap">
            {note.date}
          </span>

          <button className="text-gray-400 hover:text-[#ff5a1f]">
            <FaEllipsisH />
          </button>
        </div>
      </div>
    </div>
  ))}
  {showModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[24px] font-bold text-[#241b4b]">Add Note</h2>

        <button
          onClick={() => setShowModal(false)}
          className="text-gray-400 hover:text-red-500"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleAddNote} className="space-y-4">
        <input
          type="text"
          placeholder="Note Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full h-[46px] border border-gray-300 rounded-xl px-4 outline-none"
        />

        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full h-[46px] border border-gray-300 rounded-xl px-4 outline-none"
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Personal">Personal</option>
        </select>

        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full h-[46px] border border-gray-300 rounded-xl px-4 outline-none"
        >
          <option value="Product">Product</option>
          <option value="Business">Business</option>
        </select>

        <textarea
          placeholder="Note description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full h-[110px] border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="h-[42px] px-5 rounded-xl border border-gray-300 text-gray-600"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="h-[42px] px-5 rounded-xl bg-orange-600 text-white hover:bg-orange-700"
          >
            Add Note
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{messageModal.show && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
    <div className="w-[360px] bg-white rounded-2xl p-6 shadow-xl text-center">
      <div
        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${
          messageModal.type === "success"
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
        }`}
      >
        {messageModal.type === "success" ? "✓" : "!"}
      </div>

      <h2 className="text-[22px] font-bold text-[#241b4b] mb-2">
        {messageModal.type === "success" ? "Success" : "Error"}
      </h2>

      <p className="text-gray-500 mb-5">{messageModal.message}</p>

      <button
        type="button"
        onClick={() =>
          setMessageModal({
            show: false,
            type: "",
            message: "",
          })
        }
        className={`h-[42px] px-6 rounded-xl text-white ${
          messageModal.type === "success"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        OK
      </button>
    </div>
  </div>
)}
</div>
    </div>
  );
}

export default Notes;