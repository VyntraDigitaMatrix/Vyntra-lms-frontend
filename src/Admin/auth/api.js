import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://107.20.36.39:8080";

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
  createCourse: (formData) => api.post("/api/admin/courses", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  updateCourse: (courseId, formData) => api.put(`/api/admin/courses/${courseId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  publishCourse: (courseId) => api.patch(`/api/admin/courses/${courseId}/publish`),
  archiveCourse: (courseId) => api.patch(`/api/admin/courses/${courseId}/archive`),
  getPendingPublishRequests: (page = 0, size = 10) => {
    return api.get(`/api/admin/courses/pending-publish?page=${page}&size=${size}`);
  },
  rejectPublishRequest: (courseId) => api.patch(`/api/admin/courses/${courseId}/reject-publish`),
  getAllCourses: (page = 0, size = 10) => {
    return api.get(`/api/admin/courses?page=${page}&size=${size}`);
  },
  getCourseById: (courseId) => api.get(`/api/admin/courses/${courseId}`),
  getCourseModules: (courseId) => api.get(`/api/admin/modules/courses/${courseId}?page=0&size=100`),
  getModuleLessons: (moduleId) => api.get(`/api/admin/lessons/modules/${moduleId}?page=0&size=100`),
};

export default api;
