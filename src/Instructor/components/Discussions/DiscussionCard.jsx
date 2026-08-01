import React from "react";
import { FaUsers, FaClock, FaSpinner, FaChevronRight } from "react-icons/fa";
import { channelStyle, initials, fmt } from "./utils.jsx";

const DiscussionCard = ({ discussion, onOpen, loading }) => {
  const style = channelStyle(discussion.groupName || discussion.courseTitle || "");
  
  return (
    <button
      onClick={() => onOpen(discussion)}
      disabled={loading}
      className="w-full text-left bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 p-4 sm:p-5 flex items-center gap-4 disabled:opacity-70"
    >
      <div className={`w-12 h-12 rounded-xl ${style.bg} text-white flex items-center justify-center text-sm font-black flex-shrink-0 shadow-sm`}>
        {initials(discussion.groupName || discussion.courseTitle)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate">
            {discussion.groupName || discussion.courseTitle}
          </h3>
        </div>
        {discussion.courseTitle && discussion.groupName !== discussion.courseTitle && (
          <p className="text-[11px] text-slate-400">{discussion.courseTitle}</p>
        )}
        {discussion.latestMessage ? (
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{discussion.latestMessage}</p>
        ) : (
          <p className="text-xs text-slate-400 italic mt-0.5">No messages yet</p>
        )}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
          <span className="flex items-center gap-1"><FaUsers size={9} /> {discussion.totalMembers ?? 0} members</span>
          {discussion.latestMessageTime && (
            <span className="hidden sm:flex items-center gap-1"><FaClock size={9} /> {fmt(discussion.latestMessageTime)}</span>
          )}
        </div>
      </div>

      <div className={`w-8 h-8 rounded-full ${style.soft} ${style.text} flex items-center justify-center flex-shrink-0`}>
        {loading ? <FaSpinner className="animate-spin" size={11} /> : <FaChevronRight size={11} />}
      </div>
    </button>
  );
};

export default DiscussionCard;
