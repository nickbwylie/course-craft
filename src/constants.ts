export const SERVER =
  process.env.NODE_ENV === "production"
    ? "https://quiet-otter-72.deno.dev"
    : "http://localhost:8000";
