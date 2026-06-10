import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("instructor_accessToken");
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
        const refreshToken = localStorage.getItem("instructor_refreshToken");
        if (refreshToken) {
          // Attempt to fetch new access token using refresh token
          const response = await axios.post(`${API_BASE_URL}/api/instructor/auth/refresh`, {
            refreshToken: refreshToken,
          });
          
          if (response.data && response.data.data) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            localStorage.setItem("instructor_accessToken", accessToken);
            if (newRefreshToken) {
              localStorage.setItem("instructor_refreshToken", newRefreshToken);
            }
            
            // Retry original request with new access token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Instructor token refresh failed:", refreshError);
        // Clear tokens and redirect
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
  createCourse: (formData) => api.post("/api/instructor/courses", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  getInstructorCourses: (page = 0, size = 10) => {
    return api.get(`/api/instructor/courses?page=${page}&size=${size}`);
  },
  getInstructorCourseById: (courseId) => api.get(`/api/instructor/courses/${courseId}`),
  updateCourseContent: (courseId, formData) => api.put(`/api/instructor/courses/${courseId}/content`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
};

export const instructorModuleApi = {
  createModule: (courseId, data) => api.post(`/api/instructor/modules/courses/${courseId}`, data),
  updateModule: (moduleId, data) => api.put(`/api/instructor/modules/${moduleId}`, data),
  deleteModule: (moduleId) => api.delete(`/api/instructor/modules/${moduleId}`),
  getCourseModules: (courseId, page = 0, size = 10) => {
    return api.get(`/api/instructor/modules/courses/${courseId}?page=${page}&size=${size}`);
  }
};

export const instructorLessonApi = {
  createLesson: (moduleId, formData) => api.post(`/api/instructor/lessons/modules/${moduleId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  updateLesson: (lessonId, formData) => api.put(`/api/instructor/lessons/${lessonId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  deleteLesson: (lessonId) => api.delete(`/api/instructor/lessons/${lessonId}`),
  getModuleLessons: (moduleId, page = 0, size = 100) => {
    return api.get(`/api/instructor/lessons/modules/${moduleId}?page=${page}&size=${size}`);
  }
};

export default api;
