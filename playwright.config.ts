import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "artifacts/playwright-results",
  fullyParallel: true,
  use: {
    baseURL: "http://127.0.0.1:54173",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev -- --port 54173",
    url: "http://127.0.0.1:54173",
    reuseExistingServer: false,
  },
});
