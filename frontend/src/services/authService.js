import { apiHelper, setAuthToken, clearAuthToken } from "./api";
import { STORAGE_KEYS, DEMO_CREDENTIALS } from "@/utils/constants";

/**
 * Authentication Service
 */
class AuthService {
  /**
   * Login user
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<object>} User data and token
   */
  async login(username, password) {
    try {
      // For demo purposes, check against hardcoded credentials
      // In production, this would call the actual API
      if (
        username === DEMO_CREDENTIALS.username &&
        password === DEMO_CREDENTIALS.password
      ) {
        // Create mock token and user data
        const mockToken = "demo_token_" + Date.now();
        const mockUser = {
          id: 1,
          username: username,
          fullName: "Administrator",
          role: "admin",
          email: "admin@parking.com",
        };

        // Store token and user info
        setAuthToken(mockToken);
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(mockUser));

        return {
          success: true,
          data: {
            user: mockUser,
            token: mockToken,
          },
        };
      } else {
        throw new Error("Tên đăng nhập hoặc mật khẩu không chính xác");
      }

      // Production code (commented out for demo):
      /*
      const response = await apiHelper.post('/auth/login', {
        username,
        password,
      });

      const { user, token } = response.data;

      // Store token and user info
      setAuthToken(token);
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));

      return {
        success: true,
        data: response.data,
      };
      */
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.message || "Đăng nhập thất bại",
      };
    }
  }

  /**
   * Logout user
   * @returns {Promise<object>} Logout result
   */
  async logout() {
    try {
      // For demo purposes, just clear local storage
      clearAuthToken();

      // Production code (commented out for demo):
      /*
      await apiHelper.post('/auth/logout');
      clearAuthToken();
      */

      return {
        success: true,
        message: "Đăng xuất thành công",
      };
    } catch (error) {
      console.error("Logout error:", error);
      // Clear auth data even if API call fails
      clearAuthToken();
      return {
        success: true,
        message: "Đăng xuất thành công",
      };
    }
  }

  /**
   * Get current user info
   * @returns {object|null} User info or null
   */
  getCurrentUser() {
    try {
      const userJson = localStorage.getItem(STORAGE_KEYS.USER_INFO);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Update user profile
   * @param {object} userData - User data to update
   * @returns {Promise<object>} Update result
   */
  async updateProfile(userData) {
    try {
      const response = await apiHelper.put("/auth/profile", userData);

      // Update stored user info
      const currentUser = this.getCurrentUser();
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(updatedUser));

      return {
        success: true,
        data: updatedUser,
      };
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        success: false,
        message: error.message || "Cập nhật thất bại",
      };
    }
  }

  /**
   * Change password
   * @param {string} oldPassword - Old password
   * @param {string} newPassword - New password
   * @returns {Promise<object>} Change password result
   */
  async changePassword(oldPassword, newPassword) {
    try {
      const response = await apiHelper.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      return {
        success: true,
        message: response.data.message || "Đổi mật khẩu thành công",
      };
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        message: error.message || "Đổi mật khẩu thất bại",
      };
    }
  }

  /**
   * Verify token
   * @returns {Promise<boolean>} True if token is valid
   */
  async verifyToken() {
    try {
      const response = await apiHelper.get("/auth/verify");
      return response.data.valid || false;
    } catch (error) {
      console.error("Verify token error:", error);
      return false;
    }
  }

  /**
   * Refresh token
   * @returns {Promise<object>} New token
   */
  async refreshToken() {
    try {
      const response = await apiHelper.post("/auth/refresh");
      const { token } = response.data;

      // Update token
      setAuthToken(token);

      return {
        success: true,
        data: { token },
      };
    } catch (error) {
      console.error("Refresh token error:", error);
      return {
        success: false,
        message: error.message || "Làm mới token thất bại",
      };
    }
  }
}

// Export singleton instance
export default new AuthService();
