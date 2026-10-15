import type { Config } from "@react-router/dev/config";

const isVercel = process.env.VERCEL === "1";
const isProduction = process.env.NODE_ENV === "production";

export default {
  // Client-side SPA for static hosting (GitHub Pages & Vercel)
  ssr: false,
  basename: isVercel ? "/" : (isProduction ? "/WebServerProgramming/w26w06-pokemon/build/client/" : "/"),
} satisfies Config;
