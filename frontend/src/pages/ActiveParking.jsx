import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useParkingData } from "@/hooks/useParkingData";
import { useWebSocket } from "@/hooks/useWebSocket";
import ParkingList from "@/components/parking/ParkingList";
import Modal from "@/components/common/Modal";
import QRDisplay from "@/components/parking/QRDisplay";
import Loading from "@/components/common/Loading";
import {
  formatTime,
  formatCurrency,
  calculateDuration,
  calculateParkingFee,
  getVehicleTypeDisplay,
} from "@/utils/formatters";
import { validatePlateNumber, validateVehicleType } from "@/utils/validators";
import { VEHICLE_TYPES, MAX_RECORDS } from "@/utils/constants";

const ActiveParking = () => {
  const { activeSessions, isLoading, addSession, updateSession, refreshData } =
    useParkingData();

  // WebSocket for real-time updates
  useWebSocket((data) => {
    console.log("ActiveParking received update:", data);
    refreshData();
  }, null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

  // Add form state
  const [addFormData, setAddFormData] = useState({
    plate_number: "",
    vehicle_type: VEHICLE_TYPES.CAR,
  });
  const [addFormErrors, setAddFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  // Handle add form change
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (addFormErrors[name]) {
      setAddFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate add form
  const validateAddForm = () => {
    const errors = {};

    const plateValidation = validatePlateNumber(addFormData.plate_number);
    if (!plateValidation.isValid) {
      errors.plate_number = plateValidation.message;
    }

    const typeValidation = validateVehicleType(addFormData.vehicle_type);
    if (!typeValidation.isValid) {
      errors.vehicle_type = typeValidation.message;
    }

    setAddFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add vehicle submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!validateAddForm()) {
      return;
    }

    // Check max records limit
    if (activeSessions.length >= MAX_RECORDS) {
      alert(`Đã đạt giới hạn ${MAX_RECORDS} xe trong bãi!`);
      return;
    }

    // Check if vehicle already in parking
    const existing = activeSessions.find(
      (s) => s.plate_number === addFormData.plate_number.toUpperCase(),
    );
    if (existing) {
      setAddFormErrors({
        plate_number: "Xe này đang gửi trong bãi!",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const sessionData = {
        plate_number: addFormData.plate_number.toUpperCase(),
        vehicle_type: addFormData.vehicle_type,
        time_in: new Date().toISOString(),
        status: "IN_PARKING",
      };

      const result = await addSession(sessionData);

      if (result.success) {
        setShowAddModal(false);
        setAddFormData({
          plate_number: "",
          vehicle_type: VEHICLE_TYPES.CAR,
        });
        setAddFormErrors({});
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Add vehicle error:", error);
      alert("Có lỗi xảy ra khi thêm xe");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle checkout
  const handleCheckout = (session) => {
    setCurrentSession(session);
    setShowCheckoutModal(true);
  };

  // Handle confirm payment
  const handleConfirmPayment = async () => {
    if (!currentSession) return;

    try {
      const timeOut = new Date().toISOString();
      const amount = calculateParkingFee(
        currentSession.vehicle_type,
        currentSession.time_in,
        timeOut,
      );

      const result = await updateSession(
        currentSession.id || currentSession._id,
        {
          status: "PAID",
          time_out: timeOut,
          amount: amount,
        },
      );

      if (result.success) {
        setShowCheckoutModal(false);
        setCurrentSession(null);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Confirm payment error:", error);
      alert("Có lỗi xảy ra khi xác nhận thanh toán");
    }
  };

  // Handle mark as unpaid
  const handleMarkUnpaid = async () => {
    if (!currentSession) return;

    const confirmed = window.confirm(
      `Xác nhận đánh dấu xe ${currentSession.plate_number} chưa thanh toán?`,
    );
    if (!confirmed) return;

    try {
      const timeOut = new Date().toISOString();
      const amount = calculateParkingFee(
        currentSession.vehicle_type,
        currentSession.time_in,
        timeOut,
      );

      const result = await updateSession(
        currentSession.id || currentSession._id,
        {
          status: "DEBT",
          time_out: timeOut,
          amount: amount,
        },
      );

      if (result.success) {
        setShowCheckoutModal(false);
        setCurrentSession(null);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Mark unpaid error:", error);
      alert("Có lỗi xảy ra");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              🚗 Xe đang gửi
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                {activeSessions.length}
              </span>
            </h2>
            <p className="text-slate-600">Quản lý các xe đang gửi trong bãi</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm xe vào
          </button>
        </div>
      </div>

      {/* Parking List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <ParkingList
          sessions={activeSessions}
          isLoading={isLoading}
          onCheckout={handleCheckout}
          emptyMessage="Không có xe đang gửi"
        />
      </div>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => !isSubmitting && setShowAddModal(false)}
        title="Thêm xe vào bãi"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label htmlFor="plate_number" className="label">
              Biển số xe *
            </label>
            <input
              type="text"
              id="plate_number"
              name="plate_number"
              value={addFormData.plate_number}
              onChange={handleAddFormChange}
              className={`input uppercase ${addFormErrors.plate_number ? "input-error" : ""}`}
              placeholder="VD: 30A-12345"
              disabled={isSubmitting}
            />
            {addFormErrors.plate_number && (
              <p className="mt-1 text-sm text-red-600">
                {addFormErrors.plate_number}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="vehicle_type" className="label">
              Loại xe *
            </label>
            <select
              id="vehicle_type"
              name="vehicle_type"
              value={addFormData.vehicle_type}
              onChange={handleAddFormChange}
              className={`input ${addFormErrors.vehicle_type ? "input-error" : ""}`}
              disabled={isSubmitting}
            >
              <option value={VEHICLE_TYPES.CAR}>🚗 Ô tô</option>
              <option value={VEHICLE_TYPES.MOTORBIKE}>🏍️ Xe máy</option>
              <option value={VEHICLE_TYPES.BICYCLE}>🚲 Xe đạp</option>
            </select>
            {addFormErrors.vehicle_type && (
              <p className="mt-1 text-sm text-red-600">
                {addFormErrors.vehicle_type}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              disabled={isSubmitting}
              className="flex-1 btn btn-outline"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn btn-primary"
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Checkout Modal */}
      {currentSession && (
        <Modal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          title="Thanh toán"
        >
          <div className="space-y-4">
            <p className="text-slate-600">
              Biển số:{" "}
              <span className="font-semibold text-slate-900">
                {currentSession.plate_number}
              </span>
            </p>

            <div className="bg-slate-100 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Loại xe:</span>
                <span className="text-slate-900 font-medium">
                  {getVehicleTypeDisplay(currentSession.vehicle_type)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Giờ vào:</span>
                <span className="text-slate-900 font-medium">
                  {formatTime(currentSession.time_in)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Giờ ra:</span>
                <span className="text-slate-900 font-medium">
                  {formatTime(new Date())}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Thời gian gửi:</span>
                <span className="text-slate-900 font-medium">
                  {calculateDuration(currentSession.time_in, new Date())}
                </span>
              </div>
              <div className="border-t border-slate-300 my-3"></div>
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-slate-900">
                  Tổng tiền:
                </span>
                <span className="text-2xl font-bold text-cyan-600">
                  {formatCurrency(
                    calculateParkingFee(
                      currentSession.vehicle_type,
                      currentSession.time_in,
                      new Date(),
                    ),
                  )}
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-slate-600 text-sm mb-3">
                Quét mã QR để thanh toán
              </p>
              <div className="inline-block">
                <QRDisplay
                  data={`sepay://payment?amount=${calculateParkingFee(
                    currentSession.vehicle_type,
                    currentSession.time_in,
                    new Date(),
                  )}&desc=Parking-${currentSession.plate_number}`}
                  size={160}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                SePay - Thanh toán nhanh chóng
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 btn btn-outline"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 btn btn-success"
              >
                Xác nhận đã thanh toán
              </button>
            </div>

            <button
              onClick={handleMarkUnpaid}
              className="w-full text-sm text-red-600 hover:text-red-700 transition-colors py-2"
            >
              Đánh dấu không thanh toán (nợ)
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ActiveParking;
