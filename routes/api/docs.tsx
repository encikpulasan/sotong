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
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M2 14a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4zm14 0H4v4h12v-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-xl font-semibold text-gray-800">
                Payslip API
              </span>
            </div>
            <div>
              <a
                href="/"
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                Back to Home
              </a>
            </div>
          </div>
        </header>

        <div className="py-10">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-gray-900">
                API Documentation
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                This API allows you to calculate payslip deductions, preview
                payslips, save user data, and generate downloadable payslips
                according to Malaysian standards.
              </p>
            </div>

            {/* Authentication Section */}
            <div id="authentication" className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Authentication</h2>
              <p className="mb-4">
                All API requests require an API key sent as the{" "}
                <code>X-API-Key</code> header.
              </p>
              <p className="mb-4">
                You can generate an API key by registering for an account at
                {" "}
                <a
                  href="/api/register"
                  className="text-blue-600 hover:underline"
                >
                  /api/register
                </a>{" "}
                and then accessing your{" "}
                <a
                  href="/api/dashboard"
                  className="text-blue-600 hover:underline"
                >
                  API dashboard
                </a>.
              </p>
            </div>

            {/* Endpoints Section */}
            <div className="space-y-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Endpoints
              </h2>

              {/* Calculate Endpoint */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-3">
                    POST
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    /api/calculate
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-gray-700 mb-4">
                    Calculate deductions based on salary and other parameters.
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Request Body
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                      <pre className="text-sm text-gray-800">{`{
  "salary": 5000,          // Required: Monthly basic salary
  "bonus": 1000,           // Optional: Bonus amount (default: 0)
  "epfRate": "11%",        // Optional: EPF employee rate (default: "11%", options: "0%", "9%", "5.5%", "11%")
  "socsoType": "both",     // Optional: SOCSO scheme type (default: "both", options: "both", "injury", "none")
  "eisType": "auto"        // Optional: EIS calculation (default: "auto", options: "auto", "none")
}`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Response
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                      <pre className="text-sm text-gray-800">{`{
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
                  </div>
                </div>
              </div>

              {/* Preview Payslip Endpoint */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-3">
                    POST
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    /api/preview-payslip
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-gray-700 mb-4">
                    Generate a preview of the payslip in HTML or JSON format.
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Request Body
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                      <pre className="text-sm text-gray-800">{`{
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
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Query Parameters
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <ul className="list-disc list-inside text-sm text-gray-800">
                        <li>
                          <code className="bg-gray-200 px-1 py-0.5 rounded">
                            format
                          </code>{" "}
                          - Response format (default: "html", options: "html",
                          "json")
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Response
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-800 mb-2">
                        <strong>format=html:</strong>{" "}
                        Returns an HTML document with the payslip preview.
                      </p>
                      <p className="text-sm text-gray-800 mb-2">
                        <strong>format=json:</strong>{" "}
                        Returns JSON data with payslip details and calculations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Payslip Endpoint */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-3">
                    GET
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    /api/download-payslip
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-gray-700 mb-4">
                    Generate a downloadable payslip.
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Query Parameters
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <ul className="list-disc list-inside text-sm text-gray-800">
                        <li>
                          <code className="bg-gray-200 px-1 py-0.5 rounded">
                            id
                          </code>{" "}
                          - Payslip ID stored in KV database
                        </li>
                        <li>
                          <code className="bg-gray-200 px-1 py-0.5 rounded">
                            data
                          </code>{" "}
                          - JSON string with payslip data (fallback if id is not
                          provided)
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Response
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-800">
                        Returns an HTML document formatted as a payslip, ready
                        for printing or saving as PDF.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save User Endpoint */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-3">
                    POST
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    /api/save-user
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-gray-700 mb-4">
                    Save user information to the KV database.
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Request Body
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                      <pre className="text-sm text-gray-800">{`{
  "name": "John Doe",      // Required: User's name
  "email": "john@example.com",  // Required: User's email (used as unique identifier)
  "phone": "0123456789"    // Required: User's phone number
}`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Response
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                      <pre className="text-sm text-gray-800">{`{
  "success": true  // Boolean indicating if the operation was successful
}`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get User Endpoint */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-3">
                    GET
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    /api/save-user
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-gray-700 mb-4">
                    Retrieve user information from the KV database.
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Query Parameters
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <ul className="list-disc list-inside text-sm text-gray-800">
                        <li>
                          <code className="bg-gray-200 px-1 py-0.5 rounded">
                            email
                          </code>{" "}
                          - User's email address (required)
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Response
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                      <pre className="text-sm text-gray-800">{`{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0123456789",
  "createdAt": "2023-08-01T12:34:56.789Z"
}`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Payslip Endpoint */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-3">
                    POST
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    /api/save-payslip
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-gray-700 mb-4">
                    Save payslip data to the KV database.
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Request Body
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                      <pre className="text-sm text-gray-800">{`{
  "userId": "user@example.com",  // Required: User's email to associate with this payslip
  "data": {                     // Required: Payslip data (same format as preview-payslip)
    "companyName": "Tech Sdn Bhd",
    "employeeName": "John Doe",
    "basicSalary": 5000,
    // ... other payslip fields
  }
}`}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Response
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                      <pre className="text-sm text-gray-800">{`{
  "success": true,
  "id": "a1b2c3d4e5f6..."  // Unique ID for the saved payslip
}`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get Payslip Endpoint */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-3">
                    GET
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    /api/save-payslip
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-gray-700 mb-4">
                    Retrieve payslip data from the KV database.
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Query Parameters
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <ul className="list-disc list-inside text-sm text-gray-800">
                        <li>
                          <code className="bg-gray-200 px-1 py-0.5 rounded">
                            id
                          </code>{" "}
                          - Payslip ID to retrieve a specific payslip
                        </li>
                        <li>
                          <code className="bg-gray-200 px-1 py-0.5 rounded">
                            userId
                          </code>{" "}
                          - User's email to retrieve all payslips for a user
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Response (id parameter)
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto mb-4">
                      <pre className="text-sm text-gray-800">{`{
  "id": "a1b2c3d4e5f6...",
  "userId": "user@example.com",
  "data": {
    // Payslip data
  },
  "createdAt": "2023-08-01T12:34:56.789Z"
}`}</pre>
                    </div>

                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Response (userId parameter)
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                      <pre className="text-sm text-gray-800">{`[
  {
    "id": "a1b2c3d4e5f6...",
    "userId": "user@example.com",
    "data": {
      // Payslip data
    },
    "createdAt": "2023-08-01T12:34:56.789Z"
  },
  {
    "id": "g7h8i9j0k1l2...",
    "userId": "user@example.com",
    "data": {
      // Payslip data
    },
    "createdAt": "2023-08-15T15:30:45.123Z"
  }
  // ... more payslips
]`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Examples Section */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Examples
              </h2>

              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Curl Examples
                  </h3>
                </div>
                <div className="px-6 py-5 space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Calculate deductions
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                      <pre className="bg-gray-800 text-green-400 p-4 rounded-md overflow-x-auto text-sm">
                        {`curl -X POST http://localhost:8000/api/calculate \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{
    "salary": 5000,
    "bonus": 1000,
    "epfRate": "11%",
    "socsoType": "both",
    "eisType": "auto"
  }'`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Save user data
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                      <pre className="bg-gray-800 text-green-400 p-4 rounded-md overflow-x-auto text-sm">
                        {`curl -X POST http://localhost:8000/api/save-user \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0123456789"
  }'`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Save payslip
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                      <pre className="bg-gray-800 text-green-400 p-4 rounded-md overflow-x-auto text-sm">
                        {`curl -X POST http://localhost:8000/api/save-payslip \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{
    "userId": "john@example.com",
    "data": {
      "companyName": "Tech Sdn Bhd",
      "employeeName": "John Doe",
      "basicSalary": 5000,
      "bonus": 1000
    }
  }'`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Download a payslip by ID
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                      <pre className="bg-gray-800 text-green-400 p-4 rounded-md overflow-x-auto text-sm">
                        {`curl -X GET "http://localhost:8000/api/download-payslip?id=a1b2c3d4e5f6..." \\
  -H "X-API-Key: YOUR_API_KEY"`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        <footer className="bg-white border-t border-gray-200 mt-24">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()}{" "}
              Malaysian Payslip Generator API. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
