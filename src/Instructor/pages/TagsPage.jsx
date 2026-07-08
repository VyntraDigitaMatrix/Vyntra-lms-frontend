import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import { instructorCourseApi } from "../auth/api";

const TagsPage = ({ data, setData }) => {
    const { courseSlug } = useParams();
    const [input, setInput] = useState("");

    const addTag = () => {
        const tag = input.trim();

        if (!tag) return;

        // Prevent duplicates
        if ((data.tags || []).includes(tag)) {
            setInput("");
            return;
        }

        setData(prev => ({
            ...prev,
            tags: [...(prev.tags || []), tag]
        }));

        setInput("");
    };

    const handleDeleteTag = async (tagToDelete) => {
        // Optimistic UI update: filter out locally first
        setData(prev => ({
            ...prev,
            tags: (prev.tags || []).filter(t => t !== tagToDelete)
        }));

        if (courseSlug) {
            try {
                await instructorCourseApi.deleteTag(courseSlug, tagToDelete);
            } catch (err) {
                console.warn("Failed to delete tag from server (it might not be saved yet):", err);
            }
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Tags</h2>
            <p className="text-sm text-gray-500 mb-8">Add course tags to make your course easy to discover</p>
            <div className="flex gap-2 mb-4">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Type a tag and press Enter"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
                />
                <button onClick={addTag}
                    className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition">
                    <MdAdd className="text-lg" />
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {(data.tags || []).map((tag, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-full text-sm text-violet-700 font-medium">
                        {tag}
                        <button onClick={() => handleDeleteTag(tag)}
                            className="text-violet-400 hover:text-violet-700 text-base leading-none">&times;</button>
                    </span>
                ))}
                {!(data.tags?.length) && <p className="text-sm text-gray-400">No tags added yet.</p>}
            </div>
        </div>
    );
}

export default TagsPage;