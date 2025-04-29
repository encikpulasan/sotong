import { JSX } from "preact";

export interface BaseHeaderProps {
  title?: string;
  logoHref?: string;
  children?: JSX.Element | JSX.Element[] | null;
}

export function BaseHeader({
  title = "Payslip Generator",
  logoHref = "/",
  children,
}: BaseHeaderProps) {
  return (
    <header class="bg-white shadow-sm">
      <div class="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <a href={logoHref}>
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
              {title}
            </span>
          </div>
        </a>
        <div>
          {children}
        </div>
      </div>
    </header>
  );
}
