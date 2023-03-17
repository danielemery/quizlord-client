describe('create_quiz', () => {
  describe('USER_ROLE', () => {
    beforeEach(() => {
      cy.login('USER_ROLE');
      cy.visit(Cypress.env('client_url'));
    });
    it('successfully creates a new shark quiz', () => {
      cy.get('[data-ct="quiz-upload-mobile"]').click();
    });
  });
});
