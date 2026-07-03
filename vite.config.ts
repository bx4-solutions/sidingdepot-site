import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
// import viteCompression from "vite-plugin-compression";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    viteReact(),
    // viteCompression({ algorithm: "gzip", ext: ".gz", threshold: 1024 }),
    // viteCompression({ algorithm: "brotliCompress", ext: ".br", threshold: 1024 }),
  ],
  nitro: {
    preset: "vercel",
    experimental: { tasks: true },
    scheduledTasks: {
      // Every 2 days at 06:00 UTC — mirrors the vercel.json cron schedule
      "0 6 */2 * *": ["google:refresh"],
    },
  } as any,
  server: {
    host: "::",
    port: 8080,
    watch: {
      ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/.tanstack/**", "**/.vinxi/**"],
    },
  },
  resolve: {
    alias: {
      "@": `${process.cwd()}/src`,
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  css: {
    transformer: "lightningcss",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@tanstack")) {
            return "vendor-tanstack";
          }
          if (
            id.includes("node_modules/@radix-ui") ||
            id.includes("node_modules/lucide-react") ||
            id.includes("node_modules/class-variance-authority")
          ) {
            return "vendor-ui";
          }
        },
      },
    },
  },
});
