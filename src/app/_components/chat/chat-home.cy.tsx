import React from 'react';
import ChatHome from './chat-home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api } from '~/trpc/react';
import * as aiSdkReact from '@ai-sdk/react'; // For mocking useChat
import * as Sonner from 'sonner'; // For mocking toast

// Default mock data
const mockChatData = {
  id: 'test-chat-id',
  heartLevel: 3,
  name: 'Wally',
  relationship: 'FRIENDLY',
  // Add other fields from prisma schema if ChatHome uses them directly (already covered by 'name', 'relationship', 'heartLevel')
  // birthDate, race, country, language, createdAt, updatedAt, userId, model, provider, providerId
};

const mockTrpcGetChatData = { // What api.chat.getChat.useQuery would return
    ...mockChatData,
    birthDate: new Date(),
    race: 'ROBOT',
    country: 'CYBERSPACE',
    language: 'BINARY',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user_test',
    model: 'gpt-test',
    provider: 'test-ai',
    providerId: 'test-provider-id'
};


const initialMockMessages: aiSdkReact.Message[] = [
  { id: '1', content: 'Hello from user', role: 'user', createdAt: new Date() },
  { id: '2', content: 'Hello from assistant', role: 'assistant', createdAt: new Date() },
];

// Mock tRPC provider
const createMockTrpcContext = (customChatData?: any, customMessages?: any[], getChatError?: Error) => {
  const chatDataToResolve = customChatData !== undefined ? customChatData : mockTrpcGetChatData;
  const messagesToResolve = customMessages !== undefined ? customMessages : initialMockMessages.map(m => ({...m, files: []})); // getChatMessages expects files array

  return {
    chat: {
      getChat: cy.stub().as('getChat').callsFake(() => ({
        data: getChatError ? undefined : chatDataToResolve,
        isLoading: false,
        isError: !!getChatError,
        error: getChatError,
      })),
    },
    messages: {
      getChatMessages: cy.stub().as('getChatMessages').resolves(messagesToResolve),
      saveMessage: cy.stub().as('saveMessage').resolves({}),
    },
  };
};

// Mock next/navigation
const mockRouter = {
  replace: cy.stub().as('routerReplace'),
  push: cy.stub().as('routerPush'),
};
const mockParams = (chatId: string | string[] = 'test-chat-id') => ({
  chats: chatId,
});


// Mock useChat hook
const mockUseChatDefaults = {
  messages: initialMockMessages,
  input: '',
  handleInputChange: cy.stub().as('handleInputChange'),
  handleSubmit: cy.stub().as('handleSubmitUseChat'),
  status: 'ready' as const, // 'ready', 'streaming', 'submitted'
  stop: cy.stub().as('stopUseChat'),
  reload: cy.stub().as('reloadUseChat'),
  setMessages: cy.stub().as('setMessagesUseChat'),
  isLoading: false, // Added based on useChat actual return type
  error: undefined, // Added
  data: undefined, // Added
  append: cy.stub().as('appendUseChat'), // Added
  setBody: cy.stub().as('setBodyUseChat'), // Added
  setHeaders: cy.stub().as('setHeadersUseChat'), // Added
  setInput: cy.stub().as('setInputUseChat'), // Added
};

let currentUseChatMock = { ...mockUseChatDefaults };
const useChatStub = cy.stub().callsFake(() => currentUseChatMock);

// Mock toast
const mockToastError = cy.stub().as('toastError');

const TestWrapper: React.FC<{
  children: React.ReactNode;
  chatId?: string | string[];
  trpcOverrides?: Partial<ReturnType<typeof createMockTrpcContext>>;
  getChatError?: Error;
}> = ({ children, chatId = 'test-chat-id', trpcOverrides, getChatError }) => {
  const queryClient = new QueryClient();
  const mockTrpcInstance = createMockTrpcContext(
    trpcOverrides?.chat?.getChat.getMockImplementation()?.()?.data, // allow override
    trpcOverrides?.messages?.getChatMessages.getMockImplementation()?.()?.data,
    getChatError
  );

  return (
    // @ts-expect-error -- tRPC mock is simplified
    <api.Provider client={{...mockTrpcInstance, ...trpcOverrides}} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </api.Provider>
  );
};

