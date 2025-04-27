import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { ApiSessionManager, verifyApiUser } from "../../utils/apiUsers.ts";

interface LoginData {
  error?: string;
  email?: string;
}

export const handler: Handlers<LoginData> = {
  async GET(req, ctx) {
    // Check if user is already logged in
    const session = await ApiSessionManager.getSession(req);
    if (session) {
      // User is already logged in, redirect to dashboard
      const headers = new Headers();
      headers.set("Location", "/api/dashboard");
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
    const password = formData.get("password") as string;

    if (!email || !password) {
      return ctx.render({
        error: "Email and password are required",
        email,
      });
    }

    try {
      // Verify user credentials
      const user = await verifyApiUser(email, password);

      if (!user) {
        return ctx.render({
          error: "Invalid email or password",
          email,
        });
      }

      // Create session
      const session = await ApiSessionManager.createSession(user);

      // Redirect to dashboard
      const headers = new Headers();
      headers.set("Location", "/api/dashboard");

      // Create response with redirect
      const response = new Response(null, {
        status: 302,
        headers,
      });

      // Set session cookie and return
      return ApiSessionManager.setSessionCookie(session, response);
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
  const { error, email } = data;

  return (
    <>
      <Head>
        <title>API Developer Login</title>
      </Head>
      <div class="min-h-screen bg-green-50 flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-8">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-800">
                API Developer Login
              </h2>
              <p class="mt-2 text-gray-600">Access your API dashboard</p>
            </div>

            {error && (
              <div class="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
                <p class="text-red-700">{error}</p>
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
                  />
                </div>
              </div>

              <div>
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div class="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div class="mt-8 text-center">
              <p class="text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/api/register"
                  class="text-green-600 hover:text-green-700 font-medium"
                >
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
