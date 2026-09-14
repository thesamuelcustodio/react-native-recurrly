import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  formatCurrency as formatAmountAlias,
  formatAmount,
} from "../lib/utils.ts";
import {
  formatCurrency,
  formatStatusLabel,
  formatSubscriptionDateTime,
} from "../assets/lib/utils.ts";

describe("lib currency formatting", () => {
  test("formats numbers as US dollars by default", () => {
    assert.equal(formatAmount(1234.5), "$1,234.50");
  });

  test("formats numeric strings and rounds to two decimal places", () => {
    assert.equal(formatAmount("12.345"), "$12.35");
  });

  test("supports other ISO currencies", () => {
    assert.equal(formatAmount(1234.5, "EUR"), "€1,234.50");
  });

  test("preserves negative values", () => {
    assert.equal(formatAmount(-5), "-$5.00");
  });

  test("returns zero dollars for non-numeric strings", () => {
    assert.equal(formatAmount("not-a-number"), "$0.00");
  });

  test("uses USD when an empty currency is supplied", () => {
    assert.equal(formatAmount(12.5, ""), "$12.50");
  });

  test("falls back to dollar formatting when Intl rejects a currency", () => {
    assert.equal(formatAmount(12.3, "INVALID"), "$12.30");
  });

  test("falls back safely for an invalid value and invalid currency", () => {
    assert.equal(formatAmount("invalid", "INVALID"), "$0.00");
  });

  test("exports formatCurrency as the same formatter", () => {
    assert.equal(formatAmountAlias, formatAmount);
    assert.equal(formatAmountAlias(8), "$8.00");
  });
});

describe("subscription currency formatting", () => {
  test("formats the subscription amount as US dollars by default", () => {
    assert.equal(formatCurrency(2499.9), "$2,499.90");
  });

  test("supports alternate currencies and negative values", () => {
    assert.equal(formatCurrency(-12.5, "EUR"), "-€12.50");
  });

  test("returns an unadorned fixed amount when Intl rejects a currency", () => {
    assert.equal(formatCurrency(12.3, "INVALID"), "12.30");
  });
});

describe("subscription date formatting", () => {
  test("formats an ISO calendar date without changing the day", () => {
    assert.equal(formatSubscriptionDateTime("2026-03-18"), "03/18/2026");
  });

  test("returns the placeholder for an invalid date", () => {
    assert.equal(formatSubscriptionDateTime("not-a-date"), "Not provided");
  });

  test("returns the placeholder when the date is absent", () => {
    assert.equal(formatSubscriptionDateTime(), "Not provided");
    assert.equal(formatSubscriptionDateTime(""), "Not provided");
  });
});

describe("status labels", () => {
  test("capitalizes a lowercase status", () => {
    assert.equal(formatStatusLabel("active"), "Active");
  });

  test("handles a single-character status", () => {
    assert.equal(formatStatusLabel("x"), "X");
  });

  test("does not unexpectedly lowercase the rest of a status", () => {
    assert.equal(formatStatusLabel("pAUSED"), "PAUSED");
  });

  test("returns the fallback label when the status is absent", () => {
    assert.equal(formatStatusLabel(), "Unknown");
    assert.equal(formatStatusLabel(""), "Unknown");
  });
});
