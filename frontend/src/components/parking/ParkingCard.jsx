import React from "react";
import { Clock, Calendar, DollarSign } from "lucide-react";
import {
  formatTime,
  formatDate,
  calculateDuration,
  formatCurrency,
  getVehicleTypeDisplay,
} from "@/utils/formatters";
import { PARKING_STATUS } from "@/utils/constants";

const ParkingCard = ({
  session,
  onCheckout = null,
  onCollectDebt = null,
  onViewDetails = null,
}) => {
  // Get status badge
  const getStatusBadge = () => {
    switch (session.status) {
      case PARKING_STATUS.IN_PARKING:
        return (
          <span className="status-badge status-badge-parking">🚗 Đang gửi</span>
        );
      case PARKING_STATUS.PAID:
        return (
          <span className="status-badge status-badge-paid">Đã thanh toán</span>
        );
      case PARKING_STATUS.DEBT:
      case PARKING_STATUS.UNPAID:
        return <span className="status-badge status-badge-debt"> Còn nợ</span>;
      case PARKING_STATUS.WAIT_PAYMENT:
        return (
          <span className="status-badge status-badge-wait">Chờ thanh toán</span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 hover-lift">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-bold text-slate-900 mb-1">
            {session.plate_number}
          </h4>
          <p className="text-sm text-slate-600">
            {getVehicleTypeDisplay(session.vehicle_type)}
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>
            Vào: {formatDate(session.time_in)} {formatTime(session.time_in)}
          </span>
        </div>

        {session.time_out && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>
              Ra: {formatDate(session.time_out)} {formatTime(session.time_out)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="w-4 h-4" />
          <span>
            Thời gian: {calculateDuration(session.time_in, session.time_out)}
          </span>
        </div>

        {session.amount > 0 && (
          <div className="flex items-center gap-2 text-sm font-medium text-cyan-600">
            <DollarSign className="w-4 h-4" />
            <span>{formatCurrency(session.amount)}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {session.status === PARKING_STATUS.IN_PARKING && onCheckout && (
          <button
            onClick={() => onCheckout(session)}
            className="flex-1 btn btn-success text-sm"
          >
            Xe ra
          </button>
        )}

        {(session.status === PARKING_STATUS.DEBT ||
          session.status === PARKING_STATUS.UNPAID) &&
          onCollectDebt && (
            <button
              onClick={() => onCollectDebt(session)}
              className="flex-1 btn btn-danger text-sm"
            >
              Thu nợ
            </button>
          )}

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(session)}
            className="flex-1 btn btn-secondary text-sm"
          >
            Chi tiết
          </button>
        )}
      </div>
    </div>
  );
};

export default ParkingCard;
