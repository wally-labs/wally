import PricingPlan from "./pricing-plan";

describe("<PricingPlan />", () => {
  beforeEach(() => {
    cy.mount(<PricingPlan />);
  });

  it("renders the pricing page header", () => {
    cy.get("[data-cy=pricing-header]")
      .should("be.visible")
      .should("contain.text", "Pricing");
  });

  it("renders exactly two tiers with correct names and prices", () => {
    cy.get("[data-cy=tier-headers]")
      .should("have.length", 2)
      .eq(0)
      .should("contain.text", "Personal");

    cy.get("[data-cy=tier-headers]")
      .should("have.length", 2)
      .eq(1)
      .should("contain.text", "Enterprise");

    cy.contains("span", "$29").should("exist");
    cy.contains("span", "$199").should("exist");
  });

  it("renders the correct number of features for each tier", () => {
    cy.get("[data-cy=tier-lists]")
      .eq(0)
      .find("[data-cy=tier-list-items]")
      .should("have.length", 4);

    cy.get("[data-cy=tier-lists]")
      .eq(1)
      .find("[data-cy=tier-list-items]")
      .should("have.length", 6);
  });

  it('includes a "Get started today" link for each tier', () => {
    cy.get("[data-cy=purchase-link]")
      .should("have.length", 2)
      .each(($link) => {
        cy.wrap($link)
          .should("be.visible")
          .and("have.attr", "href")
          .and("match", /^#/);
      });
  });
});
