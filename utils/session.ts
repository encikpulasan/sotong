import { getCookies, setCookie } from "$std/http/cookie.ts";
import { getKvStore } from "./kv-storage.ts";

// Session interface
export interface Session {
  id: string;
  userEmail: string;
  createdAt: string;
  expiresAt: string;
}

// Session management utilities
export class SessionManager {
  static readonly COOKIE_NAME = "payslip_session";
  private static readonly SESSION_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours

  // Create a new session
  static async createSession(userEmail: string): Promise<Session> {
    const sessionId = crypto.randomUUID();
    const now = new Date();
    const expires = new Date(now.getTime() + this.SESSION_EXPIRY);

    const session: Session = {
      id: sessionId,
      userEmail,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };

    // Store session in KV
    const store = getKvStore();
    await store.set(["sessions", sessionId], session);

    return session;
  }

  // Get session from request
  static async getSession(req: Request): Promise<Session | null> {
    const cookies = getCookies(req.headers);
    const sessionId = cookies[this.COOKIE_NAME];

    if (!sessionId) {
      return null;
    }

    // Get session from KV
    const store = getKvStore();
    const session = await store.get<Session>(["sessions", sessionId]);

    // Check if session exists and is not expired
    if (!session) {
      return null;
    }

    const now = new Date();
    const expires = new Date(session.expiresAt);
    if (now > expires) {
      // Session expired, delete it
      await store.delete(["sessions", sessionId]);
      return null;
    }

    return session;
  }

  // Set session cookie in response
  static setSessionCookie(session: Session, response: Response): Response {
    const headers = new Headers(response.headers);

    setCookie(headers, {
      name: this.COOKIE_NAME,
      value: session.id,
      expires: new Date(session.expiresAt),
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  // Delete session
  static async deleteSession(req: Request): Promise<void> {
    const cookies = getCookies(req.headers);
    const sessionId = cookies[this.COOKIE_NAME];

    if (sessionId) {
      const store = getKvStore();
      await store.delete(["sessions", sessionId]);
    }
  }
}
