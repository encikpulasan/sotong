import { Handlers } from "$fresh/server.ts";
import { ApiSessionManager } from "../../utils/apiUsers.ts";
import { deleteCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
  async GET(req, _ctx) {
    // Delete the session from KV
    await ApiSessionManager.deleteSession(req);

    // Create response to redirect to login page
    const headers = new Headers();
    headers.set("Location", "/api/login");

    // Also clear the cookie
    deleteCookie(headers, ApiSessionManager.COOKIE_NAME, {
      path: "/",
    });

    return new Response(null, {
      status: 302,
      headers,
    });
  },
};
