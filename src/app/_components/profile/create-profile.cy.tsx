import React from 'react';
import CreateProfile from './create-profile';
import { type ProfileFormProps } from './profile-form'; // Import the actual props type
import * as NextNavigation from 'next/navigation';
import * as Sonner from 'sonner';
import { api } from '~/trpc/react';
import { z } from 'zod'; // To use formSchema for mock data
import { formSchema } from '../schema'; // Actual schema

// Mock data that matches the formSchema structure
const mockValidFormData: z.infer<typeof formSchema> = {
  name: "Wally Testington",
  gender: "MALE",
  birthDate: "1995-05-10",
  relationship: "FRIENDLY",
  heartLevel: 4,
  race: "ROBOT",
  country: "CYBERTRON",
  language: "BINARY",
  // Ensure all non-optional fields from formSchema are included
};

// Define a mock for ProfileForm
const MockProfileForm: React.FC<ProfileFormProps & { isPending?: boolean }> = ({ form, handleSubmit, submitLabel, isPending }) => {
  const onSubmitClick = () => {
    // In a real scenario, form.getValues() would be used by ProfileForm.
    // Here, we simulate handleSubmit being called with data that CreateProfile expects.
    // The actual data transformation based on form input is ProfileForm's responsibility.
    // CreateProfile's onSubmit receives the Zod-validated values.
    handleSubmit(mockValidFormData);
  };

  return (
    <div data-cy="mock-profile-form">
      <h3 data-cy="mock-profile-form-submit-label">{submitLabel}</h3>
      {isPending && <div data-cy="mock-profile-form-loading-indicator">Submitting...</div>}
      <button data-cy="mock-profile-form-submit-button" onClick={onSubmitClick} disabled={isPending}>
        {submitLabel} (Mock)
      </button>
    </div>
  );
};

// Mock tRPC's useMutation and useUtils
const mockCreateChatMutate = cy.stub().as('createChatMutate');
const mockInvalidateQueries = cy.stub().as('invalidateQueries');

let currentIsPending = false; // To control isPending state for tests
const mockUseMutation = cy.stub().callsFake((options) => ({
  mutate: (data: any) => {
    mockCreateChatMutate(data); // Call the stub so we can assert it
    if (options && typeof options.onSuccess === 'function' && !currentIsPending && !mockCreateChatMutate.getCall(mockCreateChatMutate.callCount -1).throws()) {
        // @ts-expect-error - if it throws, data might not be there
        options.onSuccess({ id: 'new-chat-id-123', name: data.chatHeader, ...data });
    } else if (options && typeof options.onError === 'function' && !currentIsPending && mockCreateChatMutate.getCall(mockCreateChatMutate.callCount -1).throws()) {
        // @ts-expect-error
        options.onError(new Error("Simulated mutation error"));
    }
  },
  isPending: currentIsPending,
}));


const mockApiUseUtils = cy.stub().returns({
  chat: {
    getAllChatHeaders: {
      invalidate: mockInvalidateQueries,
    },
  },
});

// Mock next/navigation
const mockRouterPush = cy.stub().as('routerPush');

// Mock sonner
const mockToastSuccess = cy.stub().as('toastSuccess');
const mockToastError = cy.stub().as('toastError');

