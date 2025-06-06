import React from 'react';
import { ModelDropdown } from './model-dropdown'; // Adjusted import
import { Gem } from 'lucide-react'; // Used in the component

describe('<ModelDropdown />', () => {
  it('mounts successfully', () => {
    cy.mount(<ModelDropdown />);
    cy.get('[data-cy=model-dropdown-trigger]').should('be.visible');
  });

  it('renders the dropdown trigger with the static text "Wally 0.5"', () => {
    cy.mount(<ModelDropdown />);
    cy.get('[data-cy=model-dropdown-trigger]').should('contain.text', 'Wally 0.5');
  });

  it('opens the dropdown menu when the trigger is clicked', () => {
    cy.mount(<ModelDropdown />);
    cy.get('[data-cy=model-dropdown-trigger]').click();
    cy.get('[data-cy=model-dropdown-menu]').should('be.visible');
  });

  it('displays "Models" as the label in the dropdown menu', () => {
    cy.mount(<ModelDropdown />);
    cy.get('[data-cy=model-dropdown-trigger]').click();
    cy.get('[data-cy=model-dropdown-menu]').find('[data-cy=model-dropdown-label]').should('contain.text', 'Models');
  });

  it('lists the static models "Basic" and "Premium" in the dropdown menu', () => {
    cy.mount(<ModelDropdown />);
    cy.get('[data-cy=model-dropdown-trigger]').click();
    cy.get('[data-cy=model-dropdown-menu]').within(() => {
      cy.get('[data-cy=model-dropdown-item-basic]').should('contain.text', 'Basic');
      cy.get('[data-cy=model-dropdown-item-premium]').should('contain.text', 'Premium');
    });
  });

  it('shows a Gem icon next to the "Premium" model', () => {
    cy.mount(<ModelDropdown />);
    cy.get('[data-cy=model-dropdown-trigger]').click();
    cy.get('[data-cy=model-dropdown-item-premium]').find('svg').should('be.visible');
    // Check if the SVG is indeed the Gem icon by looking for a class or path if needed,
    // but visibility is often sufficient for functional testing.
    // Lucide icons usually have a class like 'lucide-gem'.
    cy.get('[data-cy=model-dropdown-item-premium]').find('.lucide-gem').should('be.visible');
  });

  // Since the component is static and does not implement model selection logic (e.g., using Jotai or other state),
  // tests for updating the model or indicating a selected model are not applicable.
  // If the component were to be updated with such features, those tests would be added here.
});

// Reminder: For these tests to pass reliably, data-cy attributes should be added to ModelDropdown.tsx:
// - DropdownMenuTrigger: data-cy="model-dropdown-trigger"
// - DropdownMenuContent: data-cy="model-dropdown-menu"
// - DropdownMenuLabel: data-cy="model-dropdown-label"
// - DropdownMenuItem for "Basic": data-cy="model-dropdown-item-basic"
// - DropdownMenuItem for "Premium": data-cy="model-dropdown-item-premium"
// The Gem icon is a child of the "Premium" item, so it can be found within that item.
```
