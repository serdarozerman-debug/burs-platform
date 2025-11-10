// Form validation utilities

export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  password: (value: string): { valid: boolean; message?: string } => {
    if (value.length < 8) {
      return { valid: false, message: 'Şifre en az 8 karakter olmalıdır' };
    }
    if (!/[A-Z]/.test(value)) {
      return { valid: false, message: 'Şifre en az bir büyük harf içermelidir' };
    }
    if (!/[a-z]/.test(value)) {
      return { valid: false, message: 'Şifre en az bir küçük harf içermelidir' };
    }
    if (!/[0-9]/.test(value)) {
      return { valid: false, message: 'Şifre en az bir rakam içermelidir' };
    }
    return { valid: true };
  },

  tcNo: (value: string): boolean => {
    if (!value || value.length !== 11) return false;
    
    const digits = value.split('').map(Number);
    if (digits[0] === 0) return false;
    
    // TC Kimlik No algoritması
    const sum10 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
    if (sum10 % 10 !== digits[10]) return false;
    
    const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
    if ((oddSum * 7 - evenSum) % 10 !== digits[9]) return false;
    
    return true;
  },

  phone: (value: string): boolean => {
    const phoneRegex = /^(\+90|0)?5\d{9}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  },

  gpa: (value: number): boolean => {
    return value >= 0 && value <= 4.0;
  },

  required: (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return !isNaN(value);
    return value !== null && value !== undefined;
  },

  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  minValue: (value: number, min: number): boolean => {
    return value >= min;
  },

  maxValue: (value: number, max: number): boolean => {
    return value <= max;
  }
};

