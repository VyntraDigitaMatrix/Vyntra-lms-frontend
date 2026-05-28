// src/components/Discussions.jsx
import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaComments,
  FaUserGraduate,
  FaClock,
  FaReply,
  FaTimes,
} from "react-icons/fa";

function Discussions() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [messageModal, setMessageModal] = useState({
  show: false,
  type: "",
  message: "",
});

  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "Doubt About React Routing",
      course: "React JS",
      postedBy: "Shankar",
      replies: 12,
      time: "2 hours ago",
      status: "Open",
      description: "I am facing issue while navigating between pages.",
    },
    {
      id: 2,
      title: "Assignment Submission Query",
      course: "JavaScript",
      postedBy: "Rahul",
      replies: 8,
      time: "Yesterday",
      status: "Answered",
      description: "Where should we upload the final assignment?",
    },
    {
      id: 3,
      title: "CSS Layout Issue",
      course: "Frontend Design",
      postedBy: "Priya",
      replies: 5,
      time: "3 days ago",
      status: "Open",
      description: "Cards are not aligning properly in responsive view.",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    course: "",
    description: "",
    status: "Open",
  });

  const filteredData = discussions.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

 const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.title || !formData.course || !formData.description) {
    setMessageModal({
      show: true,
      type: "error",
      message: "Please fill all required fields.",
    });
    return;
  }

  const newDiscussion = {
    id: Date.now(),
    title: formData.title,
    course: formData.course,
    description: formData.description,
    status: formData.status,
    postedBy: "Shankar",
    replies: 0,
    time: "Just now",
  };

  setDiscussions((prev) => [newDiscussion, ...prev]);

  setFormData({
    title: "",
    course: "",
    description: "",
    status: "Open",
  });

  setShowModal(false);

  setTimeout(() => {
    setMessageModal({
      show: true,
      type: "success",
      message: "Discussion Successfully Added!",
    });
  }, 200);
};
  return (
    <div className="min-h-screen bg-[#f7f7f7] px-6 pt-3 pb-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[34px] font-bold text-[#241b4b]">
            Discussions
          </h1>
          <p className="text-[18px] text-gray-400 mt-2">
            Ask questions, reply to doubts, and discuss course topics
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="h-[46px] px-5 bg-orange-600 text-white rounded-xl flex items-center gap-2 hover:bg-orange-700"
        >
          <FaPlus />
          New Discussion
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6 flex items-center gap-4">
        <div className="flex-1 h-[46px] border border-gray-200 rounded-xl px-4 flex items-center gap-3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-gray-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-[20px] font-bold text-[#241b4b] h-[32px] whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.title}
                </h2>

                <p className="text-gray-500 mt-2 text-[15px] min-h-[45px]">
                  {item.description}
                </p>
              </div>

              <span
                className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === "Answered"
                    ? "bg-green-100 text-green-600"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-1 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <FaComments className="text-orange-500" />
                {item.course}
              </div>

              <div className="flex items-center gap-2">
                <FaUserGraduate className="text-orange-500" />
                {item.postedBy}
              </div>

              <div className="flex items-center gap-2">
                <FaReply className="text-orange-500" />
                {item.replies} Replies
              </div>

              <div className="flex items-center gap-2">
                <FaClock className="text-orange-500" />
                {item.time}
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <button className="h-[40px] px-5 bg-[#241b4b] text-white rounded-xl hover:bg-[#34276d]">
                View Discussion
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[24px] font-bold text-[#241b4b]">
                Add New Discussion
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Discussion Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full h-[46px] border border-gray-300 rounded-xl px-4 outline-none"
              />

              <select
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
                required
                className="w-full h-[46px] border border-gray-300 rounded-xl px-4 outline-none"
              >
                <option value="">Select Course</option>
                <option value="React JS">React JS</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Frontend Design">Frontend Design</option>
              </select>

              <textarea
                placeholder="Write your question or discussion..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                required
                className="w-full h-[110px] border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none"
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full h-[46px] border border-gray-300 rounded-xl px-4 outline-none"
              >
                <option value="Open">Open</option>
                <option value="Answered">Answered</option>
                <option value="Closed">Closed</option>
              </select>

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
                  Add Discussion
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
  );
}

export default Discussions;