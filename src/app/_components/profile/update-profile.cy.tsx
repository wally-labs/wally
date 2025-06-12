import React from 'react';
import UpdateProfile from './update-profile';
import { type ProfileFormProps } from './profile-form';
import * as NextNavigation from 'next/navigation';
import * as Sonner from 'sonner';
import { api } from '~/trpc/react';
import * as Jotai from 'jotai';
import { type formSchema as ProfileFormSchema } from '../schema'; // For typing mock data
import { z } from 'zod';


// Mock ProfileForm
const MockProfileForm: React.FC<ProfileFormProps & { isPending?: boolean }> = ({ form, handleSubmit, submitLabel, initialData, isPending }) => {
  const onSubmitClick = () => {
    // Simulate form submission with either initialData (if unchanged) or some mock updated data
    const formDataToSubmit = initialData || { name: "Updated Name", /* other fields */ };
    handleSubmit(formDataToSubmit as z.infer<typeof ProfileFormSchema>);
  };
  return (
    <div data-cy="mock-profile-form">
      <p data-cy="mock-profile-form-initial-data">{initialData ? JSON.stringify(initialData) : 'No initial data'}</p>
      <p data-cy="mock-profile-form-submit-label">{submitLabel}</p>
      {isPending && <div data-cy="mock-profile-form-loading-indicator">Submitting...</div>}
      <button data-cy="mock-profile-form-submit-button" onClick={onSubmitClick} disabled={isPending}>
        {isPending ? "Saving..." : submitLabel} (Mock)
      </button>
    </div>
  );
};

// --- Mocks for Hooks and API ---
const mockUseParams = cy.stub().as('useParamsStub');

// tRPC Mocks
const mockGetChatQuery = cy.stub().as('getChatQuery');
const mockUpdateChatMutate = cy.stub().as('updateChatMutate');
let currentUpdateChatIsPending = false;
const mockUpdateChatMutationHook = cy.stub().callsFake((options) => ({
  mutate: (data: any) => {
    mockUpdateChatMutate(data);
    if (options && typeof options.onSuccess === 'function' && !currentUpdateChatIsPending && !mockUpdateChatMutate.getCall(mockUpdateChatMutate.callCount -1).throws()) {
        // @ts-expect-error
        options.onSuccess({ id: data.chatId, name: data.name, ...data });
    } else if (options && typeof options.onError === 'function' && !currentUpdateChatIsPending && mockUpdateChatMutate.getCall(mockUpdateChatMutate.callCount -1).throws()) {
        // @ts-expect-error
        options.onError(new Error("Simulated mutation error"));
    }
  },
  isPending: currentUpdateChatIsPending,
}));

const mockInvalidateQueries = cy.stub().as('invalidateQueries');
const mockApiUseUtils = cy.stub().returns({
  chat: { getAllChatHeaders: { invalidate: mockInvalidateQueries } },
});

// Jotai Mocks
const mockUseAtomValue = cy.stub().as('useAtomValueStub');
const mockUseMemoChatData = cy.stub().as('useMemoChatDataStub');

// Sonner Toast Mocks
const mockToastSuccess = cy.stub().as('toastSuccess');
const mockToastError = cy.stub().as('toastError');


// --- Test Data ---
const testChatId = 'chat_123_test';
const mockProfileQueryData = {
  id: testChatId,
  name: "Wally Original",
  gender: "MALE",
  birthDate: new Date("1990-01-15T00:00:00.000Z"), // Will be formatted to YYYY-MM-DD by component
  relationship: "FRIENDLY",
  heartLevel: 3,
  race: "ROBOT",
  country: "USA",
  language: "en",
  // other fields from schema...
};
const mockProfileFormData = { // Data as ProfileForm expects it (date formatted)
    ...mockProfileQueryData,
    birthDate: "1990-01-15",
};


