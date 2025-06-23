import { ProfileForm } from './profile-form';
import { useForm } from 'react-hook-form';
import { formSchema } from '../schema';
import { z } from 'zod';
import React from 'react';

describe('<ProfileForm />', () => {
  const Wrapper = () => {
    const form = useForm<z.infer<typeof formSchema>>({
      defaultValues: {
        name: '',
        gender: '',
        birthDate: '',
        relationship: '',
        heartLevel: 1,
        race: '',
        country: '',
        language: '',
      },
    });
    return (
      <ProfileForm form={form} handleSubmit={cy.stub()} submitLabel="Submit" />
    );
  };

  it('renders form fields', () => {
    cy.mount(<Wrapper />);
    cy.get('input[placeholder="Name"]').should('exist');
    cy.contains('Gender').should('exist');
  });
});
