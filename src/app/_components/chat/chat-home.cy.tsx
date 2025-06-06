import React from 'react';
import ChatHome from './chat-home'; // Adjust the import path if necessary
import { ChatMessage } from '~/app/_components/message/chat-message'; // Assuming this is the correct path
import { ScrollArea } from '~/components/ui/scroll-area'; // Assuming this is the correct path
import { Button } from '@components/ui/button'; // Assuming this is the correct path
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@components/ui/dropdown-menu'; // Assuming this is the correct path
import { Heart, StopCircle } from 'lucide-react';
import { api } from '~/trpc/react'; // For mocking
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the api calls and other external dependencies
// This is a simplified mock, you might need a more complex setup depending on the actual usage
const mockChatData = {
  heartLevel: 3,
  name: 'Wally',
  relationship: 'FRIENDLY',
  id: 'test-chat-id',
};

const mockMessages = [
  { id: '1', content: 'Hello', role: 'user' as const },
  { id: '2', content: 'Hi there!', role: 'assistant' as const, experimental_attachments: [] },
];

// Mock tRPC provider
const createMockTrpcContext = (chatId?: string) => ({
  chat: {
    getChat: cy.stub().as('getChat').resolves(chatId ? mockChatData : null),
  },
  messages: {
    getChatMessages: cy.stub().as('getChatMessages').resolves(chatId ? mockMessages : []),
    saveMessage: cy.stub().as('saveMessage').resolves({}),
  },
  // Add other procedures if ChatHome uses them
});

// Mock next/navigation
const mockRouter = {
  replace: cy.stub().as('routerReplace'),
  push: cy.stub().as('routerPush'),
  // Add other router methods if needed
};
const mockParams = {
  chats: 'test-chat-id',
};

// Mock jotai atoms if they are critical for rendering
// For simplicity, we'll assume they have default values or are not critical for initial render tests

const TestWrapper: React.FC<{ children: React.ReactNode; chatId?: string }> = ({ children, chatId }) => {
  const queryClient = new QueryClient();
  // @ts-expect-error - Simplified mock
  const mockTrpc = createMockTrpcContext(chatId);

  return (
    // @ts-expect-error - Simplified mock
    <api.Provider client={mockTrpc} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </api.Provider>
  );
};

describe('<ChatHome />', () => {
  beforeEach(() => {
    // Mock next/navigation
    cy.stub(require('next/navigation'), 'useRouter').returns(mockRouter);
    cy.stub(require('next/navigation'), 'useParams').returns(mockParams);

    // Mock jotai's useAtomValue and useMemoChatData if necessary
    // This is highly dependent on how these atoms are structured and used.
    // For now, we'll provide a basic mock.
    const mockFocusedChatData = {
      chatData: mockChatData,
      // other properties if any
    };
    cy.stub(require('jotai'), 'useAtomValue').returns(mockFocusedChatData);
    cy.stub(require('../atoms'), 'useMemoChatData').returns(cy.stub().returns(mockFocusedChatData));


    // Mock UploadDropzone as it's an external component
    cy.stub(require('~/lib/uploadthing'), 'UploadDropzone').returns(() => <div data-testid="mock-upload-dropzone"></div>);
  });

  it('mounts successfully with mocked providers and data', () => {
    cy.mount(
      <TestWrapper chatId="test-chat-id">
        <ChatHome />
      </TestWrapper>
    );
    cy.get('h2').should('contain', 'Wally'); // Check if name is rendered
  });

  it('renders profile information correctly', () => {
    cy.mount(
      <TestWrapper chatId="test-chat-id">
        <ChatHome />
      </TestWrapper>
    );
    cy.get('h2').should('contain', 'Wally'); // Name
    cy.get('h3').should('contain', 'Friendly'); // Relationship (assuming enumToLabel works)
    cy.findAllByTestId('lucide-icon-heart').should('have.length.at.least', mockChatData.heartLevel); // Hearts
  });

  it('renders chat messages area', () => {
    cy.mount(
      <TestWrapper chatId="test-chat-id">
        <ChatHome />
      </TestWrapper>
    );
    cy.get('div').find('div[data-radix-scrollarea-viewport]').should('be.visible'); // ScrollArea for messages
    // Check if messages are rendered (this depends on ChatMessage component)
    // cy.contains('Hello').should('be.visible'); // Example for user message
    // cy.contains('Hi there!').should('be.visible'); // Example for assistant message
  });

  it('renders message input textarea', () => {
    cy.mount(
      <TestWrapper chatId="test-chat-id">
        <ChatHome />
      </TestWrapper>
    );
    cy.get('textarea#newMessage')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Send a Message to Wally');
  });

  it('allows typing in the message input', () => {
    cy.mount(
      <TestWrapper chatId="test-chat-id">
        <ChatHome />
      </TestWrapper>
    );
    cy.get('textarea#newMessage')
      .type('Hello, Wally!')
      .should('have.value', 'Hello, Wally!');
  });

  it('renders the send button dropdown', () => {
    cy.mount(
      <TestWrapper chatId="test-chat-id">
        <ChatHome />
      </TestWrapper>
    );
    cy.get('button').contains('Send').should('be.visible');
  });

  it('shows emotion options when send button is clicked', () => {
    cy.mount(
      <TestWrapper chatId="test-chat-id">
        <ChatHome />
      </TestWrapper>
    );
    cy.get('button').contains('Send').click();
    cy.get('[role="menuitem"]').should('have.length.greaterThan', 0);
    cy.get('[role="menuitem"]').contains('joyful').should('be.visible'); // Example emotion
  });

  it('renders the mock UploadDropzone', () => {
    cy.mount(
      <TestWrapper chatId="test-chat-id">
        <ChatHome />
      </TestWrapper>
    );
    cy.get('[data-testid="mock-upload-dropzone"]').should('be.visible');
  });

  // More complex tests for message sending, stopping, etc. would require
  // more detailed mocking of the useChat hook and its interactions.

  // Example: Test for stop button visibility (assuming useChat mock can control status)
  // it('shows stop button when message is streaming', () => {
  //   // Mock useChat to return status 'streaming'
  //   const mockUseChat = {
  //     messages: mockMessages,
  //     input: '',
  //     handleInputChange: cy.stub(),
  //     handleSubmit: cy.stub(),
  //     status: 'streaming' as const, // or 'submitted'
  //     stop: cy.stub().as('stopChat'),
  //     reload: cy.stub(),
  //     setMessages: cy.stub(),
  //   };
  //   cy.stub(require('@ai-sdk/react'), 'useChat').returns(mockUseChat);

  //   cy.mount(
  //     <TestWrapper chatId="test-chat-id">
  //       <ChatHome />
  //     </TestWrapper>
  //   );
  //   cy.get('button').find('svg').parent().should('be.visible'); // StopCircle icon
  //   cy.get('button').find('svg').parent().click();
  //   cy.get('@stopChat').should('have.been.called');
  // });
});
