describe("Basic App Tests", () => {
  it("loads the homepage", () => {
    cy.visit("/");
    cy.contains("My todos").should("exist");
    cy.get("button").contains("new").should("exist");
    cy.contains("App successfully hosted").should("exist");
  });
});
