import React from 'react';
import { ChatMessage } from './chat-message'; // Adjusted import

describe('<ChatMessage />', () => {
  const testContentText = "Hello, world!";
  const TestChildDiv = () => <div data-cy="test-child-div">{testContentText}</div>;

  it('mounts successfully and renders children for a user message', () => {
    cy.mount(
      <ChatMessage isUser={true}>
        <TestChildDiv />
      </ChatMessage>
    );
    cy.get('[data-cy=chat-message-root]').should('be.visible');
    cy.get('[data-cy=test-child-div]').should('be.visible').and('contain.text', testContentText);
  });

  it('mounts successfully and renders children for an assistant message', () => {
    cy.mount(
      <ChatMessage isUser={false}>
        <TestChildDiv />
      </ChatMessage>
    );
    cy.get('[data-cy=chat-message-root]').should('be.visible');
    cy.get('[data-cy=test-child-div]').should('be.visible').and('contain.text', testContentText);
  });

  context('User Messages (isUser={true})', () => {
    beforeEach(() => {
      cy.mount(
        <ChatMessage isUser={true}>
          <TestChildDiv />
        </ChatMessage>
      );
    });

    it('applies user-specific styling to the root element', () => {
      cy.get('[data-cy=chat-message-root]').should('have.class', 'flex-row-reverse');
    });

    it('applies user-specific styling to the message bubble', () => {
      cy.get('[data-cy=chat-message-bubble]')
        .should('have.class', 'bg-[#f5f9ff]')
        .and('have.class', 'rounded-br-none')
        .and('not.have.class', 'rounded-bl-none')
        .and('have.css', 'max-width'); // Check that max-width is set, actual value depends on viewport
        // For more specific max-width:
        // .invoke('css', 'max-width').should('match', /^(60%|calc\(0.6 \* \d+px\))$/);

    });

    it('does not render an avatar for user messages', () => {
      cy.get('[data-cy=chat-message-avatar]').should('not.exist');
    });
  });

  context('Assistant Messages (isUser={false} or default)', () => {
    beforeEach(() => {
      // Test with isUser={false}
      cy.mount(
        <ChatMessage isUser={false}>
          <TestChildDiv />
        </ChatMessage>
      );
    });

    it('applies assistant-specific styling to the root element', () => {
      cy.get('[data-cy=chat-message-root]').should('have.class', 'flex-row')
        .and('not.have.class', 'flex-row-reverse');
    });

    it('applies assistant-specific styling to the message bubble', () => {
      cy.get('[data-cy=chat-message-bubble]')
        .should('have.class', 'bg-[#fafafa]')
        .and('have.class', 'rounded-bl-none')
        .and('not.have.class', 'rounded-br-none');
        // .and('have.css', 'max-width', 'none'); // 'auto' might compute to 'none' or a pixel value
    });

    it('renders an avatar for assistant messages', () => {
      cy.get('[data-cy=chat-message-avatar]').should('be.visible');
      // Check if it's the UserCircle2 icon, e.g., by class if Lucide adds one
      cy.get('[data-cy=chat-message-avatar]').find('svg.lucide-user-circle-2').should('be.visible');
    });

    // Test default behavior (isUser is undefined, should be same as false)
    it('defaults to assistant styling when isUser prop is not provided', () => {
      cy.mount(
        <ChatMessage>
          <TestChildDiv />
        </ChatMessage>
      );
      cy.get('[data-cy=chat-message-root]').should('have.class', 'flex-row');
      cy.get('[data-cy=chat-message-avatar]').should('be.visible');
      cy.get('[data-cy=chat-message-bubble]').should('have.class', 'bg-[#fafafa]');
    });
  });

  it('renders any children passed to it', () => {
    const complexChildren = (
      <div data-cy="complex-child-wrapper">
        <h1 data-cy="complex-h1">Title</h1>
        <p data-cy="complex-p">Paragraph with <strong>strong</strong> text.</p>
        <img data-cy="complex-img" src="fake.jpg" alt="fake" />
      </div>
    );
    cy.mount(<ChatMessage>{complexChildren}</ChatMessage>);
    cy.get('[data-cy=complex-child-wrapper]').should('be.visible');
    cy.get('[data-cy=complex-h1]').should('be.visible');
    cy.get('[data-cy=complex-p]').should('be.visible');
    cy.get('[data-cy=complex-img]').should('be.visible');
  });
});

// Reminder: For these tests to pass reliably, data-cy attributes should be added to ChatMessage.tsx:
// - Root div: data-cy="chat-message-root"
// - Avatar (UserCircle2 icon): data-cy="chat-message-avatar"
// - Message bubble div (wraps children): data-cy="chat-message-bubble"
```
