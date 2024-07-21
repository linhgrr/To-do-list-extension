import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    permissions: [
    "activeTab",
    "background",
    "cookies",
    "storage",
    "tabs",
    "http://*/*",
    "https://*/*",
    "chrome-extension://*",
    "http://localhost:8080/*"
    ],
    host_permissions: [
    "http://*/*",
    "https://*/*"],
  },
});
