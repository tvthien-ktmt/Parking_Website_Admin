import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  formatTime,
  formatDate,
  calculateDuration,
  formatCurrency,
  getVehicleTypeDisplay,
} from "@/utils/formatters";
import Loading from "@/components/common/Loading";

const DebtList = ({
  debtSessions = [],
  isLoading = false,
  onCollectDebt = null,
}) => {
  if (isLoading) {
    return <Loading message="Đang tải danh sách xe nợ..." />;
  }

  if (debtSessions.length === 0) {
    return (
      <div className="empty-state">
        <p className="text-lg font-medium text-slate-600">Không có xe nợ</p>
        <p className="text-sm text-slate-500 mt-2">
          Tất cả xe đã thanh toán đầy đủ
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="glass-card rounded-xl p-4 bg-red-50 border-red-200">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-sm font-medium text-red-900">
              Tổng số xe nợ: {debtSessions.length}
            </p>
            <p className="text-xs text-red-700 mt-1">
              Tổng số tiền nợ:{" "}
              {formatCurrency(
                debtSessions.reduce((sum, s) => sum + (s.amount || 0), 0),
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Debt list */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {debtSessions.map((session) => (
          <div
            key={session.id || session._id}
            className="glass-card rounded-xl p-4 border-2 border-red-200 bg-red-50/50 hover-lift"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {session.plate_number}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {getVehicleTypeDisplay(session.vehicle_type)}
                  </p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-1.5 mb-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Giờ vào:</span>
                <span className="font-medium">
                  {formatDate(session.time_in)} {formatTime(session.time_in)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Giờ ra:</span>
                <span className="font-medium">
                  {formatDate(session.time_out)} {formatTime(session.time_out)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Thời gian:</span>
                <span className="font-medium">
                  {calculateDuration(session.time_in, session.time_out)}
                </span>
              </div>
              <div className="border-t border-red-200 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900">
                  Số tiền nợ:
                </span>
                <span className="text-lg font-bold text-red-600">
                  {formatCurrency(session.amount)}
                </span>
              </div>
            </div>

            {/* Actions */}
            {onCollectDebt && (
              <button
                onClick={() => onCollectDebt(session)}
                className="w-full btn btn-danger"
              >
                Thu nợ ngay
              </button>
            )}

            {/* Note */}
            {session.note && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <span className="font-medium">Ghi chú:</span> {session.note}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebtList;
