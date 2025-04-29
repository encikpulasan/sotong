/// <reference lib="deno.unstable" />
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getUserPayslips, PayslipData } from "../../utils/kv-storage.ts";
import { SessionManager } from "../../utils/session.ts";

interface PageData {
  userEmail: string | null;
  payslips: PayslipData[];
  error?: string;
}

export const handler: Handlers<PageData> = {
  async GET(req, ctx) {
    // Check if user is logged in via session
    const session = await SessionManager.getSession(req);

    if (!session) {
      // No session, redirect to login
      console.log("No session, redirecting to login");
      const headers = new Headers();
      headers.set("Location", "/login");
      return new Response(null, {
        status: 302,
        headers,
      });
    }

    const userEmail = session.userEmail;

    try {
      const payslips = await getUserPayslips(userEmail);
      return ctx.render({ userEmail, payslips });
    } catch (error) {
      console.error("Error fetching payslips:", error);
      return ctx.render({
        userEmail,
        payslips: [],
        error: "Failed to fetch payslips. Please try again later.",
      });
    }
  },
};

export default function PayslipHistory({ data }: PageProps<PageData>) {
  const { userEmail, payslips, error } = data;

  // Sort payslips by date (newest first)
  const sortedPayslips = [...payslips].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <>
      <Head>
        <title>Payslip History | Malaysian Payslip Generator</title>
      </Head>
      <div class="container mx-auto px-4 py-10">
        <h1 class="text-3xl font-bold mb-6 text-green-700">Payslip History</h1>

        {error && (
          <div class="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
            <p class="text-red-700">{error}</p>
          </div>
        )}

        {userEmail && (
          <div class="mb-6 flex justify-between items-center">
            <p class="text-lg">
              Viewing payslips for <span class="font-medium">{userEmail}</span>
            </p>
            <a
              href="/logout"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Sign Out
            </a>
          </div>
        )}

        {userEmail && sortedPayslips.length === 0 && !error && (
          <div class="bg-gray-100 p-6 rounded-lg text-center">
            <p class="text-gray-700">
              No payslips found for this email address.
            </p>
            <a
              href="/"
              class="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Generate a New Payslip
            </a>
          </div>
        )}

        {sortedPayslips.length > 0 && (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPayslips.map((payslip) => {
              const payslipData = payslip.data as Record<string, unknown>;
              return (
                <div
                  key={payslip.id}
                  class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div class="border-b bg-gray-50 px-4 py-3">
                    <h3 class="font-semibold">
                      {payslipData.month} {payslipData.year}
                    </h3>
                    <p class="text-sm text-gray-600">
                      Created:{" "}
                      {new Date(payslip.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div class="p-4">
                    <p class="mb-2">
                      <span class="font-medium">Employee:</span>{" "}
                      {payslipData.employeeName}
                    </p>
                    <p class="mb-2">
                      <span class="font-medium">Company:</span>{" "}
                      {payslipData.companyName}
                    </p>
                    <p class="mb-2">
                      <span class="font-medium">Net Income:</span> RM{" "}
                      {typeof payslipData.basicSalary === "number" &&
                          typeof payslipData.bonus === "number" &&
                          typeof payslipData.pcbDeduction === "number" &&
                          typeof payslipData.epfEmployeeDeduction ===
                            "number" &&
                          typeof payslipData.socsoEmployee === "number" &&
                          typeof payslipData.eisEmployee === "number"
                        ? (
                          payslipData.basicSalary +
                          payslipData.bonus -
                          payslipData.pcbDeduction -
                          payslipData.epfEmployeeDeduction -
                          payslipData.socsoEmployee -
                          payslipData.eisEmployee
                        ).toFixed(2)
                        : "N/A"}
                    </p>
                    <div class="mt-4">
                      <a
                        href={`/api/v1/download-payslip?id=${payslip.id}`}
                        target="_blank"
                        class="inline-block px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                      >
                        Download Payslip
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
