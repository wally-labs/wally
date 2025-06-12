import React from 'react';
import ClerkComponent from './clerk-component';
import * as ClerkNextjs from '@clerk/nextjs';
import * as Jotai from 'jotai';
import * as TrpcReact from '~/trpc/react'; // Assuming this is the correct path for api
import { Button } from '~/components/ui/button'; // Imported to potentially check its props if needed

// Mock UserButton
const MockUserButton = () => <div data-cy="user-button">UserButtonMock</div>;

// Mock SignInButton - it receives children (the actual Button component)
const MockSignInButton = ({ children }: { children: React.ReactNode }) => (
  <div data-cy="sign-in-button-wrapper">{children}</div>
);

// Mock H.identify from highlight-run/next/client
const mockHighlightIdentify = cy.stub().as('highlightIdentifyStub');
const mockHighlightInit = cy.stub().as('highlightInitStub'); // if H.init is also used

// Mock Jotai's useSetAtom
const mockSetChatDataAtom = cy.stub().as('setChatDataAtom');

// Mock tRPC's useUtils
const mockInvalidateChatHeaders = cy.stub().as('invalidateChatHeaders');
const mockApiUseUtils = cy.stub().returns({
  chat: {
    getAllChatHeaders: {
      invalidate: mockInvalidateChatHeaders,
    },
  },
});

