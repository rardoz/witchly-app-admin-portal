// Environment variables configuration with type safety

// Server-side environment variables
export const serverEnv = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:3000/api",
} as const;

// Client-side environment variables
export const clientEnv = {
  PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Witchly Admin Portal",
  PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0",
} as const;

// Validation function (optional)
export function validateEnv() {
  const required = ["DATABASE_URL", "NEXT_PUBLIC_APP_NAME"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

// Export type for use in other files
export type ServerEnv = typeof serverEnv;
export type ClientEnv = typeof clientEnv;
