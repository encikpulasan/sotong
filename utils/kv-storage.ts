/// <reference lib="deno.unstable" />
import { KvToolbox, openKvToolbox } from "jsr:@kitsonk/kv-toolbox";

// Types of data we store in KV
export interface UserData {
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface PayslipData {
  id: string;
  userId: string;
  data: Record<string, unknown>;
  createdAt: string;
}

// Class for interacting with Deno KV via kv-toolbox
export class KvStore {
  private kv: KvToolbox | null = null;

  constructor() {
    // Initialize the KV store
    this.initKv();
  }

  private async initKv() {
    try {
      // Use the default Deno KV database
      this.kv = await openKvToolbox();
      console.log("KV store initialized successfully");
    } catch (error) {
      console.error("Failed to initialize KV toolbox:", error);
      throw new Error(
        "Failed to initialize Deno KV. Make sure Deno KV is available in your environment.",
      );
    }
  }

  // Generic method to get data from KV
  async get<T>(key: Deno.KvKey): Promise<T | null> {
    if (!this.kv) await this.initKv();
    if (!this.kv) {
      throw new Error(
        "KV store not initialized. Deno KV is required for this application.",
      );
    }

    const entry = await this.kv.get<T>(key);
    return entry.value;
  }

  // Generic method to set data in KV
  async set(key: Deno.KvKey, value: unknown): Promise<boolean> {
    if (!this.kv) await this.initKv();
    if (!this.kv) {
      throw new Error(
        "KV store not initialized. Deno KV is required for this application.",
      );
    }

    const result = await this.kv.set(key, value);
    return result.ok;
  }

  // Generic method to delete data from KV
  async delete(key: Deno.KvKey): Promise<boolean> {
    if (!this.kv) await this.initKv();
    if (!this.kv) {
      throw new Error(
        "KV store not initialized. Deno KV is required for this application.",
      );
    }

    await this.kv.delete(key);
    return true;
  }

  // Method to list all entries with a specific prefix
  async list<T>(prefix: Deno.KvKey): Promise<T[]> {
    if (!this.kv) await this.initKv();
    if (!this.kv) {
      throw new Error(
        "KV store not initialized. Deno KV is required for this application.",
      );
    }

    const iterator = this.kv.list<T>({ prefix });
    const results: T[] = [];

    for await (const entry of iterator) {
      results.push(entry.value as T);
    }

    return results;
  }

  // Close the KV connection
  close() {
    if (this.kv) {
      this.kv.close();
      this.kv = null;
    }
  }
}

// Singleton instance
let kvStore: KvStore | null = null;

// Get the KV store instance
export function getKvStore(): KvStore {
  if (!kvStore) {
    kvStore = new KvStore();
  }
  return kvStore;
}

// Helper functions for specific data types

// User data helpers
export async function saveUser(userData: UserData): Promise<boolean> {
  const store = getKvStore();
  const key = ["users", userData.email];
  return await store.set(key, userData);
}

export async function getUserByEmail(email: string): Promise<UserData | null> {
  const store = getKvStore();
  return await store.get<UserData>(["users", email]);
}

// Payslip data helpers
export async function savePayslip(payslipData: PayslipData): Promise<boolean> {
  const store = getKvStore();
  // Save with two keys - one for the specific payslip and one for the user's payslips
  await store.set(["payslips", payslipData.id], payslipData);
  await store.set(
    ["user-payslips", payslipData.userId, payslipData.id],
    payslipData,
  );
  return true;
}

export async function getPayslipById(id: string): Promise<PayslipData | null> {
  const store = getKvStore();
  return await store.get<PayslipData>(["payslips", id]);
}

export async function getUserPayslips(userId: string): Promise<PayslipData[]> {
  const store = getKvStore();
  return await store.list<PayslipData>(["user-payslips", userId]);
}

/**
 * Get all payslips or payslips for a specific user
 * @param userId Optional user ID. If not provided, returns all payslips
 * @returns Array of payslip data
 */
export async function getPayslipsByUser(
  userId: string | null,
): Promise<PayslipData[]> {
  const store = getKvStore();

  if (userId) {
    // Get payslips for a specific user
    return await getUserPayslips(userId);
  } else {
    // Get all payslips
    return await store.list<PayslipData>(["payslips"]);
  }
}
