import { AppSidebar } from './app-sidebar';
import React from 'react';
import * as Clerk from '@clerk/nextjs';
import * as TRPC from '~/trpc/react';
import * as Jotai from 'jotai';

const mockData = [
  { id: '1', chatData: { chatHeader: 'Chat 1' } },
];

describe('<AppSidebar />', () => {
  beforeEach(() => {
    cy.stub(Clerk, 'useAuth').returns({ isSignedIn: true } as any);
    cy.stub(TRPC.api.chat.getAllChatHeaders, 'useQuery').returns({ data: mockData, isLoading: false } as any);
    cy.stub(TRPC.api.chat.deleteChat, 'useMutation').returns({ mutate: cy.stub() } as any);
    cy.stub(TRPC.api, 'useUtils').returns({ chat: { getAllChatHeaders: { invalidate: cy.stub() } } } as any);
    cy.stub(Jotai, 'useAtom').returns([mockData, cy.stub()] as any);
  });

  it('renders chat headers and new chat link', () => {
    cy.mount(
      <AppSidebar>
        <div data-cy="header">X</div>
      </AppSidebar>
    );
    cy.contains('Chat 1').should('exist');
    cy.contains('New Chat').should('have.attr', 'href', '/create-chat');
  });
});
