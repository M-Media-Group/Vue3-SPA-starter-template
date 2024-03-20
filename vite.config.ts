import { URL, fileURLToPath } from "node:url";

import { type UserConfig, defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import basicSsl from "@vitejs/plugin-basic-ssl";
import type { ViteSSGOptions } from "vite-ssg";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), basicSsl()],
  server: {
    host: true, // needed for the Docker Container port mapping to work
    proxy: {},
  },
  ssgOptions: {
    mock: true,

    dirStyle: "nested",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
} as UserConfig & ViteSSGOptions);
