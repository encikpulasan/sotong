import { Head } from "$fresh/runtime.ts";
import { Header } from "../../components/Header.tsx";
import PayslipForm from "../../islands/PayslipForm.tsx";

export default function PayslipPage() {
  return (
    <>
      <Head>
        <title>Create Pay Slip | Pay Slip Generator</title>
        <meta name="description" content="Create a professional pay slip" />
      </Head>
      <div class="bg-green-50 min-h-screen">
        <Header />
        <div class="p-4 mx-auto max-w-4xl">
          <h1 class="text-3xl font-bold mb-6 text-center">Create Pay Slip</h1>
          <PayslipForm />
        </div>
      </div>
    </>
  );
}
