import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'soessr',
  e2e: {
    baseUrl: "http://localhost:4200",
    viewportHeight: 1080,
    viewportWidth: 1920,
    scrollBehavior: "center",
  },
});
