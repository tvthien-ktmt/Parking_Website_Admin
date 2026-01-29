import { VALIDATION_REGEX } from "./constants";

/**
 * Validate plate number
 * @param {string} plateNumber - Plate number to validate
 * @returns {object} Validation result { isValid: boolean, message: string }
 */
export const validatePlateNumber = (plateNumber) => {
  if (!plateNumber || plateNumber.trim() === "") {
    return {
      isValid: false,
      message: "Biển số xe không được để trống",
    };
  }

  const cleaned = plateNumber.replace(/\s+/g, "").toUpperCase();

  if (!VALIDATION_REGEX.PLATE_NUMBER.test(cleaned)) {
    return {
      isValid: false,
      message: "Biển số xe không hợp lệ. VD: 30A-12345",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate vehicle type
 * @param {string} vehicleType - Vehicle type to validate
 * @returns {object} Validation result
 */
export const validateVehicleType = (vehicleType) => {
  if (!vehicleType || vehicleType.trim() === "") {
    return {
      isValid: false,
      message: "Loại xe không được để trống",
    };
  }

  const validTypes = ["car", "motorbike", "bicycle"];
  if (!validTypes.includes(vehicleType)) {
    return {
      isValid: false,
      message: "Loại xe không hợp lệ",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {object} Validation result
 */
export const validateUsername = (username) => {
  if (!username || username.trim() === "") {
    return {
      isValid: false,
      message: "Tên đăng nhập không được để trống",
    };
  }

  if (username.length < 3) {
    return {
      isValid: false,
      message: "Tên đăng nhập phải có ít nhất 3 ký tự",
    };
  }

  if (username.length > 50) {
    return {
      isValid: false,
      message: "Tên đăng nhập không được quá 50 ký tự",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {object} Validation result
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === "") {
    return {
      isValid: false,
      message: "Mật khẩu không được để trống",
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    };
  }

  if (password.length > 100) {
    return {
      isValid: false,
      message: "Mật khẩu không được quá 100 ký tự",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {object} Validation result
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return {
      isValid: false,
      message: "Email không được để trống",
    };
  }

  if (!VALIDATION_REGEX.EMAIL.test(email)) {
    return {
      isValid: false,
      message: "Email không hợp lệ",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate phone number
 * @param {string} phoneNumber - Phone number to validate
 * @returns {object} Validation result
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber || phoneNumber.trim() === "") {
    return {
      isValid: false,
      message: "Số điện thoại không được để trống",
    };
  }

  const cleaned = phoneNumber.replace(/\s+/g, "");

  if (!VALIDATION_REGEX.PHONE.test(cleaned)) {
    return {
      isValid: false,
      message: "Số điện thoại không hợp lệ",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate date range
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {object} Validation result
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return {
      isValid: false,
      message: "Vui lòng chọn ngày bắt đầu và ngày kết thúc",
    };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    return {
      isValid: false,
      message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate amount
 * @param {number} amount - Amount to validate
 * @param {number} min - Minimum amount (default: 0)
 * @param {number} max - Maximum amount (default: Infinity)
 * @returns {object} Validation result
 */
export const validateAmount = (amount, min = 0, max = Infinity) => {
  if (amount === null || amount === undefined || amount === "") {
    return {
      isValid: false,
      message: "Số tiền không được để trống",
    };
  }

  const numAmount = Number(amount);

  if (isNaN(numAmount)) {
    return {
      isValid: false,
      message: "Số tiền không hợp lệ",
    };
  }

  if (numAmount < min) {
    return {
      isValid: false,
      message: `Số tiền phải lớn hơn hoặc bằng ${min}`,
    };
  }

  if (numAmount > max) {
    return {
      isValid: false,
      message: `Số tiền không được vượt quá ${max}`,
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result
 */
export const validateRequired = (value, fieldName = "Trường này") => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return {
      isValid: false,
      message: `${fieldName} không được để trống`,
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result
 */
export const validateLength = (value, min, max, fieldName = "Trường này") => {
  if (!value) {
    return {
      isValid: false,
      message: `${fieldName} không được để trống`,
    };
  }

  if (value.length < min) {
    return {
      isValid: false,
      message: `${fieldName} phải có ít nhất ${min} ký tự`,
    };
  }

  if (value.length > max) {
    return {
      isValid: false,
      message: `${fieldName} không được quá ${max} ký tự`,
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/**
 * Validate form data
 * @param {object} formData - Form data to validate
 * @param {object} rules - Validation rules
 * @returns {object} Validation result { isValid: boolean, errors: object }
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = formData[field];

    if (rule.required) {
      const result = validateRequired(value, rule.label || field);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        return;
      }
    }

    if (rule.validator && typeof rule.validator === "function") {
      const result = rule.validator(value);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
      }
    }
  });

  return {
    isValid,
    errors,
  };
};

/**
 * Check if plate number is valid format (loose check)
 * @param {string} plateNumber - Plate number to check
 * @returns {boolean} True if valid format
 */
export const isValidPlateFormat = (plateNumber) => {
  if (!plateNumber) return false;
  const cleaned = plateNumber.replace(/\s+/g, "").toUpperCase();
  return VALIDATION_REGEX.PLATE_NUMBER.test(cleaned);
};

/**
 * Sanitize input string
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input) return "";

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < and >
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ""); // Remove event handlers
};

/**
 * Check if value is numeric
 * @param {any} value - Value to check
 * @returns {boolean} True if numeric
 */
export const isNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export default {
  validatePlateNumber,
  validateVehicleType,
  validateUsername,
  validatePassword,
  validateEmail,
  validatePhoneNumber,
  validateDateRange,
  validateAmount,
  validateRequired,
  validateLength,
  validateForm,
  isValidPlateFormat,
  sanitizeInput,
  isNumeric,
};
