import { ProfileDropdown } from './profile-dropdown';
import React from 'react';
import * as UpdateProfileModule from '../profile/update-profile';

const MockUpdateProfile = () => <div data-cy="update">Update</div>;

describe('<ProfileDropdown />', () => {
  beforeEach(() => {
    cy.stub(UpdateProfileModule, 'default').callsFake(MockUpdateProfile);
  });

  it('opens menu with update option', () => {
    cy.mount(<ProfileDropdown />);
    cy.get('button').click();
    cy.contains('Settings').should('be.visible');
    cy.get('[data-cy=update]').should('exist');
  });
});
