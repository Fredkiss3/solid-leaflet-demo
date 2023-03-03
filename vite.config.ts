import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import solidDevtools from "solid-devtools/vite";

export default defineConfig({
  plugins: [
    solidPlugin(),
    solidDevtools({
      /* additional options */
      autoname: true, // e.g. enable autoname
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
