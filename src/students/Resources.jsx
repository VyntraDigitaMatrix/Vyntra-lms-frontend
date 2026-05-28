import React, { useMemo, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
  FaVideo,
  FaDownload,
  FaEye,
  FaStar,
  FaCloudUploadAlt,
  FaTimes,
} from "react-icons/fa";

function Resources() {
  const [search, setSearch] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [messageModal, setMessageModal] = useState({
  show: false,
  type: "",
  message: "",
});

  const [resources, setResources] = useState([
    {
      id: 1,
      title: "React Hooks Notes",
      course: "React JS",
      type: "PDF",
      size: "2.4 MB",
      downloads: 120,
      saved: true,
      uploadedBy: "Instructor",
      date: "May 20, 2026",
      status: "Public",
      iconType: "PDF",
    },
    {
      id: 2,
      title: "JavaScript Basics PPT",
      course: "JavaScript",
      type: "PPT",
      size: "5.1 MB",
      downloads: 95,
      saved: false,
      uploadedBy: "Admin",
      date: "May 18, 2026",
      status: "Public",
      iconType: "PPT",
    },
    {
      id: 3,
      title: "CSS Layout Guide",
      course: "Frontend Design",
      type: "DOC",
      size: "1.8 MB",
      downloads: 60,
      saved: true,
      uploadedBy: "Instructor",
      date: "May 15, 2026",
      status: "Private",
      iconType: "DOC",
    },
    {
      id: 4,
      title: "Routing Class Recording",
      course: "React JS",
      type: "Video",
      size: "120 MB",
      downloads: 45,
      saved: false,
      uploadedBy: "Instructor",
      date: "May 12, 2026",
      status: "Public",
      iconType: "Video",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    course: "",
    type: "",
    size: "",
    uploadedBy: "",
    status: "Public",
  });

  const getIcon = (type) => {
    if (type === "PDF") return <FaFilePdf />;
    if (type === "PPT") return <FaFilePowerpoint />;
    if (type === "DOC") return <FaFileWord />;
    if (type === "Video") return <FaVideo />;
    return <FaFilePdf />;
  };

  const stats = useMemo(() => {
    return {
      totalResources: resources.length,
      downloads: resources.reduce((sum, item) => sum + item.downloads, 0),
      saved: resources.filter((item) => item.saved).length,
      courses: new Set(resources.map((item) => item.course)).size,
    };
  }, [resources]);

  const filteredResources = resources.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleUploadSubmit = (e) => {
  e.preventDefault();

  if (!formData.title || !formData.course || !formData.type) {
    setMessageModal({
      show: true,
      type: "error",
      message: "Please fill all required fields.",
    });
    return;
  }

  const newResource = {
    id: Date.now(),
    title: formData.title,
    course: formData.course,
    type: formData.type,
    size: formData.size || "1.0 MB",
    downloads: 0,
    saved: false,
    uploadedBy: formData.uploadedBy || "Instructor",
    date: "Just now",
    status: formData.status,
    iconType: formData.type,
  };

  setResources((prev) => [newResource, ...prev]);

  setFormData({
    title: "",
    course: "",
    type: "",
    size: "",
    uploadedBy: "",
    status: "Public",
  });

  setShowUploadModal(false);

  setTimeout(() => {
    setMessageModal({
      show: true,
      type: "success",
      message: "Resource Successfully Added!",
    });
  }, 200);
};

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-6 pt-3 pb-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[34px] font-bold text-[#241b4b]">Resources</h1>
          <p className="text-[18px] text-gray-400 mt-2">
            Manage learning materials, notes, videos, and files
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="h-[46px] px-5 bg-orange-600 text-white rounded-xl flex items-center gap-2 hover:bg-orange-700"
        >
          <FaPlus />
          Upload Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-400">Total Resources</p>
          <h2 className="text-[28px] font-bold text-[#241b4b]">
            {stats.totalResources}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-400">Downloads</p>
          <h2 className="text-[28px] font-bold text-[#241b4b]">
            {stats.downloads}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-400">Saved</p>
          <h2 className="text-[28px] font-bold text-[#241b4b]">
            {stats.saved}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-400">Courses</p>
          <h2 className="text-[28px] font-bold text-[#241b4b]">
            {stats.courses}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6 flex items-center gap-4">
        <div className="flex-1 h-[46px] border border-gray-200 rounded-xl px-4 flex items-center gap-3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-gray-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div
          onClick={() => setShowUploadModal(true)}
          className="xl:col-span-2 bg-white rounded-2xl border border-dashed border-orange-300 p-6 flex items-center justify-center cursor-pointer"
        >
          <div className="text-center">
            <FaCloudUploadAlt className="text-orange-500 text-5xl mx-auto mb-3" />
            <h3 className="text-[22px] font-bold text-[#241b4b]">
              Drag & Drop Resources Here
            </h3>
            <p className="text-gray-400 mt-1">
              PDF, PPT, DOC, Video, ZIP files supported
            </p>
            <button className="mt-4 h-[42px] px-5 bg-orange-600 text-white rounded-xl">
              Browse Files
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <h3 className="text-[20px] font-bold text-[#241b4b] mb-4">
            Categories
          </h3>

          {["PDF", "PPT", "DOC", "Video"].map((type) => (
            <div
              key={type}
              className="flex items-center justify-between py-2 text-gray-600"
            >
              <span>{type}</span>
              <span className="text-orange-600 font-semibold">
                {resources.filter((item) => item.type === type).length}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {filteredResources.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start gap-4">
              <div className="w-[54px] h-[54px] rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl">
                {getIcon(item.iconType)}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#241b4b]">
                      {item.title}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {item.course} • {item.type} • {item.size}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === "Public"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-gray-500 text-sm">
                  <span>Uploaded by {item.uploadedBy}</span>
                  <span>{item.date}</span>
                  <span>{item.downloads} Downloads</span>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button className="h-[38px] px-4 bg-orange-50 text-orange-600 rounded-xl flex items-center gap-2">
                    <FaEye />
                    Preview
                  </button>

                  <button className="h-[38px] px-4 bg-gray-100 text-gray-600 rounded-xl flex items-center gap-2">
                    <FaStar />
                    Save
                  </button>

                  <button className="h-[38px] px-4 bg-[#241b4b] text-white rounded-xl flex items-center gap-2">
                    <FaDownload />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[24px] font-bold text-[#241b4b]">
                Upload Resource
              </h2>

              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Resource Title"
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

              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
                className="w-full h-[46px] border border-gray-300 rounded-xl px-4 outline-none"
              >
                <option value="">Select File Type</option>
                <option value="PDF">PDF</option>
                <option value="PPT">PPT</option>
                <option value="DOC">DOC</option>
                <option value="Video">Video</option>
              </select>

              <input
                type="text"
                placeholder="File Size Example: 2.5 MB"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                className="w-full h-[46px] border border-gray-300 rounded-xl px-4 outline-none"
              />

              <input
                type="text"
                placeholder="Uploaded By"
                value={formData.uploadedBy}
                onChange={(e) =>
                  setFormData({ ...formData, uploadedBy: e.target.value })
                }
                className="w-full h-[46px] border border-gray-300 rounded-xl px-4 outline-none"
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full h-[46px] border border-gray-300 rounded-xl px-4 outline-none"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="h-[42px] px-5 rounded-xl border border-gray-300 text-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-[42px] px-5 rounded-xl bg-orange-600 text-white hover:bg-orange-700"
                >
                  Add Resource
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

export default Resources;