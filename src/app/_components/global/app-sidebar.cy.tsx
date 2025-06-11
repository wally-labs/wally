import React from 'react';
import AppSidebar from './app-sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api } from '~/trpc/react'; // Mock this
import { useAuth as useClerkAuth } from '@clerk/nextjs'; // Mock this
import { chatDataAtom } from '../atoms'; // Potentially mock or provide initial value
import { Provider as JotaiProvider } from 'jotai';

// Mock Clerk's useAuth
const mockUseAuth = cy.stub();
// Mock next/navigation
const mockUsePathname = cy.stub();
const mockRouterPush = cy.stub().as('routerPush');

// Mock tRPC client
const createMockTrpcContext = (
  chatHeadersData: any[] = [],
  isLoading = false,
  deleteChatMutate = cy.stub().as('deleteChatMutate')
) => {
  return {
    chat: {
      getAllChatHeaders: {
        useQuery: cy.stub().returns({
          data: chatHeadersData,
          isLoading: isLoading,
          isError: false,
          // ... other query states if needed
        }),
      },
      deleteChat: {
        useMutation: cy.stub().returns({
          mutate: deleteChatMutate,
          // ... other mutation states if needed
        }),
      },
    },
    useUtils: () => ({
      chat: {
        getAllChatHeaders: {
          invalidate: cy.stub().as('invalidateChatHeaders'),
        },
      },
    }),
    // Add other procedures if AppSidebar uses them
  };
};

// Mock children components that might be passed
const MockUserButton = () => <div data-cy="mock-user-button">UserButton</div>;
const MockOrgSwitcher = () => <div data-cy="mock-org-switcher">OrgSwitcher</div>;

const TestWrapper: React.FC<{
  children: React.ReactNode;
  mockTrpc?: any; // Allow passing custom tRPC mock
  initialAtomValues?: any; // For Jotai
}> = ({ children, mockTrpc, initialAtomValues }) => {
  const queryClient = new QueryClient();
  const trpcClient = mockTrpc || createMockTrpcContext(); // Default mock

  return (
    <JotaiProvider> {/* Wrap with Jotai Provider */}
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </api.Provider>
    </JotaiProvider>
  );
};

