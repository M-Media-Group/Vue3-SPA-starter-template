// https://docs.cypress.io/api/introduction/api.html

describe("My First Test", () => {
  it("visits the app root url", () => {
    cy.visit("/");
    // A nav element should exist
    cy.get("nav").should("exist");

    // A .logo element should exist
    cy.get(".logo").should("exist");

    // A .logo element should contain the text "Paddle"
    cy.get(".logo").should("contain", "Paddle");

    // A .logo element should contain the text "Scan"
    cy.get(".logo").should("contain", "Scan");

    // In the navbar, there should be a login button
    cy.get("nav").should("contain", "Login");

    // In the navbar, there should be a sign up button
    cy.get("nav").should("contain", "Sign Up");
  });
});
