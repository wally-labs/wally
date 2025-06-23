import JotaiProvider from './jotai-provider';
import { atom, useAtom } from 'jotai';
import * as ClerkNextjs from '@clerk/nextjs';
import React from 'react';

const counterAtom = atom(0);
const Counter = () => {
  const [count, setCount] = useAtom(counterAtom);
  return (
    <button data-cy="count" onClick={() => setCount((c) => c + 1)}>
      {count}
    </button>
  );
};

describe('<JotaiProvider />', () => {
  beforeEach(() => {
    cy.stub(ClerkNextjs, 'useUser').returns({ user: { id: '1' } } as any);
  });

  it('provides jotai store to children', () => {
    cy.mount(
      <JotaiProvider>
        <Counter />
      </JotaiProvider>
    );
    cy.get('[data-cy=count]').should('contain.text', '0').click().should('contain.text', '1');
  });
});
