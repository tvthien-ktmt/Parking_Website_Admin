import React, { createContext, useState, useEffect, useCallback } from "react";
import authService from "@/services/authService";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/utils/constants";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize auth state from localStorage
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        const isAuth = authService.isAuthenticated();

        if (currentUser && isAuth) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Init auth error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (username, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await authService.login(username, password);

      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        return {
          success: true,
          message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        };
      } else {
        setError(result.message);
        return {
          success: false,
          message: result.message || ERROR_MESSAGES.INVALID_CREDENTIALS,
        };
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.message || ERROR_MESSAGES.INVALID_CREDENTIALS;
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      return {
        success: true,
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
      };
    } catch (err) {
      console.error("Logout error:", err);
      // Even if logout fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
      return {
        success: true,
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await authService.updateProfile(userData);

      if (result.success) {
        setUser(result.data);
        return {
          success: true,
          message: "Cập nhật thông tin thành công",
        };
      } else {
        setError(result.message);
        return {
          success: false,
          message: result.message,
        };
      }
    } catch (err) {
      console.error("Update profile error:", err);
      const errorMessage = err.message || "Cập nhật thất bại";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Change password
   */
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await authService.changePassword(oldPassword, newPassword);

      if (result.success) {
        return {
          success: true,
          message: result.message,
        };
      } else {
        setError(result.message);
        return {
          success: false,
          message: result.message,
        };
      }
    } catch (err) {
      console.error("Change password error:", err);
      const errorMessage = err.message || "Đổi mật khẩu thất bại";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
