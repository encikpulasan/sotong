import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Pay Slip Generator</title>
        <meta
          name="description"
          content="Generate professional pay slips easily"
        />
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <div class="flex flex-col items-center justify-center min-h-screen">
          <h1 class="text-4xl font-bold mb-6 text-center">
            Pay Slip Generator
          </h1>
          <p class="mb-8 text-center text-gray-600">
            Create professional pay slips for your employees with just a few
            clicks
          </p>
          <a
            href="/payslip"
            class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-300"
          >
            Create Pay Slip
          </a>
        </div>
      </div>
    </>
  );
}
