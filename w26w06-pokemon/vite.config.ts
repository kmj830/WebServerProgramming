import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const isVercel = process.env.VERCEL === "1";
const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  base: isVercel ? "/" : (isProduction ? "/WebServerProgramming/w26w06-pokemon/build/client/" : "/"),
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
