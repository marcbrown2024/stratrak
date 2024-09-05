export const defaultLog: LogDetails = {
  monitorName: "",
  signature: "",
  typeOfVisit: "Remote",
  purposeOfVisit: "SIV",
  dateOfVisit: getCurrentDateTime(),
};

export const defaultTrial: TrialDetails = {
  investigatorName: "",
  protocol: "",
  siteVisit: "",
  progress: "",
};

// Function to format the current date and time in 'YYYY-MM-DDThh:mm' format
function getCurrentDateTime() {
  const now = new Date();

  // Pad single-digit numbers with leading zeros
  const padWithZero = (num: number) => (num < 10 ? `0${num}` : num);

  const year = now.getFullYear();
  const month = padWithZero(now.getMonth() + 1); // Months are 0-based
  const day = padWithZero(now.getDate());
  const hours = padWithZero(now.getHours());
  const minutes = padWithZero(now.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const validationRules = {
  email: (value: string) => {
    if (!value) return "Email is required";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return "Invalid email address";
    }
    return null;
  },
  password: (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters long";
    // if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(value)) return "Password must contain at least one digit";
    // if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Password must contain at least one special character";
    return null;
  },
  firstName: (value: string) => {
    if (!value) return "First name is required";
    // if (!/^[A-Za-z]+$/.test(value)) return "First name must contain only letters";
    if (value.length < 2) return "First name must be at least 2 characters long";
    return null;
  },
  lastName: (value: string) => {
    if (!value) return "Last name is required";
    // if (!/^[A-Za-z]+$/.test(value)) return "Last name must contain only letters";
    if (value.length < 2) return "Last name must be at least 2 characters long";
    return null;
  },
};


const sanitizeInput = (value: string): string => {
  // Basic sanitization to remove potentially harmful characters
  const sanitizedValue = value
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();

  return sanitizedValue;
};

export const validateInput = (
  fieldName: keyof typeof validationRules, 
  value: string
): { isValid: boolean; sanitizedValue: string; errorMessage: string | null } => {
  const sanitizedValue = sanitizeInput(value);
  const validator = validationRules[fieldName];

  if (validator) {
    const errorMessage = validator(sanitizedValue);
    return {
      isValid: errorMessage === null,
      sanitizedValue,
      errorMessage,
    };
  }

  return {
    isValid: true,
    sanitizedValue,
    errorMessage: null,
  };
};



