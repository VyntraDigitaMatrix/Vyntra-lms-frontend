
export const colorPalette = [
    { bg: "bg-[#f3ebff]", text: "text-[#7c3aed]", accent: "#7c3aed", light: "#f3ebff" },
    { bg: "bg-[#eaf2ff]", text: "text-[#2563eb]", accent: "#2563eb", light: "#eaf2ff" },
    { bg: "bg-[#fff5e7]", text: "text-[#f59e0b]", accent: "#f59e0b", light: "#fff5e7" },
    { bg: "bg-[#edf6ff]", text: "text-[#3b82f6]", accent: "#3b82f6", light: "#edf6ff" },
    { bg: "bg-[#eafaf0]", text: "text-[#16a34a]", accent: "#16a34a", light: "#eafaf0" },
];
export const colorFor = (id) => colorPalette[(Number(id) || 0) % colorPalette.length];

/* Safely unwrap any API envelope shape */
export const unwrap = (res) => {
    const d = res?.data;
    if (!d) return null;
    if (d?.data?.content !== undefined) return d.data;
    if (d?.data !== undefined) return d.data;
    return d;
};

export const mergeNonNull = (primary, fallback) => {
    const out = { ...(fallback || {}) };
    Object.entries(primary || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null) out[k] = v;
    });
    return out;
};

export const extractScoreData = (obj) => {
    if (!obj || typeof obj !== "object") return null;

    let pct =
        obj.percentage ?? obj.percent ?? obj.scorePercentage ?? obj.scorePercent ??
        obj.score ?? obj.finalScore ?? undefined;

    if (pct === undefined || pct === null) {
        if (obj.marksObtained != null && obj.totalMarks) pct = (obj.marksObtained / obj.totalMarks) * 100;
        else if (obj.obtainedMarks != null && obj.totalMarks) pct = (obj.obtainedMarks / obj.totalMarks) * 100;
        else if (obj.totalScore != null && obj.maxScore) pct = (obj.totalScore / obj.maxScore) * 100;
        else if (obj.correctCount != null && obj.totalQuestions) pct = (obj.correctCount / obj.totalQuestions) * 100;
        else if (obj.correctAnswers != null && obj.totalQuestions) pct = (obj.correctAnswers / obj.totalQuestions) * 100;
    }

    if (pct === undefined || pct === null || Number.isNaN(pct)) return null;

    const correct =
        obj.correctCount ?? obj.correctAnswers ?? obj.correct ?? 0;

    const totalQuestions =
        obj.totalQuestions ??
        obj.questionCount ??
        obj.totalQuestionCount ??
        0;

    const wrong =
        obj.wrongCount ??
        obj.incorrectAnswers ??
        obj.incorrectCount ??
        obj.wrong ??
        Math.max(0, totalQuestions - correct);

    const skipped =
        obj.skippedCount ??
        obj.unanswered ??
        obj.unattempted ??
        obj.skipped ??
        0;

    const timeTaken = obj.timeTaken ?? obj.durationTaken ?? obj.timeSpent ?? obj.timeTakenSeconds ?? null;
    const passingPct = obj.passingPercentage ?? obj.passPercentage ?? 70;
    const passed = obj.passed ?? obj.isPassed ?? (pct >= passingPct);

    return { percentage: Math.round(pct), correct, wrong, skipped, timeTaken, passed };
};

export const buildAttemptMap = (attempts) => {
    const rank = (s) => {
        const up = (s || "").toString().toUpperCase();
        if (["IN_PROGRESS", "STARTED", "ONGOING", "RUNNING"].includes(up)) return 2;
        if (["SUBMITTED", "COMPLETED", "GRADED", "FINISHED"].includes(up)) return 1;
        return 0;
    };
    const map = {};
    (attempts || []).forEach((a) => {
        const qId = a.quizId ?? a.quiz?.id ?? a.quiz_id ?? a.quizID;
        if (qId === undefined || qId === null) return;
        const existing = map[qId];
        if (!existing) { map[qId] = a; return; }
        const newRank = rank(a.status || a.attemptStatus);
        const oldRank = rank(existing.status || existing.attemptStatus);
        if (newRank > oldRank) { map[qId] = a; return; }
        if (newRank === oldRank) {
            const newer = new Date(a.updatedAt || a.submittedAt || a.startedAt || a.createdAt || 0).getTime() || a.id || 0;
            const older = new Date(existing.updatedAt || existing.submittedAt || existing.startedAt || existing.createdAt || 0).getTime() || existing.id || 0;
            if (newer >= older) map[qId] = a;
        }
    });
    return map;
};

export const deriveStatus = (quiz) => {
    if (quiz.startsAt && new Date(quiz.startsAt) > new Date()) return "Upcoming";
    if (quiz.canResume) return "In Progress";
    if (quiz.attempted) return "Completed";
    return "Not Attempted";
};