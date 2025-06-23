import ChatHome from './chat-home';
import React from 'react';
import * as NextNav from 'next/navigation';
import * as AIReact from '@ai-sdk/react';
import * as TRPC from '~/trpc/react';
import * as Jotai from 'jotai';
import * as UpdateProfileModule from '../profile/update-profile';
import * as Uploadthing from '~/lib/uploadthing';

const MockUpdateProfile = () => <div data-cy="update-profile"></div>;
const MockUpload = () => <div data-cy="upload"></div>;

describe('<ChatHome />', () => {
  beforeEach(() => {
    cy.stub(NextNav, 'useRouter').returns({ replace: cy.stub(), push: cy.stub() } as any);
    cy.stub(NextNav, 'useParams').returns({ chats: '1' } as any);

    cy.stub(AIReact, 'useChat').returns({
      messages: [],
      setMessages: cy.stub(),
      input: '',
      handleInputChange: cy.stub(),
      handleSubmit: cy.stub(),
      status: 'ready',
      stop: cy.stub(),
      reload: cy.stub(),
    } as any);

    cy.stub(TRPC.api.chat.getChat, 'useQuery').returns({ data: { heartLevel: 2, relationship: 'FRIEND', name: 'Alice' }, isLoading: false, isError: false } as any);
    cy.stub(TRPC.api.messages.getChatMessages, 'useQuery').returns({ data: [], isLoading: false } as any);
    cy.stub(TRPC.api.messages.saveMessage, 'useMutation').returns({ mutate: cy.stub() } as any);

    cy.stub(Jotai, 'useAtomValue').returns({ chatData: { heartLevel: 2, relationship: 'FRIEND', name: 'Alice' } } as any);
    cy.stub(UpdateProfileModule, 'default').callsFake(MockUpdateProfile);
    cy.stub(Uploadthing, 'UploadDropzone').callsFake(MockUpload);
  });

  it('displays profile name from data', () => {
    cy.mount(<ChatHome />);
    cy.contains('Alice').should('be.visible');
  });
});
