import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  instructorCourseApi,
  instructorQuizApi,
  instructorQuizAnalyticsApi,
} from "../auth/api";
import {
  FaChartBar, FaListOl, FaUsers, FaTrophy, FaCheckCircle,
  FaTimesCircle, FaSpinner, FaChevronLeft, FaChevronRight,
  FaEye, FaTimes, FaClock, FaMedal, FaExclamationCircle,
  FaBookOpen, FaQuestionCircle,
} from "react-icons/fa";

const TABS = [
  { key: "analytics", label: "Quiz Analytics", icon: <FaChartBar size={11} /> },
  { key: "questions", label: "Question Analytics", icon: <FaQuestionCircle size={11} /> },
  { key: "students", label: "Student Results", icon: <FaUsers size={11} /> },
  { key: "leaderboard", label: "Leaderboard", icon: <FaTrophy size={11} /> },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  // ── Course / Quiz selection ──
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState("");

  const [quizzes, setQuizzes] = useState([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);
  const [selectedQuizSlug, setSelectedQuizSlug] = useState("");

  // ── Quiz Analytics ──
  const [quizAnalytics, setQuizAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");

  // ── Question Analytics ──
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsPage, setQuestionsPage] = useState(0);
  const [questionsTotalPages, setQuestionsTotalPages] = useState(0);

  // ── Student Results ──
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsPage, setStudentsPage] = useState(0);
  const [studentsTotalPages, setStudentsTotalPages] = useState(0);

  // ── Attempt review modal ──
  const [selectedAttemptId, setSelectedAttemptId] = useState(null);
  const [attemptDetail, setAttemptDetail] = useState(null);
  const [attemptLoading, setAttemptLoading] = useState(false);

  // ── Leaderboard (course-level, independent of quiz selection) ──
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardPage, setLeaderboardPage] = useState(0);
  const [leaderboardTotalPages, setLeaderboardTotalPages] = useState(0);

  const [toast, setToast] = useState({ text: "", type: "" });
  const notify = (text, type = "error") => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: "", type: "" }), 3500);
  };

  /* ── Load courses on mount ── */
  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        const res = await instructorCourseApi.getInstructorCourses(0, 200);
        if (res.data?.success) {
          const list = res.data.data?.content || [];
          setCourses(list);
          if (list.length > 0) setSelectedCourseSlug(list[0].slug);
        }
      } catch (err) {
        notify(err.response?.data?.message || "Failed to load courses");
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  /* ── Load quizzes whenever course changes ── */
  useEffect(() => {
    if (!selectedCourseSlug) return;
    const fetchQuizzes = async () => {
      setQuizzesLoading(true);
      setQuizzes([]);
      setSelectedQuizSlug("");
      try {
        const res = await instructorQuizApi.getAllQuizzesByCourse(selectedCourseSlug, 0, 100);
        if (res.data?.success) {
          const list = res.data.data?.content || [];
          setQuizzes(list);
          if (list.length > 0) setSelectedQuizSlug(list[0].slug || list[0].quizSlug);
        }
      } catch (err) {
        notify(err.response?.data?.message || "Failed to load quizzes");
      } finally {
        setQuizzesLoading(false);
      }
    };
    fetchQuizzes();
  }, [selectedCourseSlug]);

  /* ── Quiz Analytics ── */
  const fetchQuizAnalytics = useCallback(async () => {
    if (!selectedQuizSlug) return;
    setAnalyticsLoading(true);
    setAnalyticsError("");
    try {
      const res = await instructorQuizAnalyticsApi.getQuizAnalytics(selectedQuizSlug);
      if (res.data?.success) setQuizAnalytics(res.data.data);
    } catch (err) {
      setAnalyticsError(err.response?.data?.message || "Failed to load quiz analytics");
      setQuizAnalytics(null);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [selectedQuizSlug]);

  useEffect(() => {
    if (activeTab === "analytics") fetchQuizAnalytics();
  }, [activeTab, fetchQuizAnalytics]);

  /* ── Question Analytics ── */
  const fetchQuestions = useCallback(async (page = 0) => {
    if (!selectedQuizSlug) return;
    setQuestionsLoading(true);
    try {
      const res = await instructorQuizAnalyticsApi.getQuestionAnalytics(selectedQuizSlug, page, 20);
      if (res.data?.success) {
        setQuestions(res.data.data?.content || []);
        setQuestionsTotalPages(res.data.data?.totalPages || 0);
        setQuestionsPage(page);
      }
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load question analytics");
    } finally {
      setQuestionsLoading(false);
    }
  }, [selectedQuizSlug]);

  useEffect(() => {
    if (activeTab === "questions") fetchQuestions(0);
  }, [activeTab, fetchQuestions]);

  /* ── Student Results ── */
  const fetchStudents = useCallback(async (page = 0) => {
    if (!selectedQuizSlug) return;
    setStudentsLoading(true);
    try {
      const res = await instructorQuizAnalyticsApi.getQuizStudents(selectedQuizSlug, page, 20);
      if (res.data?.success) {
        setStudents(res.data.data?.content || []);
        setStudentsTotalPages(res.data.data?.totalPages || 0);
        setStudentsPage(page);
      }
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load student results");
    } finally {
      setStudentsLoading(false);
    }
  }, [selectedQuizSlug]);

  useEffect(() => {
    if (activeTab === "students") fetchStudents(0);
  }, [activeTab, fetchStudents]);

  /* ── Attempt review ── */
  const openAttempt = async (attemptId) => {
    setSelectedAttemptId(attemptId);
    setAttemptLoading(true);
    setAttemptDetail(null);
    try {
      const res = await instructorQuizAnalyticsApi.getAttemptDetail(attemptId);
      if (res.data?.success) setAttemptDetail(res.data.data);
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load attempt review");
      setSelectedAttemptId(null);
    } finally {
      setAttemptLoading(false);
    }
  };
  const closeAttempt = () => { setSelectedAttemptId(null); setAttemptDetail(null); };

  /* ── Leaderboard (course-scoped) ── */
  const fetchLeaderboard = useCallback(async (page = 0) => {
    if (!selectedCourseSlug) return;
    setLeaderboardLoading(true);
    try {
      const res = await instructorQuizAnalyticsApi.getCourseLeaderboard(selectedCourseSlug, page, 20);
      if (res.data?.success) {
        setLeaderboard(res.data.data?.content || []);
        setLeaderboardTotalPages(res.data.data?.totalPages || 0);
        setLeaderboardPage(page);
      }
    } catch (err) {
      notify(err.response?.data?.message || "Failed to load leaderboard");
    } finally {
      setLeaderboardLoading(false);
    }
  }, [selectedCourseSlug]);

  useEffect(() => {
    if (activeTab === "leaderboard") fetchLeaderboard(0);
  }, [activeTab, fetchLeaderboard]);

  return (
    <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-[#f7f8fc] font-sans">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Breadcrumbs */}
        <div className="mb-3">
          <Link to="/instructor/dashboard" className="text-sm text-slate-400 hover:text-[#043573] transition">
            Dashboard
          </Link>
          <span className="mx-2 text-slate-400">&gt;</span>
          <span className="text-sm font-semibold text-slate-800">Reports</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Reports</h1>
            <p className="text-sm text-slate-500 mt-1">
              Quiz performance, question breakdowns, and student results
            </p>
          </div>
        </div>

        {/* Toast */}
        {toast.text && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold ${
            toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
          }`}>
            {toast.type === "error" ? <FaExclamationCircle /> : <FaCheckCircle />}
            {toast.text}
          </div>
        )}

        {/* Course / Quiz selectors */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Course" icon={<FaBookOpen size={10} />}>
              {coursesLoading ? (
                <SelectSkeleton />
              ) : (
                <select
                  value={selectedCourseSlug}
                  onChange={e => setSelectedCourseSlug(e.target.value)}
                  className="select-base"
                >
                  {courses.length === 0 && <option value="">No courses found</option>}
                  {courses.map(c => (
                    <option key={c.id} value={c.slug}>{c.title}</option>
                  ))}
                </select>
              )}
            </Field>

            <Field label="Quiz" icon={<FaQuestionCircle size={10} />}>
              {quizzesLoading ? (
                <SelectSkeleton />
              ) : (
                <select
                  value={selectedQuizSlug}
                  onChange={e => setSelectedQuizSlug(e.target.value)}
                  disabled={quizzes.length === 0}
                  className="select-base"
                >
                  {quizzes.length === 0 && <option value="">No quizzes for this course</option>}
                  {quizzes.map(q => (
                    <option key={q.id || q.slug || q.quizSlug} value={q.slug || q.quizSlug}>
                      {q.title || q.quizTitle}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1 overflow-x-auto w-full sm:w-fit">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap
                ${activeTab === key
                  ? "bg-[#043573] text-white shadow-sm"
                  : "text-slate-500 hover:text-[#043573] hover:bg-blue-50"}`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* ══════════ QUIZ ANALYTICS TAB ══════════ */}
        {activeTab === "analytics" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
            <SectionHeader icon={<FaChartBar />} title="Quiz Analytics" subtitle="Overall performance summary for this quiz" />

            {!selectedQuizSlug ? (
              <EmptyState icon={<FaChartBar />} text="Select a course and quiz to view analytics" />
            ) : analyticsLoading ? (
              <LoadingBlock />
            ) : analyticsError ? (
              <ErrorBlock text={analyticsError} />
            ) : quizAnalytics ? (
              <>
                <p className="text-sm font-semibold text-slate-700 mt-4 mb-4">{quizAnalytics.quizTitle}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard icon="📝" label="Total Attempts" value={quizAnalytics.totalAttempts} />
                  <StatCard icon="✅" label="Completed" value={quizAnalytics.completedAttempts} />
                  <StatCard icon="🏆" label="Passed" value={quizAnalytics.passedAttempts} color="text-emerald-600" />
                  <StatCard icon="❌" label="Failed" value={quizAnalytics.failedAttempts} color="text-red-500" />
                  <StatCard icon="📊" label="Average Score" value={Number(quizAnalytics.averageScore || 0).toFixed(1)} />
                  <StatCard icon="⬆️" label="Highest Score" value={quizAnalytics.highestScore} color="text-emerald-600" />
                  <StatCard icon="⬇️" label="Lowest Score" value={quizAnalytics.lowestScore} color="text-red-500" />
                  <StatCard icon="🎯" label="Pass %" value={`${Number(quizAnalytics.passPercentage || 0).toFixed(1)}%`} />
                </div>
              </>
            ) : (
              <EmptyState icon={<FaChartBar />} text="No analytics available for this quiz" />
            )}
          </div>
        )}

        {/* ══════════ QUESTION ANALYTICS TAB ══════════ */}
        {activeTab === "questions" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
            <SectionHeader icon={<FaQuestionCircle />} title="Question Analytics" subtitle="Accuracy breakdown per question" />

            {!selectedQuizSlug ? (
              <EmptyState icon={<FaQuestionCircle />} text="Select a course and quiz to view question analytics" />
            ) : questionsLoading ? (
              <LoadingBlock />
            ) : questions.length === 0 ? (
              <EmptyState icon={<FaQuestionCircle />} text="No question data available" />
            ) : (
              <div className="mt-4 space-y-2.5">
                {questions.map(q => {
                  const accuracy = Number(q.accuracyPercentage || 0);
                  const barColor = accuracy >= 70 ? "bg-emerald-500" : accuracy >= 40 ? "bg-amber-500" : "bg-red-500";
                  return (
                    <div key={q.questionId} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-sm font-semibold text-slate-800 flex-1">{q.questionText}</p>
                        <span className="text-xs font-black text-slate-700 flex-shrink-0">{accuracy.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(accuracy, 100)}%` }} />
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500">
                        <span>{q.totalAttempts || 0} attempts</span>
                        <span className="flex items-center gap-1 text-emerald-600"><FaCheckCircle size={9} /> {q.correctAttempts || 0} correct</span>
                        <span className="flex items-center gap-1 text-red-500"><FaTimesCircle size={9} /> {q.wrongAttempts || 0} wrong</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Pagination page={questionsPage} totalPages={questionsTotalPages} onChange={fetchQuestions} />
          </div>
        )}

        {/* ══════════ STUDENT RESULTS TAB ══════════ */}
        {activeTab === "students" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
            <SectionHeader icon={<FaUsers />} title="Student Results" subtitle="Individual attempt results for this quiz" />

            {!selectedQuizSlug ? (
              <EmptyState icon={<FaUsers />} text="Select a course and quiz to view student results" />
            ) : studentsLoading ? (
              <LoadingBlock />
            ) : students.length === 0 ? (
              <EmptyState icon={<FaUsers />} text="No attempts recorded yet" />
            ) : (
              <div className="mt-4 space-y-2.5">
                {students.map(s => (
                  <div key={s.attemptId} className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#043573] flex items-center justify-center text-xs font-black flex-shrink-0">
                      {s.studentName?.split(" ").map(n => n?.[0]).join("").toUpperCase().slice(0, 2) || "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">{s.studentName}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap text-[11px] text-slate-500">
                        <span>Attempt #{s.attemptNumber}</span>
                        <span>{s.obtainedMarks}/{s.totalMarks} marks</span>
                        <span>{s.correctAnswers} correct</span>
                        {s.submittedAt && (
                          <span className="flex items-center gap-1"><FaClock size={8} /> {new Date(s.submittedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <PassFailPill passed={s.passed} status={s.status} />
                      <button
                        onClick={() => openAttempt(s.attemptId)}
                        title="View attempt"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-[#043573] transition"
                      >
                        <FaEye size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Pagination page={studentsPage} totalPages={studentsTotalPages} onChange={fetchStudents} />
          </div>
        )}

        {/* ══════════ LEADERBOARD TAB ══════════ */}
        {activeTab === "leaderboard" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
            <SectionHeader icon={<FaTrophy />} title="Course Leaderboard" subtitle="Top performers across all quizzes in this course" />

            {!selectedCourseSlug ? (
              <EmptyState icon={<FaTrophy />} text="Select a course to view its leaderboard" />
            ) : leaderboardLoading ? (
              <LoadingBlock />
            ) : leaderboard.length === 0 ? (
              <EmptyState icon={<FaTrophy />} text="No leaderboard data yet" />
            ) : (
              <div className="mt-4 space-y-2">
                {leaderboard.map(entry => (
                  <div key={entry.studentId} className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <RankBadge rank={entry.rank} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">{entry.studentName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{entry.quizzesPassed} quizzes passed</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-black text-slate-800">{entry.obtainedMarks}/{entry.totalMarks}</p>
                      <p className="text-[11px] text-slate-500">{Number(entry.percentage || 0).toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Pagination page={leaderboardPage} totalPages={leaderboardTotalPages} onChange={fetchLeaderboard} />
          </div>
        )}

      </div>

      {/* ══════════ ATTEMPT REVIEW MODAL ══════════ */}
      {selectedAttemptId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeAttempt}>
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-base font-black text-slate-900">Attempt Review</h2>
                {attemptDetail && (
                  <p className="text-xs text-slate-400 mt-0.5">{attemptDetail.studentName} — {attemptDetail.quizTitle}</p>
                )}
              </div>
              <button onClick={closeAttempt} className="text-slate-400 hover:text-slate-600 transition text-lg leading-none">
                <FaTimes />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {attemptLoading ? (
                <LoadingBlock />
              ) : attemptDetail ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                    <StatCard icon="🎯" label="Score" value={`${attemptDetail.obtainedMarks}/${attemptDetail.totalMarks}`} small />
                    <StatCard icon="✅" label="Correct" value={`${attemptDetail.correctAnswers}/${attemptDetail.totalQuestions}`} small />
                    <StatCard icon={attemptDetail.passed ? "🏆" : "❌"} label="Result" value={attemptDetail.passed ? "Passed" : "Failed"} color={attemptDetail.passed ? "text-emerald-600" : "text-red-500"} small />
                    <StatCard icon="🔁" label="Attempt #" value={attemptDetail.attemptNumber} small />
                  </div>

                  <div className="space-y-3">
                    {(attemptDetail.questions || []).map((q, idx) => (
                      <div key={q.questionId} className={`p-3.5 rounded-xl border ${q.correct ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"}`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="text-sm font-semibold text-slate-800 flex-1">{idx + 1}. {q.questionText}</p>
                          {q.correct ? <FaCheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={14} /> : <FaTimesCircle className="text-red-500 flex-shrink-0 mt-0.5" size={14} />}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400">Selected: </span>
                            <span className={q.correct ? "text-emerald-700 font-semibold" : "text-red-600 font-semibold"}>{q.selectedOption || "—"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Correct answer: </span>
                            <span className="text-slate-700 font-semibold">{q.correctOption}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1.5">{q.marksAwarded}/{q.questionMarks} marks</p>
                        {q.explanation && (
                          <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">{q.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState icon={<FaEye />} text="Could not load attempt details" />
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .select-base{width:100%;border:1px solid #e5e7eb;border-radius:0.75rem;padding:0.625rem 1rem;font-size:0.875rem;background:#f9fafb;outline:none;transition:all .15s}
        .select-base:focus{background:#fff;border-color:[#043573];box-shadow:0 0 0 3px rgba(4,53,115,0.1)}
      `}</style>
    </div>
  );
};

/* ══════════════════════════════════════════
   Sub-components
══════════════════════════════════════════ */
const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#043573] text-sm flex-shrink-0">{icon}</div>
    <div>
      <h2 className="text-sm font-black text-slate-900">{title}</h2>
      {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const Field = ({ label, icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
      {icon} {label}
    </label>
    {children}
  </div>
);

const SelectSkeleton = () => (
  <div className="h-[42px] rounded-xl bg-slate-100 animate-pulse" />
);

const StatCard = ({ icon, label, value, color = "text-slate-900", small = false }) => (
  <div className={`rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 ${small ? "p-2.5" : "p-3.5"}`}>
    <div className={small ? "text-base" : "text-lg"}>{icon}</div>
    <div className="min-w-0">
      <p className={`font-black leading-none ${color} ${small ? "text-sm" : "text-lg"}`}>{value}</p>
      <p className="text-[10px] text-slate-400 font-medium mt-1 truncate">{label}</p>
    </div>
  </div>
);

const PassFailPill = ({ passed, status }) => {
  if (passed === true) return <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">Passed</span>;
  if (passed === false) return <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 rounded-full px-2 py-0.5">Failed</span>;
  return <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5">{status || "—"}</span>;
};

const RankBadge = ({ rank }) => {
  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
  if (medals[rank]) {
    return <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0">{medals[rank]}</div>;
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-black flex-shrink-0">
      #{rank}
    </div>
  );
};

const LoadingBlock = () => (
  <div className="py-10 text-center">
    <div className="w-7 h-7 border-4 border-[#043573] border-t-transparent rounded-full animate-spin mx-auto" />
  </div>
);

const ErrorBlock = ({ text }) => (
  <div className="py-10 text-center">
    <FaExclamationCircle className="text-3xl text-red-300 mx-auto mb-2" />
    <p className="text-sm text-red-500">{text}</p>
  </div>
);

const EmptyState = ({ icon, text }) => (
  <div className="py-10 text-center">
    <div className="text-3xl text-slate-200 mx-auto mb-2 flex justify-center">{icon}</div>
    <p className="text-sm text-slate-400">{text}</p>
  </div>
);

const Pagination = ({ page, totalPages, onChange }) => {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-5">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="w-8 h-8 rounded-lg bg-white border border-slate-200 disabled:opacity-40 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition"
      >
        <FaChevronLeft className="text-[10px] text-slate-600" />
      </button>
      <span className="text-xs font-semibold text-slate-500 px-2">
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="w-8 h-8 rounded-lg bg-white border border-slate-200 disabled:opacity-40 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition"
      >
        <FaChevronRight className="text-[10px] text-slate-600" />
      </button>
    </div>
  );
};

export default Reports;