describe('<CreateProfile />', () => {
  beforeEach(() => {
    currentIsPending = false; // Reset isPending for each test
    cy.stub(NextNavigation, 'useRouter').returns({ push: mockRouterPush });
    cy.stub(Sonner, 'toast', { success: mockToastSuccess, error: mockToastError });

    // @ts-expect-error - api structure is complex
    cy.stub(api, 'chat', { createChat: { useMutation: mockUseMutation } });
    // @ts-expect-error
    cy.stub(api, 'useUtils').callsFake(mockApiUseUtils);

    mockCreateChatMutate.resetHistory();
    mockInvalidateQueries.resetHistory();
    mockRouterPush.resetHistory();
    mockToastSuccess.resetHistory();
    mockToastError.resetHistory();
  });

  it('mounts successfully and renders the mocked ProfileForm', () => {
    cy.mount(<CreateProfile ProfileFormComponent={MockProfileForm} />);
    cy.get('[data-cy=create-profile-root]').should('be.visible');
    cy.get('[data-cy=mock-profile-form]').should('be.visible');
    cy.get('[data-cy=mock-profile-form-submit-label]').should('contain.text', 'Create Profile');
  });

  it('calls createChat mutation with processed values when (mocked) form is submitted', () => {
    cy.mount(<CreateProfile ProfileFormComponent={MockProfileForm} />);
    cy.get('[data-cy=mock-profile-form-submit-button]').click();

    const expectedMutationPayload = {
      chatHeader: mockValidFormData.name,
      ...mockValidFormData,
    };
    // Remove undefined fields as per component's onSubmit logic
    Object.keys(expectedMutationPayload).forEach(key => {
        // @ts-expect-error -- dynamic keys
      if (expectedMutationPayload[key] === "") {
        // @ts-expect-error
        expectedMutationPayload[key] = undefined;
      }
    });

    cy.get('@createChatMutate').should('have.been.calledWith', expectedMutationPayload);
  });

  it('shows success toast, invalidates queries, and redirects on successful creation', () => {
    // Configure mutate to call onSuccess
    mockUseMutation.callsFake((options) => ({
        mutate: (data: any) => {
          mockCreateChatMutate(data); // Still track the call
          // @ts-expect-error
          options.onSuccess({ id: 'new-chat-id-123', name: data.chatHeader, ...data });
        },
        isPending: false,
      }));

    cy.mount(<CreateProfile ProfileFormComponent={MockProfileForm} />);
    cy.get('[data-cy=mock-profile-form-submit-button]').click();

    cy.get('@toastSuccess').should('have.been.calledWith', `Profile for ${mockValidFormData.name} created successfully!`);
    cy.get('@invalidateQueries').should('have.been.called');
    cy.get('@routerPush').should('have.been.calledWith', `/chats/new-chat-id-123`);
  });

  it('shows error toast on failed creation', () => {
     // Configure mutate to call onError
     mockUseMutation.callsFake((options) => ({
        mutate: (data: any) => {
          mockCreateChatMutate(data); // Still track the call
          // @ts-expect-error
          options.onError(new Error("Simulated mutation error"), data, undefined);
        },
        isPending: false,
      }));

    cy.mount(<CreateProfile ProfileFormComponent={MockProfileForm} />);
    cy.get('[data-cy=mock-profile-form-submit-button]').click();

    cy.get('@toastError').should('have.been.calledWith', 'Failed to create profile!');
    cy.get('@routerPush').should('not.have.been.called');
    cy.get('@invalidateQueries').should('not.have.been.called');
  });

  it('passes isPending=true to ProfileForm when mutation is in flight', () => {
    currentIsPending = true; // Set the mock hook to return isPending: true
     mockUseMutation.callsFake(() => ({ // Ensure this specific test run gets the updated isPending
        mutate: mockCreateChatMutate,
        isPending: true,
    }));

    cy.mount(<CreateProfile ProfileFormComponent={MockProfileForm} />);

    cy.get('[data-cy=mock-profile-form]').should('be.visible');
    cy.get('[data-cy=mock-profile-form-loading-indicator]').should('be.visible').and('contain.text', 'Submitting...');
    cy.get('[data-cy=mock-profile-form-submit-button]').should('be.disabled');
  });

  it('passes isPending=false to ProfileForm when mutation is not in flight', () => {
    currentIsPending = false; // Explicitly set for clarity
    mockUseMutation.callsFake(() => ({
        mutate: mockCreateChatMutate,
        isPending: false,
    }));

    cy.mount(<CreateProfile ProfileFormComponent={MockProfileForm} />);

    cy.get('[data-cy=mock-profile-form]').should('be.visible');
    cy.get('[data-cy=mock-profile-form-loading-indicator]').should('not.exist');
    cy.get('[data-cy=mock-profile-form-submit-button]').should('not.be.disabled');
  });
});
```
