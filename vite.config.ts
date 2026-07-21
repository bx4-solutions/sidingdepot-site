import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
export default defineConfig(async ({ command, mode }) => {
  const plugins = [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
      serverFns: {
        disableCsrfMiddlewareWarning: true,
      },
      // Prevents server-only code (server/**, "server-only" imports) from leaking into the client bundle.
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
    } as any),
    viteReact(),
    viteCompression({ algorithm: "gzip", ext: ".gz", threshold: 1024 }),
    viteCompression({ algorithm: "brotliCompress", ext: ".br", threshold: 1024 }),
  ];

  // Nitro only needs to run for the production server build (`vite build`), not `vite dev`.
  if (command === "build") {
    const { nitro } = await import("nitro/vite");
    plugins.push(
      nitro({
        preset: "vercel",
        experimental: { tasks: true },
        scheduledTasks: {
          // Every 3 days at 06:00 UTC — the Google Places API refresh.
          "0 6 */3 * *": ["google:refresh"],
          // Once daily at 07:00 UTC — Vercel Hobby plan allows crons at most once/day.
          // (Was */15 min; upgrade to Pro to restore near-real-time /admin/leads sync.)
          "0 7 * * *": ["ghl:status-sync"],
          "30 7 * * *": ["google-ads:sync"],
          // Meta uses the same read-model pattern, after Google Ads.
          "45 7 * * *": ["meta-ads:sync"],
        },
      } as any),
    );
  }

  // Bake VITE_* env vars into import.meta.env at build time. Nitro re-bundles the
  // SSR/server output after Vite, and that pass doesn't reliably preserve Vite's own
  // client-side import.meta.env replacement — without this, server-side reads of
  // VITE_* vars (e.g. Supabase URL/key) can come back undefined in the deployed build.
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define: envDefine,
    css: { transformer: "lightningcss" },
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
    server: {
      host: "::",
      port: 8080,
      watch: {
        ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
        awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 100 },
      },
    },
    plugins,
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
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
  };
});
