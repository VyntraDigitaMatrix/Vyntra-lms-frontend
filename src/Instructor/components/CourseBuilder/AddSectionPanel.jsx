import React, { useState } from "react";
import RightPanel from "./RightPanel";

function AddSectionPanel({ onClose, onSave, editData }) {
    const [title, setTitle] = useState(editData?.title || "");

    return (
        <RightPanel
            title={editData ? "Edit Section" : "Add Section"}
            subtitle="Create a course section"
            onClose={onClose}
            onSave={() => onSave(title)}
            saveLabel={editData ? "UPDATE SECTION" : "CREATE SECTION"}
            saveDisabled={!title.trim()}
        >
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Section Title
                </label>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter section title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
            </div>
        </RightPanel>
    );
}

export default AddSectionPanel;
