import HighlightErrorBoundary from './highlight-boundary';
import React from 'react';

describe('<HighlightErrorBoundary />', () => {
  it('renders children', () => {
    cy.mount(
      <HighlightErrorBoundary>
        <div data-cy="content">Hello</div>
      </HighlightErrorBoundary>
    );
    cy.get('[data-cy=content]').should('contain.text', 'Hello');
  });
});
