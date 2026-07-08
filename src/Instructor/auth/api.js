import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://98.93.255.158:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("instructor_accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("instructor_refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/instructor/auth/refresh`, { refreshToken });
          if (response.data?.data) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            localStorage.setItem("instructor_accessToken", accessToken);
            if (newRefreshToken) localStorage.setItem("instructor_refreshToken", newRefreshToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Instructor token refresh failed:", refreshError);
        localStorage.removeItem("instructor_accessToken");
        localStorage.removeItem("instructor_refreshToken");
        window.location.href = "/InstructorLogin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const instructorAuth = {
  login: (data) => api.post("/api/instructor/auth/login", data),
  verifyOtp: (data) => api.post("/api/instructor/auth/verify-otp", data),
  getProfile: () => api.get("/api/instructor/auth/Profile"),
  changePassword: (data) => api.post("/api/instructor/auth/change-password", data),
  forgotPassword: (data) => api.post("/api/instructor/auth/forgot-password", data),
  resetPassword: (data) => api.post("/api/instructor/auth/reset-password", data),
  logout: () => api.post("/api/instructor/auth/logout"),
};

export const instructorCourseApi = {
  createCourse: (data) =>
    api.post("/api/instructor/courses", data),

  getInstructorCourses: (page = 0, size = 10) =>
    api.get(`/api/instructor/courses?page=${page}&size=${size}`),

  getInstructorCourseBySlug: (slug) =>
    api.get(`/api/instructor/courses/${slug}`),

  // Basic Information
  updateBasicInfo: (slug, data) =>
    api.put(`/api/instructor/courses/${slug}/basic-info`, data),

  updateInstructors: (slug, data) =>
    api.put(`/api/instructor/courses/${slug}/instructors`, data),

  // Pricing
  updatePricing: (slug, data) =>
    api.put(`/api/instructor/courses/${slug}/pricing`, data),

  // Tags
  updateTags: (slug, data) =>
    api.put(`/api/instructor/courses/${slug}/tags`, data),

  deleteTag: (slug, tagId) =>
    api.delete(`/api/instructor/courses/${slug}/tags/${tagId}`),

  // Features
  updateFeatures: (slug, data) =>
    api.put(`/api/instructor/courses/${slug}/features`, data),

  // FAQs
  updateFaqs: (slug, data) =>
    api.put(`/api/instructor/courses/${slug}/faqs`, data),

  // Course Content
  updateCourseContent: (slug, formData) =>
    api.put(
      `/api/instructor/courses/${slug}/content`,
      formData
    ),

  updateBasicInfoMultipart: (slug, formData) =>
    api.put(
      `/api/instructor/courses/${slug}/basic-info`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    ),

  getAvailableInstructors: (page = 0, size = 100) =>
    api.get(`/api/instructor/instructors?page=${page}&size=${size}`),

  // PUT instructors on a course (already in your api.js — keep this)
  updateCourseInstructors: (courseSlug, data) =>
    api.put(`/api/instructor/courses/${courseSlug}/instructors`, data),

  publishCourse: (slug) =>
    api.post(`/api/instructor/courses/${slug}/publish`),

  archiveCourse: (slug) =>
    api.post(`/api/instructor/courses/${slug}/archive`),

  requestCoursePublish: (slug) =>
    api.post(`/api/instructor/courses/${slug}/request-publish`),
};

export const instructorModuleApi = {
  createModule: (courseSlug, data) =>
    api.post(`/api/instructor/modules/courses/${courseSlug}`, data),
  updateModule: (moduleSlug, data) =>
    api.put(`/api/instructor/modules/${moduleSlug}`, data),
  deleteModule: (moduleSlug) =>
    api.delete(`/api/instructor/modules/${moduleSlug}`),
  getCourseModules: (courseslug, page = 0, size = 10) =>
    api.get(`/api/instructor/modules/courses/${courseslug}?page=${page}&size=${size}`),
};

