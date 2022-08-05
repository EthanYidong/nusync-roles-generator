import path from "path";

import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin({ typescript: { onlyRemoveTypeImports: true } })],
  server: {
    port: 3002,
  },
  build: {
    target: "esnext",
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
});