describe('<ClerkComponent />', () => {
  const useUserStub = cy.stub();

  beforeEach(() => {
    // Stub Clerk hooks and components
    cy.stub(ClerkNextjs, 'useUser').callsFake(useUserStub);

    // Mock H.identify (and potentially H.init) globally for the component
    cy.window().then((win) => {
      // @ts-expect-error - H is not on window by default
      win.H = {
        identify: mockHighlightIdentify,
        init: mockHighlightInit,
      };
    });
    mockHighlightIdentify.resetHistory(); // Reset before each test

    // Mock Jotai
    cy.stub(Jotai, 'useSetAtom').returns(mockSetChatDataAtom);
    mockSetChatDataAtom.resetHistory();

    // Mock tRPC
    cy.stub(TrpcReact, 'api').value({
      useUtils: mockApiUseUtils,
      // Mock other tRPC procedures if ClerkComponent calls them directly
    });
    mockInvalidateChatHeaders.resetHistory();

    // Mock crypto.randomUUID if it causes issues in test environment (usually not needed in modern envs)
    // cy.stub(crypto, 'randomUUID').returns('mocked-uuid');
  });

  context('when user is signed out', () => {
    beforeEach(() => {
      useUserStub.returns({
        isLoaded: true, // Ensure isLoaded is true so the second useEffect can run its logic
        isSignedIn: false,
        user: null,
      });

      // Mock SignedIn to not render its children and SignedOut to render its children
      // This simulates Clerk's behavior based on auth state
      cy.stub(ClerkNextjs, 'SignedIn').callsFake(({ children }: {children: React.ReactNode}) => null);
      cy.stub(ClerkNextjs, 'SignedOut').callsFake(({ children }: {children: React.ReactNode}) => <>{children}</>);
      // SignInButton is a component that takes children. We want to render our Button inside it.
      cy.stub(ClerkNextjs, 'SignInButton').callsFake(MockSignInButton as any);


      cy.mount(<ClerkComponent />);
    });

    it('should display the Sign In button and not the UserButton', () => {
      cy.get('[data-cy=sign-in-button-wrapper]').should('be.visible');
      cy.get('[data-cy=sign-in-button-wrapper]').find('button').should('contain.text', 'Sign In');
      cy.get('[data-cy=user-button]').should('not.exist');
    });

    it('should call H.identify for anonymous user (at least once due to useEffect structure)', () => {
      // The first useEffect runs on every render if dependencies are not set correctly.
      // We check it has been called with a pattern matching "anon="
      cy.get('@highlightIdentifyStub').should('have.been.calledWithMatch', /^anon=/);
    });

    it('should attempt to clear chat data and invalidate tRPC query for signed-out user', () => {
      // This logic is in the second useEffect, guarded by isLoaded and !isSignedIn
      cy.get('@setChatDataAtom').should('have.been.calledWith', []);
      cy.get('@invalidateChatHeaders').should('have.been.called');
    });
  });

  context('when user is signed in', () => {
    const mockUser = {
      id: 'user_123',
      firstName: 'Test',
      lastName: 'User',
      primaryEmailAddressId: 'email_123',
      emailAddresses: [{ id: 'email_123', emailAddress: 'test@example.com' }],
    };

    beforeEach(() => {
      useUserStub.returns({
        isLoaded: true, // Important for the second useEffect
        isSignedIn: true,
        user: mockUser,
      });

      // Mock SignedIn to render its children and SignedOut to not render its children
      cy.stub(ClerkNextjs, 'SignedIn').callsFake(({ children } : {children: React.ReactNode}) => <>{children}</>);
      cy.stub(ClerkNextjs, 'SignedOut').callsFake(({ children } : {children: React.ReactNode}) => null);
      cy.stub(ClerkNextjs, 'UserButton').callsFake(MockUserButton);


      cy.mount(<ClerkComponent />);
    });

    it('should display the UserButton and not the Sign In button', () => {
      cy.get('[data-cy=user-button]').should('be.visible');
      cy.get('[data-cy=sign-in-button-wrapper]').should('not.exist');
    });

    it('should call H.identify with user details (and potentially anon first)', () => {
      // It might call the anon identify first due to the initial useEffect.
      // Then, upon isLoaded & isSignedIn, it calls with user details.
      // We ensure the user-specific call happens.
      cy.get('@highlightIdentifyStub').should('have.been.calledWith', 'user_123', {
        highlightDisplayName: 'Test User',
        highlightEmail: 'test@example.com',
        hasUsedFeature: true,
      });
    });

    it('should not clear chat data or invalidate tRPC query for signed-in user', () => {
        // These actions are in the !isSignedIn block of the useEffect
        cy.get('@setChatDataAtom').should('not.have.been.called');
        cy.get('@invalidateChatHeaders').should('not.have.been.called');
    });
  });

  context('when Clerk is loading', () => {
    beforeEach(() => {
      useUserStub.returns({
        isLoaded: false, // Clerk is not yet loaded
        isSignedIn: false, // Default, doesn't matter much when isLoaded is false
        user: null,
      });
      cy.stub(ClerkNextjs, 'SignedIn').callsFake(({ children }: {children: React.ReactNode}) => null);
      cy.stub(ClerkNextjs, 'SignedOut').callsFake(({ children }: {children: React.ReactNode}) => <>{children}</>); // Show sign out by default if nothing else
      cy.stub(ClerkNextjs, 'SignInButton').callsFake(MockSignInButton as any);


      cy.mount(<ClerkComponent />);
    });

    it('should not call H.identify with user details or clear data while loading', () => {
      // The anon identify might still be called.
      cy.get('@highlightIdentifyStub').should('have.been.calledWithMatch', /^anon=/);

      // The user-specific H.identify and data clearing logic are inside `if (!isLoaded) return;`
      // So, these should not have been called yet if we only assert calls *after* the anon one.
      // To be precise, check that specific calls didn't happen:
      const calls = mockHighlightIdentify.getCalls();
      const nonAnonCalls = calls.filter(call => !call.args[0].startsWith('anon='));
      expect(nonAnonCalls.length).to.eq(0);

      cy.get('@setChatDataAtom').should('not.have.been.called');
      cy.get('@invalidateChatHeaders').should('not.have.been.called');
    });

    it('should still render SignedOut content (e.g., SignInButton) by default while loading', () => {
      // Based on how SignedIn/SignedOut are typically structured, they react to isSignedIn.
      // If isLoaded is false, isSignedIn is usually false, leading to SignedOut content.
      cy.get('[data-cy=sign-in-button-wrapper]').should('be.visible');
      cy.get('[data-cy=user-button]').should('not.exist');
    });
  });
});

// Note on the first useEffect in ClerkComponent:
// useEffect(() => { H.identify(`anon=${crypto.randomUUID()}`, ...); });
// Without a dependency array [], this runs on *every render*.
// This means H.identify for anon user will be called multiple times if anything causes a re-render.
// Tests are currently written to expect it "at least once" or "with match" for anon.
// For more deterministic testing of this specific call, the component's useEffect should be `useEffect(..., [])`.
// The tests for user-specific H.identify are more stable as they depend on `isLoaded` and `user` props changing.
```
