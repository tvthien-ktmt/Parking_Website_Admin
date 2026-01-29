// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
export const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:5000";

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || "Smart Parking Admin";
export const COMPANY_NAME =
  import.meta.env.VITE_COMPANY_NAME || "Công ty TNHH Bãi Đỗ Xe";

// Parking Session Status
export const PARKING_STATUS = {
  IN_PARKING: "IN_PARKING",
  WAIT_PAYMENT: "WAIT_PAYMENT",
  PAID: "PAID",
  UNPAID: "UNPAID",
  DEBT: "DEBT",
};

// Parking Session Status Labels
export const PARKING_STATUS_LABELS = {
  [PARKING_STATUS.IN_PARKING]: "Đang gửi",
  [PARKING_STATUS.WAIT_PAYMENT]: "Chờ thanh toán",
  [PARKING_STATUS.PAID]: "Đã thanh toán",
  [PARKING_STATUS.UNPAID]: "Chưa thanh toán",
  [PARKING_STATUS.DEBT]: "Còn nợ",
};

// Vehicle Types
export const VEHICLE_TYPES = {
  CAR: "car",
  MOTORBIKE: "motorbike",
  BICYCLE: "bicycle",
};

// Vehicle Type Labels
export const VEHICLE_TYPE_LABELS = {
  [VEHICLE_TYPES.CAR]: "Ô tô",
  [VEHICLE_TYPES.MOTORBIKE]: "Xe máy",
  [VEHICLE_TYPES.BICYCLE]: "Xe đạp",
};

// Vehicle Type Icons
export const VEHICLE_TYPE_ICONS = {
  [VEHICLE_TYPES.CAR]: "🚗",
  [VEHICLE_TYPES.MOTORBIKE]: "🏍️",
  [VEHICLE_TYPES.BICYCLE]: "🚲",
};

// Pricing Configuration (VND)
export const PRICING = {
  [VEHICLE_TYPES.CAR]: {
    base: 10000, // Base price for first 2 hours
    perBlock: 5000, // Additional price per 2 hours
  },
  [VEHICLE_TYPES.MOTORBIKE]: {
    base: 5000,
    perBlock: 2000,
  },
  [VEHICLE_TYPES.BICYCLE]: {
    base: 2000,
    perBlock: 1000,
  },
};

// Time Block (hours)
export const TIME_BLOCK_HOURS = 2;

// Date/Time Formats
export const DATE_FORMAT = "dd/MM/yyyy";
export const TIME_FORMAT = "HH:mm";
export const DATETIME_FORMAT = "dd/MM/yyyy HH:mm";
export const DATETIME_FULL_FORMAT = "dd/MM/yyyy HH:mm:ss";

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "parking_auth_token",
  USER_INFO: "parking_user_info",
  REMEMBER_ME: "parking_remember_me",
};

// Default Demo Credentials
export const DEMO_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
};

// Tab Names
export const TAB_NAMES = {
  DASHBOARD: "dashboard",
  PARKING: "parking",
  PAID: "paid",
  DEBT: "debt",
};

// WebSocket Events
export const WS_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  SESSION_CREATED: "session:created",
  SESSION_UPDATED: "session:updated",
  SESSION_DELETED: "session:deleted",
  PAYMENT_RECEIVED: "payment:received",
  DEBT_ADDED: "debt:added",
};

// Auto Refresh Intervals (milliseconds)
export const REFRESH_INTERVALS = {
  PARKING_TABLE: 30000, // 30 seconds
  STATS: 60000, // 1 minute
  CLOCK: 1000, // 1 second
};

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Validation Regex
export const VALIDATION_REGEX = {
  PLATE_NUMBER: /^[0-9]{2}[A-Z]{1,2}-?\d{4,5}$/i,
  PHONE: /^(0|\+84)[0-9]{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng thử lại.",
  UNAUTHORIZED: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
  FORBIDDEN: "Bạn không có quyền thực hiện thao tác này.",
  NOT_FOUND: "Không tìm thấy dữ liệu.",
  SERVER_ERROR: "Lỗi máy chủ. Vui lòng thử lại sau.",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ.",
  INVALID_CREDENTIALS: "Tên đăng nhập hoặc mật khẩu không chính xác.",
  PLATE_EXISTS: "Xe này đang gửi trong bãi.",
  PLATE_HAS_DEBT: "Xe này còn nợ cước.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Đăng nhập thành công!",
  LOGOUT_SUCCESS: "Đăng xuất thành công!",
  VEHICLE_ADDED: "Đã thêm xe vào bãi.",
  PAYMENT_SUCCESS: "Thanh toán thành công!",
  DEBT_COLLECTED: "Đã thu nợ thành công!",
  SESSION_UPDATED: "Cập nhật thành công!",
};

// Chart Colors
export const CHART_COLORS = {
  primary: "#3b82f6",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",
  info: "#06b6d4",
  purple: "#8b5cf6",
  pink: "#ec4899",
  gray: "#6b7280",
};

// Camera IDs (for demo)
export const CAMERA_IDS = {
  ENTRANCE: "CAM-ENTRANCE-01",
  EXIT: "CAM-EXIT-01",
};

// Max Records
export const MAX_RECORDS = 999;

// QR Code Configuration
export const QR_CONFIG = {
  width: 160,
  height: 160,
  margin: 1,
  color: {
    dark: "#000000",
    light: "#ffffff",
  },
};

export default {
  API_BASE_URL,
  WS_URL,
  APP_NAME,
  COMPANY_NAME,
  PARKING_STATUS,
  PARKING_STATUS_LABELS,
  VEHICLE_TYPES,
  VEHICLE_TYPE_LABELS,
  VEHICLE_TYPE_ICONS,
  PRICING,
  TIME_BLOCK_HOURS,
  STORAGE_KEYS,
  DEMO_CREDENTIALS,
  TOAST_TYPES,
  TAB_NAMES,
  WS_EVENTS,
  REFRESH_INTERVALS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_REGEX,
  CHART_COLORS,
  QR_CONFIG,
};
