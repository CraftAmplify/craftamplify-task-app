/// <reference types="cypress" />

describe('Task List Application', () => {
  beforeEach(() => {
    cy.wait(2000)

    cy.visit('/', { timeout: 30000 })

    cy.get('body', { timeout: 10000 }).should('be.visible')
  })

  after(() => {
    cy.request('GET', 'http://localhost:3000/tasks').then((response) => {
      const tasks = response.body
      const testTaskPatterns = [
        'Test task 1',
        'Test task 2',
        'Toggle test task',
        'Test task for completion',
        'Hover test task',
        'Complete E2E testing setup',
        'Task added with Enter key'
      ]

      tasks.forEach((task: { id: string; text: string }) => {
        if (testTaskPatterns.some((pattern) => task.text.includes(pattern))) {
          cy.request('DELETE', `http://localhost:3000/tasks/${task.id}`).then(
            () => {
              cy.log(`Deleted test task: ${task.text}`)
            }
          )
        }
      })
    })
  })

  it('should verify database connectivity', () => {
    cy.request('GET', 'http://localhost:3000/tasks').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
    })
  })

  it('should load the application and display initial tasks', () => {
    cy.get('h1').should('contain', 'CraftAmplify Tasks')
    cy.get('h2').should('contain', 'Tasks')
    cy.contains('Loading tasks...').should('be.visible')
    cy.contains('Loading tasks...').should('not.exist')
    cy.get('input[placeholder="Add a new task..."]').type('Test task 1{enter}')
    cy.get('input[placeholder="Add a new task..."]').type('Test task 2{enter}')
    cy.get('.task-text').should('have.length.at.least', 2)
    cy.get('.task-text:not(.completed-task)').should('exist')
  })

  it('should display the Add Task form elements', () => {
    cy.contains('Loading tasks...').should('not.exist')
    cy.get('input[placeholder="Add a new task..."]').should('be.visible')
    cy.get('button').contains('Add').should('be.visible')
    cy.get('button').contains('Add').should('be.disabled')
  })

  it('should enable the Add button when typing in the input field', () => {
    cy.contains('Loading tasks...').should('not.exist')
    const inputField = cy.get('input[placeholder="Add a new task..."]')
    const addButton = cy.get('button').contains('Add')
    addButton.should('be.disabled')
    inputField.type('New test task')
    addButton.should('not.be.disabled')
  })

  it('should add a new task when form is submitted', () => {
    cy.contains('Loading tasks...').should('not.exist')

    const inputField = cy.get('input[placeholder="Add a new task..."]')
    const addButton = cy.get('button').contains('Add')

    cy.get('.task-text').then(($tasks) => {
      const initialCount = $tasks.length
      inputField.type('Complete E2E testing setup')
      addButton.click()
      cy.contains('Complete E2E testing setup').should('be.visible')
      cy.get('.task-text').should('have.length', initialCount + 1)
      inputField.should('have.value', '')
    })
  })

  it('should add a task when Enter key is pressed', () => {
    cy.contains('Loading tasks...').should('not.exist')

    const inputField = cy.get('input[placeholder="Add a new task..."]')

    cy.get('.task-text').then(($tasks) => {
      const initialCount = $tasks.length
      inputField.type('Task added with Enter key{enter}')
      cy.contains('Task added with Enter key').should('be.visible')
      cy.get('.task-text').should('have.length', initialCount + 1)
      inputField.should('have.value', '')
    })
  })

  it('should not add empty tasks', () => {
    cy.contains('Loading tasks...').should('not.exist')

    cy.get('.task-text').then(($tasks) => {
      const initialCount = $tasks.length
      const addButton = cy.get('button').contains('Add')
      addButton.should('be.disabled')
      cy.get('.task-text').should('have.length', initialCount)
    })
  })

  it('should display completed tasks with strikethrough', () => {
    cy.contains('Loading tasks...').should('not.exist')
    cy.get('input[placeholder="Add a new task..."]').type(
      'Test task for completion{enter}'
    )
    cy.get('.task-text')
      .contains('Test task for completion')
      .parent()
      .parent()
      .find('[data-slot="checkbox"]')
      .click()
    cy.get('.completed-task').should('exist')
    cy.get('.completed-task').first().should('have.class', 'completed-task')
  })

  it('should toggle task completion status', () => {
    cy.contains('Loading tasks...').should('not.exist')
    cy.get('input[placeholder="Add a new task..."]').type(
      'Toggle test task{enter}'
    )
    cy.get('.task-text')
      .contains('Toggle test task')
      .parent()
      .parent()
      .find('[data-slot="checkbox"]')
      .click({ force: true })

    cy.wait(2000)
    cy.get('.task-text')
      .contains('Toggle test task')
      .should('have.class', 'completed-task')
    cy.get('.task-text')
      .contains('Toggle test task')
      .parent()
      .parent()
      .find('[data-slot="checkbox"]')
      .click({ force: true })

    cy.wait(2000)
    cy.get('.task-text')
      .contains('Toggle test task')
      .should('not.have.class', 'completed-task')
  })

  it('should have hover delete button functionality', () => {
    cy.contains('Loading tasks...').should('not.exist')
    cy.get('input[placeholder="Add a new task..."]').type(
      'Hover test task{enter}'
    )
    cy.get('.task-text')
      .contains('Hover test task')
      .parent()
      .parent()
      .as('taskItem')

    cy.get('@taskItem')
      .find('.hover-delete-button')
      .should('exist')
      .and('have.class', 'hover-delete-button')

    cy.get('@taskItem')
      .find('.hover-delete-button')
      .should('be.enabled')
      .and('contain.html', 'svg')
      .find('svg')
      .should('have.attr', 'viewBox', '0 0 24 24')
  })
})
