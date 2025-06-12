import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileForm, type ProfileFormProps } from './profile-form';
import { formSchema, type FormValues } from '../schema'; // Assuming FormValues is exported or defined based on formSchema
import {
  genderOptions,
  relationshipOptions,
  raceOptions,
  countryOptions,
  languageOptions,
} from '../constants/enums';

// Helper component to wrap ProfileForm with react-hook-form logic for testing
const TestFormWrapper: React.FC<Partial<ProfileFormProps> & { initialData?: Partial<FormValues> }> = ({
  handleSubmit: onSaveSpy,
  submitLabel = "Test Submit",
  isPending = false,
  initialData,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      gender: undefined, // Default to undefined to show placeholder
      birthDate: "",
      relationship: undefined,
      heartLevel: 1, // Default as per schema
      race: undefined,
      country: undefined,
      language: undefined,
    },
  });

  return (
    <ProfileForm
      form={form}
      handleSubmit={onSaveSpy || cy.stub().as('onSaveSpy')}
      submitLabel={submitLabel}
      isPending={isPending}
    />
  );
};

describe('<ProfileForm />', () => {
  const onSaveSpy = cy.spy().as('onSaveSpy');

  beforeEach(() => {
    // Reset spy before each test
    onSaveSpy.resetHistory();
  });

  it('mounts successfully and renders all form fields', () => {
    cy.mount(<TestFormWrapper handleSubmit={onSaveSpy} />);
    cy.get('[data-cy=profile-form-card]').should('be.visible');
    cy.get('[data-cy=profile-form-title]').should('contain.text', 'Tell Me About Them');
    cy.get('[data-cy=name-input]').should('be.visible');
    cy.get('[data-cy=gender-select-trigger]').should('be.visible');
    cy.get('[data-cy=birthdate-input]').should('be.visible');
    cy.get('[data-cy=relationship-select-trigger]').should('be.visible');
    cy.get('[data-cy=heartlevel-select-trigger]').should('be.visible');
    cy.get('[data-cy=race-select-trigger]').should('be.visible');
    cy.get('[data-cy=country-select-trigger]').should('be.visible');
    cy.get('[data-cy=language-combobox-trigger]').should('be.visible');
    cy.get('[data-cy=profile-form-submit-button]').should('be.visible').and('contain.text', 'Test Submit');
  });

  context('Initial Data and Default Values', () => {
    it('renders with default empty/placeholder values when no initialData is provided', () => {
      cy.mount(<TestFormWrapper handleSubmit={onSaveSpy} />);
      cy.get('[data-cy=name-input]').should('have.value', '');
      cy.get('[data-cy=gender-select-trigger]').should('contain.text', 'Select a gender'); // Placeholder text
      cy.get('[data-cy=birthdate-input]').should('have.value', '');
      cy.get('[data-cy=relationship-select-trigger]').should('contain.text', 'Select a relationship type');
      cy.get('[data-cy=heartlevel-select-trigger]').should('not.contain.text', '1'); // Default value is set but not shown as placeholder
      cy.get('[data-cy=race-select-trigger]').should('contain.text', 'Select a race');
      cy.get('[data-cy=country-select-trigger]').should('contain.text', 'Select a country');
      cy.get('[data-cy=language-combobox-trigger]').should('contain.text', 'Select language');
    });

    it('renders with initialData when provided', () => {
      const initialData: Partial<FormValues> = {
        name: 'Wally Initial',
        gender: 'MALE',
        birthDate: '1999-12-31',
        relationship: 'COMPANION',
        heartLevel: 3,
        race: 'AI',
        country: 'USA',
        language: 'en',
      };
      cy.mount(<TestFormWrapper initialData={initialData} handleSubmit={onSaveSpy} />);
      cy.get('[data-cy=name-input]').should('have.value', initialData.name);
      cy.get('[data-cy=gender-select-trigger]').should('contain.text', genderOptions.find(opt => opt.value === initialData.gender)?.label);
      cy.get('[data-cy=birthdate-input]').should('have.value', initialData.birthDate);
      cy.get('[data-cy=relationship-select-trigger]').should('contain.text', relationshipOptions.find(opt => opt.value === initialData.relationship)?.label);
      cy.get('[data-cy=heartlevel-select-trigger]').should('contain.text', initialData.heartLevel?.toString());
      cy.get('[data-cy=race-select-trigger]').should('contain.text', raceOptions.find(opt => opt.value === initialData.race)?.label);
      cy.get('[data-cy=country-select-trigger]').should('contain.text', countryOptions.find(opt => opt.value === initialData.country)?.label);
      cy.get('[data-cy=language-combobox-trigger]').should('contain.text', languageOptions.find(opt => opt.value === initialData.language)?.label);
    });
  });

  context('Form Input and Interaction', () => {
    it('allows typing into text input fields', () => {
      cy.mount(<TestFormWrapper handleSubmit={onSaveSpy} />);
      cy.get('[data-cy=name-input]').type('New Name').should('have.value', 'New Name');
      cy.get('[data-cy=birthdate-input]').type('2020-02-02').should('have.value', '2020-02-02');
    });

    it('allows selecting values from Select components', () => {
      cy.mount(<TestFormWrapper handleSubmit={onSaveSpy} />);
      // Gender
      cy.get('[data-cy=gender-select-trigger]').click();
      cy.get('[data-cy="gender-select-item-FEMALE"]').click();
      cy.get('[data-cy=gender-select-trigger]').should('contain.text', 'Female');
      // Heart Level
      cy.get('[data-cy=heartlevel-select-trigger]').click();
      cy.get('[data-cy="heartlevel-select-item-5"]').click();
      cy.get('[data-cy=heartlevel-select-trigger]').should('contain.text', '5');
    });

    it('allows selecting values from Combobox (Language)', () => {
      cy.mount(<TestFormWrapper handleSubmit={onSaveSpy} />);
      cy.get('[data-cy=language-combobox-trigger]').click();
      cy.get('[data-cy="language-command-item-fr"]').click();
      cy.get('[data-cy=language-combobox-trigger]').should('contain.text', 'French');
    });
  });

  context('Validation (based on formSchema from ../schema)', () => {
    // Name validation (required, min length)
    it('shows error if name is empty and submits, and does not call onSave', () => {
      cy.mount(<TestFormWrapper handleSubmit={onSaveSpy} />);
      cy.get('[data-cy=profile-form-submit-button]').click();
      cy.get('[data-cy=name-form-message]').should('be.visible').and('not.be.empty');
      cy.get('@onSaveSpy').should('not.have.been.called');
    });

    it('shows error if name is too short (e.g. < 3 chars), and does not call onSave', () => {
        cy.mount(<TestFormWrapper handleSubmit={onSaveSpy} />);
        cy.get('[data-cy=name-input]').type('Bo');
        cy.get('[data-cy=profile-form-submit-button]').click();
        cy.get('[data-cy=name-form-message]').should('be.visible').and('contain.text', 'Name must be at least 3 characters long'); // Adjust message based on actual schema
        cy.get('@onSaveSpy').should('not.have.been.called');
      });


    // BirthDate validation (must be in the past)
    it('shows error if birthDate is not in the past, and does not call onSave', () => {
      cy.mount(<TestFormWrapper handleSubmit={onSaveSpy} />);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];

      cy.get('[data-cy=name-input]').type('Future Person'); // Valid name to pass that validation
      cy.get('[data-cy=birthdate-input]').type(tomorrowString);
      cy.get('[data-cy=profile-form-submit-button]').click();
      cy.get('[data-cy=birthdate-form-message]').should('be.visible').and('contain.text', 'Date of birth must be in the past'); // Adjust message
      cy.get('@onSaveSpy').should('not.have.been.called');
    });

    // Test a few other required fields (e.g., gender, relationship)
    it('shows error if gender is not selected, and does not call onSave', () => {
        cy.mount(<TestFormWrapper handleSubmit={onSaveSpy} />);
        cy.get('[data-cy=name-input]').type('Valid Name');
        // Leave gender empty
        cy.get('[data-cy=profile-form-submit-button]').click();
        cy.get('[data-cy=gender-form-message]').should('be.visible').and('not.be.empty');
        cy.get('@onSaveSpy').should('not.have.been.called');
    });
  });

  context('Successful Submission', () => {
    it('calls onSave with form data when form is valid and submitted', () => {
      cy.mount(<TestFormWrapper handleSubmit={onSaveSpy} />);
      const validData: FormValues = {
        name: 'Valid Name Test',
        gender: 'OTHER',
        birthDate: '1985-06-15',
        relationship: 'COLLEAGUE',
        heartLevel: 2,
        race: 'ORC',
        country: 'CANADA',
        language: 'es',
      };

      cy.get('[data-cy=name-input]').type(validData.name);

      cy.get('[data-cy=gender-select-trigger]').click();
      cy.get(`[data-cy="gender-select-item-${validData.gender}"]`).click();

      cy.get('[data-cy=birthdate-input]').type(validData.birthDate);

      cy.get('[data-cy=relationship-select-trigger]').click();
      cy.get(`[data-cy="relationship-select-item-${validData.relationship}"]`).click();

      cy.get('[data-cy=heartlevel-select-trigger]').click();
      cy.get(`[data-cy="heartlevel-select-item-${validData.heartLevel}"]`).click();

      cy.get('[data-cy=race-select-trigger]').click();
      cy.get(`[data-cy="race-select-item-${validData.race}"]`).click();

      cy.get('[data-cy=country-select-trigger]').click();
      cy.get(`[data-cy="country-select-item-${validData.country}"]`).click();

      cy.get('[data-cy=language-combobox-trigger]').click();
      cy.get(`[data-cy="language-command-item-${validData.language}"]`).click();

      cy.get('[data-cy=profile-form-submit-button]').click();

      cy.get('@onSaveSpy').should('have.been.calledOnce');
      // Check a few key fields in the submitted data
      cy.get('@onSaveSpy').should((spy) => {
        const submittedData = spy.getCall(0).args[0] as FormValues;
        expect(submittedData.name).to.equal(validData.name);
        expect(submittedData.gender).to.equal(validData.gender);
        expect(submittedData.birthDate).to.equal(validData.birthDate);
        expect(submittedData.heartLevel).to.equal(validData.heartLevel);
      });
    });
  });

  context('Pending State', () => {
    it('disables submit button and shows "Saving..." when isPending is true', () => {
      cy.mount(<TestFormWrapper handleSubmit={onSaveSpy} isPending={true} submitLabel="Create" />);
      cy.get('[data-cy=profile-form-submit-button]').should('be.disabled');
      cy.get('[data-cy=profile-form-submit-button]').should('contain.text', 'Saving...');
    });

    it('enables submit button and shows submitLabel when isPending is false', () => {
      cy.mount(<TestFormWrapper handleSubmit={onSaveSpy} isPending={false} submitLabel="Create" />);
      cy.get('[data-cy=profile-form-submit-button]').should('not.be.disabled');
      cy.get('[data-cy=profile-form-submit-button]').should('contain.text', 'Create');
    });
  });

  context('Submit Label', () => {
    it('displays the custom submitLabel on the button', () => {
      const customLabel = "Update Profile Now";
      cy.mount(<TestFormWrapper handleSubmit={onSaveSpy} submitLabel={customLabel} />);
      cy.get('[data-cy=profile-form-submit-button]').should('contain.text', customLabel);
    });
  });
});
```
