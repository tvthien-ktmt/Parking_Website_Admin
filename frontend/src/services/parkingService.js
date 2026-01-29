import { apiHelper } from "./api";

/**
 * Parking Service
 * Handles all parking session related operations
 */
class ParkingService {
  /**
   * Get all parking sessions
   * @param {object} params - Query parameters
   * @returns {Promise<object>} Parking sessions list
   */
  async getAllSessions(params = {}) {
    try {
      const response = await apiHelper.get("/parking/sessions", params);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get all sessions error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi lấy danh sách xe",
      };
    }
  }

  /**
   * Get parking session by ID
   * @param {string} sessionId - Session ID
   * @returns {Promise<object>} Parking session data
   */
  async getSessionById(sessionId) {
    try {
      const response = await apiHelper.get(`/parking/sessions/${sessionId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get session error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi lấy thông tin xe",
      };
    }
  }

  /**
   * Get active parking sessions (IN_PARKING)
   * @returns {Promise<object>} Active sessions list
   */
  async getActiveSessions() {
    try {
      const response = await apiHelper.get("/parking/sessions", {
        status: "IN_PARKING",
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get active sessions error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi lấy danh sách xe đang gửi",
      };
    }
  }

  /**
   * Get paid sessions
   * @param {string} date - Date filter (YYYY-MM-DD)
   * @returns {Promise<object>} Paid sessions list
   */
  async getPaidSessions(date = null) {
    try {
      const params = {
        status: "PAID",
      };

      if (date) {
        params.date = date;
      }

      const response = await apiHelper.get("/parking/sessions", params);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get paid sessions error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi lấy danh sách xe đã thanh toán",
      };
    }
  }

  /**
   * Get debt sessions
   * @returns {Promise<object>} Debt sessions list
   */
  async getDebtSessions() {
    try {
      const response = await apiHelper.get("/parking/sessions", {
        status: "DEBT,UNPAID",
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get debt sessions error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi lấy danh sách xe nợ",
      };
    }
  }

  /**
   * Create new parking session (vehicle check-in)
   * @param {object} sessionData - Session data
   * @returns {Promise<object>} Created session
   */
  async createSession(sessionData) {
    try {
      const response = await apiHelper.post("/parking/sessions", sessionData);
      return {
        success: true,
        data: response.data,
        message: "Thêm xe vào bãi thành công",
      };
    } catch (error) {
      console.error("Create session error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi thêm xe vào bãi",
      };
    }
  }

  /**
   * Vehicle check-out (end parking session)
   * @param {string} sessionId - Session ID
   * @returns {Promise<object>} Updated session with payment info
   */
  async checkoutVehicle(sessionId) {
    try {
      const response = await apiHelper.post(
        `/parking/sessions/${sessionId}/checkout`,
      );
      return {
        success: true,
        data: response.data,
        message: "Xe ra thành công",
      };
    } catch (error) {
      console.error("Checkout vehicle error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi xử lý xe ra",
      };
    }
  }

  /**
   * Update parking session
   * @param {string} sessionId - Session ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} Updated session
   */
  async updateSession(sessionId, updateData) {
    try {
      const response = await apiHelper.put(
        `/parking/sessions/${sessionId}`,
        updateData,
      );
      return {
        success: true,
        data: response.data,
        message: "Cập nhật thành công",
      };
    } catch (error) {
      console.error("Update session error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi cập nhật",
      };
    }
  }

  /**
   * Delete parking session
   * @param {string} sessionId - Session ID
   * @returns {Promise<object>} Delete result
   */
  async deleteSession(sessionId) {
    try {
      await apiHelper.delete(`/parking/sessions/${sessionId}`);
      return {
        success: true,
        message: "Xóa thành công",
      };
    } catch (error) {
      console.error("Delete session error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi xóa",
      };
    }
  }

  /**
   * Search sessions by plate number
   * @param {string} plateNumber - Plate number to search
   * @returns {Promise<object>} Search results
   */
  async searchByPlate(plateNumber) {
    try {
      const response = await apiHelper.get("/parking/sessions/search", {
        plate: plateNumber,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Search by plate error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi tìm kiếm",
      };
    }
  }

  /**
   * Get statistics
   * @param {string} date - Date filter (YYYY-MM-DD)
   * @returns {Promise<object>} Statistics data
   */
  async getStatistics(date = null) {
    try {
      const params = date ? { date } : {};
      const response = await apiHelper.get("/parking/statistics", params);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get statistics error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi lấy thống kê",
      };
    }
  }

  /**
   * Get revenue report
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<object>} Revenue report
   */
  async getRevenueReport(startDate, endDate) {
    try {
      const response = await apiHelper.get("/parking/revenue", {
        start_date: startDate,
        end_date: endDate,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get revenue report error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi lấy báo cáo doanh thu",
      };
    }
  }

  /**
   * Calculate temporary fee
   * @param {object} params - { vehicleType, timeIn, timeOut }
   * @returns {Promise<object>} Calculated fee
   */
  async calculateFee(params) {
    try {
      const response = await apiHelper.post("/parking/calculate-fee", params);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Calculate fee error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi tính phí",
      };
    }
  }

  /**
   * Get vehicle history by plate number
   * @param {string} plateNumber - Plate number
   * @returns {Promise<object>} Vehicle history
   */
  async getVehicleHistory(plateNumber) {
    try {
      const response = await apiHelper.get(`/parking/history/${plateNumber}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get vehicle history error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi lấy lịch sử xe",
      };
    }
  }

  /**
   * Export sessions to CSV
   * @param {object} params - Export parameters
   * @returns {Promise<object>} Export result
   */
  async exportToCSV(params = {}) {
    try {
      const response = await apiHelper.download(
        "/parking/export/csv",
        "parking-sessions.csv",
      );
      return {
        success: true,
        message: "Xuất file thành công",
      };
    } catch (error) {
      console.error("Export CSV error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi xuất file",
      };
    }
  }
}

// Export singleton instance
export default new ParkingService();
