import { Handlers } from "$fresh/server.ts";
import { ApiSessionManager } from "../../../utils/apiUsers.ts";
import { deleteCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
  GET: async (req) => {
    // Delete the user session from KV
    await ApiSessionManager.deleteSession(req);

    // Create response that redirects to login page
    const headers = new Headers({
      "Location": "/api/login",
    });

    // Clear session cookie
    deleteCookie(headers, ApiSessionManager.COOKIE_NAME, { path: "/" });

    return new Response(null, {
      status: 302,
      headers,
    });
  },
};
