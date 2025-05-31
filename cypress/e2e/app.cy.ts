describe("Navigation when a user is not logged in", () => {
  it("displays home page", () => {
    // TODO make it more comprehensive OR put in component testing
    cy.visit("/");

    cy.get("h1").contains("Say Hello To Wally!");

    cy.get("label").contains("Send a Message");

    cy.get("textarea").should("exist");
  });

  it("navigates to the plans page", () => {
    // start from the index page
    cy.visit("/");

    // find link with an href attribute containing "plans" and click it
    cy.get('a[href*="plans"]').click({ multiple: true });

    // new url should include "/about"
    cy.url().should("include", "/plans");

    // The new page should contain an h1 with "Pricing"
    cy.get("h2").contains("Pricing");
  });

  it("navigates to the sign-in page", () => {
    // start from the index page
    cy.visit("/");

    // find button containing "sign-in" and click it
    cy.contains("button", "Sign In").click();

    // new url should include "/sign-in"
    cy.url().should("include", "/sign-in");

    // The new page should contain a header that says "Sign in.."
    cy.get(".cl-headerTitle").contains("Sign in to Wally");

    // Should contain a form with email input field
    cy.get("form").should("exist");

    cy.get("form").get("input").should("exist");

    // Should contain NextAuth providers' options
    cy.get(".cl-socialButtonsIconButton__apple").should("exist");
    cy.get(".cl-socialButtonsIconButton__google").should("exist");
    cy.get(".cl-socialButtonsIconButton__microsoft").should("exist");
  });

  it("redirects you to home page, when you try to access a chat", () => {
    // start from index page, should I?
    cy.visit("/");

    // visit fake chat page
    cy.visit("/chats/c-random-chat-id");

    // TODO... wait for while... new page should be "/"... new page should be ...
  });
});
