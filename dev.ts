#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";

import "$std/dotenv/load.ts";

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

await dev(import.meta.url, "./main.ts", config);
