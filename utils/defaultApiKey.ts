import { API_CONFIG } from "./config.ts";
import {
  ApiKey,
  ApiUser,
  createApiUser,
  generateApiKey,
  getAllUsers,
  getApiUserByEmail,
} from "./apiUsers.ts";

/**
 * Global variable to store the default API key
 * This allows the application to cache the key in memory
 */
let cachedDefaultApiKey: string | null = null;

/**
 * Initializes the admin user and default api key.
 * This should be called during application startup.
 *
 * It will:
 * 1. Check if an admin user exists
 * 2. If not, create one
 * 3. If admin exists, check if they have a "default" API key
 * 4. If no default key, generate one and store it
 * 5. If no admin, create one with a new API key
 */
export async function initializeDefaultApiKey(): Promise<string> {
  console.log("Checking if admin user exists");
  // Check if admin user exists
  let adminUser = await getApiUserByEmail(API_CONFIG.ADMIN_EMAIL);

  // If no admin user, create one
  if (!adminUser) {
    console.log("Creating admin user...");
    try {
      adminUser = await createApiUser(
        API_CONFIG.ADMIN_NAME,
        API_CONFIG.ADMIN_EMAIL,
        API_CONFIG.ADMIN_PASSWORD,
      );
      console.log("Admin user created successfully");
    } catch (error) {
      console.error("Failed to create admin user:", error);
      throw new Error(
        "Could not initialize API key system - admin user creation failed",
      );
    }
  } else {
    console.log("Admin user found");
    console.log("Admin user", adminUser);
  }

  const users = await getAllUsers();
  console.log("Users", users);

  // Check if admin has a default API key
  const defaultApiKey = adminUser.apiKeys.find((key) =>
    key.name === "default-internal"
  );

  if (defaultApiKey) {
    // Use existing default key
    cachedDefaultApiKey = defaultApiKey.key;
    console.log("Using existing default API key");
  } else {
    // Generate a new default key
    try {
      console.log("Generating new default API key...");
      const newKey = await generateApiKey(adminUser.id, "default-internal");
      cachedDefaultApiKey = newKey.key;
      console.log("Default API key generated successfully");
    } catch (error) {
      console.error("Failed to generate default API key:", error);
      throw new Error(
        "Could not initialize API key system - key generation failed",
      );
    }
  }

  return cachedDefaultApiKey;
}

/**
 * Gets the default API key for internal use.
 * If the key isn't initialized, it will initialize it.
 */
export async function getDefaultApiKey(): Promise<string> {
  if (!cachedDefaultApiKey) {
    return await initializeDefaultApiKey();
  }
  return cachedDefaultApiKey;
}

/**
 * Adds the default API key to a request as a header.
 * This is useful for internal API calls.
 */
export async function addDefaultApiKeyHeader(
  init: RequestInit = {},
): Promise<RequestInit> {
  const apiKey = await getDefaultApiKey();
  const headers = new Headers(init.headers);
  headers.set("X-API-Key", apiKey);

  return {
    ...init,
    headers,
  };
}
