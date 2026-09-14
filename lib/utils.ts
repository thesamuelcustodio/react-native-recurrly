/**
 * Formats a number or parseable string as en-US currency.
 *
 * Invalid amounts return "$0.00"; formatting failures fall back to a dollar-prefixed value with two decimals.
 */
export function formatAmount(value: number | string, currency: string = "USD"): string {
  try {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) {
      return "$0.00";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  } catch (error) {
    const numValue = typeof value === "string" ? parseFloat(value) : Number(value);
    const safeValue = isNaN(numValue) ? 0 : numValue;
    return `$${safeValue.toFixed(2)}`;
  }
}

/** Alias of formatAmount for currency display. */
export const formatCurrency = formatAmount;
