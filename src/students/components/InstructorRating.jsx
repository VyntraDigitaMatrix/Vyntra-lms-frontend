import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { studentInstructorRatingApi } from '../auth/api';

const InstructorRating = ({ courseSlug, instructorId }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [hasRated, setHasRated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Fetch existing rating on mount
    useEffect(() => {
        if (!courseSlug || !instructorId) return;
        const fetchRating = async () => {
            try {
                const res = await studentInstructorRatingApi.getMyRating(courseSlug, instructorId);
                const data = res.data?.data;
                if (data && data.rating) {
                    setRating(data.rating);
                    setReview(data.review || "");
                    setHasRated(true);
                }
            } catch (err) {
                // If 404, it means no rating exists yet, which is fine
                if (err.response?.status !== 404) {
                    console.error("Error fetching instructor rating:", err);
                }
            }
        };
        fetchRating();
    }, [courseSlug, instructorId]);

    const handleSubmit = async () => {
        if (rating === 0) {
            setError("Please select a rating.");
            return;
        }
        setIsSubmitting(true);
        setError("");
        setMessage("");
        
        try {
            const payload = { instructorId, rating, review };
            if (hasRated) {
                await studentInstructorRatingApi.updateRating(courseSlug, payload);
                setMessage("Rating updated successfully!");
            } else {
                await studentInstructorRatingApi.submitRating(courseSlug, payload);
                setMessage("Rating submitted successfully!");
                setHasRated(true);
            }
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error("Submit rating error:", err);
            setError(err.response?.data?.message || "Failed to submit rating.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-blue-100/50">
            <h5 className="text-xs font-bold text-gray-800 mb-2">Rate this Instructor</h5>
            {error && <p className="text-[10px] text-red-500 mb-2">{error}</p>}
            {message && <p className="text-[10px] text-emerald-500 mb-2">{message}</p>}
            
            <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={`w-4 h-4 cursor-pointer transition ${star <= rating ? "text-yellow-400" : "text-gray-200 hover:text-yellow-200"}`}
                        onClick={() => setRating(star)}
                    />
                ))}
            </div>
            
            <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write a brief review about this instructor's teaching style..."
                className="w-full text-xs p-2.5 rounded-lg border border-blue-100 bg-white resize-none focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 mb-2 transition"
                rows="2"
            ></textarea>
            
            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-1.5 px-4 rounded-lg transition disabled:opacity-50"
                >
                    {isSubmitting ? "Submitting..." : hasRated ? "Update Rating" : "Submit Rating"}
                </button>
            </div>
        </div>
    );
};

export default InstructorRating;
