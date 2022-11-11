describe("Locales", () => {
  beforeEach(() => {
    cy.intercept(
      "GET", // Route all GET requests
      "/api/user", // that have a URL that matches '/users/*'
      {
        statusCode: 401,
      }
    ).as("unableToGetUser");

    cy.handleCsrf();
  });
  it("Shows a language switcher in the footer", () => {
    cy.visit("/");
    cy.get("select[name=locales]").should("exist");
    cy.get("footer").contains("English");
    cy.get("footer").contains("Français");
  });
  it("The current selected locale matches the one in the HTML tag", () => {
    cy.visit("/");
    // Get the valuef rom "select[name=locales]"
    cy.get("select[name=locales]").then(($select) => {
      const value = $select.val();
      // Get the lang attribute from the html tag
      cy.get("html").should("have.attr", "lang", value);
    });
  });

  // Skipping test because no idea how to change language during test, but can test physically in Chrome, see: https://stackoverflow.com/questions/36072584/how-can-i-change-chrome-settings-to-test-using-navigator-language
  it.skip("Changes language when browser language changed", () => {
    cy.visit("/");
    // Confirm that the current language is English
    cy.get("html").should("have.attr", "lang", "en");

    // Update the browser language
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, "language", {
        value: "fr-FR",
      });
    });

    // Confirm that the current language is French
    cy.get("html").should("have.attr", "lang", "fr");
  });

  it("Uses French by default if navigator language is French", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", {
          value: "fr-FR",
        });
      },
    });
    cy.get("select[name=locales]").should("have.value", "fr");
    cy.get("html").should("have.attr", "lang", "fr");
  });
  it("Actually changes the language when its changed", () => {
    cy.visit("/");
    cy.get("select[name=locales]").select("fr");
    cy.get("footer").contains("Français");
    // The lang attribute should be "fr"
    cy.get("html").should("have.attr", "lang", "fr");
    // The navbar should contain "Connexion"
    cy.get("nav").should("contain", "Connexion");
    // In the header, the og:locale should be "fr"
    cy.get("head meta[name='og:locale']").should("have.attr", "content", "fr");
    // Generate an API call to check the Axios is now sending the correct Accept-Language header
    // @todo
  });
  it("Remembers the language when the page is refreshed", () => {
    cy.visit("/");
    cy.get("select[name=locales]").select("fr");
    cy.reload();
    cy.get("footer").contains("Français");
    // The lang attribute should be "fr"
    cy.get("html").should("have.attr", "lang", "fr");
    // The navbar should contain "Connexion"
    cy.get("nav").should("contain", "Connexion");
  });
});
