import React from "react";
import { useParkingData } from "@/hooks/useParkingData";
import { useWebSocket } from "@/hooks/useWebSocket";
import DebtList from "@/components/payment/DebtList";
import paymentService from "@/services/paymentService";

const DebtParking = () => {
  const { debtSessions, isLoading, updateSession, refreshData } =
    useParkingData();

  // WebSocket for real-time updates
  useWebSocket((data) => {
    console.log("DebtParking received update:", data);
    refreshData();
  }, null);

  // Handle collect debt
  const handleCollectDebt = async (session) => {
    const confirmed = window.confirm(
      `Xác nhận thu nợ cho xe ${session.plate_number}?\nSố tiền: ${new Intl.NumberFormat("vi-VN").format(session.amount)}đ`,
    );

    if (!confirmed) return;

    try {
      const result = await paymentService.collectDebt(
        session.id || session._id,
      );

      if (result.success) {
        // Update session status to PAID
        await updateSession(session.id || session._id, {
          status: "PAID",
        });
        alert("Thu nợ thành công!");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Collect debt error:", error);
      alert("Có lỗi xảy ra khi thu nợ");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              Xe còn nợ / Chưa thanh toán
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                {debtSessions.length}
              </span>
            </h2>
            <p className="text-slate-600">
              Danh sách các xe chưa thanh toán hoặc còn nợ
            </p>
          </div>

          {debtSessions.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              <p className="text-sm text-red-900 font-medium">
                Tổng tiền nợ:{" "}
                {new Intl.NumberFormat("vi-VN").format(
                  debtSessions.reduce((sum, s) => sum + (s.amount || 0), 0),
                )}
                đ
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Debt List */}
      <DebtList
        debtSessions={debtSessions}
        isLoading={isLoading}
        onCollectDebt={handleCollectDebt}
      />

      {/* Warning message */}
      {debtSessions.length > 0 && (
        <div className="glass-card rounded-xl p-4 bg-yellow-50 border-yellow-200">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">
                Lưu ý về xe nợ
              </h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Hệ thống sẽ tự động cảnh báo khi xe này vào lại</li>
                <li>• Yêu cầu thanh toán nợ trước khi cho phép gửi xe</li>
                <li>• Lưu trữ thông tin để tra cứu sau này</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtParking;
