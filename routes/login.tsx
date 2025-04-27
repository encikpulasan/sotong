import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getUserByEmail } from "../utils/kv-storage.ts";
import { SessionManager } from "../utils/session.ts";

interface LoginData {
  error?: string;
  success?: boolean;
  email?: string;
}

export const handler: Handlers<LoginData> = {
  async GET(req, ctx) {
    // Check if user is already logged in
    const session = await SessionManager.getSession(req);
    if (session) {
      // User is already logged in, redirect to payslip history
      const headers = new Headers();
      headers.set(
        "Location",
        `/payslip/history`,
      );
      return new Response(null, {
        status: 302,
        headers,
      });
    }

    return ctx.render({});
  },

  async POST(req, ctx) {
    const formData = await req.formData();
    const email = formData.get("email") as string;

    if (!email || !email.includes("@")) {
      return ctx.render({ error: "Please enter a valid email address" });
    }

    try {
      // Check if the user exists in the KV store
      const userData = await getUserByEmail(email);

      if (userData) {
        // User exists, create a session
        const session = await SessionManager.createSession(email);

        // Redirect to payslip history
        const headers = new Headers();
        headers.set("Location", "/payslip/history");

        // Create response with redirect
        const response = new Response(null, {
          status: 302,
          headers,
        });

        // Set session cookie and return
        return SessionManager.setSessionCookie(session, response);
      } else {
        // No user found with this email, but we'll allow them to continue
        // This is just a simple login without registration
        return ctx.render({
          success: true,
          email,
          error: "No payslips found for this email. Please generate one first.",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      return ctx.render({
        error:
          "An error occurred while checking your account. Please try again.",
      });
    }
  },
};

export default function Login({ data }: PageProps<LoginData>) {
  const { error, success, email } = data;

  return (
    <>
      <Head>
        <title>Login | Malaysian Payslip Generator</title>
      </Head>
      <div class=" flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-8">
            <div class="text-center mb-8">
              <a href="/" class="inline-block">
                <svg
                  class="h-12 w-12 text-green-600 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z" />
                  <path
                    fill-rule="evenodd"
                    d="M2 14a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4zm14 0H4v4h12v-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <h2 class="mt-4 text-3xl font-bold text-gray-800">
                Sign in to your account
              </h2>
              <p class="mt-2 text-gray-600">
                Access your payslips and history
              </p>
            </div>

            {error && (
              <div class="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
                <p class="text-red-700">{error}</p>
              </div>
            )}

            {success && email && (
              <div class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
                <p class="text-yellow-700">
                  No payslips found for this email. Please generate one first.
                </p>
                <div class="mt-4">
                  <a
                    href="/payslip"
                    class="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Create Payslip
                  </a>
                </div>
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
                    autoComplete="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition duration-300"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div class="mt-8 text-center">
              <p class="text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/payslip"
                  class="text-green-600 hover:text-green-700 font-medium"
                >
                  Generate a payslip
                </a>{" "}
                to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
