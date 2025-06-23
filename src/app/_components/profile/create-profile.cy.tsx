import CreateProfile from './create-profile';
import React from 'react';
import * as TRPC from '~/trpc/react';
import * as NextNav from 'next/navigation';

describe('<CreateProfile />', () => {
  beforeEach(() => {
    cy.stub(NextNav, 'useRouter').returns({ push: cy.stub() } as any);
    cy.stub(TRPC.api.chat.createChat, 'useMutation').returns({ mutate: cy.stub() } as any);
    cy.stub(TRPC.api, 'useUtils').returns({ chat: { getAllChatHeaders: { invalidate: cy.stub() } } } as any);
  });

  it('renders profile form', () => {
    cy.mount(<CreateProfile />);
    cy.contains('Create Profile').should('exist');
  });
});
