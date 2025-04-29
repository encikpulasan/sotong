import { BaseHeader } from "./BaseHeader.tsx";
import { ApiSessionManager } from "../utils/apiUsers.ts";

interface ApiHeaderProps {
  isLoggedIn?: boolean;
  username?: string;
}

export function ApiHeader(
  { isLoggedIn = false, username = "" }: ApiHeaderProps,
) {
  return (
    <BaseHeader title="Payslip API" logoHref="/api">
      {isLoggedIn
        ? (
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">
              Welcome, <span class="font-medium">{username}</span>
            </span>
            <a
              href="/api/dashboard"
              class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Dashboard
            </a>
            <a
              href="/api/logout"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign out
            </a>
          </div>
        )
        : (
          <a
            href="/api/login"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
        )}
    </BaseHeader>
  );
}

export async function getApiHeaderProps(req: Request): Promise<ApiHeaderProps> {
  try {
    const session = await ApiSessionManager.getSession(req);
    if (session) {
      return {
        isLoggedIn: true,
        username: session.userEmail.split("@")[0], // Use the first part of the email as username
      };
    }
  } catch (error) {
    console.error("Error checking API session:", error);
  }

  return {
    isLoggedIn: false,
    username: "",
  };
}
