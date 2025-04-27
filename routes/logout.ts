import { Handlers } from "$fresh/server.ts";
import { SessionManager } from "../utils/session.ts";
import { deleteCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
  async GET(req, _ctx) {
    // Delete the session from KV
    await SessionManager.deleteSession(req);

    // Create response to redirect to home page
    const headers = new Headers();
    headers.set("Location", "/");

    // Also clear the cookie
    deleteCookie(headers, SessionManager.COOKIE_NAME, {
      path: "/",
    });

    return new Response(null, {
      status: 302,
      headers,
    });
  },
};
