/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";
import { initializeDefaultApiKey } from "./utils/defaultApiKey.ts";

// Initialize the default API key before starting the server
console.log("Initializing default API key...");
try {
  const apiKey = await initializeDefaultApiKey();
  console.log(
    "Default API key initialized successfully:",
    apiKey.substring(0, 8) + "...",
  );
} catch (error) {
  console.error("Failed to initialize default API key:", error);
  // Continue starting the server even if API key initialization fails
}

await start(manifest, config);
