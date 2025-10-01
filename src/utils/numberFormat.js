// Utilities for handling decimal inputs with comma separators

// Parse a user-entered decimal string where comma or dot can be the separator
export const parseDecimalInput = (str) => {
  if (typeof str !== "string") {
    const n = Number(str);
    return isNaN(n) || n < 0 ? 0 : n;
  }
  // Normalize: allow either comma or dot as decimal separator
  const normalized = str.trim().replace(",", ".");
  const n = parseFloat(normalized);
  if (isNaN(n) || n < 0) return 0;
  return n;
};

// Format a number using a comma as decimal separator, without forcing trailing zeros
export const formatDecimalWithComma = (value) => {
  if (value === null || value === undefined) return "0";
  const n = Number(value);
  if (!isFinite(n)) return "0";
  // Keep up to 2 decimals when needed
  const str = Math.round((n + Number.EPSILON) * 100) / 100;
  return String(str).replace(".", ",");
};
