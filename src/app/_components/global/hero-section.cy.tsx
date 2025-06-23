import { HeroSection } from './hero-section';
import React from 'react';
import * as Dropdown from './model-dropdown';
import * as Clerk from './clerk-component';

const MockDropdown = () => <div data-cy="dropdown">Dropdown</div>;
const MockClerk = () => <div data-cy="clerk">Clerk</div>;

describe('<HeroSection />', () => {
  beforeEach(() => {
    cy.stub(Dropdown, 'ModelDropdown').callsFake(MockDropdown);
    cy.stub(Clerk, 'default').callsFake(MockClerk);
  });

  it('renders children and sub components', () => {
    cy.mount(
      <HeroSection state="collapsed">
        <div data-cy="child">Content</div>
      </HeroSection>
    );
    cy.get('[data-cy=dropdown]').should('exist');
    cy.get('[data-cy=clerk]').should('exist');
    cy.get('[data-cy=child]').should('contain.text', 'Content');
  });
});
