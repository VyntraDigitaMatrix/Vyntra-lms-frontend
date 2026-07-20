import React, { useState } from "react";
import { FaEye, FaReply, FaTrash } from "react-icons/fa";
import { avatar, fmt, RoleBadge } from "./utils.jsx";

const ChatMessage = ({ msg, currentUserId, onDelete, onReply }) => {
  const isOwn = String(msg.senderId) === String(currentUserId);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={msg.senderProfileImage || avatar(msg.senderName)}
        alt={msg.senderName}
        className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm flex-shrink-0 self-end"
      />

      <div className={`flex flex-col max-w-[72%] sm:max-w-[60%] ${isOwn ? "items-end" : "items-start"}`}>
        <div className={`flex items-center gap-1.5 mb-1 ${isOwn ? "mr-1 flex-row-reverse" : "ml-1"}`}>
          <span className="text-xs font-semibold text-gray-700">{isOwn ? "You" : msg.senderName}</span>
          <RoleBadge role={msg.senderRole} />
        </div>

        {msg.replyToMessageId && (
          <div className={`text-[11px] px-3 py-1.5 rounded-xl mb-1 border-l-2 ${isOwn ? "border-violet-400 bg-violet-50 text-violet-700" : "border-gray-300 bg-gray-100 text-gray-600"}`}>
            <span className="font-semibold block">{msg.replyToSenderName}</span>
            <span className="line-clamp-1">{msg.replyToMessageContent}</span>
          </div>
        )}

        <div className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
          ${isOwn ? "bg-violet-600 text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"}
          ${msg.deleted ? "opacity-60 italic" : ""}
        `}>
          {msg.deleted ? "This message was deleted." : (
            <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
          )}
          {msg.edited && !msg.deleted && (
            <span className={`text-[9px] ml-1 ${isOwn ? "text-violet-200" : "text-gray-400"}`}>(edited)</span>
          )}
        </div>

        <div className={`flex items-center gap-2 mt-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] text-gray-400">{fmt(msg.createdAt)}</span>
          {msg.seenCount > 0 && isOwn && (
            <span className="flex items-center gap-0.5 text-[10px] text-violet-500">
              <FaEye size={9} /> {msg.seenCount}
            </span>
          )}
        </div>
      </div>

      {hovered && !msg.deleted && (
        <div className={`flex items-center gap-1 self-center ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          <button onClick={() => onReply(msg)} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition" title="Reply">
            <FaReply size={10} />
          </button>
        
            <button onClick={() => onDelete(msg.messageId)} className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-400 transition" title="Delete">
              <FaTrash size={10} />
            </button>
      
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
