import UpdateProfile from './update-profile';
import React from 'react';
import * as NextNav from 'next/navigation';
import * as TRPC from '~/trpc/react';
import * as Atoms from '../atoms';
import * as Jotai from 'jotai';

describe('<UpdateProfile />', () => {
  beforeEach(() => {
    cy.stub(NextNav, 'useParams').returns({ chats: '1' } as any);
    cy.stub(Atoms, 'useMemoChatData').returns(() => null as any);
    cy.stub(Jotai, 'useAtomValue').returns({
      chatData: { name: 'Alice', heartLevel: 2, relationship: 'FRIEND' },
    } as any);
    cy.stub(TRPC.api.chat.getChat, 'useQuery').returns({ data: null } as any);
    cy.stub(TRPC.api.chat.updateChat, 'useMutation').returns({ mutate: cy.stub() } as any);
    cy.stub(TRPC.api, 'useUtils').returns({ chat: { getAllChatHeaders: { invalidate: cy.stub() } } } as any);
  });

  it('renders dialog trigger', () => {
    cy.mount(<UpdateProfile />);
    cy.contains('Edit Profile').should('exist');
  });
});
