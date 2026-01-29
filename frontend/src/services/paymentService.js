import { apiHelper } from "./api";

/**
 * Payment Service
 * Handles all payment related operations
 */
class PaymentService {
  /**
   * Create QR payment
   * @param {string} sessionId - Parking session ID
   * @returns {Promise<object>} QR code data
   */
  async createQRPayment(sessionId) {
    try {
      const response = await apiHelper.post(`/payment/create-qr`, {
        session_id: sessionId,
      });
      return {
        success: true,
        data: response.data,
        message: "Tạo mã QR thành công",
      };
    } catch (error) {
      console.error("Create QR payment error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi tạo mã QR",
      };
    }
  }

  /**
   * Get payment by ID
   * @param {string} paymentId - Payment ID
   * @returns {Promise<object>} Payment data
   */
  async getPaymentById(paymentId) {
    try {
      const response = await apiHelper.get(`/payment/${paymentId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get payment error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi lấy thông tin thanh toán",
      };
    }
  }

  /**
   * Check payment status
   * @param {string} sessionId - Parking session ID
   * @returns {Promise<object>} Payment status
   */
  async checkPaymentStatus(sessionId) {
    try {
      const response = await apiHelper.get(`/payment/status/${sessionId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Check payment status error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi kiểm tra trạng thái thanh toán",
      };
    }
  }

  /**
   * Confirm payment manually
   * @param {string} sessionId - Parking session ID
   * @returns {Promise<object>} Confirmation result
   */
  async confirmPayment(sessionId) {
    try {
      const response = await apiHelper.post(`/payment/confirm`, {
        session_id: sessionId,
      });
      return {
        success: true,
        data: response.data,
        message: "Xác nhận thanh toán thành công",
      };
    } catch (error) {
      console.error("Confirm payment error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi xác nhận thanh toán",
      };
    }
  }

  /**
   * Mark payment as unpaid/debt
   * @param {string} sessionId - Parking session ID
   * @returns {Promise<object>} Mark unpaid result
   */
  async markAsUnpaid(sessionId) {
    try {
      const response = await apiHelper.post(`/payment/mark-unpaid`, {
        session_id: sessionId,
      });
      return {
        success: true,
        data: response.data,
        message: "Đã đánh dấu xe nợ",
      };
    } catch (error) {
      console.error("Mark unpaid error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi đánh dấu xe nợ",
      };
    }
  }

  /**
   * Collect debt payment
   * @param {string} sessionId - Parking session ID
   * @param {object} paymentData - Payment data
   * @returns {Promise<object>} Collection result
   */
  async collectDebt(sessionId, paymentData = {}) {
    try {
      const response = await apiHelper.post(`/payment/collect-debt`, {
        session_id: sessionId,
        ...paymentData,
      });
      return {
        success: true,
        data: response.data,
        message: "Thu nợ thành công",
      };
    } catch (error) {
      console.error("Collect debt error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi thu nợ",
      };
    }
  }

  /**
   * Get all payments
   * @param {object} params - Query parameters
   * @returns {Promise<object>} Payments list
   */
  async getAllPayments(params = {}) {
    try {
      const response = await apiHelper.get("/payment", params);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get all payments error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi lấy danh sách thanh toán",
      };
    }
  }

  /**
   * Get payment history
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<object>} Payment history
   */
  async getPaymentHistory(startDate, endDate) {
    try {
      const response = await apiHelper.get("/payment/history", {
        start_date: startDate,
        end_date: endDate,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get payment history error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi lấy lịch sử thanh toán",
      };
    }
  }

  /**
   * Get payment statistics
   * @param {string} date - Date filter (YYYY-MM-DD)
   * @returns {Promise<object>} Payment statistics
   */
  async getPaymentStatistics(date = null) {
    try {
      const params = date ? { date } : {};
      const response = await apiHelper.get("/payment/statistics", params);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get payment statistics error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi lấy thống kê thanh toán",
      };
    }
  }

  /**
   * Refund payment
   * @param {string} paymentId - Payment ID
   * @param {string} reason - Refund reason
   * @returns {Promise<object>} Refund result
   */
  async refundPayment(paymentId, reason = "") {
    try {
      const response = await apiHelper.post(`/payment/refund`, {
        payment_id: paymentId,
        reason,
      });
      return {
        success: true,
        data: response.data,
        message: "Hoàn tiền thành công",
      };
    } catch (error) {
      console.error("Refund payment error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi hoàn tiền",
      };
    }
  }

  /**
   * Get receipt data
   * @param {string} sessionId - Parking session ID
   * @returns {Promise<object>} Receipt data
   */
  async getReceipt(sessionId) {
    try {
      const response = await apiHelper.get(`/payment/receipt/${sessionId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get receipt error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi lấy hóa đơn",
      };
    }
  }

  /**
   * Print receipt
   * @param {string} sessionId - Parking session ID
   * @returns {Promise<object>} Print result
   */
  async printReceipt(sessionId) {
    try {
      const receiptResult = await this.getReceipt(sessionId);

      if (receiptResult.success) {
        // Open print dialog
        const printWindow = window.open("", "_blank");
        printWindow.document.write(
          this.generateReceiptHTML(receiptResult.data),
        );
        printWindow.document.close();
        printWindow.print();

        return {
          success: true,
          message: "In hóa đơn thành công",
        };
      } else {
        throw new Error(receiptResult.message);
      }
    } catch (error) {
      console.error("Print receipt error:", error);
      return {
        success: false,
        message: error.message || "Lỗi khi in hóa đơn",
      };
    }
  }

  /**
   * Generate receipt HTML
   * @param {object} receiptData - Receipt data
   * @returns {string} HTML string
   */
  generateReceiptHTML(receiptData) {
    const { session, payment, company } = receiptData;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hóa đơn gửi xe</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; }
            .receipt { max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin: 5px 0; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .total { font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>${company.name}</h2>
              <p>${company.address}</p>
              <p>Tel: ${company.phone}</p>
            </div>
            <div class="divider"></div>
            <div class="row">
              <span>Biển số:</span>
              <span><strong>${session.plate_number}</strong></span>
            </div>
            <div class="row">
              <span>Loại xe:</span>
              <span>${session.vehicle_type}</span>
            </div>
            <div class="row">
              <span>Giờ vào:</span>
              <span>${session.time_in}</span>
            </div>
            <div class="row">
              <span>Giờ ra:</span>
              <span>${session.time_out}</span>
            </div>
            <div class="divider"></div>
            <div class="row total">
              <span>Tổng tiền:</span>
              <span>${payment.amount}đ</span>
            </div>
            <div class="divider"></div>
            <div class="header">
              <p>Cảm ơn quý khách!</p>
              <p>${new Date().toLocaleString("vi-VN")}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Export payments to CSV
   * @param {object} params - Export parameters
   * @returns {Promise<object>} Export result
   */
  async exportToCSV(params = {}) {
    try {
      await apiHelper.download("/payment/export/csv", "payments.csv");
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
export default new PaymentService();
