import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import {
  ApiSessionManager,
  ApiUser,
  generateApiKey,
  getApiUserByEmail,
  revokeApiKey,
} from "../../utils/apiUsers.ts";

interface DashboardData {
  user: ApiUser | null;
  error?: string;
  success?: string;
}

export const handler: Handlers<DashboardData> = {
  async GET(req, ctx) {
    // Check if user is logged in
    const session = await ApiSessionManager.getSession(req);
    if (!session) {
      // Not logged in, redirect to login
      const headers = new Headers();
      headers.set("Location", "/api/login");
      return new Response(null, {
        status: 302,
        headers,
      });
    }

    try {
      // Get user data
      const user = await getApiUserByEmail(session.userEmail);
      if (!user) {
        // User not found, clear session and redirect to login
        await ApiSessionManager.deleteSession(req);
        const headers = new Headers();
        headers.set("Location", "/api/login");
        return new Response(null, {
          status: 302,
          headers,
        });
      }

      // Check for error or success messages in query params
      const url = new URL(req.url);
      const error = url.searchParams.get("error");
      const success = url.searchParams.get("success");

      return ctx.render({
        user,
        error: error || undefined,
        success: success || undefined,
      });
    } catch (err) {
      const error = err as Error;
      return ctx.render({
        user: null,
        error: error.message || "Failed to load dashboard",
      });
    }
  },

  async POST(req, _ctx) {
    // Check if user is logged in
    const session = await ApiSessionManager.getSession(req);
    if (!session) {
      // Not logged in, redirect to login
      const headers = new Headers();
      headers.set("Location", "/api/login");
      return new Response(null, {
        status: 302,
        headers,
      });
    }

    try {
      // Get user data
      const user = await getApiUserByEmail(session.userEmail);
      if (!user) {
        // User not found, clear session and redirect to login
        await ApiSessionManager.deleteSession(req);
        const headers = new Headers();
        headers.set("Location", "/api/login");
        return new Response(null, {
          status: 302,
          headers,
        });
      }

      // Handle API key operations
      const url = new URL(req.url);
      const action = url.searchParams.get("action");
      const headers = new Headers();

      if (action === "generate") {
        const formData = await req.formData();
        const keyName = formData.get("keyName") as string;

        if (!keyName) {
          headers.set(
            "Location",
            "/api/dashboard?error=API+key+name+is+required",
          );
          return new Response(null, {
            status: 302,
            headers,
          });
        }

        await generateApiKey(user.id, keyName);

        // Redirect to dashboard with success message
        headers.set(
          "Location",
          "/api/dashboard?success=API+key+generated+successfully",
        );
        return new Response(null, {
          status: 302,
          headers,
        });
      } else if (action === "revoke") {
        const formData = await req.formData();
        const keyId = formData.get("keyId") as string;

        if (!keyId) {
          headers.set(
            "Location",
            "/api/dashboard?error=API+key+ID+is+required",
          );
          return new Response(null, {
            status: 302,
            headers,
          });
        }

        await revokeApiKey(user.id, keyId);

        // Redirect to dashboard with success message
        headers.set(
          "Location",
          "/api/dashboard?success=API+key+revoked+successfully",
        );
        return new Response(null, {
          status: 302,
          headers,
        });
      }

      // Default: redirect to dashboard
      headers.set("Location", "/api/dashboard");
      return new Response(null, {
        status: 302,
        headers,
      });
    } catch (err) {
      const error = err as Error;
      // Redirect to dashboard with error message
      const headers = new Headers();
      headers.set(
        "Location",
        `/api/dashboard?error=${
          encodeURIComponent(error.message || "Operation failed")
        }`,
      );
      return new Response(null, {
        status: 302,
        headers,
      });
    }
  },
};

