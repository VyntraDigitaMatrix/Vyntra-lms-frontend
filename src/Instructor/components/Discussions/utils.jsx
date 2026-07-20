import React from "react";

export const fmt = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const avatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=7C3AED&color=fff&size=80`;

/* Deterministic "channel" color per group */
export const CHANNEL_PALETTE = [
  { bg: "bg-violet-600", soft: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-100" },
  { bg: "bg-indigo-600", soft: "bg-indigo-50", text: "text-indigo-700", ring: "ring-indigo-100" },
  { bg: "bg-blue-600", soft: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-100" },
  { bg: "bg-teal-600", soft: "bg-teal-50", text: "text-teal-700", ring: "ring-teal-100" },
  { bg: "bg-amber-500", soft: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-100" },
  { bg: "bg-rose-500", soft: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-100" },
  { bg: "bg-fuchsia-600", soft: "bg-fuchsia-50", text: "text-fuchsia-700", ring: "ring-fuchsia-100" },
];

export const channelStyle = (name = "") => {
  const sum = [...name].reduce((s, c) => s + c.charCodeAt(0), 0);
  return CHANNEL_PALETTE[sum % CHANNEL_PALETTE.length];
};

export const initials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const RoleBadge = ({ role }) => {
  if (role === "INSTRUCTOR")
    return <span className="text-[9px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-semibold">Instructor</span>;
  if (role === "ADMIN")
    return <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-semibold">Admin</span>;
  return null;
};

export const SystemMessage = ({ content }) => (
  <div className="flex justify-center my-1">
    <span className="text-[11px] text-gray-400 bg-gray-100 rounded-full px-3 py-1 italic">{content}</span>
  </div>
);
