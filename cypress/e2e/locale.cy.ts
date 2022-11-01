describe("Locales", () => {
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
  it("Uses French by default if navigator language is French", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", {
          value: "fr-FR",
        });
      },
    });
    cy.get("select[name=locales]").should("have.value", "fr");
  });
  it("Actually changes the language when its changed", () => {
    cy.visit("/");
    cy.get("select[name=locales]").select("fr");
    cy.get("footer").contains("Français");
    // The lang attribute should be "fr"
    cy.get("html").should("have.attr", "lang", "fr");
    // The navbar should contain "Connexion"
    cy.get("nav").should("contain", "Connexion");
    // The axios default common header should be "fr"
    cy.window().then((win) => {
      expect(win.axios.defaults.headers.common["Accept-Language"]).to.equal(
        "fr"
      );
    });
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
