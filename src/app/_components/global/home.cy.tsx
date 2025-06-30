import Home from './home';
import React from 'react';
import * as Sidebar from '@components/ui/sidebar';
import * as AppSidebarModule from './app-sidebar';
import * as Hero from './hero-section';

const MockSidebar = ({ children }: any) => <div data-cy="sidebar">{children}</div>;
const MockHero = ({ state, children }: any) => (
  <div data-cy="hero" data-state={state}>
    {children}
  </div>
);

describe('<Home />', () => {
  beforeEach(() => {
    cy.stub(Sidebar, 'useSidebar').returns({ state: 'collapsed' } as any);
    cy.stub(AppSidebarModule, 'AppSidebar').callsFake(MockSidebar);
    cy.stub(Hero, 'HeroSection').callsFake(MockHero);
  });

  it('passes sidebar state and renders children', () => {
    cy.mount(
      <Home>
        <div data-cy="child">Test</div>
      </Home>
    );
    cy.get('[data-cy=sidebar]').should('exist');
    cy.get('[data-cy=hero]').should('have.attr', 'data-state', 'collapsed');
    cy.get('[data-cy=child]').should('contain.text', 'Test');
  });
});