describe('<ChatHome />', () => {
  beforeEach(() => {
    // Reset useChat mock before each test
    currentUseChatMock = { ...mockUseChatDefaults, messages: [...initialMockMessages] }; // Ensure messages are fresh
    currentUseChatMock.handleInputChange.resetHistory();
    currentUseChatMock.handleSubmit.resetHistory();
    currentUseChatMock.stop.resetHistory();


    cy.stub(require('next/navigation'), 'useRouter').returns(mockRouter);
    cy.stub(require('next/navigation'), 'useParams').callsFake(() => mockParams()); // Default params

    // Mock Jotai
    const mockFocusedChatDataResult = { chatData: mockChatData };
    cy.stub(require('jotai'), 'useAtomValue').returns(mockFocusedChatDataResult); // Default mock
    cy.stub(require('../atoms'), 'useMemoChatData').returns(cy.stub().returns(mockFocusedChatDataResult));

    // Mock UploadDropzone
    cy.stub(require('~/lib/uploadthing'), 'UploadDropzone').returns(() => <div data-cy="mock-upload-dropzone">UploadDropzone Mock</div>);

    // Mock @ai-sdk/react's useChat hook
    cy.stub(aiSdkReact, 'useChat').callsFake(useChatStub);

    // Mock sonner's toast
    cy.stub(Sonner, 'toast', { error: mockToastError });
    mockToastError.resetHistory();
    mockRouter.replace.resetHistory();
  });

  it('mounts successfully and renders initial profile and UI elements', () => {
    cy.mount(<TestWrapper><ChatHome /></TestWrapper>);
    cy.get('[data-cy=chat-home-root]').should('be.visible');
    cy.get('[data-cy=profile-name]').should('contain', mockChatData.name);
    cy.get('[data-cy=profile-relationship]').should('contain', 'Friendly'); // From enumToLabel
    cy.get('[data-cy=hearts-container]').find('svg').should('have.length', 5); // 3 red, 2 gray
    cy.get('[data-cy=messages-scroll-area]').should('be.visible');
    cy.get('[data-cy=message-input]').should('be.visible').and('have.attr', 'placeholder', 'Send a Message to Wally');
    cy.get('[data-cy=send-button]').should('be.visible');
    cy.get('[data-cy=mock-upload-dropzone"]').should('be.visible');
  });

  it('renders messages from useChat hook', () => {
    currentUseChatMock.messages = [
        { id: 'm1', role: 'user', content: 'Test user msg', createdAt: new Date() },
        { id: 'm2', role: 'assistant', content: 'Test assistant msg', createdAt: new Date() }
    ];
    cy.mount(<TestWrapper><ChatHome /></TestWrapper>);
    cy.get('[data-cy="message-content-html-m1"]').should('contain.html', '<p>Test user msg</p>');
    cy.get('[data-cy="message-content-html-m2"]').should('contain.html', '<p>Test assistant msg</p>');
  });

  it('allows typing in message input and calls useChat.handleInputChange', () => {
    cy.mount(<TestWrapper><ChatHome /></TestWrapper>);
    cy.get('[data-cy=message-input]').type('Hello there');
    cy.get('@handleInputChange').should('have.been.called');
    // To check value, need to make useChat.input reactive to handleInputChange calls
    currentUseChatMock.input = 'Hello there'; // Simulate state update
    cy.mount(<TestWrapper><ChatHome /></TestWrapper>); // Remount to reflect new input state
    cy.get('[data-cy=message-input]').should('have.value', 'Hello there');
  });

  it('shows emotion dropdown on send button click and selects an emotion', () => {
    cy.mount(<TestWrapper><ChatHome /></TestWrapper>);
    cy.get('[data-cy=emotion-dropdown-trigger]').click(); // This is the send button
    cy.get('[data-cy=emotion-dropdown-menu]').should('be.visible');
    cy.get('[data-cy=emotion-item-joyful]').click();
    // Check if handleSubmit was called (or state for it was set)
    // This requires handleEmotionSubmit to eventually call useChat.handleSubmit
    // For now, we assert that saveMessage was called (part of handleEmotionSubmit logic)
    // and useChat.handleSubmit was called by the useEffect
    cy.get('@saveMessage').should('have.been.called');
    cy.get('@handleSubmitUseChat').should('have.been.called');
  });

  it('shows stop button when status is "streaming" and calls stop on click', () => {
    currentUseChatMock.status = 'streaming';
    cy.mount(<TestWrapper><ChatHome /></TestWrapper>);
    cy.get('[data-cy=stop-button]').should('be.visible').click();
    cy.get('@stopUseChat').should('have.been.called');
    cy.get('[data-cy=send-button]').should('not.exist');
  });

  it('shows stop button when status is "submitted"', () => {
    currentUseChatMock.status = 'submitted';
    cy.mount(<TestWrapper><ChatHome /></TestWrapper>);
    cy.get('[data-cy=stop-button]').should('be.visible');
    cy.get('[data-cy=send-button]').should('not.exist');
  });


  it('handles error when fetching chat details', () => {
    const error = new Error("Failed to fetch chat");
    // Override useParams for this test to use a specific chat ID for error message check
    cy.stub(require('next/navigation'), 'useParams').returns(mockParams("error-chat-id"));

    cy.mount(
      <TestWrapper chatId="error-chat-id" getChatError={error} trpcOverrides={{
        chat: {
            // @ts-expect-error -- simplified mock
            getChat: cy.stub().as('getChatErrorCase').returns({ data: undefined, isLoading: false, isError: true, error })
        },
      }}>
        <ChatHome />
      </TestWrapper>
    );
    cy.get('@routerReplace').should('have.been.calledWith', '/');
    cy.get('@toastError').should('have.been.calledWith', 'Unable to load conversation error-chat-id');
  });

  it('correctly displays number of red and gray hearts', () => {
    const specificChatData = { ...mockChatData, heartLevel: 2 };
     // Mock Jotai for this specific case
    const mockFocusedChatDataResult = { chatData: specificChatData };
    cy.stub(require('jotai'), 'useAtomValue').returns(mockFocusedChatDataResult);
    cy.stub(require('../atoms'), 'useMemoChatData').returns(cy.stub().returns(mockFocusedChatDataResult));


    cy.mount(
        <TestWrapper trpcOverrides={{
            // @ts-expect-error -- simplified mock
            chat: { getChat: cy.stub().resolves({ data: {...mockTrpcGetChatData, heartLevel: 2}, isLoading: false, isError: false}) }
        }}>
            <ChatHome />
        </TestWrapper>
    );
    cy.get('[data-cy=hearts-container]').children().should('have.length', 5);
    // Count red hearts (style attribute)
    cy.get('[data-cy=hearts-container]').children().filter('[style="color: black;"]').should('have.length', 2); // Assuming heartLevel 2 maps to 'black'
    // Count gray hearts (class)
    cy.get('[data-cy=hearts-container]').children('.text-gray-500').should('have.length', 3);
  });
});
```
