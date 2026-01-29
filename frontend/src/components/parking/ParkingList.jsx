import React, { useState } from "react";
import {
  formatTime,
  calculateDuration,
  formatCurrency,
  getVehicleTypeDisplay,
} from "@/utils/formatters";
import { PARKING_STATUS } from "@/utils/constants";
import Loading from "@/components/common/Loading";

const ParkingList = ({
  sessions = [],
  isLoading = false,
  onCheckout = null,
  onCollectDebt = null,
  onPrint = null,
  emptyMessage = "Không có dữ liệu",
}) => {
  const [sortField, setSortField] = useState("time_in");
  const [sortOrder, setSortOrder] = useState("desc");

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Sort sessions
  const sortedSessions = [...sessions].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case PARKING_STATUS.IN_PARKING:
        return (
          <span className="status-badge status-badge-parking">Đang gửi</span>
        );
      case PARKING_STATUS.PAID:
        return <span className="status-badge status-badge-paid">Đã TT</span>;
      case PARKING_STATUS.DEBT:
      case PARKING_STATUS.UNPAID:
        return <span className="status-badge status-badge-debt">Nợ</span>;
      case PARKING_STATUS.WAIT_PAYMENT:
        return <span className="status-badge status-badge-wait">Chờ TT</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <Loading message="Đang tải dữ liệu..." />;
  }

  if (sessions.length === 0) {
    return (
      <div className="empty-state">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-lg font-medium text-slate-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-100 border-b border-slate-200">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-200"
              onClick={() => handleSort("plate_number")}
            >
              Biển số{" "}
              {sortField === "plate_number" &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-200"
              onClick={() => handleSort("vehicle_type")}
            >
              Loại xe{" "}
              {sortField === "vehicle_type" &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-200"
              onClick={() => handleSort("time_in")}
            >
              Giờ vào{" "}
              {sortField === "time_in" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
              Thời gian gửi
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-200"
              onClick={() => handleSort("amount")}
            >
              Số tiền{" "}
              {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {sortedSessions.map((session) => (
            <tr key={session.id || session._id} className="table-row-hover">
              <td className="px-4 py-3 font-semibold text-slate-900">
                {session.plate_number}
              </td>
              <td className="px-4 py-3 text-slate-700">
                {getVehicleTypeDisplay(session.vehicle_type)}
              </td>
              <td className="px-4 py-3 text-slate-700">
                {formatTime(session.time_in)}
              </td>
              <td className="px-4 py-3 text-slate-700">
                {calculateDuration(session.time_in, session.time_out)}
              </td>
              <td className="px-4 py-3 text-cyan-600 font-medium">
                {session.amount > 0 ? formatCurrency(session.amount) : "--"}
              </td>
              <td className="px-4 py-3">{getStatusBadge(session.status)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {session.status === PARKING_STATUS.IN_PARKING &&
                    onCheckout && (
                      <button
                        onClick={() => onCheckout(session)}
                        className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
                      >
                        Xe ra
                      </button>
                    )}

                  {(session.status === PARKING_STATUS.DEBT ||
                    session.status === PARKING_STATUS.UNPAID) &&
                    onCollectDebt && (
                      <button
                        onClick={() => onCollectDebt(session)}
                        className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                      >
                        Thu nợ
                      </button>
                    )}

                  {session.status === PARKING_STATUS.PAID && onPrint && (
                    <button
                      onClick={() => onPrint(session)}
                      className="px-3 py-1 rounded-lg bg-slate-500 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
                    >
                      🖨️ In
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParkingList;
