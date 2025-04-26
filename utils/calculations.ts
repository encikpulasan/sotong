/**
 * Utility functions for payslip calculations
 */

/**
 * Calculate all deductions based on salary using Malaysian standards
 */
export function calculateDeductions(
  salary: number,
  bonus: number,
  epfRate: string,
  socsoType: string,
  eisType: string,
) {
  const totalIncome = salary + bonus;

  // EPF rates
  const epfRates = {
    employee: getEpfEmployeeRate(epfRate),
    employer: 0.13, // 13% employer rate
  };

  // SOCSO calculations with salary cap
  const socsoSalaryCap = 4000;
  const socsoCalculationSalary = Math.min(salary, socsoSalaryCap);
  const socsoRates = getSocsoRates(socsoType);

  // EIS calculations with salary cap
  const eisSalaryCap = 4000;
  const eisCalculationSalary = Math.min(salary, eisSalaryCap);
  const eisRate = eisType === "auto" ? 0.002 : 0; // 0.2% when auto-calculate is selected

  // PCB (tax) calculation - simplified approximation
  const pcbRate = 0.03; // Simple 3% approximation for demo purposes

  return {
    pcbDeduction: parseFloat((totalIncome * pcbRate).toFixed(2)),
    epfEmployeeDeduction: parseFloat(
      (totalIncome * epfRates.employee).toFixed(2),
    ),
    socsoEmployee: parseFloat(
      (socsoCalculationSalary * socsoRates.employee).toFixed(2),
    ),
    eisEmployee: parseFloat((eisCalculationSalary * eisRate).toFixed(2)),
    epfEmployer: parseFloat((totalIncome * epfRates.employer).toFixed(2)),
    socsoEmployer: parseFloat(
      (socsoCalculationSalary * socsoRates.employer).toFixed(2),
    ),
    eisEmployer: parseFloat((eisCalculationSalary * eisRate).toFixed(2)),
    hrdf: parseFloat((salary * 0.005).toFixed(2)), // HRDF is typically 0.5% of salary
  };
}

/**
 * Get EPF employee rate based on selection
 */
export function getEpfEmployeeRate(epfRate: string): number {
  switch (epfRate) {
    case "0%":
      return 0;
    case "9%":
      return 0.09;
    case "5.5%":
      return 0.055;
    case "11%":
      return 0.11;
    default:
      return 0.11; // Default to 11%
  }
}

/**
 * Get SOCSO rates based on scheme type
 */
export function getSocsoRates(
  socsoType: string,
): { employee: number; employer: number } {
  if (socsoType === "both") {
    // For both schemes (Employment Injury and Invalidity)
    return {
      employer: 0.0175, // 1.75%
      employee: 0.005, // 0.5%
    };
  } else if (socsoType === "injury") {
    // Only Employment Injury Scheme
    return {
      employer: 0.0125, // 1.25%
      employee: 0,
    };
  } else {
    // Not applicable
    return {
      employer: 0,
      employee: 0,
    };
  }
}

/**
 * Calculate net income based on salary, bonus and deductions
 */
export function calculateNetIncome(
  salary: number,
  bonus: number,
  pcbDeduction: number,
  epfEmployeeDeduction: number,
  socsoEmployee: number,
  eisEmployee: number,
): number {
  const totalDeductions = pcbDeduction +
    epfEmployeeDeduction +
    socsoEmployee +
    eisEmployee;

  return parseFloat(
    ((salary + bonus) - totalDeductions).toFixed(2),
  );
}

/**
 * Calculate total deductions
 */
export function calculateTotalDeductions(
  pcbDeduction: number,
  epfEmployeeDeduction: number,
  socsoEmployee: number,
  eisEmployee: number,
): number {
  return parseFloat(
    (pcbDeduction + epfEmployeeDeduction + socsoEmployee + eisEmployee).toFixed(
      2,
    ),
  );
}

/**
 * Calculate total earnings
 */
export function calculateTotalEarnings(salary: number, bonus: number): number {
  return parseFloat((salary + bonus).toFixed(2));
}