describe('<AppSidebar />', () => {
  beforeEach(() => {
    // Stub Clerk's useAuth
    cy.stub(require('@clerk/nextjs'), 'useAuth').callsFake(mockUseAuth);
    mockUseAuth.returns({ isSignedIn: true, userId: 'test-user-id' }); // Default to signed in

    // Stub next/navigation
    cy.stub(require('next/navigation'), 'usePathname').callsFake(mockUsePathname);
    cy.stub(require('next/navigation'), 'useRouter').returns({ push: mockRouterPush });
    mockUsePathname.returns('/'); // Default path

    // Provide initial value for chatDataAtom if necessary, or rely on API mock
    // For example, to set an initial value for an atom:
    // cy.stub(require('../atoms'), 'chatDataAtom').value(yourInitialAtomValue);
    // Or wrap with Jotai Provider and use initialValues prop if supported by your setup
  });

  it('mounts successfully with children', () => {
    cy.mount(
      <TestWrapper>
        <AppSidebar>
          <MockUserButton />
          <MockOrgSwitcher />
        </AppSidebar>
      </TestWrapper>
    );
    cy.get('[data-cy="app-sidebar"]').should('be.visible');
    cy.get('[data-cy="mock-user-button"]').should('be.visible');
    cy.get('[data-cy="mock-org-switcher"]').should('be.visible');
  });

  it('renders static navigation links', () => {
    cy.mount(
      <TestWrapper>
        <AppSidebar><div>Children</div></AppSidebar>
      </TestWrapper>
    );
    cy.get('[data-cy="home-link"]').should('be.visible').and('have.attr', 'href', '/');
    cy.get('[data-cy="new-chat-link"]').should('be.visible'); // href depends on auth
    cy.get('[data-cy="upgrade-plan-link"]').should('be.visible').and('have.attr', 'href', '/plans');
  });

  it('renders "New Chat" link to "/create-chat" when signed in', () => {
    mockUseAuth.returns({ isSignedIn: true, userId: 'test-user-id' });
    cy.mount(
      <TestWrapper>
        <AppSidebar><div>Children</div></AppSidebar>
      </TestWrapper>
    );
    cy.get('[data-cy="new-chat-link"]').should('have.attr', 'href', '/create-chat');
  });

  it('renders "New Chat" link to "/plans" when not signed in', () => {
    mockUseAuth.returns({ isSignedIn: false, userId: null });
    cy.mount(
      <TestWrapper>
        <AppSidebar><div>Children</div></AppSidebar>
      </TestWrapper>
    );
    cy.get('[data-cy="new-chat-link"]').should('have.attr', 'href', '/plans');
  });

  it('shows loading skeleton when chat headers are loading', () => {
    const mockTrpc = createMockTrpcContext([], true); // isLoading = true
    cy.mount(
      <TestWrapper mockTrpc={mockTrpc}>
        <AppSidebar><div>Children</div></AppSidebar>
      </TestWrapper>
    );
    cy.get('[data-cy="sidebar-menu-skeleton"]').should('be.visible');
  });

  const mockChats = [
    { id: 'chat1', chatData: { chatHeader: 'Chat with Alice' }, updatedAt: new Date().toISOString(), birthDate: new Date().toISOString(), race: 'Human', country: 'USA' },
    { id: 'chat2', chatData: { chatHeader: 'Conversation with Bob' }, updatedAt: new Date().toISOString(), birthDate: new Date().toISOString(), race: 'Elf', country: 'Canada'  },
  ];

  it('renders list of chats when data is available', () => {
    const mockTrpc = createMockTrpcContext(mockChats.map(c => ({...c, name: c.chatData.chatHeader })));
    cy.mount(
      <TestWrapper mockTrpc={mockTrpc}>
        <AppSidebar><div>Children</div></AppSidebar>
      </TestWrapper>
    );
    cy.get('[data-cy="chat-list-item-chat1"]').should('be.visible').and('contain', 'Chat with Alice');
    cy.get('[data-cy="chat-list-item-chat2"]').should('be.visible').and('contain', 'Conversation with Bob');
  });

  it('opens chat delete confirmation dialog when delete is clicked', () => {
    const mockTrpc = createMockTrpcContext(mockChats.map(c => ({...c, name: c.chatData.chatHeader })));
    cy.mount(
      <TestWrapper mockTrpc={mockTrpc}>
        <AppSidebar><div>Children</div></AppSidebar>
      </TestWrapper>
    );
    cy.get('[data-cy="chat-actions-chat1"]').click();
    cy.get('[data-cy="delete-chat-menu-item-chat1"]').click();
    cy.get('[data-cy="alert-dialog-title"]').should('be.visible').and('contain', 'Are you sure you want to delete this chat?');
  });

  it('calls delete mutation when deletion is confirmed', () => {
    const deleteChatStub = cy.stub().as('deleteChatMutate');
    const mockTrpc = createMockTrpcContext(mockChats.map(c => ({...c, name: c.chatData.chatHeader })), false, deleteChatStub);

    cy.mount(
      <TestWrapper mockTrpc={mockTrpc}>
        <AppSidebar><div>Children</div></AppSidebar>
      </TestWrapper>
    );
    cy.get('[data-cy="chat-actions-chat1"]').click();
    cy.get('[data-cy="delete-chat-menu-item-chat1"]').click();
    cy.get('[data-cy="alert-dialog-confirm-button"]').click();
    cy.get('@deleteChatMutate').should('have.been.calledWith', { chatId: 'chat1' });
  });

  // Note: Active link highlighting is not explicitly implemented with usePathname in the provided component code.
  // If it were, tests similar to the initial boilerplate would be added here.
  // Example:
  // it('highlights the active link based on the current path', () => {
  //   mockUsePathname.returns('/chats/chat1');
  //   const mockTrpc = createMockTrpcContext(mockChats);
  //   cy.mount(
  //     <TestWrapper mockTrpc={mockTrpc}>
  //       <AppSidebar><div>Children</div></AppSidebar>
  //     </TestWrapper>
  //   );
  //   cy.get('[data-cy="chat-link-chat1"]').should('have.class', 'active-class'); // Replace 'active-class'
  // });

});

// Reminder: data-cy attributes need to be added to app-sidebar.tsx for these tests to pass.
// Examples:
// - Main sidebar container: data-cy="app-sidebar"
// - Links: data-cy="home-link", data-cy="new-chat-link", data-cy="upgrade-plan-link", data-cy="chat-link-{chat.id}"
// - Chat items: data-cy="chat-list-item-{chat.id}"
// - Chat item actions trigger: data-cy="chat-actions-{chat.id}"
// - Chat item delete menu item: data-cy="delete-chat-menu-item-{chat.id}"
// - Loading skeleton: data-cy="sidebar-menu-skeleton" (already in component?)
// - Alert dialog: data-cy="alert-dialog-title", data-cy="alert-dialog-confirm-button"
// - Mock children: data-cy="mock-user-button", data-cy="mock-org-switcher" (already in this test file)
// The SidebarMenuSkeleton component seems to be used, its internal structure might provide a class or role for selection,
// or it could also benefit from a data-cy attribute.
// The SidebarMenuItem and SidebarMenuButton components are generic; specific data-cy attributes will be needed on instances of them.
// For example, the link for a specific chat: <Link href={`/chats/${chat.id}`} data-cy={`chat-link-${chat.id}`}>
// The dropdown menu items (Edit, Delete) will also need data-cy attributes.
// e.g. <DropdownMenuItem data-cy={`delete-chat-menu-item-${chat.id}`}>
// The AlertDialog buttons (Cancel, Continue) will also need data-cy.
// e.g. <AlertDialogAction data-cy="alert-dialog-confirm-button">
// <AlertDialogCancel data-cy="alert-dialog-cancel-button">
// The children passed to AppSidebar (UserButton, OrgSwitcher) are mocked here with data-cy.
// The actual UserButton and OrgSwitcher would need those attributes if we weren't mocking them.
// The SidebarGroupAction for "New Chat" (the one with MessageCircle icon) could also have a data-cy.
// e.g. <SidebarGroupAction title="New Chat" data-cy="quick-new-chat-button">
// This would be for the icon button, distinct from the "New Chat" link at the bottom of the list.
```
