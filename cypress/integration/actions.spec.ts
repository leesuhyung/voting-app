/// <reference types="cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8081');
  });

  // 유닛 테스트는 시간 부족으로 로그인 까지만 작성하였습니다.
  it('sign-in', () => {
    cy.get('.cyp-btn__add-vote')
      .should('be.visible')
      .click()
      .wait(500);

    cy.get('.cyp-dialog__sign-in')
      .should('be.visible')
      .find('input')
      .type('test user', { delay: 10 })
      .should('have.value', 'test user');

    cy.get('.cyp-dialog__sign-in')
      .find('.v-btn')
      .click()
      .wait(500)
      .should('not.be.visible');
  });
});
