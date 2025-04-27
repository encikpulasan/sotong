import { Handlers } from "$fresh/server.ts";
import { calculateDeductions } from "../../utils/calculations.ts";
import { recordApiKeyUsage } from "../../utils/apiUsers.ts";

// API key verification middleware
async function verifyApiKey(request: Request): Promise<boolean> {
  const apiKey = request.headers.get("X-API-Key");
  if (!apiKey) return false;

  // Use the recordApiKeyUsage function which checks if the key exists
  // and increments the usage count if it does
  return await recordApiKeyUsage(apiKey);
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
      const {
        salary = 0,
        bonus = 0,
        epfRate = "11%",
        socsoType = "both",
        eisType = "auto",
      } = requestData;

      // Validate input
      if (typeof salary !== "number" || typeof bonus !== "number") {
        return new Response(
          JSON.stringify({
            error: "Invalid input. Salary and bonus must be numbers",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Calculate deductions
      const results = calculateDeductions(
        salary,
        bonus,
        epfRate,
        socsoType,
        eisType,
      );

      // Return the results
      return new Response(
        JSON.stringify({
          input: {
            salary,
            bonus,
            epfRate,
            socsoType,
            eisType,
          },
          calculations: {
            ...results,
            totalEarnings: salary + bonus,
            totalDeductions: results.pcbDeduction +
              results.epfEmployeeDeduction + results.socsoEmployee +
              results.eisEmployee,
            netIncome: parseFloat(
              (salary + bonus -
                (results.pcbDeduction + results.epfEmployeeDeduction +
                  results.socsoEmployee + results.eisEmployee)).toFixed(2),
            ),
          },
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error: unknown) {
      console.error("Error in calculate API:", error);
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
