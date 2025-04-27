import { type PageProps } from "$fresh/server.ts";
import { Header } from "../components/Header.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pay Slip Generator</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class=" bg-green-50 flex flex-col min-h-screen">
        <Header />
        <div class="flex-1">
          <Component />
        </div>

        <footer class="bg-white border-t border-gray-200">
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
