import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { ApiHeader, getApiHeaderProps } from "../../components/ApiHeader.tsx";

interface ApiHomeProps {
  isLoggedIn: boolean;
  username: string;
}

export const handler: Handlers<ApiHomeProps> = {
  async GET(req, ctx) {
    const headerProps = await getApiHeaderProps(req);
    return ctx.render({
      isLoggedIn: headerProps.isLoggedIn ?? false,
      username: headerProps.username ?? "",
    });
  },
};

export default function ApiHome({ data }: PageProps<ApiHomeProps>) {
  const { isLoggedIn, username } = data;

  return (
    <>
      <Head>
        <title>Payslip Generator API</title>
      </Head>
      <div class="bg-green-50">
        <ApiHeader isLoggedIn={isLoggedIn} username={username} />

        <main class="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Payslip Generator API
            </h1>
            <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Generate payslips programmatically through our RESTful API
            </p>
          </div>

          <div class="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="text-center">
                  <div class="flex justify-center">
                    <div class="rounded-md bg-indigo-100 p-3">
                      <svg
                        class="h-6 w-6 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 class="mt-4 text-lg font-medium text-gray-900">Login</h3>
                  <p class="mt-2 text-sm text-gray-500">
                    Access your API dashboard to manage keys and view usage
                    metrics
                  </p>
                  <div class="mt-4">
                    <a
                      href="/api/login"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Sign in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="text-center">
                  <div class="flex justify-center">
                    <div class="rounded-md bg-green-100 p-3">
                      <svg
                        class="h-6 w-6 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 class="mt-4 text-lg font-medium text-gray-900">
                    Register
                  </h3>
                  <p class="mt-2 text-sm text-gray-500">
                    Create a new account to get started with our API
                  </p>
                  <div class="mt-4">
                    <a
                      href="/api/register"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Sign up
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <div class="text-center">
                  <div class="flex justify-center">
                    <div class="rounded-md bg-yellow-100 p-3">
                      <svg
                        class="h-6 w-6 text-yellow-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 class="mt-4 text-lg font-medium text-gray-900">
                    Documentation
                  </h3>
                  <p class="mt-2 text-sm text-gray-500">
                    View API documentation and learn how to integrate
                  </p>
                  <div class="mt-4">
                    <a
                      href="/api/docs"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      View Docs
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Features Overview
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Everything you need to generate payslips programmatically
              </p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl class="sm:divide-y sm:divide-gray-200">
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    REST API
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    Simple HTTP REST API with JSON responses for easy
                    integration
                  </dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    API Keys
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    Secure your API usage with keys and monitor usage metrics
                  </dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Payslip Generation
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    Generate professional payslips in PDF or HTML format
                  </dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Deduction Calculations
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    Automatic calculation of statutory deductions based on
                    Malaysian standards
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
