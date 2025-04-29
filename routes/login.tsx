import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Header } from "../components/Header.tsx";
import { getUserByEmail } from "../utils/kv-storage.ts";
import { SessionManager } from "../utils/session.ts";

interface LoginData {
  error?: string;
  success?: string;
  email?: string;
}

export const handler: Handlers<LoginData> = {
  async GET(req, ctx) {
    // Check query params for messages
    const url = new URL(req.url);
    const error = url.searchParams.get("error");
    const success = url.searchParams.get("success");

    return ctx.render({
      error: error || undefined,
      success: success || undefined,
    });
  },

  async POST(req, ctx) {
    const formData = await req.formData();
    const email = formData.get("email") as string;

    if (!email) {
      return ctx.render({
        error: "Email is required",
      });
    }

    try {
      // Check if user exists
      const user = await getUserByEmail(email);

      if (!user) {
        return ctx.render({
          error:
            "No payslips found for this email. Please generate a payslip first.",
          email,
        });
      }

      // Create a session for the user
      let session = await SessionManager.createSession(email);
      console.log("Session created for user", email);
      let response = await SessionManager.setSessionCookie(
        session,
        new Response(),
      );
      console.log("Session cookie set for user", email);
      console.log("Response", response);

      // Redirect to payslip history with the email parameter
      const headers = new Headers(response.headers);
      headers.set(
        "Location",
        `/payslip/history?email=${encodeURIComponent(email)}`,
      );
      console.log("Redirecting to payslip history");
      return new Response(null, {
        status: 302,
        headers,
      });
    } catch (err) {
      const error = err as Error;
      return ctx.render({
        error: error.message || "Login failed",
        email,
      });
    }
  },
};

export default function Login({ data }: PageProps<LoginData>) {
  const { error, success, email } = data;

  return (
    <>
      <Head>
        <title>Login - Payslip Generator</title>
      </Head>
      <Header />
      <div class=" bg-green-50 flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-8">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-800">
                Login
              </h2>
              <p class="mt-2 text-gray-600">View your saved payslips</p>
            </div>

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

            <form method="POST" class="space-y-6">
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div class="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
                >
                  View My Payslips
                </button>
              </div>
            </form>

            <div class="mt-8 text-center">
              <p class="text-sm text-gray-600">
                Don't have any payslips yet?{" "}
                <a
                  href="/payslip"
                  class="text-green-600 hover:text-green-700 font-medium"
                >
                  Generate a Payslip
                </a>
              </p>
            </div>

            <div class="mt-4 text-center">
              <p class="text-sm text-gray-600">
                Looking for API access?{" "}
                <a
                  href="/api/login"
                  class="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  API Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
