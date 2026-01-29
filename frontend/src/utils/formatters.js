import {
  format,
  parseISO,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  PRICING,
  TIME_BLOCK_HOURS,
  VEHICLE_TYPE_LABELS,
  VEHICLE_TYPE_ICONS,
} from "./constants";

/**
 * Format currency to Vietnamese Dong
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
};

/**
 * Format date to Vietnamese format
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'dd/MM/yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = "dd/MM/yyyy") => {
  if (!date) return "--";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: vi });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "--";
  }
};

/**
 * Format time to Vietnamese format
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'HH:mm')
 * @returns {string} Formatted time string
 */
export const formatTime = (date, formatStr = "HH:mm") => {
  if (!date) return "--";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: vi });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "--";
  }
};

/**
 * Format datetime to Vietnamese format
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'dd/MM/yyyy HH:mm')
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (date, formatStr = "dd/MM/yyyy HH:mm") => {
  if (!date) return "--";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: vi });
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return "--";
  }
};

/**
 * Calculate duration between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date (default: now)
 * @returns {string} Duration string (e.g., "2h 30m")
 */
export const calculateDuration = (startDate, endDate = new Date()) => {
  if (!startDate) return "--";

  try {
    const start =
      typeof startDate === "string" ? parseISO(startDate) : startDate;
    const end = typeof endDate === "string" ? parseISO(endDate) : endDate;

    const hours = differenceInHours(end, start);
    const minutes = differenceInMinutes(end, start) % 60;

    if (hours === 0) {
      return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
  } catch (error) {
    console.error("Error calculating duration:", error);
    return "--";
  }
};

/**
 * Calculate parking fee based on vehicle type and duration
 * @param {string} vehicleType - Vehicle type (car, motorbike, bicycle)
 * @param {string|Date} timeIn - Check-in time
 * @param {string|Date} timeOut - Check-out time (default: now)
 * @returns {number} Calculated fee in VND
 */
export const calculateParkingFee = (
  vehicleType,
  timeIn,
  timeOut = new Date(),
) => {
  if (!vehicleType || !timeIn) return 0;

  try {
    const start = typeof timeIn === "string" ? parseISO(timeIn) : timeIn;
    const end = typeof timeOut === "string" ? parseISO(timeOut) : timeOut;

    // Calculate duration in hours
    const durationInHours = differenceInHours(end, start, {
      roundingMethod: "ceil",
    });

    // Get pricing for vehicle type
    const pricing = PRICING[vehicleType] || PRICING.car;

    // Calculate number of time blocks (minimum 1 block)
    const blocks = Math.max(1, Math.ceil(durationInHours / TIME_BLOCK_HOURS));

    // Calculate total fee: base price + (additional blocks * per block price)
    const totalFee = pricing.base + Math.max(0, blocks - 1) * pricing.perBlock;

    return totalFee;
  } catch (error) {
    console.error("Error calculating parking fee:", error);
    return 0;
  }
};

/**
 * Get vehicle type display name with icon
 * @param {string} vehicleType - Vehicle type
 * @returns {string} Display name with icon
 */
export const getVehicleTypeDisplay = (vehicleType) => {
  const icon = VEHICLE_TYPE_ICONS[vehicleType] || "🚗";
  const label = VEHICLE_TYPE_LABELS[vehicleType] || vehicleType;
  return `${icon} ${label}`;
};

/**
 * Format plate number to standard format
 * @param {string} plateNumber - Plate number to format
 * @returns {string} Formatted plate number
 */
export const formatPlateNumber = (plateNumber) => {
  if (!plateNumber) return "";
  return plateNumber.toUpperCase().replace(/\s+/g, "");
};

/**
 * Format phone number to Vietnamese format
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Format as Vietnamese phone number
  if (cleaned.startsWith("84")) {
    // +84 format
    return `+84 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  } else if (cleaned.startsWith("0")) {
    // 0 format
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  return phoneNumber;
};

/**
 * Get relative time from now
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string (e.g., "2 giờ trước")
 */
export const getRelativeTime = (date) => {
  if (!date) return "--";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    const now = new Date();
    const diffInMinutes = differenceInMinutes(now, dateObj);

    if (diffInMinutes < 1) {
      return "Vừa xong";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} giờ trước`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} ngày trước`;
    }
  } catch (error) {
    console.error("Error calculating relative time:", error);
    return "--";
  }
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 0) => {
  if (typeof value !== "number") return "0%";
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format number with thousands separator
 * @param {number} number - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (number) => {
  if (typeof number !== "number") return "0";
  return new Intl.NumberFormat("vi-VN").format(number);
};

/**
 * Get day of week in Vietnamese
 * @param {string|Date} date - Date
 * @returns {string} Day of week
 */
export const getDayOfWeek = (date) => {
  if (!date) return "--";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, "EEEE", { locale: vi });
  } catch (error) {
    console.error("Error getting day of week:", error);
    return "--";
  }
};

export default {
  formatCurrency,
  formatDate,
  formatTime,
  formatDateTime,
  calculateDuration,
  calculateParkingFee,
  getVehicleTypeDisplay,
  formatPlateNumber,
  formatPhoneNumber,
  getRelativeTime,
  formatFileSize,
  truncateText,
  formatPercentage,
  formatNumber,
  getDayOfWeek,
};
