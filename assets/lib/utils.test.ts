import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatCurrency,
  formatStatusLabel,
  formatSubscriptionDateTime,
} from "./utils.ts";

describe("formatCurrency", () => {
  it("formats USD by default with grouping and two decimal places", () => {
    assert.equal(formatCurrency(2489.48), "$2,489.48");
    assert.equal(formatCurrency(-3), "-$3.00");
  });

  it("supports other ISO currency codes", () => {
    assert.equal(formatCurrency(15, "EUR"), "€15.00");
    assert.equal(formatCurrency(1000, "JPY"), "¥1,000.00");
  });

  it("falls back to a plain fixed amount for an invalid currency code", () => {
    assert.equal(formatCurrency(9.5, "NOT_A_CURRENCY"), "9.50");
  });
});

describe("formatSubscriptionDateTime", () => {
  it("formats valid subscription dates as MM/DD/YYYY", () => {
    assert.equal(formatSubscriptionDateTime("2026-03-20"), "03/20/2026");
    assert.equal(formatSubscriptionDateTime("2024-02-29"), "02/29/2024");
  });

  it("returns the empty-state label for missing or invalid dates", () => {
    assert.equal(formatSubscriptionDateTime(), "Not provided");
    assert.equal(formatSubscriptionDateTime(""), "Not provided");
    assert.equal(formatSubscriptionDateTime("not-a-date"), "Not provided");
  });
});

describe("formatStatusLabel", () => {
  it("capitalizes the first character without changing the rest", () => {
    assert.equal(formatStatusLabel("active"), "Active");
    assert.equal(formatStatusLabel("paused"), "Paused");
    assert.equal(formatStatusLabel("PAUSED"), "PAUSED");
    assert.equal(formatStatusLabel("a"), "A");
  });

  it("returns the unknown label for an absent status", () => {
    assert.equal(formatStatusLabel(), "Unknown");
    assert.equal(formatStatusLabel(""), "Unknown");
  });
});
