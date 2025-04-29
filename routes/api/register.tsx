import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { ApiHeader } from "../../components/ApiHeader.tsx";
import { createApiUser } from "../../utils/apiUsers.ts";

interface RegisterData {
  success?: boolean;
  error?: string;
  name?: string;
  email?: string;
}

export const handler: Handlers<RegisterData> = {
  async GET(_, ctx) {
    return ctx.render({});
  },

  async POST(req, ctx) {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Basic validation
    if (!name || !email || !password) {
      return ctx.render({
        error: "All fields are required",
        name,
        email,
      });
    }

    if (password.length < 8) {
      return ctx.render({
        error: "Password must be at least 8 characters",
        name,
        email,
      });
    }

    if (password !== confirmPassword) {
      return ctx.render({
        error: "Passwords do not match",
        name,
        email,
      });
    }

    try {
      await createApiUser(name, email, password);
      return ctx.render({ success: true });
    } catch (err) {
      const error = err as Error;
      return ctx.render({
        error: error.message || "Registration failed",
        name,
        email,
      });
    }
  },
};

export default function Register({ data }: PageProps<RegisterData>) {
  const { success, error, name, email } = data;

  if (success) {
    return (
      <>
        <Head>
          <title>API Registration Success</title>
        </Head>
        <ApiHeader />
        <div class=" bg-green-50 flex items-center justify-center py-12 px-4">
          <div class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="px-6 py-8">
              <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-800">
                  Registration Successful
                </h2>
                <p class="mt-2 text-green-600">
                  Your API account has been created!
                </p>
              </div>
              <div class="mt-6 text-center">
                <a
                  href="/api/login"
                  class="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Login to your account
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>API Developer Registration</title>
      </Head>
      <ApiHeader />
      <div class=" bg-green-50 flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-8">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-800">
                API Developer Registration
              </h2>
              <p class="mt-2 text-gray-600">
                Create an account to access our API
              </p>
            </div>

            {error && (
              <div class="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
                <p class="text-red-700">{error}</p>
              </div>
            )}

            <form method="POST" class="space-y-6">
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div class="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

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
                <label
                  for="confirmPassword"
                  class="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div class="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
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
                  Register
                </button>
              </div>
            </form>

            <div class="mt-8 text-center">
              <p class="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/api/login"
                  class="text-green-600 hover:text-green-700 font-medium"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
