import { getKvStore } from "./kv-storage.ts";
import { Session } from "./session.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";

// API User model
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  apiKeys: ApiKey[];
  createdAt: string;
}

// API Key model
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed?: string;
  usageCount: number;
  createdAt: string;
}

// API User helper functions
export async function createApiUser(
  name: string,
  email: string,
  password: string,
): Promise<ApiUser> {
  const store = getKvStore();

  // Check if user already exists
  const existingUser = await getApiUserByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash the password (in a real app, use a proper password hashing library)
  const passwordHash = await hashPassword(password);

  const user: ApiUser = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    apiKeys: [],
    createdAt: new Date().toISOString(),
  };

  await store.set(["apiUsers", user.id], user);
  await store.set(["apiUsersByEmail", email], user.id);

  return user;
}

export async function getAllUsers(): Promise<ApiUser[]> {
  const store = getKvStore();
  const users = await store.list<ApiUser>(["users"]);
  return users;
}

export async function getApiUserByEmail(
  email: string,
): Promise<ApiUser | null> {
  const store = getKvStore();
  const userId = await store.get<string>(["apiUsersByEmail", email]);

  if (!userId) return null;

  return await store.get<ApiUser>(["apiUsers", userId]);
}

export async function getApiUserById(id: string): Promise<ApiUser | null> {
  const store = getKvStore();
  return await store.get<ApiUser>(["apiUsers", id]);
}

export async function verifyApiUser(
  email: string,
  password: string,
): Promise<ApiUser | null> {
  const user = await getApiUserByEmail(email);

  if (!user) return null;

  const isValid = await verifyPassword(password, user.passwordHash);
  return isValid ? user : null;
}

export async function generateApiKey(
  userId: string,
  name: string,
): Promise<ApiKey> {
  const store = getKvStore();
  const user = await getApiUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const apiKey: ApiKey = {
    id: crypto.randomUUID(),
    name,
    key: crypto.randomUUID().replaceAll("-", "") +
      crypto.randomUUID().replaceAll("-", ""),
    usageCount: 0,
    createdAt: new Date().toISOString(),
  };

  user.apiKeys.push(apiKey);
  await store.set(["apiUsers", user.id], user);

  return apiKey;
}

export async function revokeApiKey(
  userId: string,
  keyId: string,
): Promise<boolean> {
  const store = getKvStore();
  const user = await getApiUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.apiKeys = user.apiKeys.filter((key) => key.id !== keyId);
  await store.set(["apiUsers", user.id], user);

  return true;
}

export async function recordApiKeyUsage(key: string): Promise<boolean> {
  const store = getKvStore();
  const users = await store.list<ApiUser>(["apiUsers"]);

  for (const user of users) {
    const apiKey = user.apiKeys.find((k) => k.key === key);
    if (apiKey) {
      apiKey.lastUsed = new Date().toISOString();
      apiKey.usageCount++;
      await store.set(["apiUsers", user.id], user);
      return true;
    }
  }

  return false;
}

// API Session interface
export interface ApiSession {
  id: string;
  userId: string;
  userEmail: string;
  createdAt: string;
  expiresAt: string;
}

// Session management for API users
export class ApiSessionManager {
  static readonly COOKIE_NAME = "api_session";
  private static readonly SESSION_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours

  static async createSession(user: ApiUser): Promise<ApiSession> {
    const sessionId = crypto.randomUUID();
    const now = new Date();
    const expires = new Date(now.getTime() + this.SESSION_EXPIRY);

    const session: ApiSession = {
      id: sessionId,
      userId: user.id,
      userEmail: user.email,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };

    const store = getKvStore();
    await store.set(["apiSessions", sessionId], session);

    return session;
  }

  static async getSession(req: Request): Promise<ApiSession | null> {
    const cookies = getCookies(req.headers);
    const sessionId = cookies[this.COOKIE_NAME];

    if (!sessionId) {
      return null;
    }

    const store = getKvStore();
    const session = await store.get<ApiSession>(["apiSessions", sessionId]);

    if (!session) {
      return null;
    }

    const now = new Date();
    const expires = new Date(session.expiresAt);
    if (now > expires) {
      await store.delete(["apiSessions", sessionId]);
      return null;
    }

    return session;
  }

  // Set session cookie in response
  static setSessionCookie(session: ApiSession, response: Response): Response {
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
      await store.delete(["apiSessions", sessionId]);
    }
  }
}

// Helper functions for password hashing
// In a real app, use a proper password hashing library like bcrypt
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
