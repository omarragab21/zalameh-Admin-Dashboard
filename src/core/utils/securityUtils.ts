/**
 * Security & Input Validation Utility
 * Protection against XSS, SQL Injection, Script Injection, and Whitespace-only bypass.
 */

// SQL Injection Detection Regex Patterns
const SQL_INJECTION_PATTERN = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|WHERE)\b|--|\/\*|\*\/|;|\bOR\b\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?|\bAND\b\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/i;

// Script / XSS Injection Detection Regex Patterns
const XSS_INJECTION_PATTERN = /(<script\b[^>]*>|javascript:|onerror\s*=|onload\s*=|eval\(|<iframe\b|document\.cookie)/i;

/**
 * Sanitizes input string against XSS & HTML injection
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Removes dangerous characters while keeping normal text clean for API payload
 */
export function cleanText(input: string): string {
  if (!input) return '';
  // Trim leading/trailing whitespace & normalize multiple spaces
  let text = input.trim().replace(/\s+/g, ' ');
  // Remove script tags and dangerous HTML attributes if pasted
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<[^>]+>/g, ''); // Strip HTML tags
  return text;
}

/**
 * Validates category / subcategory form inputs against SQL Injection, XSS, and Empty / Whitespace-only inputs.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: {
    nameAr?: string;
    nameEn?: string;
    descriptionAr?: string;
    descriptionEn?: string;
    general?: string;
  };
  sanitizedData: {
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
  };
}

export function validateCategoryInputs(inputs: {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isSubcategory?: boolean;
}): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  const rawNameAr = inputs.nameAr ? inputs.nameAr.trim() : '';
  const rawNameEn = inputs.nameEn ? inputs.nameEn.trim() : '';
  const rawDescAr = inputs.descriptionAr ? inputs.descriptionAr.trim() : '';
  const rawDescEn = inputs.descriptionEn ? inputs.descriptionEn.trim() : '';

  const labelPrefix = inputs.isSubcategory ? 'الفئة الفرعية' : 'الفئة';

  // 1. Language Script Detection (Arabic vs English)
  const hasEnglishInAr = /[a-zA-Z]/.test(rawNameAr);
  const hasArabicInEn = /[\u0600-\u06FF]/.test(rawNameEn);

  if (hasEnglishInAr) {
    errors.nameAr = `عفواً، حقل الاسم بالعربية مخصص للغة العربية فقط (يرجى عدم كتابة حروف إنجليزية هنا).`;
  }

  if (hasArabicInEn) {
    errors.nameEn = `عفواً، حقل الاسم بالإنجليزية مخصص للغة الإنجليزية فقط (يرجى عدم كتابة حروف عربية هنا).`;
  }

  // 2. Check for empty / whitespace-only inputs
  if (!rawNameAr && !rawNameEn) {
    errors.nameAr = `يرجى إدخال اسم ${labelPrefix} بالعربية أو الإنجليزية على الأقل.`;
    errors.nameEn = `Please enter the ${inputs.isSubcategory ? 'subcategory' : 'category'} name in Arabic or English.`;
  } else {
    if (rawNameAr && !hasEnglishInAr && rawNameAr.length < 2) {
      errors.nameAr = `اسم ${labelPrefix} بالعربية قصير جداً (الحد الأدنى حرفين).`;
    }

    if (rawNameEn && !hasArabicInEn && rawNameEn.length < 2) {
      errors.nameEn = `اسم ${labelPrefix} بالإنجليزية قصير جداً (الحد الأدنى حرفين).`;
    }
  }

  // 3. Security Check: SQL Injection Detection
  const allText = `${rawNameAr} ${rawNameEn} ${rawDescAr} ${rawDescEn}`;
  if (SQL_INJECTION_PATTERN.test(allText)) {
    errors.general = 'تم رصد رموز أو استعلامات برمجية غير مسموح بها (SQL Injection Protection).';
  }

  // 4. Security Check: XSS / Script Injection Detection
  if (XSS_INJECTION_PATTERN.test(allText)) {
    errors.general = 'تم رصد وسوم برمجية ضارة (XSS Protection).';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    sanitizedData: {
      nameAr: cleanText(rawNameAr || rawNameEn),
      nameEn: cleanText(rawNameEn || rawNameAr),
      descriptionAr: cleanText(rawDescAr),
      descriptionEn: cleanText(rawDescEn),
    },
  };
}
