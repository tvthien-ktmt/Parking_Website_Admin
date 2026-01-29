import React, { createContext, useState, useEffect, useCallback } from "react";
import parkingService from "@/services/parkingService";
import { PARKING_STATUS } from "@/utils/constants";

export const ParkingContext = createContext(null);

export const ParkingProvider = ({ children }) => {
  const [allSessions, setAllSessions] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [paidSessions, setPaidSessions] = useState([]);
  const [debtSessions, setDebtSessions] = useState([]);
  const [statistics, setStatistics] = useState({
    totalParking: 0,
    totalPaid: 0,
    totalDebt: 0,
    todayRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all sessions
   */
  const fetchAllSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await parkingService.getAllSessions();

      if (result.success) {
        setAllSessions(result.data || []);
        updateSessionsByStatus(result.data || []);
        calculateStatistics(result.data || []);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Fetch all sessions error:", err);
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update sessions by status
   */
  const updateSessionsByStatus = useCallback((sessions) => {
    const active = sessions.filter(
      (s) => s.status === PARKING_STATUS.IN_PARKING,
    );
    const paid = sessions.filter((s) => s.status === PARKING_STATUS.PAID);
    const debt = sessions.filter(
      (s) =>
        s.status === PARKING_STATUS.DEBT || s.status === PARKING_STATUS.UNPAID,
    );

    setActiveSessions(active);
    setPaidSessions(paid);
    setDebtSessions(debt);
  }, []);

  /**
   * Calculate statistics
   */
  const calculateStatistics = useCallback((sessions) => {
    const today = new Date().toDateString();

    const active = sessions.filter(
      (s) => s.status === PARKING_STATUS.IN_PARKING,
    );
    const paidToday = sessions.filter(
      (s) =>
        s.status === PARKING_STATUS.PAID &&
        new Date(s.time_out).toDateString() === today,
    );
    const debt = sessions.filter(
      (s) =>
        s.status === PARKING_STATUS.DEBT || s.status === PARKING_STATUS.UNPAID,
    );

    const todayRevenue = paidToday.reduce((sum, s) => sum + (s.amount || 0), 0);

    setStatistics({
      totalParking: active.length,
      totalPaid: paidToday.length,
      totalDebt: debt.length,
      todayRevenue,
    });
  }, []);

  /**
   * Fetch active sessions
   */
  const fetchActiveSessions = useCallback(async () => {
    try {
      const result = await parkingService.getActiveSessions();
      if (result.success) {
        setActiveSessions(result.data || []);
      }
    } catch (err) {
      console.error("Fetch active sessions error:", err);
    }
  }, []);

  /**
   * Fetch paid sessions
   */
  const fetchPaidSessions = useCallback(async (date = null) => {
    try {
      const result = await parkingService.getPaidSessions(date);
      if (result.success) {
        setPaidSessions(result.data || []);
      }
    } catch (err) {
      console.error("Fetch paid sessions error:", err);
    }
  }, []);

  /**
   * Fetch debt sessions
   */
  const fetchDebtSessions = useCallback(async () => {
    try {
      const result = await parkingService.getDebtSessions();
      if (result.success) {
        setDebtSessions(result.data || []);
      }
    } catch (err) {
      console.error("Fetch debt sessions error:", err);
    }
  }, []);

  /**
   * Add new session (vehicle check-in)
   */
  const addSession = useCallback(
    async (sessionData) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await parkingService.createSession(sessionData);

        if (result.success) {
          // Refresh all sessions
          await fetchAllSessions();
          return {
            success: true,
            message: result.message,
            data: result.data,
          };
        } else {
          setError(result.message);
          return {
            success: false,
            message: result.message,
          };
        }
      } catch (err) {
        console.error("Add session error:", err);
        const errorMessage = err.message || "Lỗi khi thêm xe vào bãi";
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAllSessions],
  );

  /**
   * Update session
   */
  const updateSession = useCallback(
    async (sessionId, updateData) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await parkingService.updateSession(
          sessionId,
          updateData,
        );

        if (result.success) {
          // Update local state
          setAllSessions((prev) =>
            prev.map((s) =>
              s.id === sessionId ? { ...s, ...result.data } : s,
            ),
          );
          updateSessionsByStatus(allSessions);
          calculateStatistics(allSessions);

          return {
            success: true,
            message: result.message,
            data: result.data,
          };
        } else {
          setError(result.message);
          return {
            success: false,
            message: result.message,
          };
        }
      } catch (err) {
        console.error("Update session error:", err);
        const errorMessage = err.message || "Lỗi khi cập nhật";
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [allSessions, updateSessionsByStatus, calculateStatistics],
  );

  /**
   * Checkout vehicle
   */
  const checkoutVehicle = useCallback(
    async (sessionId) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await parkingService.checkoutVehicle(sessionId);

        if (result.success) {
          // Refresh all sessions
          await fetchAllSessions();
          return {
            success: true,
            message: result.message,
            data: result.data,
          };
        } else {
          setError(result.message);
          return {
            success: false,
            message: result.message,
          };
        }
      } catch (err) {
        console.error("Checkout vehicle error:", err);
        const errorMessage = err.message || "Lỗi khi xử lý xe ra";
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAllSessions],
  );

  /**
   * Delete session
   */
  const deleteSession = useCallback(
    async (sessionId) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await parkingService.deleteSession(sessionId);

        if (result.success) {
          // Remove from local state
          setAllSessions((prev) => prev.filter((s) => s.id !== sessionId));
          updateSessionsByStatus(allSessions.filter((s) => s.id !== sessionId));
          calculateStatistics(allSessions.filter((s) => s.id !== sessionId));

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
        console.error("Delete session error:", err);
        const errorMessage = err.message || "Lỗi khi xóa";
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [allSessions, updateSessionsByStatus, calculateStatistics],
  );

  /**
   * Search sessions by plate number
   */
  const searchByPlate = useCallback(async (plateNumber) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await parkingService.searchByPlate(plateNumber);

      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        setError(result.message);
        return {
          success: false,
          message: result.message,
        };
      }
    } catch (err) {
      console.error("Search by plate error:", err);
      const errorMessage = err.message || "Lỗi khi tìm kiếm";
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
   * Get vehicle history
   */
  const getVehicleHistory = useCallback(async (plateNumber) => {
    try {
      const result = await parkingService.getVehicleHistory(plateNumber);
      return result;
    } catch (err) {
      console.error("Get vehicle history error:", err);
      return {
        success: false,
        message: err.message || "Lỗi khi lấy lịch sử xe",
      };
    }
  }, []);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await fetchAllSessions();
  }, [fetchAllSessions]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Initialize data on mount
   */
  useEffect(() => {
    fetchAllSessions();
  }, [fetchAllSessions]);

  const value = {
    // State
    allSessions,
    activeSessions,
    paidSessions,
    debtSessions,
    statistics,
    isLoading,
    error,

    // Methods
    fetchAllSessions,
    fetchActiveSessions,
    fetchPaidSessions,
    fetchDebtSessions,
    addSession,
    updateSession,
    checkoutVehicle,
    deleteSession,
    searchByPlate,
    getVehicleHistory,
    refreshData,
    clearError,
  };

  return (
    <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>
  );
};

export default ParkingContext;
