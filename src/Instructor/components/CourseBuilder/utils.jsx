import {
    MdVideoLibrary, MdMenuBook, MdPictureAsPdf,
    MdArticle, MdQuiz, MdAssignment
} from 'react-icons/md';

export const LESSON_TYPES = [
    { id: "VIDEO", label: "Video", Icon: MdVideoLibrary, color: "#22c55e", bg: "#f0fdf4" },
    { id: "TEXT", label: "Text", Icon: MdMenuBook, color: "#f97316", bg: "#fff7ed" },
    { id: "PDF", label: "PDF", Icon: MdPictureAsPdf, color: "#ef4444", bg: "#fef2f2" },
    { id: "ARTICLE", label: "Article", Icon: MdArticle, color: "#3b82f6", bg: "#eff6ff" },
    { id: "QUIZ", label: "Section Quiz", Icon: MdQuiz, color: "#8b5cf6", bg: "#f5f3ff" },
    { id: "ASSIGNMENT", label: "Assignment", Icon: MdAssignment, color: "#14b8a6", bg: "#f0fdfa" },
];
