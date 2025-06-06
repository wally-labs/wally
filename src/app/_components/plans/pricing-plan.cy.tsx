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

  it("renders tiers with correct names and prices", () => {
    const expectedTiers = [
      { name: "Personal", price: "$29" },
      { name: "Enterprise", price: "$199" },
    ];

    cy.get("[data-cy=tier-headers]").should("have.length", expectedTiers.length);

    expectedTiers.forEach((tier, index) => {
      cy.get("[data-cy=tier-headers]")
        .eq(index)
        .should("contain.text", tier.name)
        .closest('div') // Move to the parent container of the tier header
        .parent() // Move to the overall tier card container
        .find("span.text-5xl") // Find the price span within this tier
        .should("contain.text", tier.price);
    });
  });

  it("renders the correct number of features for each tier", () => {
    // Personal tier
    cy.get("[data-cy=tier-lists]")
      .eq(0)
      .find("[data-cy=tier-list-items]")
      .should("have.length", 4);

    // Enterprise tier
    cy.get("[data-cy=tier-lists]")
      .eq(1)
      .find("[data-cy=tier-list-items]")
      .should("have.length", 6);
  });

  it('includes a "Get started today" link for each tier with valid href', () => {
    cy.get("[data-cy=purchase-link]")
      .should("have.length", 2)
      .each(($link) => {
        cy.wrap($link)
          .should("be.visible")
          .and("have.attr", "href")
          .and("not.be.empty")
          .and("match", /^#/);
      });
  });
});
