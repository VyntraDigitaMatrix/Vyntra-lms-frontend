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

export default api;
