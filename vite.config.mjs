import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true,
  },
});
// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";
// import jsconfigPaths from "vite-jsconfig-paths";

// import path from "path";
// const resolvePath = (str) => path.resolve(__dirname, str);

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), "");
//   const API_URL = env.VITE_APP_BASE_NAME || '/';
//   const PORT = 3000;

//   return {
//     server: {
//       open: true,
//       port: PORT,
//       host: true,
//     },
//     preview: {
//       open: true,
//       host: true,
//     },
//     define: {
//       global: "window",
//     },
//     resolve: {
//       alias: [],
//     },
//     css: {
//       preprocessorOptions: {
//         scss: {
//           charset: false,
//           verbose: true,
//           quietDeps: true,
//           silenceDeprecations: ['import'],
//         },
//         less: {
//           charset: false,
//         },
//       },
//       charset: false,
//     },
//     build: {
//       chunkSizeWarningLimit: 1600,
//       sourcemap: true,
//       cssCodeSplit: true,
//       rollupOptions: {
//         input: {
//           main: resolvePath("index.html"),
//         },
//       },
//     },
//     base: API_URL,
//     plugins: [react(), jsconfigPaths()],
//     // ✅ ESBuild config - JSX support
//     esbuild: {
//       loader: "jsx",
//       include: /src\/.*\.(js|jsx|ts|tsx)$/,
//       exclude: [],
//     },
//     optimizeDeps: {
//       esbuildOptions: {
//         loader: {
//           ".js": "jsx",
//           ".jsx": "jsx",
//         },
//       },
//     },
//   };
// });