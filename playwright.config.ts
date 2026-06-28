import { defineConfig } from "@playwright/test";

const LOCAL_APP_URL = "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: LOCAL_APP_URL,
    channel: "chrome",
    colorScheme: "light",
    contextOptions: {
      reducedMotion: "reduce",
    },
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
    reuseExistingServer: true,
    url: LOCAL_APP_URL,
  },
});
