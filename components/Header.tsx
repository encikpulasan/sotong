export function Header() {
  return (
    <>
      {/* Navigation Bar */}
      <header class="bg-white shadow-sm">
        <div class="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <a href="/">
            <div class="flex items-center">
              <svg
                class="h-8 w-8 text-green-600"
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
              <span class="ml-2 text-xl font-semibold text-gray-800">
                Payslip Generator
              </span>
            </div>
          </a>
          <div>
            <a
              href="/login"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg
                class="-ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
              Login
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
