import { getDefaultApiKey } from "../../../utils/defaultApiKey.ts";
import { Handlers } from "$fresh/server.ts";

/**
 * Handler for the API key endpoint
 * This endpoint is used to safely get an API key for client-side usage
 * without directly accessing KV in the browser
 */
export const handler: Handlers = {
  async GET(req, _ctx) {
    try {
      // Get default API key from the server (where Deno namespace is available)
      const apiKey = await getDefaultApiKey();

      // Verify that it's a valid request - in a real app, you'd want additional security here
      const host = req.headers.get("host") || "";
      const referer = req.headers.get("referer") || "";

      // Basic validation - ensure it's coming from our own domain
      // This helps prevent CSRF attacks
      if (!host.includes("localhost") && !referer.includes(host)) {
        return new Response(
          JSON.stringify({ error: "Unauthorized request" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Return the API key
      return new Response(
        JSON.stringify({ key: apiKey }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Error getting API key:", error);

      // Return an error response
      return new Response(
        JSON.stringify({
          error: "Failed to get API key",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
};
