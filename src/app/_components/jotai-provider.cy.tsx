import React from 'react';
import { useAtom, atom, Provider as JotaiP } from 'jotai';
import JotaiProviderComponent from './jotai-provider'; // The component to test
import * as ClerkNextjs from '@clerk/nextjs'; // To mock useUser

// Define simple atoms for testing
const countAtom = atom(0);
const textAtom = atom('initial');

// A simple child component that uses the atoms
const TestChildComponent = () => {
  const [count, setCount] = useAtom(countAtom);
  const [text, setText] = useAtom(textAtom);

  return (
    <div>
      <p data-cy="count-display">Count: {count}</p>
      <button data-cy="increment-button" onClick={() => setCount((c) => c + 1)}>
        Increment
      </button>
      <p data-cy="text-display">Text: {text}</p>
      <button data-cy="update-text-button" onClick={() => setText('updated')}>
        Update Text
      </button>
      <button data-cy="reset-count-button" onClick={() => setCount(0)}>Reset Count</button>
      <button data-cy="reset-text-button" onClick={() => setText('initial')}>Reset Text</button>
    </div>
  );
};

describe('<JotaiProviderComponent />', () => {
  const mockUseUser = cy.stub();
  let consoleLogSpy: any;

  beforeEach(() => {
    // Mock Clerk's useUser hook
    cy.stub(ClerkNextjs, 'useUser').callsFake(mockUseUser);
    // Spy on console.log
    consoleLogSpy = cy.spy(console, 'log').as('consoleLog');

    // Reset atoms to initial state for each test by providing a new key to TestWrapper
    // This is important because Jotai atoms are global by default.
    // The JotaiProviderComponent itself creates new stores, but for tests,
    // we need to ensure the atoms themselves are reset if not remounting the entire tree with a new store.
    // The key prop on TestWrapper or directly on JotaiProviderComponent (if it were to accept one)
    // or managing the store instance explicitly in tests would be ways to handle this.
    // For this setup, our JotaiProviderComponent creates a new store on user.id change,
    // so atom state will reset then. For tests not changing user.id, we should ensure child state is clean.
    // The easiest is to ensure each test mounts fresh components.
  });

  afterEach(() => {
    // Restore console.log if necessary, though spy should be fine
    // Cypress.restore(); // if we used cy.stub(window, 'console')
  });

  context('With a stable user session', () => {
    beforeEach(() => {
      mockUseUser.returns({ isSignedIn: true, user: { id: 'user_stable' } });
    });

    it('mounts successfully and provides Jotai store to children', () => {
      cy.mount(
        <JotaiProviderComponent>
          <TestChildComponent />
        </JotaiProviderComponent>
      );
      cy.get('[data-cy=count-display]').should('contain', 'Count: 0');
      cy.get('[data-cy=text-display]').should('contain', 'Text: initial');
    });

    it('allows children to read and update atoms', () => {
      cy.mount(
        <JotaiProviderComponent>
          <TestChildComponent />
        </JotaiProviderComponent>
      );
      cy.get('[data-cy=increment-button]').click();
      cy.get('[data-cy=count-display]').should('contain', 'Count: 1');
      cy.get('[data-cy=update-text-button]').click();
      cy.get('[data-cy=text-display]').should('contain', 'Text: updated');
    });

    it('shares atom state between multiple children under the same provider instance', () => {
      const TestChildComponentTwo = () => {
        const [count] = useAtom(countAtom);
        return <p data-cy="count-display-two">Count Two: {count}</p>;
      };
      cy.mount(
        <JotaiProviderComponent>
          <TestChildComponent />
          <TestChildComponentTwo />
        </JotaiProviderComponent>
      );
      cy.get('[data-cy=count-display]').should('contain', 'Count: 0');
      cy.get('[data-cy=count-display-two]').should('contain', 'Count Two: 0');
      cy.get('[data-cy=increment-button]').click();
      cy.get('[data-cy=count-display]').should('contain', 'Count: 1');
      cy.get('[data-cy=count-display-two]').should('contain', 'Count Two: 1');
    });

    it('renders children correctly', () => {
      const childText = "I am a child";
      cy.mount(
        <JotaiProviderComponent>
          <div data-cy="direct-child">{childText}</div>
        </JotaiProviderComponent>
      );
      cy.get('[data-cy=direct-child]').should('contain', childText);
    });

    it('does not recreate store if user object reference changes but ID remains the same', () => {
        mockUseUser.returns({ isSignedIn: true, user: { id: 'user_stable_rerender' } });
        const consoleLogBefore = consoleLogSpy.callCount;

        cy.mount(
            <JotaiProviderComponent>
              <TestChildComponent />
            </JotaiProviderComponent>
          ).then(({ rerender }) => {
            cy.get('[data-cy=increment-button]').click();
            cy.get('[data-cy=count-display]').should('contain', 'Count: 1');

            // Rerender with a new user object but same ID
            mockUseUser.returns({ isSignedIn: true, user: { id: 'user_stable_rerender' } }); // New object, same ID
            rerender(
              <JotaiProviderComponent>
                <TestChildComponent />
              </JotaiProviderComponent>
            );

            cy.get('[data-cy=count-display]').should('contain', 'Count: 1'); // State should persist
            cy.get('@consoleLog').should('have.callCount', consoleLogBefore + 1); // Initial createStore log
                                                                                // No new store creation expected here
        });
    });
  });

  context('With changing user sessions', () => {
    it('re-initializes the Jotai store when user ID changes', () => {
      // Initial mount with user1
      mockUseUser.returns({ isSignedIn: true, user: { id: 'user1' } });
      cy.mount(
        <JotaiProviderComponent>
          <TestChildComponent />
        </JotaiProviderComponent>
      ).then(({ rerender }) => {
        cy.get('[data-cy=count-display]').should('contain', 'Count: 0');
        cy.get('[data-cy=increment-button]').click();
        cy.get('[data-cy=count-display]').should('contain', 'Count: 1');
        cy.get('@consoleLog').should('have.been.calledWith', 'Creating new store for ', { id: 'user1' });

        // Simulate user change to user2
        mockUseUser.returns({ isSignedIn: true, user: { id: 'user2' } });
        rerender(
          <JotaiProviderComponent>
            <TestChildComponent />
          </JotaiProviderComponent>
        );

        // Atoms should be reset to initial values due to new store
        cy.get('[data-cy=count-display]').should('contain', 'Count: 0');
        cy.get('[data-cy=text-display]').should('contain', 'Text: initial');
        cy.get('@consoleLog').should('have.been.calledWith', 'Creating new store for ', { id: 'user2' });
      });
    });

    it('re-initializes the Jotai store when user logs out (ID becomes undefined)', () => {
      mockUseUser.returns({ isSignedIn: true, user: { id: 'user_loggedin' } });
      cy.mount(
        <JotaiProviderComponent>
          <TestChildComponent />
        </JotaiProviderComponent>
      ).then(({ rerender }) => {
        cy.get('[data-cy=increment-button]').click();
        cy.get('[data-cy=count-display]').should('contain', 'Count: 1');
        cy.get('@consoleLog').should('have.been.calledWith', 'Creating new store for ', { id: 'user_loggedin' });

        // Simulate user logout
        mockUseUser.returns({ isSignedIn: false, user: null }); // Or { user: { id: undefined } } depending on Clerk
        rerender(
          <JotaiProviderComponent>
            <TestChildComponent />
          </JotaiProviderComponent>
        );
        cy.get('[data-cy=count-display]').should('contain', 'Count: 0');
        cy.get('@consoleLog').should('have.been.calledWith', 'Creating new store for ', null);
      });
    });
  });
});
```
