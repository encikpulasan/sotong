import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { ApiHeader, getApiHeaderProps } from "../../components/ApiHeader.tsx";
import { getApiUserByEmail, getApiUserById } from "../../utils/apiUsers.ts";
import { API_CONFIG } from "../../utils/config.ts";
import { getPayslipsByUser } from "../../utils/kv-storage.ts";

interface ApiStatsData {
  totalApiKeys: number;
  totalApiRequests: number;
  totalPayslips: number;
  keyUsage: Array<{
    name: string;
    key: string;
    usageCount: number;
    lastUsed?: string;
  }>;
  isLoggedIn: boolean;
  username: string;
  error?: string;
}

export const handler: Handlers<ApiStatsData> = {
  async GET(req, ctx) {
    const headerProps = await getApiHeaderProps(req);

    // Check if user is authenticated - only admin can view stats
    if (!headerProps.isLoggedIn) {
      return ctx.render({
        totalApiKeys: 0,
        totalApiRequests: 0,
        totalPayslips: 0,
        keyUsage: [],
        isLoggedIn: false,
        username: "",
        error: "You must be logged in to view stats",
      });
    }

    try {
      // Get the admin user data
      const adminUser = await getApiUserByEmail(API_CONFIG.ADMIN_EMAIL);

      if (!adminUser) {
        return ctx.render({
          totalApiKeys: 0,
          totalApiRequests: 0,
          totalPayslips: 0,
          keyUsage: [],
          isLoggedIn: headerProps.isLoggedIn,
          username: headerProps.username || "",
          error: "Admin user not found",
        });
      }

      // Get all payslips to count them
      const payslips = await getPayslipsByUser(null); // null gets all payslips

      // Calculate API usage metrics
      const totalApiKeys = adminUser.apiKeys.length;
      const totalApiRequests = adminUser.apiKeys.reduce(
        (sum, key) => sum + key.usageCount,
        0,
      );

      // Format key usage data
      const keyUsage = adminUser.apiKeys.map((key) => ({
        name: key.name,
        key: key.key.substring(0, 8) + "..." +
          key.key.substring(key.key.length - 4),
        usageCount: key.usageCount,
        lastUsed: key.lastUsed,
      }));

      return ctx.render({
        totalApiKeys,
        totalApiRequests,
        totalPayslips: payslips.length,
        keyUsage,
        isLoggedIn: headerProps.isLoggedIn,
        username: headerProps.username || "",
      });
    } catch (error) {
      console.error("Error fetching API stats:", error);

      return ctx.render({
        totalApiKeys: 0,
        totalApiRequests: 0,
        totalPayslips: 0,
        keyUsage: [],
        isLoggedIn: headerProps.isLoggedIn,
        username: headerProps.username || "",
        error: error instanceof Error
          ? error.message
          : "Failed to fetch API stats",
      });
    }
  },
};

export default function ApiStats({ data }: PageProps<ApiStatsData>) {
  const {
    totalApiKeys,
    totalApiRequests,
    totalPayslips,
    keyUsage,
    isLoggedIn,
    username,
    error,
  } = data;

  return (
    <>
      <Head>
        <title>API Usage Statistics</title>
        <meta
          name="description"
          content="Usage statistics for the Payslip Generator API"
        />
      </Head>

      <div className="min-h-screen bg-green-50">
        <ApiHeader isLoggedIn={isLoggedIn} username={username} />

        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            API Usage Statistics
          </h1>

          {error
            ? (
              <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-red-700">{error}</p>

                {!isLoggedIn && (
                  <div className="mt-4">
                    <a
                      href="/api/login"
                      className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Login to View Stats
                    </a>
                  </div>
                )}
              </div>
            )
            : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white shadow overflow-hidden rounded-lg">
                    <div className="p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-2">
                        Total API Keys
                      </h2>
                      <p className="text-3xl font-bold text-indigo-600">
                        {totalApiKeys}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white shadow overflow-hidden rounded-lg">
                    <div className="p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-2">
                        Total API Requests
                      </h2>
                      <p className="text-3xl font-bold text-indigo-600">
                        {totalApiRequests}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white shadow overflow-hidden rounded-lg">
                    <div className="p-6">
                      <h2 className="text-lg font-medium text-gray-900 mb-2">
                        Total Payslips Generated
                      </h2>
                      <p className="text-3xl font-bold text-indigo-600">
                        {totalPayslips}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow overflow-hidden rounded-lg">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      API Key Usage
                    </h2>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {keyUsage.length > 0
                      ? (
                        keyUsage.map((key, index) => (
                          <div key={index} className="px-6 py-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {key.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {key.key}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-indigo-600">
                                  {key.usageCount} requests
                                </p>
                                <p className="text-sm text-gray-500">
                                  {key.lastUsed
                                    ? `Last used: ${
                                      new Date(key.lastUsed).toLocaleString()
                                    }`
                                    : "Never used"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )
                      : (
                        <div className="px-6 py-4 text-gray-500 italic">
                          No API keys found
                        </div>
                      )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <a
                    href="/api/dashboard"
                    className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Back to Dashboard
                  </a>
                </div>
              </>
            )}
        </div>
      </div>
    </>
  );
}
