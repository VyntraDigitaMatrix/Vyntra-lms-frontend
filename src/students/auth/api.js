import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://98.93.255.158:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("student_accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh / invalid sessions
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 Unauthorized and we haven't retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("student_refreshToken");
        if (refreshToken) {
          // Attempt to fetch new access token using refresh token
          const response = await axios.post(`${API_BASE_URL}/api/student/auth/refresh`, {
            refreshToken: refreshToken,
          });

          if (response.data && response.data.data) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            localStorage.setItem("student_accessToken", accessToken);
            if (newRefreshToken) {
              localStorage.setItem("student_refreshToken", newRefreshToken);
            }

            // Retry original request with new access token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear tokens and redirect
        localStorage.removeItem("student_accessToken");
        localStorage.removeItem("student_refreshToken");
        window.location.href = "/UserLogin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const studentAuth = {
  register: (data) => api.post("/api/student/auth/register", data),
  login: (data) => api.post("/api/student/auth/login", data),
  getProfile: () => api.get("/api/student/auth/me"),
  changePassword: (data) => api.post("/api/student/auth/change-password", data),
  forgotPassword: (data) => api.post("/api/student/auth/forgot-password", data),
  resetPassword: (data) => api.post("/api/student/auth/reset-password", data),
  logout: () => api.post("/api/student/auth/logout"),
};

export const studentCourseApi = {
  getPublishedCourses: (page = 0, size = 10, sort = "id,desc") => {
    return api.get(`/api/student/courses?page=${page}&size=${size}&sort=${sort}`);
  },
  getCourseStructure: (courseId) => {
    return api.get(`/api/student/courses/${courseId}`);
  }
};

export const studentPaymentApi = {
  createOrder: (courseId) => {
    return api.post(`/api/student/payments/orders/courses/${courseId}`);
  },
  verifyPayment: (data) => {
    return api.post("/api/student/payments/verify", data);
  }
};

export const studentEnrolledCourseApi = {
  // GET /api/v1/student/my-courses  (paginated)
  getMyEnrolledCourses: (page = 0, size = 10) =>
    api.get(`/api/v1/student/my-courses?page=${page}&size=${size}&sort=createdAt,desc`),

  getMyCourseById: (courseId) =>
    api.get(`/api/v1/student/my-courses/${courseId}`),

  // GET /api/v1/student/my-courses/{courseId}/modules  (list with nested lessons)
  getCourseModules: (courseId) =>
    api.get(`/api/v1/student/my-courses/${courseId}/modules`),

  // GET /api/v1/student/my-courses/{courseId}/modules/{moduleId}/lessons  (paginated)
  getModuleLessons: (courseId, moduleId, page = 0, size = 50) =>
    api.get(`/api/v1/student/my-courses/${courseId}/modules/${moduleId}/lessons?page=${page}&size=${size}&sort=sortOrder,asc`),

  // GET /api/v1/student/my-courses/{courseId}/lessons/{lessonId}  (single lesson full content)
  getLessonById: (courseId, lessonId) =>
    api.get(`/api/v1/student/my-courses/${courseId}/lessons/${lessonId}`),
};

