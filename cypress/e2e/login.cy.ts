describe('login', () => {
  beforeEach(() => {
    cy.login('NO_ROLE');
    cy.visit(Cypress.env('client_url'));
  });
  it('successfully logs in using standard auth0 flow and a user with no roles', () => {
    cy.contains('Thanks for signing up for Quizlord');
  });
});
