import { Handlers } from "$fresh/server.ts";
import { calculateDeductions } from "../../utils/calculations.ts";

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
  residenceStatus: string;
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
  epfRate: string;
  socsoEmployee: number;
  socsoType: string;
  eisEmployee: number;
  eisType: string;

  // Employer contributions
  epfEmployer: number;
  socsoEmployer: number;
  eisEmployer: number;
  hrdf: number;
}

// API key verification middleware
async function verifyApiKey(request: Request): Promise<boolean> {
  const apiKey = request.headers.get("X-API-Key");
  if (!apiKey) return false;

  // In a production environment, you would verify this against a database
  const validApiKey = "test_api_key_12345"; // Replace with secure key storage in production

  return apiKey === validApiKey;
}

export const handler: Handlers = {
  async POST(request) {
    try {
      // API key authentication
      const isAuthenticated = await verifyApiKey(request);
      if (!isAuthenticated) {
        return new Response(
          JSON.stringify({ error: "Unauthorized. Invalid or missing API key" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Parse request body
      const requestData = await request.json();

      // Validate required fields
      const requiredFields = ["companyName", "employeeName", "basicSalary"];
      for (const field of requiredFields) {
        if (!requestData[field]) {
          return new Response(
            JSON.stringify({ error: `Missing required field: ${field}` }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }

      // Auto-calculate deductions if not provided
      if (
        !requestData.pcbDeduction || !requestData.epfEmployeeDeduction ||
        !requestData.socsoEmployee || !requestData.eisEmployee
      ) {
        const deductions = calculateDeductions(
          requestData.basicSalary || 0,
          requestData.bonus || 0,
          requestData.epfRate || "11%",
          requestData.socsoType || "both",
          requestData.eisType || "auto",
        );

        // Apply calculated values
        Object.assign(requestData, deductions);
      }

      // Prepare complete payslip data
      const payslipData: PayslipData = {
        // Company information
        companyName: requestData.companyName || "",
        companyAddress: requestData.companyAddress || "",

        // Employee information
        employeeName: requestData.employeeName || "",
        employeePosition: requestData.employeePosition || "",
        employeeId: requestData.employeeId || "",
        epfNumber: requestData.epfNumber || "",
        pcbNumber: requestData.pcbNumber || "",

        // Personal details
        residenceStatus: requestData.residenceStatus || "resident",
        typeOfResident: requestData.typeOfResident || "Normal",
        marriedStatus: requestData.marriedStatus || "Single",

        // Children
        dependentChildren: requestData.dependentChildren || 0,

        // Pay period
        month: requestData.month ||
          new Date().toLocaleString("default", { month: "long" }),
        year: requestData.year || new Date().getFullYear().toString(),
        issueDate: requestData.issueDate ||
          new Date().toISOString().substring(0, 10),

        // Earnings
        basicSalary: requestData.basicSalary || 0,
        bonus: requestData.bonus || 0,

        // Deductions
        pcbDeduction: requestData.pcbDeduction || 0,
        epfEmployeeDeduction: requestData.epfEmployeeDeduction || 0,
        epfRate: requestData.epfRate || "11%",
        socsoEmployee: requestData.socsoEmployee || 0,
        socsoType: requestData.socsoType || "both",
        eisEmployee: requestData.eisEmployee || 0,
        eisType: requestData.eisType || "auto",

        // Employer contributions
        epfEmployer: requestData.epfEmployer || 0,
        socsoEmployer: requestData.socsoEmployer || 0,
        eisEmployer: requestData.eisEmployer || 0,
        hrdf: requestData.hrdf || 0,
      };

      // Calculate total deductions
      const totalDeductions = payslipData.pcbDeduction +
        payslipData.epfEmployeeDeduction +
        payslipData.socsoEmployee +
        payslipData.eisEmployee;

      // Calculate net income
      const netIncome = parseFloat(
        (payslipData.basicSalary + payslipData.bonus - totalDeductions).toFixed(
          2,
        ),
      );

      // Generate HTML preview
      const html = generatePayslipHtml(payslipData, totalDeductions, netIncome);

      // Determine response based on format requested
      const format = new URL(request.url).searchParams.get("format") || "html";

      if (format === "json") {
        return new Response(
          JSON.stringify({
            payslipData,
            calculations: {
              totalDeductions,
              netIncome,
              totalEarnings: payslipData.basicSalary + payslipData.bonus,
            },
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      } else {
        return new Response(html, {
          headers: { "Content-Type": "text/html" },
        });
      }
    } catch (error: unknown) {
      console.error("Error in preview-payslip API:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      return new Response(
        JSON.stringify({
          error: "Internal server error",
          details: errorMessage,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
};

// Generate HTML for payslip preview
function generatePayslipHtml(
  payslipData: PayslipData,
  totalDeductions: number,
  netIncome: number,
): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payslip - ${payslipData.employeeName} - ${payslipData.month} ${payslipData.year}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        color: #333;
        line-height: 1.4;
      }
      .payslip {
        max-width: 900px;
        margin: 0 auto;
        border: 1px solid #ddd;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .header-bar {
        background-color: #4CAF50;
        height: 10px;
        width: 100%;
      }
      .payslip-content {
        padding: 20px;
      }
      .header-section {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
      }
      .header-column {
        flex: 1;
      }
      .payslip-title {
        font-size: 20px;
        font-weight: bold;
        margin: 0 0 5px 0;
        color: #333;
      }
      .payslip-date {
        color: #666;
        margin: 0;
        font-size: 14px;
      }
      .section-title {
        color: #4CAF50;
        margin: 0 0 10px 0;
        font-size: 16px;
        font-weight: 600;
      }
      .company-info p, .employee-info p {
        margin: 3px 0;
        font-size: 14px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      th, td {
        padding: 8px 10px;
        text-align: left;
        font-size: 14px;
        border-bottom: 1px solid #eee;
      }
      th {
        color: #4CAF50;
        font-weight: 600;
      }
      .amount-column {
        text-align: right;
      }
      .total-row td {
        font-weight: bold;
        border-top: 1px solid #ddd;
      }
      .net-income-row {
        background-color: #4CAF50;
        color: white;
        font-weight: bold;
        padding: 10px;
        display: flex;
        justify-content: space-between;
      }
      .taxable-income-row {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
      }
      .employer-contributions {
        display: flex;
        flex-wrap: wrap;
      }
      .employer-column {
        flex: 1;
        min-width: 150px;
        margin-right: 20px;
        margin-bottom: 15px;
      }
      .employer-column h3 {
        margin: 0 0 8px 0;
        font-size: 14px;
        font-weight: 600;
      }
      .footnotes {
        font-size: 12px;
        color: #777;
        margin-top: 30px;
        padding-top: 15px;
        border-top: 1px solid #eee;
      }
      .footnote {
        margin: 5px 0;
      }
      .api-info {
        text-align: center;
        font-size: 12px;
        color: #888;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="payslip">
      <div class="header-bar"></div>
      <div class="payslip-content">
        <div class="header-section">
          <div class="header-column">
            <h1 class="payslip-title">Payslip</h1>
            <p class="payslip-date">${payslipData.month} ${payslipData.year}</p>
            <p class="payslip-date">Issue Date: ${
    new Date(payslipData.issueDate).toLocaleDateString()
  }</p>
          </div>
          <div class="header-column">
            <h2 class="section-title">Company</h2>
            <div class="company-info">
              <p><strong>${payslipData.companyName}</strong></p>
              <p>${payslipData.companyAddress.split("\n").join("<br>")}</p>
            </div>
          </div>
          <div class="header-column">
            <h2 class="section-title">Employee</h2>
            <div class="employee-info">
              <p><strong>${payslipData.employeeName}</strong></p>
              <p>${payslipData.employeePosition}</p>
              <p>IC/Passport: ${payslipData.employeeId}</p>
              <p>EPF Number: ${payslipData.epfNumber}</p>
              <p>PCB Number: ${payslipData.pcbNumber}</p>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 60%;">Earnings</th>
              <th style="width: 20%;">Rate</th>
              <th style="width: 20%;" class="amount-column">Current Period (RM)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Salary (Basic)</td>
              <td></td>
              <td class="amount-column">${
    payslipData.basicSalary.toFixed(2)
  }</td>
            </tr>
            ${
    payslipData.bonus > 0
      ? `
            <tr>
              <td>Bonus</td>
              <td></td>
              <td class="amount-column">${payslipData.bonus.toFixed(2)}</td>
            </tr>`
      : ""
  }
            <tr class="total-row">
              <td>Total Earnings</td>
              <td></td>
              <td class="amount-column">${
    (payslipData.basicSalary + payslipData.bonus).toFixed(2)
  }</td>
            </tr>
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th style="width: 60%;">Deductions</th>
              <th style="width: 20%;"></th>
              <th style="width: 20%;" class="amount-column"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PCB <sup>1</sup></td>
              <td></td>
              <td class="amount-column">${
    payslipData.pcbDeduction.toFixed(2)
  }</td>
            </tr>
            <tr>
              <td>Employee EPF <sup>3</sup></td>
              <td></td>
              <td class="amount-column">${
    payslipData.epfEmployeeDeduction.toFixed(2)
  }</td>
            </tr>
            <tr>
              <td>Employee SOCSO</td>
              <td></td>
              <td class="amount-column">${
    payslipData.socsoEmployee.toFixed(2)
  }</td>
            </tr>
            <tr>
              <td>Employee EIS</td>
              <td></td>
              <td class="amount-column">${
    payslipData.eisEmployee.toFixed(2)
  }</td>
            </tr>
            <tr class="total-row">
              <td>Total Deductions</td>
              <td></td>
              <td class="amount-column">${totalDeductions.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="net-income-row">
          <span>Net Income</span>
          <span>${netIncome.toFixed(2)}</span>
        </div>

        <div class="taxable-income-row">
          <span>Taxable Income</span>
          <span>${
    (payslipData.basicSalary + payslipData.bonus).toFixed(2)
  }</span>
        </div>

        <div style="margin-top: 20px;">
          <h2 class="section-title">Employer Contributions</h2>
          <div class="employer-contributions">
            <div class="employer-column">
              <h3>EPF <sup>3</sup></h3>
              <p>${payslipData.epfEmployer.toFixed(2)}</p>
            </div>
            <div class="employer-column">
              <h3>SOCSO</h3>
              <p>${payslipData.socsoEmployer.toFixed(2)}</p>
            </div>
            <div class="employer-column">
              <h3>EIS</h3>
              <p>${payslipData.eisEmployer.toFixed(2)}</p>
            </div>
            <div class="employer-column">
              <h3>HRDF</h3>
              <p>${payslipData.hrdf.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div class="footnotes">
          <p class="footnote"><sup>1</sup> Tax calculations are based on employee attributes: 
          ${
    payslipData.residenceStatus === "resident" ? "Resident" : "Non-resident"
  },
          ${payslipData.marriedStatus}, 
          Dependent Children: ${payslipData.dependentChildren}</p>
          <p class="footnote"><sup>3</sup> Contributions for EPF are calculated based on ${payslipData.epfRate} employee rate and 13.00% employer rate</p>
          <p class="footnote"><sup>3</sup> SOCSO and EIS contributions are capped at a salary of RM4,000</p>
        </div>
      </div>
    </div>
    
    <div class="api-info">
      Generated via Payslip API
    </div>
  </body>
  </html>
  `;
}
