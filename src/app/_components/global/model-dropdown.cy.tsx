import { ModelDropdown } from './model-dropdown';
import React from 'react';

describe('<ModelDropdown />', () => {
  it('shows model options when triggered', () => {
    cy.mount(<ModelDropdown />);
    cy.contains('Wally 0.5').click();
    cy.contains('Models').should('be.visible');
    cy.contains('Basic').should('be.visible');
    cy.contains('Premium').should('be.visible');
  });
});
