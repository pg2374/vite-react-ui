/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from "cypress";
export default defineConfig({
  e2e: {
    baseUrl: "https://develop.dofuwl7rbpbt1.amplifyapp.com",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: false,
    specPattern: "cypress/e2e/**/*.cy.ts",
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports",
      overwrite: false,
      html: true,
      json: true,
    },
  },
});
