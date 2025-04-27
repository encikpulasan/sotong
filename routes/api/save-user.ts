/// <reference lib="deno.unstable" />
import { Handlers } from "$fresh/server.ts";
import { getUserByEmail, saveUser, UserData } from "../../utils/kv-storage.ts";

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

export const handler: Handlers = {
  async GET(req) {
    try {
      const url = new URL(req.url);
      const email = url.searchParams.get("email");

      if (!email) {
        return new Response("Email parameter is required", { status: 400 });
      }

      const userData = await getUserByEmail(email);

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

      const userData: UserData = {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        createdAt: new Date().toISOString(),
      };

      const success = await saveUser(userData);

      if (!success) {
        return new Response("Failed to save user data", { status: 500 });
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
