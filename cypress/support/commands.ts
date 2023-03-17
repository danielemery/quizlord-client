/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
declare namespace Cypress {
  interface Chainable {
    login(userType: 'NO_ROLE' | 'USER_ROLE' | 'ADMIN_ROLE'): Chainable<void>;
  }
}

Cypress.Commands.add('login', (userType: 'NO_ROLE' | 'USER_ROLE' | 'ADMIN_ROLE') => {
  Cypress.log({
    name: 'loginViaAuth0',
  });

  let credentials;
  switch (userType) {
    case 'NO_ROLE':
      credentials = {
        username: Cypress.env('E2E_NO_ROLE_EMAIL'),
        password: Cypress.env('E2E_NO_ROLE_PASSWORD'),
      };
      break;
    case 'USER_ROLE':
      credentials = {
        username: Cypress.env('E2E_USER_ROLE_EMAIL'),
        password: Cypress.env('E2E_USER_ROLE_PASSWORD'),
      };
      break;
    case 'ADMIN_ROLE':
      credentials = {
        username: Cypress.env('E2E_ADMIN_ROLE_EMAIL'),
        password: Cypress.env('E2E_ADMIN_ROLE_PASSWORD'),
      };
      break;
    default:
      throw new Error('Unknown user type');
  }

  cy.session(`AUTHENTICATED-${userType}`, () => {
    cy.visit(Cypress.env('client_url'));
    const loginButton = cy.get('[data-ct="login-main"]');
    loginButton.click();

    cy.origin(
      Cypress.env('AUTH0_DOMAIN'),
      { args: { username: credentials.username, password: credentials.password } },
      ({ username, password }) => {
        cy.get('[name="username"]').type(username);
        cy.get('[name="password"]').type(password);
        cy.get('[data-action-button-primary="true"]').click();
      },
    );

    cy.url().should('equal', `${Cypress.env('client_url')}/`);
  });
});
