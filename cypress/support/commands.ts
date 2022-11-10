// / <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      handleCsrf(): Chainable<void>;
      handleAuthenticatedUser(): Chainable<void>;
      handleUnauthenticatedUser(): Chainable<void>;
      //   login(email: string, password: string): Chainable<void>;
      //   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>;
      //   dismiss(
      //     subject: string,
      //     options?: Partial<TypeOptions>
      //   ): Chainable<Element>;
      //   visit(
      //     originalFn: CommandOriginalFn,
      //     url: string,
      //     options: Partial<VisitOptions>
      //   ): Chainable<Element>;
    }
  }
}

Cypress.Commands.add("handleCsrf", () => {
  cy.intercept(
    {
      method: "GET",
      pathname: "/sanctum/csrf-cookie",
    },
    { statusCode: 204, delay: 50 }
  ).as("getCookie");
});

Cypress.Commands.add("handleAuthenticatedUser", () => {
  cy.intercept(
    {
      method: "GET",
      pathname: "/api/user",
    },
    { fixture: "user" }
  ).as("getAuthenticatedUser");
});

Cypress.Commands.add("handleUnauthenticatedUser", () => {
  cy.intercept(
    {
      method: "GET",
      pathname: "/api/user",
    },
    { statusCode: 401 }
  ).as("getUnauthenticatedUser");
});

export {};
