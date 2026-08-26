import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://vyntra.swipengrow.in";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_accessToken");
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
        const refreshToken = localStorage.getItem("admin_refreshToken");
        if (refreshToken) {
          // Attempt to fetch new access token using refresh token
          const response = await axios.post(`${API_BASE_URL}/api/admin/auth/refresh`, {
            refreshToken: refreshToken,
          });

          if (response.data && response.data.data) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            localStorage.setItem("admin_accessToken", accessToken);
            if (newRefreshToken) {
              localStorage.setItem("admin_refreshToken", newRefreshToken);
            }

            // Retry original request with new access token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Admin token refresh failed:", refreshError);
        // Clear tokens and redirect
        localStorage.removeItem("admin_accessToken");
        localStorage.removeItem("admin_refreshToken");
        window.location.href = "/AdminLogin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const adminAuth = {
  login: (data) => api.post("/api/admin/auth/login", data),
  verifyOtp: (data) => api.post("/api/admin/auth/verify-otp", data),
  resendOtp: (data) => api.post("/api/admin/auth/resend-otp", data),
  getProfile: () => api.get("/api/admin/auth/me"),
  changePassword: (data) => api.post("/api/admin/auth/change-password", data),
  forgotPassword: (data) => api.post("/api/admin/auth/forgot-password", data),
  resetPassword: (data) => api.post("/api/admin/auth/reset-password", data),
  logout: () => api.post("/api/admin/auth/logout"),
};

export const adminManagement = {
  // Students
  getAllStudents: (active, page = 0, size = 10) => {
    const params = new URLSearchParams();
    if (active !== undefined && active !== null) {
      params.append("active", active);
    }
    params.append("page", page);
    params.append("size", size);
    return api.get(`/api/admin/management/students?${params.toString()}`);
  },
  getStudentByCode: (studentCode) => api.get(`/api/admin/management/students/${studentCode}`),
  updateStudent: (studentCode, data) => api.put(`/api/admin/management/students/${studentCode}`, data),
  toggleStudentStatus: (studentCode) => api.patch(`/api/admin/management/students/${studentCode}/toggle-status`),
  searchStudents: (keyword, page = 0, size = 10) => {
    const params = new URLSearchParams();
    params.append("keyword", keyword);
    params.append("page", page);
    params.append("size", size);
    return api.get(`/api/admin/management/students/search?${params.toString()}`);
  },

  // Instructors
  getAllInstructors: (active, page = 0, size = 10) => {
    const params = new URLSearchParams();
    if (active !== undefined && active !== null) {
      params.append("active", active);
    }
    params.append("page", page);
    params.append("size", size);
    return api.get(`/api/admin/management/instructors?${params.toString()}`);
  },
  getInstructorByCode: (instructorCode) => api.get(`/api/admin/management/instructors/${instructorCode}`),
  updateInstructor: (instructorCode, data) => api.put(`/api/admin/management/instructors/${instructorCode}`, data),
  toggleInstructorStatus: (instructorCode) => api.patch(`/api/admin/management/instructors/${instructorCode}/toggle-status`),
  searchInstructors: (keyword, page = 0, size = 10) => {
    const params = new URLSearchParams();
    params.append("keyword", keyword);
    params.append("page", page);
    params.append("size", size);
    return api.get(`/api/admin/management/instructors/search?${params.toString()}`);
  },
  createInstructor: (data) => api.post("/api/admin/management/create-instructor", data),
};

