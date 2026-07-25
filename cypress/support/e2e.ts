import './commands'

// The mock API writes to disk, so restore the baseline before each test.
beforeEach(() => {
  cy.exec('node scripts/reset-db.mjs', { failOnNonZeroExit: false })
})

const app = window.top
if (app) {
  app.document.addEventListener('DOMContentLoaded', () => {
    const style = app.document.createElement('style')
    style.innerHTML =
      '.command-name-request, .command-name-xhr { display: none }'
    app.document.head.appendChild(style)
  })
}
