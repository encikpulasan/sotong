import { BaseHeader } from "./BaseHeader.tsx";

interface HeaderProps {
  showLoginButton?: boolean;
}

export function Header({ showLoginButton = false }: HeaderProps) {
  return (
    <BaseHeader>
      {showLoginButton
        ? (
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
        )
        : null}
    </BaseHeader>
  );
}
