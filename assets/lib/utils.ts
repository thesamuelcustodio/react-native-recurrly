import dayjs from "dayjs";

/**
 * Formats a number as an en-US currency value, defaulting to USD. If currency
 * formatting fails, returns the value with two decimal places and no symbol.
 */
export const formatCurrency = (value: number, currency = "USD"): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

/**
 * Formats a valid subscription date as MM/DD/YYYY. Missing or invalid values
 * are represented as "Not provided".
 */
export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

/**
 * Capitalizes the first character of a status, or returns "Unknown" when the
 * status is missing.
 */
export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};