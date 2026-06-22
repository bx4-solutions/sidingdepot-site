// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import viteCompression from "vite-plugin-compression";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
    experimental: { tasks: true },
    scheduledTasks: {
      // Every 2 days at 06:00 UTC — mirrors the vercel.json cron schedule
      "0 6 */2 * *": ["google:refresh"],
    },
  } as any,
  vite: {
    server: {
      watch: {
        ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
      },
    },
    plugins: [
      viteCompression({ algorithm: "gzip", ext: ".gz", threshold: 1024 }),
      viteCompression({ algorithm: "brotliCompress", ext: ".br", threshold: 1024 }),
    ],
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
  },
});