describe('<UpdateProfile />', () => {
  beforeEach(() => {
    // Reset all stubs
    mockUseParams.returns({ chats: testChatId });
    mockGetChatQuery.returns({ data: mockProfileQueryData, isLoading: false, isError: false, error: null });
    currentUpdateChatIsPending = false;
    mockUpdateChatMutationHook.returns({ mutate: mockUpdateChatMutate, isPending: currentUpdateChatIsPending });
    mockUseAtomValue.returns(null); // Default to no Jotai data, forcing tRPC load
    mockUseMemoChatData.returns(cy.stub().returns(null)); // useMemoChatData returns a selector, which then returns a value

    mockCreateChatMutate.resetHistory();
    mockUpdateChatMutate.resetHistory();
    mockInvalidateQueries.resetHistory();
    mockToastSuccess.resetHistory();
    mockToastError.resetHistory();

    // Stub dependencies
    cy.stub(NextNavigation, 'useParams').callsFake(mockUseParams);
    cy.stub(Sonner, 'toast', { success: mockToastSuccess, error: mockToastError });
    // @ts-expect-error
    cy.stub(api, 'chat', {
        getChat: { useQuery: mockGetChatQuery },
        updateChat: { useMutation: mockUpdateChatMutationHook }
    });
    // @ts-expect-error
    cy.stub(api, 'useUtils').callsFake(mockApiUseUtils);
    cy.stub(Jotai, 'useAtomValue').callsFake(mockUseAtomValue);
    cy.stub(require('../atoms'), 'useMemoChatData').callsFake(mockUseMemoChatData); // Assuming useMemoChatData is from '../atoms'
  });

  it('mounts, opens dialog, and shows trigger button', () => {
    cy.mount(<UpdateProfile ProfileFormComponent={MockProfileForm} />);
    cy.get('[data-cy=update-profile-dialog-trigger]').should('be.visible').and('contain.text', 'Edit Profile');
  });

  context('Dialog Interactions and Data Loading', () => {
    it('shows loading state for query', () => {
      mockGetChatQuery.returns({ data: undefined, isLoading: true, isError: false, error: null });
      cy.mount(<UpdateProfile ProfileFormComponent={MockProfileForm} />);
      cy.get('[data-cy=update-profile-dialog-trigger]').click();
      cy.get('[data-cy=update-profile-dialog-content]').should('be.visible');
      cy.get('[data-cy=update-profile-loading-query]').should('be.visible').and('contain.text', 'Loading profile...');
      cy.get('[data-cy=profile-form-wrapper]').should('not.exist');
    });

    it('shows error state for query', () => {
      mockGetChatQuery.returns({ data: undefined, isLoading: false, isError: true, error: new Error("Fetch failed") });
      cy.mount(<UpdateProfile ProfileFormComponent={MockProfileForm} />);
      cy.get('[data-cy=update-profile-dialog-trigger]').click();
      cy.get('[data-cy=update-profile-dialog-content]').should('be.visible');
      cy.get('[data-cy=update-profile-error-query]').should('be.visible').and('contain.text', 'Error loading profile.');
      cy.get('[data-cy=profile-form-wrapper]').should('not.exist');
    });

    it('fetches data successfully and passes initialData to MockProfileForm', () => {
      cy.mount(<UpdateProfile ProfileFormComponent={MockProfileForm} />);
      cy.get('[data-cy=update-profile-dialog-trigger]').click();
      cy.get('[data-cy=update-profile-dialog-content]').should('be.visible');
      cy.get('[data-cy=profile-form-wrapper]').should('be.visible');
      cy.get('[data-cy=mock-profile-form]').should('be.visible');
      cy.get('[data-cy=mock-profile-form-initial-data]').should((el) => {
        const data = JSON.parse(el.text());
        expect(data.name).to.equal(mockProfileFormData.name);
        expect(data.birthDate).to.equal(mockProfileFormData.birthDate); // Ensure date is formatted YYYY-MM-DD
      });
      cy.get('[data-cy=mock-profile-form-submit-label]').should('contain.text', 'Update Profile');
    });

     it('prioritizes Jotai atom data if available for initialData', () => {
        const jotaiData = { chatData: { ...mockProfileQueryData, name: "Jotai Wally", birthDate: "2000-05-05" }};
        mockUseAtomValue.returns(jotaiData); // Jotai provides data
        mockGetChatQuery.returns({ data: mockProfileQueryData, isLoading: false, isError: false, error: null }); // tRPC also provides data

        cy.mount(<UpdateProfile ProfileFormComponent={MockProfileForm} />);
        cy.get('[data-cy=update-profile-dialog-trigger]').click();
        cy.get('[data-cy=mock-profile-form-initial-data]').should((el) => {
            const data = JSON.parse(el.text());
            expect(data.name).to.equal("Jotai Wally"); // Jotai data should be prioritized
            expect(data.birthDate).to.equal("2000-05-05");
        });
    });
  });

  context('Form Submission and Mutation States', () => {
    const updatedDataFromForm = { // Data that MockProfileForm "submits"
      name: "Wally Updated",
      gender: "FEMALE",
      birthDate: "1991-02-16", // Will be converted to ISOString by component's onSubmit
      relationship: "COMPANION",
      heartLevel: 5,
      race: "AI",
      country: "CANADA",
      language: "fr",
    };

    beforeEach(() => {
        // Reset relevant stubs that might carry state from other contexts
        mockUpdateChatMutate.resetHistory();
        mockToastSuccess.resetHistory();
        mockToastError.resetHistory();
        mockInvalidateQueries.resetHistory();
        currentUpdateChatIsPending = false; // Ensure pending state is reset
        mockUpdateChatMutationHook.callsFake((options) => ({ // Reset to default behavior for this context
            mutate: (data: any) => {
                mockUpdateChatMutate(data);
                 if (options && typeof options.onSuccess === 'function' && !currentUpdateChatIsPending && !mockUpdateChatMutate.getCall(mockUpdateChatMutate.callCount -1).throws()) {
                    // @ts-expect-error
                    options.onSuccess({ id: data.chatId, name: data.name, ...data });
                } else if (options && typeof options.onError === 'function' && !currentUpdateChatIsPending && mockUpdateChatMutate.getCall(mockUpdateChatMutate.callCount -1).throws()) {
                    // @ts-expect-error
                    options.onError(new Error("Simulated mutation error"));
                }
            },
            isPending: currentUpdateChatIsPending,
        }));
    });


    it('calls updateChat mutation with correct payload when (mocked) form is submitted', () => {
      // MockProfileForm, by default, calls handleSubmit with initialData or a generic "Updated Name"
      // We rely on the fact that UpdateProfile's onSubmit receives this data.
      cy.mount(<UpdateProfile ProfileFormComponent={MockProfileForm} />);
      cy.get('[data-cy=update-profile-dialog-trigger]').click();
      cy.get('[data-cy=mock-profile-form-submit-button]').click();

      // The data submitted by MockProfileForm is `mockProfileQueryData` (passed as initialData)
      // because `UpdateProfile` populates `ProfileForm` with it.
      // The `onSubmit` in `UpdateProfile` then processes this.
      const submittedDataByMock = mockProfileQueryData; // This is what MockProfileForm's handleSubmit will be called with via initialData

      const expectedPayload = {
        chatId: testChatId,
        name: submittedDataByMock.name,
        gender: submittedDataByMock.gender,
        birthDate: new Date(submittedDataByMock.birthDate).toISOString(), // Component's onSubmit converts date
        relationship: submittedDataByMock.relationship,
        heartLevel: submittedDataByMock.heartLevel,
        race: submittedDataByMock.race,
        country: submittedDataByMock.country,
        language: submittedDataByMock.language,
      };
       // Clean undefined as component does (though mockProfileQueryData should be complete)
      Object.keys(expectedPayload).forEach(key => {
        // @ts-expect-error
        if (expectedPayload[key] === "" || expectedPayload[key] === null) expectedPayload[key] = undefined;
      });

      cy.get('@updateChatMutate').should('have.been.calledWith', expectedPayload);
    });

    it('shows success toast and invalidates queries on successful update', () => {
        mockUpdateChatMutationHook.callsFake((options) => ({
            mutate: (data: any) => {
              mockUpdateChatMutate(data);
              // @ts-expect-error
              options.onSuccess({ id: data.chatId, name: data.name, ...data });
            },
            isPending: false,
          }));

      cy.mount(<UpdateProfile ProfileFormComponent={MockProfileForm} />);
      cy.get('[data-cy=update-profile-dialog-trigger]').click();
      cy.get('[data-cy=mock-profile-form-submit-button]').click();

      cy.get('@toastSuccess').should('have.been.calledWith', 'Profile updated successfully!');
      cy.get('@invalidateQueries').should('have.been.called');
    });

    it('shows error toast on failed update', () => {
        mockUpdateChatMutationHook.callsFake((options) => ({
            mutate: (data: any) => {
              mockUpdateChatMutate(data);
              // @ts-expect-error
              options.onError(new Error("Simulated mutation error"), data, undefined);
            },
            isPending: false,
          }));
      cy.mount(<UpdateProfile ProfileFormComponent={MockProfileForm} />);
      cy.get('[data-cy=update-profile-dialog-trigger]').click();
      cy.get('[data-cy=mock-profile-form-submit-button]').click();

      cy.get('@toastError').should('have.been.calledWith', 'Failed to update profile');
    });

    it('passes isPending=true to MockProfileForm when update mutation is in flight', () => {
      currentUpdateChatIsPending = true;
      mockUpdateChatMutationHook.callsFake(() => ({ // Ensure this specific test run gets the updated isPending
        mutate: mockUpdateChatMutate,
        isPending: true,
      }));

      cy.mount(<UpdateProfile ProfileFormComponent={MockProfileForm} />);
      cy.get('[data-cy=update-profile-dialog-trigger]').click();
      // At this point, form is rendered, and isPending from mutation should be true
      cy.get('[data-cy=mock-profile-form-loading-indicator]').should('be.visible');
      cy.get('[data-cy=mock-profile-form-submit-button]').should('be.disabled');
    });
  });
});

// Placeholder for module import if ProfileForm needs to be truly swapped for MockProfileForm
// This is usually handled by bundler aliases in test environment.
const MockProfileForm_module = { default: MockProfileForm };
```
