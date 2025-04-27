import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <div class="bg-green-50">
        <div class="py-8">
          <div class="max-w-5xl mx-auto px-4">
            <div class="text-center mb-12">
              <h1 class="text-4xl font-bold text-gray-800 mb-4">
                Malaysian Payslip Generator
              </h1>
              <p class="text-xl text-gray-600">
                Generate professional payslips based on Malaysian EPF, SOCSO,
                and EIS standards
              </p>
            </div>

            <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div class="p-6">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">
                  Get Started
                </h2>
                <p class="text-gray-600 mb-6">
                  Create professional payslips for your employees with our
                  easy-to-use form. Fill in the necessary details, preview your
                  payslip, and download it as a PDF.
                </p>
                <div class="flex justify-center space-x-4">
                  <a
                    href="/payslip"
                    class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
                  >
                    Create Payslip
                  </a>
                  <a
                    href="/payslip/history"
                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300"
                  >
                    View Past Payslips
                  </a>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-6">
                  <h2 class="text-2xl font-semibold text-gray-800 mb-4">
                    Features
                  </h2>
                  <ul class="space-y-2 text-gray-600">
                    <li class="flex items-start">
                      <svg
                        class="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span>
                        Automatic calculation of EPF, SOCSO, and EIS
                        contributions
                      </span>
                    </li>
                    <li class="flex items-start">
                      <svg
                        class="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span>Configurable EPF rates (0%, 5.5%, 9%, 11%)</span>
                    </li>
                    <li class="flex items-start">
                      <svg
                        class="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span>SOCSO and EIS with salary capping at RM4,000</span>
                    </li>
                    <li class="flex items-start">
                      <svg
                        class="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span>Professional PDF generation</span>
                    </li>
                    <li class="flex items-start">
                      <svg
                        class="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span>Easy-to-use step-by-step form</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-6">
                  <h2 class="text-2xl font-semibold text-gray-800 mb-4">
                    API Access
                  </h2>
                  <p class="text-gray-600 mb-6">
                    Need to integrate payslip generation into your own system?
                    We offer a RESTful API that provides the same calculation,
                    preview, and PDF generation capabilities.
                  </p>
                  <div class="flex">
                    <a
                      href="/api/docs"
                      class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300"
                    >
                      View API Documentation
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
