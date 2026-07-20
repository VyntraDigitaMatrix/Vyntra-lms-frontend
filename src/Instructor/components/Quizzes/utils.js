import { instructorQuizQuestionApi, instructorQuizOptionApi } from "../../auth/api";

export const extractList = (res) => {
    const body = res?.data?.data ?? res?.data;
    if (!body) return [];
    if (Array.isArray(body)) return body;
    if (Array.isArray(body?.content)) return body.content;
    if (typeof body === 'object' && body !== null && body.id) return [body];
    return [];
};

export const extractObj = (res) => res?.data?.data ?? res?.data ?? {};

export const resolveStatus = (raw) => {
    if (raw.quizStatus === "ARCHIVED" || raw.status === "ARCHIVED") return "archived";
    if (raw.published === true ||
        raw.isPublished === true ||
        raw.quizStatus === "PUBLISHED" ||
        raw.status === "PUBLISHED" ||
        raw.status === "ACTIVE") return "active";
    return "draft";
};

export const normalizeQuiz = (raw, course) => {
    const status = resolveStatus(raw);
    const published = status === "active";
    const questionCount =
        raw.questionCount ?? raw.totalQuestions ?? raw.noOfQuestions ??
        raw.questionsCount ?? (Array.isArray(raw.questions) ? raw.questions.length : null) ?? 0;
    const duration = raw.durationInMinutes ?? raw.duration ?? raw.durationMinutes ?? raw.timeLimit ?? 0;
    const title = raw.title ?? raw.quizTitle ?? raw.name ?? "Untitled Quiz";
    const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    return {
        id: raw.id ?? raw.quizId,
        slug: raw.slug ?? raw.quizSlug ?? generatedSlug ?? raw.id ?? raw.quizId,
        title: title,
        description: raw.description ?? raw.quizDescription ?? "",
        course: course?.title ?? course?.name ?? raw.courseTitle ?? "—",
        courseId: course?.id ?? raw.courseId ?? null,
        courseSlug: course?.slug ?? course?.courseSlug ?? raw.courseSlug ?? null,
        moduleId: raw.moduleId ?? raw.module_id ?? raw.module?.id ?? raw.module?.moduleId ?? null,
        moduleSlug: raw.moduleSlug ?? raw.module?.slug ?? raw.module?.moduleSlug ?? null,
        moduleName: raw.moduleTitle ?? raw.moduleName ?? raw.module?.title ?? raw.module?.name ?? null,
        lessonId: raw.lessonId ?? raw.lesson_id ?? raw.lesson?.id ?? raw.lesson?.lessonId ?? null,
        lessonSlug: raw.lessonSlug ?? raw.lesson?.slug ?? raw.lesson?.lessonSlug ?? null,
        lessonName: raw.lessonTitle ?? raw.lessonName ?? raw.lesson?.title ?? raw.lesson?.name ?? null,
        type: (raw.type || raw.quizType || "").toUpperCase() || (
            (raw.lessonId || raw.lessonSlug || raw.lesson) ? "LESSON" :
                (raw.moduleId || raw.moduleSlug || raw.module) ? "MODULE" :
                    "COURSE"
        ),
        questions: questionCount,
        duration,
        attempts: raw.attemptCount ?? raw.totalAttempts ?? 0,
        avgScore: raw.avgScore ?? raw.averageScore ?? 0,
        published,
        status,
        maxAttempts: raw.maxAttempts ?? 0,
        totalStudents: raw.totalStudents ?? course?.enrolledStudents ?? course?.studentsCount ?? 0,
        totalMarks: raw.totalMarks ?? raw.maxScore ?? 30,
        passingScore: raw.passingMarks ?? raw.passingScore ?? 18,
        resumeAllowed: raw.resumeAllowed ?? true,
        autoSubmitOnDisconnect: raw.autoSubmitOnDisconnect ?? true,
        _raw: raw,
    };
};

export const parseOptions = (rawOpts) => {
    if (!Array.isArray(rawOpts) || rawOpts.length === 0) return [];
    return [...rawOpts].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
};

export const parseQuestion = (q) => {
    const opts = parseOptions(q.options ?? q.optionList ?? []);
    return {
        id: q.id ?? q.questionId,
        question: q.questionText ?? q.question ?? q.text ?? "",
        explanation: q.explanation ?? q.explanationText ?? "",
        marks: q.marks ?? q.marksPerQuestion ?? 1,
        sortOrder: q.sortOrder ?? 0,
        optionObjects: opts,
    };
};

export const fetchQuestionsWithOptions = async (quizSlug) => {
    const res = await instructorQuizQuestionApi.getQuizQuestions(quizSlug);
    const body = res?.data?.data ?? res?.data;
    const raw = Array.isArray(body) ? body
        : Array.isArray(body?.content) ? body.content
            : Array.isArray(body?.questions) ? body.questions
                : [];

    const questions = await Promise.all(raw.map(async (q) => {
        let parsed = parseQuestion(q);
        if (parsed.optionObjects.length === 0 && parsed.id) {
            try {
                const optRes = await instructorQuizOptionApi.getQuestionOptions(parsed.id);
                const optBody = optRes?.data?.data ?? optRes?.data;
                const optList = Array.isArray(optBody) ? optBody
                    : Array.isArray(optBody?.content) ? optBody.content : [];
                parsed = { ...parsed, optionObjects: parseOptions(optList) };
            } catch {
            }
        }
        return parsed;
    }));

    return questions.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
};

export const blankQuestion = () => ({ question: "", explanation: "", marks: 1 });
