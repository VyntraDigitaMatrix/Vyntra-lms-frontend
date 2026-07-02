import React from "react";
import {
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange
}) => {

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        let start = Math.max(
            1,
            currentPage - Math.floor(maxVisible / 2)
        );

        let end = Math.min(
            totalPages,
            start + maxVisible - 1
        );

        if (end - start < maxVisible - 1) {
            start = Math.max(
                1,
                end - maxVisible + 1
            );
        }

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push("...");
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-6">

            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <FaChevronLeft className="text-xs" />
            </button>

            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() =>
                        typeof page === "number" &&
                        onPageChange(page)
                    }
                    disabled={page === "..."}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${page === currentPage
                            ? "bg-purple-600 text-white"
                            : page === "..."
                                ? "cursor-default text-gray-400"
                                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <FaChevronRight className="text-xs" />
            </button>

        </div>
    );
};

export default Pagination;