export const studentLearningApi = {
  // GET /api/student/learning/my-courses (paginated)
  getMyEnrolledCourses: (page = 0, size = 10) =>
    api.get(`/api/student/learning/my-courses?page=${page}&size=${size}&sort=createdAt,desc`),

  // GET /api/student/learning/courses
  getCourses: (page = 0, size = 10, sort = "id,desc") =>
    api.get(`/api/student/learning/courses?page=${page}&size=${size}&sort=${sort}`),

  // GET /api/student/learning/courses/{courseSlug}
  getCourseBySlug: (courseSlug) =>
    api.get(`/api/student/learning/courses/${courseSlug}`),

  // GET /api/student/learning/courses/{courseSlug}/modules
  getCourseModules: (courseSlug) =>
    api.get(`/api/student/learning/courses/${courseSlug}/modules`),

  // GET /api/student/learning/courses/{courseSlug}/progress
  getCourseProgress: (courseSlug) =>
    api.get(`/api/student/learning/courses/${courseSlug}/progress`),

  // GET /api/student/learning/modules/{moduleSlug}/lessons
  getModuleLessons: (moduleSlug) =>
    api.get(`/api/student/learning/modules/${moduleSlug}/lessons`),

  // GET /api/student/learning/lessons/{lessonSlug}
  getLessonById: (lessonSlug) =>
    api.get(`/api/student/learning/lessons/${lessonSlug}`),

  // POST /api/student/learning/lessons/{lessonSlug}/complete
  completeLesson: (lessonSlug) =>
    api.post(`/api/student/learning/lessons/${lessonSlug}/complete`, {}),

  // GET /api/student/course-ratings/{courseSlug}
  getCourseReviews: (courseSlug, page = 0, size = 10) =>
    api.get(`/api/student/course-ratings/${courseSlug}?page=${page}&size=${size}`),

  // POST /api/student/course-ratings/{courseSlug}
  submitCourseReview: (courseSlug, data) =>
    api.post(`/api/student/course-ratings/${courseSlug}`, data),

  // PUT /api/student/course-ratings/{courseSlug}
  updateCourseReview: (courseSlug, data) =>
    api.put(`/api/student/course-ratings/${courseSlug}`, data),

  // GET /api/student/course-ratings/{courseSlug}/my-rating
  getMyRating: (courseSlug) =>
    api.get(`/api/student/course-ratings/${courseSlug}/my-rating`),

  // DELETE /api/student/course-ratings/{courseSlug}
  deleteCourseReview: (courseSlug) =>
    api.delete(`/api/student/course-ratings/${courseSlug}`),
};

export const studentNotesApi = {
  getNotes: (courseId, page = 0, size = 10) => {
    let url = `/api/v1/student/notes?page=${page}&size=${size}`;
    if (courseId) {
      url += `&courseId=${courseId}`;
    }
    return api.get(url);
  },

  createNote: (data) =>
    api.post("/api/v1/student/notes", data),

  getNoteById: (id) =>
    api.get(`/api/v1/student/notes/${id}`),

  updateNote: (id, data) =>
    api.put(`/api/v1/student/notes/${id}`, data),

  deleteNote: (id) =>
    api.delete(`/api/v1/student/notes/${id}`),
};

export const studentQuizApi = {
  getQuizzes: (page = 0, size = 10) =>
    api.get(`/api/student/quizzes?page=${page}&size=${size}`),

  getQuizBySlug: (quizSlug) =>
    api.get(`/api/student/quizzes/${quizSlug}`),

  startQuiz: (quizSlug) =>
    api.post(`/api/student/quizzes/${quizSlug}/start`),

  retryQuiz: (quizSlug) =>
    api.post(`/api/student/quizzes/${quizSlug}/retry`),

  resumeQuiz: (quizSlug) =>
    api.post(`/api/student/quizzes/${quizSlug}/resume`),

  getAttemptsByQuiz: (quizSlug, page = 0, size = 10) =>
    api.get(`/api/student/quizzes/${quizSlug}/attempts?page=${page}&size=${size}`),

  getAttempts: (page = 0, size = 10) =>
    api.get(`/api/student/quizzes/attempts?page=${page}&size=${size}`),

  getAttemptResult: (attemptId) =>
    api.get(`/api/student/quizzes/attempts/${attemptId}/result`),

  getAttemptQuestions: (attemptId) =>
    api.get(`/api/student/quizzes/attempts/${attemptId}/questions`),

  saveAnswer: (attemptId, data) =>
    api.post(`/api/student/quizzes/attempts/${attemptId}/save-answer`, data),

  submitAttempt: (attemptId, data) => {
    return api.post(`/api/student/quizzes/attempts/${attemptId}/submit`, data || {});
  },

  getLeaderboard: (quizSlug, page = 0, size = 10) =>
    api.get(`/api/student/quizzes/${quizSlug}/leaderboard?page=${page}&size=${size}`),

  getLeaderboardByCourse: (courseSlug, page = 0, size = 10) =>
    api.get(`/api/student/quizzes/course/${courseSlug}/leaderboard?page=${page}&size=${size}`),
};

