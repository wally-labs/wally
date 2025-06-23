import { ChatMessage } from './chat-message';
import React from 'react';

describe('<ChatMessage />', () => {
  it('renders assistant style by default', () => {
    cy.mount(
      <ChatMessage>
        <span data-cy="text">hello</span>
      </ChatMessage>
    );
    cy.get('div.flex').first().should('have.class', 'flex-row');
  });

  it('renders user style when isUser', () => {
    cy.mount(
      <ChatMessage isUser>
        <span data-cy="text">hello</span>
      </ChatMessage>
    );
    cy.get('div.flex').first().should('have.class', 'flex-row-reverse');
  });
});
