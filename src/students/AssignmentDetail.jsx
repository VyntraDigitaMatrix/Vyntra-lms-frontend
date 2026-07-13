import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studentAssignmentApi } from "./auth/api";
import { extractArray, buildSubmissionMap, transformAssignment } from "./components/AssignmentShared";
import PendingDetail from "./components/PendingDetail";
import SubmittedDetail from "./components/SubmittedDetail";
import GradedDetail from "./components/GradedDetail";
import { FaSpinner, FaExclamationCircle } from "react-icons/fa";

const AssignmentDetail = () => {
  const { courseId, moduleId, assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssignment = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [detailRes, subsRes] = await Promise.all([
        studentAssignmentApi.getAssignmentById(assignmentId),
        studentAssignmentApi.getSubmissions(),
      ]);

      const detail = detailRes.data?.data ?? detailRes.data;
      const subMap = buildSubmissionMap(extractArray(subsRes.data));

      const merged = transformAssignment(
        { ...detail, courseId, moduleId: detail.moduleId ?? moduleId },
        subMap
      );

      setAssignment({ ...merged, id: merged.id || assignmentId, courseId, moduleId });
    } catch (err) {
      console.error("Error loading assignment:", err);
      setError("Could not load this assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [assignmentId, courseId, moduleId]);

  useEffect(() => { loadAssignment(); }, [loadAssignment]);

  const onBack = () => navigate(-1);

  const handleSubmitAssignment = async (id, submissionText, file) => {
    const slugOrId = assignment?.slug ?? assignment?.assignmentSlug ?? id;
    try {
      await studentAssignmentApi.submitAssignment(slugOrId, submissionText, file);
      await loadAssignment();
    } catch (err) {
      console.error("Submission error:", err.response?.data);
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  const handleResubmit = (a) => setAssignment({ ...a, status: "Pending" });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-600 text-3xl mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <div className="text-center">
          <FaExclamationCircle className="text-red-500 text-3xl mx-auto mb-3" />
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button onClick={loadAssignment} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!assignment) return null;
  if (assignment.status === "Submitted")
    return <SubmittedDetail assignment={assignment} onBack={onBack} onResubmit={handleResubmit} allowResubmission={assignment.allowResubmission} />;
  if (assignment.status === "Graded")
    return <GradedDetail assignment={assignment} onBack={onBack} />;
  return <PendingDetail assignment={assignment} onBack={onBack} onSubmit={handleSubmitAssignment} />;
};

export default AssignmentDetail;