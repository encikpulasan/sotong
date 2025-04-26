import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pay Slip Generator</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="bg-gray-50 min-h-screen">
        <header class="bg-white shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
              <div class="flex items-center">
                <a href="/" class="text-green-600 font-bold text-xl">
                  Pay Slip Generator
                </a>
              </div>
              <nav>
                <ul class="flex space-x-4">
                  <li>
                    <a
                      href="/payslip"
                      class="text-gray-600 hover:text-green-600 transition duration-150"
                    >
                      Create Pay Slip
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <main class="py-6">
          <Component />
        </main>

        <footer class="bg-white border-t border-gray-200 mt-12">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="py-6 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()}{" "}
              Pay Slip Generator. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
