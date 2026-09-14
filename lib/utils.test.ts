import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatAmount, formatCurrency } from "./utils.ts";

describe("formatAmount", () => {
  it("formats numeric values as US dollars with grouping and two decimals", () => {
    assert.equal(formatAmount(1234.5), "$1,234.50");
    assert.equal(formatAmount(-8), "-$8.00");
  });

  it("parses numeric strings and rounds to two decimal places", () => {
    assert.equal(formatAmount("12.345"), "$12.35");
    assert.equal(formatAmount("0"), "$0.00");
  });

  it("supports an explicitly requested currency", () => {
    assert.equal(formatAmount(1234.5, "EUR"), "€1,234.50");
    assert.equal(formatAmount(1234, "JPY"), "¥1,234.00");
  });

  it("uses USD when the supplied currency is empty", () => {
    assert.equal(formatAmount(19.99, ""), "$19.99");
  });

  it("returns a safe zero amount for malformed numeric strings", () => {
    assert.equal(formatAmount("not-a-number"), "$0.00");
  });

  it("falls back safely when Intl rejects a currency code", () => {
    assert.equal(formatAmount(12.5, "NOT_A_CURRENCY"), "$12.50");
    assert.equal(formatAmount("invalid", "NOT_A_CURRENCY"), "$0.00");
  });
});

describe("formatCurrency", () => {
  it("is an alias of formatAmount", () => {
    assert.equal(formatCurrency, formatAmount);
    assert.equal(formatCurrency("42.1", "USD"), "$42.10");
  });
});
