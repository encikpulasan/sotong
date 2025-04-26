/// <reference lib="deno.unstable" />
import { Handlers } from "$fresh/server.ts";

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

// In-memory storage as a fallback when Deno KV is not available
const inMemoryUsers = new Map<string, Record<string, unknown>>();

export const handler: Handlers = {
  async GET(req) {
    try {
      const url = new URL(req.url);
      const email = url.searchParams.get("email");

      if (!email) {
        return new Response("Email parameter is required", { status: 400 });
      }

      const userId = `user:${email}`;
      let userData: Record<string, unknown> | null = null;

      try {
        // Try to get from Deno KV
        const kv = await Deno.openKv();
        const entry = await kv.get([userId]);
        userData = entry.value as Record<string, unknown> | null;
        kv.close();
      } catch (kvError) {
        // Fallback to in-memory storage
        console.warn(
          "Deno KV not available for retrieval, using in-memory storage:",
          kvError,
        );
        userData = inMemoryUsers.get(userId) || null;
      }

      if (!userData) {
        return new Response("User not found", { status: 404 });
      }

      return new Response(JSON.stringify(userData), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error retrieving user:", error);
      return new Response("Internal server error", { status: 500 });
    }
  },

  async POST(req) {
    try {
      const userInfo = await req.json() as UserInfo;

      // Validate required fields
      if (!userInfo.name || !userInfo.email || !userInfo.phone) {
        return new Response("Missing required fields", { status: 400 });
      }

      // Create a unique ID for the user based on email
      const userId = `user:${userInfo.email}`;

      const userData = {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        createdAt: new Date().toISOString(),
      };

      try {
        // Try to use Deno KV
        const kv = await Deno.openKv();
        await kv.set([userId], userData);
        kv.close();
        console.log("User saved to Deno KV:", userId);
      } catch (kvError) {
        // Fallback to in-memory storage if Deno KV is not available
        console.warn(
          "Deno KV not available, using in-memory storage:",
          kvError,
        );
        inMemoryUsers.set(userId, userData);
        console.log("User saved to in-memory storage:", userId);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error saving user:", error);
      return new Response("Internal server error", { status: 500 });
    }
  },
};