export const studentJobApi = {

  getJobs: (page = 0, size = 10) =>
    api.get(`/api/student/jobs?page=${page}&size=${size}`),

  getJobBySlug: (jobSlug) =>
    api.get(`/api/student/jobs/${jobSlug}`),

  applyForJob: (jobSlug, formData, coverLetter) => {
    const query = coverLetter ? `?coverLetter=${encodeURIComponent(coverLetter)}` : '';
    return api.post(`/api/student/jobs/${jobSlug}/apply${query}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  getMyApplications: () =>
    api.get(`/api/student/jobs/Myapplications`),
    
  getApplicationDetails: (applicationId) =>
    api.get(`/api/student/jobs/applications/${applicationId}`)
};

export const studentAssignmentApi = {

  getAssignments: (page = 0, size = 1000) =>
    api.get(`/api/student/assignments?page=${page}&size=${size}`),

  getAssignmentsByModule: (moduleId) =>
    api.get(`/api/student/assignments/module/${moduleId}`),

  getAssignmentBySlug: (assignmentSlug) =>
    api.get(`/api/student/assignments/${assignmentSlug}`),

  getAssignmentById: (assignmentId) =>
    api.get(`/api/student/assignments/${assignmentId}`),

  submitAssignment: (assignmentSlug, submissionText, file) => {
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    return api.post(
      `/api/student/assignments/${assignmentSlug}/submit`,
      formData,
      {
        params: {
          submissionText,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  updateSubmission: (assignmentSlug, data) =>
    api.put(`/api/student/assignments/${assignmentSlug}/submission`, data),

  getSubmissions: () =>
    api.get(`/api/student/assignments/submissions`),

  getSubmissionById: (submissionId) =>
    api.get(`/api/student/assignments/submissions/${submissionId}`),
};

export const studentInstructorRatingApi = {
  // GET /api/student/instructor-ratings/{courseSlug}/{instructorId}/my-rating
  getMyRating: (courseSlug, instructorId) =>
    api.get(`/api/student/instructor-ratings/${courseSlug}/${instructorId}/my-rating`),

  // POST /api/student/instructor-ratings/{courseSlug}
  submitRating: (courseSlug, payload) =>
    api.post(`/api/student/instructor-ratings/${courseSlug}`, payload),

  // PUT /api/student/instructor-ratings/{courseSlug}
  updateRating: (courseSlug, payload) =>
    api.put(`/api/student/instructor-ratings/${courseSlug}`, payload),

  // GET /api/student/instructor-ratings/instructors
  getInstructors: () =>
    api.get(`/api/student/instructor-ratings/instructors`)
};

export const studentManagementApi = {
  updateProfile: (data) =>
    api.put(`/api/student/profile`, data),

  updateProfileImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("image", file);
    formData.append("profileImage", file);
    return api.put(`/api/student/profile/image`, formData, {
      headers: { "Content-Type": undefined }
    });
  },

  requestEmailChange: (newEmail) =>
    api.post(`/api/student/email/request-change`, { newEmail }),

  verifyEmailChange: (otp) =>
    api.post(`/api/student/email/verify-change`, { otp }),
};

export const discussionApi = {
  getGroups: (page = 0, size = 10) =>
    api.get(`/api/discussions/groups?page=${page}&size=${size}`),

  getMyGroups: (page = 0, size = 10) =>
    api.get(`/api/discussions/groups/my?page=${page}&size=${size}`),

  getCourseGroup: (courseId) =>
    api.post(`/api/discussions/groups/course/${courseId}`),

  joinGroup: (slug) =>
    api.post(`/api/discussions/groups/${slug}/join`),

  leaveGroup: (slug) =>
    api.post(`/api/discussions/groups/${slug}/leave`),

  getGroupMembers: (slug, page = 0, size = 10) =>
    api.get(`/api/discussions/groups/${slug}/members?page=${page}&size=${size}`),

  getMessages: (slug, page = 0, size = 10) =>
    api.get(`/api/discussions/groups/${slug}/messages?page=${page}&size=${size}`),

  sendMessage: (slug, payload) =>
    api.post(`/api/discussions/groups/${slug}/messages`, payload),

  markMessageAsSeen: (messageId) =>
    api.post(`/api/discussions/messages/${messageId}/seen`),

  deleteMessage: (messageId) =>
    api.delete(`/api/discussions/messages/${messageId}`)
};

export default api;