import { assertEquals } from "https://deno.land/std@0.216.0/assert/mod.ts";
import {
  calculateDeductions,
  calculateNetIncome,
  calculateTotalDeductions,
  calculateTotalEarnings,
  getEpfEmployeeRate,
  getSocsoRates,
} from "../utils/calculations.ts";

// Test suite for EPF rate calculation
Deno.test("EPF Employee Rate Calculation", () => {
  assertEquals(getEpfEmployeeRate("0%"), 0);
  assertEquals(getEpfEmployeeRate("9%"), 0.09);
  assertEquals(getEpfEmployeeRate("5.5%"), 0.055);
  assertEquals(getEpfEmployeeRate("11%"), 0.11);
  assertEquals(getEpfEmployeeRate("unknown"), 0.11); // Default case
});

// Test suite for SOCSO rates
Deno.test("SOCSO Rates Calculation", () => {
  // Both schemes
  const bothRates = getSocsoRates("both");
  assertEquals(bothRates.employer, 0.0175);
  assertEquals(bothRates.employee, 0.005);

  // Injury scheme only
  const injuryRates = getSocsoRates("injury");
  assertEquals(injuryRates.employer, 0.0125);
  assertEquals(injuryRates.employee, 0);

  // None
  const noneRates = getSocsoRates("none");
  assertEquals(noneRates.employer, 0);
  assertEquals(noneRates.employee, 0);
});

// Test suite for net income calculation
Deno.test("Net Income Calculation", () => {
  assertEquals(
    calculateNetIncome(5000, 1000, 180, 660, 20, 8),
    5132,
  );

  assertEquals(
    calculateNetIncome(3000, 0, 90, 330, 15, 6),
    2559,
  );

  assertEquals(
    calculateNetIncome(10000, 2000, 360, 1320, 20, 8),
    10292,
  );
});

// Test suite for total deductions
Deno.test("Total Deductions Calculation", () => {
  assertEquals(
    calculateTotalDeductions(180, 660, 20, 8),
    868,
  );

  assertEquals(
    calculateTotalDeductions(90, 330, 15, 6),
    441,
  );
});

// Test suite for total earnings
Deno.test("Total Earnings Calculation", () => {
  assertEquals(calculateTotalEarnings(5000, 1000), 6000);
  assertEquals(calculateTotalEarnings(3000, 0), 3000);
  assertEquals(calculateTotalEarnings(10000, 2000), 12000);
});

// Test suite for all deductions calculation
Deno.test("Complete Deductions Calculation", () => {
  // Test case 1: Regular employee with 11% EPF, both SOCSO schemes, EIS auto
  const deductions1 = calculateDeductions(5000, 1000, "11%", "both", "auto");

  assertEquals(deductions1.pcbDeduction, 180); // 3% of 6000
  assertEquals(deductions1.epfEmployeeDeduction, 660); // 11% of 6000
  assertEquals(deductions1.socsoEmployee, 20); // 0.5% of 4000 (capped)
  assertEquals(deductions1.eisEmployee, 8); // 0.2% of 4000 (capped)
  assertEquals(deductions1.epfEmployer, 780); // 13% of 6000
  assertEquals(deductions1.socsoEmployer, 70); // 1.75% of 4000 (capped)
  assertEquals(deductions1.eisEmployer, 8); // 0.2% of 4000 (capped)
  assertEquals(deductions1.hrdf, 25); // 0.5% of 5000

  // Test case 2: Employee with 9% EPF, injury SOCSO scheme only, no EIS
  const deductions2 = calculateDeductions(3000, 0, "9%", "injury", "none");

  assertEquals(deductions2.pcbDeduction, 90); // 3% of 3000
  assertEquals(deductions2.epfEmployeeDeduction, 270); // 9% of 3000
  assertEquals(deductions2.socsoEmployee, 0); // 0% for injury scheme
  assertEquals(deductions2.eisEmployee, 0); // None selected
  assertEquals(deductions2.epfEmployer, 390); // 13% of 3000
  assertEquals(deductions2.socsoEmployer, 37.5); // 1.25% of 3000
  assertEquals(deductions2.eisEmployer, 0); // None selected
  assertEquals(deductions2.hrdf, 15); // 0.5% of 3000
});
