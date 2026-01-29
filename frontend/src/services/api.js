import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS, ERROR_MESSAGES } from "@/utils/constants";

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * Add authorization token to requests
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log("API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

/**
 * Response interceptor
 * Handle common response scenarios
 */
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log("API Response:", {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_INFO);
          window.location.href = "/login";
          return Promise.reject({
            message: ERROR_MESSAGES.UNAUTHORIZED,
            status,
          });

        case 403:
          // Forbidden
          return Promise.reject({
            message: ERROR_MESSAGES.FORBIDDEN,
            status,
          });

        case 404:
          // Not found
          return Promise.reject({
            message: data?.message || ERROR_MESSAGES.NOT_FOUND,
            status,
          });

        case 422:
          // Validation error
          return Promise.reject({
            message: data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
            errors: data?.errors || {},
            status,
          });

        case 500:
        case 502:
        case 503:
          // Server error
          return Promise.reject({
            message: ERROR_MESSAGES.SERVER_ERROR,
            status,
          });

        default:
          return Promise.reject({
            message: data?.message || "Có lỗi xảy ra",
            status,
          });
      }
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
        status: 0,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || "Có lỗi xảy ra",
        status: 0,
      });
    }
  },
);

/**
 * API helper methods
 */
export const apiHelper = {
  /**
   * GET request
   * @param {string} url - Request URL
   * @param {object} params - Query parameters
   * @returns {Promise} Response promise
   */
  get: (url, params = {}) => {
    return api.get(url, { params });
  },

  /**
   * POST request
   * @param {string} url - Request URL
   * @param {object} data - Request body
   * @returns {Promise} Response promise
   */
  post: (url, data = {}) => {
    return api.post(url, data);
  },

  /**
   * PUT request
   * @param {string} url - Request URL
   * @param {object} data - Request body
   * @returns {Promise} Response promise
   */
  put: (url, data = {}) => {
    return api.put(url, data);
  },

  /**
   * PATCH request
   * @param {string} url - Request URL
   * @param {object} data - Request body
   * @returns {Promise} Response promise
   */
  patch: (url, data = {}) => {
    return api.patch(url, data);
  },

  /**
   * DELETE request
   * @param {string} url - Request URL
   * @returns {Promise} Response promise
   */
  delete: (url) => {
    return api.delete(url);
  },

  /**
   * Upload file
   * @param {string} url - Request URL
   * @param {FormData} formData - Form data with file
   * @param {function} onUploadProgress - Progress callback
   * @returns {Promise} Response promise
   */
  upload: (url, formData, onUploadProgress = null) => {
    return api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },

  /**
   * Download file
   * @param {string} url - Request URL
   * @param {string} filename - Download filename
   * @returns {Promise} Response promise
   */
  download: async (url, filename) => {
    try {
      const response = await api.get(url, {
        responseType: "blob",
      });

      // Create download link
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);

      return response;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * Set authorization token
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }
};

/**
 * Clear authorization token
 */
export const clearAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return !!token;
};

export default api;
