// https://docs.cypress.io/api/introduction/api.html

describe("Home Test", () => {
  it("visits the app root url", () => {
    cy.intercept(
      "GET", // Route all GET requests
      "/api/user", // that have a URL that matches '/users/*'
      {
        statusCode: 401,
      }
    );

    cy.visit("/");
    // A nav element should exist
    cy.get("nav").should("exist");

    // A [aria-roledescription=logo] element should exist
    cy.get("[aria-roledescription=logo]").should("exist");

    // In the navbar, there should be a login button
    cy.get("nav").should("contain", "Login");

    // In the navbar, there should be a sign up button
    cy.get("nav").should("contain", "Sign up");
  });
});