export const instructorLessonApi = {
  createLesson: (moduleSlug, formData) =>
    api.post(`/api/instructor/lessons/modules/${moduleSlug}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getModuleLessons: (moduleSlug, page = 0, size = 100) =>
    api.get(`/api/instructor/lessons/modules/${moduleSlug}?page=${page}&size=${size}`),

  updateLesson: (lessonSlug, formData) =>
    api.put(`/api/instructor/lessons/${lessonSlug}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteLesson: (lessonSlug) =>
    api.delete(`/api/instructor/lessons/${lessonSlug}`),
};

export const instructorQuizApi = {
  createQuiz: (data) =>
    api.post("/api/instructor/quizzes", data),

  getQuiz: (quizSlug) =>
    api.get(`/api/instructor/quizzes/${quizSlug}`),

  getQuizById: (quizSlug) =>
    api.get(`/api/instructor/quizzes/${quizSlug}`),

  // PUT /api/instructor/quizzes/{quizSlug}
  updateQuiz: (quizSlug, data) =>
    api.put(`/api/instructor/quizzes/${quizSlug}`, data),

  // DELETE /api/instructor/quizzes/{quizSlug}
  deleteQuiz: (quizSlug) =>
    api.delete(`/api/instructor/quizzes/${quizSlug}`),

  // PATCH /api/instructor/quizzes/{quizSlug}/publish
  publishQuiz: (quizSlug) =>
    api.patch(`/api/instructor/quizzes/${quizSlug}/publish`),

  // PATCH /api/instructor/quizzes/{quizSlug}/archive
  archiveQuiz: (quizSlug) =>
    api.patch(`/api/instructor/quizzes/${quizSlug}/archive`),

  // GET /api/instructor/quizzes/modules/{moduleSlug}  ← uses SLUG not ID
  getQuizzesByModule: (moduleSlug, page = 0, size = 50) =>
    api.get(`/api/instructor/quizzes/modules/${moduleSlug}?page=${page}&size=${size}`),

  // GET /api/instructor/quizzes/lessons/{lessonSlug}  ← uses SLUG not ID
  getQuizzesByLesson: (lessonSlug, page = 0, size = 50) =>
    api.get(`/api/instructor/quizzes/lessons/${lessonSlug}?page=${page}&size=${size}`),

  // GET /api/instructor/quizzes/courses/{courseSlug}
  getQuizzesByCourse: (courseSlug, page = 0, size = 50) =>
    api.get(`/api/instructor/quizzes/courses/${courseSlug}?page=${page}&size=${size}`),
};

/* ── Quiz Questions ── */
export const instructorQuizQuestionApi = {
  getQuizQuestions: (quizSlug) =>
    api.get(`/api/instructor/quiz-questions/quizzes/${quizSlug}`),
  createQuestion: (quizSlug, data) =>
    api.post(`/api/instructor/quiz-questions/quizzes/${quizSlug}`, data),
  bulkCreateQuestions: (quizSlug, questions) =>
    api.post(`/api/instructor/quiz-questions/${quizSlug}/bulk`, questions),
  updateQuestion: (questionId, data) =>
    api.put(`/api/instructor/quiz-questions/${questionId}`, data),
  deleteQuestion: (questionId) =>
    api.delete(`/api/instructor/quiz-questions/${questionId}`),
};

/* ── Quiz Options ── */
export const instructorQuizOptionApi = {
  getQuestionOptions: (questionId) =>
    api.get(`/api/instructor/quiz-options/questions/${questionId}`),
  createOption: (questionId, data) =>
    api.post(`/api/instructor/quiz-options/questions/${questionId}`, data),
  bulkCreateOptions: (questionId, options) =>
    api.post(`/api/instructor/quiz-options/${questionId}/bulk`, options),
  updateOptions: (questionId, data) =>
    api.put(`/api/instructor/quiz-options/questions/${questionId}/options`, data),
  // Single option update — used when editing existing questions
  updateOption: (optionId, data) =>
    api.put(`/api/instructor/quiz-options/${optionId}`, data),
  deleteOption: (optionId) =>
    api.delete(`/api/instructor/quiz-options/${optionId}`),
};

/* ── Quiz Analytics ── */
export const instructorQuizAnalyticsApi = {
  getQuizStudents: (quizId, page = 0, size = 50) =>
    api.get(`/api/instructor/quizzes/${quizId}/students?page=${page}&size=${size}`),
  getQuestionAnalytics: (quizId) =>
    api.get(`/api/instructor/quizzes/${quizId}/question-analytics`),
  getQuizAnalytics: (quizslug) =>
    api.get(`/api/instructor/quizzes/${quizslug}/analytics`),
  getAttemptDetail: (attemptId) =>
    api.get(`/api/instructor/quizzes/attempts/${attemptId}`),
};

export const instructorAssignmentApi = {
  // GET /api/instructor/assignments
  getAllAssignments: (page = 0, size = 10, sort = "id,desc") =>
    api.get(`/api/instructor/assignments?page=${page}&size=${size}&sort=${sort}`),

  // GET /api/instructor/assignments/lessons/{lessonSlug}
  getByLesson: (lessonSlug, page = 0, size = 50) =>
    api.get(`/api/instructor/assignments/lessons/${lessonSlug}?page=${page}&size=${size}`),

  // GET /api/instructor/assignments/lessons/{lessonSlug}/type/{assignmentType}
  getByLessonAndType: (lessonSlug, assignmentType, page = 0, size = 50) =>
    api.get(`/api/instructor/assignments/lessons/${lessonSlug}/type/${assignmentType}?page=${page}&size=${size}`),

  // POST /api/instructor/assignments/lessons/{lessonSlug}
  createByLesson: (lessonSlug, data) =>
    api.post(`/api/instructor/assignments/lessons/${lessonSlug}`, data),

  // PUT /api/instructor/assignments/{assignmentSlug}
  update: (assignmentSlug, data) =>
    api.put(`/api/instructor/assignments/${assignmentSlug}`, data),

  // DELETE /api/instructor/assignments/{assignmentSlug}
  delete: (assignmentSlug) =>
    api.delete(`/api/instructor/assignments/${assignmentSlug}`),

  // PATCH /api/instructor/assignments/{assignmentSlug}/publish
  publish: (assignmentSlug) =>
    api.patch(`/api/instructor/assignments/${assignmentSlug}/publish`),

  // PATCH /api/instructor/assignments/{assignmentSlug}/archive
  archive: (assignmentSlug) =>
    api.patch(`/api/instructor/assignments/${assignmentSlug}/archive`),

  // GET /api/instructor/assignments/{assignmentSlug}/submissions
  getSubmissions: (assignmentSlug, page = 0, size = 50) =>
    api.get(`/api/instructor/assignments/${assignmentSlug}/submissions?page=${page}&size=${size}`),

  // GET /api/instructor/assignments/submissions/{submissionId}
  getSubmission: (submissionId) =>
    api.get(`/api/instructor/assignments/submissions/${submissionId}`),

  // POST /api/instructor/assignments/submissions/{submissionId}/grade
  grade: (submissionId, data) =>
    api.post(`/api/instructor/assignments/submissions/${submissionId}/grade`, data),
};

export const instructorPricingApi = {
  getPricingPlans: (page = 0, size = 100) =>
    api.get(`/api/course-pricing-plans?page=${page}&size=${size}`),

  getPricingPlan: (id) =>
    api.get(`/api/course-pricing-plans/${id}`),

  createPricingPlan: (data) =>
    api.post("/api/course-pricing-plans", data),

  updatePricingPlan: (id, data) =>
    api.put(`/api/course-pricing-plans/${id}`, data),

  deletePricingPlan: (id) =>
    api.delete(`/api/course-pricing-plans/${id}`),

  getDefaultPricingPlan: () =>
    api.get("/api/course-pricing-plans/default"),

  getActivePricingPlans: () =>
    api.get("/api/course-pricing-plans/active"),
};

export const instructorApi = {
  getAllInstructors: () =>
    api.get("/api/instructor/instructors"), // Replace with your actual API
};


export default api;