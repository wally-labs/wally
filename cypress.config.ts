import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.{js,ts}",
    screenshotsFolder: "cypress/artifacts/screenshots",
    videosFolder: "cypress/artifacts/videos",
    // setupNodeEvents(on, config) {
    // // implement node event listeners here
    // },
  },

  component: {
    specPattern: "src/app/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.{js,ts}",
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
