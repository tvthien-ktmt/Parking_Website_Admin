import React, { useState } from "react";
import { useParkingData } from "@/hooks/useParkingData";
import { useWebSocket } from "@/hooks/useWebSocket";
import PaymentHistory from "@/components/payment/PaymentHistory";
import paymentService from "@/services/paymentService";

const PaidParking = () => {
  const { paidSessions, isLoading, refreshData } = useParkingData();
  const [selectedDate, setSelectedDate] = useState("");

  // WebSocket for real-time updates
  useWebSocket(
    (data) => {
      console.log("PaidParking received update:", data);
      refreshData();
    },
    (data) => {
      console.log("PaidParking received payment:", data);
      refreshData();
    },
  );

  // Filter by today by default
  const today = new Date().toISOString().split("T")[0];
  const filteredSessions = selectedDate
    ? paidSessions.filter(
        (s) =>
          new Date(s.time_out).toISOString().split("T")[0] === selectedDate,
      )
    : paidSessions.filter(
        (s) => new Date(s.time_out).toISOString().split("T")[0] === today,
      );

  // Handle print receipt
  const handlePrint = async (session) => {
    try {
      const result = await paymentService.printReceipt(
        session.id || session._id,
      );
      if (!result.success) {
        alert(result.message);
      }
    } catch (error) {
      console.error("Print error:", error);
      alert("Có lỗi xảy ra khi in hóa đơn");
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const result = await paymentService.exportToCSV({
        date: selectedDate || today,
      });
      if (!result.success) {
        alert(result.message);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Có lỗi xảy ra khi xuất file");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              Đã thanh toán
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                {filteredSessions.length}
              </span>
            </h2>
            <p className="text-slate-600">
              Danh sách các giao dịch đã thanh toán
            </p>
          </div>

          {/* Date filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">Ngày:</label>
            <input
              type="date"
              value={selectedDate || today}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input w-auto"
            />
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="glass-card rounded-2xl overflow-hidden p-6">
        <PaymentHistory
          payments={filteredSessions}
          isLoading={isLoading}
          onPrint={handlePrint}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};

export default PaidParking;
