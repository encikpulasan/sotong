import { useSignal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import {
  calculateDeductions,
  calculateNetIncome,
  calculateTotalDeductions,
  calculateTotalEarnings,
} from "../utils/calculations.ts";

interface PayslipData {
  // Company information
  companyName: string;
  companyAddress: string;

  // Employee information
  employeeName: string;
  employeePosition: string;
  employeeId: string;
  epfNumber: string;
  pcbNumber: string;

  // Personal details
  residenceStatus: "resident" | "non-resident";
  typeOfResident: string;
  marriedStatus: string;

  // Children
  dependentChildren: number;

  // Pay period
  month: string;
  year: string;
  issueDate: string;

  // Earnings
  basicSalary: number;
  bonus: number;

  // Deductions
  pcbDeduction: number;
  epfEmployeeDeduction: number;
  epfRate: "0%" | "9%" | "5.5%" | "11%";
  socsoEmployee: number;
  socsoType: "both" | "injury" | "none";
  eisEmployee: number;
  eisType: "auto" | "none";

  // Employer contributions
  epfEmployer: number;
  socsoEmployer: number;
  eisEmployer: number;
  hrdf: number;

  // Previous payslips
  previousSalaryTotal: number;
  previousPcb: number;
  previousEmployeeEpf: number;
  previousEmployeeSocso: number;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

type FormStep =
  | "company-info"
  | "employee-info"
  | "personal-details"
  | "pay-details"
  | "deductions"
  | "previous-payslips"
  | "user-info"
  | "preview";

export default function PayslipForm() {
  const [step, setStep] = useState<FormStep>("company-info");
  const [payslipData, setPayslipData] = useState<PayslipData>({
    // Company information
    companyName: "",
    companyAddress: "",

    // Employee information
    employeeName: "",
    employeePosition: "",
    employeeId: "",
    epfNumber: "",
    pcbNumber: "",

    // Personal details
    residenceStatus: "resident",
    typeOfResident: "Normal",
    marriedStatus: "Single",

    // Children
    dependentChildren: 0,

    // Pay period
    month: new Date().toLocaleString("default", { month: "long" }),
    year: new Date().getFullYear().toString(),
    issueDate: new Date().toISOString().substring(0, 10),

    // Earnings
    basicSalary: 0,
    bonus: 0,

    // Deductions
    pcbDeduction: 0,
    epfEmployeeDeduction: 0,
    epfRate: "11%",
    socsoEmployee: 0,
    socsoType: "both",
    eisEmployee: 0,
    eisType: "auto",

    // Employer contributions
    epfEmployer: 0,
    socsoEmployer: 0,
    eisEmployer: 0,
    hrdf: 0,

    // Previous payslips
    previousSalaryTotal: 0,
    previousPcb: 0,
    previousEmployeeEpf: 0,
    previousEmployeeSocso: 0,
  });

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    phone: "",
  });

  // Validation state
  const formErrors = useSignal<Record<string, string>>({});

  // Progress state
  const totalSteps = 7; // Total number of steps excluding preview
  const currentStepNumber = getStepNumber(step);

  function getStepNumber(currentStep: FormStep): number {
    const stepOrder = {
      "company-info": 1,
      "employee-info": 2,
      "personal-details": 3,
      "pay-details": 4,
      "deductions": 5,
      "previous-payslips": 6,
      "user-info": 7,
      "preview": 8,
    };
    return stepOrder[currentStep] || 1;
  }

  // Effect to calculate deductions when relevant fields change
  useEffect(() => {
    // Only calculate if we have a salary
    if (payslipData.basicSalary > 0) {
      calculateAndUpdateDeductions();
    }
  }, [
    payslipData.basicSalary,
    payslipData.bonus,
    payslipData.epfRate,
    payslipData.socsoType,
    payslipData.eisType,
  ]);

  // Handle form input changes
  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target as HTMLInputElement;

    // Update the state immediately to prevent UI feedback issues
    if (type === "number") {
      setPayslipData({
        ...payslipData,
        [name]: value === "" ? 0 : parseFloat(value) || 0,
      });
    } else if (type === "radio") {
      const radioTarget = target as HTMLInputElement;
      setPayslipData({
        ...payslipData,
        [name]: radioTarget.value,
      });
    } else {
      setPayslipData({
        ...payslipData,
        [name]: value,
      });
    }
  };

  // Calculate and update deductions based on current state
  const calculateAndUpdateDeductions = () => {
    const salary = typeof payslipData.basicSalary === "string"
      ? parseFloat(payslipData.basicSalary) || 0
      : payslipData.basicSalary || 0;

    const bonus = typeof payslipData.bonus === "string"
      ? parseFloat(payslipData.bonus) || 0
      : payslipData.bonus || 0;

    const deductions = calculateDeductions(
      salary,
      bonus,
      payslipData.epfRate,
      payslipData.socsoType,
      payslipData.eisType,
    );

    setPayslipData((current) => ({
      ...current,
      ...deductions,
    }));
  };

  // Validation for each form step
  const validateStep = (currentStep: FormStep): boolean => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case "company-info":
        if (!payslipData.companyName) {
          errors.companyName = "Company name is required";
        }
        break;
      case "employee-info":
        if (!payslipData.employeeName) {
          errors.employeeName = "Employee name is required";
        }
        break;
      case "pay-details":
        if (!payslipData.basicSalary) {
          errors.basicSalary = "Salary is required";
        }
        break;
      case "user-info":
        if (!userInfo.name) errors.userName = "Name is required";
        if (!userInfo.email) errors.userEmail = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
          errors.userEmail = "Invalid email format";
        }
        if (!userInfo.phone) errors.userPhone = "Phone number is required";
        break;
    }

    formErrors.value = errors;
    return Object.keys(errors).length === 0;
  };

  // Handle user info submission
  const handleUserInfoSubmit = async (e: Event) => {
    e.preventDefault();

    if (validateStep("user-info")) {
      try {
        // Save user info to KV store
        const response = await fetch("/api/save-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        });

        if (response.ok) {
          // Move to preview step
          setStep("preview");
        } else {
          const error = await response.text();
          alert(`Error saving user info: ${error}`);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error
          ? error.message
          : String(error);
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  // Handle user info input changes
  const handleUserInfoChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;

    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  // Calculate net income using utility function
  const getNetIncome = () => {
    return calculateNetIncome(
      payslipData.basicSalary,
      payslipData.bonus,
      payslipData.pcbDeduction,
      payslipData.epfEmployeeDeduction,
      payslipData.socsoEmployee,
      payslipData.eisEmployee,
    );
  };

  // Get total deductions using utility function
  const getTotalDeductions = () => {
    return calculateTotalDeductions(
      payslipData.pcbDeduction,
      payslipData.epfEmployeeDeduction,
      payslipData.socsoEmployee,
      payslipData.eisEmployee,
    );
  };

  // Get total earnings using utility function
  const getTotalEarnings = () => {
    return calculateTotalEarnings(
      payslipData.basicSalary,
      payslipData.bonus,
    );
  };

  // Navigation functions
  const goToNextStep = () => {
    if (validateStep(step)) {
      const nextSteps: Record<FormStep, FormStep> = {
        "company-info": "employee-info",
        "employee-info": "personal-details",
        "personal-details": "pay-details",
        "pay-details": "deductions",
        "deductions": "previous-payslips",
        "previous-payslips": "user-info",
        "user-info": "preview",
        "preview": "preview",
      };
      setStep(nextSteps[step]);
    }
  };

  const goToPreviousStep = () => {
    const prevSteps: Record<FormStep, FormStep> = {
      "company-info": "company-info",
      "employee-info": "company-info",
      "personal-details": "employee-info",
      "pay-details": "personal-details",
      "deductions": "pay-details",
      "previous-payslips": "deductions",
      "user-info": "previous-payslips",
      "preview": "user-info",
    };
    setStep(prevSteps[step]);
  };

  // Handle download
  const handleDownload = () => {
    window.open(
      "/api/download-payslip?" + new URLSearchParams({
        data: JSON.stringify(payslipData),
      }),
      "_blank",
    );
  };

  return (
    <div class="bg-white rounded-lg shadow-lg p-6">
      {/* Progress bar */}
      {step !== "preview" && (
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <span>Step {currentStepNumber} of {totalSteps}</span>
            <span>
              {(currentStepNumber / totalSteps * 100).toFixed(0)}% Complete
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${(currentStepNumber / totalSteps * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 1: Company Information */}
      {step === "company-info" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToNextStep();
          }}
          class="space-y-6"
        >
          <h2 class="text-xl font-semibold mb-4">Company Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={payslipData.companyName}
                onChange={handleInputChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {formErrors.value.companyName && (
                <p class="text-red-500 text-sm mt-1">
                  {formErrors.value.companyName}
                </p>
              )}
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Company Address
              </label>
              <textarea
                name="companyAddress"
                value={payslipData.companyAddress}
                onChange={handleInputChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
              />
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
            >
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Employee Information */}
      {step === "employee-info" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToNextStep();
          }}
          class="space-y-6"
        >
          <h2 class="text-xl font-semibold mb-4">Employee Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Employee Name
              </label>
              <input
                type="text"
                name="employeeName"
                value={payslipData.employeeName}
                onChange={handleInputChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {formErrors.value.employeeName && (
                <p class="text-red-500 text-sm mt-1">
                  {formErrors.value.employeeName}
                </p>
              )}
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                name="employeePosition"
                value={payslipData.employeePosition}
                onChange={handleInputChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                IC/Passport Number
              </label>
              <input
                type="text"
                name="employeeId"
                value={payslipData.employeeId}
                onChange={handleInputChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                EPF Number
              </label>
              <input
                type="text"
                name="epfNumber"
                value={payslipData.epfNumber}
                onChange={handleInputChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                PCB Number
              </label>
              <input
                type="text"
                name="pcbNumber"
                value={payslipData.pcbNumber}
                onChange={handleInputChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div class="flex justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition duration-300"
            >
              Back
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
            >
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Personal Details */}
      {step === "personal-details" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToNextStep();
          }}
          class="space-y-6"
        >
          <h2 class="text-xl font-semibold mb-4 text-green-600">
            Personal Details
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Residence Status
              </label>
              <div class="flex space-x-4 mt-2">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="residenceStatus"
                    value="resident"
                    checked={payslipData.residenceStatus === "resident"}
                    onChange={handleInputChange}
                    class="form-radio h-4 w-4 text-green-600"
                  />
                  <span class="ml-2">Resident</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="residenceStatus"
                    value="non-resident"
                    checked={payslipData.residenceStatus === "non-resident"}
                    onChange={handleInputChange}
                    class="form-radio h-4 w-4 text-green-600"
                  />
                  <span class="ml-2">Non-resident</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Type of Resident
              </label>
              <select
                name="typeOfResident"
                value={payslipData.typeOfResident}
                onChange={handleInputChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Normal">Normal</option>
                <option value="Knowledge Worker">Knowledge Worker</option>
                <option value="Returning Expert">Returning Expert</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Married Status
              </label>
              <select
                name="marriedStatus"
                value={payslipData.marriedStatus}
                onChange={handleInputChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-4 text-green-600 mt-6">
            Children
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Number of Dependent Children
              </label>
              <select
                name="dependentChildren"
                value={payslipData.dependentChildren}
                onChange={handleInputChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {Array.from(
                  { length: 11 },
                  (_, i) => <option key={i} value={i}>{i}</option>,
                )}
              </select>
            </div>
          </div>

          <div class="flex justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition duration-300"
            >
              Back
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
            >
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 4: Pay Details */}
      {step === "pay-details" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToNextStep();
          }}
          class="space-y-6"
        >
          <h2 class="text-xl font-semibold mb-4 text-green-600">
            Payroll & Pay Period
          </h2>

          {/* Month and Salary row */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Choose Month
              </label>
              <select
                name="month"
                value={payslipData.month}
                onChange={handleInputChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                name="year"
                min="2000"
                max="2100"
                value={payslipData.year}
                onChange={handleInputChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                value={payslipData.issueDate}
                onChange={handleInputChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-4 text-green-600 mt-6">
            Earnings
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Monthly Salary (RM)
              </label>
              <input
                type="number"
                name="basicSalary"
                value={payslipData.basicSalary || ""}
                onChange={handleInputChange}
                placeholder="Type in your monthly salary (RM)"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {formErrors.value.basicSalary && (
                <p class="text-red-500 text-sm mt-1">
                  {formErrors.value.basicSalary}
                </p>
              )}
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Bonus (RM)
              </label>
              <input
                type="number"
                name="bonus"
                value={payslipData.bonus || ""}
                onChange={handleInputChange}
                placeholder="Type in your bonus (RM)"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div class="flex justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition duration-300"
            >
              Back
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
            >
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 5: Deductions */}
      {step === "deductions" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToNextStep();
          }}
          class="space-y-6"
        >
          <h2 class="text-xl font-semibold mb-4 text-green-600">
            Deductions
          </h2>

          {/* EPF Section */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                EPF Rate
              </label>
              <div class="flex flex-wrap gap-4 mt-2">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="epfRate"
                    value="0%"
                    checked={payslipData.epfRate === "0%"}
                    onChange={handleInputChange}
                    class="form-radio h-4 w-4 text-green-600"
                  />
                  <span class="ml-2">0%</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="epfRate"
                    value="9%"
                    checked={payslipData.epfRate === "9%"}
                    onChange={handleInputChange}
                    class="form-radio h-4 w-4 text-green-600"
                  />
                  <span class="ml-2">9%</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="epfRate"
                    value="5.5%"
                    checked={payslipData.epfRate === "5.5%"}
                    onChange={handleInputChange}
                    class="form-radio h-4 w-4 text-green-600"
                  />
                  <span class="ml-2">5.5%</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="epfRate"
                    value="11%"
                    checked={payslipData.epfRate === "11%"}
                    onChange={handleInputChange}
                    class="form-radio h-4 w-4 text-green-600"
                  />
                  <span class="ml-2">11%</span>
                </label>
              </div>
              <div class="mt-3">
                <p class="text-sm text-gray-600">
                  EPF deduction: RM{" "}
                  {payslipData.epfEmployeeDeduction.toFixed(2)}
                </p>
                <p class="text-sm text-gray-600">
                  Employer contribution: RM {payslipData.epfEmployer.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* SOCSO Section */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                SOCSO Type
              </label>
              <div class="flex flex-col gap-2 mt-2">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="socsoType"
                    value="both"
                    checked={payslipData.socsoType === "both"}
                    onChange={handleInputChange}
                    class="form-radio h-4 w-4 text-green-600"
                  />
                  <span class="ml-2">
                    Employment Injury Scheme and Invalidity Scheme
                  </span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="socsoType"
                    value="injury"
                    checked={payslipData.socsoType === "injury"}
                    onChange={handleInputChange}
                    class="form-radio h-4 w-4 text-green-600"
                  />
                  <span class="ml-2">Employment Injury Scheme</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="socsoType"
                    value="none"
                    checked={payslipData.socsoType === "none"}
                    onChange={handleInputChange}
                    class="form-radio h-4 w-4 text-green-600"
                  />
                  <span class="ml-2">Not Applicable</span>
                </label>
              </div>
              <div class="mt-3">
                <p class="text-sm text-gray-600">
                  SOCSO deduction: RM {payslipData.socsoEmployee.toFixed(2)}
                </p>
                <p class="text-sm text-gray-600">
                  Employer contribution: RM{" "}
                  {payslipData.socsoEmployer.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* EIS Section */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                EIS Calculation
              </label>
              <div class="flex gap-4 mt-2">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="eisType"
                    value="auto"
                    checked={payslipData.eisType === "auto"}
                    onChange={handleInputChange}
                    class="form-radio h-4 w-4 text-green-600"
                  />
                  <span class="ml-2">Auto-calculate</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="eisType"
                    value="none"
                    checked={payslipData.eisType === "none"}
                    onChange={handleInputChange}
                    class="form-radio h-4 w-4 text-green-600"
                  />
                  <span class="ml-2">Not Applicable</span>
                </label>
              </div>
              <div class="mt-3">
                <p class="text-sm text-gray-600">
                  EIS deduction: RM {payslipData.eisEmployee.toFixed(2)}
                </p>
                <p class="text-sm text-gray-600">
                  Employer contribution: RM {payslipData.eisEmployer.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* PCB Tax and Net Income */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div class="bg-gray-100 p-4 rounded">
              <h3 class="font-medium text-green-600 mb-2">
                Monthly PCB Deduction
              </h3>
              <p class="text-lg">RM {payslipData.pcbDeduction.toFixed(2)}</p>
              <p class="text-sm text-gray-500 mt-1">
                Approximately 3% of total income
              </p>
            </div>
            <div class="bg-gray-100 p-4 rounded">
              <h3 class="font-medium text-green-600 mb-2">Net Income</h3>
              <p class="text-lg">RM {getNetIncome().toFixed(2)}</p>
              <p class="text-sm text-gray-500 mt-1">
                Total earnings minus deductions
              </p>
            </div>
          </div>

          <div class="flex justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition duration-300"
            >
              Back
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
            >
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 6: Previous Payslips */}
      {step === "previous-payslips" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToNextStep();
          }}
          class="space-y-6"
        >
          <h2 class="text-xl font-semibold mb-4 text-green-600">
            Previous Payslips
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Previous Salary Total
              </label>
              <input
                type="number"
                name="previousSalaryTotal"
                value={payslipData.previousSalaryTotal || ""}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Previous PCB
              </label>
              <input
                type="number"
                name="previousPcb"
                value={payslipData.previousPcb || ""}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Previous Employee EPF
              </label>
              <input
                type="number"
                name="previousEmployeeEpf"
                value={payslipData.previousEmployeeEpf || ""}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Previous Employee SOCSO
              </label>
              <input
                type="number"
                name="previousEmployeeSocso"
                value={payslipData.previousEmployeeSocso || ""}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div class="flex justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition duration-300"
            >
              Back
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
            >
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 7: User Info */}
      {step === "user-info" && (
        <form onSubmit={handleUserInfoSubmit} class="space-y-6">
          <h2 class="text-xl font-semibold mb-4">Your Information</h2>
          <p class="text-gray-600 mb-4">
            Please provide your information to generate and download the payslip
          </p>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleUserInfoChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {formErrors.value.userName && (
                <p class="text-red-500 text-sm mt-1">
                  {formErrors.value.userName}
                </p>
              )}
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleUserInfoChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {formErrors.value.userEmail && (
                <p class="text-red-500 text-sm mt-1">
                  {formErrors.value.userEmail}
                </p>
              )}
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={userInfo.phone}
                onChange={handleUserInfoChange}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {formErrors.value.userPhone && (
                <p class="text-red-500 text-sm mt-1">
                  {formErrors.value.userPhone}
                </p>
              )}
            </div>
          </div>

          <div class="flex justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition duration-300"
            >
              Back
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
            >
              Generate Payslip
            </button>
          </div>
        </form>
      )}

      {/* Step 8: Preview */}
      {step === "preview" && (
        <div class="space-y-6">
          <div class="border-b pb-4 mb-4">
            <h2 class="text-xl font-semibold mb-4">Payslip Preview</h2>
          </div>

          {/* Payslip Preview */}
          <div class="border border-gray-300 rounded-lg overflow-hidden">
            <div class="bg-green-100 p-4 border-b border-gray-300">
              <div class="flex justify-between">
                <div>
                  <h3 class="text-xl font-bold">Payslip</h3>
                  <p class="text-sm">{payslipData.month} {payslipData.year}</p>
                  <p class="text-sm">
                    Issue Date:{" "}
                    {new Date(payslipData.issueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div class="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Company Info */}
              <div>
                <h4 class="font-semibold mb-2">Company</h4>
                <p class="text-sm">{payslipData.companyName}</p>
                <p class="text-sm whitespace-pre-line">
                  {payslipData.companyAddress}
                </p>
              </div>

              {/* Employee Info */}
              <div>
                <h4 class="font-semibold mb-2">Employee</h4>
                <p class="text-sm">{payslipData.employeeName}</p>
                <p class="text-sm">{payslipData.employeePosition}</p>
                <p class="text-sm">IC/Passport: {payslipData.employeeId}</p>
                <p class="text-sm">EPF Number: {payslipData.epfNumber}</p>
                <p class="text-sm">PCB Number: {payslipData.pcbNumber}</p>
              </div>

              {/* Personal Details */}
              <div>
                <h4 class="font-semibold mb-2">Personal Details</h4>
                <p class="text-sm">
                  Residence: {payslipData.residenceStatus === "resident"
                    ? "Resident"
                    : "Non-resident"}
                </p>
                <p class="text-sm">
                  Resident Type: {payslipData.typeOfResident}
                </p>
                <p class="text-sm">
                  Marital Status: {payslipData.marriedStatus}
                </p>
                <p class="text-sm">
                  Dependent Children: {payslipData.dependentChildren}
                </p>
              </div>
            </div>

            <div class="border-t border-gray-300 p-4">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-300">
                    <th class="text-left py-2">Earnings</th>
                    <th class="text-right py-2">Amount (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-gray-200">
                    <td class="py-2">Salary (Basic)</td>
                    <td class="text-right">
                      {payslipData.basicSalary.toFixed(2)}
                    </td>
                  </tr>
                  {payslipData.bonus > 0 && (
                    <tr class="border-b border-gray-200">
                      <td class="py-2">Bonus</td>
                      <td class="text-right">
                        {payslipData.bonus.toFixed(2)}
                      </td>
                    </tr>
                  )}
                  <tr class="border-b border-gray-300 font-semibold">
                    <td class="py-2">Total Earnings</td>
                    <td class="text-right">
                      {getTotalEarnings().toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="border-t border-gray-300 p-4">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-300">
                    <th class="text-left py-2">Deductions</th>
                    <th class="text-right py-2">Amount (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-gray-200">
                    <td class="py-2">
                      PCB <sup>1</sup>
                    </td>
                    <td class="text-right">
                      {payslipData.pcbDeduction.toFixed(2)}
                    </td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="py-2">
                      Employee EPF ({payslipData.epfRate})
                    </td>
                    <td class="text-right">
                      {payslipData.epfEmployeeDeduction.toFixed(2)}
                    </td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="py-2">Employee SOCSO</td>
                    <td class="text-right">
                      {payslipData.socsoEmployee.toFixed(2)}
                    </td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="py-2">Employee EIS</td>
                    <td class="text-right">
                      {payslipData.eisEmployee.toFixed(2)}
                    </td>
                  </tr>
                  <tr class="border-b border-gray-300 font-semibold">
                    <td class="py-2">Total Deductions</td>
                    <td class="text-right">
                      {getTotalDeductions().toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="border-t border-gray-300 p-4 bg-green-50">
              <div class="flex justify-between font-bold text-lg">
                <span>Net Income</span>
                <span>{getNetIncome().toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-sm mt-2">
                <span>Taxable Income</span>
                <span>
                  {(payslipData.basicSalary + payslipData.bonus).toFixed(2)}
                </span>
              </div>
            </div>

            <div class="border-t border-gray-300 p-4">
              <h4 class="font-semibold mb-2">Employer Contributions</h4>
              <table class="w-full">
                <tbody>
                  <tr class="border-b border-gray-200">
                    <td class="py-2">EPF</td>
                    <td class="text-right">
                      {payslipData.epfEmployer.toFixed(2)}
                    </td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="py-2">SOCSO</td>
                    <td class="text-right">
                      {payslipData.socsoEmployer.toFixed(2)}
                    </td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="py-2">EIS</td>
                    <td class="text-right">
                      {payslipData.eisEmployer.toFixed(2)}
                    </td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="py-2">HRDF</td>
                    <td class="text-right">{payslipData.hrdf.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="border-t border-gray-300 p-4">
              <h4 class="font-semibold mb-2">Previous Contributions</h4>
              <table class="w-full">
                <tbody>
                  <tr class="border-b border-gray-200">
                    <td class="py-2">Previous Salary Total</td>
                    <td class="text-right">
                      {payslipData.previousSalaryTotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="py-2">Previous PCB</td>
                    <td class="text-right">
                      {payslipData.previousPcb.toFixed(2)}
                    </td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="py-2">Previous Employee EPF</td>
                    <td class="text-right">
                      {payslipData.previousEmployeeEpf.toFixed(2)}
                    </td>
                  </tr>
                  <tr class="border-b border-gray-200">
                    <td class="py-2">Previous Employee SOCSO</td>
                    <td class="text-right">
                      {payslipData.previousEmployeeSocso.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="border-t border-gray-300 p-4 text-xs text-gray-600">
              <p>
                <sup>1</sup> Tax calculations are based on employee attributes:
                {payslipData.residenceStatus === "resident"
                  ? "Resident"
                  : "Non-resident"},
                {payslipData.marriedStatus}, Dependent Children:{" "}
                {payslipData.dependentChildren}
              </p>
              <p>
                <sup>2</sup> Contributions for EPF are calculated based on{" "}
                {payslipData.epfRate} employee rate and 13.00% employer rate
              </p>
              <p>
                <sup>3</sup>{" "}
                SOCSO and EIS contributions are capped at a salary of RM4,000
              </p>
            </div>
          </div>

          <div class="flex justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition duration-300"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleDownload}
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300 flex items-center space-x-2"
            >
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