export default function Dashboard({ data }: PageProps<DashboardData>) {
  const { user, error, success } = data;

  if (!user) {
    return (
      <>
        <Head>
          <title>API Dashboard Error</title>
        </Head>
        <div class=" bg-green-50 flex items-center justify-center py-12 px-4">
          <div class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="px-6 py-8">
              <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-800">Error</h2>
                <p class="mt-2 text-red-600">
                  {error || "Failed to load dashboard"}
                </p>
              </div>
              <div class="mt-6 text-center">
                <a
                  href="/api/login"
                  class="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Back to Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Calculate total API requests
  const totalRequests = user.apiKeys.reduce(
    (sum, key) => sum + key.usageCount,
    0,
  );

  return (
    <>
      <Head>
        <title>API Dashboard</title>
      </Head>
      <div class=" bg-green-50 py-10 px-4">
        <div class="max-w-6xl mx-auto">
          <header class="bg-white rounded-lg shadow-sm p-6 mb-8 flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">API Dashboard</h1>
              <p class="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div>
              <a
                href="/api/logout"
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
              >
                Sign Out
              </a>
            </div>
          </header>

          {error && (
            <div class="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p class="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div class="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
              <p class="text-green-700">{success}</p>
            </div>
          )}

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Usage Metrics */}
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4 text-gray-800">
                Usage Metrics
              </h2>

              <div class="mb-4">
                <a
                  href="/api/stats"
                  class="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg
                    class="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  View Detailed Stats
                </a>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="text-sm text-gray-500">Total API Keys</div>
                  <div class="text-2xl font-bold text-gray-800">
                    {user.apiKeys.length}
                  </div>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="text-sm text-gray-500">Total Requests</div>
                  <div class="text-2xl font-bold text-gray-800">
                    {totalRequests}
                  </div>
                </div>
              </div>

              {/* Usage by key chart could go here */}
              <div class="mt-6">
                <h3 class="text-lg font-semibold mb-3 text-gray-700">
                  Usage by Key
                </h3>
                <div class="space-y-3">
                  {user.apiKeys.map((key) => (
                    <div
                      key={key.id}
                      class="bg-gray-50 p-3 rounded flex justify-between"
                    >
                      <span class="font-medium">{key.name}</span>
                      <span>{key.usageCount} requests</span>
                    </div>
                  ))}

                  {user.apiKeys.length === 0 && (
                    <p class="text-gray-500 italic">
                      No API keys yet. Generate one below.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* API Key Management */}
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold mb-4 text-gray-800">
                API Key Management
              </h2>

              {/* Generate API Key Form */}
              <div class="mb-6">
                <h3 class="text-lg font-semibold mb-3 text-gray-700">
                  Generate New API Key
                </h3>
                <form
                  method="POST"
                  action="/api/dashboard?action=generate"
                  class="space-y-4"
                >
                  <div>
                    <label
                      for="keyName"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Key Name
                    </label>
                    <div class="mt-1">
                      <input
                        id="keyName"
                        name="keyName"
                        type="text"
                        required
                        placeholder="e.g. Production, Development"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    class="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    Generate API Key
                  </button>
                </form>
              </div>

              {/* API Keys List */}
              <div>
                <h3 class="text-lg font-semibold mb-3 text-gray-700">
                  Your API Keys
                </h3>
                <div class="space-y-4">
                  {user.apiKeys.map((key) => (
                    <div
                      key={key.id}
                      class="border border-gray-200 rounded-md p-4"
                    >
                      <div class="flex justify-between mb-2">
                        <span class="font-medium">{key.name}</span>
                        <span class="text-gray-500 text-sm">
                          Created:{" "}
                          {new Date(key.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div class="mb-3">
                        <code class="bg-gray-100 p-2 rounded text-sm block overflow-x-auto">
                          {key.key}
                        </code>
                      </div>
                      <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-500">
                          {key.lastUsed
                            ? `Last used: ${
                              new Date(key.lastUsed).toLocaleString()
                            }`
                            : "Never used"}
                        </span>
                        <form
                          method="POST"
                          action="/api/dashboard?action=revoke"
                        >
                          <input type="hidden" name="keyId" value={key.id} />
                          <button
                            type="submit"
                            class="text-red-600 hover:text-red-800"
                            // deno-lint-ignore fresh-server-event-handlers
                            onClick={() =>
                              confirm(
                                "Are you sure you want to revoke this API key? This action cannot be undone.",
                              )}
                          >
                            Revoke
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}

                  {user.apiKeys.length === 0 && (
                    <p class="text-gray-500 italic">
                      You haven't generated any API keys yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* API Documentation */}
          <div class="bg-white rounded-lg shadow-sm p-6 mt-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">
              API Documentation
            </h2>
            <div class="prose max-w-none">
              <p>
                To use our Payslip Generator API, include your API key in the
                request headers:
              </p>
              <pre class="bg-gray-100 p-3 rounded">X-API-Key: your_api_key_here</pre>

              <h3>Endpoints</h3>
              <ul>
                <li>
                  <strong>POST /api/v1/calculate</strong>{" "}
                  - Calculate payslip deductions
                </li>
                <li>
                  <strong>POST /api/v1/preview-payslip</strong>{" "}
                  - Generate a preview of the payslip
                </li>
                <li>
                  <strong>GET /api/v1/download-payslip</strong>{" "}
                  - Download a generated payslip
                </li>
              </ul>

              <p>
                <a
                  href="/api/docs"
                  class="text-green-600 hover:text-green-800 font-medium"
                >
                  View Full API Documentation →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
