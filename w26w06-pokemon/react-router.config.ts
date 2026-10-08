import type { Config } from "@react-router/dev/config";

export default {
  // Client-side SPA for GitHub Pages static hosting
  ssr: false,
  basename: process.env.NODE_ENV === "production" ? "/WebServerProgramming/w26w06-pokemon/build/client/" : "/",
} satisfies Config;
