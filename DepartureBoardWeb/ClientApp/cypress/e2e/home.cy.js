describe('Home Page Tests', () => {
  beforeEach(() => cy.visit('/'))

  it('Visits the Home Page', () => {
    cy.get('#home-title').should('have.text', " Led Departure Board ")
  })

  it('Clicks Find your station', () => {
    cy.get("#find-your-station").click({scrollBehavior: "center"})
    cy.url().should('eq', Cypress.config().baseUrl + '/#search')
  })

  it('How to User button has correct link', () => {
    cy.get('#how-to-use-button')
  })

  it('Search and Navigate to EUS. Should hide navbar after 3 seconds', () => {
    cy.get('#search-input-box')
      .focus()
      .type("Euston")


    cy.get('mat-option').contains(" London Euston - (EUS) - [GB] ").click()
    cy.get('#btnSearch').click()

    cy.url().should('contain', '/EUS')
    cy.get('#nav-menu-title').should('exist')
    cy.wait(3000)
    cy.get('#nav-menu-title').should('not.exist')
  })
})
