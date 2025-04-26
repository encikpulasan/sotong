import { Handlers } from "$fresh/server.ts";
import { calculateDeductions } from "../../utils/calculations.ts";

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

      // Parse request body to get payslip data
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

      // Use the existing download-payslip endpoint to generate the PDF
      // This is a proxy approach that reuses the existing functionality
      const payslipDataParam = encodeURIComponent(JSON.stringify(requestData));
      const apiUrl = new URL("/api/download-payslip", request.url);
      apiUrl.searchParams.set("data", payslipDataParam);

      // Forward the request to the existing endpoint
      const response = await fetch(apiUrl.toString());

      if (!response.ok) {
        const errorText = await response.text();
        return new Response(
          JSON.stringify({
            error: "PDF generation failed",
            details: errorText,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Get the HTML content
      const htmlContent = await response.text();

      // Get the filename from the response headers or generate a default one
      const contentDisposition = response.headers.get("Content-Disposition") ||
        "";
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      const filename = filenameMatch
        ? filenameMatch[1]
        : `payslip-${requestData.employeeName.replace(/\s+/g, "_")}.pdf`;

      // Return HTML with appropriate headers indicating it's from the API
      return new Response(htmlContent, {
        headers: {
          "Content-Type": "text/html",
          "X-API-Generated": "true",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } catch (error: unknown) {
      console.error("Error in download-pdf API:", error);
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