export const adminCourseApi = {
  // ── Core Course CRUD (all identifiers below are course SLUGS, not DB ids) ──
  createCourse: (data) => api.post("/api/admin/courses", data),
  getAllCourses: (page = 0, size = 10) => {
    return api.get(`/api/admin/courses?page=${page}&size=${size}`);
  },
  getCourseBySlug: (courseSlug) => api.get(`/api/admin/courses/${courseSlug}`),
  updateBasicInfo: (courseSlug, formData) => api.put(`/api/admin/courses/${courseSlug}/basic-info`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  updatePricing: (courseSlug, data) => api.put(`/api/admin/courses/${courseSlug}/pricing`, data),
  updateFeatures: (courseSlug, data) => api.put(`/api/admin/courses/${courseSlug}/features`, data),
  updateFaqs: (courseSlug, data) => api.put(`/api/admin/courses/${courseSlug}/faqs`, data),
  updateTags: (courseSlug, data) => api.put(`/api/admin/courses/${courseSlug}/tags`, data),
  addInstructorsToCourse: (courseSlug, data) => api.post(`/api/admin/courses/${courseSlug}/instructors`, data),
  removeInstructorFromCourse: (courseSlug, instructorId) => api.delete(`/api/admin/courses/${courseSlug}/instructors/${instructorId}`),
  deleteCourseTag: (courseSlug, tagId) => api.delete(`/api/admin/courses/${courseSlug}/tags/${tagId}`),
  deleteCourseFaq: (courseSlug, faqId) => api.delete(`/api/admin/courses/${courseSlug}/faqs/${faqId}`),
  publishCourse: (courseSlug) => api.patch(`/api/admin/courses/${courseSlug}/publish`),
  archiveCourse: (courseSlug) => api.patch(`/api/admin/courses/${courseSlug}/archive`),

  // ── Modules (identifiers are module SLUGS) ──
  getCourseModules: (courseSlug, page = 0, size = 100) => api.get(`/api/admin/modules/courses/${courseSlug}?page=${page}&size=${size}`),
  getModuleBySlug: (moduleSlug) => api.get(`/api/admin/modules/${moduleSlug}`),
  createModule: (courseSlug, data) => api.post(`/api/admin/modules/courses/${courseSlug}`, data),
  updateModule: (moduleSlug, data) => api.put(`/api/admin/modules/${moduleSlug}`, data),
  deleteModule: (moduleSlug) => api.delete(`/api/admin/modules/${moduleSlug}`),

  // ── Lessons (identifiers are lesson SLUGS) ──
  getModuleLessons: (moduleSlug, page = 0, size = 100) => api.get(`/api/admin/lessons/modules/${moduleSlug}?page=${page}&size=${size}`),
  getLessonBySlug: (lessonSlug) => api.get(`/api/admin/lessons/${lessonSlug}`),
  createLesson: (moduleSlug, formData) => api.post(`/api/admin/lessons/modules/${moduleSlug}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  updateLesson: (lessonSlug, formData) => api.put(`/api/admin/lessons/${lessonSlug}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  deleteLesson: (lessonSlug) => api.delete(`/api/admin/lessons/${lessonSlug}`),
};

export const adminDashboardApi = {
  getCourseCounts: () => api.get("/api/admin/dashboard/course-counts"),
  getRegisteredStudentCount: () => api.get("/api/admin/dashboard/registered-students"),
  getEnrolledStudentCount: () => api.get("/api/admin/dashboard/enrolled-students"),
  getEnrollmentCount: () => api.get("/api/admin/dashboard/enrollments"),
  getTransactionCounts: () => api.get("/api/admin/dashboard/transactions"),
  getSuccessTransactionCount: () => api.get("/api/admin/dashboard/transactions/success"),
  getPendingTransactionCount: () => api.get("/api/admin/dashboard/transactions/pending"),
  getRevenueByCourse: () => api.get("/api/admin/dashboard/revenue/course"),
  getAssignmentCountByCourse: () => api.get("/api/admin/dashboard/assignments/course"),
  getQuizCountByCourse: () => api.get("/api/admin/dashboard/quizzes/course"),
  getJobCount: () => api.get("/api/admin/dashboard/jobs"),
  getCertificateCount: () => api.get("/api/admin/dashboard/certificates"),
  getInstructorCount: () => api.get("/api/admin/dashboard/instructors"),
  getInstructorCountByCourse: () => api.get("/api/admin/dashboard/instructors/course"),
  getCourseRatingCount: () => api.get("/api/admin/dashboard/ratings"),
  getCourseRatingCountByCourse: () => api.get("/api/admin/dashboard/ratings/course"),
  getRevenueByTimeline: (fromDate, toDate) =>
    api.get(`/api/admin/dashboard/revenue/timeline?fromDate=${fromDate}&toDate=${toDate}`),
};

export const adminPaymentApi = {
  getAllTransactions: (page = 0, size = 10) =>
    api.get(`/api/admin/payments/transactions?page=${page}&size=${size}`),
  getStudentTransactions: (studentId, page = 0, size = 10) =>
    api.get(`/api/admin/payments/students/${studentId}/transactions?page=${page}&size=${size}`),
  getTransactionDetails: (paymentId) =>
    api.get(`/api/admin/payments/transactions/${paymentId}`),
  getCourseTransactions: (courseId, page = 0, size = 10) =>
    api.get(`/api/admin/payments/courses/${courseId}/transactions?page=${page}&size=${size}`),
};

export const adminCourseRatingApi = {
  getAllRatingsByCourse: (courseSlug, page = 0, size = 10) =>
    api.get(`/api/admin/course-ratings/${courseSlug}?page=${page}&size=${size}`),
  getApprovedRatings: (courseSlug, page = 0, size = 10) =>
    api.get(`/api/admin/course-ratings/${courseSlug}/approved?page=${page}&size=${size}`),
  getPendingRatings: (courseSlug, page = 0, size = 10) =>
    api.get(`/api/admin/course-ratings/${courseSlug}/pending?page=${page}&size=${size}`),
  approveRating: (ratingId) => api.post(`/api/admin/course-ratings/${ratingId}/approve`),
  declineRating: (ratingId) => api.post(`/api/admin/course-ratings/${ratingId}/decline`),
  deleteRating: (ratingId) => api.delete(`/api/admin/course-ratings/${ratingId}`),
};

export const adminInstructorRatingApi = {
  getAllRatings: (page = 0, size = 10) =>
    api.get(`/api/admin/instructor-ratings?page=${page}&size=${size}`),
  getPendingRatings: (page = 0, size = 10) =>
    api.get(`/api/admin/instructor-ratings/pending?page=${page}&size=${size}`),
  getApprovedRatings: (page = 0, size = 10) =>
    api.get(`/api/admin/instructor-ratings/approved?page=${page}&size=${size}`),
  approveRating: (ratingId) => api.patch(`/api/admin/instructor-ratings/${ratingId}/approve`),
  rejectRating: (ratingId) => api.patch(`/api/admin/instructor-ratings/${ratingId}/reject`),
  updateRating: (ratingId, data) => api.put(`/api/admin/instructor-ratings/${ratingId}`, data),
  deleteRating: (ratingId) => api.delete(`/api/admin/instructor-ratings/${ratingId}`),
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

export const adminAttendanceApi = {
  getStudentAttendance: (studentCode, page = 0, size = 10) =>
    api.get(`/api/admin/attendance/students/${studentCode}?page=${page}&size=${size}`),

  getCourseAttendance: (courseSlug, attendanceDate, status, page = 0, size = 10) => {
    const params = new URLSearchParams();
    if (attendanceDate) params.append("attendanceDate", attendanceDate);
    if (status && status !== "ALL") params.append("status", status);
    params.append("page", page);
    params.append("size", size);
    return api.get(`/api/admin/attendance/courses/${courseSlug}?${params.toString()}`);
  },

  getCourseAttendanceSummary: (courseSlug) =>
    api.get(`/api/admin/attendance/courses/${courseSlug}/summary`)
};

export const adminCalendarApi = {
  getAdminCalendar: (startDate, endDate) =>
    api.get(`/api/admin/calendar?startDate=${startDate}&endDate=${endDate}`)
};

export const adminCertificateApi = {
  getAllCertificates: (page = 0, size = 10) =>
    api.get(`/api/admin/certificates?page=${page}&size=${size}`),

  getCertificateDetails: (certificateNumber) =>
    api.get(`/api/admin/certificates/${certificateNumber}`),

  getCertificatesByStatus: (status, page = 0, size = 10) =>
    api.get(`/api/admin/certificates/status/${status}?page=${page}&size=${size}`),

  getCertificatesByCourse: (courseSlug, page = 0, size = 10) =>
    api.get(`/api/admin/certificates/course/${courseSlug}?page=${page}&size=${size}`)
};

export const adminResourceApi = {
  getAllResources: (page = 0, size = 10) =>
    api.get(`/api/admin/resources?page=${page}&size=${size}`),

  deleteResource: (resourceId) =>
    api.delete(`/api/admin/resources/${resourceId}`)
};

export const adminPricingApi = {
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

export const adminJobsApi = {
  getAllJobs: (page = 0, size = 10) =>
    api.get(`/api/admin/jobs?page=${page}&size=${size}`),
  getJobBySlug: (jobSlug) =>
    api.get(`/api/admin/jobs/${jobSlug}`),
  createJob: (formData) =>
    api.post("/api/admin/jobs", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }),
  updateJob: (jobSlug, formData) =>
    api.put(`/api/admin/jobs/${jobSlug}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }),
  deleteJob: (jobSlug) =>
    api.delete(`/api/admin/jobs/${jobSlug}`),
  getJobApplications: (jobSlug, page = 0, size = 10) =>
    api.get(`/api/admin/jobs/${jobSlug}/applications?page=${page}&size=${size}`),
  updateApplicationStatus: (applicationId, data) =>
    api.put(`/api/admin/jobs/applications/${applicationId}/status`, data),
};

export const adminManagementApi = {
  // ── Students ──
  createStudent: (data) =>
    api.post(`/api/admin/management/create-student`, data),

  getAllStudents: (page = 0, size = 10) =>
    api.get(`/api/admin/management/students?page=${page}&size=${size}`),

  searchStudents: (query, page = 0, size = 10) =>
    api.get(`/api/admin/management/students/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`),

  getStudentByCode: (studentCode) =>
    api.get(`/api/admin/management/students/${studentCode}`),

  updateStudent: (studentCode, data) =>
    api.put(`/api/admin/management/students/${studentCode}`, data),

  toggleStudentStatus: (studentCode) =>
    api.patch(`/api/admin/management/students/${studentCode}/toggle-status`),

  // Note: these two endpoints return a bare PageResponse/ApiResponse (no outer "data" wrapper
  // consistency guaranteed) — check response shape directly when consuming.
  getStudentEnrolledCourses: (studentCode, page = 0, size = 10) =>
    api.get(`/api/admin/management/students/${studentCode}/enrolled-courses?page=${page}&size=${size}`),

  getStudentReferrals: (studentCode) =>
    api.get(`/api/admin/management/students/${studentCode}/referrals`),

  // ── Instructors ──
  getAllInstructors: (page = 0, size = 10) =>
    api.get(`/api/admin/management/instructors?page=${page}&size=${size}`),

  searchInstructors: (query, page = 0, size = 10) =>
    api.get(`/api/admin/management/instructors/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`),

  getInstructorByCode: (instructorCode) =>
    api.get(`/api/admin/management/instructors/${instructorCode}`),

  updateInstructor: (instructorCode, data) =>
    api.put(`/api/admin/management/instructors/${instructorCode}`, data),

  toggleInstructorStatus: (instructorCode) =>
    api.patch(`/api/admin/management/instructors/${instructorCode}/toggle-status`),

  createInstructor: (data) =>
    api.post(`/api/admin/management/create-instructor`, data),

  // ── Instructor Proofs ──
  getInstructorProofs: (instructorCode) =>
    api.get(`/api/admin/management/instructors/${instructorCode}/proofs`),

  getAllInstructorProofs: (page = 0, size = 10) =>
    api.get(`/api/admin/management/instructor-proofs?page=${page}&size=${size}`),

  getInstructorProof: (proofId) =>
    api.get(`/api/admin/management/instructor-proofs/${proofId}`),

  // ── Admin's own profile image ──
  updateProfileImage: (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);
    return api.put(`/api/admin/management/profile/image`, formData, {
      headers: { "Content-Type": undefined },
    });
  },
};

export const adminCommunityApi = {
  // ── Admin's own community posts ──
  createPost: (formData) =>
    api.post(`/api/admin/community/my-posts`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updatePost: (postId, formData) =>
    api.patch(`/api/admin/community/my-posts/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteOwnPost: (postId) =>
    api.delete(`/api/admin/community/my-posts/${postId}`),

  getMyPosts: (page = 0, size = 10) =>
    api.get(`/api/admin/community/my-posts?page=${page}&size=${size}`),

  // ── Community moderation ──
  getPendingPosts: (page = 0, size = 10) =>
    api.get(`/api/admin/community/moderation/pending-posts?page=${page}&size=${size}`),

  getApprovedPosts: (page = 0, size = 10) =>
    api.get(`/api/admin/community/moderation/approved-posts?page=${page}&size=${size}`),

  getRejectedPosts: (page = 0, size = 10) =>
    api.get(`/api/admin/community/moderation/rejected-posts?page=${page}&size=${size}`),

  approvePost: (postId) =>
    api.patch(`/api/admin/community/moderation/posts/${postId}/approve`),

  rejectPost: (postId, data) =>
    api.patch(`/api/admin/community/moderation/posts/${postId}/reject`, data),

  deleteAnyPost: (postId) =>
    api.delete(`/api/admin/community/moderation/posts/${postId}`),
};

export default api;
