/// <reference lib="deno.unstable" />
import { Handlers } from "$fresh/server.ts";
import {
  getPayslipById,
  getUserPayslips,
  PayslipData,
  savePayslip,
} from "../../utils/kv-storage.ts";
import { crypto } from "$std/crypto/mod.ts";

// Convert ArrayBuffer to a hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Generate a unique ID
async function generateId(): Promise<string> {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(crypto.randomUUID() + Date.now().toString()),
  );
  return bufferToHex(buffer).slice(0, 16);
}

export const handler: Handlers = {
  async GET(req) {
    try {
      const url = new URL(req.url);
      const userId = url.searchParams.get("userId");
      const payslipId = url.searchParams.get("id");

      if (payslipId) {
        // Get a specific payslip
        const payslip = await getPayslipById(payslipId);

        if (!payslip) {
          return new Response("Payslip not found", { status: 404 });
        }

        return new Response(JSON.stringify(payslip), {
          headers: { "Content-Type": "application/json" },
        });
      } else if (userId) {
        // Get all payslips for a user
        const payslips = await getUserPayslips(userId);

        return new Response(JSON.stringify(payslips), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response("Either userId or id parameter is required", {
          status: 400,
        });
      }
    } catch (error) {
      console.error("Error retrieving payslip(s):", error);
      return new Response("Internal server error", { status: 500 });
    }
  },

  async POST(req) {
    try {
      const data = await req.json();

      // Validate required fields
      if (!data.userId || !data.data) {
        return new Response("Missing required fields", { status: 400 });
      }

      const payslipId = await generateId();

      const payslipData: PayslipData = {
        id: payslipId,
        userId: data.userId,
        data: data.data,
        createdAt: new Date().toISOString(),
      };

      const success = await savePayslip(payslipData);

      if (!success) {
        return new Response("Failed to save payslip data", { status: 500 });
      }

      return new Response(
        JSON.stringify({
          success: true,
          id: payslipId,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Error saving payslip:", error);
      return new Response("Internal server error", { status: 500 });
    }
  },
};
