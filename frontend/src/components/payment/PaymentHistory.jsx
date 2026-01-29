import React, { useState } from "react";
import { Download, Printer, Search } from "lucide-react";
import {
  formatTime,
  formatDate,
  calculateDuration,
  formatCurrency,
  getVehicleTypeDisplay,
} from "@/utils/formatters";
import Loading from "@/components/common/Loading";

const PaymentHistory = ({
  payments = [],
  isLoading = false,
  onPrint = null,
  onExport = null,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchSearch =
      !searchTerm ||
      payment.plate_number?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDate =
      !filterDate || formatDate(payment.time_out, "yyyy-MM-dd") === filterDate;

    return matchSearch && matchDate;
  });

  // Calculate total revenue
  const totalRevenue = filteredPayments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0,
  );

  if (isLoading) {
    return <Loading message="Đang tải lịch sử thanh toán..." />;
  }

  return (
    <div className="space-y-4">
      {/* Filters and actions */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo biển số..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Date filter */}
          <div className="w-full md:w-48">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="input"
            />
          </div>

          {/* Export button */}
          {onExport && (
            <button
              onClick={onExport}
              className="btn btn-secondary whitespace-nowrap"
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </button>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Tổng số giao dịch:{" "}
            <span className="font-semibold text-slate-900">
              {filteredPayments.length}
            </span>
          </p>
          <p className="text-sm text-slate-600">
            Tổng doanh thu:{" "}
            <span className="font-semibold text-green-600 text-lg">
              {formatCurrency(totalRevenue)}
            </span>
          </p>
        </div>
      </div>

      {/* Payment list */}
      {filteredPayments.length === 0 ? (
        <div className="empty-state">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg font-medium text-slate-600">
            {searchTerm || filterDate
              ? "Không tìm thấy giao dịch"
              : "Chưa có giao dịch nào"}
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Biển số
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Loại xe
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Giờ vào
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Giờ ra
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Thời gian
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Số tiền
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id || payment._id}
                    className="table-row-hover"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {payment.plate_number}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {getVehicleTypeDisplay(payment.vehicle_type)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatTime(payment.time_in)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatTime(payment.time_out)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {calculateDuration(payment.time_in, payment.time_out)}
                    </td>
                    <td className="px-4 py-3 text-green-600 font-medium">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 py-3">
                      {onPrint && (
                        <button
                          onClick={() => onPrint(payment)}
                          className="px-3 py-1 rounded-lg bg-slate-500 hover:bg-slate-600 text-white text-sm font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <Printer className="w-4 h-4" />
                          In
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
