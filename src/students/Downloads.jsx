import React, { useMemo, useState } from "react";
import {
  FaSearch,
  FaFilePdf,
  FaVideo,
  FaFilePowerpoint,
  FaCertificate,
  FaDownload,
  FaEye,
  FaTrash,
  FaPause,
  FaPlay,
  FaStar,
  FaFolderOpen,
} from "react-icons/fa";

function Downloads() {
  const [search, setSearch] = useState("");

  const downloads = [
    {
      id: 1,
      fileName: "React Hooks Notes",
      course: "React JS",
      type: "PDF",
      size: 2.4,
      status: "Completed",
      progress: 100,
      date: "May 24, 2026",
      favorite: true,
      icon: <FaFilePdf />,
    },
    {
      id: 2,
      fileName: "Routing Class Recording",
      course: "React JS",
      type: "Video",
      size: 120,
      status: "Downloading",
      progress: 65,
      date: "Today",
      favorite: false,
      icon: <FaVideo />,
    },
    {
      id: 3,
      fileName: "JavaScript Basics PPT",
      course: "JavaScript",
      type: "PPT",
      size: 5.1,
      status: "Completed",
      progress: 100,
      date: "May 22, 2026",
      favorite: false,
      icon: <FaFilePowerpoint />,
    },
    {
      id: 4,
      fileName: "Course Completion Certificate",
      course: "Frontend Design",
      type: "Certificate",
      size: 1.2,
      status: "Completed",
      progress: 100,
      date: "May 20, 2026",
      favorite: true,
      icon: <FaCertificate />,
    },
  ];

  const filteredDownloads = downloads.filter((item) =>
    item.fileName.toLowerCase().includes(search.toLowerCase())
  );

  const stats = useMemo(() => {
    return {
      total: downloads.length,
      completed: downloads.filter((item) => item.status === "Completed").length,
      active: downloads.filter((item) => item.status === "Downloading").length,
      storage: downloads.reduce((sum, item) => sum + item.size, 0).toFixed(1),
    };
  }, [downloads]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-6 pt-3 pb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[34px] font-bold text-[#241b4b]">Downloads</h1>
          <p className="text-[18px] text-gray-400 mt-2">
            Manage offline files, videos, notes, and certificates
          </p>
        </div>

        <button className="h-[46px] px-5 bg-orange-600 text-white rounded-xl flex items-center gap-2 hover:bg-orange-700">
          <FaDownload />
          Download All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-400">Total Downloads</p>
          <h2 className="text-[28px] font-bold text-[#241b4b]">
            {stats.total}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-400">Completed</p>
          <h2 className="text-[28px] font-bold text-[#241b4b]">
            {stats.completed}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-400">Active Downloads</p>
          <h2 className="text-[28px] font-bold text-[#241b4b]">
            {stats.active}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-400">Storage Used</p>
          <h2 className="text-[28px] font-bold text-[#241b4b]">
            {stats.storage} MB
          </h2>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6 flex items-center gap-4">
        <div className="flex-1 h-[46px] border border-gray-200 rounded-xl px-4 flex items-center gap-3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search downloads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-gray-700"
          />
        </div>

        <select className="h-[46px] px-4 border border-gray-200 rounded-xl outline-none text-gray-600">
          <option>All Types</option>
          <option>PDF</option>
          <option>Video</option>
          <option>PPT</option>
          <option>Certificate</option>
        </select>

        <select className="h-[46px] px-4 border border-gray-200 rounded-xl outline-none text-gray-600">
          <option>All Status</option>
          <option>Completed</option>
          <option>Downloading</option>
          <option>Paused</option>
        </select>
      </div>

      {/* Storage Box */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[22px] font-bold text-[#241b4b]">
              Storage Management
            </h3>
            <p className="text-gray-400 text-sm">
              Used {stats.storage} MB of 500 MB available storage
            </p>
          </div>

          <FaFolderOpen className="text-orange-500 text-3xl" />
        </div>

        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full"
            style={{ width: `${Math.min((stats.storage / 500) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Download Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
  {filteredDownloads.map((item) => (
    <div
      key={item.id}
      className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition min-h-[250px] flex flex-col overflow-hidden"
    >
      <div className="flex items-start gap-4 flex-1">
        <div className="w-[54px] h-[54px] shrink-0 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl">
          {item.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[20px] font-bold text-[#241b4b] whitespace-nowrap overflow-hidden text-ellipsis">
                {item.fileName}
              </h2>

              <p className="text-gray-400 text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                {item.course} • {item.type} • {item.size} MB
              </p>
            </div>

            <span
              className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
                item.status === "Completed"
                  ? "bg-green-100 text-green-600"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {item.status}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress</span>
              <span>{item.progress}%</span>
            </div>

            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 text-gray-500 text-sm">
            <span>{item.date}</span>
            <span>{item.favorite ? "Favorite" : "Normal"}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4 flex-wrap">
        <button className="h-[36px] px-3 bg-orange-50 text-orange-600 rounded-xl flex items-center gap-2 text-sm">
          <FaEye />
          Preview
        </button>

        {item.status === "Downloading" ? (
          <button className="h-[36px] px-3 bg-gray-100 text-gray-600 rounded-xl flex items-center gap-2 text-sm">
            <FaPause />
            Pause
          </button>
        ) : (
          <button className="h-[36px] px-3 bg-gray-100 text-gray-600 rounded-xl flex items-center gap-2 text-sm">
            <FaPlay />
            Open
          </button>
        )}

        <button className="h-[36px] px-3 bg-yellow-50 text-yellow-600 rounded-xl flex items-center gap-2 text-sm">
          <FaStar />
          Save
        </button>

        <button className="h-[36px] px-3 bg-red-50 text-red-500 rounded-xl flex items-center gap-2 text-sm">
          <FaTrash />
          Delete
        </button>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}

export default Downloads;