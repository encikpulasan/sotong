/// <reference lib="deno.unstable" />
import { Handlers } from "$fresh/server.ts";
import { getPayslipById } from "../../utils/kv-storage.ts";
import { recordApiKeyUsage } from "../../utils/apiUsers.ts";

// API key verification middleware
async function verifyApiKey(request: Request): Promise<boolean> {
  const apiKey = request.headers.get("X-API-Key");
  if (!apiKey) return false;

  // Use the recordApiKeyUsage function which checks if the key exists
  // and increments the usage count if it does
  return await recordApiKeyUsage(apiKey);
}

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

  // Previous payslips
  previousSalaryTotal: number;
  previousPcb: number;
  previousEmployeeEpf: number;
  previousEmployeeSocso: number;
}

export const handler: Handlers = {
  async GET(req) {
    try {
      // API key authentication
      const isAuthenticated = await verifyApiKey(req);
      if (!isAuthenticated) {
        return new Response(
          JSON.stringify({ error: "Unauthorized. Invalid or missing API key" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const url = new URL(req.url);
      const payslipId = url.searchParams.get("id");
      const payslipDataStr = url.searchParams.get("data");

      let payslipData: PayslipData;

      // First try to get data from KV storage using ID
      if (payslipId) {
        const storedPayslip = await getPayslipById(payslipId);
        if (storedPayslip && storedPayslip.data) {
          // Use the stored payslip data with type assertion for safety
          payslipData = storedPayslip.data as unknown as PayslipData;
        } else {
          return new Response("Payslip not found", { status: 404 });
        }
      } else if (payslipDataStr) {
        // Fall back to query parameter data if no ID is provided
        payslipData = JSON.parse(payslipDataStr);
      } else {
        return new Response("Missing payslip data or ID", { status: 400 });
      }

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

      // Generate HTML
      const html = `
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
    .print-button {
      display: block;
      margin: 20px auto;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    @media print {
      .print-button {
        display: none;
      }
      body {
        padding: 0;
      }
      .payslip {
        border: none;
        box-shadow: none;
      }
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
            <td class="amount-column">${payslipData.basicSalary.toFixed(2)}</td>
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
            <td class="amount-column">${payslipData.eisEmployee.toFixed(2)}</td>
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
        <span>${(payslipData.basicSalary + payslipData.bonus).toFixed(2)}</span>
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

  <button class="print-button" onclick="window.print()">Print Payslip</button>

  <script>
    // Auto print if needed
    // window.onload = function() {
    //   window.print();
    // };
  </script>
</body>
</html>
      `;

      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    } catch (error) {
      console.error("Error generating payslip:", error);
      return new Response("Internal server error", { status: 500 });
    }
  },
};
