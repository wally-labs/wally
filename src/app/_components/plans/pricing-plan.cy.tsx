import PricingPlan from "./pricing-plan";

// The component currently uses a hardcoded 'tiers' array.
// If this were dynamic or from a prop, we'd mock it here.
const expectedTiersData = [
  {
    name: "Personal",
    priceMonthly: "$29",
    featuresCount: 4,
    id: "tier-personal", // Assuming IDs are stable
  },
  {
    name: "Enterprise",
    priceMonthly: "$199",
    featuresCount: 6,
    id: "tier-enterprise",
  },
];

describe("<PricingPlan />", () => {
  beforeEach(() => {
    cy.mount(<PricingPlan />);
  });

  it("renders the pricing page header", () => {
    cy.get("[data-cy=pricing-header]")
      .should("be.visible")
      .and("contain.text", "Pricing");
    cy.contains("Choose the right plan for you").should("be.visible");
  });

  it("renders each tier with its correct name and monthly price", () => {
    cy.get("[data-cy=tier-headers]").should("have.length", expectedTiersData.length);

    expectedTiersData.forEach((expectedTier) => {
      // Find the tier card by its ID or name for more resilience,
      // assuming tier.id is stable and rendered as an id attribute on the card or header.
      // For now, relying on the order and existing `tier-headers` selector.
      cy.contains("[data-cy=tier-headers]", expectedTier.name)
        .should("be.visible")
        .closest("[class*='rounded-3xl']") // Find the parent card for this tier
        .within(() => {
          cy.get("[data-cy=tier-price]").should("contain.text", expectedTier.priceMonthly);
          cy.contains("/month").should("be.visible");
        });
    });
  });

  it("renders the correct description and number of features for each tier", () => {
    expectedTiersData.forEach((expectedTier) => {
      cy.contains("[data-cy=tier-headers]", expectedTier.name)
        .closest("[class*='rounded-3xl']") // Find the parent card
        .within(() => {
          // Check description (optional, could be very long)
          // cy.get("p").contains(expectedTier.descriptionSubstring).should('be.visible');
          cy.get("[data-cy=tier-lists]")
            .find("[data-cy=tier-list-items]")
            .should("have.length", expectedTier.featuresCount);
        });
    });
  });

  it('includes a "Get started today" link for each tier with a placeholder href', () => {
    cy.get("[data-cy=purchase-link]")
      .should("have.length", expectedTiersData.length)
      .each(($link) => {
        cy.wrap($link)
          .should("be.visible")
          .and("contain.text", "Get started today")
          .and("have.attr", "href", "#"); // Currently hardcoded to "#"
      });
  });

  // Note on features mentioned in the subtask but not implemented in the component:
  // 1. Yearly/Monthly Toggle: The component `PricingPlan.tsx` currently does not implement
  //    logic for toggling between monthly and yearly prices. It only displays monthly prices.
  //    Therefore, tests for this toggle functionality cannot be added until the feature exists.
  //
  // 2. Dynamic Subscription Button: The "Get started today" links are static anchor tags
  //    with `href="#"`. There is no `onSubscribeClick` prop or dynamic callback mechanism
  //    implemented in the current version of the component. Tests for such a callback
  //    are not applicable at this time.

  it("correctly applies styling for featured and non-featured plans", () => {
    // Assuming 'Enterprise' is the featured plan as per the hardcoded `tiers` data
    const featuredTierName = "Enterprise";
    const nonFeaturedTierName = "Personal";

    // Check featured tier
    cy.contains("[data-cy=tier-headers]", featuredTierName)
      .closest("[class*='rounded-3xl']")
      .should("have.class", "bg-gray-900"); // Featured class

    // Check non-featured tier
    cy.contains("[data-cy=tier-headers]", nonFeaturedTierName)
      .closest("[class*='rounded-3xl']")
      .should("have.class", "bg-white/60"); // Non-featured class
  });
});
```
