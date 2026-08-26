import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaHashtag,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaEdit,
  FaTrash,
  FaCheck,
  FaBan,
  FaImage,
  FaHeart,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
} from "react-icons/fa";
import { adminCommunityApi } from "../auth/api";

/* ─── Helpers ─────────────────────────────────────────────── */
const fmt = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const TABS = [
  { key: "my", label: "My Posts", fetcher: "getMyPosts" },
  { key: "pending", label: "Pending Review", fetcher: "getPendingPosts" },
  { key: "approved", label: "Approved", fetcher: "getApprovedPosts" },
  { key: "rejected", label: "Rejected", fetcher: "getRejectedPosts" },
];

const StatusBadge = ({ status }) => {
  const map = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

/* ─── Post Card ───────────────────────────────────────────── */
const PostCard = ({ post, tab, onEdit, onDelete, onApprove, onReject }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
    <div className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={post.status} />
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <FaClock size={9} /> {fmt(post.createdAt)}
          </span>
        </div>
        <span className="flex items-center gap-1 text-[11px] text-gray-500 flex-shrink-0">
          <FaHeart size={10} className="text-rose-400" /> {post.likeCount ?? 0}
        </span>
      </div>

      {post.content && (
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mb-3">{post.content}</p>
      )}

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post attachment"
          className="w-full max-h-72 object-cover rounded-xl border border-gray-100 mb-3"
        />
      )}

      {post.status === "REJECTED" && post.rejectionReason && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
          <FaExclamationCircle className="text-red-400 mt-0.5 flex-shrink-0" size={12} />
          <p className="text-xs text-red-600">
            <span className="font-semibold">Rejection reason: </span>
            {post.rejectionReason}
          </p>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
        {tab === "my" && (
          <>
            <button
              onClick={() => onEdit(post)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-navy-700 bg-navy-50 hover:bg-navy-100 transition"
            >
              <FaEdit size={11} /> Edit
            </button>
            <button
              onClick={() => onDelete(post, false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
            >
              <FaTrash size={11} /> Delete
            </button>
          </>
        )}

        {tab === "pending" && (
          <>
            <button
              onClick={() => onApprove(post)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
            >
              <FaCheck size={11} /> Approve
            </button>
            <button
              onClick={() => onReject(post)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition"
            >
              <FaBan size={11} /> Reject
            </button>
            <button
              onClick={() => onDelete(post, true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
            >
              <FaTrash size={11} /> Delete
            </button>
          </>
        )}

        {(tab === "approved" || tab === "rejected") && (
          <button
            onClick={() => onDelete(post, true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
          >
            <FaTrash size={11} /> Delete
          </button>
        )}
      </div>
    </div>
  </div>
);

/* ─── Post Form Modal (Create / Edit) ────────────────────────*/
const PostFormModal = ({ mode, initial, onClose, onSubmit, submitting, error }) => {
  const [content, setContent] = useState(initial?.content || "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initial?.imageUrl || null);
  const [removeExisting, setRemoveExisting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setRemoveExisting(false);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreview(null);
    setRemoveExisting(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("content", content);
    if (imageFile) formData.append("image", imageFile);
    if (mode === "edit" && removeExisting) formData.append("removeExistingImage", "true");
    onSubmit(formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-navy-800 to-navy-900 px-5 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            {mode === "create" ? "Create Community Post" : "Edit Community Post"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition">
            <FaTimes size={14} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">{error}</div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              maxLength={3000}
              placeholder="Share something with the community..."
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange outline-none resize-none transition"
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">{content.length}/3000</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Image (optional)</label>
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full max-h-56 object-cover rounded-xl border border-gray-100" />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition"
                >
                  <FaTimes size={11} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-6 cursor-pointer hover:border-brand-orange/50 hover:bg-brand-orange/5 transition">
                <FaImage className="text-gray-300" size={22} />
                <span className="text-xs text-gray-400">Click to upload an image (max 5MB)</span>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !content.trim()}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-navy-900 bg-brand-orange hover:bg-brand-orange-dark disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm flex items-center gap-2"
          >
            {submitting && <FaSpinner className="animate-spin" size={12} />}
            {mode === "create" ? "Publish Post" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Reject Modal ────────────────────────────────────────── */
const RejectModal = ({ onClose, onConfirm, submitting, error }) => {
  const [reason, setReason] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-5 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Reject Post</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition">
            <FaTimes size={14} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">{error}</div>
          )}
          <label className="block text-xs font-semibold text-gray-500">Rejection reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder="Explain why this post is being rejected..."
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none resize-none transition"
          />
          <p className="text-[10px] text-gray-400 text-right">{reason.length}/500</p>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={submitting || !reason.trim()}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm flex items-center gap-2"
          >
            {submitting && <FaSpinner className="animate-spin" size={12} />}
            Reject Post
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Admin Community Page ───────────────────────────── */
function Community() {
  const [activeTab, setActiveTab] = useState("pending");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingPost, setEditingPost] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectSubmitting, setRejectSubmitting] = useState(false);
  const [rejectError, setRejectError] = useState("");

  const [actionLoadingId, setActionLoadingId] = useState(null);

  const PAGE_SIZE = 9;

  const fetchPosts = useCallback(async (tabKey, pageNum) => {
    setLoading(true);
    try {
      const tabDef = TABS.find((t) => t.key === tabKey);
      const res = await adminCommunityApi[tabDef.fetcher](pageNum, PAGE_SIZE);
      if (res.data.success) {
        const data = res.data.data;
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      }
    } catch (err) {
      console.error("fetchPosts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(activeTab, page);
  }, [activeTab, page, fetchPosts]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setPage(0);
  };

  const refresh = () => fetchPosts(activeTab, page);

  /* ── Create / Edit ── */
  const openCreateModal = () => {
    setFormMode("create");
    setEditingPost(null);
    setFormError("");
    setShowFormModal(true);
  };

  const openEditModal = (post) => {
    setFormMode("edit");
    setEditingPost(post);
    setFormError("");
    setShowFormModal(true);
  };

  const handleFormSubmit = async (formData) => {
    setFormSubmitting(true);
    setFormError("");
    try {
      if (formMode === "create") {
        await adminCommunityApi.createPost(formData);
      } else {
        await adminCommunityApi.updatePost(editingPost.postId, formData);
      }
      setShowFormModal(false);
      refresh();
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong. Please try again.");
      console.error("post submit:", err);
    } finally {
      setFormSubmitting(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (post, isModeration) => {
    if (!window.confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    setActionLoadingId(post.postId);
    try {
      if (isModeration) {
        await adminCommunityApi.deleteAnyPost(post.postId);
      } else {
        await adminCommunityApi.deleteOwnPost(post.postId);
      }
      refresh();
    } catch (err) {
      console.error("deletePost:", err);
      alert(err.response?.data?.message || "Failed to delete post.");
    } finally {
      setActionLoadingId(null);
    }
  };

  /* ── Approve ── */
  const handleApprove = async (post) => {
    setActionLoadingId(post.postId);
    try {
      await adminCommunityApi.approvePost(post.postId);
      refresh();
    } catch (err) {
      console.error("approvePost:", err);
      alert(err.response?.data?.message || "Failed to approve post.");
    } finally {
      setActionLoadingId(null);
    }
  };

  /* ── Reject ── */
  const handleRejectConfirm = async (reason) => {
    setRejectSubmitting(true);
    setRejectError("");
    try {
      await adminCommunityApi.rejectPost(rejectTarget.postId, { rejectionReason: reason });
      setRejectTarget(null);
      refresh();
    } catch (err) {
      setRejectError(err.response?.data?.message || "Failed to reject post.");
      console.error("rejectPost:", err);
    } finally {
      setRejectSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-navy-50/40">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-navy-800 via-navy-900 to-navy-800 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-6xl mx-auto px-4 py-5 sm:py-7">
          <p className="text-xs text-navy-100/60 mb-2">
            <Link to="/admin/dashboard" className="hover:text-white transition">Dashboard</Link>
            <span className="mx-2">›</span>Community
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-1 flex items-center gap-2">
                <FaHashtag className="text-brand-orange" /> Community
              </h1>
              <p className="text-xs sm:text-sm text-navy-100/80">
                Publish updates and moderate community posts from students and instructors.
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-dark text-navy-900 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md flex-shrink-0"
            >
              <FaPlus size={11} />
              New Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 sm:py-7">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 mb-5 bg-white border border-gray-100 rounded-xl p-1.5 shadow-sm w-fit overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-navy-900 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16">
            <FaSpinner className="animate-spin text-brand-orange text-3xl mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <FaHashtag className="text-4xl text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-600 mb-1">No posts found</h3>
            <p className="text-sm text-gray-400">
              {activeTab === "my"
                ? "You haven't created any community posts yet."
                : `There are no ${activeTab} posts right now.`}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard
                  key={post.postId}
                  post={post}
                  tab={activeTab}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onApprove={handleApprove}
                  onReject={setRejectTarget}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-xs text-gray-400">
                  Page {page + 1} of {totalPages} · {totalElements} total posts
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    disabled={page === 0}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <FaChevronLeft size={11} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                    disabled={page >= totalPages - 1}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <FaChevronRight size={11} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showFormModal && (
        <PostFormModal
          mode={formMode}
          initial={editingPost}
          onClose={() => setShowFormModal(false)}
          onSubmit={handleFormSubmit}
          submitting={formSubmitting}
          error={formError}
        />
      )}

      {rejectTarget && (
        <RejectModal
          onClose={() => setRejectTarget(null)}
          onConfirm={handleRejectConfirm}
          submitting={rejectSubmitting}
          error={rejectError}
        />
      )}
    </div>
  );
}

export default Community;
