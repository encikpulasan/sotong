// Configuration utility with environment variable support and defaults

// API configuration
export const API_CONFIG = {
  // Admin account
  ADMIN_EMAIL: `${Deno.env.get("ADMIN_EMAIL")}`,
  ADMIN_NAME: `${Deno.env.get("ADMIN_NAME")}`,
  ADMIN_PASSWORD: `${Deno.env.get("ADMIN_PASSWORD")}`,

  // Feature flags
  ENABLE_ANALYTICS: Deno.env.get("ENABLE_ANALYTICS") === "true",
};

// Get the base URL for the application
export function getBaseUrl(): string {
  return `${Deno.env.get("BASE_URL")}`;
}

// Convenience function to check if running in production
export function isProduction(): boolean {
  return Deno.env.get("ENV") === "production";
}
