import { Head } from "$fresh/runtime.ts";

export default function ApiDocs() {
  return (
    <>
      <Head>
        <title>Payslip Generator API Documentation</title>
        <meta
          name="description"
          content="API documentation for the Payslip Generator service"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
        />
        <style>
          {`
            body { max-width: 1200px; margin: 0 auto; padding: 1rem; }
            pre { background-color: #f6f8fa; padding: 1rem; overflow: auto; }
            .api-key { background-color: #fff3cd; padding: 1rem; border-radius: 4px; margin: 1rem 0; }
            .endpoint { margin: 2rem 0; }
            .method { font-weight: bold; padding: 0.2rem 0.5rem; border-radius: 4px; margin-right: 0.5rem; }
            .post { background-color: #10b981; color: white; }
            .get { background-color: #3b82f6; color: white; }
            .example code { display: block; white-space: pre; }
          `}
        </style>
      </Head>

      <main>
        <h1>Payslip Generator API Documentation</h1>

        <p>
          This API allows you to calculate payslip deductions, preview payslips
          in HTML format, and generate downloadable payslips in PDF format. All
          according to Malaysian standards for EPF, SOCSO, and EIS calculations.
        </p>

        <div class="api-key">
          <h2>Authentication</h2>
          <p>
            All API requests require an API key, sent as the{" "}
            <code>X-API-Key</code> header. For testing purposes, use:{" "}
            <code>test_api_key_12345</code>
          </p>
          <p>
            <small>
              Note: In a production environment, you would need to request an
              API key from the service administrator.
            </small>
          </p>
        </div>

        <h2>Endpoints</h2>

        <div class="endpoint">
          <h3>
            <span class="method post">POST</span>
            <code>/api/calculate</code> - Calculate Payslip Deductions
          </h3>
          <p>Calculate deductions based on salary and other parameters.</p>

          <h4>Request Body:</h4>
          <pre>{`{
  "salary": 5000,          // Required: Monthly basic salary
  "bonus": 1000,           // Optional: Bonus amount (default: 0)
  "epfRate": "11%",        // Optional: EPF employee rate (default: "11%", options: "0%", "9%", "5.5%", "11%")
  "socsoType": "both",     // Optional: SOCSO scheme type (default: "both", options: "both", "injury", "none")
  "eisType": "auto"        // Optional: EIS calculation (default: "auto", options: "auto", "none")
}`}</pre>

          <h4>Response:</h4>
          <pre>{`{
  "input": {
    "salary": 5000,
    "bonus": 1000,
    "epfRate": "11%",
    "socsoType": "both",
    "eisType": "auto"
  },
  "calculations": {
    "pcbDeduction": 180,             // PCB (tax) deduction
    "epfEmployeeDeduction": 660,     // Employee EPF contribution
    "socsoEmployee": 20,             // Employee SOCSO contribution (capped at RM4,000)
    "eisEmployee": 8,                // Employee EIS contribution (capped at RM4,000)
    "epfEmployer": 780,              // Employer EPF contribution
    "socsoEmployer": 70,             // Employer SOCSO contribution (capped at RM4,000)
    "eisEmployer": 8,                // Employer EIS contribution (capped at RM4,000)
    "hrdf": 25,                      // HRDF contribution (0.5% of salary)
    "totalEarnings": 6000,           // Total earnings (salary + bonus)
    "totalDeductions": 868,          // Total deductions
    "netIncome": 5132                // Net income after deductions
  }
}`}</pre>
        </div>

        <div class="endpoint">
          <h3>
            <span class="method post">POST</span>
            <code>/api/preview-payslip</code> - Preview Payslip
          </h3>
          <p>Generate a preview of the payslip in HTML or JSON format.</p>

          <h4>Request Body:</h4>
          <pre>{`{
  // Required fields
  "companyName": "Tech Sdn Bhd",     // Company name
  "employeeName": "John Doe",        // Employee name
  "basicSalary": 5000,               // Basic salary

  // Optional fields - if not provided, these will be calculated automatically
  "bonus": 1000,                     // Bonus amount
  "companyAddress": "123 Main St",   // Company address
  "employeePosition": "Developer",   // Employee position
  "employeeId": "123456",            // IC/Passport number
  "epfNumber": "123456",             // EPF number
  "pcbNumber": "123456",             // PCB number
  "residenceStatus": "resident",     // Residence status
  "typeOfResident": "Normal",        // Resident type
  "marriedStatus": "Single",         // Marital status
  "dependentChildren": 0,            // Number of dependent children
  "month": "January",                // Month
  "year": "2023",                    // Year
  "issueDate": "2023-01-31",         // Issue date
  "epfRate": "11%",                  // EPF rate
  "socsoType": "both",               // SOCSO type
  "eisType": "auto"                  // EIS type
}`}</pre>

          <h4>Query Parameters:</h4>
          <ul>
            <li>
              <code>format</code>{" "}
              - Response format (default: "html", options: "html", "json")
            </li>
          </ul>

          <h4>Response (format=html):</h4>
          <p>Returns an HTML document with the payslip preview.</p>

          <h4>Response (format=json):</h4>
          <pre>{`{
  "payslipData": {
    // All payslip data fields
  },
  "calculations": {
    "totalDeductions": 868,
    "netIncome": 5132,
    "totalEarnings": 6000
  }
}`}</pre>
        </div>

        <div class="endpoint">
          <h3>
            <span class="method post">POST</span>
            <code>/api/download-pdf</code> - Download Payslip PDF
          </h3>
          <p>Generate a downloadable payslip in PDF format.</p>

          <h4>Request Body:</h4>
          <p>
            Same as <code>/api/preview-payslip</code>
          </p>

          <h4>Response:</h4>
          <p>
            Returns the payslip as a downloadable HTML document with appropriate
            headers.
          </p>
        </div>

        <h2>Examples</h2>

        <div class="example">
          <h3>Calculate deductions</h3>
          <code>
            {`curl -X POST https://your-domain.com/api/calculate \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: test_api_key_12345" \\
  -d '{
    "salary": 5000,
    "bonus": 1000,
    "epfRate": "11%",
    "socsoType": "both",
    "eisType": "auto"
  }'`}
          </code>
        </div>

        <div class="example">
          <h3>Preview payslip</h3>
          <code>
            {`curl -X POST https://your-domain.com/api/preview-payslip?format=json \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: test_api_key_12345" \\
  -d '{
    "companyName": "Tech Sdn Bhd",
    "employeeName": "John Doe",
    "basicSalary": 5000,
    "bonus": 1000
  }'`}
          </code>
        </div>

        <div class="example">
          <h3>Generate PDF</h3>
          <code>
            {`curl -X POST https://your-domain.com/api/download-pdf \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: test_api_key_12345" \\
  -d '{
    "companyName": "Tech Sdn Bhd",
    "employeeName": "John Doe",
    "basicSalary": 5000,
    "bonus": 1000
  }'`}
          </code>
        </div>

        <footer style="margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #eee;">
          <p>
            <small>
              &copy; {new Date().getFullYear()}{" "}
              Payslip Generator API. All rights reserved.
            </small>
          </p>
        </footer>
      </main>
    </>
  );
}
