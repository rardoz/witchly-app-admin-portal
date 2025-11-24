import "@testing-library/jest-dom";

// Mock next/font/google since it's not available in test environment
jest.mock("next/font/google", () => ({
  Geist: () => ({
    variable: "--font-geist-sans",
  }),
  Geist_Mono: () => ({
    variable: "--font-geist-mono",
  }),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  redirect: jest.fn(),
}));

// Mock next-auth
jest.mock("@/lib/auth/auth", () => ({
  auth: jest.fn(),
}));
